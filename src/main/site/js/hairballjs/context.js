class Context {
	instructions;
	instructionPointer;
	continueFlag;

	constructor(instructions,instructionPointer) {
		this.continueFlag = true;
		this.instructions = instructions;
		this.instructionPointer = instructionPointer ? instructionPointer : 0;
	}
	
	quit() {
		this.continueFlag = false;
	}
	
	setIp(newIpValue) {
		if(newIpValue < 0 || newIpValue >= this.instructions.length)
			throw new Error("attempt to set illegal value for ip");
		var oldIp = this.instructionPointer;
		this.instructionPointer = newIpValue;
		return oldIp;
	}
	
	getNextToken() {
		return this.instructionPointer >= this.instructions.length ? null : this.instructions[this.instructionPointer++];
	}
}

export default Context;