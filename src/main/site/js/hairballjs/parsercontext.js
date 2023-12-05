class ParserContext {
	wordStream;
	dictionary;
	interpreter;
	output;
	parser;
	
	constructor(wordStream,dictionary,interpreter,output,parser) {
		this.wordStream = wordStream;
		this.dictionary = dictionary;
		this.interpreter = interpreter;
		this.output = output;
		this.parser = parser;
	}
	
	close() {
		this.output.close();
		this.wordStream.close();
	}
}

export default ParserContext;