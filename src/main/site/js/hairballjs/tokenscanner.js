class TokenScanner {
	data; // The string we are scanning for tokens.
	pointer; // where we are in the data.
	_mark; // copy of pointer we can restore later, we only need one level of mark/restore
	
	constructor(qqqdata) {
		this.data = qqqdata;
		this.pointer = 0;
		this._mark = -1;
	}

	/**
	 * Mark the current pointer.
	 */	
	mark() {
		this._mark = this.pointer;
	}
	
	/**
	 * Restore the previous mark.
	 */
	reset() {
		if(this._mark === -1) throw new Error("reset without corresponding mark")
		this.pointer = this._mark;
	}
	
	scanInput(match) {
		if(this.pointer < this.data.length) {
			const found = this.data.substring(this.pointer).match(`(.*)${match}`);
			if(!found) {
				this.pointer = this.data.length;
				return [false,''];
			}
			const fmatch = found[0];
			this.pointer = this.pointer + found.index + fmatch.length;
			return [true,found[1]];
		}
		return [false,''];
	}
	
	/** return the next character in the input and advance the pointer. */
	read() {
		if(this.pointer < this.data.length) {
			return this.data.charAt(this.pointer++);
		}
		return -1;
	}

	/**
	 * Is there at least one more non-whitespace character in the input?
	 */
	hasNext() {
		this.mark();
		var ch = this.read();
		while(ch !== -1) {
			if(!/\s/.test(ch)) {
				this.reset();
				return true;
			}
			ch = this.read();
		}
		this.reset();
		return false;
	}

	/**
	 * return the next whitespace-delimited token in the input, or null if no more exist.
	 */	
	next() {
		var isThereData = false;
		var buff = "";
		var ch = this.read();
		while(ch !== -1) {
			if(!/\s/.test(ch)) {
				isThereData = true;
				break;
			}
			ch = this.read();
		}
		
		while(ch != -1) {
			if(/\s/.test(ch)) {
				break;
			}
			buff += ch;
			ch = this.read();
		}
		return isThereData ? buff : null;
	}
	
	
}

export default TokenScanner;