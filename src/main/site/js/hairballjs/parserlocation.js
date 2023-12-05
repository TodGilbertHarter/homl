class ParserLocation {
	source;
	column;
	line;
	
	constructor(source,line,column) {
		this.source = source;
		this.line = line;
		this.column = column;
	}
	
	fromWordStream(wordStream) {
		this.source = wordStream.source;
		this.line = wordStream.line;
		this.column = wordStream.column;
	}
	
	makeErrorMessage(eMsg) {
		return `${eMsg} in ${this.source} at line ${this.line}, column ${this.column}`;
	}
}