import { EMIT_INSTANCE } from './tokens.js';
import ParserLocation from './parserlocation.js';

class Parser {
	interpreting = true;
	currentContext;
	emit = EMIT_INSTANCE;
	parserBehavior;
	litAccum;

	setEmit(anEmitter) {
		const oldEmitter = this.emit;
		this.emit = anEmitter;
		return oldEmitter;
	}
	
	constructor(currentContext) {
		this.currentContext = currentContext;
	}
	
	close() {
		this.currentContext.close();
	}
	
	setParserContext(newContext) {
		const temp = this.currentContext;
		this.currentContext = newContext;
		return temp;
	}
	
	parse() {
		const wordStream = this.currentContext.wordStream;
		try {
			const word = wordStream.getNextWord();
			while(word !== null) {
				const rv = this.parserBehavior(word);
				if(!rv) break;
				word = wordStream.getNextWord();
			}
			this.flushLitAccum(); 
			return this.currentContext;
		} catch(e) {
			this.makeParserExceptionMessage(e,wordStream);
			throw new Error(msg,e);
		}
	}
	
	makeParserExceptionMessage(exception, wordStream) {
		const pl = new ParserLocation(wordStream.getSource(),wordStream.line,wordStream.column);
		return pl.makeErrorMessage(exception.message);
	}
	
	interpret() {
		this.interpreting = true;
		this.parserBehavior = this.executeWord;
		return this.currentContext;
	}
	
	compile() {
		this.interpreting = false;
		this.parserBehavior = this.compileWord;
		return this.currentContext;
	}
	
	executeWord(word) {
		var rv = true;
		const definition = this.currentContext.dictionary.lookUp(word);
		if(definition !== null) {
			this.flushLitAccum();
			const runTime = definition.getRunTime();
			rv = this.currentContext.interpreter.execute(runTime);
		} else {
			if(!this.isNumber(word)) {
				this.handleLiteralWord(word);
			}
		}
		return rv;
	}
	
	isNumber(word) {
		const value = word.value;
		if(value.startsWith("#")) {
			const v = parseInt(value.subString(1));
			if(!isNaN(v)) {
				this.currentContext.interpreter.push(v);
				this.flushLitAccum();
				return true;
			} else {
				return false;
			}
		}
		return false;
	}
	
	compileWord(word) {
		var rv = true;
		const definition = this.currentContext.dictionary.lookUp(word);
		if(definition !== null) {
			this.flushLitAccum();
			const compileTime = definition.getCompileTime();
			this.currentContext.interpreter.push(definition);
			rv = this.currentContext.interpreter.execute(compileTime);
		} else {
			this.handleLiteralWord(word);
		}
	}
	
	handleLiteralWord(lWord) {
		if(this.litAccum.length > 0) {
			this.litAccum.append(' ');
		}
		this.litAccum.append(lWord.value);
	}
	
	flushLitAccum() {
		if(this.litAccum.length > 0) {
			const token = new LiteralToken("accumLiteral",this.litAccum);
			this.litAccum = "";
			if(this.interpreting) {
				token.execute(this.currentContext.interpreter);
				this.emit.execute(this.currentContext.interpreter);
			} else {
				this.currentContext.dictionary.addToken(token);
				this.currentContext.dictionary.addToken(Emit.INSTANCE);
			}
		}
	}
}

export default Parser;