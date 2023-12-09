import Dictionary from './dictionary.js';
import HbVocabulary from './hairballvocabulary.js';
import Interpreter from './interpreter.js';
import Parser from './parser.js';
import ParserContext from './parsercontext.js';
import StringOutput from './stringoutput.js';
import StringWordStream from './stringwordstream.js';

class Hairball {
	static VERSION = 0.6; //figure out how to set this during build.
	rootDictionary;
	parser;
	interpreter;
	
	constructor(input,output) {
		this.rootDictionary = new Dictionary("root");
		this.rootDictionary.add(HbVocabulary);
		this.interpreter = new Interpreter();
		this.parser = new Parser();
		if(input && output)
			this.setIO(input,output);
	}
	
	setIO(wordStream, output) {
		const pcontext = new ParserContext(wordStream,this.rootDictionary,this.interpreter,output,this.parser);
		this.interpreter.parserContext = pcontext;
		this.parser.currentContext = pcontext;
	}
	
	setInput(newWordStream) {
		const output = this.parser.context.output;
		this.setIO(newWordStream,output);
	}
	
	/**
	 * This is the most straightforward way to use hairballjs, just
	 * pass it a 'program' (any string) and it will return the output
	 * resulting from running it.
	 */
	run(program) {
		const so = new StringOutput("");
		this.setIO(new StringWordStream(program),so);
		this.execute();
		return so.out;
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