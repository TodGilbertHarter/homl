class Vocabulary {
	name;
	definitions;
	
	constructor(name) {
		this.name = name;
		this.definitions = {};
	}
	
	lookUp(word) {
		return this.definitions[word];
	}
	
	add(newDefinition) {
		this.definitions[newDefinition.name] = newDefinition;
	}
	
	toString() {
		return `Vocabulary [name=${this.name}]`;
	}
}

export default Vocabulary;