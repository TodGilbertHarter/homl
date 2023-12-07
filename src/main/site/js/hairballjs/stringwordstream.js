import TokenScanner from "./tokenscanner.js";
import Word from "./word.js";

class StringReader {
	data = null;
	pointer = 0;
	open = true;
	
	constructor(data) {
		this.data = data;
		this.pointer = 0;
	}
	
	read() {
		if(this.pointer < this.data.length)
			return this.data.charAt(this.pointer++);
		return -1;
	}
	
	ready() {
		return open;
	}
	
	close() {
		this.open = false;
	}
}

class StringWordStream {
	input = "";
	reader = null;
	lineNumber = 0;
	columnNumber = 1;
	inputScanner = null;
	
	constructor(inStr) {
		this.inputScanner = new TokenScanner(input);
		this.reader = new StringReader(inStr);
	}

	getNextWord() {
		const next = this.getNext();
		return next == null ? null : new Word(next);
	}
	
	getNext() {
		if(this.inputScanner.hasNext()) {
			return this.inputScanner.next();
		} else {
			this.input = this._readLine(this.reader);
			if(this.input != null) {
				this.inputScanner = new TokenScanner(this.input);
				if(this.inputScanner.hasNext()) {
					return this.inputScanner.next(); 
				}
				return "\n\n"; // return the double newline token.
			} else {
				return null;
			}
		}
	}
	
	_readLine(reader) {
		var isThereData = false;
		var buff = "";
		var ch = reader.read();
		while(ch !== -1) {
			isThereData = true;
			buff += ch;
			if(ch === "\n") {
				this.lineNumber++;
				return buff;
			}
			ch = reader.read();
		}
		return isThereData ? buff : null;
	}
	
	hasMoreTokens() {
		const isHasNext = this.inputScanner.hasNext();
		const rready = this.reader.ready();
		return isHasNext || rready;
	}
	
	getToMatching(match) {
		var sb = "";
		var more = this.getNext();
		var first = true;
		while(more !== match) {
			if(!first) sb += ' ';
			first = false;
			sb += more;
			more = this.getNext();
			if(more == null) break;
		}
		return sb;
	}
	
	getToDelimiter(match) {
		var [hasMatch,sb] = this.inputScanner.scanInput(match);
		if(hasMatch) return sb;
		var line = this._readLine(this.reader);
		while(line != null) {
			this.inputScanner = new TokenScanner(line);
			var qb = "";
			[hasMatch,qb] = this.inputScanner.scanInput(match);
			sb += qb;
			if(hasMatch) return sb;
			line = this.readLine(this.reader);
		}
		return null;
	}
	
	close() {
		if(this.reader != null) this.reader.close();
	}
	
	getSource() {
		return "javascript string";
	}
	
	get column() {
		return this.inputScanner.pointer;
	}
	
	getCurrentLocation() {
		return ".";
	}
}

export default StringWordStream;