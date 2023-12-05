/**
 * This simply represents an operation which executes in native
 * code (javascript presumably in this case). Hairball will simply
 * execute the given behavior when the inner interpreter encounters
 * one of these tokens.
 */

class NativeToken {
	name;
	behavior;
	
	constructor(name,behavior) {
		this.name = name;
		this.behavior = behavior;
	}
	
	execute(interpreter) {
		return this.behavior(interpreter);
	}
}

export default NativeToken;