class Game {
	id;
	name;
	owner;
	characters;
	players;
	
	constructor(id, name, owner, characters, players) {
		this.id = id;
		this.name = name;
		this.owner = owner;
		this.characters = characters;
		this.players = players;
	}
	
	toString() {
		return this.name + ", owner "+ this.owner;
	}
}