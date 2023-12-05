import LiteralToken from './literaltoken.js';

class VariableToken extends LiteralToken {
	constructor(name,value) {
		super(name,value);
	}
	
	execute(interpreter) {
		interpreter.push(this);
		return true;
	}
	
	toString() {
		return `VariableToken[name=${this.name}]`;
	}
}

export default VariableToken;