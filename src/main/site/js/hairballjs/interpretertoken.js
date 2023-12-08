import Context from './context.js';

class InterpreterToken {
	name;
	tokens;
	
	constructor(name,tokens) {
		this.name = name;
		this.tokens = tokens ? tokens : [];
	}
	
	add(token) {
		this.tokens.push();
	}	
	
	size() {
		return this.tokens.length;
	}
	
	execute(interpreter) {
		var newContext = new Context(this.tokens,0);
		interpreter.jumpToContext(newContext);
		var ctx = interpreter.executeContext();
		interpreter.returnFromContext();
		return ctx.continueFlag;
	}
}

export default InterpreterToken;