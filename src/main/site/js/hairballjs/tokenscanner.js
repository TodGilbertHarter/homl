class TokenScanner {
	data; // The string we are scanning for tokens.
	pointer; // where we are in the data.
	mark; // copy of pointer we can restore later, we only need one level of mark/restore
	
	constructor(data) {
		this.data = data;
		this.pointer = 0;
		this.mark = -1;
	}

	/**
	 * Mark the current pointer.
	 */	
	mark() {
		this.mark = this.pointer;
	}
	
	/**
	 * Restore the previous mark.
	 */
	reset() {
		if(this.mark === -1) throw new Error("reset without corresponding mark")
		this.pointer = this.mark;
	}
	
	scanInput(match,sb) {
		throw new Error('not implemented yet');
		var ch;
		do {
			//TODO: figure out where this is used and if we need it.
		} while(ch !== -1);
		return false;
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
				isthereData = true;
				break;
			}
			ch = this.read();
		}
		
		while(ch != -1) {
			if(/\s/.test(ch)) {
				break;
			}
			buff.append(ch);
			ch = this.read();
		}
		return isThereData ? buff : null;
	}
	
	
}

export default TokenScanner;