class LiteralToken {
	name;
	data;
	
	constructor(name,data) {
		this.name = name;
		this.data = data;
	}
	
	execute(interpreter) {
		interpreter.push(data);
		return true;
	}
}

export default LiteralToken;