//Create the Player class

class Player extends Creature {
  constructor(name, position, board, level = 1, items = [], gold = 0) {
    super(name, 'player/front.png', level, items, gold);
    this.attackSpeed = 2000 / level;
    this.exp = 0;
    this.position = position;
    this.board = board;
  }
  render(root) {
    this.root = root;
    root.appendChild(this.element);
    this.update();
  }
  update() {
    this.element.style.position = 'absolute';
    this.element.style.left = this.position.column * ENTITY_SIZE + 'px';
    this.element.style.top = this.position.row * ENTITY_SIZE + 'px';
    this.element.style.zIndex = '10';
  }
  move(direction) {
    switch (direction) {
      case 'left':
        if (this.position.column > 1) {
          this.position.column--;
          this.setImg('player/left.png');
        }
        break;
      case 'right':
        if (this.position.column < board.rows[1].length - 2) {
          this.position.column++;
          this.setImg('player/right.png');
        }
        break;
      case 'up':
        if (this.position.row > 1) {
          this.position.row--;
          this.setImg('player/back.png');
        }
        break;
      case 'down':
        if (this.position.row < board.rows.length - 2) {
          this.position.row++;
          this.setImg('player/front.png');
        }
        break;
    }
    player.update();
  }
  pickup(entity) {
    if (entity instanceof Item) {
      player.items.push(entity);
      playSound('loot');
      clearEntity(player.position);
    }
    if (entity instanceof Gold) {
      player.gold += entity.value;
      playSound('gold');
      clearEntity(player.position);
    }
  }
  attack(entity) {
    super.attack(entity);
    playSound('pattack');
  }
  buy(item, tradesman) {
    player.gold -= item.value;
    player.items.push(item);
    tradesman.items.splice(player.items.indexOf(item), 1);
  }
  sell(item, tradesman) {
    player.gold += item.value;
    tradesman.items.push(item);
    player.items.splice(player.items.indexOf(item), 1);
  }
  useItem(item, target) {
    item.use(target);
    player.items.splice(player.items.indexOf(item), 1);
  }
  loot(entity) {
    entity.items.forEach(function(item) {
      player.items.push(item);
    });
    entity.items = [];
    player.gold += entity.gold;
    entity.gold = 0;
    playSound('loot');
  }
  getExpToLevel() {
    return this.level * 10;
  }
  getExp(entity) {
    this.exp += entity.level * 10;
    this.levelUp();
  }
  levelUp() {
    if (this.exp >= this.getExpToLevel()) {
      this.level++;
      this.strength = this.level * 10;
      this.attackSpeed = 3000 / this.level;
      playSound('levelup');
      this.levelUp();
    }
  }
}
/*
Player class definition. Player is a Creature
- constructor
  - parameters: name (string), position (Position), board (Board), level (number), items (Item[]), gold (number)
  - Sets the attackSpeed to 2000 / level
  - Sets the exp to 0
  - Sets the position and board
- attackSpeed (number)
- exp (number)
- position (Position)
- board (Board)
- render (function)
  - parameters: root (HTMLElement)
  - Appends the element to the root (the board HTML element)
  - Updates the player position
- update (function)
  - parameters: none
  - Updates the player's HTML element position based on its position property and ENTITY_SIZE
- moveToPosition (function)
  - parameters: position (Position)
  - moves to position specified unless it is a Wall entity.
  - updates player (update method)
- move (function)
  - parameters: direction (string)
  - Sets the player image based on direction and moves to new position
- pickup (function)
  - parameters: entity (Item || Gold)
  - Adds item or gold and plays the corresponding sound ('loot' or 'gold' respectively)
- attack (function)
  - parameters: (entity)
  - calls the attack method from Creature (use super) and plays the 'pattack' sound
- buy (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- sell (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- useItem (function)
  - parameters: item (Item), target (Creature)
  - uses the item on the target and removes it from the player
- loot (function)
  - parameters: entity (Monster || Dungeon)
  - Updates gold and items for both player and dungeon or monster.
  - plays the loot sound
- getExpToLevel (function)
  - parameters: none
  - returns exp needed to level: level * 10
- getExp (function)
  - parameters: entity (Monster)
  - adds exp based on entity level (level * 10)
  - level up if enough exp. It is possible to level up multiple times at once if enough exp is earned (e.g. beat enemy level 3)
- levelUp (function)
  - parameters: entity (Monster)
  - Increments level, sets hp to max hp
  - updates strength (level * 10) and attack speed (3000 / level)
  - plays levelup sound
Example use:
new Player('Van', new Position(5, 5), new Board(10, 10), 1, [new Potion(0)]);
*/
