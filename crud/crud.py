import sys
import psycopg2
import PySide2
from PySide2.QtWidgets import *

class CRUD(QMainWindow):
	def __init__(self) -> None:

		super().__init__()

		# Global
		global connection
		global cursor
		global currentTable
		global tableNames

		# Postgres connection
		connection = psycopg2.connect(
			database = "openlacandon",
			user = "postgres",
			password = "123",
			host = "localhost",
			port = "5432"
		)
		connection.autocommit = True
		cursor = connection.cursor()

		# Get table names
		cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public';")
		tables = cursor.fetchall()
		tableNames = []
		for i in tables:
			tableNames.append(str(i[0]))

		print(tableNames)
		
		#
		self.setWindowTitle("CRUD")

		# Set main widget and layout
		self.boxMain = QVBoxLayout()
		self.widgetMain = QWidget()
		self.widgetMain.setLayout(self.boxMain)
		self.setCentralWidget(self.widgetMain)

		# Menu
		self.menu = self.menuBar()
		self.menu = self.menu.addMenu("Archivo")
		self.menu.addAction("Agregar registro", lambda: self.createWindowAU(True))
		self.menu.addAction("Cambiar tabla", self.createWindowChangeTable)

		# Set table
		global currentTable
		currentTable = "CLIENT"

		self.table = TableDB(self)
		self.table.refresh()
		self.boxMain.addWidget(self.table)

	def __del__(self) -> None:
		global connection
		connection.commit()
		connection.close()

	def createWindowChangeTable(self) -> None:
		self.windowChangeTable = WindowChangeTable(self)
		self.windowChangeTable.setWindowModality(PySide2.QtCore.Qt.ApplicationModal)
		self.windowChangeTable.show()

	def createWindowAU(self, addMode) -> None:
		self.windowAU = WindowAU(addMode, self)
		self.windowAU.setWindowModality(PySide2.QtCore.Qt.ApplicationModal)
		self.windowAU.show()

class WindowChangeTable(QWidget):
	def __init__(self, parent = None) -> None:
		self.parent = parent
		super().__init__()
		self.setWindowTitle("Cambiar tabla")

		# Set main layout
		self.boxMain = QVBoxLayout()
		self.setLayout(self.boxMain)

		# Combo box
		global tableNames
		self.comboBox = QComboBox(self)
		self.comboBox.addItems(tableNames)
		self.boxMain.addWidget(self.comboBox)

		# Ok button
		self.buttonOk = QPushButton("OK", self)
		self.buttonOk.clicked.connect(self.ok)
		self.boxMain.addWidget(self.buttonOk)

	def ok(self) -> None:
		global currentTable
		currentTable = self.comboBox.itemText(self.comboBox.currentIndex())
		print(currentTable)
		self.parent.table.refresh()
		self.close()

class WindowAU(QWidget):
	def __init__(self, addMode = True, parent = None) -> None:
		self.parent = parent
		self.addMode = addMode
		super().__init__()

		if self.addMode:
			self.setWindowTitle("Agregar registro")
		else:
			self.setWindowTitle("Modificar registro")


		# Set layout
		self.boxMain = QVBoxLayout()
		self.boxGrid = QGridLayout()
		self.setLayout(self.boxMain)
		self.boxMain.addLayout(self.boxGrid)

		# BD data
		global cursor

		bannedDataTypes = [17]
		columnNames = []
		dataTypes = []

		for i in cursor.description:
			columnNames.append(i[0])
			dataTypes.append(i[1])

		# Inputs
		self.inputs = []
		for i in range(len(columnNames)):
			self.inputs.append(QLineEdit(self))
			self.boxGrid.addWidget(QLabel(columnNames[i], self), i, 0)
			self.boxGrid.addWidget(self.inputs[i], i, 1)

			# Disable if banned type or primary key
			if (dataTypes[i] in bannedDataTypes) or (i == 0):
				self.inputs[i].setEnabled(False)

			# Fill with old value if update mode
			if not self.addMode:

				self.selectedRow = self.parent.table.selectedIndexes()[0].row()

				string = self.parent.table.item(self.selectedRow, i).text()
				if string == "None":
					self.inputs[i].setText("")
				else:
					self.inputs[i].setText(string)

		self.buttonOk = QPushButton("Aceptar", self)
		self.buttonOk.clicked.connect(self.ok)
		self.boxMain.addWidget(self.buttonOk)

	def ok(self) -> None:
		global currentTable
		global cursor

		if self.addMode:
			sql = f"INSERT INTO {currentTable} VALUES("
			for i in self.inputs:
				if (not i.isEnabled()) or (i.text() == ""):
					sql += "DEFAULT, "
				else:
					sql += f"'{i.text()}', "

			sql = sql[:-2]
			sql += ");"
		else:
			# BD data
			global cursor

			columnNames = []
			for i in cursor.description:
				columnNames.append(i[0])

			sql = f"UPDATE {currentTable} SET "
			for i in range(len(columnNames)):
				if self.inputs[i].text() == "":
					sql += f"{columnNames[i]} = DEFAULT, "
				else:
					sql += f"{columnNames[i]} = '{self.inputs[i].text()}', "
			
			sql = sql[:-2]
			sql += f" WHERE {columnNames[0]} = {self.parent.table.item(self.selectedRow, 0).text()}"

		print(sql)
		cursor.execute(sql)

		self.parent.table.refresh()
		self.close()

		

class TableDB(QTableWidget):

	def __init__(self, parent = None) -> None:
		self.parent = parent
		super().__init__(0, 0, None)

		self.verticalHeader().hide()
		self.setEditTriggers(QAbstractItemView.NoEditTriggers)
		self.setSelectionBehavior(QAbstractItemView.SelectRows)
		self.setSelectionMode(QAbstractItemView.SingleSelection)

	def refresh(self):
		global cursor
		global currentTable

		cursor.execute(f"SELECT * FROM {currentTable};")
		rows = cursor.fetchall()

		columnNames = []
		for i in cursor.description:
			columnNames.append(i[0])

		self.clear()
		self.setColumnCount(len(columnNames))
		self.setHorizontalHeaderLabels(columnNames)
		self.setRowCount(len(rows))

		#print(bytes(rows[2][8])) <-- for BYTEA data type

		for r in range(len(rows)):
			for c in range(len(columnNames)):
				self.setItem(r, c, QTableWidgetItem(str(rows[r][c])))

	def contextMenuEvent(self, event):
		menu = QMenu(self)
		delete = menu.addAction("Eliminar registro")
		update = menu.addAction("Modificar registro")
		action = menu.exec_(self.mapToGlobal(event.pos()))

		if action == update:
			self.parent.createWindowAU(False)
		elif action == delete:
			global currentTable
			global cursor

			sql = f"DELETE FROM {currentTable} WHERE ID = {self.parent.table.selectedItems()[0].text()};"
			print(sql)
			cursor.execute(sql)
			self.refresh()
		

def main():
	app = QApplication(sys.argv)
	window = CRUD()
	window.show()
	app.exec_()

if __name__ == "__main__":
	main()