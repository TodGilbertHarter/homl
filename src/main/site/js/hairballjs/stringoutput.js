class StringOutput {
	out;
	open;
	
	constructor(out) {
		this.out = out;
		this.open = true;
	}
	
	space() {
		if(!this.open) throw new Error("can't write to a closed output");
		this.out += ' ';
	}
	
	emit(output) {
		if(!this.open) throw new Error("can't write to a closed output");
		this.out += output;
	}
	
	close() {
		this.open = false;
	}
}

export default StringOutput;