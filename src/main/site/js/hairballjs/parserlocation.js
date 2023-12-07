class ParserLocation {
	source;
	column;
	line;
	
	constructor(source,line,column) {
		this.source = source;
		this.line = line ? line : source.lineNumber;
		this.column = column ? column : source.pointer;
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
export default ParserLocation;