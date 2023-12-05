import Vocabulary from './vocabulary.js';
import InterpreterToken from './interpretertoken.js';
import Definition from './definition.js';

class EmptyDefinition {
	name;
	compileTime;
	runTime;
	
	constructor(name) {
		this.name = name;
		this.compileTime = [];
		this.runTime = [];
	}
	
	addCompileToken(token) {
		this.compileTime.push(token);
	}
	
	addRuntimeToken(token) {
		this.runTime.push(token);
	}
}

class Dictionary {
	name;
	vocabularies;
	currentDefinition;
	doerDoes;
	doer;
	currentVocabulary;
	vocabularyList;
	
	constructor(name) {
		this.name = name;
		this.vocabularies = [];
		this.currentDefinition = new EmptyDefinition();
		vocabularyList = {};
		this.does();
	}
	
	findVocabulary(name) {
		return this.vocabularyList[name];
	}
	
	addToVocabularyList(vocabulary) {
		this.vocabularyList[vocabulary.name] = vocabulary;
	}
	
	createVocabulary(name) {
		const nVocab = new Vocabulary(name);
		this.addVocabularyToList(nVocab);
		return nVocab;
	}
	
	getCurrentDefinition() {
		var rtToken = null;
		if(this.currentDefinition.runTime.length > 1) {
			const rtList = [...(this.currentDefinition.runTime)];
			rtToken = new InterpreterToken(this.currentDefinition.name,rtList);
		} else {
			if(this.currentDefinition.runTime.length === 1) {
				rtToken = this.currentDefinition.runTime[0];
			}
		}
		
		const ctToken = null;
		if(this.currentDefinition.compileTime.length > 1) {
			const ctList = [...(this.currentDefinition.compileTime)];
			ctToken = new InterpreterToken(this.currentDefinition.name,ctList);
		} else {
			if(this.currentDefinition.compileTime.length === 1) {
				ctToken = this.currentDefinition.compileTime[0];
			}
		}
		
		const def = new Definition(this.currentDefinition.name,ctToken,rtToken);
		return def;
	}
	
	doer() {
		this.doerDoes = this.addToCompileTime;
		this.doer = true;
	}
	
	does() {
		this.doerDoes = this.addToRuntime;
		this.doer = false;
	}
	
	isDoer() { return this.doer; }
	
	addToken(token) {
		this.doerDoes.accept(token);
	}
	
	create(name) {
		this.currentDefinition.name = name;
	}
	
	addToCompileTime(token) {
		this.currentDefinition.addCompileToken(token);
	}
	
	addToRuntime(token) {
		this.currentDefinition.addToRuntime(token);
	}
	
	define() {
		if(this.currentDefinition.compileTime.length == 0) {
			const compile = new NativeToken("compile",(interpreter) => {
				const ourDef = interpreter.pop();
				const rToken = ourDef.runTime;
				interpreter.parserContext.dictionary.addToken(rToken);
				return true;
			});
			currentDefinition.addCompileToken(compile);
		}
		const def = this.currentDefinition;
		this.add(def);
		this.currentDefinition = new EmptyDefinition();
		return def;
	}
	
	add(vocabulary) {
		this.addToVocabularyList(vocabulary);
		this.vocabularies.unshift(vocabulary);
		if(this.currentVocabulary === null) this.makeCurrent(vocabulary);
	}
	
	makeCurrent(vocabulary) {
		this.addToVocabularyList(vocabulary);
		const old = this.currentVocabulary;
		this.currentVocabulary = vocabulary;
		return old;
	}
	
	here() { return this.currentDefinition.runTime.length; }
	
	getCurrent() { return this.currentVocabulary; }
	
	remove(vocabulary) { 
		if(vocabulary) {
			if(this.vocabularies.includes(vocabulary)) {
				while(vocabularies.length !== 0) {
					const popped = this.vocabularies.unshift();
					if(popped == vocabulary) return;
				}
			}
		} else {
			this.vocabularies.shift(); 
		}
	}
	
	lookUp(word) {
		this.vocabularies.forEach((vocabulary) => {
			const def = vocabulary.lookUp(word);
			if(def !== null) return def;
		});
		return null;
	}
	
	addDefinition(definition) {
		this.currentVocabulary.add(definition);
	}
	
	putToken(token,pc) {
		this.currentDefinition.runTime[pc] = token;
	}
	
	getActiveVocabularies() {
		var results = "Vocabulary Stack:\n";
		this.vocabularies.forEach(vocabulary => {
			results += vocabulary.toString() + "\n";
		});
		results += "Current Vocabulary:\n";
		results += this.CurrentVocabulary.toString() + "\n";
		return results;
	}
}

export default Dictionary;