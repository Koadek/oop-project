//Create the Position and Board class

/*
Position class definition
- constructor
  - parameters: row (number), column (number)
- row (number): index of the board row 
- column (number): index of the board column
Example use:
const position = new Position(0, 0); // row 0, column 0
*/
class Position {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
}

/*
Board class definition
- constructor
  - parameters: rows (number), columns (number)
  - Creates the array of rows and fills them with Wall and Grass entities.
- rows (array): 2D Array of rows. Each row is an array of Entity objects.
- root (HTMLElement) - HTML element in which the board elements are appended
- render (function)
  - parameters: root (HTMLElement)
  - Sets the root property
  - Used to create the HTML elements for the board and append the elements to the root element.
- setEntity (function)
  - parameters: entity (Entity), position (Position)
  - Sets the Entity object at the specified position and updates the Board (using the update method)
  - Replaces the HTML img element for the specified position with the entity img element
- getEntity (function)
  - parameters: position (Position)
  - returns the Entity at the specified position
Example use:
const board = new Board(20, 20); // Creates a Board object with 20 rows, 20 columns, Wall entities (at the edges) and Grass entities.
*/

class Board {
  constructor(rows, columns) {
    this.rows = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
          row.push(new Wall());
        } else {
          row.push(new Grass());
        }
      }
      this.rows.push(row);
    }
  }
  render(root) {
    this.root = root;
    for (let i = 0; i < this.rows.length; i++) {
      let row = document.createElement('div');
      row.className = 'row';
      root.appendChild(row);
      for (let j = 0; j < this.rows[i].length; j++) {
        row.appendChild(this.rows[i][j].element);
      }
    }
  }
  update(position) {
    const oldCHild = this.root.childNodes[position.row].childNodes[
      position.column
    ];
    this.root.childNodes[position.row].replaceChild(
      this.getEntity(position).element,
      oldCHild
    );
  }
  setEntity(entity, position) {
    this.rows[position.row][position.column] = entity;
    this.update(position);
  }
  getEntity(position) {
    return this.rows[position.row][position.column];
  }
}
