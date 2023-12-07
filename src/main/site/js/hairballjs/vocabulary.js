class Vocabulary {
	name;
	definitions;
	
	constructor(name) {
		this.name = name;
		this.definitions = {};
	}
	
	lookUp(word) {
		return this.definitions[word.value];
	}
	
	add(newDefinition) {
		this.definitions[newDefinition.name.value] = newDefinition;
	}
	
	toString() {
		return `Vocabulary [name=${this.name}]`;
	}
}

export default Vocabulary;