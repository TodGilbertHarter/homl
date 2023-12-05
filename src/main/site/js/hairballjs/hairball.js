import Dictionary from './dictionary.js';
import HairballVocabulary from './hairballvocabulary.js';
import Interpreter from './interpreter.js';
import Parser from './parser.js';
import ParserContext from './parsercontext.js';

class Hairball {
	static VERSION = 0.6; //figure out how to set this during build.
	rootDictionary;
	parser;
	interpreter;
	
	constructor(input,output) {
		const hbVocab = HairballVocabulary.create();
		this.rootDictionary = new Dictionary("root");
		this.rootDictionary.add(hbVocab);
		this.interpreter = new Interpreter();
		this.parser = new Parser();
		if(input && output)
			this.setIO(input,output);
	}
	
	setIO(wordStream, output) {
		const pcontext = new ParserContext(wordStream,this.rootDictionary,this.interpreter,output,this.parser);
		this.interpreter.parserContext(pcontext);
		this.parser.setParserContext(pcontext);
	}
	
	setInput(newWordStream) {
		const output = this.parser.context.output;
		this.setIO(newWordStream,output);
	}
	
	execute() {
		this.parser.interpret();
		return this.parser.parse();
	}
	
	getParamStack() {
		return this.interpreter.parameterStack;
	}
	
	getReturnStack() {
		return this.interpreter.returnStack;
	}
	
	getInterpreterContext() {
		return this.interpreter.currentContext;
	}
}

export default Hairball;