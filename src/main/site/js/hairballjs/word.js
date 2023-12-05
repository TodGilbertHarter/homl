class Word {
	value;
	
	constructor(value) {
		this.value = value;
	}
	
	matches(othervalue) {
		return this.value === othervalue;
	}
}

export default Word;