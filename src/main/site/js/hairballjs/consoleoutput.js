class ConsoleOutput {
	open;
	
	constructor() {
		this.open = true;
	}
	
	space() {
		if(!this.open) throw new Error("can't write to a closed output");
		console.log(' ');
	}
	
	emit(output) {
		if(!this.open) throw new Error("can't write to a closed output");
		console.log(output);
	}
	
	close() {
		this.open = false;
	}
}

export default ConsoleOutput;