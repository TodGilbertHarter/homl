/**
 * This software is Copyright (C) 2021 Tod G. Harter. All rights reserved.
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
import Hairball from './hairballjs/hairball.js';
import rpgDice from 'rpgdice';
import * as TOKENS from './hairballjs/tokens.js';
import Definition from './hairballjs/definition.js';
import Word from './hairballjs/word.js';
import NativeToken from './hairballjs/nativetoken.js';
import Vocabulary from './hairballjs/vocabulary.js';

/**
 * The purpose of this class is to supply an isolated context which will hold
 * references to elements used in user-configured functionality so that things
 * like hairball and the dice roller can reference parts of characters, games, 
 * and other relevant information without problems. It is also a home for a single
 * unversally accessible hairball interpreter.
 */

var gameContext;

/** Build a hairball vocabulary to go along with game play. We can define anything that does 'site stuff', etc. here. */
const ROLL = new NativeToken('Roll_RT',(interpreter) => {
	const de = interpreter.pop();
	const value = gameContext.rollDice(de);
	interpreter.push(value);
	return true;
});

const REROLL = new NativeToken('Reroll_RT',(interpreter) => {
	const value = gameContext.reroll();
	interpreter.push(value);
	return true;
});

const RENDER = new NativeToken('Render_RT',(interpreter) => {
	const de = interpreter.pop();
	const value = gameContext.render(de);
	interpreter.push(value);
	return true;
});

const LASTROLL = new NativeToken('Lastroll_RT',(interpreter) => {
	const value = gameContext.lastRoll;
	interpreter.push(value);
	return true;
});


class Context {
	hairball;
	lastRoll;
	
	static makeHairball() {
		const hairball = new Hairball();
		hairball.run("/NEWVOCABULARY /HOMLGAME /VOCABULARY /HOMLGAME /CURRENT /VOCABULARY /HOMLGAME /ACTIVE")
		const dictionary = hairball.parser.currentContext.dictionary;

		dictionary.addDefinition(new Definition(new Word("/ROLL"),TOKENS.COMPILE_INSTANCE,ROLL));
		dictionary.addDefinition(new Definition(new Word("/REROLL"),TOKENS.COMPILE_INSTANCE,REROLL));
		dictionary.addDefinition(new Definition(new Word("/LASTROLL"),TOKENS.COMPILE_INSTANCE,LASTROLL));
		dictionary.addDefinition(new Definition(new Word("/RENDER"),TOKENS.COMPILE_INSTANCE,RENDER));
		
		/* 
Lets try rendering that last one: /ROLL" (3d6+4)/2"/ /RENDER /.
		* Run an initialization program. This can provide other nicer definitions or basically anything
		* at all. It should probably be externalized at some point, but I'm not really going to attempt
		* that today...
		*/
		hairball.run(`
			/: /ROLL" /" /ROLL /SPACE /. /SPACE :/
			/: /.ROLL /LASTROLL /RENDER /. :/
			`);
		return hairball;
	}
	
	constructor() {
		this.hairball = Context.makeHairball();		
	}
	
	runHairball(program) {
		return this.hairball.run(program);
	}
	
	/**
	 * Compile a macro set. The result will be a vocabulary named
	 * after the set, with definitions named after the macros in the
	 * set.
	 */
	compileMacroSet(macroSet) {
		const vocabName = macroSet.name;
		const dict = this.hairball.getDictionary();
		let vocab = dict.findVocabulary(vocabName);
		if(!vocab || (vocab.ownerId === macroSet.ownerId) ) { // doesn't exist or is owned by same owner as macroset
			vocab = new Vocabulary(vocabName);
			vocab.ownerId = macroSet.ownerId; // so we can keep track of who defined what
			macroSet.macros.forEach((macro) => {
				dict.makeCurrent(vocab);
				this.runHairball(`/: ${macro.name} ${macro.source} :/`);
			});
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Role some dice! These functions can supply modifiers etc from 
	 * the context. 
	 */	
	rollDice(diceStr) {
		this.lastDiceExpr = rpgDice.parse(diceStr);
		return this.reroll();
	}
	
	reroll() { 
		this.lastRoll = rpgDice.eval(this.lastDiceExpr,this); 
		return this.lastRoll.value;
	}
	
	renderLastRoll() {
		return this.render(this.lastRoll);
	}
	
	render(roll) {
		return roll.render();
	}
}

gameContext = new Context();

export { Context, gameContext };