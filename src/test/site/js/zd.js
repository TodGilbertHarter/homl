/**
 * This software is Copyright (C) 2022 Tod G. Harter. All rights reserved.
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
 * ZD is zero-dependency in-browser unit testing. Load a page containing
 * your unit tests, and let them run! Simply include this module as you would
 * any other run-time dependency.
 */

/**
 * Custom exception class for assertions to throw.
 */
class TestFailure extends Error {
	constructor(message) {
		super(message);
		this.name = 'TestFailure';
	}
}

/**
 * This is a basic primitive assertion. If the argument is true, it will pass,
 * and if the argument is false, it will throw a test failure. More complex
 * assertions can be built on top of this.
 */

function assert(asserted,label) {
	if(!asserted) {
		throw new TestFailure(label);
	}
}

const tests = [];
function initializeTest(label) {
	tests.push(label);
}

function record(label) {
	//TODO: something
}

function recordFailure(label,exception) {
	//TODO: something
}

function plan(label,test) {
	try {
		initializeTest(label);
		test();
		record(label);
	} catch (e) {
		recordFailure(label,e);
	}
}

export { TestFailure, assert, plan };
