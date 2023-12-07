class Interpreter {
	parameterStack;
	returnStack;
	currentContext;
	parserContext;
	
	constructor() {
		this.parameterStack = [];
		this.returnStack = [];
	}
	
	push(item) {
		this.parameterStack.push(item);
	}
	
	depth() {
		return this.parameterStack.length;
	}
	
	rDepth() {
		return this.returnStack.length;
	}
	
	pop() {
		return this.parameterStack.pop();
	}
	
	peek() {
		return this.parameterStack[this.parameterStack.length - 1];
	}
	
	rPop() {
		return this.returnStack.pop();
	}
	
	rPush(item) {
		this.returnStack.push(item);
	}
	
	jumpToContext(newContext) {
		this.rPush(this.currentContext);
		this.currentContext = newContext;
	}
	
	branchToContext(newContext) {
		this.currentContext = newContext;
	}
	
	setIp(newValue) {
		return this.currentContext.setIp(newValue);
	}
	
	getIp() {
		return this.currentContext.instructionPointer;
	}
	
	returnFromContext() {
		var previous = this.currentContext;
		this.currentContext = this.rPop();
		return previous;
	}
	
	executeNextToken() {
		if(this.currentContext == null) return null; // End of program
		var nextToken = this.currentContext.getNextToken();
		var tokenReturnValue = false;
		if(nextToken != null) {
			tokenReturnValue = nextToken.execute(this);
		}
		return tokenReturnValue ? nextToken : null;
	}
	
	executeContext() {
		while(this.executeNextToken() != null) { }
		return this.currentContext;
	}
	
	start(context) {
		this.returnStack = [];
		this.parameterStack = [];
		this.currentContext = null;
		this.jumpToContext(context);
		return this.executeContext();
	}
	
	execute(token) {
		return token.execute(this);
	}
}

export default Interpreter;