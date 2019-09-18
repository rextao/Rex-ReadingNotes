/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		//这段代码主要是用来支持CommonJs与类似Commonjs的环境
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// 会在非strict代码访问strict代码时抛出异常(e.g., ASP.NET 4.5)
// 但是自从jQuery 3.0 (2016), 一直使用strict模式，以至于新的尝试都被放在try中以保证不出现问题
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf; //返回原型

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;//判断某个对象是否含有指定的属性，不会在原型链上查找

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};


	// 把一段脚本加载到全局context（window）中
	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// 定义个局部变量jquery，拷贝的是jquery对象
	jQuery = function( selector, context ) {

		// jQuery对象实际上仅仅是init构造函数的提升
		// 如jQuery被调用则需要初始化
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// 匹配破坏驼峰标记法的字符串
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// 在jQuery.camelCase作为一个回调函数来使用
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};
// 给JQ原型对象，添加一些方法和属性
jQuery.fn = jQuery.prototype = {

	// 当前的jQuery版本
	jquery: version,

	constructor: jQuery,

	// jQuery对象的默认长度
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// 从匹配元素集中获取第N个元素或获取整个匹配元素集
    // $('div').get(0),this则是html匹配到的dom元素
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// 如num<0,返回整个this，否则仅返回num这个元素
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// 取一组元素并推入栈中，返回新匹配的元素集
    // 类似于栈，将对象一层层包裹在prevObject属性上
	pushStack: function( elems ) {
		// this.constructor = jquery，所以this.constructor()返回一个jQuery对象
		var ret = jQuery.merge( this.constructor(), elems );

		// 为ret添加prevObject属性，指向old对象
		ret.prevObject = this;

		// 返回新的ret元素集合
		return ret;
	},

	// 为每个匹配集合执行回调函数
	each: function( callback ) {
		return jQuery.each( this, callback );
	},
    // 对this的每个结果应用function函数，
	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},
    // 选取一个匹配的子集
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},
    // 对于$('div').eq(0),假如$('div')匹配到[div.rex,div.aaa]，this.length=2
    // 因此this[0] = div.rex,传入pushStack处理
	eq: function( i ) {
		var len = this.length,
            // ( i < 0 ? len : 0 ),处理eq(-2)情况，从数组最后往前计算
			j = +i + ( i < 0 ? len : 0 );
            // 主要是push哪个元素到stack（pushStac类似于一个栈）中
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},
    // this.constructor(),如当前this无prevObject属性，即非pushStack构建的，则返回当前的jQuery对象
	end: function() {
		return this.prevObject || this.constructor();
	},

	// 内部使用
	// 表现类似于数组方法，而不像jQuery方法
	push: push,
	sort: arr.sort,
	splice: arr.splice
};
//核心函数extend
//合并两个或更多对象的属性到第一个对象中，jQuery后续的大部分功能都通过该函数扩展
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},// 常见用法 jQuery.extend( obj1, obj2 )，此时，target为arguments[0]
		i = 1,
		length = arguments.length,
		deep = false;

	// 处理深复制情况
	if ( typeof target === "boolean" ) {// 如果第一个参数为true，即 jQuery.extend( true, obj1, obj2 ); 的情况
		deep = target; // 此时target是true

		// Skip the boolean and the target
		target = arguments[ i ] || {}; //target为obj1
		i++; //i=2
	}

	// 如第一参数不是obj或函数，如jQuery.extend("haa",obj1,obj2)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// 只传入一个参数，处理jQuery.extend(obj)，或 jQuery.fn.extend( obj )
	if ( i === length ) {
		target = this;//对于extend和fn.extend的this指向不同，
		i--; //i=0;
	}

	for ( ; i < length; i++ ) {

		// 处理非空参数
		if ( ( options = arguments[ i ] ) != null ) {

			for ( name in options ) {
				src = target[ name ]; // arguments[ 0 ]
				copy = options[ name ];

				// 避免循环引用**********************
				// 属性拷贝要考虑循环引用的问题，否则会一直复制
				if ( target === copy ) {
					continue; //continue 用于跳过当前循环
				}

				// 如是深拷贝，
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );//递归

				// 浅拷贝，copy不为undefined的值
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// 返回修改后的对象
	return target;
};
//工具函数
jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},
    // 利用typeof obj = ""判断
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},
	// 判断是否位数字
	isNumeric: function( obj ) {
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&
			!isNaN( obj - parseFloat( obj ) );
	},
    // 检查obj是否是一个纯粹的对象（通过"{}" 或 "new Object"创建的对象）
	isPlainObject: function( obj ) {
		var proto, Ctor;

		// 判断obj是否为对象
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}
		// 获取原型
		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// 判断某个对象是否含有指定的属性，如不存在construtor，则返回false，否则返回proto.constructor
		// ????????????？？？??并不知道用来判断何种情况
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},
	// 是否空对象
	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},
	// 判断类型
	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
        // Line518行对此对象进行了充实，并不是空对象
		// —— 对于obj=navigator，toString.call( obj )会返回[object Navicator]，但class2type并没有Navictor这个值，故前半部分会返回undefined，结果返回object
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// 把一段脚本加载到全局context（window）中
	// 因为jQuery环境为jQuery，如想将上下文环境设置为window，需要整个函数
	globalEval: function( code ) {
		DOMEval( code );
	},

	// 转换为驼峰标记法
	// Support: IE <=9 - 11, Edge 12 - 13
	//  rmsPrefix = /^-ms-/,
	// 	rdashAlpha = /-([a-z])/g,
	// 相当于把rex-tao转换为rexTao
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				//  callback.call( obj[ i ], i, obj[ i ] ) 是callback返回值
				// call第一个参数为绑定对象，之后为参数列表
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// 将类数组对象转换为数组对象
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {//arr如不是类数组，push到result里面
				push.call( ret, arr );
			}
		}
		return ret;
	},
	// 查看elem是否在数组中
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},
	// 将数组second合并到数组first中
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;
		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		// 指定数组长度，程序运行时会分配空间，降低运行速度
		// 主要是考虑到后期代码内存的优化问题。
		first.length = i;

		return first;
	},
	// 过滤数组，返回新数组,invert为true时，callback返回false，才添加到数组中
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},
	// 将一个数组中的元素转换到另一个数组中。
	// $.map( [0,1,2], function(n){
	// 	return n + 4;
	// });
	// [4,5,6]
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// 转换类数组
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		// 如是对象
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}
		// 展开数组ret，利用apply特性
		// 可能ret=[1,[2,3]],apply会将数组转换为一个个参数
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// 调用方式：1、$.proxy(function,context)
	//	        2、$.proxy(context,name),context为一个对象，name为对象属性并且是一个函数
	//          3、jQuery.proxy( function, context [, additionalArguments ] )，将参数传给function
	proxy: function( fn, context ) {
		var tmp, args, proxy;
		// 处理第2种调用方式
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}
		// 快速测试fn是否是可调用的（即函数），在文档说明中，会抛出一个TypeError，
		// 但是这里仅返回undefined
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}
		// 处理第3种调用方式
		args = slice.call( arguments, 2 ); // 从参数列表中去掉fn,context
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};
		// 统一guid，使得proxy能够被移除
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;
		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );
// Symbol.iterator 为对象定义了默认的迭代器
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// 创建类型对应关系
// tostring.call('a'),会返回[object String]，通过class2type则可以返回string,方便类型判断
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );
// 判断类数组
function isArrayLike( obj ) {

	// && 第一个操作数能强转为真，则返回第二个操作数，无论真假
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );
	// window对象具有length属性，function函数length属性指的参数列表
	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}
	// typeof length === "number"表示获得obj.length
	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	// 创建缓存
	classCache = createCache(),//class缓存
	tokenCache = createCache(),//selector解析后的groups数组缓存
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// 实例方法
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// 比原生还快的indexof方法
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// 正则表达式

	// http://www.w3.org/TR/css3-selectors/#whitespace
	// 匹配空白符，
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier，这个页面的第一行
	// w3c文档规定，css的标识符只能包含[a-zA-Z0-9]和ISO 10646标准中的U+00A0和它之后的字符，
	// 以及中划线、下划线。不能以数字，两个中划线或者中划线后跟一个数字作为标识符的开始。
	// 标识符也可以包含转义字符和任意ISO 10646作为数字编码。例如标识符“B&W?”可以写成“B\26 W\3F”。
	// 匹配Css标识符，匹配\\任意字符，如\3,\m
	//				 匹配[a-zA-Z0-9_-]
	// 				 匹配为了满足W3C中字符要是“U+00A0”以及其后的字符的要求，排除ISO 10646编码中0-xa0范围内的字符都排除
	//				 \0表示的是C0控制符中的NULL
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	// 主要匹配属性
	// [ 标识符  =  （'  (\.)  |  （除了\'）*  ' ） | " (\.)  |  （除了\"）* "  | (空)  | (标识符)]
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",
	//伪类选择器
	// : identifier (
	//                  ' ( \.  |  [^\\']*  ）' 或 " ( \.  |  [^\\"])* )"   或		5
	//                   \.  |  [^\\()[\]]|)*  或				4
	//                  attribute               或				3
	//                  任意字符		(2)
	//               )或
	// ：identifier					(1)
	// 举例 (1) :aaa  (2):aaa(asdfasdf)   (3):aaa(bbbb)   （4）:aaaa(\bbbb)  5:aaaa('')
	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	// rcomma = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,匹配（    ，   ）形式
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	// 匹配是否为关系符，>+~空格
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	// 匹配属性，*?表示懒惰模式，匹配能匹配到最少词，.*匹配的最长词
	// 对于字符串aabab，a.*?b匹配的是aab，a.*b匹配的是aabab
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	//匹配伪类
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),
	// 不同selector的正则表达式
	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// 用于.is()实现
		// 内部用于select中
        // 判断第一个token是[>+~]关系选择器，或整个选择器中有sizzle自定义伪类
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,	//h1,h2,h3等匹配

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS 字符串/标识符，序列化
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// 在iframes使用
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},
    // createDisabledPseudo使用的用来检查disbaled属性的方法（为兼容ie6-11）
	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}
// 引擎的主要入口函数
// jquery.find未传递seed，并不代表Sizzle中的if(!seed)无意义，并不是seed一直是undefined
// 此函数并不只是在jquery.find中调用一次，当selector复杂时，可能会被后面complie内部再次调用，
// 如Line2329，multipleContexts中又调用Sizzle函数
function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodetype=9为Document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// 如selector不是Element(1),DocumentFragment(11)返回results
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// 尝试在HTML文档中快捷地查找操作（而不是过滤器）
	if ( !seed ) { //如果外界没有指定初始集合seed了。
		// 如context不是document调用setDocument函数设置,因为传入window对象，document为window上属性
		// preferredDoc = window.document
		// ownerDocument:返回当前节点的顶层的document对象
		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;
		// !isXML( document )的为documentHtml
		if ( documentIsHTML ) {
			// 如selector足够简单（单标签选择器，如$("#id"),$(".class"),$("span")等），使用get*By*的DOM方法
			// DocumentFragment不使用，因为DocumentFragment没有这些方法
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// match[1]，match[2]，match[3]分别为id，元素，class选择器
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// IE，Opera，Webkit某些版本有这个bug
							// getElementById 能根据name匹配而不是id
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// getElementById 能根据name匹配而不是id
						// 不是document，利用顶层根元素获取m，并且保证context有elem
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// 利用querySelectorAll优势
			// support.qsa = rnative.test( document.querySelectorAll )
			// compilerCache[ selector + " " ] :缓存selector
			// selector未缓存过，并未出现rbuggyQSA中的问题
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA会检查外部Element context，这并不是我们想要的
				// Support: IE <=8
				// 解决IE8下一个bug（Andrew Dupont提供的方法）
				// 不理解bug起因，难理解bug修复？？？？？？？？？
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// 捕获context的 ID, 如需要首先设置它
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// 获取selector分组
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) { // 处理qsa问题
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// selector.replace( rtrim, "$1" )删除selector两端空格
	// rtrim：匹配字符串两端空格，分组$1为不包含两端空格的内容
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * 创建有限大小的键值缓存
 * @returns {function(string, object)} 返回一个对象，且数据存储在对象本身的，键为key + " "
 *  如cahce大于Expr.cachLength，删除最早加入数组的元素
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// 使用 (key + " ") 来避免与本地原型属性冲突(see Issue #157)
		// Expr.cacheLength默认50，可以由使用者设置
		// 如keys大于cache容量，将最旧的元素删除
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * 标记一个函数为Sizzle特殊用途
 * expando = "sizzle" + 1 * new Date()
 * fn.expando =true;
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * 用来测试一个element
 * ？？？？？？？？？？？？？？为何创建fieldset元素，用来测试
 * @param {Function} fn 传递创建的元素、并返回一个boolean结果
 */
function assert( fn ) {
	var el = document.createElement("fieldset");
	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// 释放内存
		el = null;
	}
}

/**
 * 为特定属性增加相同的handler
 * 主要用于Sizzle.attr函数中，处理一些获取属性值有问题的浏览器
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * 检查同辈元素document顺序
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} 返回值小于0，a在b前，大于0，则a在b后
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		//
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// 如存在sourceIndex，使用IE的sourceIndex
	if ( diff ) {
		return diff;
	}

	// 检查b是否在a后面
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;	//a在b前面
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * 返回input伪类使用是函数
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * 返回buttons伪类使用的函数
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * 返回一个:enabled/:disabled使用的函数
 * 主要是通过协议https://html.spec.whatwg.org，判断某个元素的disabled属性
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// 只有某些元素可以匹配:enabled、:disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
                //  使用属性isDisabled属性来检查disabled fieldset 祖先
				return elem.isDisabled === disabled ||

					// 无isDisabled属性，手动检查
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// 如不是:enabled 或:disabled保留element
		return false;
	};
}

/**
 * 返回一个在Expr.Pseudo使用的伪类位置函数
 * 会创建fn[expandoo] = true
 * 以Expr.pseudos.first为例，此返回[0];
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				// 对于Expr.pseudos.first,matchIndexes为[0]
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// 匹配指定下标元素
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * 检查节点有效性作为Sizzle上下文
 * ？？？？为何这样就是Sizzle有效上下文
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// 为了方便，向外暴露support
support = Sizzle.support = {};

/**
 * 检测xml节点
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement返回文档
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * 根据当前文档设置文档相关的变量，主要任务是测试浏览器对相关函数的支持
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		// preferredDoc = window.document ,返回window的document引用，是一个对象
		// ownerDocument,返回当前节点的顶层的document对象，环境不是window，可能返回不是window.document
		doc = node ? node.ownerDocument || node : preferredDoc;

	// nodeType ==9：一个 Document 节点
	// documentElement：返回文档对象（document）的根元素的只读属性
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document; //返回window.document
	}

	// 更新全局变量
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// 解决iframe文件卸载后，抛出“没有权限”的bug (jQuery #13936)
	// document.defaultView:在浏览器中返回document相关的window对象
	// ？？？？？？？？？？？为何能通过这种方式修复bug-。-不需要关注
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* 是否支持属性
	// 其实support为true，表示当前方法或属性没有bug，如果为false表示有bug，需要特殊处理
	---------------------------------------------------------------------- */

	// Support: IE<8
	// 在使用getAttribute('class')时,IE<8,需要写为getAttribute('className')，IE8修复
	// <input type="text" value="123" id="input" title="input" />
	// var a = document.getElementById("input");
	// a.value = "rextao";
	// console.log(a.getAttribute("value"));
	//—— 对于IE<8，如上代码，el.getAttribute("className")会返回i，而其他代码会返回null；
	support.attributes = assert(function( el ) {
			el.className = "i";
			return !el.getAttribute("className");
	});

	// 针对support情况，为Expr增加find与filter方法
	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	//IE<9会考虑上comment节点，返回1，其他返回0
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	// IE<9,因为没有document.getElementsByClassName，故返回undefined，
	// rnative = /^[^{]+\{\s*\[native \w/; \w匹配单词字符
	// 支持的返回 function getElementsByClassName() { [native code] }
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10，
	// 低版本IE，getElementById会返回表单元素是name值
	// <input type="text" name="myElement" value="The field" />
	// <div id="myElement">A div</div>   对于这个代码，会返回input元素
	// expando = "sizzle" + 1 * new Date(),
	// 对于非IE，getElementsByName( expando ).length=0，因为设定是的id，不会查到
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	// filter查看是否有某个id元素
	// find 查找某个元素
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			//解决firefox<24错误的数字解读，有w3c规范说明=。=
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		//查询id
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				//返回指定元素的指定属性， 返回值是 Attr 节点类型，此方法是已废弃方法
				//MDN上说已经使用getAttribute代替，并且性能上， element.id >element.getAttribute('id') >element.getAttributeNode('id').nodeValue.
				// 但是对于如下代码，对于IE<7,下面1行返回null，而2可以返回rextao
				// var el = document.getElementById('myElement')
				// el.className ='rextao'
				// console.log(el.getAttribute('class'))------------1
				// console.log(el.getAttributeNode('class').value)------2
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only, getElementById不可靠，可能会返回name值，上面有说明
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {//准确的找到了id元素
						return [ elem ];
					}

					// 回退到使用getElementByName方法
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes 没有gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// 出于巧合，documentFragment的nodes有gEBTN方法
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	// getElementsByClassName htmlDOM
	// 如support.getElementsByClassName == true，返回function( className, context )
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	   针对具体有问题的浏览器，提出解决办法
	---------------------------------------------------------------------- */

	// 匹配选择器(:active) 实际为true时，却返回false(IE9/Opera 11.5)
	rbuggyMatches = [];

	// 匹配选择器(:focus) 实际为true时，却返回false (Chrome 21)
	// 这个bug未修复是因为 IE8/9在iframe中访问document.activeElement会抛出错误
	// 未修复这个bug是为了不让ie抛出错误
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];
	// document.querySelectorAll:返回与指定的选择器组匹配的文档中的元素列表 。返回的对象是 NodeList 。
	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// 创建QSA正则表达式，策略采用来源  Diego Perini
		// el = document.createElement("fieldset");
		assert(function( el ) {
			// Select 元素设置为空字符串
			// 解决https://bugs.jquery.com/ticket/12359问题
			// 下面产生的html代码为：
			// <a id="a"></a>
			// <select id="a-
			// 		\" msallowcapture="">
			// 		<option selected=""></option>
			// </select>
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			//  ^= , $= , *=选择符后空字符串，应无内容选出
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// IEB对Boolean特性和值处理不正确
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked应该返回选中的元素，IE抛出异常
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// 类似的span#id + ok选择器返回结果不正确
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// type和name特性，在.innerHTML使用时受限
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}
	// el.matches（selectorString）:el能否被selectorString选择
	// 几个浏览器以非标准名称实现了这个前缀matchesSelector()。
	// 以下内容应足以满足大多数（如果不是全部）（即IE9 +支持）
	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// 看能否在为挂在文档树中的node使用matches方法(IE9)
			support.disconnectedMatch = matches.call( el, "*" );

			// 这段代码应抛出异常，但Gecko会返回false
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// 元素是否包含另一个
	// contais：判断一个元素是否为指定元素后代
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			// 如a是DOM根节点，返回顶层document对象
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			// 如a包含b，则b.parentNode为a或a的子
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?	//	如contais方法存在，使用contains判断
					adown.contains( bup ) :
					// a.compareDocumentPosition( bup ) ==16表示a为bup的外部节点，如前2个&&为真，返回16
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		// 不存在contains和compareDocumentPosition方法，使用parentNode一层层比较
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// document顺序
	sortOrder = hasCompare ?
	function( a, b ) {

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// 如a，b只有一个有compareDocumentPosition方法，返回true-false：1或false-true：-1
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// 如a,b属于同一个文档，计算输入位置
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// 否则无关系，不属于一个文档
			1;

		// 处理无关系两个节点关系
		// a,b无关系，a.compareDocumentPostion(b)===1
		// compare & 1 --true
		// b.compareDocumentPosition( a ) === compare --true
		// support.sortDetached,浏览器无bug时，返回true，有bug时返回false
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {	//不存在compareDocumentPosition方法

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// 无父节点的不是documents节点，就是为挂在在dom树上的节点
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// 如节点为同辈（父节点相同），快速检查
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// 否则需要全部祖先做比较
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// 选择相同的祖先元素，只要dom树上元素一定存在
		// 通过判断相同祖先的子元素，判断元素先后
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};
/**
 * 用于检查某个元素node是否匹配选择器表达式expr。
 * Sizzle本身未调用，但jQuery通过jqeury.find.matchesSelector进行调用
 * @param elem
 * @param expr
 * @return {*}
 */
Sizzle.matchesSelector = function( elem, expr ) {
	// 如需要设置document
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// 确保引用了属性选择器
	expr = expr.replace( rattributeQuotes, "='$1']" );
	// support.matchesSelector是否存在matches方法,如原生支持，则使用原生方法
	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector在未挂在dom树的nodes返回false
			if ( ret || support.disconnectedMatch ||
					// 同样，IE9，未挂在DOM上的节点会被认为在frament上
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}
    // 利用Sizzle，看能否再elem上查询到expr这个元素，如不能返回false
	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};
/**
 * 已过时，一个DOM节点是否包含另一个DOM节点。
 * jQuery.contains = Sizzle.contains;
 * @param context
 * @param elem
 * @return {*}
 */
Sizzle.contains = function( context, elem ) {
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};
/**
 * 获取某个元素节点elem上属性为name的属性值
 * @param elem
 * @param name
 * @return {undefined}
 */
Sizzle.attr = function( elem, name ) {
	// 设置Document
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// 处理(jQuery #13807)bug
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		// 判断是否支持attr
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			// val.specified:如果在文档中设置了属性值，则 specified 属性返回 true，如果是 DTD/Schema 中的默认值，则返回 false。
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};
// 抛出错误
Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * document分类，删除重复
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// 总是假定存在重复，hasDuplicate=true
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );
	// 判断重复的方式也较为简单，判断result是否有一样的元素，有则将index-push
	// 到duplicates中
	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// 排序后清空input释放对象
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * 用于检索DOM节点数组的文本值的工具函数
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if ( !nodeType ) {
            // 如elem.nodeType不存在，可能是array
            while ( (node = elem[i++]) ) {
                ret += getText( node );
            }
            // element,document,DocumentFragment
        } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            // 利用textContent获取元素文本
            // innerText 存在bug(jQuery #11153)
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                // 递归子元素
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += getText( elem );
                }
            }
            // elem是Text或CDATASection
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
        // 不包括注释和处理指令节点

        return ret;
    };

Expr = Sizzle.selectors = {

	// 可以由使用者设置
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},
	//匹配关系
	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},
    // 主要是在tokenize使用，目的主要是判断写的selector是否正确
    // 比如div:first-child1,去解析没意义，因为没有first-child1这个伪类
	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

        "CHILD": function( match ) {
			/* 以$('div:first-child'),match为matchExpr["CHILD"]，参数列表如下
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
	    // 如下函数创建，都是在matcherFromTokens函数中，参数为tokens.matches提供,此tokens.matches为
        // matchExpr[ type ].exec( selectors )的结果
		// 函数运行到matcherFromGroupMatchers才能理解，matcherFromGroupMatchers中会调用
		// 其中elem为外层循环的html、head、body等对象
		// nodeNameSelector为selector，如div
		// 如当循环运行到elem为head，则elem.nodeName = HEAD && head === div
		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {	//html中nodeName会返回大写
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},
		// 判断元素上有某个类
		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},
		// 对于 $("div[class='rex']")，根据matcherFromTokens生成matcher函数的
		// matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
		// 可得知tokens.matches分别为class,=,rex,分别为参数name, operator, check
		"ATTR": function( name, operator, check ) {
			return function( elem ) { //返回一个attr匹配器
                // 获取某个元素节点elem上属性为name的属性值
				var result = Sizzle.attr( elem, name );
				//看看属性值有木有！
				if ( result == null ) {
					// 属性不存在，是不等于任何值的，故判断operator是否为！=
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
						// 判断目标值是否在当前属性值的头部
					operator === "^=" ? check && result.indexOf( check ) === 0 :
						//  lang*=en 匹配这样 <html lang="xxxxenxxx">的节点，包含en子串就行
						// 在result能查询到check
					operator === "*=" ? check && result.indexOf( check ) > -1 :
						// 判断是否为结尾***************
					operator === "$=" ? check && result.slice( -check.length ) === check :
						// 选择包含check这个词的，
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						//  匹配这样 <html lang="en-US">的节点
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},
        // 对于$("div:nth-child(2)")，tokens.matches结果为[nth,child,2,0,2....]
        // nth-child与nth-of-type有个特殊之处，可以使用p:nth-child(2n),返回的是子元素为p的第2,4,6,8元素
        // 对于div:nth-child(2)，first为0,last为2；
        // 对于div:nth-child(2n)，first为2,last为0；
		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
                // 对于$("div:nth-last-child(2)"),type为nth-last
				forward = type.slice( -4 ) !== "last",
                // p:nth-of-type(2),选择属于其父元素第二个 <p> 元素的每个 <p> 元素。
				ofType = what === "of-type";

			return first === 1 && last === 0 ?
                // 对于$("div:nth-child(1n)")，则为true
                // 表示选择全部div，故需要有父级元素
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
                        // 非nth模式
                        // 主要是查询elem的nextSibling和previousSibling元素，
                        // 每个元素上都存储了nextSibling和prviousSibling元素，通过判断同辈元素来判断当前元素的位置
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// 如type为only，唯一元素，故需要查询两个方向，只要同辈有元素，则返回false
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}
                        // 根据方向判断，开头元素是firstChild还是lastChild
						start = [ forward ? parent.firstChild : parent.lastChild ];

                        // 处理非xml的nth-child,nth-child存储缓存数据在parent元素上
						if ( forward && useCache ) {

							node = parent;
                            // 如缓存过此node，则直接获取为outerCacher，否则创建一个空对象
                            // 为何要缓存，因为nth针对都是parent相同的child查找
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
                            // 解决(jQuery gh-1709)bug，
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// 从开始寻找elem
								(diff = nodeIndex = 0) || start.pop()) ) {

								// 在node.childNodes中查询elem，查询到后，将次序缓存起来
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// 使用缓存
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

                                // Support: IE <9 only
                                // 解决(jQuery gh-1709)bug，
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// 使用如上类似的循环结构，只是缓存的数据不同
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// 缓存每个元素的index
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

                                            // Support: IE <9 only
                                            // 解决(jQuery gh-1709)bug，
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						diff -= last;
                        //
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// 伪类不区分大小写
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// setFilters继承自pseudos
			var args,
				// Expr.setFilters = Expr.filters = Expr.pseudos
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// 可以使用createPseudo表明参数需要创建一个过滤器函数，正如Sizzle所做的
			// 其实是Expr.pseudos是由MarkFunction创建的，返回fn( argument )
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// 支持旧的签名
			// ???????????????????????????????????????
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// :not(selector):去除所有与给定选择器匹配的元素
		// 如input:not(:checked):查询未选中的input
		"not": markFunction(function( selector ) {
			// 去掉selector的前后空格，便于创建compile函数
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					// 因为matcher=compile，此处为compile调用
					matcher( input, null, xml, results );
					// 不要保留input[0],处理(issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),
		// :has(selector)：判断是否有某个选择器
		// p:has(a),其实就是为selector传入p的context
		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),
		// 匹配包含给定文本的元素
		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),
        // 选择指定语言的所有元素
        // div:lang(en)，会匹配<div lang="en"></div>和<p lang="en-us"></p>
		// 元素是否:lang()选择器表示，仅基于元素的语言值等于标识符C，或者C-
		// 且C的匹配不区分小写，C不一定是有效的语言name
        // 总之是根据如下w3.org提供的方式获取具有lang的元素
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang值必须是有效的identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
					// ??????????????????????????为何迭代parentNode
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),
        // 选择由文档URI的格式化识别码表示的目标元素
        // 如输入http://www.xxx.com/#foo,p:target,会查询到<p id=foo></p>
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},
        // 选择该文档的根元素,html文档中选择的是html元素
        // docElem当前文档
		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
		    // activeElement:返回当前页面中获得焦点的元素,如果没有某个元素获得焦点,则该属性的值为当前页面中的<body>元素
            // document.hasFocus():来判断当前文档中的活动元素是否获得了焦点。
            //          为何(!document.hasFocus || document.hasFocus())判断：因为opera浏览器未实现此方法
            // tabIndex:表示元素（如果可聚焦）是否能够接受输入焦点,通过这这tabIndex值，
            //          可以规定使用键盘方向键或tab键时获取焦点的顺序，可以让div等元素获得焦点
            //        ~tabIndex == tabIndex != -1;~运算，按位取反
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},
        /********************************表单对象属性******************************/
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),
        // 匹配所有选中的被选中元素(复选框、单选框等，select中的option)
		"checked": function( elem ) {
			// css3中，:checked返回checked和selected元素
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},
        // 对于select元素来说，获取选中推荐使用 :selected

		"selected": function( elem ) {
			// 这个主要是为了让Safari默认选项正确
			if ( elem.parentNode ) {
                // selectedIndex表示select中选择<option>的索引
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

        /********************************内容处理******************************/
        // 匹配所有不包含子元素或者文本的空元素
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty 对于element (1) or content nodes (text: 3; cdata: 4; entity ref: 5)返回false,
			//  对于(comment: 8; processing instruction: 7; etc.)返回true
			// nodeType < 6 可以判断empty，因为attributes (2) 不会出现在子节点
            // *********************提供遍历dom的方法
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},
        // 匹配含有子元素或者文本的元素
		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

        /********************************表单元素******************************/
        // 匹配如 h1, h2, h3之类的标题元素
		"header": function( elem ) {
		    // rheader = /^h\d$/i
			return rheader.test( elem.nodeName );
		},
        // 匹配所有 input, textarea, select 和 button 元素
		"input": function( elem ) {
		    // rinputs = /^(?:input|select|textarea|button)$/i,
			return rinputs.test( elem.nodeName );
		},
        // 匹配所有按钮
        // <input type="button" />,<button></button>
		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},
        // 查找所有文本框
		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// 新的html属性值 (如 "search")会被转换为为elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

        /********************************位置判断******************************/
        // 主要是为createPositionalPseudo传递一个函数，选择符合的数组元素
		"first": createPositionalPseudo(function() {
			return [ 0 ];//返回数组第一个元素
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
        // 匹配所有小于给定索引值的元素
		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};
// 将:eq处理转换为nth
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// 增加radio，checkbox，file，password，image的伪类
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// 构造setFilters的简单api
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();
/**
 * 主要是用来转换selector
 * 如$("#div, span>a,.c1:first,input[type = button]")等
 * @type {Sizzle.tokenize}
 */
tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		//只是检查tokenCache中有selector么
		// tokenCache要返回数组，jquery返回groups，用slice(0)返回整个数组
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;	// ATTR,CHILD,PSEUDO
	// 将selector数据全解析完放入groups中
	while ( soFar ) {//假设，soFar = selector = "#div, span>a,.c1:first,input[type = button]"

		// 首先寻找逗号
		// matched：控制循环
		// 第1次循环，matched，match为undefined，创建groups这个二维数组，里面每项是tokens数组
		// 第2次循环，soFar = ", span>a,.c1:first,input[type = button]"，此时matched=#div,但match为true
		// rcomma.exec( soFar ):匹配以"   ,"开头的表达式
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// 将匹配到的match数组从soFar中删除
				// ||soFar，当两个逗号没有内容， soFar.slice( match[0].length )返回""
				// 第2次循环： soFar = ", span>a,.c1:first,input[type = button]"
				//        去除后变为soFar = "span>a,.c1:first,input[type = button]"
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			// 熟悉创建二维数组方式，后面可以直接往tokens中push
			groups.push( (tokens = []) );
		}

		matched = false;

		// 选择符
        // 第3次循环，soFar=">a,.c1:first,input[type = button]"，进入此循环
        // tokens = [value:'>',type:'>']
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// 只是利用了Expr.filter 中的key，此key表明了sizzle引擎能处理是哪些类型
		// matchExpr为匹配ID，TAG，CLASS，ATTR等的正则表达式
		// preFilters为ATTR，CHILD，PSEUDO的过滤器函数
		// 利用正则表达式看能匹配出哪个selector
		// 第1次循环找出#div，matched = #div，故tokens1 = [value:'#div',type:'ID',matches:match]，groups= [tokens1]
		//   通过 soFar.slice( matched.length )，去除#div后，soFar = ", span>a,.c1:first,input[type = button]"
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();//获取匹配项
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );//去除匹配项后的长度
			}
		}
		// match中无数据，退出循环
		if ( !matched ) {
			break;
		}
	}

	// parseOnly表示只是解析，返回soFar长度
	// 否则返回tokens或抛出异常
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// 缓存tokens
			tokenCache( selector, groups ).slice( 0 );
};
/**
 * 获取tokens中对象的value值，并拼接在一起
 * @param tokens
 * @return {string}
 */
function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

/**
 * 根据关系创建函数，如div > p，通过此函数处理>,"",+,~这些关系
 * 其中，matcher为div的匹配函数，combinator，为>,
 * 通过addCombinator联系起来返回一个具有关系的函数，即
 * addCombinator将“>”的处理和“div”关联起来
 * @param matcher
 * @param combinator Expr.relative中的值
 * @param base
 * @return {Function}
 */
function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		// 默认Expr.relative并无next值
		skip = combinator.next,
		key = skip || dir,
		// base为true时，>与""返回ture，+与~返回false
		// checkNonElements字面意思检查是否为元素节点
		checkNonElements = base && key === "parentNode",
		doneName = done++;  //判断是第几个关系选择器
	// 是否为紧邻关系，
	// 如div>p,表示div子代p（紧邻关系），div p（非紧邻），表示div内部所有p
	return combinator.first ?
		// 检查最接近的祖先/前元素
		// 若关系选择器是>或+
		function( elem, context, xml ) {
			// 紧邻关系为何要迭代，有些浏览器会把节点之间换行符看作TextNode
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// 若关系选择器是""或~
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
                // 用以区别不同的执行过程。
                //每次执行addCombinator函数时，done变量都会加1，用以区别生成的不同的位置关系匹配函数。
				newCache = [ dirruns, doneName ];

			// 不能在xml节点上设置任意数据，所以，他们不会受益于缓存
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						// 若elem节点的expando属性不存在，则赋予空对象
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// 避免克隆attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// 分配给newCache，所以，结果返回到以前元素
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// 重新使用
							uniqueCache[ key ] = newCache;

							// 匹配则结束，未匹配继续检查
                            // newCache = [ dirruns, doneName ,matcher];
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

/**
 * 无伪类的匹配器匹配器，执行每个matchers函数返回true或false
 * @param matchers 每个元素都是非伪类的匹配器执行函数
 * @return {Function}   仅仅返回true或false，而非jquery对象
 */
function elementMatcher( matchers ) {
	// matchers.length =1表示只有基础匹配函数，直接返回自己
	return matchers.length > 1 ?
		// 多匹配器情况下，要elem全部符合匹配器规则
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;    // 匹配传入的elem节点是否满足要求，全部满足返回true
		} :
		matchers[0];
}

/**
 * setMatcher中，处理setMatcher第二个参数，将selector再传入Sizzle中解析
 * 返回selector查询到的结果
 * @param selector
 * @param contexts
 * @param results
 * @return {*}
 */
function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

/**
 * 通过filter先过滤出一些满足filter的元素
 * @param unmatched
 * @param map
 * @param filter
 * @param context
 * @param xml
 * @return {Array}
 */
function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

/**
 * 伪类分割器
 * 假如选择器$("div:first p")
 * @param preFilter		[baseMatch,funDiv]
 * @param selector		first的前置selector，即div
 * @param matcher		first的matcher函数
 * @param postFilter	false
 * @param postFinder	选取tokens数组伪类之后部分，传入参数为[baseMatch,funP]
 * @param postSelector	将tokens用toSelector拼接为selector
 * @return {*}
 */
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	// 后置匹配器postFinder存在，且无伪类，则将postFinder用setMatcher包装
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// 从seed或context中获取初始化参数
			// elems为匹配到的节点；
			// multipleContexts主要是将伪类的前置选择器（div）代入Sizzle函数中查询
			// 本例，elems查询到的为div.rex和div.aaa
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// 利用预处理器进行匹配，主要是保证seed结果同步
			// 对于本例子，seed不存在，故matcherIn返回elems
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,
			// 注意多个三元表达式连接时顺序；通过代码层级也可得知
			// matcherOut = matcher ?（postFinder || (() ? [] :results)） ：results
			matcherOut = matcher ?
				// 如果存在postFinder，或filtered seed，non-seed postFilter，preexisting results
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// 中间处理是必要的。
					[] :

					// 否则直接用results结果
					results :
				matcherIn;
		// 针对$("div:first p")，此处matcher其实是:first的matcher
		// matcher为Expr.pseudos.first,matcher中会根据内部内容修改matcherIn，matcherOut这些传入参数
		// 因此matcher运行完，matcherIn = (2) [false, div.aaa], matcherOut = [div.rex]
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// 此例postFilter为fasle
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// 如果postFinder定义了， 则通过postFinder为结果集添加元素
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			// postFinder存在，调用postFinder会接着运行setMatcher，因为postFinder被postFinder包裹
			// 因为通过第一次setMatcher，匹配出matcherOut，即div:first是哪个元素，div.rex
			// 相当于此时再次调用setMatcher函数，是将context改为div.rex去查询符合的p
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}
/**
 * 针对一个块（不包含逗号分隔的选择器字符串）选择器生成匹配函数
 * 1. 针对不同类型的选择器产生不同的执行函数
 * 2. 若包含伪类，则返回setMatcher，否则返回的是elementMatcher，
 * 3. 通过鉴别matcher是否包含expando属性来区别是否有伪类
 * 4. 充当了selector“tokens”与Expr中定义的匹配方法的串联与纽带的作用
 * 5. 只是生成匹配函数，并未执行，最后统一执行
 * 如选择器$("div:first p,.rex > a")
 * 第1次迭代".rex > a"对应的tokens(match)数组
 * 第2次迭代"div:first p" 对应的tokens(match)数组
 * @param tokens 选择器按逗号分组，tokens为[object,object,object]
 * @return {*}
 */

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],//获取关系
		//当获取不到关系给一个隐形关系parentNode
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// 基本匹配，确保元素从最顶层的context可找到
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		// 确定元素在哪个context，也是最后一个执行的匹配器
		// matchers[0]为一函数，通过判断checkContext.nodeType返回matchContext或matchAnyContext
		// 假设这个基础match函数为baseMatch，故matchers=[baseMatch]
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
			// 避免挂在元素上(issue #299)
			checkContext = null;
			return ret;
		} ];
	// 第2次循环，处理"div:first p"这个token数组时，len=4;
	// i = 0时，处理div，生成matchers函数为funDiv，此时matchers为[baseMatch,funDiv]
	for ( ; i < len; i++ ) {
		// 如果有父子选择器（关系选择器）
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// 处理伪类(由markFunction创建的，才有expando属性)
			// 只是返回函数并不运行
			// 假设此时选择器$("div:first p")
			// i = 0时，处理div，生成matchers函数为funDiv，此时matchers为[baseMatch,funDiv]
			// i = 1时，处理:first，此时i=1，经过j =++i，i与j都为2，此时Expr.relative[ tokens[j].type，
			//          表示的为""（div:first后的子代选择器），故为true，退出当前循环，返回setMatcher，参数分别为：
			//          参数1：[baseMatch,funDiv]
			//          参数2：:first的前置selector，即div，toSelector里面的替换
			//                    只是针对类似 "div :first"这样的选择器的特殊处理，并未改变tokens数组长度
			//           参数3: :first的matcher函数
			//           参数4: :false
			//           参数5: :选取tokens数组伪类之后部分，此时伪类为i=1,故选取j=2以后部分，
			//                    即p元素，将p元素再传入matcherFromTokens进行解析得到一系列函数，
			//                    针对$("div:first p")情况，传入参数为[baseMatch,funP]
			//           参数6：将tokens用toSelector拼接为selector
			// setMatcher会返回一个markFunciton函数，这只是定义函数，这时
			// 伪类后面的选择器直接传入到setMatcher中，并将setMatcher返回的markFunction函数返回到complie中的setMatchers中
			if ( matcher[ expando ] ) {
				// 判断伪类后是否还有operator
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// 如当前位置之前的token是一个后代组合，插入隐含的*
						// 类似 "div :first"这样的选择器，传入setMatcher为div *
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					// 从tokens的j元素选取，即伪类后面元素
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}
	// elementMatcher，即是循环matchers(elem, context, xml),返回true或false
	return elementMatcher( matchers );
}

/**
 *  将不同的块选择器生成的最终执行函数，该函数还负责将最终结果过滤掉重复对象。
 * @param elementMatchers
 * @param setMatchers
 * @return {superMatcher}
 */
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		// seed,context首次调用未改变，故seed为undefined，context为document
		// xml:true，or false，是否为html
		// result:select方法中查找结果集，sizzle函数不只允许1次，故首次调用results为[]
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// 必须总是具有seed或外部context
				// 确定起始查找范围或是参数中传递过来的备选种子seed,或是搜索范围context的所有后代节点
				// 如seed集合不存在，elems则是html中全部tag，通过一个个循环匹配elementMatchers函数
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				//使用整数dirruns当且仅当这是最外面的匹配
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// elementMatchers匹配成功的元素直接加入到result集合中
			// 因为没有seed集合，elems为html全部tag，逐个匹配matcher函数，看哪个元素节点符合匹配函数
			// elem循环次序，html，head，meta，title，body，div.rex等等
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					// 执行elementMatchers函数
					// 此时的elementMatchers为".rex > a"对应的编译函数，
					// 因为被层层包裹为elementMatcher ([addCombinator(elementMatcher( [baseMatch,RexFuc] ), Obj>),aFuc]
					// 实际elementMatchers.length = 1；
					// (matcher = elementMatchers[j++])将elementMatcher返回函数赋给matcher
					// matcher( elem, context || document, xml),循环执行matchers，运行（elementMatcher函数），详细参见function elementMatcher( matchers )
					// 如匹配不到，matcher返回false，j=1，再循环一次，此时elementMatchers[1]为undefined，while循环为false，退出循环
					// 故matchedCount--
					// 如匹配到,matcher返回true,将elem加到results里面，然后退出循环，故此时!matcher为false
					// 故matchedCount不在进行--操作
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// 追踪未匹配元素
				// 如selector存在伪类，则bySet>0,matchedCount
				if ( bySet ) {
					// 当有matcher函数返回为true时
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` 现在是上面访问元素的个数，把他与matchedCount加在一起，使matchedCount非负
			// 如不存在伪类，bySet为false，故matchedCount==i，上面循环会找到全部elementMatchers元素
			matchedCount += i;

			// 对unmatched元素应用set过滤器
			// NOTE: 如无未匹配元素，则跳过（如matchedCount ==i），
			// 除非上述循环中因为无seed或无元素matchers造成未访问任何元素
			if ( bySet && i !== matchedCount ) {
				j = 0;
				// 无seed时，unmatched为seed&&[]，故为undefined，setMatched为[]
				while ( (matcher = setMatchers[j++]) ) {
					// unmatched：为传入setMatcher的seed
					// setMatched:为[]
					// context:document
					// xml :为true或false
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// 将matches加入result结果集
				push.apply( results, setMatched );

				// 对结果去重和排序
				// 例如$("div:first a,.rex > a")查询到的可能是同一个a标签，
				// 这样results中有两个一样的a，因此通过Sizzle.uniqueSort将重复的去掉
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// 用嵌套匹配函数覆盖全局函数
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

/**
 * 创建编译函数
 * 如对于$("div:first p,.rex > a"),第1分组push到setMatchers，第2分组push到elementMatchers
 * @type {Sizzle.compile}
 */
compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		// 查询当前选择器是否有被处理并保存在缓存compilerCache中
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// 如果没有被词法解析先进行词法解析
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		// 第1次迭代".rex > a"对应的tokens(match)数组
		// 第2次迭代"div:first p" 对应的tokens(match)数组
		while ( i-- ) {
			// 根据tokens返回matcher函数
			cached = matcherFromTokens( match[i] );
			// 如果选择器中有伪类的选择器压入setMatchers，
			// cached[expando]在生成匹配器函数(markFunction)的时候就判断是否有伪类而赋值了
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			//普通选择器压入elementMatchers
			} else {
				elementMatchers.push( cached );
			}
		}
		// 根据matcherFromTokens的分析
		// cached[0]为elementMatcher包裹的[baseMatch,funA]
		// cached[1]则是elementMatcher的[ [baseMatch,funDiv],funP]，而[baseMatch,funDiv]因为存在关系>,又被
		// 又被包裹addCombinator(elementMatcher())
		// 缓存编译函数
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// 缓存selector
		cached.selector = selector;
	}
	return cached;
};

/**
 * Sizzle()解析不了传给此函数，此函数首先处理无分组selector的某些情况
 * 然后传给Sizzle.compile解析
 * @param {String|Function} selector或由Sizzle.compile预编译的selector函数
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];	//

	// match中无分组(无逗号分隔情况下)，在编译前（执行complie函数）缩小范围
	if ( match.length === 1 ) {

		// 缩小文档查找范围，selector第一个为id，第二个为关系选择器(> + ~  )
        // 对于$("#div > .p > a +b")，通过token[0]的id选择器，将context从document缩小为div#div.p
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// 预编译matcher需要验证祖先，所以context提高为parentNode
			} else if ( compiled ) {
				context = context.parentNode;
			}
            // 去掉第一个token，即id
			selector = selector.slice( tokens.shift().value.length );
		}

		// 缩小备选种子范围,从右向左匹配
        // 第一个token是[>+~]关系选择器，或整个选择器中有sizzle自定义伪类,i为0，不进行循环
        // 故，处理的是，第一个token不是关系选择器，且整个选择器无sizzle自定义伪类
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		// 如对于  $("div > .p  > a + b ")，第一次tokens[7]为b这个group（通过tokenize解析过的）
		// 循环主要是处理$("div > .p > a +b:first-child ")情况，将:first-child跳过，去查询b
		while ( i-- ) {
			token = tokens[i];

			// 遇到关系选择器则终止循环
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			// 处理type为ID/CLASS/TAG的token,这些方法在setDocument中定义
			if ( (find = Expr.find[ type ]) ) {
				// find是Expr.find返回的函数，形如function( tag, context )
				// 如查询到b，则seed中有值，否则为0，最后一个元素查询不到则不会有result
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
						// rsibling = /[+~]/,
						// aa && bb || cc ===>(aa && bb) || cc
						// testContext判断是否为有效的sizzle上下文
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// 如seed为空，或无tokens，直接返回
					// tokens删除i这个元素
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );	// 将tokens拼接为selector
					// seed=0表示未找到b元素，故results为空
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// 如编译函数不存在，编译执行一个过滤函数
	// 如上面更改了selector，通过提供match避免retokenization
	// compiled存在，直接运行compiled(seed,context....)
	// compiled为false，运行compile生成cache,cache为最终匹配函数，运行cache(seed,context....)
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// 一次性操作

// 排序稳定性
// 若经某算法排序5A，5B的相对顺序有可能改变（如原来是"...5A...5B..."，排序后有可能变成"...5B...5A..."），就是不稳定排序
// split后为字符数组，按照ascii码进行排序，sortOrder只是在ab相等时，改变hasDuplicate=true
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// 如未传递比较函数，总是假定重复；hasDuplicate总是赋值为true
support.detectDuplicates = !!hasDuplicate;

// 初始化默认文档
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// 侦测节点混淆问题
support.sortDetached = assert(function( el ) {
	// 应该返回1，但是返回4；1会返回true，4会返回false
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// 防止attribute/property“插值”
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
//  使用默认值代替getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// 当getAttribute出问题时，使用 getAttributeNode
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// 过时的
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;		// 用于检索DOM节点数组的文本值的工具函数
jQuery.isXMLDoc = Sizzle.isXML;		// 检测xml节点
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;


/**
 * parent，parents等调用的内部函数
 * @param elem
 * @param dir       方向，parentNode、nextSibling、previousSibling等
 * @param until
 * @return {Array}
 */
var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
		    // 如elem是until则返回，不添加到matched数组中
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};

// 查找同辈元素
// ************ 并不是在当前元素分别向前和向后查找同辈元素
// 而是先选取elem.parent.firstChild，然后一直查询nextSibling，并排除自身
var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;


// 判断elem的nodeName是否为name
function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
// 匹配单独标签,\1为前一个括号的反向引用，(?:<\/\1>|)不反回到exec数组中
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

/**
 * 提取not与filter函数的公共部分,负责过滤元素集合
 * @param elements	待过滤的元素集合
 * @param qualifier 用于过滤元素集合elements，可选值有函数、DOM元素、选择器表达式、DOM元素数组、jQuery对象。
 * @param not
 * @return {*}
 */
function winnow( elements, qualifier, not ) {
	// 如qualifier为函数，则在elements每个元素上调用此函数
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			// 如not为true，则表示选取elements不满足qualifier的值，故elem不满足时返回false
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// 如果参数qualifier是DOM元素，DOM元素，则直接
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// elements为Arraylike类型，如 (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// 简单的selecotr直接调用jQuery.filter
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// 复杂的selector，比较两个数据集
	// 首先过滤出满足qulifiler的elements集合a，元素elements集合为b
	// 再在b中查询a
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

/**
 * 使用指定的选择器表达式expr对元素集合elems进行过滤，并返回过滤结果。
 * 如果参数not是true，则保留不匹配元素，否则默认保留匹配元素。
 * @param expr
 * @param elems
 * @param not
 * @return {*}
 */
jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		// matchesSelector主要是判断浏览器是否之后matches方法，不支持则调用Sizzle函数
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}
	//过滤数组，返回新数组,满足后面function的添加到数组中
	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};
// not，filter，is函数并不知能传入字符串
jQuery.fn.extend( {
	// 对于$()的某些情况也会调用此方法
	find: function( selector ) {
		var i, ret,
			len = this.length,// 表示$()选择到的dom数量
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			// jQuery.find = Sizzle;
			jQuery.find( selector, self[ i ], ret );
		}
        // jQuery.uniqueSort()分类，删除重复
		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	// 筛选出与指定表达式匹配的元素集合
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	// 根据selector来检测匹配元素集合，如果其中至少有一个元素符合这个给定的表达式就返回true
	// *****************************通过判断winnow.length，返回true与false，则判断是否有要检测的对象
	is: function( selector ) {
		return !!winnow(
			this,

			// 如这参数是位置或关系选择器，检查返回集合的元素，保证
			// $("p:first").is("p:last") 不会返回true
			// rneedsContext.test( selector )用来匹配位置或关系选择器
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// 初始化jQuery对象


// rootjQuery = jQuery( document );
var rootjQuery,
	//正则匹配id与html标记
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	// jQuery 根据对参数的处理结果来判断出你使用 $ 的意图
	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;
		// HANDLE: $(""), $(null), $(undefined), $(false)，增加程序的健壮性
		if ( !selector ) {	//将 selector 转成布尔值,如是上述值，jQuery不做任何操作
			return this;
		}

		// 默认root为document,但可以传入其他root，主要是用来支持jQuery.sub
		root = root || rootjQuery;

		// 如selector为string
		if ( typeof selector === "string" ) {
			// 处理$('<rextao>')等情况
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {//开头结尾分别为<>，并且<>中间至少有一个字符
				//如是html标签组，不需要正则
				match = [ null, selector, null ];

			} else {// 匹配$('#rex')或
					// $('<rextao></asdf>')，总之以<开头以>结尾即可
					// 根据rquickExpr可知，第一种情况(group1)match[1]=undefined,第二种情况(group2)match[2]=undefined
				match = rquickExpr.exec( selector );
			}

			//匹配到html或id（未指定上下文环境）
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array),match = rquickExpr.exec( "#id" ),mathc[1]=undefined
				if ( match[ 1 ] ) {//匹配类似$('<rextao></asdf>')
					context = context instanceof jQuery ? context[ 0 ] : context;

					// 当运行scripts为true时的向上兼容方案
					// 如parseHTML不存在时会抛出错误
                    // $.merge() 函数用于合并两个数组内容到第一个数组。
					// jQuery.parseHTML = function( data, context, keepScripts )
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					// 根据html创建临时dom，如$('<div></div>',{id:'rextao'})
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						// 此时for..in循环，match表示的是context的key，对于$('<div></div>',{id:'rextao'})则是id
						for ( match in context ) {

							// 如context存在函数，则调用，如$('<div></div>',{id:'rextao',"click":function(){}})
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// 不是函数则设置为属性
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {//rquickExpr.exec("#id"),match[1]=undefined，match[2]=id
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// 将元素直接插入jQuery对象
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...)) ？？？？？？？？？？？？？？
			// !context处理是的，如$("div"),此时上述match不存在，context也存在,在root域中寻找div
			// context.jquery处理的是，context为jquery对象情况，
			// 如$("div",$()),此时上述match不存在,context存在且是jQuery对象，
				// 可以使用jQuery的find方法在context中查找div
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// 相当于$(context).find(expr)
			} else {// context不是jQuery对象，利用constructor将context构建为jQuery对象
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {//当传入DOM 对象时，表明当前 jQuery 数组对象拥有一个元素
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready,$传入一个函数时，会当dom加载完毕后立即运行此函数
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				// 如selector是function则在root下运行selector
				// jQuery.fn.ready = function( fn ) {
				root.ready( selector ) :

				// 如root.ready函数不存在，则立即执行，参数为jquery对象
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );//将selector与this合并
	};

init.prototype = jQuery.fn;

// 初始化核心引用
rootjQuery = jQuery( document );

// 用于反序parents与prev开头的
var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// 保证唯一性
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};
/*has、closest、index、add、addBack*/
jQuery.fn.extend( {
    // 保留包含特定后代的元素
    // 因为targets为jQuery(target,this)，在this的context下查找target
	has: function( target ) {
	    // jQuery = function( selector, context )
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},
    // 从元素本身开始，逐级向上级元素匹配，并返回最先匹配的元素
	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// 当无selection上下文时，位置选择符不匹配
        // 即对于jQuery自定义伪类（(even|odd|eq|gt|lt|nth|first|last），直接返回空
        // 对于parent不存在even等
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// 总是跳过framents
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// 不要将非elements元素传给Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// 检查集合中某个元素的位置
	index: function( elem ) {

		// 不传递参数，返回这个元素在同辈中的索引位置。
        // 对于$()返回集合>1，则$().index()返回的是第一匹配元素位置
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// 针对elem为选择器
        // $('.group1').index('p'),返回的是.group1在p中的位置
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// 针对elem为jquery对象
        // $('p').index($('.group1'))，返回是jquery对象相对于前面p而言的位置
		return indexOf.call( this,

			// 如果elem为jQuery对象，则使用第一个元素。
			elem.jquery ? elem[ 0 ] : elem
		);
	},
    // 把与表达式匹配的元素添加到jQuery对象中
	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
			    // merge是用来合并数组的
                // 注意：jQuery.merge( this.get(), jQuery( selector, context ) ):返回的是纯数组，因为this.get()获得的是this数组
                // jQuery.merge( this, jQuery( selector, context ) ):返回的是jQuery对象
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},
    // 把堆栈顶层元素加到当前this集合中
    // $('span').parent().find('a').addBack(),返回的是[div.rex,a]
    // 如无addBack()则只是a
    // 传入参数selector，则在preObject中查询此selector
	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );
// dir是循环多次，求结果
// sibling则只是循环找到elements则结束
function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}
// dir即是返回elem的（parentNode、previousSibling）数组集合
jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
    // parentsUntil与parents的区别，不传入参数时，两者一致
    // 如传入参数，则如parentsUntil('html')不包含html元素，但parents('html')返回数组包含html元素
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
    // 查找当前元素之前所有的同辈元素
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	// 找出元素之前的同辈元素
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	// 找出同辈元素
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	// 所有子元素的元素集合
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	// 查找匹配元素内部所有的子节点（包括文本节点）。
	// 如果元素是一个iframe，则查找文档内容
	// 因为查找包含文本节点，故不适用siblings
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // 在不支持的浏览器中，将模板元素视为常规元素
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		// 用this通过fn转换为一个matched数组，
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}
		// 如传入参数，即类似$('span').parents('.rex');故需要将match集合用filter过滤
		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// 去重
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// 反序parents与prev开头的
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );


// 匹配空白
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );
// 将字符串格式的options转为object格式
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * 一个多用途的回调列表对象，提供了强大的的方式来管理回调函数列表。
 * 使用如下参数，构建一个callbasc列表
 *
 *	options: 传入options会改变回调列表的行为方式
 *
 * 默认的回调列表充当事件回调列表，并且可以fired多次
 *
 * 可选的options:
 *
 *	once:			确保回调列表只能fired一次（如Deferred）
 *
 *	memory:			保存之前的值，当新函数add到list时，无需fire，自动执行
 *
 *	unique:			确保callback只能被添加一次（list中无重复的）
 *
 *	stopOnFalse:	当回调返回false时，中断调用
 *
 */
jQuery.Callbacks = function( options ) {

	// 如需要将字符串格式的options转为object格式
	options = typeof options === "string" ?
        // 将字符串格式的options转为object格式
        // 类似options=memory，则转换为options.memory = true
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // list是否现在firing的标识
		firing,

		// 对于 non-forgettable lists最后一个fire值
        // $.Callbacks("memory"),调用过fire后，再add会自动调用fire
        // add函数中有设置，即memory为true，则调用fire()
		memory,

		// list是否已经fired
		fired,

		// 阻止firing的标识
		locked,

		// 实际的回调列表
		list = [],

		// 主要是存放memory值
		queue = [],

		// 当前调用的回调index ，如需要会被add或remove修改
		firingIndex = -1,
        // fire() 方法作为私有方法被封装在函数中,外部不可直接访问
        // 因此像 memory、firing、fired 这些状态对于外部上下文来说是不可更改的
		fire = function() {

			// 如otions.once设置，表示只能fire一次，设置loacked值
			locked = locked || options.once;

			// 执行list中的全部回调函数
			fired = firing = true;
            // 当callback.fire()方法调用时，fireWith会将[context,arugments]，push到queue中，queue.length=1
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
                // 根据fireWith的分析， memory[ 0 ], memory[ 1 ]分别为context与arugments
				while ( ++firingIndex < list.length ) {

					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// stopOnFalse为true，则跳到list最后，
                        // 再调用add，也不会再次fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// 如未传入memory参数，则将memory设置为false
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// 保留一个空list，为了之后再添加回调时使用
				if ( memory ) {
					list = [];

				} else {
					list = "";
				}
			}
		},

		// 实际的回调对象
		self = {

			// 添加回调或回调集合到list中
			add: function() {
				if ( list ) {

					// 如options为memory参数，应在add后直接firing
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}
                    // 将add参数arguments传入这个立即运行函数
                    // 如args为([bar,[foo,foo1]])，each循环2次，第一次为bar
                    // 第二次为[foo,foo1]，通过递归，将这个数组再次调用add()
                    // 最后将bar,foo,foo1添加到list中
                    // arguments比较特殊，如参数为[1,2,3],但arguments.length=1,故each不会循环多次
					// ????????????????????????????对于Zepto源码，此处立即调用表达式是否也无突出好处？？？？？？？？？？？？？只是实现方式一种
					// add = =function(args){};add(arguments)
					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
							    // options.unique只能添加一个回调（不能有重复的）
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
                                // 如args是嵌套数组，则需要用递归将参数全部加入到list中
								// 检查递归
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// 删除list中的一个回调
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// 检查一个回调是否在list中
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// 清空list中的所有回调
            // 直接将list=[]则是清空
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// 禁用 .fire and .add
			// 禁用回调列表中的回调
			// 与lock主要区别是，不会判断！mermory与！firing
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// 禁用 .fire
			// 禁用fire同时会禁用add，除非设置了options=memory
			// 锁定一个回调列表，以避免进一步的修改列表状态
            // 即，lock之后，fire不会再有函数运行结果
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// 访问给定的上下文和参数列表中的所有回调
			fireWith: function( context, args ) {
			    // callback调用lock()方法后，locked=[]
				if ( !locked ) {
					args = args || [];
					//**************************************************
					// 给出如如何判断args是否为数组
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// 用给定的arguments调用list中的所有回调函数
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// 判断list是否调用过fire
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}
// jQuery.when使用的回调工厂
function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// 检查value值是否为promise，Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// 其他 thenables值类型
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// 非thenables值类型
		} else {

			// 通过数组控制 `resolve`参数个数
			// slice函数会将boolean的noValue值转换为integer
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// 对于Promises/A+, 将exceptions转换为rejections
	// 因为jQuery.when并不会展开thenables，我们可以跳过额外的检查，然后有条件的拒绝
	} catch ( value ) {

		// Support: Android 4.0 only
		// 严格模式下，函数调用.call/.apply获取不到全局对象上下文
		reject.apply( undefined, [ value ] );
	}
}

/**
 * 延迟对象 : 对异步的统一管理
 */
jQuery.extend( {

Deferred: function( func ) {
	//  创建三个$.Callbacks对象，分别表示成功，失败，处理中三种状态
	//  创建过程在下面的jQuery.each，此数组只是抽取公共部分，方便处理
	var tuples = [

			// action, add listener, callbacks,
			// ... .then handlers, argument index, [final state]
			// "memomry"：保存之前的值，当新函数add到list时，无需fire，自动执行
			// "once" : 确保回调列表只能fired一次（如Deferred）
			[ "notify", "progress", jQuery.Callbacks( "memory" ),
				jQuery.Callbacks( "memory" ), 2 ],
			[ "resolve", "done", jQuery.Callbacks( "once memory" ),
				jQuery.Callbacks( "once memory" ), 0, "resolved" ],
			[ "reject", "fail", jQuery.Callbacks( "once memory" ),
				jQuery.Callbacks( "once memory" ), 1, "rejected" ]
		],
		state = "pending", // deferred默认状态
		// promise是deferred的一种简化形式（去掉了改变状态的接口）
		promise = {
			state: function() {
				return state;
			},
			// 函数列表总是执行
			always: function() {
				deferred.done( arguments ).fail( arguments );
				return this;
			},
			"catch": function( fn ) {
				return promise.then( null, fn );
			},

			// 保留 pipe 函数以备用
			pipe: function( /* fnDone, fnFail, fnProgress */ ) {
				var fns = arguments;
				// newDefer可以看作是newDefer = $.Deferred();
				return jQuery.Deferred( function( newDefer ) {
					jQuery.each( tuples, function( i, tuple ) {

						// Map tuples (progress, done, fail) to arguments (done, fail, progress)
						var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];
						// 给父deferred对象的[ done | fail | progress ]方法都增加一个过滤函数的方法
						// deferred.progress(function() { bind to newDefer or newDefer.notify })
						// deferred.done(function() { bind to newDefer or newDefer.resolve })
						// deferred.fail(function() { bind to newDefer or newDefer.reject })
						deferred[ tuple[ 1 ] ]( function() {
							var returned = fn && fn.apply( this, arguments );
							if ( returned && jQuery.isFunction( returned.promise ) ) {
								returned.promise()
									.progress( newDefer.notify )
									.done( newDefer.resolve )
									.fail( newDefer.reject );
							} else {
								newDefer[ tuple[ 0 ] + "With" ](
									this,
									fn ? [ returned ] : arguments
								);
							}
						} );
					} );
					fns = null;
				} ).promise();
			},
			/**
			 * ?????????????????????对实现并不理解，关键是其中resolve函数是实现promiseA规范的
			 * 理解的则是deferred是具有promise特性的callback回调序列
			 * @param onFulfilled	resolve时调用的回调函数
			 * @param onRejected	reject时调用的回调函数
			 * @param onProgress	progress()方法调用的回调函数。
			 * @return {*}		deferred.promise()即deferred的简易版本
			 */
			then: function( onFulfilled, onRejected, onProgress ) {
				var maxDepth = 0;
				// 在then的return中调用了resolve函数，以第一个举例
				// depth:0,deferred=newDefer，handler：onProgress,special:newDefer.notifyWith
				function resolve( depth, deferred, handler, special ) {
					return function() {
						var that = this,
							args = arguments,
							mightThrow = function() {
								var returned, then;

								// Support: Promises/A+ section 2.3.3.3.3
								// https://promisesaplus.com/#point-59
								// 忽略多次解决尝试
								if ( depth < maxDepth ) {
									return;
								}

								returned = handler.apply( that, args );

								// Support: Promises/A+ section 2.3.1
								// https://promisesaplus.com/#point-48
								// If promise and x refer to the same object, reject promise with a TypeError as the reason.
								if ( returned === deferred.promise() ) {
									throw new TypeError( "Thenable self-resolution" );
								}

								// Support: Promises/A+ sections 2.3.3.1, 3.5
								// https://promisesaplus.com/#point-54  Let then be x.then
								// https://promisesaplus.com/#point-75
								// 仅检索 `then` 一次
								then = returned &&

									// Support: Promises/A+ section 2.3.4
									// https://promisesaplus.com/#point-64
									// If x is not an object or function, fulfill promise with x.
									( typeof returned === "object" ||
										typeof returned === "function" ) &&
									returned.then;

								// Handle a returned thenable
								if ( jQuery.isFunction( then ) ) {

									// Special processors (notify) just wait for resolution
									if ( special ) {
										then.call(
											returned,
											resolve( maxDepth, deferred, Identity, special ),
											resolve( maxDepth, deferred, Thrower, special )
										);

									// Normal processors (resolve) also hook into progress
									} else {

										// ...and disregard older resolution values
										maxDepth++;

										then.call(
											returned,
											resolve( maxDepth, deferred, Identity, special ),
											resolve( maxDepth, deferred, Thrower, special ),
											resolve( maxDepth, deferred, Identity,
												deferred.notifyWith )
										);
									}

								// Handle all other returned values
								} else {

									// Only substitute handlers pass on context
									// and multiple values (non-spec behavior)
									if ( handler !== Identity ) {
										that = undefined;
										args = [ returned ];
									}

									// Process the value(s)
									// Default process is resolve
									( special || deferred.resolveWith )( that, args );
								}
							},

							// Only normal processors (resolve) catch and reject exceptions
							process = special ?
								mightThrow :
								function() {
									try {
										mightThrow();
									} catch ( e ) {

										if ( jQuery.Deferred.exceptionHook ) {
											jQuery.Deferred.exceptionHook( e,
												process.stackTrace );
										}

										// Support: Promises/A+ section 2.3.3.3.4.1
										// https://promisesaplus.com/#point-61
										// Ignore post-resolution exceptions
										if ( depth + 1 >= maxDepth ) {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Thrower ) {
												that = undefined;
												args = [ e ];
											}

											deferred.rejectWith( that, args );
										}
									}
								};

						// Support: Promises/A+ section 2.3.3.3.1
						// https://promisesaplus.com/#point-57
						// 立即重新承诺，避免错误的拒绝。
						if ( depth ) {
							process();
						} else {

							// Call an optional hook to record the stack, in case of exception
							// since it's otherwise lost when execution goes async
							if ( jQuery.Deferred.getStackHook ) {
								process.stackTrace = jQuery.Deferred.getStackHook();
							}
							window.setTimeout( process );
						}
					};
				}
				// 最终返回的是$.Deferred(func).promise();
				// 根据deferred对象构建中，func.call(deferred,deferred);
				// 因此newDefer指向构建好的jQuery.Deferred对象
				return jQuery.Deferred( function( newDefer ) {

					// progress_handlers.add( ... )
					tuples[ 0 ][ 3 ].add(
						resolve(
							0,
							newDefer,
							jQuery.isFunction( onProgress ) ?
								onProgress :
								Identity,// 返回参数
							newDefer.notifyWith
						)
					);

					// fulfilled_handlers.add( ... )
					tuples[ 1 ][ 3 ].add(
						resolve(
							0,
							newDefer,
							jQuery.isFunction( onFulfilled ) ?
								onFulfilled :
								Identity
						)
					);

					// rejected_handlers.add( ... )
					tuples[ 2 ][ 3 ].add(
						resolve(
							0,
							newDefer,
							jQuery.isFunction( onRejected ) ?
								onRejected :
								Thrower
						)
					);
				} ).promise();// 返回新的promise对象
			},

			// 为deferred对象获得一个promise
			// 如obj设置了，则将deferred对象添加到这个对象上
			// 未传入参数则直接返回promise
			promise: function( obj ) {
				return obj != null ? jQuery.extend( obj, promise ) : promise;
			}
		},
		deferred = {};

	// 针对tuples 元素集
	// 把相同有共同特性的代码的给合并成一种结构，然后通过一次处理
	// 分别创建a.done,a.progress,a.fail(var a = $.Deferred();)
	jQuery.each( tuples, function( i, tuple ) {
		//  i= 0时，为[ "notify", "progress", jQuery.Callbacks( "memory" ),jQuery.Callbacks( "memory" ),2 ]
		//  list = tuple[ 2 ]，相当于$.Callbacks("once memory");这一列
		// callbacks数组,创建不同的Callback对象
		// 假设三个列表分别为,progressCallback（进度回调列表）,doneCallback（成功回调列表）,failCallback（失败回调列表）
		var list = tuple[ 2 ],
			stateString = tuple[ 5 ];// 最终状态，只有i=1,i=2存在

		// promise.progress = progressCallback.add
		// promise.done = doneCallback.add
		// promise.fail = failCallback.add
		// 就是为promise赋jQuery.Callbacks
		promise[ tuple[ 1 ] ] = list.add;// $.Callback()回调对象的add方法

		// 处理状态，为resolved和rejected两种状态的列表添加预设回调函数
		if ( stateString ) {
			// 将3个函数添加到list中
			list.add(
				function() {// 为list添加当前状态标识函数

					// state = "resolved" (i.e., fulfilled)
					// state = "rejected"
					state = stateString;
				},

				// 为doneCallback，添加failCallback.disable
				// 为failCallback，添加为doneCallback.disable
				// 主要目的是禁止修改状态，如已经成功(i=1时)，则需要将reject列表禁用，不能再执行失败函数
				tuples[ 3 - i ][ 2 ].disable,// 禁用 .fire and .add

				// progress_callbacks.lock
				// 锁定notify列表，即notify列表fire方法不能被调用，但因为callback的options为memory
				// 故还可以调用add方法
				tuples[ 0 ][ 2 ].lock	// 禁用 .fire
			);
		}

		// progress_handlers.fire
		// fulfilled_handlers.fire
		// rejected_handlers.fire
		// 这之后，相当于为list添加了4个函数（对于有stateString状态的）
		list.add( tuple[ 3 ].fire );

		// deferred.notify = function() { deferred.notifyWith(...) }
		// deferred.resolve = function() { deferred.resolveWith(...) }
		// deferred.reject = function() { deferred.rejectWith(...) }
		// 执行deferred.notifyWith(...)并返回this
		deferred[ tuple[ 0 ] ] = function() {
			deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
			return this;
		};

		// deferred.notifyWith = list.fireWith
		// deferred.resolveWith = list.fireWith
		// deferred.rejectWith = list.fireWith
		// fireWith:访问给定的上下文和参数列表中的所有回调
		// resolveWith/rejectWith/notifyWith 是 callbacks.fireWith 队列方法引用
		deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
	} );
	// 上面foreach整个循环完，deferred包含notify,notifyWith,reject,rejectWith,resolve,resolveWith,6个函数
	// promise对象增加了progress，done，fail三个函数(其实就是list.add函数)，done,fail因为是Callback，里面list有4个函数

	// 将3个tuples全部处理完后的promise合并到deferred
	promise.promise( deferred );

	// 如传入参数则调用，then方法就传入了func
	// 则将构建好的deferred作为执行对象和参数，在then方法中就有调用
	if ( func ) {
		func.call( deferred, deferred );
	}

	// 返回deferred对象
	return deferred;
	//小结，
	// 因此deferred.done,deferred.fail,deferred.progress其实就是不同$.callbacks().add()方法
	// deferred.resolve,deferred.reject,deferred.notify，其实是调用的$.callback().fireWith()
	// promise对象是deferred的简易版，没有上述6个函数，故无法改变状态
},

/**
 * 提供一种方法来执行一个或多个对象的回调函数，返回这些对象的延时（Deferred）对象。
 * 1、无参数， jQuery.when()将返回一个resolved（解决）状态的promise对象。
 *
 */
when: function( singleValue ) {
	var

		// 参数个数
		remaining = arguments.length,

		// 未处理的参数个数
		i = remaining,

		resolveContexts = Array( i ),
		resolveValues = slice.call( arguments ),// 将参数类数组转换为数组

		// 主Deferred对象
		master = jQuery.Deferred(),

		// 次要回调工厂
		updateFunc = function( i ) {
			return function( value ) {
				resolveContexts[ i ] = this;
				resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
				if ( !( --remaining ) ) {
					master.resolveWith( resolveContexts, resolveValues );//相当于fire
				}
			};
		};

	// when无参数或单个参数，采用Promise.resolve
	// 如无参数，则等价于：master.done( updateFunc( i ) ).resolve()
	if ( remaining <= 1 ) { // i = remaining
		adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
			!remaining );//如无参数则！remaining为true

		// 使用 .then() to 展开thenables (cf. gh-3000)
		if ( master.state() === "pending" ||
			jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

			return master.then();
		}
	}

	// 多参数形式，就如同Promise.all
	while ( i-- ) {
		adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
	}

	return master.promise();
}
} );

// 将Deferred开发常见错误抛出
// 这些通常表明程序员在开发过程出错，抛出异常而不是吞没
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};



// jQuery.ready实现
// deferred用于DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )  // 如果fn出错则用jQuery默认的ready异常处理方式

		// 将 jQuery.readyException 包在函数内；为了错误处理时查找错误，而不是用回调方式
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// 是否DOM可以被使用，仅设置true一次
	isReady: false,

	// 计数器，用于计量ready事件发生前需要等待多少项
	// #6781
	readyWait: 1,

	ready: function( wait ) {

		// 如wait
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// 设置DOM已经准备好的标志 　
		jQuery.isReady = true;

		// 一直等到readyWait为0
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// 执行绑定的延时事件 　　
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// completed方法，删除事件监听，调用ready方法
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// 处理$(document).ready()在浏览器事件触发之后调用的情况
// Support: IE <=9 - 10 only
// 某些老的ie浏览器可能会出现
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// 异步处理，使脚本有机会延迟
	window.setTimeout( jQuery.ready );

} else {

	// 标准浏览器DOM加载完后会触发“DOMContentLoaded”事件
	document.addEventListener( "DOMContentLoaded", completed );

	// 如没有DOMContentLoaded事件，则回退监听load事件，这个事件会在图片等都加载完响应
	window.addEventListener( "load", completed );
}

/*************************************数据缓存$.data();*****************************************/
/**
 * jQuery很多函数具有写入和读取功能，如jQuery.fn.css等，
 * 此函数为抽象出的入口函数；有时jQuery可以传入obj，或者传入function等，很多都是通过这个函数进行处理的
 * 以jquery.fn.extend({data:..})返回access为例
 * access首先重要逻辑是处理key为obj形式，如key为obj，则将key再次调用access
 * 之后，将处理逻辑分为有key还是无key；如有key，则bulk为false
 * 注：用此方法包装的函数调用，提供了四种传值方式：name，(name,value)，({key:value,key:value})，(name,function(index,attr){})
 *
 * @param elems			jquery匹配的dom元素
 * @param fn			fn函数
 * @param key			null
 * @param value			value
 * @param chainable		arguments.length > 1
 * @param emptyGet		null
 * @param raw			true
 * @return {*}
 */

var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		// 通过bulk将处理逻辑分为2大类，key有值，bulk为false，否则为true
		// 这样封装，主要是为了两类能使用相同的逻辑
		bulk = key == null; // == 优先级高于=，如key==null，则将bulk赋值为true

	// 如key为object，则递归方法，一个个key设置
	// 类似，$('a').css({'height':'10px','width':'10px'})
	// 具体为何不用仔细理解，jQuery.fn.css代码分析会有，jQuery.fn.css内部调用了access,
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// 如value有值，即类似$('a').css({'height':'10px'})的调用方式，key为height，value为10px
	} else if ( value !== undefined ) {
		chainable = true;
		// 如value不是函数，raw设为true，raw标识为value是否为函数
		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}
		// key==null，则将bulk赋值为true
		if ( bulk ) {

			// value不是函数
			// Bulk 操作针对整个集合operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// value为函数，elem为普通值，用jquery封装后重新定义fn
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}
	// 如value !== undefined，即有value值都是链式调用；
	// 上面会将chainable设为true， 则返回elems
	if ( chainable ) {
		return elems;
	}

	// key有值，bulk为false
	if ( bulk ) {
		return fn.call( elems ); //以jquery.fn.extend({data:..})返回access为例,则fun的参数value为elems
	}
    // 如elem.length不存在，则返回emptyGet
	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
/**
 * 判断绑定数据的目标owner类型是否符合要求
 * @param owner
 * @return {boolean}
 */
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any 		+owner.nodeType转换为number，但+{}.nodeType === NaN !NaN = true
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
/**
 * 数据缓存，先在jQuery内部创建一个cache对象{}, 来保存缓存数据。 
 * 然后往需要进行缓存的DOM节点上扩展一个值为expando的属性
 * @type {{
 * 	     cache: Data.cache,			创建cache缓存
 * 		 set: Data.set,				在owner设置data
 * 		 get: Data.get,				获取数据
 * 		 access: Data.access,		提供set，get统一访问接口，根据不同情况，调用get，set方法
 * 		 remove: Data.remove,		删除值，删除key对应的值
 * 		 hasData: Data.hasData		判断owner是否包含数据
 * 		 }}
 */
Data.prototype = {
	// 创建cache缓存
	cache: function( owner ) {

		// 检查DOM对象是否有expando属性，判断对象是否有cache
		var value = owner[ this.expando ];

		// 如无cache，创建一个
		if ( !value ) {
			value = {};

			// 现代浏览器可以接收非元素节点绑定数据，但由于see #8335.问题，返回空对象
			if ( acceptData( owner ) ) {

				// 如owner是元素节点，就在expando上绑定value值
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// 将owner的this.expando配置为非枚举属性，为了保证当数据删除时需要将属性同时删除，
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	// 在owner设置data，参数可以为[owner, data, value],或者[owner,{properties}]
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// 总是使用驼峰标记法的key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// 复制属性到cache对象
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	// 获取数据，如key==undefined，直接返回全部数据，
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// 总是使用驼峰标记法 (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	// 提供set，get统一访问接口，根据不同情况，调用get，set方法
	access: function( owner, key, value ) {

		// 处理如下情况：
		//	1、未指定key
		//  2、字符串类型key指定，但未提供value值
		//
		// 利用get方法决定何值返回
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// 如key不是String，或key与value都指定了，利用set方法，设置值
		this.set( owner, key, value );
		// 根据不同情况返回不同值
		return value !== undefined ? value : key;
	},
	// 删除值，删除key对应的值，当key=undefined时，删除owner[ this.expando ]
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// 支持keys数组，与空格分隔字符串
			if ( Array.isArray( key ) ) {

				// 如key是数组，将key全部转换为驼峰标记法的
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// 如key具有空格，则直接使用它
				// 否则构造一个无空格的array
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// 如未传入key或cache无数据，则删除expando
		//??????????????????????????????????当key为undefined，只是删除了dom的expando属性，未在cache中删除对应数据？？？？？？？
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink 当DOM节点删除属性时会造成性能下降，故将属性设置为undefined
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	// 判断owner是否包含数据
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
// 相当于私有数据
var dataPriv = new Data();
// 用户数据
var dataUser = new Data();



//	实现概要
//  *****************************************学习下如何不暴露实现细节给用户
//	1. 增加api接口，语义上兼容1.9x分支
//	2. 通过减少存储路径到单个，以提高模块可维护性
//	3. 使用相同的机制支持private与user数据
//	4. 不会暴露私有数据给用户代码 (TODO: Drop _data, _removeData)
//	5. 避免暴露实现细节给用户对象 (eg. expando properties)
//	6. 提供清晰方法来实现2014年的WeakMap升级

// \w :匹配包括下划线的任何单词字符,等价于 [A-Z a-z 0-9_],
// \W :匹配任何非单词字符,等价于 [^A-Z a-z 0-9_]
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;
// 对数据进行转换，dataAttr中使用，将html中data-*的数据进行下处理
function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// 只有在不改变字符串的情况下才转换成数字。
	if ( data === +data + "" ) {
		return +data;
	}
	// 在此函数外进行了捕获
	// /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test('{asd}');=====>true但JSON.parse会报错？
	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

// 从HTML的data-*获取数据，将数据设置到dataUser里面
function dataAttr( elem, key, data ) {
	var name;

	// 如内部找不到任何数据，则从html5中的data-*查找数据
	if ( data === undefined && elem.nodeType === 1 ) {
		// key.replace( rmultiDash, "-$&" )类似于key.replace( /([A-Z])/g, "-$1" );不知这样写有何意义？？？？？？？？？？？？？
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {} // 对于getData报错处理

			// 确保我们设置了数据，这样它以后不会改变。
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
// $.data()方法，每次调用都会针对无this.expando创建cache存放缓存数据
jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},
	//data方法可以同时set或get数据
	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );
// $('aa').data()方法，与$.data()方法是不一样的
jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],// $匹配到的第一个元素
			attrs = elem && elem.attributes;// 返回指定节点的属性集合

		// 获取所有值,即$().data()调用形式
		if ( key === undefined ) {
			if ( this.length ) {// jquery有匹配到元素
				data = dataUser.get( elem );
				// 主要是将html属性上的data-数据存储在data中
				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// attrs 元素可以为null (#14894)
						if ( attrs[ i ] ) {	// 获取html上data
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );//只需要存储data-上数据一个次
				}
			}

			return data;
		}

		// 设置多组值
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// 如$()获取到dom，不是空，则this[0]不为空，value这个参数也不会是undefined
			// 对于空的jquery对象，如$('#a')[0]会返回undefined，即elem = this[0]会在试图读取data缓存时抛出异常
			if ( elem && value === undefined ) {

				// 尝试从cahce中获取数据
				// key在Data中都是驼峰标记法
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// 尝试在html的data中获取数据
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// 确实无数据，直接return
				return;
			}

			// 设置数据
			this.each( function() {

				// 总是存储驼峰标记法的key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},
	// 由于each,则每个节点都会删除key对应的值
	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );

/***************************队列方法***************************************************/

jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";	// 专职供fx动画队列处理的
			// queue对应的key默认为fxqueue,而且默认queue是数组
			queue = dataPriv.get( elem, type );

			// 如仅是查找，则快速出列
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					// 因为queue返回的为数组，故需要将data转为数组，存在dataPrive的type+queue中
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) ); // // 将类数组对象转换为数组对象
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},
	/**
	 * $.queue(body, 'aa', function(){console.log('aa');});
	 * $.dequeue(body,'aa');//输出aa
	 * 出列就有点类似shift的操作，但是不同的是还会执行这个cb1与cb2
	 * 注意：每调用一次仅出列一个
	 * @param elem
	 * @param type
	 */
	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),// 获取elem上的数组
			startLength = queue.length,
			fn = queue.shift(),			//拿到queue的头元素
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// 第二次调用$.dequeue时，上面fn = queue.shift()会将fn赋值为inprogress，进入if后
		// 将fn赋值为queue实际的函数
		// ????????????????????????????????????这个操作有何目的？？？？
		// 英文注释是避免自动出列
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// 为fx队列增加一个过程标尺，避免自动出列
			if ( type === "fx" ) {
				queue.unshift( "inprogress" ); // 向数组添加的第一个元素。
			}

			// jQuery.fn.delay 会为函数增加一个stop = function(){window.clearTimeout()}
			// 删除这个属性
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}
		// 当队列=0时，删除dataPriv的type+queue
		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// 非公共方法，产生一个queueHooks对象，或返回现在存在的一个
	// 在当前元素elem的type + "queueHooks"，创建一个{empty：。。。}
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}
        // 如$().queue只有一个参数并且是String，则直接调用$.queue
		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );//获取匹配元素的一个,在匹配的第一个上面绑定队列
		}

		return data === undefined ?
			this :  // $().queue('aaa')情况,返回jquery对象
			this.each( function() {
			    // 此处的this为jquery的匹配到的每个元素
				var queue = jQuery.queue( this, type, data );

				// 确保每个queue有一个hooks
				jQuery._queueHooks( this, type );
                // ?????????????????????????这个地方有问题，type应为函数，否则在dequeue中会有fn.call的调用
                // 会报错
				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
    // 清除队列，就是将type类型的数据存储置[]
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// 获得一个promise resolved，当某个队列的type为空时，默认type为fx
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


// source 属性用于返回模式匹配所用的文本。不包括限定符
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
// rcssNum:^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$
// 匹配的是+1px,+=1.23em 等，用于匹配非string，数字的样式值，转换为数值的正则
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );

// padding，margin的4个方向
var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
// 判断是否display：none；
// 判断是否在dom上为了解决firefox的bug
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree可能会被jQuery.filter函数调用，那种情况下，elemetn是第二个参数
		elem = el || elem;

		// 内联样式胜过一切
		return elem.style.display === "none" ||
			elem.style.display === "" &&	// 如内联样式为"" ,判断是否计算样式display:none

			// 否则检测计算属性
			// Support: Firefox <=43 - 45
			// 非DOM元素，会计算display为none，所以首先使用contains保证elem在dom上
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};
/**
 * 主要功能是将元素旧的属性存储，然后根据options设置新的样式属性，然后利用callback计算新样式属性下的结果值；
 * 最后将原有样式还原
 * 调用1：jQuery.cssHooks.width与jQuery.cssHooks.height中调用， 其中
 * 		elem:匹配到的元素，
 * 		options为{ position: "absolute", visibility: "hidden", display: "block" }；
 * 		callback为getWidthOrHeight返回值
 */
var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// 记录旧样式值，插入新值
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// 将旧值重新设置回elem
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


/**
 * 调整css设置值，如+=10%,则计算出实际应该设置为多少，
 * 对增量计算的换算，并得到最终值。在jq内部，除了css样式会换算，动画处理也支持换算。
 * 此函数也可以把动画的tween对象的初始值和增量进行累加换算，得到最终值赋给tween对象
 * 1调用、对于jQuery.style()调用，
 * 			elem为匹配的第一个元素，
 * 			prop为需要设置的样式的key如height；
 * 			valueParts为rcssNum.exec( value )
 * 			tween：undefined
 * 		如HTML为：
 *		<div>
 *		    <p>asdf</p>
 *		</div>
 *		js为：
 *		$('p').css('height','+=10%')
 *		样式：
 *		div{height:50px;}
 *		// 当前chrome中，p高度默认为20px，因此，最终.css('height','+=10%'),p上应该设置的是20/50+10 =50%;才对
 *
 */
function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );//第3个参数""，则将获得的值转换为数值
			},
		//1调用，就是调用jQuery.css获得,注意获得的initial初始值并不带有单位
		//即使未给p高度，p也会有个默认高度，假如当前chrome，p高度为20px，故initial为20
		initial = currentValue(),
		// 匹配单位，若不在cssNumber目录，并且没带单位，则当做px
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),//获取单位

		// 为了避免潜在单位错配，进行初值计算
		// 由于初始值若匹配到单位，都会是px，单位不是px的在执行css过程中jq也有钩子修正
		// 所以有可能需要换算的只有cssNumber列表中项目，或者unit不为px且initial有非0数值的（0无需换算）。初始值为字符串如"auto"，则会在下面按照0处理
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );// jQuery.css( elem, prop )与jQuery.css( elem, prop ,"")区别就是前面带单位，后面返回不带单位
	// 只是提供一个算法，计算css('height','+=10%')这样的相对单位，实际应该设置值为多少
	// 以%为例，css('height','+=10%'),需要先计算出当前p相对于父级div所占百分比，
	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// 如unit为undefined，使用jQuery.css获取到的单位
		unit = unit || initialInUnit[ 3 ];

		// 确保稍后更新tween属性
		valueParts = valueParts || [];

		// 从非零起点迭代逼近
		initialInUnit = +initial || 1;

		do {

			// 如上一次迭代scale为0，则加倍直到取得某些东西
			// 使用字符串设置加倍，这样下面scale就不会不改变
			scale = scale || ".5";

			// 调整initialInUnit值
			initialInUnit = initialInUnit / scale;
			// 对于1调用的例子，实际此处设置的是height:20%
			jQuery.style( elem, prop, initialInUnit + unit );

		// 更新scale，允许tween.cur()出现NaN与0值
		// 如scale未改变或者到达最大循环maxIterations次数，跳出循环
		// 对于调用1，因为父级div为50px，故currentValue() 等于 10
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		// 初始值为字符串，也将按照0处理，
		initialInUnit = +initialInUnit || +initial || 0;

		// 如指定了+=，-=类似的相对值，则对返回值进行调整
		// 根据是否为增量运算判断直接赋值还是换算后的初始值与增量相加，css运算中只允许增量运算使用该函数
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) { 	// 如tween存在，则设置tween的属性
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

/**
 * 获取默认的display属性，在dom上增加一个空的元素，如elem是div，则append一个空的div
 * 然后利用jQuery.css( temp, "display" );获取当前元素的display属性，并储存在defaultDisplayMap中
 * 其实就是获取空的div，p等元素节点的display属性；因为元素可能是内联元素，可能是block元素等，show时候要保证正确
 * 不能给span，show之后变成display：block
 * @param elem
 * @return {*}
 */
function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

/**
 * 显示与隐藏元素内部方法
 * @param elements   匹配的元素
 * @param show
 * @return {*}
 */
function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// 确定元素显示是否需要改变
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;// 获取匹配元素的display值
		if ( show ) {

			// 因为我们队级联隐藏元素强制可见性，因此需要在第一次循环时立即检测，除非display===none
			// 如内联样式为none，且!values[ index ]为true，内联样式display会被修正为""
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			// isHiddenWithinTree会判断计算样式，如元素内联设置none，style中又设置none，则会利用getDefaultDisplay获取值
			// 如只有内联样式设置了display:none,则通过设置display=""为空字符串，就可以让元素显示
			// 但如果外联样式还有display：none，这么设置不起作用
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {//show为false
			if ( display !== "none" ) {
				values[ index ] = "none";

				// 覆盖之前存储的display值
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// 再循环一次，设置元素的style值
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	// 此处定义的show，hide方法并不能传入参数，只是显示与隐藏元素
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );

/*********************DOM操作*********************************/
var rcheckableType = ( /^(?:checkbox|radio)$/i );
// 匹配类似<a123
var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );
// 匹配/javascript或ecmascript
var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// 必须关闭这些标签来支持XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML 解析器不能像html一样，插入元素时自动补元素，因此，有些元素是不能忽略的，如tbody
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

/**
 * 根据某个tag名获取context全部tag元素
 * @param context
 * @param tag
 * @return {*}
 */
function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// 使用typeof避免对象无参数的方法调用(#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}
	// nodeName:判断elem的nodeName是否为name
	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// 全局性地标记scripts代码段已经被执行过了
// 为每个元素绑定私有数据，key：globalEval，value
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}

// 将非HTML转换为文本节点
var rhtml = /<|&#?\w+;/;

/**
 * 构建文档片段，jQuery.parseHTML与domManip (主要功能是为了实现 DOM 的插入和替换)调用此函数创建文档片段
 * 对于，$('span').replaceWith('<p>123</p>');，传递给domManip( collection, args, callback, ignored )分别为
 * collection:为匹配的span的jQuery集合，args为<p>123</p>，callback为replaceWith传递的回调函数，ignored为[]
 * 传递给buildFragment则是：	elems：<p>123</p>，
 * 							context：document；
 * 							scripts：false,
 * 							selection:为匹配的span的jQuery集合,
 * 							ignored	:[],!![]为true
 * @param elems
 * @param context				上下文
 * @param scripts				scripts 参数只在 jQuery.parseHTML 方法里使用（domManip里传false），
 * 								当 jQuery.parseHTML 的第三个参数 keepScripts 为 false 时将删除节点里所有的 script tag
 * @param selection
 * @param ignored
 * @return {DocumentFragment}
 */
function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
        // 在context下创建一个新的空白的文档片段，
        // 文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;
    // parseHTML调用此函数时，elems=[data]，data为外部传入的html，因此仅循环一次
	// domManip调用elems，是参数，如$('span').append('<h1>asd</h1>');elem为<h1>asd</h1>
	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// 因为jQuery.parseHTML限定了data==string，故为false
            // elem 是 DOM 元素（根据nodeType判断），直接放入 nodes 数组中
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) 会抛出异常在老的WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// 将非HTML转换为文本节点，rhtml= /<|&#?\w+;/
            // elem 是字符串且不是 HTML tag，创建文本节点对象（textNode），放入 nodes 数组中
			} else if ( !rhtml.test( elem ) ) {
			    // document.creatTextNode = ‘<h1>rex</h1’>，字符串中具有html代码，不会被浏览器解析，但innerHTML会解析字符串中的html代码，表现为h1标记的rex
				nodes.push( context.createTextNode( elem ) );

			// 将html转换为dom节点
            // elem 是字符串且是 HTML tag，将其转成 DOM 元素，放入 nodes 数组中
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// 反序列化的标准表示法，
                // rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i )
                // [ "", "" ][1]===""获得一个空字符串？？？？？？？？？？？？？？？不知为何这么表示，可能是反序列化标准表示法
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                // wrapMap为为了支持xhtml而提供的对节点的匹配，wrapMap._default: [ 0, "", "" ]
				// 例如elem= <tr>rextao</tr>,需要在tr外围增加tbody与table
				// 如wrapMap.tr = [ 2, "<table><tbody>", "</tbody></table>" ]，wrapMap[0],表示当前tr外围应添加几个元素
				wrap = wrapMap[ tag ] || wrapMap._default;
                // HTML5不要求标签必须闭合，但是XML要求。这个函数就是用来作转换的。
                // 如 <h1 id='a'/>是在htmnl5是允许的，通过htmlPreFilter会转换为<h1 id='a'></h1>
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
				
				// 对于$.parseHTML调用此函数，通过j--，tmp得到的还是如上举例的tr元素，并不能看出有何用
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) 会抛出异常在老的WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// 记住顶级容器，即上面创建的div
				tmp = fragment.firstChild;

				// 确保创建的节点是孤立的 (bug#12392)
				tmp.textContent = "";
			}
		}
	}

	// 移除fragment内部所有的内容
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// 跳过contex集合中包含elements的情况(trac-4087)，$.parseHTML调用不涉及
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			// 何时才会push呢？如replaceWith这样调用：$('p').replaceWith($('#p1'));那么elem在selection集合中
			// 故会将ignored集合push个elem元素
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}
		// jQuery.contains = Sizzle.contains,判断一个DOM节点是否包含另一个DOM节点
		contains = jQuery.contains( elem.ownerDocument, elem );

		// 添加到 fragment,getAll(context,tag):根据某个tag名获取context全部tag元素
		// appendChild:如果被插入的节点已经存在于当前文档的文档树中,则那个节点会首先从原先的位置移除,然后再插入到新的位置.
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// 保存脚本
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// 获取脚本，如scripts为true，此处将脚本存入scripts中，因为scripts为true，
		// $.parseHTML中会remove scripts
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				// rscriptType = ( /^$|\/(?:java|ecma)script/i )
				// 匹配script脚本，匹配的是type， script的elem.type=text/javascript
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// 如果设置了name，则检查状态丢失(#11217)
	// Support: Windows Web Apps (WWA)
	// 对于WWA ，`name` and `type` 必须使用.setAttribute 设置 (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// 老式Webkit，在文档片段中克隆选中状态会出错
	// Node.cloneNode() 方法返回调用该方法的节点的一个副本.
	// 参数：true，该节点的所有后代节点也都会被克隆，false,则只克隆该节点本身.
	// DOM4规范更改了参数默认值为true，之前为false，因此为保证克隆正确，参数要写上
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// 确保textarea，checkbox默认值被正确克隆
	// defaultValue 属性设置或返回textarea的初始内容。初试内容为位于 <textarea> 和 </textarea> 标签之间的文本
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
// 返回文档对象（document）的根元素的只读属性（如HTML文档的 <html> 元素）。
var documentElement = document.documentElement;

/***********************************事件系统***************************************/

var
	// 判断是是否键盘按键的事件类型
	rkeyEvent = /^key/,
	// 判断是否为鼠标事件
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    // (?:)内容不会被捕获,即匹配asd.asd的表达式，可以匹配带命名空间的type
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement; // activeElement 属性返回文档中当前获得焦点的元素
	} catch ( err ) { }
}

/**
 * 事件系统内部函数，on方法实质只完成一些参数调整的工作，然后调用jQuery.event.add添加事件
 * @param elem
 * @param types 添加到元素的一个或多个事件
 * @param selector  一个选择器字符串，用于过滤出被选中的元素中能触发事件的后代元素
 * @param data      当一个事件被触发时，要传递给事件处理函数的
 * @param fn        事件被触发时，执行的函数
 * @param one
 * @return {*}
 */
function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// types参数可以是一个{types:handlers}对象结构
	if ( typeof types === "object" ) {

		// 参数形式，types为object对象，( types-Object, selector, data )
		if ( typeof selector !== "string" ) {
            // 如果selector不是string，则参数有data，用data，无data，则将selector赋值给data
			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}
    // 调用是 types function，后面无参数
	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}
    //  上面的if主要是对参数进行调整，针对不同调用方式，调整参数
    // 对于one这种方式调用，将元素fn进行了包装，先off，然后再调用
	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// 使用空集合，因为event包含着信息
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// 使用相同的guid，调用者可以使用origFn移除
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	// 当elem未匹配到元素时，each会计算elem长度，故elem.length==0，不会运行添加函数
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * 管理事件的辅助函数——不是公共接口的一部分。
 * 借鉴了Dean Edwards库思想
 */
jQuery.event = {

	global: {},
    /**
     * 添加事件,对外调用$().on(types, selector, data, fn );
     * add函数参数与外部调用参数顺序有所不同
     * 此函数完成的功能：
     * 1、添加基本事件，2、添加click mouseover，同时添加多个事件，
     * 3、添加自定义事件，
     * 4、对有selector添加事件,只是利用jQuery.find.matchesSelector判断传入的selector是否为正确selector表达式，
     *    并不保证html中有，之后将selector存储在handleObj
     * @param elem      要绑定的jQuery对象
     * @param types     事件类型，如click
     * @param handler   事件处理函数，如function(){console.log('a');}
     * @param data      外部的data数据
     * @param selector  选择器
     */
	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
            // 缓存的数据结构
			elemData = dataPriv.get( elem );

		// 不要将事件添加到noData或text/comment节点上
        // ????????????????????????????????不懂何种情况elemData为false
		if ( !elemData ) {
			return;
		}

		// handler可以传递自定义数据对象而不是处理函数，即调用者能通过自定义数据替换handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// 确保在添加事件时，无效的选择器就先抛出异常
		// documentElement 可能就是一个非元素节点
		if ( selector ) {
		    // 利用Sizzle，看能否再elem上查询到expr这个元素，如不能返回false
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// 确保handler有唯一Id，之后用于查询与删除
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// 如当前元素第一次调用on，则初始化event结构和主处理函数,因此对于同一个elem只会创建一次
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		// 注意此处的elemData.handle并不是调用时传入的事件处理函数,即，后面addEventListener添加的是这个函数而不是传入的事件处理函数
		// 因此，jQuery.event.dispatch也是实际触发事件时响应的函数
		if ( !( eventHandle = elemData.handle ) ) {
			// 因为eventHandle是实际添加到addEventListener的事件处理函数，故e为原生的事件对象
			eventHandle = elemData.handle = function( e ) {

				// 当页面卸载后事件被调用，则放弃jQuery.event.trigger()的第二个事
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					// 故arguments为全部的原生事件e
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// 处理由空格分隔的多个事件
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
            // rtypenamespace = /^([^.]*)(?:\.(.+)|)/
            // 如aaa.bb.ccc，则tmp[1]为aaa，temp[2]为bbb.ccc
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// 对于无命名空间的handlers，必须有一个事件类型type，
			if ( !type ) {
				continue;
			}

			// 如果事件改变其类型，使用special事件处理器来处理更改后的事件类型
			special = jQuery.event.special[ type ] || {};

			// 如果选择器已定义，确定special事件API类型，否则给他一个类型
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// 基于新设置的类型更新special
			special = jQuery.event.special[ type ] || {};

			// handleObj贯穿整个事件处理,绑定事件信息
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
                // Expr = Sizzle.selectors
                // jQuery.expr = Sizzle.selectors
                // match: matchExpr
                // 判断第一个token是[>+~]关系选择器，或整个选择器中有sizzle自定义伪类
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// 初次使用，初始化事件handler队列
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// 非自定义事件，如果special事件处理器返回false，则只能使用addEventListener/attachEvent
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}
            //自定义事件绑定
			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// 将事件对象handleObj添加到元素的处理列表,代理计数递增
            // 如有selector,表明当前的事件绑定是委托，这个是将委托事件放在handlers事件列表前面
            /// 对于如下结构，
            //  <div class="rex" id="b">
            //     <div id="a"></div>
            //     <p id="p"></p>
            //  </div>
            // 如下代码handlers里面存放的是#a,#p，之后才是console.log(b)这个响应函数
            // $('#b').on('click mouseover','#a',function () {
            //     console.log('a')
            // }).on('click mouseover',function () {
            //     console.log('b')
            // }).on('click mouseover','#p',function () {
            //     console.log('p')
            // })
			if ( selector ) {
			    // arrayObject.splice(index,howmany,item1,.....,itemX)
                // index,整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
                // howmany,要删除的项目数量。如果设置为 0，则不会删除项目。
                // items1...，要添加的内容
                // handlers后面添加handleObj
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );// 上面handlers初始化为[]
			}

			// 追踪使用过的事件，为了事件优化
			jQuery.event.global[ type ] = true;
		}

	},

	// 从element上删除一个或一组事件
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

        // 如当前元素elem无缓存数据，或者无events这个key直接返回
        if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// 分解types为type.namespace为单位元素的数组
        // 即，type可以传入 clikc.name1  hover.name2
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
        // 可能同时解绑多个事件类型
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

            // 解绑当前元素的全部事件，如提供命名空间，则删除当前命名空间下的全部事件
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}
            // 如果事件改变其类型，使用special事件处理器来处理更改后的事件类型
			special = jQuery.event.special[ type ] || {};
            // 如果选择器已定义，确定special事件API类型，否则给他一个类型
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
            //如namespaces=['a','b'];正则：/(^|\.)a\.(?:.*\.|)b(\.|$)/
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// 删除匹配事件
            // 一个事件类型可能绑定了多个事件处理函数
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];
                //各种满足移除事件的条件才能移除
				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
				    // 删除这个handlers
					handlers.splice( j, 1 );
                    // 如果handler是委托，将委托计数减1
					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// 如我我们删除东西，并无更多的handlers存在，则删除一般事件处理函数
			// (避免在删除特殊事件处理程序时进行无限递归。)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// 如events为空，则删除缓存的数据
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},
	/**
	 * 当事件响应时，会触发此函数
	 * @param nativeEvent	原生的事件对象
	 * @return {undefined|*}
	 */
	dispatch: function( nativeEvent ) {

		// 由原生对象构建一个可写的jQuery.Event
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			// 当前对象在dataPriv中存储的两个key，一个是events，另一个是handler
            // 获取当前节点缓存中对应事件类型的事件处理列表
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// 使用jQuery.Event而不是native事件
		args[ 0 ] = event;
		// 将原生事件的其他参数全部复制到args上
		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}
        // delegateTarget为jQuery.event.special里面具体事件的一个属性
		event.delegateTarget = this;

		// 调用preDispatch钩子方法，如为true，则直接返回
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// 确定handler队列,获取到符合要求的委托处理函数队列
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// 针对handlerQueue的筛选
		i = 0;
        // 事件未PropagationStop,则继续
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
		    // ???????????????????????????????????为何要交换currentTarget，不影响propagation
            event.currentTarget = matched.elem;

			j = 0;
            // 循环每个事件类型的多个事件处理函数
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

                // 触发事件的条件：
                // 1)没有命名空间，或
                // 2)有命名空间的子集或等于那些边界事件（他们两者都可以没有命名空间）
                // 设置一些触发条件，并不是什么时候都能触发事件
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// 针对mapped类型，调用postDispatch钩子方法
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},
	/**
	 * 将有序地返回当前事件所需执行的所有事件处理程序。
     * 主要是将委托事件与自身事件进行顺序调整，形成队列，
     * 因为冒泡是有顺序的，故父节点的事件应该在子节点事件之后响应
	 * @param event         jquery 包装后的event对象
	 * @param handlers
	 * @return {Array} 委托的事件处理程序相对于直接绑定的事件处理程序在队列的更前面，委托层次越深，该事件处理程序则越靠前
	 */
	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target; // 当前触发事件的对象

		// 寻找委托事件，delegateCount!=0 才表示有委托事件
		if ( delegateCount &&
            // 解决某些浏览器的bug问题
			// Support: IE <=9
			// 目标对象是元素节点(trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// 点击的不是鼠标主按键(trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// 对于非鼠标输入工具，button值可能为-1(gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {
            // 主要使用event.target事件源节点不断循环往上查找父节点，
            // 看些节点和是否在handlers中的选择器对应的节点中
            // 如子父级关系是，#a<#b<#c,其中#a为事件触发target，#c为事件绑定对象
            // cur每次循环分别为#a<#b<#c，但handlers有3个事件函数，每次循环，都需要循环handlers（长度由delegateCount决定），
            // 判断是否为当前节点的事件处理函数,因为外部并没有判断selector是否能查询到节点
            //
			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// 不检测非元素节点 (#13208)
				// 不要对禁用元素进行单击处理(#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {// 遍历委托元素
						handleObj = handlers[ i ];

						// 避免与Object.prototype属性发生冲突 (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {// 如能查到push到matchedHandlers中
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 : // 如是同代元素
								jQuery.find( sel, this, null, [ cur ] ).length;//jquery.find 这个函数是找出正在处理的元素的后代元素的好方法
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					// 如委托事件都能找到target，则matchedHandlers.length>0，则push到handlerQueue中
					if ( matchedHandlers.length ) {
					    // 最终handlerQueue存储的应该是事件触发元素target，到parent。parent。parent，直到this的所有事件绑定
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// 添加非委托的事件，即this本身的事件处理函数
		cur = this;
		if ( delegateCount < handlers.length ) {   // 如为false，则表明都是委托事件，从delegateCount后面的handlers都是本身事件处理函数
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},
	// 为jQuery.Event这个封装对象增加事件原生事件
	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					// this.originalEvent 在jQuery.Event构造函数中创建了
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},
	// 将原生的事件对象 event 修正为一个新的可写event 对象，并对该 event 的属性以及方法统一接口
	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// 阻止触发image.load事件冒泡到window.load
			noBubble: true
		},
		focus: {

			// 触发本当前节点blur/focus事件 确保队列正确
			trigger: function() {
                // safeActiveElement,ie<9,document.activeElement会出问题
                // document.activeElement属性返回文档中当前获得焦点的元素
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			// 主要标识，是否需要转换为其他事件，即将blur转换为focusout
			delegateType: "focusout"
		},
		click: {

			// 对于chekbox，如选中状态是正确的则触发原生事件
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// 为了保证跨浏览器兼容性，不在links上触发元素click事件处理函数
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// 如returnValue未设置，则firefox不会alert
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};
/**
 * 删除使用 EventTarget.addEventListener() 方法添加的事件
 * @param elem
 * @param type		 事件类型
 * @param handle     需要移除的 EventListener 函数（先前使用 addEventListener 方法定义的）
 */
jQuery.removeEvent = function( elem, type, handle ) {

	// 这个if是针对plain objects来处理的
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};
// jQuery.Event构造函数,仅定义一些定义的属性与方法
jQuery.Event = function( src, props ) {

	// 允许实例化Event，不使用new关键字
    // 如直接调用var a = jQuery.Event，则this为window对象，或其他，不是jQuery.Event对象
    // ******************************提供如何允许实例化Event，不使用new关键字
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// 构建Event 对象
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// 事件冒泡的文档可能被标记为阻止默认事件发生；isDefaultPrevented可以反应是否阻止的标志的正确值
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :    // 返回true和false的函数
			returnFalse;

		// 创建target属性
		// Support: Safari <=6 - 7 only
		// Target不应为一个text节点(#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// src为事件类型
	} else {
		this.type = src;
	}

	// 将明确提供的特征添加到事件对象上
	if ( props ) {
		jQuery.extend( this, props );
	}

	// 创建一个时间戳如果传入的事件不只一个
	this.timeStamp = src && src.timeStamp || jQuery.now();//jQuery.now = Date.now

	// 标记事件已经修正过
	this[ jQuery.expando ] = true;
};

// jQuery.Event 基于DOM3事件的
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
// 事件对象默认方法的重写，主要是记录是否调用过此方法
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,
	// 取消事件的所有默认动作
	preventDefault: function() {
		var e = this.originalEvent;
		// 只是增加了此属性用于记录是否调用过此方法
		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	// 阻止捕获和冒泡阶段中当前事件的进一步传播。
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	// 阻止调用相同事件的其他侦听器。
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			// nativeEvent中，stopImmediatePropagation阻止事件冒泡，该元素绑定的后序相同类型事件的监听函数的执行也将被阻止.
			e.stopImmediatePropagation();
		}
		// 因为stopImmediatePropagation会阻止冒泡，所以需要调用this，记录已经阻止冒泡
		this.stopPropagation();
	}
};

// 为jQuery.Event添加原生事件对象的属性等
jQuery.each( {
	// 这些key是在事件响应时，事件对象所包含的
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	// 利用which判断点下的是哪个键
	// 原生事件中， MouseEvent.which 表示鼠标按下的是哪个键，（非标准）
	which: function( event ) {
		var button = event.button;

		// 为which增加key的事件
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			// charCode : 字符键的字符Unicode值(非标准值);MDN上标注为废弃属性，用event.key代替
			// keyCode   ：获取按下的键盘按键Unicode值，MDN上标注为废弃属性
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// 使用mouseover/out和事件时机检测创建mouseenter/leave事件
// 故此种事件可以变为事件委托
// 用相同方式处理 pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari 触发mouseenter过于频繁:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// 老的chrome也存在这个bug
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// 对于 mouseenter/leave 事件调用处理函数handler，只有在related元素在target外面
            // *********************************************************
            // 参考: 当鼠标离开/进入浏览器窗口的时候是没有relatedTarget的
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
    // 为每一个匹配元素的特定事件（像click）绑定一个一次性的事件处理函数。
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
    // 在选择元素上移除一个或多个事件的事件处理函数。
	off: function( types, selector, fn ) {
		var handleObj, type;
        // 前面if所做的工作也是参数调整，与on类似，只是没有on函数兼容的多，off函数不能传入data数据
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		// 如果传入tpye为对象，即{click：function,hover:function}
        // fucntion为之前on绑定的函数名
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		// 对于$().off(click,function)参数进行调整，
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		// 如fn === false，则返回一个函数returnFalse
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );

/************************DOM操作1*****************************************************/
var
	// ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。
	// 注释来临时禁止规则(行的最大长度 )出现警告
	/* eslint-disable max-len */

	// htmlPrefilter使用，HTML5不要求标签必须闭合，但是XML要求。此用于转换
	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	// 开启eslint警告
	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// 需要执行的代码script|style|link等不能使用innerHTML
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	// 匹配script标记，type='true/text/....'，匹配前面的true,false
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// 提升tbody到父table为了包含新rows
// 如$('table').append('<tr>123</tr>');
// elem为jquery匹配到的table元素
// content 为tr
// 此函数返回jQuery('>tbody',elem)，只能是$('table').append('<tr>123</tr>');类似形式，content为tr，elem为table
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
			// 11:DocumentFragment
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// 更改了script标签的type值以确保安全
// 原来的type值是"text/javascript"，改成了"true/text/javascript"或"false/text/javascript"
// 注意：对于script脚本
// 1.script 无 type 属性，默认会执行其内的 JS 脚本
// 2.script 的 type="text/javascript" 或 type="text/ecmascript" ，会执行其内的 JS 脚本
// 3.script 如果有 src 属性，会执行 $._evalUrl 请求远程的 JS 文件并执行
// 4.其它不会执行 JS 脚本，有时我们会用 script 来做 html 模板，
// 如 underscore.js，type="text/template" 或 type="text/plain" 这种，其内的 JS 都不会被执行
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
// disableScipt增加了true，false，这个函数将true和false去除掉
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

/**
 * cloneCopyEvent函数中会将原节点的数据保存到克隆节点中，然后将原节点的事件绑定到新的克隆节点上
 * 主要是利用数据缓存系统data，分别将dataPriv和dataUser克隆到clone对象
 * 注意点是：在克隆事件时，为了保证克隆的事件没有重复，清空了events和handler
 * @param src		被克隆的对象
 * @param dest		clone对象
 */
function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	// clone对象非元素节点，return
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. 复制事件的私有数据：events，handlers，等
	if ( dataPriv.hasData( src ) ) {
		// 绑定的数据并不一定只有events，handle，还可能有其他私有数据，所以需要先从dataPriv取出src数据
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;
		// 如被克隆元素src有events
		if ( events ) {
			//保证被克隆的节点的事件对象干净，确保没有后面添加的事件没有重复
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. 复制user数据
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );// 使克隆的数据对象化

		dataUser.set( dest, udataCur );
	}
}

// 修复IE bugs，可以看support测试
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// 克隆的checkbox或radio不能持久化checked状态
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// 克隆options，不能将所选选项返回到默认选定状态
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

/**
 * domManip 的主要功能是为了实现 DOM 的插入和替换,为append，prepend，before，after，replaceWith使用
 * 注意dom操作的几个细节：
 * 1、保证最终操作的永远是dom元素，浏览器的最终API只认识那么几个接口
 * 2、针对大量操作，需要引入文档碎片做优化
 * 浏览器原生的插入节点的方法有两个：appendChild和inserBefore
 * @param collection		jQuery当前对象集合
 * @param args				待插入的DOM元素或HTML代码
 * @param callback			回调函数，执行格式为callback.call( 目标元素即上下文, 待插入文档碎片/单个DOM元素 )
 * @param ignored			只有在replace调用时，传入了ignored=[]
 * @return {*}
 */
function domManip( collection, args, callback, ignored ) {

	// 将数组和/或值连接成新数组，使任意嵌套数组变平
	// ([[1,2],[3,4]])---->[1,2,3,4]
	// ([[1,2,[3]],4])---->[1, 2, Array(1), 4]，并不是展开任意数组
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,	// 是否为克隆节点，如果当前的jQuery对象所匹配的元素不止一个（n > 1）的话，意味着构建出来的文档碎片需要被n用到，则需要被克隆（n-1）次，加上碎片文档本身才够n次使用
		value = args[ 0 ],	// value 是第一个元素，后边只针对args[0]进行检测，意味着args中的元素必须是统一类型
		isFunction = jQuery.isFunction( value );// arg第一个参数为函数

	// 在 WebKit中，不能克隆包含了已选中多选按钮的文档碎片,主要是处理Webkit checked属性
	// 克隆的文档不能重复使用，那么只能是当前jQuery对象所匹配的每个元素都调用一次domManip处理。
	// 还处理个特殊情况：如果传入的节点是函数（即value是函数）则需要当前jQuery对象所匹配的每个元素都将函数计算出的值作为节点代入domManip中处理
	// 如传入函数，$('span').append(function (index ,content) {});index为每一个匹配元素，content则是self.html();
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {	// 如arg第一个参数为函数，则each时将值计算出替换之前函数
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}
	// 对于正常情况，使用传入的节点构建文档碎片
	// 如$('span').append('<div><h1>asd</h1></div><p>123</p>');
	// fragment.childNodes.length= 2;
	// fragment.firstChild为div
	// 转换HTML代码为DOM元素,
	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// 有新内容，即first存在，或ignored为true
		if ( first || ignored ) {
			// getAll:根据某个tag名获取context全部tag元素
			// 原来的type值是"text/javascript"，改成了"true/text/javascript"或"false/text/javascript"
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// 将原始文档片段用作最后一个而不是第一个，因为某些情况下，可能错误的被清空(#8070).
			for ( ; i < l; i++ ) {
				node = fragment;	// 通过buildFragment只构建出一个文档片段
				// jQuery 是对象集合，都需要这个文档片段，故当i!=iNoClone时，需要克隆这个文档片段
				if ( i !== iNoClone ) {
					// 克隆node，同时克隆当前与子元素数据与事件绑定
					node = jQuery.clone( node, true, true );

					// 保持对克隆脚本的引用，以便以后恢复
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// 老版本WebKit调用push.apply(_, arraylike) 会抛出异常
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}
				// 执行回调函数插入DOM元素
				// 执行回调函数会被多次调用
				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				// 对于如$('span').append('<div><h1>asd</h1></div><p>123</p>');
				// 开始时scripts = 1；但如span匹配到4个元素，则collection.length= 4；
				// 故jQuery.merge( scripts, getAll( node, "script" ) );会运行3次,外面有if( i !== iNoClone )
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// 重新启用脚本
				// 就是将脚本script的true/text/javascript转换为text/javascript
				jQuery.map( scripts, restoreScript );

				// 在第一个文档插入时，执行脚本
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					// 匹配/javascript或ecmascript
					if ( rscriptType.test( node.type || "" ) &&
							//dataPriv无数据则存储globalEval
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {
						// 如script包含src属性，则用evalUrl，异步执行
						if ( node.src ) {

							// 可选的Ajax依赖项，但如果不存在，则不会运行脚本。
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							// 把一段脚本加载到全局context（window）中
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

/**
 *	remove，detach的内部删除函数
 * @param elem
 * @param selector
 * @param keepData		是否保留节点数据，true为保留
 * @return {*}
 */
function remove( elem, selector, keepData ) {
	var node,
		// jQuery.filter:筛选出与指定表达式匹配的元素集合
		// 因此如果selector为null，则nodes为elem，会删除当前节点
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				// 标记script是否已经执行过
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	// HTML5不要求标签必须闭合，但是XML要求。这个函数就是用来作转换的。这样我们使用 .html() 、 .append() 、.replaceWith() 时就不需要人工转换了。
	// 因此要忽略单标记的元素如br、area等，即如”<h1>rextao”.repalce(rxhtmlTag, "<$1></$2>");会返回<h1>rextao</h1>
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},
	/**
	 * 克隆匹配的DOM元素并且选中这些克隆的副本。
	 * @param elem
	 * @param dataAndEvents			是否同时复制元素的附加数据和绑定事件
	 * @param deepDataAndEvents		是否同时复制元素的所有子元素的附加数据和绑定事件
	 * @return {Node}
	 */
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// 修复IE克隆问题
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// 此处由于性能问题避开使用Sizzle: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );	//根据某个tag名获取context全部tag元素
			srcElements = getAll( elem );
			// 针对IE bugs，修复，即将有问题的地方，再从srcElements复制到destElements
			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// 如果要克隆缓存数据（包括普通数据和绑定事件），克隆之
		if ( dataAndEvents ) {
			// 如需要克隆子元素的数据和事件，克隆之
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// 保护script计算历史（全局性地标记scripts代码段已经被执行过了），并回收内存，返回克隆节点。
		// 如果该 script 已经执行过，则不会再次执行。或者说执行后会设置一个 globalEval: true 的标示。
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// 返回克隆数据集
		return clone;
	},
	// 删除元素elems绑定的events和userdata
	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {	//判断绑定数据的目标owner类型是否符合要求
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							//  删除事件的简便方法
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// 设置undefined值，而不是用delete删除属性, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {// 如有用户数据

					// Support: Chrome <=35 - 45+
					// 设置undefined值，而不是用delete删除属性, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	// 从DOM中删除所有匹配的元素。
	// 这个方法不会把匹配的元素从jQuery对象中删除，
	// 因而可以在将来再使用这些匹配的元素。与remove()不同的是，所有绑定的事件、附加的数据等都会保留下来。
	detach: function( selector ) {
		return remove( this, selector, true );
	},
	// 从DOM中删除所有匹配的元素。
	// 所有绑定的事件、附加的数据等不会保留
	// 对于$().remove()操作，会删除当前元素
	remove: function( selector ) {
		return remove( this, selector );
	},
	// $().text():返回匹配元素文本的拼接字符串
	// $().text('');：设置文本
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				// jQuery.text = Sizzle.getText;/ 用于检索DOM节点数组的文本值的工具函数
				// Sizzle.getText：返回的是拼接的字符串
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},
	// 向每个匹配的元素内部追加内容。
	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );// HTML DOM 方法：appendChild() 方法向节点添加最后一个子节点。
			}
		} );
	},
	// 向每个匹配的元素内部前置内容。
	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				// parentElement.insertBefore(newElement, referenceElement);
				// 参考节点之前插入一个节点作为一个指定父节点的子节点。
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},
	// 在每个匹配的元素之前插入内容。
	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},
	// 在每个匹配的元素之后插入内容。
	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				// parentDiv.insertBefore(sp1, sp2.nextSibling);
				// 如果 sp2 没有下一个节点，则它肯定是最后一个节点，
				// 则 sp2.nextSibling 返回 null，且 sp1 被插入到子节点列表的最后面（即 sp2 后面）。
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},
	// 删除匹配的元素集合中所有的子节点。
	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// 防止内存泄漏
				jQuery.cleanData( getAll( elem, false ) );

				// 删除所有剩余节点
				// 一个节点及其后代的文本内容
				// 在节点上设置 textContent 属性的话，会删除它的所有子节点
				elem.textContent = "";
			}
		}

		return this;
	},
	/**
	 * 克隆匹配的DOM元素并且选中这些克隆的副本。
	 * @param dataAndEvents			是否同时复制元素的附加数据和绑定事件
	 * @param deepDataAndEvents		是否同时复制元素的所有子元素的附加数据和绑定事件
	 * @return {*}
	 */
	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},
	// 获取集合中第一个匹配元素的HTML内容
	html: function( value ) {
		// 获取或设置一个集合的值,value如是函数，可以选择是否执行
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;
			// $().html()调用方式，返回elem的innerHTML
			// innerHTML:属性设置或获取HTML语法表示的元素的后代。
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// 看是否能直接使用innerHTML
			// rnoInnerhtml:需要执行的代码script|style|link等不能使用innerHTML
			// wrapMap:必须关闭这些标签来支持XHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
				// 将单标签的进行转换，HTML5不要求标签必须闭合，但是XML要求
				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// 删除元素节点并防止内存泄漏。
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// 如用innerHTML抛出异常，则使用回退方法
				} catch ( e ) {}
			}

			if ( elem ) {
				// 如innerHTML报错，则用empty清空，然后用append附加上value
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},
	// 将所有匹配的元素替换成指定的HTML或DOM元素。
	replaceWith: function() {
		var ignored = [];	// 因为dooManip中循环调用此func函数，buildFragment会根据情况往ignored中push函数

		// 用新内容替换每个未忽略的上下文元素
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;
			// 查看this是否在ignored数组中
			if ( jQuery.inArray( this, ignored ) < 0 ) {
				// 清空this上的dataPriv与dataUser
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					// 用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点
					parent.replaceChild( elem, this );
				}
			}

		// 强制调用callback
		}, ignored );
	}
} );
// 与append，prepend等重要不同是，是颠倒了常规的$(A).append(B)的操作，即不是把B追加到A中，而是把A追加到B中。
// 方法就是用each，将$(A).append(B)，将A，B参数进行交换而已
jQuery.each( {
	appendTo: "append",		// $("<b>Hello World!</b>").appendTo("p");在每个 p 元素结尾插入内容：
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			// 如insert有多个的时候就需要完全克隆一份副本
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// 使用.get()是因为push.apply(_, arraylike)会在老的WebKit抛出异常
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
/*******************************************Css样式操作*****************************************************/

var rmargin = ( /^margin/ );
// /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i
// 单位不是px
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
// 获得元素elem的计算样式值，并对getComputedStyle函数有问题浏览器进行兼容处理
var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// ie会在popups中创建一个元素时抛出异常
		// FF 同时会在iframe元素上调用defaultView.getComputedStyle抛出异常
		var view = elem.ownerDocument.defaultView;	// 除了在 IE8 浏览器中 document.defaultView === window 返回的是 false 外，其他的浏览器（包括 IE9 ）返回的都是 true。
		// window.opener是对弹出窗口的母窗口的一个引用
		// a.html中，通过点击按钮等方式window.open出一个新的窗口b.html。
		// 那么在b.html中，就可以通过window.opener（省略写为opener）来引用a.html，包括a.html的document等对象，操作a.html的内容。
		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};


// 判断当前浏览器是否存在pixelPosition等问题
// 具体判断并不理解
( function() {

	// jQuery加载时，同时执行pixelPosition & boxSizingReliable测试，并保存测试值
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// 克隆元素样式会影响原元素
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();

/**
 * curCSS获取的是浏览器计算后的最终值
 * 通过"getComputedStyle"和“currentStyle”功能来获取样式计算后的值；
 * 因为elem.style获取的只是内联样式
 * @param elem			当前要处理的元素
 * @param name		    需要获得哪个属性的计算样式值
 * @param computed		可以通过computed指定样式对象替代内部的getStyle
 * @return {string}
 */
function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// 在计算样式时，先调用elem.style用于修复某些元素get到错误值的问题
		style = elem.style;
	// 获得元素elem的计算样式值，并对getComputedStyle函数有问题浏览器进行兼容处理
	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	// 能获取到elem的计算样式属性
	if ( computed ) {
		// getPropertyValue方法可以获取CSS样式申明对象上的属性值（直接属性名称）,必须-连接书写，否则返回""
		// name无需驼峰标记法，也不用对float进行转换，直接是样式表的值即可，如backgroun-color
		// 先使用getPropertyValue方法获取样式值是为了兼容IE9下获取filter样式。没有这个方法，才使用computed[name]获取样式值。
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// 此方法来源于Dean Edwards--并不十分理解？？？？？？？？？？？
		// 为了兼容有的浏览器margin相关方法返回百分比等非px值的情况，由于width输出是px，并且margin的百分比是按照width计算的，
		// 因此可以直接赋值width。设置minWidth/maxWidth是为了保证设置的width不会因为超出限制失效
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// 记录原始值
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// 传入新值后，再计算width
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// 回复值
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// 处理IE对zIndex返回integer类型的bug
		ret + "" :
		ret;
}

// 根据conditionFn()结果判定是否需要hook，如需要则将hook.get=hookFn
function addGetHookIf( conditionFn, hookFn ) {

	// 定义这个hook，如果真的需要，jQuery会在第一次运行时检查
	return {
		get: function() {
			if ( conditionFn() ) {

				// 如不需要hook，或者由于依赖不能使用hook，删除get方法
				delete this.get;
				return;
			}

			// 如需要hook，则重新定义hook，避免support测试不再执行
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// 如display为none或以table开头（但除了"table", "table-cell", or "table-caption"），需要包裹一下
	// 这是查看display的值//developer.mozilla.org/en-US/docs/CSS/display
	// 这个主要是针对display这个属性的某些属性值进行处理
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	// 匹配以--开头，判断name是否为CSS自定义属性，Css自定义属性都是以--开头
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},
	// 浏览器厂商前缀数组
	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// 给一些样式属性增加浏览器前缀
// 返回带有浏览器前缀的map表
function vendorPropName( name ) {

	// 快捷方式判断name是否需要增加浏览器前缀
	// ***********************提供如何判断哪些样式需要增加浏览器前缀
	if ( name in emptyStyle ) {
		return name;
	}

	// 检测浏览器前缀名
	// 把name的第一个字符变为大写，如rex变为Rex
	// 因为浏览器厂商样式都是形如：webkitColumnBreakInside形式
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// 根据jQuery.cssProps和浏览器前缀属性，返回一个map表
// 将name转换成style设置时使用的名称
function finalPropName( name ) {
	// cssProps主要是针对一些特殊情况，如float，返回style中使用的名称
	// 如果需要兼容低版本的ie，可以才cssProps中这样返回：
	// { "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"}
	// 如除了float，又有其他的样式名称需要转换，假如有个样式是rex，需要转换为REX，在cssProps中增加
	// { "float":"cssFloat","rex":"REX"}
	var ret = jQuery.cssProps[ name ];	// 如name为float，返回cssFloat
	if ( !ret ) {
		// vendorPropName,给一些样式属性增加浏览器前缀
		// vendorPropName计算后的带有前缀的样式会添加到cssProps中，这样遇到相同name无需再进行计算增加前缀了
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}
// 对value值进行调整，并设置有效值
// 保证非负值，保留单位，subtract可以指定需要减去的值
function setPositiveNumber( elem, value, subtract ) {

	// 任何+123或-123都再这进行处理
	var matches = rcssNum.exec( value );
	return matches ?

		// ( subtract || 0 )避免cssHooks使用时，subtract出现undefined值
		// Math.max是保证不让有些属性值为负
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

/**
 * 根据不同的box-sizing模型，对width或height进行修正
 * @param elem				匹配的元素
 * @param name				需要进行样式操作的属性，如width或height
 * @param extra				extra || ( isBorderBox ? "border" : "content" )；
 * 							对于$().css()函数调用，extra传过来的都是undefined或false；
 * 							根据代码理解，如extra==margin，则在width或高增加margin的距离
 * @param isBorderBox		是否为borderbox
 * @param styles			elem的计算样式值，使用getStyles(elem)获得
 * @return {number}
 */
function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// 如有正确的测量结果，避免再增加
	// 对于border-box，传入参数isBorderBox为true，故传入border
	// 但 isBorderBox为false，故此if为false
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;	// 对于标准盒子模型，不需要添加margin和padding

	// 否则初始化水平或垂直属性
	} else {
		i = name === "width" ? 1 : 0;// 如name为width，则不增加margin-top，padding-top值
	}

	for ( ; i < 4; i += 2 ) {// i+=2,只添加top，bottom或left，right

		// 两个盒子模型，width/height都不包括margin距离	，如extra===margin，则将margin增加到val上
		if ( extra === "margin" ) {
			// cssExpand:padding，margin的4个方向
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {// valueIsBorderBox是true

			// border-box 包括padding，如我们需要content宽度，需要删除padding
			if ( extra === "content" ) {
				// true表示返回值没有单位
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {// valueIsBorderBox是false

			// extra值不是content, 所以在val上增加padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// extra值不是content也不是padding；val上增加border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}
	// 对于border-box返回的是border + padding
	return val;
}
// 获取宽高
function getWidthOrHeight( elem, name, extra ) {

	// 先获得计算样式
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		// boxSizing:用于计算元素宽度和高度的默认的 CSS 盒子模型
		// content-box标准盒子模型
		// border-box:width与height包括内容，内边距和边框，但不包括外边距
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// 单位不是px，则直接返回
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// 如是border-box，再检查下，防止有些浏览器getComputedStyle 返回不可靠值，出现错误的box-sizing值
	// 如是border-box，elem内联无height/width信息，则对于chrome会返回false
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// 内联元素没有height/width的为auto时，使用offsetWidth(gh-3571)
	// offsetWidth:返回元素的可见宽度，宽度的单位为画素（pixels)。该宽度包括 内缘（padding）、线框（border） 和滚动条尺寸。
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// 通过parseFloat将val转换成纯数值或0
	val = parseFloat( val ) || 0;

	// 使用合适的 box-sizing 模型增加或减少相关的样式值（因为box-sizing不同，width，height是不同的）
	return ( val +
				// 对于$().css()函数调用，extra传过来的都是undefined或false
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// “添加样式属性”hooks以覆盖获取和设置样式属性的默认行为。
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// opacity属性，应该总返回一个数值
					// 如未设置，则返回1
					var ret = curCSS( elem, "opacity" );// curCSS获取的是浏览器计算后的最终值
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// cssNumber里的样式，不自动添加px单位
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// 在设置或获取值之前添加您希望修复的名称。
	cssProps: {
		"float": "cssFloat"
	},

	// 获取并设置DOM Node上的样式属性。
	// 对于$().css调用此函数，value为undefined，extra为undefined
	// 参数：elem是元素，name是样式名称，后面2个是用于把样式值转为数字类型（后面2个参数在$().width()使用再看）
	// 综合取值和设置值操作：
	// 取值操作：1、hooks的get返回值!=undefined，用此值
	//	        2、否则使用elem.style[...]获取值（并不是计算后的样式值）
	// 			3、注意：$('li').css()方法并不使用jQuery.style()取值，故此函数取值方法并没有对css自定义属性做判断
	// 设置值：1、value为null，不设置
	// 		  2、$('li').css('height',2);value为数值，则增加px单位
	style: function( elem, name, value, extra ) {

		// 不要在文本和注释节点上设置样式。
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// 确保我们使用的是正确的name值，即name进行驼峰标记法转换，是否为自定义样式判断
		var ret, type, hooks,
			// 因为上来调用name转驼峰标记法，因此.css({ "background-color": "#ffe", "border-left": "5px solid #ccc" }) 和
			// .css({backgroundColor: "#ffe", borderLeft: "5px solid #ccc" })返回相同值
            // jq支持驼峰和’-‘串联两种写法,这里进行了处理
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),//匹配以--开头，判断name是否为CSS自定义属性，Css自定义属性都是以--开头
			style = elem.style;

		// 确保我们使用正确的名称，如是用用户定义的css自定义属性，我们不想修改他的值
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// 先使用有前缀的name，然后再用原始name，获得cssHooks
		// cssHook，即是对不同浏览器，不同属性的兼容
		// 获取cssHook值
        // jQuery.cssHooks是样式机制的钩子系统。可以对需要hack的属性，添加钩子，
        // 在jQuery.css、jQuery.style读取写入之前，都会先看是否存在钩子并调用，
        // 然后决定是否继续下一步还是直接返回。通过在set、get属性中定义函数，使得行为正确一致。
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// 检查是设置值还是取值
		if ( value !== undefined ) {
			type = typeof value;	// 判断value的数据类型。

            // 允许增量’+=20px’式写法，由于采用jQuery.css获取的初始值单位有可能不同，
            // 因此封装了一个自动单位换算并输出增量后最终结果的函数adjustCSS()
            // 转换 "+=" 或 "-=" 到相关numbers (#7345)
			// $().css('margin':'+=10'),如之前margin为10，则现在为20
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				// 对于类似+=，-=的调用方式如$('p').css('height','+=10%')，进行值计算
				value = adjustCSS( elem, name, ret );

				// 修改bug #9237
				type = "number";
			}

			// 确保value为null或NaN不会设置 (#7116)
			if ( value == null || value !== value ) {
				return;
			}

            // 为了提高易用性，jQuery.style()可以自动为设置值加上默认单位’px’，
            // 由于有些属性值可以为数字，因此定义了cssNumber的列表，列表中的项目不会加上默认单位。
			// 如value为数值，则为value增加单位 (除了某些CSS属性)
			if ( type === "number" ) {
				// cssNumber里的样式，不自动添加px单位
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* 属性会影响原始的克隆值
			// 如当前浏览器存在background的bug则修复下，修复与判断并不理解
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// 如果hook提供set方法，并且set结果值不是undefined，使用hooks后的值
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {
				// css自定义属性要使用setProperty设置
				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {// 取值操作

			// 如果hook提供了get方法获取非计算值，使用之
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// 如无hook的get方法，则直接从style对象中获取值
			return style[ name ];
		}
	},
	// 访问匹配元素的样式属性。
	// 注意与style区别，CSS只是获取值（参数并没有value值），并没有设置，并没有进行DOM操作
	// 因为jQuery.css并未对name参数进行处理，jQuery.css不能传入obj，name为obj jQuery.camelCase会报错
	// 调用1：对于 $('p').css('padding')，会调用jQuery.css();
    // 返回值：
    //     jQuery.css对样式值的读取，可以指定对于带单位字符串和”auto”等字符串如何返回，新增了extra参数。为""（不强制）和true（强制）返回去单位值，false不做特殊处理直接返回。
    // 功能扩展：jq允许直接通过innerWidth()/innerHeight()、outerWidth()/outerHeight()读取，也支持赋值，直接调整到正确的宽高。这是通过extra指定padding、border、margin等字符串做到的
    // cssHooks.expand：对于margin、padding、borderWidth等复合属性，通过扩展expand接口，可以得到含有4个分属性值的对象
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );// 判断name是否为CSS自定义属性

		// 确保我们使用正确的名称，如是用用户定义的css自定义属性，我们不想修改他的值
		if ( !isCustomProp ) {
			// 将name进行转换，对需要的增加浏览器前缀，float改为cssFloat
			name = finalPropName( origName );
		}

		// 先使用有前缀的name，然后再用原始name，获得cssHooks
		// cssHook，即是对不同浏览器，不同属性的兼容
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// 如提供了hooks方法，并有get方法，通过hooks的get获取value值。
		if ( hooks && "get" in hooks ) {
			// 此处的hooks.get调用与$.style()不同，true表示获得计算后的样式（具体原因hooks再看）
			// 但并不是什么时候都可以获得计算后样式的，比如：
			// 新创建的元素，在没有添加到文档中时，浏览器没有对此元素进行渲染，样式还没有计算，所以只能获得非计算的样式值。
			val = hooks.get( elem, true, extra );
		}

		// 如无hooks，那么调用curCss方法获取样式值
		if ( val === undefined ) {
			//对于调用1： $('p').css('padding')， elem为匹配的p元素，name为padding，styles为undefined
			val = curCSS( elem, name, styles );
		}

		// 属性值为"normal"，若为cssNormalTransform内的属性，把对应值输出
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

        // extra === "" 去单位处理，若为"normal"、"auto"等字符串，原样返回
        // extra === true 强制去单位，若为parseFloat后为NaN的字符串，返回0
        // extra === false/undefined 不特殊处理
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );
// 增加height与width的cssHooks
jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// 一些元素虽然不可见，但是是可以有宽高的，但是最好是有一个具体的样式属性值
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns在Safari浏览器具有非0的offsetWidth值
					// 并且，如display不改变，getBoundingClientRect().width 一直为0
					// Support: IE <=11 only
					// 调用 getBoundingClientRect 在一个非DOM节点元素时，在IE会抛出错误
					// elem.getClientRects()返回元素相关的CSS边框信息，如bottom，left，width等
					// getBoundingClientRect()返回元素左，上，右和下分别相对浏览器视窗的位置，里面right是指元素右边界距窗口最左边的距离，bottom是指元素下边界距窗口最上面的距离。
					// 对于最简单的display:none,则都为0；但实际是有宽高的，处理方式是将隐藏的elem元素，设置cssShow属性，得到宽高，然后再将设置的属性还原
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},
		// 对于类似 $('#a').css('width','200px')调用，extra传入为undefined
		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),//因此styles为undefined
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// 如需要值调整，则转换为px
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}
			// 对value值进行调整，并设置有效值
			return setPositiveNumber( elem, value, subtract );
		}
	};
} );
// support.reliableMarginLeft,浏览器都返回true，有些老的浏览器返回false
// 正常浏览器，width=0，marginleft=0，获取的marginleft应为0
jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// 这些hooks为了在animate中扩展属性使用的
// 对于margin、padding、borderWidth等复合属性，通过扩展expand接口，可以得到含有4个分属性值的对象。
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// 如对于设置margin：10px 5px 2px 3px，则转换为数组形式[]
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				// cssExpand为top，left等4个方向
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

// 访问第一个匹配元素的计算后样式值。
// $("p").css({ "color": "#ff0011", "background": "blue" });
jQuery.fn.extend( {
	/**
	 * 调用方式：
	 * 获取样式值：return String
	 * 1、string形式：$('li').css('background-color');
	 * 2、数组形式：$('li').css(['background-color','font-size'])，返回map，{'background-color':'#000','font-size':'12px'}
	 * 设置值：return jQuery
	 * 1、obj形式：$('li').css({'background-color':'#000','font-size':'12px'}),实际是通过access内部循环调用access，将值分别设置
	 * 2、$('li').css(name,value);value为undefined，调用jQuery.css方法，否则调用jQuery.style()方法
	 *
	 */
	css: function( name, value ) {
		// 如name为obj，access中会对obj进行循环调用access，将每个key-value再调用一次access函数
		// 对于如$('li'),匹配了多个元素，实际access绑定数据的是elems[ 0 ]元素，access最后返回
		// len ? fn( elems[ 0 ], key ) : emptyGet;len为匹配元素长度
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;
			// 如name为数组，类似$('p').css(["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]);
            //  增加一种个性化的 取值 方式
			if ( Array.isArray( name ) ) {
				// 获得元素elem的计算属性
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
                    // false参数则只返回未经处理的样式值，给定了styles则从styles对象取样式
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
                // 赋值
				jQuery.style( elem, name, value ) :
                // 取值
				jQuery.css( elem, name );	// value为undefined时，调用jQuery.css
		}, name, value, arguments.length > 1 );
	}
} );

/****************************动画*******************************************/
// 动画举例，div，从100px挪动到200px
// <div id="book" style="width: 100px;height: 100px;background:red;position: relative; left: 100px;"></div>
// 	$('#book').animate({
// 		left: '200'
// 	},1000,function(){
// 		console.log('ha')
// 	})
// Tween构造方法与jQuery类似
// 生成单个属性的运动对象，创建动画缓动对象
function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
// jQuery.Tween = new Tween.prototype.init( elem, options, prop, end, easing );
jQuery.Tween = Tween;
// 主要是返回或设置当前元素，针对某个属性具体值
// cur返回left当前值
// run设置元素当前位置left值
Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
        // 默认easing为swing
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();	// start与end为开始与结束的样式值100,200无单位
		this.end = end;
        // 除了cssNumber中指定的可以为数字的属性，其它默认单位为px
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
    // 计算当前样式值
    // 如prop有propHooks的get方法，则使用，否则使用默认的
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	// 会在tick函数中，传入percent，percent即是实际运行一次所占duration的比率
	// tick函数理解为每帧调用的函数，即13ms一次
	// 此函数是根据，传入的时间占比情况，计算时间样式变化占比，比如left从100到200px，计算每次left挪到到多少
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			// 时间过了百分之x，并不代表需要运动百分之x的距离，调用easing对应的函数
			// 可以在jQuery.easing中扩展运动函数，默认"swing"缓冲
			// 默认jQuery.easing只是用了percent一个参数，但可以扩展
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			// duration为0，则percent一定为1
			this.pos = eased = percent;
		}
		// this.now为本次tick调用后，left应该到达的位置
		this.now = ( this.end - this.start ) * eased + this.start;
		// options对象可以指定step函数，每个tween调用一次，都会被执行
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}
		// 根据计算好的时间，设置实际变化的属性，比如left从100到200px，每次运行tick后，
		// 设置left应该到什么位置，比如是101px
		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;
// 提供默认的获取和设置当前元素样式值的方法
// get即是进行条件判断后调用jQuery.css
// set即是jQuery.style或在属性上绑定值的一些判断
Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// 非dom节点，属性有值而style上无值的dom节点，均返回属性值
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// 第三个参数为空字符串给.css,因为内部parseFloat处理，
			// 会将值解析，去除单位，如果解析不了，则直接返回字符串
			// 如10px传入去解析，为10；如传入aaa，会返回aaa
			result = jQuery.css( tween.elem, tween.prop, "" );

			// "", null, undefined and "auto" 转换为 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// 使用step hook做后补
			// 如有cssHook，使用
			// 如.style可以使用，则使用
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
				// elem为元素节点，并且 是cssProps里面的，或是cssHook里面的，使用style设置
				// 凡是执行run的，一定执行了cur函数，cur函数使用jQuery.css获取样式值；
				// jQuery.css里面finalPropName函数会将prop存在cssProps里面，说明elem.style[修正属性]一定存在，至少返回""
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				// 最后，则把值设置到属性上
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// 在非dom节点上设置，会出bug
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		// 节点类型，并且有父节点（根元素也有父节点，为document）
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

/**
 * 如果要扩展动画效果，则扩展这个属性jQuery.easing
 */
jQuery.easing = {
	// 线性运动
	linear: function( p ) {
		return p;
	},
	// 缓冲
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
    // inProgress，是否在动画执行过程中
	fxNow, inProgress,
	// 动画种判断是否有toggle，show或者hide
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	// 递归调用的用setTimeout模拟setInterval函数
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
		    // requestAnimationFrame :<=ie9不支持
            // requestAnimationFrame采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；
            // 也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，
            // 从而节省系统资源，提高系统性能，改善视觉效果
            // cancelAnimationFrame方法用于取消定时器,与setTimeout区别是不需要传事件间隔
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// 同步创建的动画将同步运行
// 利用setTimeout，异步创建fxNow当前时间
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// 为jQuery几种便捷的动画调用方式提供参数，构建slideDown，slideUp，slideToggle，无includeWidth参数
// slide动画效果是高度逐渐减小或增大
// 比如slideDown: genFx( "show" )
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// 如includeWidth为true，则利用cssExpand，将属性扩展为上下左右，步长为1
	// 否则步长为2，忽略l左右
	// 即将padding，margin样式终值设为type
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}
	// 如includeWidth为true，则width，opacity都设为type
	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

/**
 * Animation中的调用，jQuery.map( props, createTween, animation );
 * 其中props假设为{left:'200px'},animation为Animation里面封装的Deferred对象
 * @param value				200px，注意这个value值是动画结束时的位置
 * @param prop				left
 * @param animation
 * @return {*}
 */
function createTween( value, prop, animation ) {
	var tween,
		// Animation.tweeners默认只有一个名为*函数，可以通过插件扩展Animation.tweeners
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// // 有返回值，则返回，不再遍历
			return tween;
		}
	}
}

/**
 * 对某些属性进行适配处理，如height/width的动画要求display和overflow为特定的值才能有效果；
 * 比如对show/hide动画需要对一大堆css特征值进行动画
 * 1、对属性值有show，hide，toggle的进行处理
 * 2、对width，height动画时，不同display进行处理
 * @param elem			当前匹配元素
 * @param props			动画结束位置
 * @param opts			是jQuery.speed获取动画相关参数的对象
 */
function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),//判断是否为display:none
		dataShow = dataPriv.get( elem, "fxshow" );

	// animate调用时，可以给options传入queue:false参数，或一个字符串
    // ?????????不是很理解这段，应该是保证定动画完成前，调用complete函数，并删除dataPriv上的动画队列
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;// 保存_queueHooks的empty方法,empty:dataPriv.remove( elem, [ type + "queue", key ] );
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// 确保动画在完成前会调用complete函数
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// 检测是否有show，hide或toggle动画效果，如类似height:toggle，会将高度逐渐减小到没有
    // 如元素本身为show，动画终止又是show，则跳过，否则将show，hide，toggle，转为当前元素属性值
	// $('#book').animate({
	// 	width :'1000px',
	// 	height: 'toggle'
	// },1000,function(){
	// 	console.log('ha')
	// })
	for ( prop in props ) {
		value = props[ prop ];
		// 动画种判断是否有toggle，show或者hide
		// 主要是进行elem，display与设置show，hide是否一致，如本身为show，又设置show；
		// 将hide，这些字符串进行转换；如elem原始为show，设置为hide，则将height设为datashow或elem本身高度
		// 如元素原来是show，又设show，则删除height
		if ( rfxtypes.test( value ) ) {
			// 删除属性值为toggle，show，hide的属性，如上面例子，则删除height
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			// hidden为elem当前display是否为none，value为动画设置的值
			// 如elem本身为hide，又设置为hide，或show又设为show
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// 如value为show，并且fxshow有数据，则阻止元素show
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// 否则跳出循环
				} else {
					continue;
				}
			}
			// 如无dataShow数据，则绑定当前elem的prop样式值，（带单位）
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// 如props是空，且orig为空，则返回，没有动画结束位置，不进行动画操作
	// 要先判断是否有show，hide等value值，再判断props是否为空
	// 因为，终点动画只有一个值{height:'show'}；height被删除
	// props为空，但如果elem本身为hide，则会在orig添加一个height属性，属性值为dataShow.height或元素本身高度
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// 如对width或height进行动画，针对display：none，inline,inline-box等不同display属性，应该如何处理
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// 记录3个overflow属性，因为ie不能从overflowX，overflowY推断出overflow值
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// 如dataPriv获取不到fxshow上的display值，则获取dataPriv上的display值
		// 获取存储的display值，这个主要用于动画种有show，hide，toggle
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );//设元素需要恢复的display属性值
		}
		// 获取当前元素的display值
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// 通过临时设置元素可见性，好在之后获取width或height值（如非0）
				showHide( [ elem ], true );// 显示元素
				// 对于display:none元素，如内联设置了，showHide会将样式设置为""，showHide再细说
				restoreDisplay = elem.style.display || restoreDisplay; // 获取内联display值
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// inline元素，以inline-box使之产生动画
		// 如display===inline或   inline-block但restoreDisplay不为null或undefined
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// propTween：为删除了height，width是否还有其他属性需要进行动画
				// 如有返回false
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}
	// 重点2:对于height/width动画overflow都要设置为"hidden"，动画完成后恢复。这个有利于提高渲染速度。
	// 如是对width或height设置动画，则会设置opts.overflow属性
	if ( opts.overflow ) {
		style.overflow = "hidden";
		// 不管调用的是deferred.resolve()还是deferred.reject()，最后总是执行。都会设置style的overflow3个属性
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// 实现show,hide动画，这个动画效果相当于是在动画done之后，show或hide
	propTween = false;
	for ( prop in orig ) {

		// 通用的元素 show/hide引擎
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// 如属性值为toggle，存储hidden/visible值
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// 元素动画前先显示隐藏元素
			// 对于隐藏元素，需要先show，才能看到动画效果
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// “隐藏”动画的最后一步实际上是隐藏元素。
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				// 给元素设置动画最终效果
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// 生成属性独立的缓动对象
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

/**
 * 创建tween对象
 * Animation中的调用，jQuery.map( props, createTween, animation );
 * 其中props假设为{left:'200px'},animation为Animation里面封装的Deferred对象
 * @param value				200px，注意这个value值是动画结束时的位置
 * @param prop				left
 * @param animation
 * @return {*}
 */
function createTween( value, prop, animation ) {
    var tween,
        // Animation.tweeners默认只有一个名为*函数，可以通过插件扩展Animation.tweeners
        collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
        index = 0,
        length = collection.length;
    for ( ; index < length; index++ ) {
        if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

            // // 有返回值，则返回，不再遍历
            return tween;
        }
    }
}

/**
 * 属性修正。实际是为多种参数传递进行优先级划分
 * 属性修正指的是对动画传入的结束样式进行修正
 * 属性变为小驼峰，把还会利用cssHooks.expand把margin、padding、borderWidth拆分成4个方向
 * @param props				结束时的属性，{left:'200px', width:'500px'}
 * @param specialEasing		如可以在options中配置不同属性使用不同的缓动函数
 * 							specialEasing: {
 *   						  width: "linear",
 *   						  height: "easeOutBounce"
 *   						}
 */
function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		// easing优先级：value[ 1 ] > options.specialEasing[ name ] > options.easing
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}
		// 修改属性名，将属性名转换为驼峰标记法的
		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			// expand扩展，margin/padding/border扩展为四个方向名值对形式
			// 如margin:10px 5px 2px 1px 转为marginTop:10px,marginRight:5px的对象
			value = hooks.expand( value );
			// 删除原有margin/padding/border属性
			delete props[ name ];

			// 如在props指定了marginTop，则认为通过hooks转换的marginTop优先级更低
			// 故不使用$.extend合并对象
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

/**
 * 动画核心函数，返回animation
 * 重点参考：http://www.cnblogs.com/chuaWeb/p/jQuery-1-9-1-animate-1.html
 * @param elem
 * @param properties
 * @param options
 * @return {*}
 * @constructor
 */
function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		// 默认length为1，只有一个defaultPrefilter，属性过滤器，prefilters
		length = Animation.prefilters.length,
		// 初始化一个延时对象，这个延时对象用来处理动画队列。
		deferred = jQuery.Deferred().always( function() {

			// 为了构建:animate选择，在动画结束后，无论成功与否，都删除tick上的elem
			// 这样在:animate就返回elem===fn.elem匹配不到，返回false
			delete tick.elem;
		} ),
		// 生成一个每一个时间点（相邻两个时间点的事件间隔默认为13毫秒）上都会执行的函数tick，
		// 这个tick函数会保存在jQuery.timers中，然后每次执行jQuery.fx.tick的时候会取出来执行。
		tick = function() {
			if ( stopped ) {
				return false;
			}
			// 根据动画每步计算方法2，获得每一步运行时，占用总时间的比率
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// android使用这样语法 `1 - ( 0.5 || 0 )`会导致崩溃 (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				// 传入百分比，把元素设置到合适位置
				animation.tweens[ index ].run( percent );
			}
			// tick函数每调用一次，options.progress就执行一次
			// notify动作是在progress这个Callback里
			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// 如percent小于1，则表示动画未完成，返回剩余时间

			if ( percent < 1 && length ) {
				return remaining;
			}

			// ？？？？？？？？？？？
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// resovle这个动画，报告结果
			// 触发成功状态，会调用complete
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		// 把对象中属性和值copy到deferred.promise中得到animation（一个promise对象）
		// 生成动画用的所有特征组成的对象animation
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			// 此方法是生成动画算法与流程控制器，即动画每一步运动到哪里，主要源于Tween的cur与run函数
			// 这只是定义createTween，创建各个属性缓动对象的函数
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				// 将创建的缓动对象（每个属性会创建一个）推入tweens堆栈
				animation.tweens.push( tween );
				return tween;
			},
			// 用于外部来停止动画的函数
			stop: function( gotoEnd ) {
				var index = 0,

					// 如gotoEnd为true，则想停止tweens数组全部动画，
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					// 如不是gotoEnd为true，则只需要停止当前动画
					// 停止动画思路，就是将当前位置认为是动画结束位置，即100%的位置
					// percent为1，表示，直接运动到动画结束状态
					// length被设为0，不进行run
					animation.tweens[ index ].run( 1 );
				}

				// gotoEnd为true，则resovle，调用complete与progress
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					// 触发reject
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		// animation.props中保存的是用户传入的特征（动画最终目标）。
		props = animation.props;
	// 属性修正。即是对传入的动画终止属性进行修正。并为多种参数传递进行优先级划分
	propFilter( props, animation.opts.specialEasing );
	// 调用defaultPrefilter做适配处理:比如对height/width的动画要求display和overflow为特定的值才能有效果；
	// 比如对show/hide动画需要对一大堆css特征值进行动画，并且在函数里就调用createTweens生成缓动动画。
	for ( ; index < length; index++ ) {
		// 默认只有一项defalutPrefilter，show/hide/toggle机制处理、inline元素处理。无返回值
		// 这里指的是如果自己通过jQuery.tweener()进行了拓展hook，即插件使用者，会获得result结果
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					// result.stop.bind(result)
					jQuery.proxy( result.stop, result );
			}
			// 如有自己定义的动画，则不再返回默认Animation动画
			return result;
		}
	}
	// 对每个属性调用创建缓动对象，如props：{width:'500px',left :'1000px'}
	// 会把结果推到animation.tweens中
    // jQuery.map有返回值，返回值是tween对象数组，每个对象的样式值是通过ajustCss处理之后的
	jQuery.map( props, createTween, animation );
	// options可以写一个start：function(){}定义动画开始前执行的函数
	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	//  链式返回animation，从这里也可以看出options还可以指定progress、done、complete、fail、always函数
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
	// 启动动画计时,定时执行tick
	jQuery.fx.timer(
		// 为tick添加elem，anim，queue，3个属性，并放入全局interval中
		// 为何要绑定elem，anim，queue，这个在stop函数中有用，用于检测tick函数
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		// 会调用Animation的animation对象的createTween，创建动画结束时tween对象，value值为动画结束时位置
		// 可以是100，100px,+=100;这些处理都是在adjustCSS中处理的，把单位放在tween.unit
		"*": [ function( prop, value ) {
		    // this.creteTween，调用的Animation函数中animation对象的createTween函数
            // 主要是利用jQuery.Tween创建缓动对象，并将缓动对象压入animation.tweens中
            // 注意，虽然压入animation.tweens数组，由于tween对象指向相同，更改了tween，animations.tweens数组对象对象也会更改
            // 所以下面调用ajustCss对+=等数值进行调整，animations.tweens也会调整
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			// 返回的tween值不带单位，+=等也计算出结果
			return tween;
		} ]
	},
	// 可以通过此函数扩展tweeners，props为tweeners中key，callback为对应的函数
	tweener: function( props, callback ) {
		// 如props为函数，则默认使用tweeners['*']这个数组
		// 如props='a b c',则会在tweeners.a,tweeners.b,tweeners.c分别添加callback函数
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			// 如当前 Animation.tweeners[ prop ] 不存在，则创建个空数组
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			// 向数组开头添加callback函数
			Animation.tweeners[ prop ].unshift( callback );
		}
	},
	// prefilters队列，默认只有defaultPrefilter一个函数
	prefilters: [ defaultPrefilter ],
	// 为prefilters添加删除callback函数使用，prepend：true表示添加
	// 比如，某天有border的div不能改width值形成动画，可以使用prefilter添加具体逻辑的函数
	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );
/**
 * 方法主要是：修正参数，时间、算法、重写回调函数
 * 如下，2种调用方式，此函数将参数进行处理，并且修正callback回调函数, 加上dequeue的功能
 * 方法返回：包含了修正后的动画执行时间, 动画算法, 回调函数的对象.
 * 这个方法暴露在jQuery上，是为了可以给jQuery插件开发者提供构建新的animation方法的
 * animate调用方式：.animate( properties [, duration ] [, easing ] [, complete ] )，.animate( properties, options )
 * 				properties为动画终止时样式，因此animate的第二个参数起传入speed
 * 调用方式：jQuery.speed( [duration ] [, easing ] [, complete ] )
 *          jQuery.speed( settings )
 * @param speed         动画运行时间
 * @param easing        动画的缓动效果
 * @param fn            动画完成时的回调
 * @return {{complete: (*|boolean), duration: *, easing: (*|boolean)}}
 */
jQuery.speed = function( speed, easing, fn ) {
    // 修正参数，如speed是对象，则返回opt为对象,对应jQuery.speed( settings )
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		// 如speed不是对象，对应jQuery.speed( [duration ] [, easing ] [, complete ] )
		complete: fn || !fn && easing ||    // complete使用规则 fn>easing>speed
			jQuery.isFunction( speed ) && speed,
		duration: speed,
        // 如fn为undefined，easing为func，则easing：fasle
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// 如jQuery.fx.off为true，直接到终点状态
	// 动画可以通过外部设置jQuery.fx.off为true停止，如设置了所有动画会直接到达终止状态
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
		    // 如duration不是数值，则查看是否为speeds中设定的slow，fast等标志运动时常的字符串
            // 如是，则获取定义的时常，否则用_default时常
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

    // true/undefined/null -> 设为默认队列"fx"
    // optall.queue指定为false时，不使用queue队列机制，
    // doAnimation将立即调用Animation执行动画，保留了原有的同步机制。
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// 保留用户设定的完成函数
	opt.old = opt.complete;
    // 将用户定义的动画完成回调函数进行包装
    // 即增加队列操作，目的是该函数可以dequeue队列，让队列中下个doAnimation开始执行
	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}
        // 如opt.queue为true，则在调用了complete的同时，进行出列操作
		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	/**
	 * 调整匹配元素的透明度
	 * .fadeTo( duration, opacity [, complete ] )，持续时间，opacity从0到1的值，complete：完成回调
	 * .fadeTo( duration, opacity [, easing ] [, complete ] )，easing，缓动函数
	 * 渐变，从0到to，不可见的也将可见
	 * @param speed
	 * @param to
	 * @param easing
	 * @param callback
	 * @return {*}
	 */
	fadeTo: function( speed, to, easing, callback ) {

		//  // 把所有隐藏元素的设为显示，并且透明度设为0（暂时看不见）
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// 回到this，所有元素opacity运动到to
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
            // 对参数进行处理，并根据opt.queue是为true 或==null，对回调函数callback进行可队列操作的包装
			optall = jQuery.speed( speed, easing, callback ),
			// 真正执行动画的地方是Animation函数
			doAnimation = function() {

				// 在特征的副本上操作，保证每个特征效果不会被丢失
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// 空动画或完成需要立马解决，dataPriv.get( this, "finish" )会在finish中提供
				if ( empty || dataPriv.get( this, "finish" ) ) {
					// 删除动画队列里的动画
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;
		// 由于参数option可以传递queue:false或queue：'aa'形式，
		// 如为fasle，则在每个元素直接运行doAnimation函数
		// 如为字符串形式'aa',则创建aa的动画序列，需要调用.dequeue("queuename")才能开始动画
		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );// 因为jquery.fn.queue里面对于key为fx的队列，调用了dequeue出列函数，故动画会自动运行队列第一个
	},
	/**
	 * 停止匹配元素正在运行的动画
	 * 调用方式：.stop( [queue ] [, clearQueue ] [, jumpToEnd ] )
	 * 根据api要求.stop( [clearQueue ] [, jumpToEnd ] )都为boolean类型
	 * .stop( [queue ] [, clearQueue ] [, jumpToEnd ] )为string，boolean，boolean类型
	 * queue： 需要停止的动画队列
	 * clearQueue：是否删除队列中的动画，默认为false;比如,
	 * 			$('#book').animate({left :'1000px'},1000); $('#book').animate({top :'1000px'},1000);
	 * 			这是两个队列，在动画运行第一个时，调用stop(),第二个动画还会运行，但如调用stop(true)则两个动画都停止
	 * jumpToEnd，是否立即完成当前动画，默认为false,注意是当前动画，true表示动画直接到最终状态，false则是停在调用stop时元素属性的状态值
	 * @param type
	 * @param clearQueue
	 * @param gotoEnd
	 * @return {*}
	 */
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};
		// 参数调整
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		// clearQueue为true，type为string，清除type动画队列的全部动画
		// type不是string，则就是	undefined，不会是false
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				// type只有undefined和字符串两种可能
				// 如无自定义动画队列，即type不为string，则type为undefined，返回type + "queueHooks"
				// 否则对于默认动画队列，返回false
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );// 获取当前匹配元素elem的dataPriv，如有动画的话，上面会存储动画队列

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&	// 匹配队列和元素,
					( type == null || timers[ index ].queue === type ) ) {
					// anim.stop函数，如gotoEnd为true，true表示动画直接到最终状态，触发notifyWith，resolveWith
					// 如gotoEnd为false，会触发deferred.rejectWith，即会在动画停止时调用fail函数
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );	// 对于停止动画，则删除timers里面的当前tick函数
				}
			}

			// gotoEnd为false，会执行出列动作，这样当前动画停止了，但后面的动画由于出列，则继续运行
			// 比如说，直接调用jquery.fn.delay，然后调用stop，打算停止延迟，会到这里，因为delay并没有往timers增加ticks函数
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	/**
	 * 停止当前动画，删除队列里全部动画，直接将动画设置为最终状态
	 * 类似于.stop(true, true)，清除queue，并将当前动画跳到最终状态；
	 * 但不同的是，finish，是将所有动画跳到最后
	 * @param type
	 * @return {*}
	 */
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// 设置私有数据上动画结束标识
			// 这样animate的，dataPriv.get( this, "finish" )就会为true，因此运行的动画会直接调用anim.stop
			// doAnimation = function() {
			// 	var anim = Animation( this, jQuery.extend( {}, prop ), optall );
			// 	if ( empty || dataPriv.get( this, "finish" ) ) {
			// 		anim.stop( true );
			// 	}
			// };
			data.finish = true;

			// 首先情况queue
			jQuery.queue( this, type, [] );
			// 如hooks有stop，则调用，如jQuery.fn.delay上的hooks.stop，清除定时器
			// stop掉type对应的"非doAnimation"动画
			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// 寻找任何正在运行的动画，直接到最终状态
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// 将原队列的动画finish？？？？？？？？？？
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// 删除finish标识
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];	// 获取$().show(),$().hide()，无参数函数定义
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		// 为$().show增加实现动画操作，如speed为boolean，或==null，只是调用普通的显示与隐藏元素
		// 否则形成动画操作
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// 构建某些动画的快捷方式
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );
// 如同时调用 $("#box1").animate({});$("#box").animate({});$("#box3").animate({});
// 这样timers里面有3个ticks函数，相当于同步运行3个动画
jQuery.timers = [];     //当前正在运动的动画的tick函数堆栈
// jQuery.fx.tick() 被定时器调用，遍历timers堆栈
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		// 在timers中取出一个tick函数
		timer = timers[ i ];

		// 每个动画的tick函数（即此处timer）执行时返回remaining剩余时间，结束返回false
		// timers[ i ] === timer 的验证是因为可能有hooks在tick函数中删除某个timer，即允许外部删除timer
		if ( !timer() && timers[ i ] === timer ) {
			// 调用了就删除timer
			timers.splice( i--, 1 );
		}
	}
	// 无动画了，即timers.length=0，停止定时器
	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};
// 把动画的tick函数加入$.timers堆栈
// 此函数为Animation调用的函数，timer为Animation中定义的tick函数
jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};
// 13代表了动画每秒运行帧数，默认是13毫秒。属性值越小，在速度较快的浏览器中（例如，Chrome），动画执行的越流畅，
// 但是会影响程序的性能并且占用更多的 CPU 资源
jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};
// 停止全局定时器timerId
jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// 默认速度
	_default: 400
};


// 基于Clint Helfers插件
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
/**
 * 设置一个计时器来延迟队列中后续项目的执行
 * .delay( duration [, queueName ] )
 * @param time		毫秒值，队列下一个函数执行需要延迟的毫秒值
 * @param type		队列名称，默认为fx
 * @return {*}
 */
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;	// 如时间为slow，fast，则用speeds数组值
	type = type || "fx";
	// 在当前队列增加一个定时器，
	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};

/*************************属性操作1：attr,removeAttr************************************/
( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// checkbox默认值是on
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// 必须访问selectedIndex确保默认下拉框选择项
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// 如input更改type为radio，会丢失原有值
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	/**
	 * 获取匹配集合第一个元素的属性值；设置一个或多个属性给所有匹配集合
     * attr使用access包装
     * 它拥有了access提供的四种传值方式：name，(name,value)，({key:value,key:value})，(name,function(index,attr){})
	 * @param name
	 * @param value
	 * @return {*}
	 */
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// 不要在text, comment and attribute 节点上get/set attributes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// 如getAttribute方法不支持，则使用prop方法获取
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks 使用name的全小写key
        // 1、一些特殊的特性，如href、width等=>attrHooks
        // 2、一些值为Boolean的属性，如checked等=>boolHook
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					// 对于类似checked属性，利用boolHook
                    // boolHook只有hooks.set( elem, value, name ),对于attr('checked',false),则是删除属性，其他的为设置属性
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
		    // value === null 则删除name
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}
            // 如hooks有set方法，则调用set，设置属性值
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}
            // 否则，直接调用setAttribute方法设置属性值
			elem.setAttribute( name, value + "" );
			return value;
		}
        // 如val为undefined，且有hooks的get方法，直接获取，并且返回值ret避免==null
		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}
        // 为了保证getAttribute兼容性，调用sizzle里面的attr方法获取属性值
		ret = jQuery.find.attr( elem, name );

		// 对于不存在的属性，调用此方法，返回null，转换为undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// 针对IE <=11 only，value为radio，并且元素是input
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;// 复制原值，设置属性，然后将原值设置回去
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},
    /**
     * 删除属性，本质还是调用removeAttribute
     * @param elem   要删除的元素
     * @param value  value要删除的属性名，可以是'class test'
     * 因此，可以这样一起删除多个属性jQuery.removeAttr(document.getElementById('p1'),'class test')
     */
	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// 属性名能包含非html空白字符
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// boolean属性的hooks
boolHook = {
	set: function( elem, value, name ) {
	    // 如value为false，则删除属性,否则设置属性
		if ( value === false ) {
            //attr("checked",false)调用将会把checked的属性变成"undefined"
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
// jQuery.expr.match.bool.source = "^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$"
// 即匹配boolean属性，\w:由数字、26个英文字母或者下划线组成的字符串
// jQuery.expr.match.bool.source.match( /\w+/g )会将字符串转换为数组形式
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// 通过临时删除这个函数来避免一个无限循环。
            // 因为开始gettter默认为jQuery.find.attr =Sizzle.attr
			// 而Sizzle.attr计算内部val时，又会调用这个函数获得val值
			// 通过Sizzle.attr与当前attrHandle函数，对于checked等boolean属性
			// 返回的则是 ret = lowercaseName，则是checked
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );

/*************************属性操作2：prop,removeProp************************************/


var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},
	// 删除prop，则是循环调用delete 删除，如name需要fix，则用fix后的名字
	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	// 整体逻辑与attr类似，只是获取值的与设置值的方式是 elem[ name ] = value 与 elem[ name ]
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// // 不要在text, comment and attribute 节点上get/set attributes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// 修复名字，添加钩子
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}
			// prop是利用elem[name] =value 方式赋值
			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex当没有明确设置时，并不能总是返回正确值
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// 使用适当的attribute检索(#12072)
				// tabindex 属性规定元素的 tab 键控制次序
				// 以下元素支持 tabindex 属性：<a>, <area>, <button>, <input>, <object>, <select> 以及 <textarea>。
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}
				// &&优先级高于||，因此是elem具有href的a或area，或input等元素，返回0，否则返回-1
				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},
	
	propFix: {
		"for": "htmlFor",
		// 概述中也介绍
		// document.getElementsByTagName('div')[0].className;  // "dddd"
		// document.getElementsByTagName('div')[0]['class'];  // undefined
		// 因此需要对特殊的name进行转换才能获得准确值
		"class": "className"
	}
} );

// Support: IE <=11 only
// 获取元素option的selected属性,修复在IE默认不选中的BUG
// eslint 规则 "no-unused-expressions" 在这段代码中设为disabled，因为这段代码可能被认为错误
// no-unused-expressions：未使用过的表达式在程序中不起任何作用，通常是个逻辑错误
// 例如，n + 1; 不是语法错误，但它可能是程序员的书写错误，原本是想写赋值语句 n += 1;。
//  该问题的解决方案是在访问`selected`属性时，先访问其父级`<select>`元素的`selectedIndex`属性(selectedIndex 属性可设置或返回下拉列表中被选选项的索引号。)
//  强迫浏览器计算`<option>`的`selected`属性，以得到正确的值。
// 	需要注意的是`<option>`元素的父元素不一定是`<select>`，也有可能是`<optgroup>`。
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;
				// 确保也适用于optgroups元素,<option>父级可能是`<optgroup>`
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}
// 其实就是创建jQuery.propFix.tabIndex =tabIndex,jQuery.propFix.readOnly=readOnly等
jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );


/*******************************class操作********************************************/

	// 根据HTML spec协议处理空白，将value数组再拼接为'a b c'形式
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}

// 获取元素elem的class属性值
// 如<p id="a" class="a b c">asdf</p>，document.getElementById('a').getAttribute('class')
// 取到值为'a b c';
function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	/**
	 * 为每个匹配的元素添加指定的类名。
	 * 注意：方法不会替换一个class，只会在现有元素class后面添加新的
	 *
	 * @param value   一个或多个要添加到元素中的CSS类名，请用空格分开
	 * 				  value为function，如：可以为每个li的样式后面增加个序号
	 * 			$( "ul li" ).addClass(function( index,curClass ) {// curClass，当前匹配元素的class值
	   * 			return "item-" + index;
	   * 		});
	 * @return {*}
	 */
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;
		// 如value为函数，递归调用addClass
		if ( jQuery.isFunction( value ) ) {
			// 因此func(index,curClass);第一个参数为jQuery匹配数组的各元素，curClass，当前匹配元素的class值
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}
		// value为String类型，并且不是""
		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];//将以空格分隔的class转换为数组

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );// 获取当前jQuery匹配元素的Class值
				// 为了更好的可压缩性？？？？？
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) { // 如当前节点存在class
					j = 0;
					// 循环遍历要添加的class，利用indexOf确保不添加重复的样式
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// 只有有新增样式时，才重新设定元素的class属性，避免浏览器不必要的渲染
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},
	/**
	 * 删除class
	 * @param value 	value未指定值，删除全部class
	 * @return {*}
	 */
	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;
		// 如value为函数，递归调用removeClass
		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}
		// 如未传入参数
		if ( !arguments.length ) {
			// 设置元素的class属性值为""
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// 删除class，如有相同的class值，用repalce替换为""
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// 避免重新渲染
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},
	/**
	 * 切换样式
	 * .toggleClass( className )：如有元素有className，则删除此className，无则添加上
	 * .toggleClass( className, state )：state为true等价于addClass(className);false等价于removeClass(className)
	 * .toggleClass( func )：如div.foo父级有bar类，则切换happy，否则切换sad
	 * 			$( "div.foo" ).toggleClass(function() {
	 * 					if ( $( this ).parent().is( ".bar" ) ) {
	 * 						return "happy";
	 * 					} else {
	 * 						return "sad";
	 * 					}
	 * 			});
	 * @param value
	 * @param stateVal
	 * @return {*}
	 */
	toggleClass: function( value, stateVal ) {
		var type = typeof value;
		// 如stateVal是true或false，则调用addClass或removeClass
		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}
		// 如value为函数
		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// 切换个别类名
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// 利用hasClass判断，如果有，则删除，没有添加上
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// 切换全部类名,.toggleClass( boolean )在3.0版本deprecated了（官网API）
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// 内部存储className
					dataPriv.set( this, "__className__", className );
				}

				// 如$('#a').toggleClass();或$('#a').toggleClass(false);调用方式；会删除a上的类名
				// 但将删除的类名存储在dataPriv上
				// 再通过$('#a').toggleClass(true);调用方式会取回dataPriv上之前删除的类名添加到a上
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},
	/**
	 * 判断是否有slector给定的样式在匹配元素上
	 * 注意：因为hasClass并为对多个class进行空格拆分，故，如<p id="a" class="a b c">asdf</p>
	 * $('#a').hasClass('b a');返回false
	 * @param selector
	 * @return {boolean}
	 */
	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );

/*************************属性操作3：val*******************************************/

// 匹配回车符
var rreturn = /\r/g;

jQuery.fn.extend( {
	/**
	 * 获取匹配元素第一个元素的值，设置匹配集合的每个元素值
	 * 本质是调用elem.value值获取
	 * 所有可以拥有 value 属性的标签都是相同的，即在对一个元素调用 .val() 函数时，首先取其 value 属性的值，如果没有的话，再使用其 text 值。
	 * 该函数常用于设置或获取表单元素的value属性值。例如：<input>、<textarea>、<select>、<option>、<button>等。
	 * value可以传入数组：
	 * <select id="a" multiple="multiple">
	 * 		<option >Multiple</option>
	 * 		<option value="Multiple2">11</option>
	 * 		<option >Multiple3</option>
	 * 	</select>
	 * $('#a').val(['Multiple','Multiple2'])会将第一个与第二个选中
	 * @param value
	 * @return {*}
	 */
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];
		// 如无参数，$().val()，
		if ( !arguments.length ) {
			if ( elem ) {
				// 思路与attr，prop类似
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// 处理最常见的字符串情况
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );  // 将回车符换为""
				}

				// 如值==null，则返回""
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );	// 判断value是否为function

		return this.each( function( i ) {
			var val;
			// 如非元素节点直接返回
			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				// 如为函数，则传入序号i，与当前元素的值
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// 将null/undefined转换为""
			if ( val == null ) {
				val = "";
			// 将数值转换为字符串形式
			} else if ( typeof val === "number" ) {
				val += "";
			/// 如val值为arr，则也将值进行转换字符串形式
			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			//  如hooks的set函数返回undefined，则使用this.value形式设置值
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				// 对于option，有value值应该返回value值
				// <option value="1">One</option>如，返回应该为1,
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text 抛出异常 (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		// 对于select的，val取值，是获取选中option对应的value值
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,   //选中的索引，如果没有选中的话，默认为0
					one = elem.type === "select-one",
					values = one ? null : [],	// 如是单选，values为null
					max = one ? index + 1 : options.length;// 如是单选，max=选中的option序号+1
				// 确定循环开始 i，如选中的第三个，index为2，故总2开始循环
				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// 循环options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 reset后不更新selected值(#2551)
					if ( ( option.selected || i === index ) &&

					//如果option是禁用的，或者被禁用的optGroup元素中的option，不返回值
					// <option disabled="disabled"> 或者 <optgroup disabled="disabled"><option>111</option></optgroup>
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// 获取响应的option值
						value = jQuery( option ).val();

						// 对于单选，不需要arr
						if ( one ) {
							return value;
						}

						//多选返回数组
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */
					// eslint 禁止在条件语句中出现赋值操作符
					// 在条件语句中，很容易将一个比较运算符（像 ==）错写成赋值运算符（如 =）
					// 这里是对val可以传入数组的处理
					// 		<select id="a" multiple="multiple">
					// 			<option >Multiple</option>
					// 			<option value="Multiple2">11</option>
					// 			<option >Multiple3</option>
					// 		</select>
					// $('#a').val(['Multiple','Multiple2'])会将第一个与第二个选中，因为jQuery.valHooks.option.get( option )
					// 获取的值分别为Multiple，Multiple2，在传入数组values里面
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// 如无匹配的值，则将selectedIndex修正为-1
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes 的valHooks
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		// 与option类似，如在数组中，则设置选中
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	// 对于android的bug
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion

/***********************************事件系统2***************************************/
var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {
	/**
	 * 触发事件内部API
	 * 模拟事件触发,为了让事件模型在各浏览器上表现一致 (并不推荐使用)
	 * @param {Object} event 事件对象 (原生Event事件对象将被转化为jQuery.Event对象)
	 * @param {Object} data 自定义传入到事件处理函数的数据
	 * @param {Object} elem HTML Element元素
	 * @param {Boolen} onlyHandlers 是否不冒泡 true 表示不冒泡  false表示冒泡；用于判断是否阻止浏览器默认行为
	 */
	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			// 判断某个对象是否含有指定的属性，不会在原型链上查找
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];// 事件是否有命名空间，有则分割成数组

		cur = tmp = elem = elem || document;

		// 对于text和comment节点不进行事件处理
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// 仅对focus/blur事件变种成focusin/out进行处理
		// 如果浏览器原生支持focusin/out，则确保当前不触发他们
		// ????????????????????????????不知如何判断，jQuery.event.triggered开始时为undefined
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}
		// 如果type有命名空间，命名空间的过滤
		// 只要有.则表示有命名空间，.第一个为事件类型，后面的都是命名空间
		if ( type.indexOf( "." ) > -1 ) {

			// 有命名空间的trigger调用，在handle()函数中会构建一个正则去匹配
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();	// 因为add时，namespaces调用了sort，故此处调用sort保证顺序一致
		}
		// 检测是否需要改成ontype形式 即"onclick"
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// jQuery.expando:检测事件对象是否由jQuery.Event生成的实例，否则用jQuery.Event改造
		// 因为调用trigger时的事件类型可能并未绑定过
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// 对event预处理
		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );// sort后再拼接
		// 如namespaces=['a','b'];正则：/(^|\.)a\.(?:.*\.|)b(\.|$)/
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// 清除事件返回数据，以重新使用
		event.result = undefined;
		// 如果事件没有触发元素，则用elem代替
		if ( !event.target ) {
			event.target = elem;
		}

		// 克隆任何输入数据并预设event，构建handler 参数列表
		// 如果data为空，则传入处理函数的是event，否则由data和event组成
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// 尝试通过特殊事件进行处理，必要时候退出函数
		special = jQuery.event.special[ type ] || {};
		// 对于blur，focus，jQuery.event.special存储了事件原生的事件处理函数
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}
        //  模拟事件冒泡
		// 根据W3C规范，需要预设事件传播路径 (#9951)
		// 事件冒泡到document，然后是window，之后寻找全局var (#9724)
		// trigger与triggerHandler的本质区别实现在这里了,triggerHandler不会进入这里面
		// 故eventPath只是当前元素的列表
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
			// 冒泡时是否需要转成别的事件(用于事件模拟)
			bubbleType = special.delegateType || type;
			// 如果不是变形来的foucusin/out事件
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			// 遍历自身及所有父节点放在eventPath里面
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// 当到达document时，将window添加到eventPath中
			if ( tmp === ( elem.ownerDocument || document ) ) {
				// defaultView :在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// 触发所有事件监听函数
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// 检测数据缓存中是否有此事件类型，如有取出handle
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				// 触发handle
				handle.apply( cur, data );
			}

			// 原生handler
			// 取出原生事件处理器elem.ontype (比如click事件就是elem.onclick)
			handle = ontype && cur[ ontype ];
			// acceptData:判断绑定数据的目标owner类型是否符合
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		// 保存事件类型，因为这时候事件可能变了
		event.type = type;

		// 如果不需要阻止默认动作，立即执行
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// 在目标上调用与事件同名的原生DOM方法。
				// 不能仅用jQuery.isFunction检测，因为ie6,7可能失败 (#6170)
				// 确保不对window对象阻止默认事件
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// 调用FOO()时，避免重复触发onFOO事件
					tmp = elem[ ontype ];
					// 清除掉该事件监听
					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// 当我们已经将事件向上起泡时，防止相同事件再次触发
					jQuery.event.triggered = type;
					// HTMLElement原生事件处理函数触发
					elem[ type ]();
					// 完成清除标记
					jQuery.event.triggered = undefined;
					// 事件触发完了，可以把监听重新绑定回去
					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// 用于模拟focus事件
	// 仅仅在`focus(in | out)` 事件上使用，就是对事件e进行改变
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );
// 触发事件的对外接口$().trigger();
jQuery.fn.extend( {
	// 在每一个匹配的元素上触发某类事件。
	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	// 与trigger区别
	// 第一，他不会触发浏览器默认事件。如$().triggerHandler('focus');只会触发绑定的函数，浏览器默认事件不触发
	// ****************重点关注如何取消默认事件触发的
	// 第二，只触发jQuery对象集合中第一个元素的事件处理函数。
	// 第三，这个方法的返回的是事件处理函数的返回值，而不是据有可链性的jQuery对象。此外，如果最开始的jQuery对象集合为空，则这个方法返回 undefined
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {	// 只处理jQuery对象集合的第一个元素
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );

// 创建click等快捷事件绑定方式
jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// handle事件处理函数绑定，有参数则绑定事件，无参数则直接trigger
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );
// 当鼠标移动到一个匹配的元素上面时，会触发指定的第一个函数。当鼠标移出这个元素时，会触发指定的第二个函数。
jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

support.focusin = "onfocusin" in window; // onfocusin 事件在一个元素即将获得焦点时触发。与focus区别是支持冒泡

// Support: Firefox <=44
// focusin 与focusout 在元素获得或事件焦点时触发，相比之下，focus与blur事件在焦点改变时触发，但不冒泡
// 将focus绑定的事件转化为focusin来绑定，focusin在W3C的标准中是冒泡的，除开火狐之外的浏览器也确实支持冒泡
// firefox不支持focus(in | out)事件- https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) 事件在focus & blur events之后触发,
// 这违背了规范 - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// 这个bug详细在 - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
// 构建focusin与focuout事件
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        // 为focusin/focuout附加一个handler
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};
        // ****************************
        // 事件不存在冒泡，但是捕获阶段是从document到指定元素的，故可以在捕获阶段进行绑定
		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );
                // 因为第一个参数是是orig,因为火狐不支持focusin/focusout所以jQuery使用focus/blur替代来监听事件；
                // 第三个参数为true，表示在事件捕获阶段触发事件
				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
            // 删除事件绑定
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// 将textr解析为xml，converters中的一个解析函数
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// 在无效input解析时，IE 抛出异常
	try {
		// parseFromString(text, contentType),参数是要解析的 XML 标记。
		// contentType 是文本的内容类型。可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"
		// 保存 text 解析后表示的一个 Document 对象
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}
	// 如果解析失败, DOMParser 目前不会抛出任何异常, 只会返回一个给定的错误文档
	// <parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">
	// 	(error description)
	// <sourcetext>(a snippet of the source XML)</sourcetext>
	// </parsererror>
	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};

/*********************ajax1：表单序列化***********************/
var
	// 匹配[]
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	// keygen,<keygen> 标签规定用于表单的密钥对生成器字段,当提交表单时，私钥存储在本地，公钥发送到服务器
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

/**
 * 序列化类似{key:[[1,2],{key1:value1}]},
 * @param prefix 			对象的key，即上述name		
 * @param obj				对象的value，即上述的2
 * @param traditional		$.param传入的第二个参数
 * @param add				用于拼接key= value 的函数
 */
function buildParams( prefix, obj, traditional, add ) {
	var name;
	// 如obj是数组
	if ( Array.isArray( obj ) ) {

		// 序列化数组每个元素
		jQuery.each( obj, function( i, v ) {
			// traditional 为true，或key是以[]结尾字符串
			if ( traditional || rbracket.test( prefix ) ) {

				// 将每个数组项视为标量，即v是具体数组，不是数组或obj
				add( prefix, v );

			} else {

				// 如数组的每一项value值还是一个对象或数组，递归调用buildParams
				// 如value是数组，key转换为key[],如value为obj，且!=nul，则转换为key[name]形式
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// 序列化对象
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// 序列化普通值
		add( prefix, obj );
	}
}

/**
 * 将key/value键值对的对象数组序列化为“key=value&key=value…”字符串
 * 主要进行的处理：将key/value成作为URI组件编码（保证key和value不会出现特殊符号，即保证了“=”分割的正确性）使用“&”链接
 * $.param()：返回的字符串是经过编码的，可以使用decodeURIComponent(jQuery.param())获得未编码的字符串，查看序列化对象结果
 * @param a					数组，普通搞对象，jQuery对象
 * @param traditional		根据buildParam可以看出，如traditional为true，则序列化对象，只一层，
 * 							如myInfo = {intro:{html:5, css:3} }，不会将解析为intro[html]=5,intro[css]=3
 * @return {string}
 */
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		// 将key，value转换为key = value形式（编码过的）
		add = function( key, valueOrFunction ) {

			// 如value是function，则使用其返回值
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;
			// 将key，value进行编码
			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// 如a传入的是数组,假设他是一个form表单键值对数组
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// //序列化表单元素
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );
	// 如传入对象，则有多种情况，如a = {key : [[1,2,3],1,3]},多层级数组，{key:{key1:value1}}多层级对象等
	// 将复杂情况交给buildParams解析
	} else {

		// 如a是普通对象，调用buildParams函数
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// 返回最终的序列化字符串，用&拼接
	return s.join( "&" );
};

jQuery.fn.extend( {
	// 将form表单元素，直接序列化为字符串key=value&key1=value1等形式
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	/**
	 * 利用form.elements获取表单元素，然后删除需要提交的元素
	 * 筛选出表单中需要提交的数据并以key/value键值对的对象数组格式返回
	 * 如[{name: "a", value: "1"},{name: "a", value: "1"},{name: "a", value: "1"}]
	 * 哪些会被序列化进来，根据的是W3C规则，必须要包含name属性，file的select，选择的数据不会被序列化
	 * 如表单元素无value属性，序列化的value值为空
	 * @return {*}
	 */
	serializeArray: function() {
		// 将form中的表单相关的元素取出来组成数组
		return this.map( function() {

			// form.elements 集合可返回包含表单中所有元素的数组。
			// this如非表单form，则返回undefined
			var elements = jQuery.prop( this, "elements" );
			// 利用makeArray将类数组elements转换为普通数组
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		//过滤出为需要提交的表单元素（有name名称、非disabled元素、非提交按钮等元素、checkbox/radio的checked的元素）
		.filter( function() {// 筛选出与指定表达式匹配的元素集合
			var type = this.type;

			// this.name 必须有name属性
			// jQuery( this ).is( ":disabled" ) ：非disabled属性，使用is，可以判断 fieldset[disabled]
			return this.name && !jQuery( this ).is( ":disabled" ) &&
					// rsumbmittable，当前元素节点为可提交元素
					// 不提交button，submit等类型元素
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			// 获取当前元素的value值
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}
			// 如val是数组，调用map函数，转换为key-value形式，value
			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					// 将\r?\n替换为\r\n
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			// get()返回普通对象，否则为jQuery对象
		} ).get();
	}
} );

var
	r20 = /%20/g,
	rhash = /#.*$/,
	// 匹配 ?_= asd 或 &_=asd ;只要不是&_= &就可以
	rantiCache = /([?&])_=[^&]*/,
    // m：允许多行匹配；g：全局匹配
    // 因为请求头可能是多行文本，故使用m标记
    // 实际一个括号匹配请求头的key，第二个匹配请求头的value
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: 本地协议检测
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) 对引入自定义类型非常有用(see ajax/jsonp.js for an example)
	 * 2) 何时会被调用:
	 *    - 在请求transport之前
	 *    - 参数序列化之后(如s.processData为true，则s.data为string)
	 * 3) key是dataType
	 * 4) key可以是通用符*
	 * 5) 从具体的dataType开始执行，如需要，则会执行*
	 */
	prefilters = {},

	/* Transports 绑定
	 * 1) key是dataType
	 * 2) 通配符*可以使用
	 * 3) 从具体的dataType开始执行，如需要，则会执行*
	 */
	transports = {},

	// */*表示接受全部类型，
	//  用concat是为了避免*/*出现comment(#10098);
	allTypes = "*/".concat( "*" ),

	// a标签是用来解析文档来源的
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

/**
 * 	prefilters and transports的底层函数，用于执行prefilters与transports
 * @param structure				prefilters包含*,srcipt,json,jsonp
 * @param options				被ajax修改的options
 * @param originalOptions		用户传入的options
 * @param jqXHR					jQuery封装的XMLHttpRequest对象
 * @return {*|boolean}
 */
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		// 注意，each函数，如func判断为true，会返回structure[dataType]
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			// prefilterOrFactory其实为prefilters数组每个key对应的预处理函数
			// 但默认只有*,json,jsonp,script，如不是dataType不是这4中，则inspect( options.dataTypes[ 0 ] )
			// 返回undefined，会使用inspect('*')
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			// prefilter的情况
			// typeof dataTypeOrTransport === "string",比如jsonp情况，prefilter最终返回了script，意味着
			// inspect了json还需要inspect，srcipt，同时options.dataTypes数组会改变为["jsonp","script"]
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}
	// 先检查options.dataTypes第一个参数，然后再检查*，如检查
	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}


// ajax对象的extend，为了fix#9887问题，是浅复制，不是深复制
// #9887问题是仅仅使用jQuery.extend会造成内存浪费
// ajaxExtend 是用来将 ajax 函数参数进行标准化的，看看哪些参数没有赋值，让它等于默认值

/**
 * jQuery.ajaxPrefilter and jQuery.ajaxTransport的基本构造器
 *  jQuery.ajaxPrefilter调用方式：jQuery.ajaxPrefilter( [dataTypes ], handler )
 *  			dataTypes：dataTypes，可以是空格分隔的
 *  			handlers：之后ajax请求的
 *  使用闭包的原理，保存着structure的引用，负责将单一前置过滤和单一请求分发器分别放入prefilters和transports。
 * @param structure
 * @return {Function}
 */
function addToPrefiltersOrTransports( structure ) {
		// 通过闭包访问structure
		// 之所以能同时支持Prefilters和Transports，关键在于structure引用的时哪个对象
		// dataTypeExpression是可选的，默认为*
		return function( dataTypeExpression, func ) {
			// 修正参数，dataTypeExpression默认为*
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				// 将空格分隔的dataTypes转换为数组
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];
			// 如func为函数
			if ( jQuery.isFunction( func ) ) {

				// 循环dataTypeExpression中的每一个dataType
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					//如dataType是以+开始的，则将func放在structure数组开始
					//shift用于移除数组中第一项并且返回该项，unshift用于在数组前面添加任意项并且返回数组长度!
					if ( dataType[ 0 ] === "+" ) {
						// 获取dataType数组1后面的全部
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

						// 否则添加到结尾
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		// 复制的对象key不是undefined
		if ( src[ key ] !== undefined ) {
			// 不想对flatOptions中的key进行深复制，因此，对于这些key，直接改target上的值为新的src中的值
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	// 对非flatOptions的key，进行深复制，复制到target上
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/**
 * dataType类型的参数，可以是xml, json, script, or html 或者干脆为空
 * 处理ajax请求的响应，解析出正确的dataType类型
 * - 在content-type与传入参数的dataType中寻找正确的dataType
 * - 返回响应的响应内容
 * 参数：responses：表示的是ajax请求之后，实际服务器返回{ binary: xhr.response }或{ text: xhr.responseText }，通用ajaxTransport进行了封装
 *
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,	// string-regular 对象，用来表示jQuery如何解析响应
		dataTypes = s.dataTypes;// 传入参数中的希望服务器返回的数据类型

	//如果用户传入的dataType是*,或未传入，默认则是*
	// 就会经过这里的逻辑，最后通过mimeType或者返回的Content-Type来决定!
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			// ct获取mimeType，content-Type为内容类型
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// 对于用户传入*，则需要检查下服务器返回的类型，是否为已知类型
	if ( ct ) {
		for ( type in contents ) {
			// 如是已知类型，则使用contents里面对应的正则返回结果
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// 检查期望的从服务器获取的数据类型，是否在服务响应的responses中
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// 如不在，则尝试转换dataTypes
		for ( type in responses ) {
			// 根据s.converters进行转换，如配置中的options.dataType=json,则finalDataType为text
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// 如转换不了，则尝试使用之前的
		finalDataType = finalDataType || firstDataType;
	}

	// 如判断好了最终的datType，则将dataType添加到list中，并返回响应的响应内容
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}//如输入datTypes为json，经过转换可能是['text','json']
		return responses[ finalDataType ];
	}
}

/**
 * 响应类型的转换
 * 如输入datTypes为jsonp，经过转换可能是['text','script','json']
 * 类型转换器ajaxConvert根据请求时设置的数据类型，从jQuery. ajaxSettings.converters寻找对应的转换函数，
 * 假设有类型A数据和类型B数据，A要转换为B（A > B），首先在converters中查找能 A > B 对应的转换函数，
 * 如果没有找到，则采用曲线救国的路线，寻找类型C，使得类型A数据可以转换为类型C数据，类型C数据再转换为类型B数据，最终实现 A > B
 * @param s
 * @param response		响应主体
 * @param jqXHR
 * @param isSuccess		响应是否成功
 * @return {*}
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// 拷贝一份dataTypes，因为转换时需要修改
		dataTypes = s.dataTypes.slice();

	// 构建converters对应关系,key为小写，
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}
	// 取出第一个元素,一般为text
	current = dataTypes.shift();

	// 按dataTypes顺序转换
	while ( current ) {
		// 如current是responseFields的key，则在jqXHR对应的s.responseFields[ current ] 绑定响应实体
		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// 如有data过滤器，则使用
		// dataFilter用来处理XMLHttpRequest的原始响应数据
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();// 第二次调用dataTypes.shift(),根据举例，此处为json

		if ( current ) {

			// 如current为*,则还操作第一项
			if ( current === "*" ) {

				current = prev;

			// 转换响应，如prev不是*且与current不相等
			} else if ( prev !== "*" && prev !== current ) {

				// 寻找定义好的转换器，对于jsonp情况，则先去寻找"text script"转换器
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// 比如输入options.datType为"html json",尝试将html转换为json
				// 但是没有这个转换器
				if ( !conv ) {
					//converters["* text"]=window.String
					//converters["text html"]=true
					//converters["text json"]=jQuery.parseJSON
					//converters["text xml"]=jQuery.parseXML
					for ( conv2 in converters ) {

						// 将s.convsert中的类型转换表达式拆分,tmp[0] 源类型 tmp[1] 目标类型
						tmp = conv2.split( " " );
						// A:pre:html
						// B:tmp[0] 基本为text
						// C:current:json
						// 通过循环converters，发现有C为json的converters,A直接转换不了C，可以先尝试B，C
						if ( tmp[ 1 ] === current ) {// 存在B->c转换器

							// 查看是否有A-B转换器，没有则用*—->b代替
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// text html": true,意思是不需要转换,直接那来用
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// A->C的转换器不存在，那么先此时存在A-B转换器
								// 将current设置为B，然后将dataTypes数组增加C，再循环转换
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// 如conv不是true，则应用转换器
				if ( conv !== true ) {

					// 如throws为true
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );//比如text转JSON，调用的是JSON.parse，并不是所有文字都能解析，对于不能解析的会报错
						} catch ( e ) {
							// 如数据转换不了，则返回错误
							return {
								state: "parsererror",
								// conv不存在，则报错，不能从a转换到b
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// 表示是否还有ajax请求
	active: 0,

	// 为下一个请求存储的Last-Modified 请求头缓存
	lastModified: {},
	etag: {},
	// ajax全局默认settings
	// http://api.jquery.com/jQuery.ajax/官方api翻译过来
	ajaxSettings: {
		url: location.href, // 请求URL
		// http请求方法，get，post，put等
		type: "GET",
		// location.protocol=window.location.protocol，本地协议
		// 允许当前环境被认为是本地的（如文件系统），即使默认情况下，jQuery不能识别
		// 如下协议会别人为是本地的，file，*-扩展协议，widget；
		isLocal: rlocalProtocol.test( location.protocol ),
		// 这个请求是否触发全局ajax事件，默认为true，如设置为false，则阻止类似ajaxStart，ajaxStop 等事件触发
		global: true,
		// options中的数据会被处理为查询字符串，如想发送DOMDocument或其他不想被处理的数据，可以设置为fasle
		processData: true,
		// 默认所有ajax操作都是异步的，如需要同步，设置为false
		// 跨域请求和dataType：'jsonp'不支持同步请求
		// 注意同步请求，会暂停浏览器工作，等待数据返回
		async: true,
		// 如下contentType适合大部分情况
		// 如设置contentType：false，则jQuery不会设置任何contentType
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,	// 0表示没有请求超时，timeout计时从调用$.ajax开始，
		data: null,	// 发给服务器的数据
		dataType: null,	// 服务器返回数据类型
		username: null,	//访问有权限的的HTTP需要的username
		password: null,//访问有权限的的HTTP需要的password
		cache: null,	//如为false，则默认浏览器不缓存页面，设置false，只有在HEAD与get请求中有效，工作方式是在get请求后增加时间戳
		throws: false,
		traditional: false,//如设置为true，参数序列化就调用的是jQuery.param(obj,true)，不是深层序列化对象
		headers: {},// 可以更改默认的header的 X-Requested-With: XMLHttpRequest，headers里面值同样可以在beforeSend函数中复写
		*/
		// accepts依赖于DataType
		// 不同type类型的MINI类型，确定服务器返回的数据类型
		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},
		// jQuery如何解析响应的key/正则表达式的对象
		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/ //\b 匹配一个字边界，即字与空格间的位置。代表着单词的开头或结尾
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// 数据转换器
		// 浏览器的XMLHttpRequest对象对数据的响应只有 responseText与responseXML 二种
		// jQuery支持不同格式的数据返回形式,如xml，json，html等
		// 服务器的传输返回的只能是string类型的数据，但是用户如果通过jQuery的dataType定义了json的格式后，
		// 会默认把数据转换成Object的形式返回
		// converters存储的返回数据处理的句柄
		converters: {

			// 转换为text
			"* text": String,

			// Text 转换为html
			"text html": true,

			// text转换为json
			"text json": JSON.parse,

			// text转换为xml
			"text xml": jQuery.parseXML
		},

		// flatOptions标识的的不能进行深复制的属性
		// 可以在这个对象加上不想深复制的自定义options
		flatOptions: {
			url: true,
			context: true
		}
	},

	// 用于设置AJAX的全局默认设置。
	// 默认情况下，不推荐更改，因为有些jQuery差距可能是基于ajax默认配置的
	// 使用ajaxSetting和用户传入的setting配置ajax默认全局配置
	// 如target函数忽略，则将最终结果写入ajaxSettings中
	// ajaxSetup，只是将对象extend，并没有对属性值进行处理
	ajaxSetup: function( target, settings ) {
		return settings ?

			// 构建一个settings对象,分别将jQuery.ajaxSettings与settings，拷贝到target上
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// 扩展 ajaxSettings 对象，即jQuery.ajaxSetup(obj)调用，用target扩展jQuery.ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},
	// 在发送请求或被$.ajax()处理之前，处理自定义Ajax的options，或修改已经存在的options
	// 前置过滤器,就是在特定的环境针对特定的情况做一些必要的兼容的处理
	// 通过闭包保持对prefilters的引用，将前置过滤器添加到prefilters
	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	// 请求分发器
	// 通过闭包保持对transports的引用，将请求分发器添加到transports
	// 创建一个处理Ajax数据实际传输的对象,
	// transport 需要提供send与abort两个方法，用于ajax中发送请求时使用
	// transport 被认为是prefilters与converters都不够用时的最后手段
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// ajax主方法
	ajax: function( url, options ) {
		//  1、为传递的参数做适配
		// 如url是object，对参数进行调整，向前兼容1.5版本
		// url可以包含在options中
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// 强制options是对象
		options = options || {};
		// 2、创建一些变量
		var transport,

			// 无anti-cache参数的url
			// cacheURL其实就是不带时间戳的一部分url
			cacheURL,

			// 返回头
            // 缓存xhr.getAllResponseHeaders()结果
			responseHeadersString,
            // 缓存xhr.getAllResponseHeaders()解析为key-value的obj结果
			responseHeaders,

			// 超时处理
			timeoutTimer,

			// Url清除变量
			urlAnchor,

			// 请求状态,send时为false，完成 时为true
			completed,

			// 是否全局事件需要派发
			fireGlobals,

			// 循环变量
			i,

			// url未缓存部分
			// uncached其实就是带有时间戳的一部分url
			uncached,

			// 利用ajaxSetup构建最终options对象
			// 返回的是：将jQuery.ajaxSettings与settings，拷贝到{}上
			s = jQuery.ajaxSetup( {}, options ),

			// options可以传入context，表示Ajax相关回调的context，默认是s
			callbackContext = s.context || s,

			// 对于一个DOm节点或jQuery对象集合，则全局事件的context为jQuery封装的对象，否则为jQuery.event对象
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// deferred对象就是jQuery的回调函数解决方案，它解决了如何处理耗时操作的问题，对那些操作提供了更好的控制，以及统一的编程接口
			deferred = jQuery.Deferred(),
			//  所有的回调队列，不管任何时候增加的回调保证只触发一次
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// 获取最终options的statusCode参数，默认是空对象
			// 可以这么设置：当404时就alert
			// $.ajax({
			// 	statusCode: {
			// 		404: function() {
			// 			alert( "page not found" );
			// 		}
			// 	}
			// });
			statusCode = s.statusCode || {},

			// 请求头
			requestHeaders = {},	// 请求头的value
			requestHeadersNames = {},// 请求头的name

			// 默认的abort信息
			strAbort = "canceled",

			// 是jquery-XMLHttpRequest简称，jqXHR 已经完全可以取代 XHR 对象了，函数都进行扩展了
			// 在ajax方法中返回的是jqXHR一个包装对象，在这个对象里面混入了所有实现方法
			jqXHR = {
				// 0：未初始化。尚未调用open()方法。
				// 1：启动。已经调用open()方法，但尚未调用send()方法。
				// 2：发送。已经调用send()方法，但尚未接收到响应。
				// 3：接收。已经接收到部分响应数据。
				// 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。
				readyState: 0,
                /**
                 * 当不传入dataType或传入*时，在ajaxHandleResponse里面，会调用
                 * jqXHR.getResponseHeader( "Content-Type" )
                 * 实际是将请求头的多行文本，转换为key-value存储在responseHeaders
                 * 并返回key对应的值
                 * @param key
                 * @return {null}
                 */
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							// 这个responseHeadersString，如对于默认分发器，会使用xhr.getAllResponseHeaders()
                            // 获取请求头
                            // m：允许多行匹配；g：全局匹配
                            // 因为请求头可能是多行文本，故使用m标记
                            // 实际一个括号匹配请求头的key，第二个匹配请求头的value
                            // rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// 获取响应头的纯字符串,xhr.getAllResponseHeaders()获得的结果
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// 缓存请求头
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// 复写响应的content-type头
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

                /**
                 * 用于处理opitons中传入statusCode，如
                 * statusCode:{
                 *     '404':function(){
                 *     console.log('404')
                 *     },
                 *     '200':function(){
                 *     console.log('200')
                 *     }
                 * }
                 * map即为后面的对象
                 * @param map
                 * @return {jqXHR}
                 */
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// 根据状态码执行回调
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// 将新的回调储存在久的statusCode上
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// 取消请求，statusText是取消请求时，显示的字
				abort: function( statusText ) {
					// 如未传入显示默认的stAbort
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// 返回deferred的只读版本 deferred.promise(),避免外部随意的触发deferred对象的回调函数，
		// 很有可能在AJAX请求结束前就触发了回调函数（resolve），这就是与AJAX本身的逻辑相违背了。
		// 为了避免回到地狱等，使用deferred对象
		deferred.promise( jqXHR );

		// 未无协议名的url增加，prefilters可能会使用个到，如url有参数，会保留
		// 将以// 开头的url，转换为带协议名的
		// 如//www.baidu.com，会被转换为http://www.baidu.com
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// type是method的别名
		s.type = options.method || options.type || s.method || s.type;

		// 提取dtaTypes列表
		// dataTypes可以传入'text xml'，把text响应转换为XML
		// "jsonp text xml",可以认为是请求为JSONP，收到为text，并将text转换为xml
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// crossDomain设置为true，会强制发起一个跨域请求
		// 同域下，服务器会返回另一个domain域
		// 通过判断用户请求的protocol：host，与当前环境是否相同判断是否跨域
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// 对于如下url，ie会抛出异常
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// 如url地址是相对的，a标签的host属性设置不正确
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// 如解析url报错，则认为url是跨域的
				s.crossDomain = true;
			}
		}

		// processData默认为true
		// 默认情况下，通过data属性传递进来的数据，如果是一个对象(技术上讲，只要不是字符串)，
		// 都会处理转化成一个查询字符串，以配合默认内容类型 "application/x-www-form-urlencoded"
		// 如data不是字符串，则利用jQuery.param解析
		// traditional是为了兼容jQuery<1.3.2行为的
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// 运行prefilters中的函数进行预处理
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// 如prefilter中使请求aborted，则直接return
		// completed请求状态,send时为false，完成时为true
		if ( completed ) {
			return jqXHR;
		}

		// 如设置了global为true则触发全局事件
		// 如jQuery.event无定义，则不要触发事件(AMD使用中会出现这个问题)(#15118)
		// s.global默认值为true
		fireGlobals = jQuery.event && s.global;

		// 触发ajaxStart事件，jQuery.active开始为0，jQuery.active++先执行表达式再自增
		// 如调用$.ajax({}),又调用一次$.ajax({})，第一次会触发ajaxStart
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// 大写请求类型
		s.type = s.type.toUpperCase();

		// hasContent，是否为get或head请求，如不是，为true
		// rnoContent = /^(?:GET|HEAD)$/
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// 删除hash，简化url操作
		cacheURL = s.url.replace( rhash, "" );

		// 对于get与Head请求,需要设置更多请求options参数
		if ( !s.hasContent ) {

			// 存储url后面的hash，之后可以放回
			// uncached其实就是带有时间戳的一部分url
			uncached = s.url.slice( cacheURL.length );

			// 如data存在，则在url后拼接数据
			// 这里的s.data已经被处理为查询字符串
			if ( s.data ) {
				// 如有data数据，则先将无时间戳的URL部分拼接上数据
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: 删除s.data,以便之后不再使用
				delete s.data;
			}

			// 如cache为false，在url增加时间戳，避免缓存
			// false只能针对dataType为script和jsonp类型
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				// uncached为#后面的字符串
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// 将有hash的字符串与无时间戳的url拼接在一起
			// 会在hash前面添加数据，并增加一个时间戳
			// 用户输入options.url为aaa.html/b/#/c/d
			// 最终url应是类似于：aaa.html/b/?key=12&value=4&_=123123123#/c/d
			s.url = cacheURL + uncached;

		// 如这是编码之后的form表单数据，将'%20'转换为 '+'
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// ifModified默认为false，表示仅在服务器数据改变时获取新数据。使用HTTP包Last-Modified头信息判断。
		// Etag & If-None-Match:由服务器生成返回给前端,当你第一次发起HTTP请求时，服务器会返回一个Etag，
		// 并在你第二次发起同一个请求时，客户端会同时发送一个If-None-Match，而它的值就是Etag的值
		// 然后，服务器会比对这个客服端发送过来的Etag是否与服务器的相同，
		// 如果相同，就将If-None-Match的值设为false，返回状态为304，客户端继续使用本地缓存
		// 即ETag就是服务器生成的一个标记，用来标识返回值是否有变化。
		// Last-Modified表示响应资源在服务器最后修改时间而已
		// last-modified不足:
		// Last-Modified标注的最后修改只能精确到秒级，如果某些文件在1秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间；
		// 如果某些文件会被定期生成，当有时内容并没有任何变化，但Last-Modified却改变了，导致文件没法使用缓存；
		// 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形。
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			// Etag是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// 如果有数据传送，同时也指定了get,post方法，同时contentType也指定!
		// 那么更加contentType添加一个头Content-Type！
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// 根据dataType设置请求头
		// Accept代表发送端（客户端）希望接受的数据类型
		// Accept：text/xml:代表客户端希望接受的数据类型是xml类型
		jqXHR.setRequestHeader(
			"Accept",
			// 如果dataTypes类型是accepts里面的，如是script,text,html,xml,json，则拼接, */*; q=0.01
			// 如dataTypes为* ,则拼接""
			// 如非设定在accepts里面的dataTypes，则直接使用accepts['*']
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					// 如accepts.dataTypes返回不是*,则在返回的accept后增加, */*; q=0.01
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// headers里面的key-value值，可以设置到setRequestHeader请求头中
		// 主要是将请求头设置到jqXHR中
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// 允许用户定义headers和mimeytpes，和提前取消请求
		// beforeSend是请求前的一个函数，可以在请求之前修改jqXHR，设置用户自定义headers等
		// 如返回false，会取消请求，传入beforeSend的参数是jqXHR和s
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// 取消请求，使用abort；
			return jqXHR.abort();
		}

		// strAbort信息由canceled更改abort
		strAbort = "abort";

		// 为done，fail，complete添加回调函数
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// 获取请求分发器，实际是用构建好的jqXHR，进行原生xhr调用，然后获得结果
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// 如无请求分发，则自动abort
		// 如有请求分发，则发送HTTP请求
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			// 1：启动。已经调用open()方法，但尚未调用send()方法。
			jqXHR.readyState = 1;

			// 触发全局ajaxSend事件
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// 如ajaxSend内终止请求，停止
			if ( completed ) {
				return jqXHR;
			}

			// 超时
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				// 用于发送 HTTP 请求
				// 此send为transport包装的
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// 完成后重新抛出异常
				if ( completed ) {
					throw e;
				}

				// 如抛出异常，就调用
				done( -1, e );
			}
		}

		// 任何事情完成后的回调函数
		// status:readyState的标识状态
		// nativeStatusText:状态标识文字
		// responses:根据通用ajaxTransport的callback函数，{ binary: xhr.response }或{ text: xhr.responseText }
		// headers:响应头
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// 如请求完成，直接返回避免多次请求
			if ( completed ) {
				return;
			}

			completed = true;

			// 如有超时处理的定时器，则清除
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// 将transport设置为undefined，有利于垃圾回收机制早点将transport使用的内存收回
			// 因为transport使用了闭包
			// 无论jqXHR对象使用多长时间
			transport = undefined;

			// 缓存响应头
			responseHeadersString = headers || "";

			// 设置status状态，如大于0，则设置为已经接收到全部响应数据
			jqXHR.readyState = status > 0 ? 4 : 0;

			// 根据status判断是否响应成功
			// 304:文档未改变
			// 300以下都是表示成功，200，请求成功，201，请求已经被实现，202服务器接收请求
			// https://baike.baidu.com/item/HTTP%E7%8A%B6%E6%80%81%E7%A0%81/5053660?fr=aladdin#2_1
			isSuccess = status >= 200 && status < 300 || status === 304;

			// 获取响应数据
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// 利用ajaxConvert，将响应数据转换为dataType标识的类型
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// 如响应成功了，进行一些处理
			if ( isSuccess ) {

				//如果ifModified存在，那么就要设置If-Modified-Since和If-None-Match头!
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// 如无内容；服务器成功处理了请求，但不需要返回任何实体内容
				// HEAD请求：只请求页面的首部，因此也是无内容的
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// 内容无修改
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// 如有数据，则配置下如下参数，response是通过ajaxConvert转换后的
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {//如请求失败了；或传入参数status小于0

				//提取传入的错误信息
				error = statusText;
				if ( status || !statusText ) { // 将status设置为0
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// 给jqXHR对象设置status与statusText
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// 成功resolve，失败reject
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// 由于opions中可以传睿statusCode，如404：funcction，需要将对应的function处理一下
			jqXHR.statusCode( statusCode );
			statusCode = undefined;
			// 如触发全局事件为true，则根据是否成功判断，触发的事件
			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// 调用fireWith触发所有的complete添加的回调
			// 执行完成回调，是完成并不是成功，无论成功与否都会调用，只会执行一次
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				// 触发ajaxComplete事件
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				//如果全局的ajax计数器已经是0了，那么就会触发ajaxStrop事件!
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );
// 构建get，post方法
jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// 参数调整
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// 第一个参数可以是obj对象
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

// domManip调用
jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// 明确一下这些属性，因为用户可以通过ajaxSetup重写(#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};

/**************************************DOM操作2：wrap*********************************/
jQuery.fn.extend( {
	// 将所有匹配的元素用单个元素包裹起来
	// 注意，因为$()获取的元素在dom树中，buildFrament利用原生的elem.appendChild(),这个方法会先删除原dom树的节点，然后再添加
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// 获得包裹标签
			// jQuery(html,document); 根据html创建临时dom
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {// 如this[ 0 ]存在parent，则将wrap插在this[ 0 ]之前
				wrap.insertBefore( this[ 0 ] );
			}
			// map: function( callback ) {
			// 	return this.pushStack( jQuery.map( this, function( elem, i ) {
			// 		return callback.call( elem, i, elem );
			// 	} ) );
			// }
			// wrap.map返回的是this.pushStack(value)
			// value 则是jQuery.map( this，func)值
			// jQuery.map中重要的一步是,value = callback( elems[ i ], i, arg );此处callback就是wrap.map(func)的func
			wrap.map( function() {
				var elem = this;
				// 返回对象的第一个孩子 Element
				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},
	// 将每一个匹配的元素的子内容(包括文本节点)用一个HTML结构包裹起来
	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();	//查找匹配元素内部所有的子节点（包括文本节点）
			// 对于$('li'),通过self.contents(),获取匹配li的子节点，然后在wrapAll，就是将子节点包裹了html
			if ( contents.length ) {
				contents.wrapAll( html );
			// 如节点内无内容，就是往节点内append，html
			} else {
				self.append( html );
			}
		} );
	},
	// 把所有匹配的元素用其他元素的结构化标记包裹起来。
	// 其实是将每个匹配元素，调用wrapAll包裹
	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},
	// 移除每个匹配元素的父元素
	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			// 用匹配元素父节点的所有子节点替换匹配元素的父节点
			// 当然了父节点是body/html/document肯定是移除不了的
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );

// 构建:hidden，:visible的伪类
jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};


/**************************ajax2******************************/
// 返回XMLHttpRequest对象
jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File协议总是产生状态码为0，假定为200
		0: 200,

		// Support: IE <=9 only
		// #1450: 某些时候ie9会把无内容状态码204返回为1223
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();// 用于判断是否有XMLHttpRequest对象
// ie对XMLHttpRequest部分支持，<ie9,cors为false
// withCredentials指示是否该使用类似cookies,authorization headers(头部授权)
// 或者TLS客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// 如浏览器支持cors，或 支持XMLHttpRequest对象但不跨域
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			// complete是用于通知ajax请求完成的回调函数，即ajax主函数中的done
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();	//获取xhr对象  new window.XMLHttpRequest();
				// 初始化一个请求
				// 调用open()方法并不会真正发送请求，而只是启动一个请求以备发送。
				xhr.open(
					options.type,
					options.url,
					options.async,		// 是否异步操作，false为同步
					options.username,	//认证时用户名
					options.password	//认证时密码
				);

				// 应用自定义xhr
				// xhrFields是fieldName-fieldValue的对象，用于设置给原生的XHR对象
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// 通过options里面mimeType类型，可以复写XHR的mimeType类型
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With 请求头用于在服务器端判断request来自Ajax请求还是传统请求。
				// 对于跨域请求，由于一些问题，我们并不进
				// (这个请求头可以在ajaxSetup中，或options.headers中设置
				// 如是同域请求，如已经提供了此请求头，则不更改
				// crossDomain：true为跨域请求，false为同域请求
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// 设置请求头
				// 元素xhr对象设置请求头
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// 回调函数
				// 用于构建，onload，onerror，onabort的回调函数
				// onload:下载数据成功会触发;onerror:当发生网络异常的时候会触发;onabort:终止该请求
				// 这3个事件对于每个响应应该只会触发一个，因此，在callback中需要先将全部的事件监听设置为null
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								// 将终止该请求。当一个请求被终止，它的 readyState 属性将被置为0
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// ie9手动abort会抛出异常，并且抛出异常，且状态码不为数字
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File协议总是产生状态0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 对于xhr.responseType应为text的会返回binary(trac-11426)
									// xhr.responseType默认值为text
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										// xhr.response:返回response的body，根据responseType返回js对象，document，ArrayBuffer等
										{ binary: xhr.response } :
										// 当responseType为text或者empty string类型时可以使用responseText属性
										{ text: xhr.responseText },
									// 获取所有的HTTP响应头的数据
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// 监听事件，下载数据成功会触发xhr.onload
				xhr.onload = callback();
				// 错误回调
				errorCallback = xhr.onerror = callback( "error" );
				// 为onabort事件绑定事件处理函数
				// Support: IE 9 only
				// 使用 onreadystatechange 代替onabort事件，用于处理为捕获的aborts
				// onabort事件，在调用xhr.abort()后触发
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					// ie9的bug处理
					xhr.onreadystatechange = function() {

						// 检查状态码，
						if ( xhr.readyState === 4 ) {

							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// 构造abort的callback
				callback = callback( "abort" );

				try {

					// 发送请求，xhr.send(data),data可以是ArrayBuffer，ArrayBufferView ，FormData 等，MDN有讲
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: 只有在出错但没通知时，再次抛出
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// 当没有明确dataType提供，避免scripts自动执行(See gh-2432)
// 对于jQuery.ajaxPrefilter(func)调用方式，实际是往prefilters['*']中添加函数
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// 增加script的dataType的默认配置
// 为jQuery.ajaxSettings扩展
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// 为sciprt增加cache和跨域的配置
jQuery.ajaxPrefilter( "script", function( s ) {
	// cache未设置则设置为false
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	// 跨域未被禁用，强制类型为GET
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

/**
 * 对于script标签，增加跨域支持
 * 
 */
jQuery.ajaxTransport( "script", function( s ) {

	// 对于srcipt，只是处理跨域请求
	// s.crossDomain：true为跨域请求，false为同域请求
	if ( s.crossDomain ) {
		var script, callback;
		return {
			// s.scriptCharset：只用于script的transport中，设置script标签的charset
			send: function( _, complete ) {
				// 构建script，增加charset，src属性，绑定load，error事件
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();// 响应事件后，删除标签
						callback = null;// 将事件处理函数设置为null
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// 使用原生DOM操作，避免使用domMainp出错
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	// 匹配?? 或  =? 结尾，或者 =?&
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// 增加jsonp默认settings
// 为jsonpCallback增加一个默认的function
jQuery.ajaxSetup( {
	// jsonp请求的参数名，如{jsonp:'onJSONPLoad'},则'onJSONPLoad=?'会传递给服务器
	jsonp: "callback",
	jsonpCallback: function() {
		// nonce当前时间
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );


/**
 *	向前置过滤器对象中添加特定类型的过滤器
 *  1、对jsonp的url进行拼接
 *  2、对jsonpCallback进行处理
 *  参数:s:经过各种处理后的options，originalSettings：$.ajax()传入的参数，并未做修改，没有增加默认值，jqXHR：jQuery封装的xhr对象
 *  jQuery.ajaxPrefilter作用：可以更改已经存在的options的逻辑，比如，可以为跨域时，将url更改一下
 * 	$.ajaxPrefilter(function( options ) {
 *	  if ( options.crossDomain ) {
 *		options.url = "http://mydomain.net/proxy/" + encodeURIComponent( options.url );
 *		options.crossDomain = false;
 *	  }
 *	});
 *	如下表示：针对，json jsonp请求，需要做一些什么处理
 *  因此，经过jQuery.ajaxPrefilter( "json jsonp", func)，实际是prefilters变为，prefilters.json = func
 *  prefilters.jsonp = func
 *
 *
 */
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		// jsonp参数会覆盖请求url中的callback函数，故，如jsonp:'func',则'func=?'会被传给服务器
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			// 如果json的url或data有jsonp的特征，会被当成jsonp处理
			// 如s.data为string，contentType是
			// 以application/x-www-form-urlencoded开始，s.data存在?? ，=?结尾，=?& 返回data
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// 指定jsonp请求的callback函数名
		// 不配置这个jsonpCallback，jQuery会产生一个唯一的随机名字，这样更有利于管理请求，提供callback和error控制
		// jsonpCallback如是函数，则callbackName为函数返回值
		// 如为给callbackName复制，则用的是默认值，最开始时是：jQuery.expando + "_" + ( new Date() )
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;	// jsonpCallback只是函数名

		// 将callback插入到url或form数据
		// 根据jsonP，拼接url
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// script脚本执行后，使用数据转换器，converters，将json取回
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// 强制dataType为json类型
		// dataType为希望从服务器返回的数据类型
		s.dataTypes[ 0 ] = "json";

		// 在window上注册回调函数
		overwritten = window[ callbackName ];// 如callbackName不是从oldCallbacks取出的，overwritten一定为undefined
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};
		// 这个方法加入到jqXHR的always中，表示不管对服务器的请求是失败还是成功都应该回调!
		jqXHR.always( function() {

			// 如不存在前值overwrittern，删除 window[ callbackName ]
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// 否则存在前值
			} else {
				window[ callbackName ] = overwritten;
			}

			// 因为jsonp默认jsonpCallback函数中，将this[ callback ] = true;故如jsonCallback使用默认的
			// 会进入这个函数
			if ( s[ callbackName ] ) {

				s.jsonpCallback = originalSettings.jsonpCallback;

				// 保存callback名，之后使用
				oldCallbacks.push( callbackName );
			}

			// 如响应是一个函数，则调用它Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// 如dataType类型为json或jsonp，上述处理完毕后，会转给script的prefilter
		return "script";
	}
} );




// Support: Safari 8 only
// Safari 8 documents 由document.implementation.createHTMLDocument创建，但当
// 构建body.innerHTML = "<form></form><form></form>";第二个form会变为第一form的子元素
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();

/**
 * 将字符串解析到一个DOM节点的数组中
 * @param data          字符串类型的html
 * @param context       如配置，frament会在此context下创建，context默认为document
 * @param keepScripts   指定传入的HTML字符串中是否包含脚本，默认为false,如为true，表明在传递的HTML字符串中包含脚本。
 * @return {*}			函数的返回值为Array类型，返回解析指定HTML字符串后的DOM节点数组。
 */
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
    // 如$.parseHTML('',true)形式调用
    // 等价于，$('',false,true)
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;
    // 如context为false，即未指定context或$('',boolean)
	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}
	// ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
    // 此正则匹配单标签如<h1>或<h1></h1>，不能匹配<h1>aa</h1>
    // (?:<\/\1>|)$/i )表示，匹配</....>或没有，最后一个|很关键，\1表示正则第一个括号匹配的内容反向引用
	// pased[1] =[a-z][^\/\0>:\x20\t\r\n\f]*
	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];// !![]为真

	// Single tag单个标签情况
	if ( parsed ) {
	    // 如<h1>或<h1><h1/>匹配到，则parsed[1],则为h1,即一个dom节点的数组
		return [ context.createElement( parsed[ 1 ] ) ];
	}
	// 把传入的复杂的html转为文档碎片并且存储在jQuery.fragments这个对象里
	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {//删除其中html中的js脚本
		// 调用的是，remove: function( selector ) {
		// 						return remove( this, selector );
		// 					},
		// 因jQuery.remove()较为复杂，之后再分析
		// 此处就是利用jQuery(scirpts)找到此脚本，然后删除
		jQuery( scripts ).remove();
	}
	// parsed为frament片段，因此返回childNodes，即是，获得DOM节点数组
	return jQuery.merge( [], parsed.childNodes );
};


/**
 * 从服务器获取数据，并将返回的html放在匹配元素内
 * @param url               请求url
 * @param params            请求发送带给服务器的数据
 * @param callback          请求完成的回调
 * @return {jQuery.fn}
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );
    // $( "#result" ).load( "ajax/test.html #container" );
    // 解析这样的调用方式，在#result下插入text.html中#container的内容
    if ( off > -1 ) {
	    // stripAndCollapse根据HTML spec协议处理空白，将value数组再拼接为'a b c'形式
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// 如params是函数
	if ( jQuery.isFunction( params ) ) {

		// 则认为params这个函数是回调
		callback = params;
		params = undefined;

	// 如params是对象，则发送post请求
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// 如有匹配元素
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// 如type为undefined，则默认type请求
			// 这里指明参数，不适用默认，因为用户可能会使用ajaxSetup复写这些参数
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {// 如有成功返回

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// 如果指定了选择器，则在一个虚拟div中找到正确的元素。
				// 排除脚本以避免IE被拒绝的错误
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// 如无selector则使用全部的响应文本
				responseText );

		// 无论成功与否，都调用callback函数
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};



/*********************ajax3：绑定自定义事件***********************/
// 绑定ajax自定义事件，触发事件也较为简单，只要在ajax处理过程中
// 在合适的时机直接使用jQuery.event.trigger直接触发
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );



// 构建:animate选择器
// 可以返回正在运动动画的元素
// 	$('#book').animate({
// 		height: 'show'
// 	},{
// 		duration :2000,
// 		queue:false,
// 		progress:function () {
// 			console.log($(':animated')[0])//返回匹配元素
// 		},
// 		complete :function () {
// 			console.log('aa')
// 			console.log($(':animated')[0])// 返回undefined
// 		}
// 	})
// 因为动画种Animation，会删除tick的elem元素，故当动画结束，匹配不到fn.elem，返回false
// jQuery.timers会放tick元素
jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};


/**************************Css位置操作**************************************/

jQuery.offset = {
	// 根据opitons，为元素设置相对document的偏移，i为每一个匹配元素序号
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// 首先设置postion属性，因为默认值static，会忽略top, bottom, left, right
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();// 获取当前元素相对于document的偏移量
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		// relative的auto是0，而absolute与fixed的auto并不相当于0，因为它们是相对最近的有定位祖先节点或根元素的
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// 如postion为absolute或fixed，兵器top或left不是atuo，主要计算位置
		if ( calculatePosition ) {
			// 为auto时，获取相对最近的有定位祖先节点或根元素的距离
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			// relative无需计算，需要去除单位
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}
		// options为函数时，调用得到修正后需要设置的offset()坐标，并赋值给options
		if ( jQuery.isFunction( options ) ) {

			// fn(i, options)  可自定义修正坐标
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}
		// 可以通过using属性定义钩子函数，取代默认的写入
		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {// 默认直接通过{top: x, left: x}对象形式调用css写入
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	/**
	 * 获取匹配元素相对于document的偏移量，无论如何改变浏览器大小，滚动，位置不变
	 * .offset()：获取相对于document的偏移量
	 * .offset( {top:'',left:''} )：根据对象设置偏移
	 * @param options
	 * @return {*}
	 */
	offset: function( options ) {

		// 为了保证链式调用,根据options设置值
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// 针对不在dom树中的元素或hidden元素（display：none）返回0(gh-2310)
		// Support: IE <=11 only
		// 在IE中对非DOM树元素使用getBoundingClientRect 会抛出错误
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}
		// 注意：返回元素的大小及其相对于视口的位置。故会随滚动条滚动left，top等值不同
		// 这个方法是把元素看做为border-box，即，padding和border都在width和height内部
		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;// 节点的顶层document对象
		docElem = doc.documentElement;// html
		// 为何要使用document.defalutView.pageYOffset,而不直接用pageYOffset，或window.pageYOffset
		// 修复document对象不在页面中，而可能在内存中；或pageYOffset被同名对象覆盖，或docuemnt在inframe或popup中使用
		// 浏览器中document.defalutView返回window
		win = doc.defaultView;

		return {
			// pageYOffset滚动条位置
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},
	/**
	 * 获取匹配元素(匹配集合的第一个元素)相对父元素的偏移。
	 * 返回值可能是分数，
	 * @return {{top: number, left: number}}
	 */
	position: function() {
		// 未获得匹配元素，直接返回
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };// 默认父级元素的top和left为0

		// fixed元素是根据window偏移的 ，window对象是offset的父级(parentOffset = {top:0, left: 0},
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// 使用getBoundingClientRect 计算
			offset = elem.getBoundingClientRect();

		} else {

			// 获取实际的已定位父级元素
			offsetParent = this.offsetParent();

			// 获取正确的偏移量
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();	// 获取已定位父级相对document的偏移
			}

			// 因为offset得到的是针对borderbox的
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// 减去父级偏移与元素margin
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// 获取已经定位的最近的祖先元素
	// 相当于对this.offsetParent,html方法，定义了jQuery逻辑
	// 如下情况此方法会返回documentElement
	// 1) iframe里面没有offsetParent的元素，这个方法会返回父级window对象的documentElement
	// 2) 对于隐藏元素或独立元素
	// 3) 对于body或html元素
	//
	// 但上述说的例外一般会发生，只是被认为这些情况返回documentElement更合理
	// 然而，这个逻辑不能保证完全可靠，将来会改变
	offsetParent: function() {
		return this.map( function() {
			// HTMLElement.offsetParent :返回一个指向最近的（closest，指包含层级上的最近）包含该元素的定位元素
			// HTMLElement.offsetParent :如果没有定位的元素，则 offsetParent 为最近的 table, table cell 或根元素（标准模式下为 html；quirks 模式下为 body）
			// 由于返回table，table cell jQuery认为不合理，因此，重新书写了offsetParent逻辑
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// 构建 scrollLeft and scrollTop 方法
// 获取匹配元素相对滚动条顶部的偏移。
// 相对于Element.scrollLeft，兼容了document与window对象的偏移量设置与取值
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// 判断elem是否为window对象,如不是window对象，只是普通elme，则win为undefined
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}
			// 取值，如是window对象，则用window.pageXOffset获取滚动位置
			// 否则再调用elem.scrollLeft,Element.scrollLeft 属性可以读取或设置元素滚动条到元素左边的距离。
			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				// scrollTo滚动到文档中的某个坐标。
				// window.scrollTo(x-coord,y-coord )
				// 因为方法是只滚动x，或y，因此，滚动x时，需要给scrollTo的第二个参数传入当前y偏移值
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// 使用jQuery.fn.position增加jQuery.cssHooks.top，jQuery.cssHooks.left
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle 会对指定了top/left/bottom/right返回百分数值，这个值并不是是当前模块相对于偏移模块的值，利用position检查下
// 通过curCSS，判断top与left值是否为百分数，如是，则使用position获得与定位父级元素的偏移，否则使用原值
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// 如当前返回百分数值，使用offset计算偏移量
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


/**
 * 构建jQuery的innerHeight, innerWidth, height, width, outerHeight and outerWidth 方法
 */
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	// {padding:"innerHeight",content:height,"":outerHeight}
	// {padding:"innerWidth",content:width,"":outerWidth}
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		// 因此defalutExtra为padding，content，"",funcName为innerHeight，height，outerHeight
		function( defaultExtra, funcName ) {

		// 外边距只添加到outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				// 根据不同的方法，产生不同的extra，为了传递给jQuery.css()
				// 如outerHeight(),不包括margin；未传入参数， 故margin，value都为undefined，extra返回border
				// 如outerHeight(true),包括margin，故extra返回的是margin
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;
				// 如是elem为window对象，
				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height 会返回包含scrollbars的宽高值 (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] : // 如调用的是outerHeight，则用window.innerHeight代替，包括滚动条
						// Document对象是每个DOM树的根，但是它并不代表树中的一个HTML元素
						// document.documentElement属性引用了作为文档根元素的html标记
						// document.body属性引用了body标记
						elem.document.documentElement[ "client" + name ];// 否则用documentElement.clientHeight,不包括滚动条
				}

				// 获取document的宽高，nodeType=9为document
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;// 返回文档根

					// document.documentElement.scrollWidth返回整个文档的宽度
					// document.documentElement.offsetWidth返回整个文档的可见宽度
					// document.documentElement.clientwidth返回整个文档的可见宽度（不包含边框），clientwidth = offsetWidth - borderWidth
					// 一般不会给document.documentElement设置边框，故clientwidth 与 offsetWidth一致
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?// 根据是否提供value值，判断是取值还是设置值

					// 获取元素宽高，但不强制转换为数值
					jQuery.css( elem, type, extra ) :

					// 设置宽高
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );

/***********************************事件系统3***************************************/
jQuery.fn.extend( {
    // bind参数没有select，故不是能进行事件委托
	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},
    // 与on完全一样
	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
    // 可以用off代替
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );
/**
 * 保存或释放ready事件
 * 方法用于延迟ready事件，动态script加载时的高级用法-。-
 * 要在ready事件之前调用，否则无效
 * @param hold
 */
jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// 保存window已有的jQuery对象，避免覆盖
	_jQuery = window.jQuery,

    // 保存window已有的$对象，避免覆盖
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// 将$与jQuery暴露在window对象上
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );
