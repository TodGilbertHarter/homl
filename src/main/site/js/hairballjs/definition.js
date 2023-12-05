class Definition {
	name;
	compileTime;
	runTime;
	
	constructor(name, compileTime, runTime) {
		this.name = name;
		this.compileTime = compileTime;
		this.runTime = runTime;
	}
}

export default Definition;