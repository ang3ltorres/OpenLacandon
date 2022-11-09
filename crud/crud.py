import sys
import psycopg2
import PySide2
from PySide2.QtWidgets import *

views = []
querys = []


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

		#Search menu
		self.searchMenu = self.menuBar()
		self.searchMenu = self.searchMenu.addMenu ("Busqueda")
		self.searchMenu.addAction ("Nueva Búsqueda",lambda: self.createWindowSearch())
		
		#views
		self.recentQuerys = self.searchMenu.addMenu ("Busquedas recientes")
		self.recentQuerys.addAction("Vacio")

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

	def createWindowSearch(self) -> None:
		self.windowSearch = WindowSearch(self)
		self.windowSearch.setWindowModality(PySide2.QtCore.Qt.ApplicationModal)
		self.windowSearch.show()

	#def searchList (self) -> None:

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

class WindowSearch(QWidget) :
	def __init__ (self, parent = None) -> None:
		self.parent = parent
		self.recentQuerys = self.parent.recentQuerys
		super().__init__()
		self.setWindowTitle("Busqueda")

		# Set layout
		self.boxMain = QVBoxLayout()
		self.boxGrid = QGridLayout()
		self.setLayout(self.boxMain)
		self.boxMain.addLayout(self.boxGrid)

		#set combo box
		self.columnNames = []

		operators = [
			'(Clear)',
			'<',
			'>',
			'<=',
			'>=',
			'=',
			'!='
		]

		boolean = [
			'(Clear)',
			'True',
			'False'
		]

		self.dataTypes = []

		self.strInput = []

		self.comboOperator = []

		self.comboBool = []

		for i in cursor.description:
			self.columnNames.append(i[0])
			self.dataTypes.append(i[1])

			comboBoxOperators = QComboBox ()
			comboBoxOperators.addItems (operators)
			self.comboOperator.append(comboBoxOperators)

			comboBoxBool = QComboBox()
			comboBoxBool.addItems (boolean)
			self.comboBool.append(comboBoxBool)
			
			self.strInput.append(QLineEdit(self))
		
		
		for i in range(0,len(self.columnNames)):
			self.boxGrid.addWidget(QLabel(self.columnNames[i], self), i, 0)

			if (self.dataTypes[i] == 1043):
				self.boxGrid.addWidget(self.strInput[i], i, 1)
			
			elif (self.dataTypes[i] == 16):
				self.boxGrid.addWidget(self.comboBool[i], i, 1)
				self.strInput[i].setEnabled(False)
				self.boxGrid.addWidget(self.strInput[i], i, 1)
			
			else:
				self.boxGrid.addWidget(self.comboOperator[i], i, 1)
				self.boxGrid.addWidget(self.strInput[i], i, 2)

		# Search button
		self.buttonSearch = QPushButton("Buscar", self)
		self.buttonSearch.clicked.connect(self.search)
		self.boxMain.addWidget(self.buttonSearch)

	def closeEvent(self, event):
		self.recentQuerys.clear()

		for i in range(len(querys)):
			self.recentQuerys.addAction(querys[i], lambda: self.clickedRecentQuery(views[i]))

	def clickedRecentQuery(self, query):
		print(query)
		self.windowTableDBCustom = WindowTableDBCustom(query, self)
		self.windowTableDBCustom.setWindowModality(PySide2.QtCore.Qt.ApplicationModal)
		self.windowTableDBCustom.show()

	def search(self) -> None:

		empty = True
		
		global currentTable
		global cursor
		query = f"SELECT * FROM {currentTable} WHERE "
		
		# Ejemplo
		for i in range(len(self.columnNames)):
			
			# string
			if (self.dataTypes[i] == 1043):
			
				if (self.strInput[i].text() != ""):
					empty = False
					query += f"{self.columnNames[i]} LIKE '%{self.strInput[i].text()}%' AND "

				continue

			# bool
			if (self.dataTypes[i] == 16):

				if (self.comboBool[i].currentIndex() != 0):
					empty = False
					query += f"{self.columnNames[i]} = {self.comboBool[i].itemText(self.comboBool[i].currentIndex())} AND "

				continue

			# number
			if (self.comboOperator[i].currentIndex() != 0):
				empty = False
				query += f"{self.columnNames[i]} {self.comboOperator[i].itemText(self.comboOperator[i].currentIndex())} {self.strInput[i].text()} AND "



		# Custom table
		if (not empty):
			query = query[:-5]
			query += ";"
			

			CreateView = f"CREATE OR REPLACE VIEW view{len(views)} AS {query}"
			view = f"SELECT * FROM view{len(views)}"

			views.append(view) 
			querys.append(query)

			cursor.execute(CreateView)

			print(query,"\n",CreateView,views)

			self.windowTableDBCustom = WindowTableDBCustom(query, self)
			self.windowTableDBCustom.setWindowModality(PySide2.QtCore.Qt.ApplicationModal)
			self.windowTableDBCustom.show()

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

class TableDBCustom(QTableWidget):

	def __init__(self, parent = None) -> None:
		self.parent = parent
		super().__init__(0, 0, None)

		self.verticalHeader().hide()
		self.setEditTriggers(QAbstractItemView.NoEditTriggers)
		self.setSelectionBehavior(QAbstractItemView.SelectRows)
		self.setSelectionMode(QAbstractItemView.SingleSelection)

		self.refresh()

	def refresh(self):
		global cursor
		global currentTable

		# Take the query string from parent
		sqlQuery = self.parent.sqlQuery
		cursor.execute(sqlQuery)
		rows = cursor.fetchall()

		columnNames = []
		for i in cursor.description:
			columnNames.append(i[0])

		self.clear()
		self.setColumnCount(len(columnNames))
		self.setHorizontalHeaderLabels(columnNames)
		self.setRowCount(len(rows))

		for r in range(len(rows)):
			for c in range(len(columnNames)):
				self.setItem(r, c, QTableWidgetItem(str(rows[r][c])))

class WindowTableDBCustom(QWidget):
	def __init__(self, sqlQuery, parent = None) -> None:
		self.parent = parent
		self.sqlQuery = sqlQuery
		super().__init__()    
		self.setWindowTitle("Resultado de busqueda")

		# Set layout
		self.boxMain = QVBoxLayout()
		self.setLayout(self.boxMain)

		# Add custom table
		self.boxMain.addWidget(TableDBCustom(self))


def main():
	app = QApplication(sys.argv)
	window = CRUD()
	window.show()
	app.exec_()

if __name__ == "__main__":
	main()