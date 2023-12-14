/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Everything related to macros goes in this module.
 */

/**
 * A type of Hairball token which consists of hairball source
 * code. The main purpose for this would be to use it as a 
 * system to alias source file includes, wrapping them in a
 * definition and managing them in a dictionary, and being able
 * to apply them. Coupled with a way to instantiate them from
 * things like files this could be a powerful capability, though
 * I am not sure it has tons of use in the current implementation
 * of Hairballjs. 
 */
import Parser from './parser.js';
import Interpreter from './interpreter.js';
import StringWordStream from './stringwordstream.js';
import ParserContext from './parsercontext.js';

export default class MacroToken {
	 name;
	 code;
	 
	 MacroToken(name,code) {
		 this.name = name;
		 this.code = code;
	 }
	 
	 execute(interpreter) {
		const pc = interpreter.parserContext;
		const ws = new StringWordStream(code);
		const ni = new Interpreter();
		const np = new Parser();
		const nc = new ParserContext(ws,pc.dictionary,interpreter,pc.output,np);
		ni.parserContext = nc;
		np.currentContext = nc;
 		np.interpret();
		this.parser.parse();
		return true;
	 }
 }
 