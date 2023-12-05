import Vocabulary from './vocabulary.js';
import { COMPILE_INSTANCE } from './tokens.js';

const defList = [];
	
function create() {
	const hbVocab = new Vocabulary("HAIRBALL");
	defList.forEach((def) => {
		hbVocab.push(def);
	});
	
	
	
	return hbVocab;
}

const HbVocabulary = create();

export default HbVocabulary;