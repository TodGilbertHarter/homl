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
		var newContext = new Context(tokens,0);
		interpreter.jumpToContext(newContext);
		var ctx = interpreter.executeContext();
		interpreter.returnFromContext();
		return ctx.isContinue();
	}
}

export default InterpreterToken;