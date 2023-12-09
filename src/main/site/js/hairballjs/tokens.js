import NativeToken from './nativetoken.js';
import ParserLocation from './parserlocation.js';
import Word from './word.js';
import InterpreterToken from './interpretertoken.js';
import VariableToken from './variabletoken.js';
import LiteralToken from './literaltoken.js';

export const COMPILE_INSTANCE = new NativeToken('compile',(interpreter) => {
	const ourDef = interpreter.pop();
	const rtoken = ourDef.runTime;
	interpreter.parserContext.dictionary.addToken(rtoken);
	return true;
});

export const DROP_INSTANCE = new NativeToken('Drop',(interpreter) => {
	interpreter.pop();
	return true;
});

export const EMIT_INSTANCE = new NativeToken('Emit',(interpreter) => {
	interpreter.parserContext.output.emit(interpreter.pop());
	return true;
});

export const QUOTE_INSTANCE = new NativeToken('Quote',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	let quoted = interpreter.parserContext.wordStream.getToDelimiter('"/');
	if(quoted == null) {
		throw new Error(pl.makeErrorMessage('/" failed to find matching "/'));
	}
	quoted = quoted.trim();
	interpreter.push(quoted);
	return true;
});

export const COMPILETOKEN_INSTANCE = new NativeToken('CompileToken',(interpreter) => {
	interpreter.parserContext.dictionary.addToken(interpreter.pop());
});

export const GETRUNTIME_INSTANCE = new NativeToken('GetRunTime',(interpreter) => {
	const def = interpreter.pop();
	const rt = def.runTime;
	interpreter.push(rt);
	return true;
});

export const STORE_INSTANCE = new NativeToken('Store',(interpreter) => {
	const pc = interpreter.pop();
	const token = interpreter.pop();
	interpreter.parserContext.dictionary.putToken(token,pc);
	return true;
});

export const EXECUTE_INSTANCE = new NativeToken('Execute',(interpreter) => {
	const token = interpreter.pop();
	interpreter.execute(token);
	return true; //should we return the return value of the executed token instead?
});

export const WORD_INSTANCE = new NativeToken('Word',(interpreter) => {
	const nword = interpreter.parserContext.wordStream.getNextWord();
	interpreter.push(nword);
	return true;
});

export const WORDLITERAL_INSTANCE = new NativeToken('WordLiteral',(interpreter) => {
	const aword = interpreter.pop();
	const wlit = aword.value;
	interpreter.push(wlit);
	return true;
});

export const MAKEWORD_INSTANCE = new NativeToken('MakeWord',(interpreter) => {
	const lit = interpreter.pop();
	const aword = new Word(lit);
	interpreter.push(aword);
	return true;
});

export const SLASHTOKEN_INSTANCE = new InterpreterToken('SlashToken',[WORD_INSTANCE,WORDLITERAL_INSTANCE]);

export const DEFINE_INSTANCE = new NativeToken('Define',(interpreter) => {
	interpreter.parserContext.dictionary.define();
	return true;
});

export const COMPILING_INSTANCE = new NativeToken('Compiling',(interpreter) => {
	interpreter.parserContext.parser.compile();
	return true;
});

export const INTERPRETING_INSTANCE = new NativeToken('Interpreting',(interpreter) => {
	interpreter.parserContext.parser.interpret();
	return true;
});

export const DEPTH_INSTANCE = new NativeToken('Depth',(interpreter) => {
	const sdepth = interpreter.parameterStack.length;
	interpreter.push(sdepth);
	return true;
});

export const DUP_INSTANCE = new NativeToken('Dup',(interpreter) => {
	const tos = interpreter.peek();
	interpreter.push(tos);
	return true;
});

export const SWAP_INSTANCE = new NativeToken('Swap',(interpreter) => {
	const tos = interpreter.pop();
	const t2 = interpreter.pop();
	interpreter.push(tos);
	interpreter.push(t2);
	return true;
});

export const ROT_INSTANCE = new NativeToken('Rot',(interpreter) => {
	const tos = interpreter.pop();
	const t2 = interpreter.pop();
	const t3 = interpreter.pop();
	interpreter.push(t2);
	interpreter.push(tos);
	interpreter.push(t3);
	return true;
});

export const PICK_INSTANCE = new NativeToken('Pick',(instance) => {
	const place = interpreter.pop();
	const index = interpreter.parameterStack.length - place;
	const item = interpreter.parameterStack.splice(index,1);
	interpreter.parameterStack.push(item);
	return true;
});

export const NOOP_INSTANCE = new NativeToken('Noop',() => { return true; });

export const DOER_INSTANCE = new NativeToken('Doer',(interpreter) => {
	interpreter.parserContext.dictionary.doer();
	return true;
});

export const DOES_INSTANCE = new NativeToken('Does',(interpreter) => {
	interpreter.parserContext.dictionary.does();
	return true;
});

export const DEFERCOMPILE_INSTANCE = new NativeToken('Defer',(interpreter) => {
	interpreter.parserContext.dictionary.addToCompileTime(COMPILE_INSTANCE);
	return true;
});

export const DOERCT_INSTANCE = new InterpreterToken('DoerCT',[DROP_INSTANCE,DOER_INSTANCE]);
export const DOESCT_INSTANCE = new InterpreterToken('DoesCT',[DOES_INSTANCE]);

export const CREATE_INSTANCE = new NativeToken('Create',(interpreter) => {
	interpreter.parserContext.dictionary.create(interpreter.pop());
	return true;
});

export const COLON_INSTANCE = new InterpreterToken('Colon',[WORD_INSTANCE,CREATE_INSTANCE,COMPILING_INSTANCE,DOES_INSTANCE]);

export const ALLOT_INSTANCE = new NativeToken('Allot',(interpreter) => {
//	const length = interpreter.pop(); ES6 doesn't have a concept of a fixed-size array...
	const array = [];
	interpreter.push(array);
	return true;
});

export const MAKELITERAL_INSTANCE = new NativeToken('MakeLiteral',(interpreter) => {
	const value = interpreter.pop();
	const lt = new LiteralToken('created_by_MAKELITERAL',value);
	interpreter.push(lt);
	return true;
});

export const BRACKETMAKELITERALBRACKET_INSTANCE = new InterpreterToken('[MAKELITERAL]',[DROP_INSTANCE,MAKELITERAL_INSTANCE]);

export const CONVERT_INSTANCE = new NativeToken('Convert',(interpreter) => {
	const lit = interpreter.pop();
	let litObj = parseInt(lit);
	if(isNaN(litObj)) {
		litObj = parseFloat(lit);
	}
	if(isNaN(litObj)) litObj = lit;
	interpreter.push(litObj);
	return true;
});

export const TOKEN_INSTANCE = new NativeToken('Token',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const aword = interpreter.parserContext.wordStream.getNext();
	if(aword == null) throw new Error(pl.makeErrorMessage("Token can't be parsed from input"));
	interpreter.push(aword);
	return true;
});

export const CONSTANTRT_INSTANCE = new InterpreterToken('ConstantRT',[
	WORD_INSTANCE,
	CREATE_INSTANCE,
	TOKEN_INSTANCE,
	CONVERT_INSTANCE,
	MAKELITERAL_INSTANCE,
	COMPILETOKEN_INSTANCE,
	DEFINE_INSTANCE]);

export const NUMRT_INSTANCE = new InterpreterToken('NumRT',[TOKEN_INSTANCE,CONVERT_INSTANCE]);

export const VARIABLE_INSTANCE = new NativeToken('Variable',(interpreter) => {
	const vtoken = new VariableToken("",null);
	interpreter.push(vtoken);
	return true;
});

export const VARIABLERT_INSTANCE = new InterpreterToken('VariableRT',[
	WORD_INSTANCE,
	CREATE_INSTANCE,
	VARIABLE_INSTANCE,
	COMPILETOKEN_INSTANCE,
	DEFINE_INSTANCE
	]);
	
export const LFETCHRT_INSTANCE = new NativeToken('LfetchRT',(interpreter) => {
	const vt = interpreter.pop();
	interpreter.push(vt.data);
	return true;
});

export const VSTORERT_INSTANCE = new NativeToken('VstoreRT',(interpreter) => {
	const vt = interpreter.pop();
	const data = interpreter.pop();
	vt.data = data;
	return true;
});

export const ABORT_INSTANCE = new NativeToken('Abort',(interpreter) => {
	throw new Error(interpreter.pop());
});

const COLONSLASHRTERRORMSG = new LiteralToken("ColonSlashRTErrMsg",":/ must be matched with /: or another similar defining word");
export const COLONSLASHCT_INSTANCE = new InterpreterToken('ColonSlashCT',[DEFINE_INSTANCE,INTERPRETING_INSTANCE,DROP_INSTANCE]);
export const COLONSLASHRT_INSTANCE = new InterpreterToken('ColonSlashRT',[COLONSLASHRTERRORMSG,ABORT_INSTANCE]);

export const DOTQUOTECT_INSTANCE = new NativeToken('DotQuoteCT',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const quoted = interpreter.parserContext.wordStream.getToMatching('"/');
	if(quoted == null) throw new Error(pl.makeErrorMessage('." could not find match "/ in input'));
	const lt = new LiteralToken('DotQuote_Literal',quoted);
	interpreter.parserContext.dictionary.addToken(lt);
	interpreter.parserContext.dictionary.addToken(EMIT_INSTANCE);
	return true;
});

export const SLASHBRACKETQUOTECT_INSTANCE = new NativeToken('/["CT',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	interpreter.pop();
	const quoted = interpreter.parserContext.wordStream.getToMatching('"]/');
	if(quoted == null) throw new Error(pl.makeErrorMessage('/[" failed to parse input'));
	const lt = new LiteralToken('/["CT_Literal',quoted);
	interpreter.parserContext.dictionary.addToken(lt);
	return true;
});

export const SBQRTERROR_INSTANCE = new InterpreterToken('/["RT_ERROR',[new LiteralToken('errormsg','/[" cannot be called at runtime'),ABORT_INSTANCE]);

export const GETTOMATCHING_INSTANCE = new NativeToken('getToMatching',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const target = interpreter.pop();
	const parsed = interpreter.parserContext.wordStream.getToDelimiter(target);
	if(parsed == null) throw new Error(pl.makeErrorMessage(`Failed to find ${target} in input`));
	interpreter.push(parsed);
	return true;
});

export const DOTQUOTERT_INSTANCE = new NativeToken('."RT',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const quoted = interpreter.parserContext.wordStream.getToDelimiter('"/');
	if(quoted == null) throw new Error(pl.makeErrorMessage('Could not find matching "/'));
	interpreter.push(quoted);
	EMIT_INSTANCE.execute(interpreter);
	return true;
});

const QUOTESLASHERRMSG = new LiteralToken('"/ERRMSG','"/ must match with a quoting operator');
export const QUOTESLASHRT_INSTANCE = new InterpreterToken('"/RT',[QUOTESLASHERRMSG,ABORT_INSTANCE]);
export const UUID_INSTANCE = new NativeToken('UUID',(interpreter) => {
	const uuid = crypto.randomUUID();
	interpreter.push(uuid);
	return true;
});

export const DOTS_INSTANCE = new NativeToken('DOTS',(interpreter) => {
	const adepth = interpreter.parameterStack.length.toString();
	const output = interpreter.parserContext.output;
	output.emit(adepth);
	output.space();
	const stack = [];
	interpreter.parameterStack.forEach((obj) => {
		output.emit(obj == null ? "(null)" : obj.toString());
		output.emit("\n");
	});
	return true;
});

export const QUIT_INSTANCE = new NativeToken("Quit",(interpreter) => {
	return false;
});

export const COMMENTIN_INSTANCE = new NativeToken('/*',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const commented = interpreter.parserContext.wordStream.getToMatching("*/");
	if(commented == null) throw new Error(pl.makeErrorMessage("cannot find matching */"));
	return true;
});

export const COMMENTOUT_INSTANCE = new LiteralToken("CommentOutMsg","*/ must match with /*");

export const SPACE_INSTANCE = new NativeToken("Space",(interpreter) => {
	interpreter.parserContext.output.space();
	return true;
});

export const FETCHOUTPUT_INSTANCE = new NativeToken("@Output",(interpreter) => {
	interpreter.push(interpreter.parserContext.output);
	return true;
});

export const SETOUTPUT_INSTANCE = new NativeToken("!Output",(interpreter) => {
	interpreter.parserContext.output = interpreter.pop();
	return true;
});

export const CLOSEOUTPUT_INSTANCE = new NativeToken("CloseOutput",(interpreter) => {
	interpreter.pop().close();
	return true;
});

export const WRITEOUTPUT_INSTANCE = new NativeToken("WriteOutput",(interpreter) => {
	interpreter.pop().emit(interpreter.pop());
	return true;
});

export const PUSHVOCAB_INSTANCE = new NativeToken("PushVocab",(interpreter) => {
	const vocabName = interpreter.pop();
	const vocab = interpreter.parserContext.dictionary.findVocabulary(vocabName.value);
	interpreter.push(vocab);
	return true;
});

export const CREATEVOCAB_INSTANCE = new NativeToken("CreateVocab",(interpreter) =>{
	interpreter.parserContext.dictionary.createVocabulary(interpreter.pop().value);
	return true;
});

export const ADDVOCABTOSTACK_INSTANCE = new NativeToken("AddVocabToStack",(interpreter) => {
	interpreter.parserContext.dictionary.add(interpreter.pop());
	return true;
});

export const MAKEVOCABCURRENT_INSTANCE = new NativeToken("MakeVocabCurrent",(interpreter) => {
	interpreter.parserContext.dictionary.makeCurrent(interpreter.pop());
	return true;
});

export const NEWVOCABRT_INSTANCE = new InterpreterToken(":VOCAB",[WORD_INSTANCE,CREATEVOCAB_INSTANCE]);

export const ADDVOCABRT_INSTANCE = new InterpreterToken("AddVocabRT",[WORD_INSTANCE,PUSHVOCAB_INSTANCE]);

export const VOCABFETCH_INSTANCE = new InterpreterToken("@Vocab",[MAKEWORD_INSTANCE,PUSHVOCAB_INSTANCE]);

export const INACTIVATEVOCABRT_INSTANCE = new NativeToken("InactivateVocabRT",(interpreter) => {
	const vocab = interpreter.pop();
	interpreter.parserContext.dictionary.remove(vocab);
	return true;
});

export const FETCHVOCABS_INSTANCE = new NativeToken("@Vocabs",(interpreter) => {
	interpreter.push(interpreter.parserContext.dictionary.getActiveVocabularies());
	return true;
});

export const LOOKUP_INSTANCE = new NativeToken('Lookup',(interpreter) => {
	const aword = interpreter.pop();
	interpreter.push(interpreter.parserContext.dictionary.lookUp(aword));
	return true;
});

export const GETTOKEN_INSTANCE = new InterpreterToken("GetToken",[WORD_INSTANCE,LOOKUP_INSTANCE,GETRUNTIME_INSTANCE]);

export const NOW_INSTANCE = new NativeToken("Now",(interpreter) => {
	interpreter.push(Date.now());
	return true;
});

export const FORMATTIME_INSTANCE = new NativeToken("FormatTime",(interpreter) => {
	const dtf = interpreter.pop();
	const time = interpreter.pop();
	const dt = new Date(time);
	const formatted = dtf.format(dt);
	interpreter.push(formatted);
	return true;
});

export const MAKEFORMATTER_INSTANCE = new NativeToken("MakeFormatter",(interpreter) => {
	const lang = interpreter.pop();
	const options = interpreter.pop();
	const dtf = new Intl.DateTimeFormat(lang,options);
	interpreter.push(dtf.format); //will this work? not sure...
	return true;
});

export const PARSEJSON_INSTANCE = new NativeToken("ParseJson",(interpreter) => {
	const jsonStr = interpreter.pop();
	const json = JSON.parse(jsonStr);
	interpreter.push(json);
	return true;
});

export const STRINGIFYJSON_INSTANCE = new NativeToken("SerializeJson",(interpreter) => {
	const json = interpreter.pop();
	interpreter.push(JSON.stringify(json));
	return true;
});

export const TICKDTFFORMAT_INSTANCE = new VariableToken("'DateFormat",new Intl.DateTimeFormat('sv-SE',{
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
}).format); // This is as close as you can get to ISO8601...

export const MAKENOW_INSTANCE = new InterpreterToken('makeNow',[NOW_INSTANCE,TICKDTFFORMAT_INSTANCE,LFETCHRT_INSTANCE,FORMATTIME_INSTANCE]);

export const DOTNOW_INSTANCE = new InterpreterToken('.NOW',[MAKENOW_INSTANCE,EMIT_INSTANCE]);

export const NEWLINE_INSTANCE = new LiteralToken('\n',"\n");
export const NEWLINERT_INSTANCE = new InterpreterToken("\nRT",[NEWLINE_INSTANCE,EMIT_INSTANCE]);

export const VERSION_INSTANCE = new NativeToken('Version',(interpreter) => { interpreter.push("FOOFOO"); return true; });

export const MAKEMAP_INSTANCE = new NativeToken('MakeMap',(interpreter) => {
	interpreter.push({});
	return true;
});

export const MAPSTORE_INSTANCE = new NativeToken('Map!',(interpreter) => {
	const map = interpreter.pop();
	const key = interpreter.pop();
	const value = interpreter.pop();
	map[key] = value;
	return true;
});

export const MAPFETCH_INSTANCE = new NativeToken('Map@',(interpreter) => {
	const map = interpreter.pop();
	const key = interpreter.pop();
	interpreter.push(map[key]);
	return true;
});

export const ONEPLUS_INSTANCE = new NativeToken('!+',(interpreter) => {
	interpreter.push(interpreter.pop()+1);
	return true;
});

export const SETEMIT_INSTANCE = new NativeToken('SetEmit',(interpreter) => {
	const parser = interpreter.parserContext.parser;
	parser.setEmit(interpreter.pop());
	return true;
});

export const ISNULL_INSTANCE = new NativeToken('isNull',(interpreter) => {
	interpreter.push(interpreter.pop() == null);
	return true;
});

export const BRANCH_INSTANCE = new NativeToken('branch',(interpreter) => {
	const branchTarget = interpreter.pop();
	const flag = interpreter.pop();
	if(!flag) interpreter.setIp(branchTarget);
	return true;
});

export const IFCT_INSTANCE = new NativeToken('IFCT',(interpreter) => {
	const dictionary = interpreter.parserContext.dictionary;
	const thenTarget = dictionary.here();
	dictionary.addToken(new LiteralToken('dummy',0));
	interpreter.push(thenTarget);
	swap.execute(interpreter);
	compile.execute(interpreter);
	return true;
});

export const THENCT_INSTANCE = new NativeToken('THENCT',(interpreter) => {
	const dictionary = interpreter.parserContext.dictionary;
	const foo = interpreter.pop();
	const thenTarget = interpreter.pop();
	const thenOffset = dictionary.here();
	dictionary.putToken(new LiteralToken("thenOffset",thenOffset),thenTarget);
	dictionary.addToken(NOOP_INSTANCE);
	return true;
});

export const TRUE_INSTANCE = new LiteralToken('true',true);
export const FALSE_INSTANCE = new LiteralToken('false',false);
export const NOT_INSTANCE = new NativeToken('not',(interpreter) => {
	const value = interpreter.pop();
	interpreter.push(!value);
	return true;
});

export const TRIM_INSTANCE = new NativeToken('trim',(interpreter) => {
	interpreter.push(interpreter.pop().trim());
	return true;
});