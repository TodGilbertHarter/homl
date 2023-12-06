import Vocabulary from './vocabulary.js';
import * as TOKENS from './tokens.js';
import Definition from './definition.js';
import Word from './word.js';

const defList = [];
	
function create() {
	const hbVocab = new Vocabulary("HAIRBALL");
	defList.forEach((def) => {
		hbVocab.push(def);
	});
	
	defList.push(new Definition(new Word("/HEAR!"),TOKENS.COMPILE_INSTANCE,TOKENS.COMPILETOKEN_INSTANCE));
	defList.push(new Definition(new Word("/[COMPILE]"),TOKENS.COMPILETOKEN_INSTANCE,TOKENS.COMPILETOKEN_INSTANCE));
	defList.push(new Definition(new Word("/RUNTIME"),TOKENS.COMPILE_INSTANCE,TOKENS.GETRUNTIME_INSTANCE));
	defList.push(new Definition(new Word("/!"),TOKENS.COMPILE_INSTANCE,TOKENS.STORE_INSTANCE));
	defList.push(new Definition(new Word("/EXECUTE"),TOKENS.COMPILE_INSTANCE,TOKENS.EXECUTE_INSTANCE));
	defList.push(new Definition(new Word("/."),TOKENS.COMPILE_INSTANCE,TOKENS.EMIT_INSTANCE));
	defList.push(new Definition(new Word("/W"),TOKENS.COMPILE_INSTANCE,TOKENS.WORD_INSTANCE));
	defList.push(new Definition(new Word("/W2L"),TOKENS.COMPILE_INSTANCE,TOKENS.WORDLITERAL_INSTANCE));
	defList.push(new Definition(new Word("L2W"),TOKENS.COMPILE_INSTANCE,TOKENS.MAKEWORD_INSTANCE));
	defList.push(new Definition(new Word("/TOKEN"),TOKENS.COMPILE_INSTANCE,TOKENS.SLASHTOKEN_INSTANCE));
	defList.push(new Definition(new Word("/COMPILING"),TOKENS.COMPILING_INSTANCE,TOKENS.COMPILING_INSTANCE));
	defList.push(new Definition(new Word("/INTERPRETING"),TOKENS.INTERPRETING_INSTANCE,TOKENS.INTERPRETING_INSTANCE));
	defList.push(new Definition(new Word("/DEPTH"),TOKENS.COMPILE_INSTANCE,TOKENS.DEPTH_INSTANCE));
	defList.push(new Definition(new Word("/DROP"),TOKENS.COMPILE_INSTANCE,TOKENS.DROP_INSTANCE));
	defList.push(new Definition(new Word("/DUP"),TOKENS.COMPILE_INSTANCE,TOKENS.DUP_INSTANCE));
	defList.push(new Definition(new Word("/SWAP"),TOKENS.COMPILE_INSTANCE,TOKENS.SWAP_INSTANCE));
	defList.push(new Definition(new Word("/ROT"),TOKENS.COMPILE_INSTANCE,TOKENS.ROT_INSTANCE));
	defList.push(new Definition(new Word("/PICK"),TOKENS.COMPILE_INSTANCE,TOKENS.PICK_INSTANCE));
	defList.push(new Definition(new Word("//"),TOKENS.COMPILE_INSTANCE,TOKENS.NOOP_INSTANCE));
	defList.push(new Definition(new Word("/DOES"),TOKENS.COMPILE_INSTANCE,TOKENS.DOESCT_INSTANCE));
	defList.push(new Definition(new Word("/DOER"),TOKENS.DOER_INSTANCE,TOKENS.NOOP_INSTANCE));
	defList.push(new Definition(new Word("/:"),TOKENS.COMPILE_INSTANCE,TOKENS.COLON_INSTANCE));
	defList.push(new Definition(new Word('/"'),TOKENS.COMPILE_INSTANCE,TOKENS.QUOTE_INSTANCE));
	defList.push(new Definition(new Word("/MAKELITERAL"),TOKENS.COMPILE_INSTANCE,TOKENS.MAKELITERAL_INSTANCE));
	defList.push(new Definition(new Word("/[MAKELITERAL]"),TOKENS.BRACKETMAKELITERALBRACKET_INSTANCE,TOKENS.MAKELITERAL_INSTANCE));
	defList.push(new Definition(new Word("/ALLOT"),TOKENS.COMPILE_INSTANCE,TOKENS.ALLOT_INSTANCE));
	defList.push(new Definition(new Word("/NUM"),TOKENS.COMPILE_INSTANCE,TOKENS.NUMRT_INSTANCE));
	defList.push(new Definition(new Word("/CONSTANT"),TOKENS.COMPILE_INSTANCE,TOKENS.CONSTANTRT_INSTANCE));
	defList.push(new Definition(new Word("/VARIABLE"),TOKENS.COMPILE_INSTANCE,TOKENS.VARIABLERT_INSTANCE));
	defList.push(new Definition(new Word("/V@"),TOKENS.COMPILE_INSTANCE,TOKENS.LFETCHRT_INSTANCE));
	defList.push(new Definition(new Word("/V!"),TOKENS.COMPILE_INSTANCE,TOKENS.VSTORERT_INSTANCE));
	defList.push(new Definition(new Word("/ABORT"),TOKENS.COMPILE_INSTANCE,TOKENS.ABORT_INSTANCE));
	defList.push(new Definition(new Word(":/"),TOKENS.COLONSLASHCT_INSTANCE,TOKENS.COLONSLASHRT_INSTANCE));
	defList.push(new Definition(new Word('/["'),TOKENS.SLASHBRACKETQUOTECT_INSTANCE,TOKENS.SBQRTERROR_INSTANCE));
	defList.push(new Definition(new Word("/DELIMITED"),TOKENS.COMPILE_INSTANCE,TOKENS.GETTOMATCHING_INSTANCE));
	defList.push(new Definition(new Word('/."'),TOKENS.DOTQUOTECT_INSTANCE,TOKENS.DOTQUOTERT_INSTANCE));
	defList.push(new Definition(new Word('"/'),TOKENS.QUOTESLASHRT_INSTANCE,TOKENS.QUOTESLASHRT_INSTANCE));
	defList.push(new Definition(new Word("/UUID"),TOKENS.COMPILE_INSTANCE,TOKENS.UUID_INSTANCE));
	defList.push(new Definition(new Word("/."),TOKENS.COMPILE_INSTANCE,TOKENS.EMIT_INSTANCE));
	defList.push(new Definition(new Word("/.S"),TOKENS.COMPILE_INSTANCE,TOKENS.DOTS_INSTANCE));
	defList.push(new Definition(new Word("/QUIT"),TOKENS.COMPILE_INSTANCE,TOKENS.QUIT_INSTANCE));
	defList.push(new Definition(new Word("/*"),TOKENS.COMMENTIN_INSTANCE,TOKENS.COMMENTIN_INSTANCE));
	defList.push(new Definition(new Word("*/"),TOKENS.COMMENTOUT_INSTANCE,TOKENS.COMMENTOUT_INSTANCE));
	defList.push(new Definition(new Word("/SPACE"),TOKENS.COMPILE_INSTANCE,TOKENS.SPACE_INSTANCE));
	defList.push(new Definition(new Word("/@OUTPUT"),TOKENS.COMPILE_INSTANCE,TOKENS.FETCHOUTPUT_INSTANCE));
	defList.push(new Definition(new Word("/OUTPUT"),TOKENS.COMPILE_INSTANCE,TOKENS.SETOUTPUT_INSTANCE));
	defList.push(new Definition(new Word("/CLOSE"),TOKENS.COMPILE_INSTANCE,TOKENS.CLOSEOUTPUT_INSTANCE));
	defList.push(new Definition(new Word("/WRITE"),TOKENS.COMPILE_INSTANCE,TOKENS.WRITEOUTPUT_INSTANCE));
	defList.push(new Definition(new Word("/ACTIVE"),TOKENS.COMPILE_INSTANCE,TOKENS.ADDVOCABTOSTACK_INSTANCE));
	defList.push(new Definition(new Word("/CURRENT"),TOKENS.COMPILE_INSTANCE,TOKENS.MAKEVOCABCURRENT_INSTANCE));
	defList.push(new Definition(new Word("/NEWVOCABULARY"),TOKENS.COMPILE_INSTANCE,TOKENS.NEWVOCABRT_INSTANCE));
	defList.push(new Definition(new Word("/VOCABULARY"),TOKENS.COMPILE_INSTANCE,TOKENS.ADDVOCABRT_INSTANCE));
	defList.push(new Definition(new Word("/VOCAB@"),TOKENS.COMPILE_INSTANCE,TOKENS.VOCABFETCH_INSTANCE));
	defList.push(new Definition(new Word("/INACTIVE"),TOKENS.COMPILE_INSTANCE,TOKENS.INACTIVATEVOCABRT_INSTANCE));
	defList.push(new Definition(new Word("/VOCABULARIES"),TOKENS.COMPILE_INSTANCE,TOKENS.FETCHVOCABS_INSTANCE));
	defList.push(new Definition(new Word("/'"),TOKENS.COMPILE_INSTANCE,TOKENS.GETTOKEN_INSTANCE));
	defList.push(new Definition(new Word("/.NOW"),TOKENS.COMPILE_INSTANCE,TOKENS.DOTNOW_INSTANCE));
	defList.push(new Definition(new Word("/NOW"),TOKENS.COMPILE_INSTANCE,TOKENS.NOW_INSTANCE));
	defList.push(new Definition(new Word("/FORMATTIME"),TOKENS.COMPILE_INSTANCE,TOKENS.FORMATTIME_INSTANCE));
	defList.push(new Definition(new Word("/MAKEFORMATTER"),TOKENS.COMPILE_INSTANCE,TOKENS.MAKEFORMATTER_INSTANCE));
	defList.push(new Definition(new Word("/'DATEFORMAT"),TOKENS.COMPILE_INSTANCE,TOKENS.TICKDTFFORMAT_INSTANCE));
	defList.push(new Definition(new Word("/NEWLINE"),TOKENS.COMPILE_INSTANCE,TOKENS.NEWLINERT_INSTANCE));
	defList.push(new Definition(new Word("/VERSION"),TOKENS.COMPILE_INSTANCE,TOKENS.VERSION_INSTANCE));
	defList.push(new Definition(new Word("/MAKEMAP"),TOKENS.COMPILE_INSTANCE,TOKENS.MAKEMAP_INSTANCE));
	defList.push(new Definition(new Word("/MAP@"),TOKENS.COMPILE_INSTANCE,TOKENS.MAPFETCH_INSTANCE));
	defList.push(new Definition(new Word("/MAP!"),TOKENS.COMPILE_INSTANCE,TOKENS.MAPSTORE_INSTANCE));
	defList.push(new Definition(new Word("/1+"),TOKENS.COMPILE_INSTANCE,TOKENS.ONEPLUS_INSTANCE));
	defList.push(new Definition(new Word("/SETEMITTER"),TOKENS.COMPILE_INSTANCE,TOKENS.SETEMIT_INSTANCE));
	defList.push(new Definition(new Word("/ISNULL"),TOKENS.COMPILE_INSTANCE,TOKENS.ISNULL_INSTANCE));
	defList.push(new Definition(new Word("/IF"),TOKENS.IFCT_INSTANCE,TOKENS.BRANCH_INSTANCE));
	defList.push(new Definition(new Word("/THEN"),TOKENS.THENCT_INSTANCE,TOKENS.NOOP_INSTANCE));
	defList.push(new Definition(new Word("/TRUE"),TOKENS.COMPILE_INSTANCE,TOKENS.TRUE_INSTANCE));
	defList.push(new Definition(new Word("/FALSE"),TOKENS.COMPILE_INSTANCE,TOKENS.FALSE_INSTANCE));
	defList.push(new Definition(new Word("/NOT"),TOKENS.COMPILE_INSTANCE,TOKENS.NOT_INSTANCE));
	defList.push(new Definition(new Word("/TRIM"),TOKENS.COMPILE_INSTANCE,TOKENS.TRIM_INSTANCE));
	
	return hbVocab;
}

const HbVocabulary = create();

export default HbVocabulary;