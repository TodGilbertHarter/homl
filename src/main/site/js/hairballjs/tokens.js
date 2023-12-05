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
	if(quoted === null) {
		throw new Error(pl.makeErrorMessage('/" failed to find matching "/'));
	}
	quoted = quoted.strip();
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
	if(aword === null) throw new Error(pl.makeErrorMessage("Token can't be parsed from input"));
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
	if(quoted === null) throw new Error(pl.makeErrorMessage('." could not find match "/ in input'));
	const lt = new LiteralToken('DotQuote_Literal',quoted);
	interpreter.parserContext.dictionary.addToken(lt);
	interpreter.parserContext.dictionary.addToken(EMIT_INSTANCE);
	return true;
});

export const SLASHBRACKETQUOTECT_INSTANCE = new NativeToken('/["CT',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	interpreter.pop();
	const quoted = interpreter.parserContext.wordStream.getToMatching('"]/');
	if(quoted === null) throw new Error(pl.makeErrorMessage('/[" failed to parse input'));
	const lt = new LiteralToken('/["CT_Literal',quoted);
	interpreter.parserContext.dictionary.addToken(lt);
	return true;
});

const SBQRTERROR = new InterpreterToken('/["RT_ERROR',[new LiteralToken('errormsg','/[" cannot be called at runtime'),ABORT_INSTANCE]);

export const GETTOMATCHING_INSTANCE = new NativeToken('getToMatching',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const target = interpreter.pop();
	const parsed = interpreter.parserContext.wordStream.getToDelimiter(target);
	if(parsed === null) throw new Error(pl.makeErrorMessage(`Failed to find ${target} in input`));
	interpreter.push(parsed);
	return true;
});

export const DOTQUOTERT_INSTANCE = new NativeToken('."RT',(interpreter) => {
	const pl = new ParserLocation(interpreter.parserContext.wordStream);
	const quoted = interpreter.parserContext.wordStream.getToMatching('"/');
	if(quoted === null) throw new Error(pl.makeErrorMessage('Could not find matching "/'));
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
		output.emit(obj === null ? "(null)" : obj.toString());
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
	if(commented === null) throw new Error(pl.makeErrorMessage("cannot find matching */"));
	return true;
});

export const COMMENTOUT_INSTANCE = new LiteralToken("CommentOutMsg","*/ must match with /*");

