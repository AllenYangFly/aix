/* 
 * _ js
 *
 * its a javascript until 
 * support web browser and node.js
 *
 * *IE 9-Edge support
 *
 * @Author  : YIJUN
 * @Date    : 2016.6.22
 * @Version : 0.1
 *
 * @License : Fuck any LISCENSE
 *
 */

(function(root,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define(factory);
	else if(typeof exports === "object")
		// support NodeJS exports
		module.exports = factory();
	else
		// build on browser global object
		root._ = factory();

}( this , function(){
	// not use strict for eval
	'use strict';

	var VERSION = "0.1";

	// # DEFINE some useful varible
	// # Cache global object
	var OP = Object.prototype;

	// # Function Caller 
	var _arr  = [],
		_slice  = _arr.slice,
		_splice = _arr.splice;

	var root = (function(){ return this || (0,eval)("this"); }());
	// var root = this;

	var _ = {};
	// _ extend other method
	_.extend = function(protos){
		var args = _slice.call(arguments);
		if(args.length>1){
			_.compose(protos,args[1],args[2]);
		}else{
			for (var chain in protos)
				if(protos.hasOwnProperty(chain))
					this[chain] = protos[chain];
		}
		return protos;
	};

	//* [ Browser ] Supports lib
	//	ECMAScript 5 enclosure
	//	loop to make them identity function _.is*
	_.define = function(obj,prop,st){
		return _.isObject(prop) ? 
					 Object.defineProperties(obj,prop) :
					 Object.defineProperty(obj,prop,st) ;
	};

	_.isObject = function(e){
		return typeof e === "function" || typeof e === "object" && !!e;
	};

	var typeArray =[
		'Array',
		'Arguments',
		'Boolean',
		'Function',
		'String',
		'Number',
		'Null',
		'Date',
		'RegExp',
		'NodeList',
		'Undefined',
		'HTMLCollection'
	];
	typeArray.forEach(function(v,i){
		_[ 'is' + v ] = function(e){
			return OP.toString.call(e) === '[object ' + v + ']';
		};
	});

	// Loop for Array
	// fuck any Array.forEach method
	function aloop(ary,fn,ts){
		for(var i=0, l=ary.length; i<l; i++)
			fn.apply(ts||ary,[ary[i],i,ary]);
		return ary;
	}

		// Loop for Object
	function oloop(obj,fn,ts){
		var keys = _.keys(obj);
		
		aloop(keys,function(v,i){ 
			fn.call(ts||obj,obj[v],v,obj);
		},ts||obj );
		return obj;
	}

	// Untils Building
	//
	// API: 
	// @ NULL
	// @ version
	// @ foreach
	// @ clone
	// @ cloneDoom
	// ...

	_.extend({
		// empty pointer
		NULL : function(){},

		cool : function(a){ return a; },

		root : root,

		broken : {},

		version : VERSION,
		
		foreach : function(list,fn,ts){
			if(list !=null ){
				if(this.isArray(list))
					return aloop(list,fn,ts);
				else if(_.isObject(list) && !_.isFunction(list))
					return oloop(list,fn,ts);
			}
			return list;
		},

		loop : function(){
			return this.foreach.apply(this,_.slice(arguments));
		},

		keys : function(arr){
			if(arr !==null){
				if(_.isArray(arr))
					return Object.keys(arr).map(function(n){ 
						return +n;
					});
				return Object.keys(arr);
			}
		},

		slice : function(obj){
			return obj != null ? _slice.call(obj) : [];
		},

		splice : function(list,index_key,offset){
			if(_.isArray(list))
				_splice.call(list,index_key,offset||1);
			else
				delete list[index_key];
			return list;
		},

		pop: function(arr){
			if(_.isArray(arr))
				return arr.pop();
			return arr;
		},

		shift: function(arr){
			if(_.isArray(arr))
				return arr.shift();
			return arr;
		},

		push: function(arr){
			if(_.isArray(arr))
				arr.push.apply(arr,_slice.call(arguments,1));
			return arr;
		},

		unshift: function(arr){
			if(_.isArray(arr))
				arr.unshift.apply(arr,_slice.call(arguments,1));
			return arr;
		},

		// use this for pure data Object
		clone : function(list){
			if(_.isArray(list))
				return _slice.call(list);
			else if(_.isObject(list) && !_.isFunction(list))
				return JSON.parse(JSON.stringify(list));
			return list;
		},
			
		// Only use deep clone to custom model & collection
		// cloneDoom reduce each element
		clonedoom : function(list){
			if(_.isArray(list) || 
				 _.isArguments(list) || 
				 _.isNodeList(list) || 
				 _.isHTMLCollection(list))
				// clone array
				return _slice.call(list);
			else if(_.isObject(list) && !_.isFunction(list)){
				// clone object
				// copy prototype
				var ___ = function(){};
				___.prototype = list.constructor.prototype;
				var res = new ___;

				// dist clone data
				_.foreach(list, function(val,key){
					if(!_.isString(val) && 
						 !_.isNumber(val) && 
						 !_.isFunction(val))
						res[key] = _.clonedoom(val);
					else 
						res[key] = val;
				});
					
				return res;
			}
				 
			return list;
		},

		sort : function(arr,fn){
			if(!_.isArray(arr))
				return arr;
			return arr.sort(fn);
		},

		unique : function(ary){
			for(var i = 0 , ol = ary.length; i<ol; i++)
				if(i !== ary.length-1)
				  for(var j=i+1; j<ary.length; j++)
				    if( ary[i] === ary[j] ) 
				    	ary.splice(j--,1);
			return ary;
		},

		// find the idf value
		find : function(){
			return this.filter.apply(this,_.slice(arguments));
		},

		filter : function(list,idf,reverse){
			var res = [];
			_.foreach(_.clonedoom(list),function(elm,i){ 
				if(idf.call(this,elm,i,this)&&!reverse) this.push(elm) ; 
			},res);
			return res;
		},

		reject : function(list,idf){
			var res = [];
			_.foreach(_.clonedoom(list),function(elm,i){ 
				if(!idf.call(this,elm,i,this)) this.push(elm) ; 
			},res);
			return res;
		},

		map : function(list,fn){
			return _.foreach(list,function(val,key){
				this[key] = fn.call(this,val,key,this);
			},list);
		},

		// cat identity rule values form array or object
		cat : function(list,idf){
			var res = [];
			if(_.isArray(list)){
				for(var i=0,l=list.length; i<l; i++)
					if(idf.call(list,list[i],i,list))
						res.push(list.splice(i,1).pop())&&i--;
			}else if(_.isObject(list)){
				for(var i in list)
					if(list.hasOwnProperty(i))
						if(idf.call(list,list[i],i,list)){
							var po = {};
							po[i] = list[i];
							res.push(po);
							delete list[i];
						}
			}
			return res;
		},

		// find the idf index
		findindex : function(list,idf){
			var res = [];
			_.foreach(list,function(elm,i){ 
				if(idf.call(this,elm,i,this)) this.push(i); 
			},res);
			return res;
		},

		hook : function(list,hook){
			var args = _slice.call(arguments,2),
					isFn = _.isFunction(hook);
				
			return this.map(list, function(v){
				return (isFn ? hook : v[hook]).apply(v,args);
			});
		},

		// Object ready binding
		bind : function(obj){
			var args = _slice.call(arguments,1);
			_.foreach(obj,function(fn,k){
				if(this.isFunction(fn))
					obj[k] = Function.bind.apply(fn,args); 
			},this);

			return obj;
		},

		reverse : function(list){
			if(!_.isArray(list))
				return list;
			return this.slice(list).reverse();
		},

		pluck : function(list,mapkey){
			var res = [];

			_.foreach(list,function(item){
				var keys = _.keys(item);
				for( var i=keys.length; i--; )
					if(keys[i]===mapkey+'')
						this.push(item[keys[i]]);
			},res);

			return res;
		},

		groupby : function(ary,by){
			if(_.isArray(ary)){
				var group = {},
						isFn  = _.isFunction(by);
				_.foreach(ary,function(val){
					var key = isFn ? by(val) : val[by];
					if(!this[key])
						// first time should init group check
						this[key] = [val];
					else if(this.hasOwnProperty(key))
						this[key].push(val);
				},group);
				return group;
			}
			return ary;
		},

		toarray : function(obj){
			var keys = _.keys(obj),
					len  = keys.length,
					ary  = Array(len);
			for (var i = 0; i < len ; i++)
				ary[i] = obj[keys[i]];
			return ary;		
		},

		forarray : function(obj){
			var keys = _.keys(obj),
					len  = keys.length,
					ary  = Array(len);
			for (var i = 0; i < len ; i++){
				var o = {};
				o[keys[i]] =obj[keys[i]];
				ary[i] = o;
			}
			return ary;
		},

		pairs : function(obj){
			var res = [];
			var keys = _.keys(obj);
			for(var i=0,l=keys.length; i<l ; i++)
				res.push([keys[i],obj[keys[i]]]);
			return res;
		},

		random : function(min,max){
			if(max == null){
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random()*(max-min+1));
		},

		compose : function(o1,o2,nothisproperty){
			if(nothisproperty)
				_.foreach(o2,function(v,k){
					var idf = this.isArray(nothisproperty) ? 
										!this.has(nothisproperty,k) :
										(nothisproperty != null ?
											k !== nothisproperty : true);
					if(idf)
						o1[k] = v; 
				},this);
			else
				_.foreach(o2,function(v,k){
					o1[k] = v; 
				});
			return o1;
		},

		has : function(list,n){
			var idf = 0;
			_.foreach(list,function(v){
				if(v===n) idf = 1;
			});
			return !!idf;
		},

		not : function(list,n){
			for( var i=0 , l=list.length ; i<l ; i++)
				if(_.isequal(list[i],n))
					_.splice(list,i--);
			return list;
		},

		bale : function(o1,o2,nothisproperty){
			if(_.isArray(o1) && _.isArray(o2))
				return [].concat(o1).concat(o2);
			else
				return _.compose(_.clonedoom(o1),_.clonedoom(o2),nothisproperty);
		},

		// Array list Disorder
		// Shuffle a collection , using the modern version of the
		// [Fisher-Yates shuffle] (http://en.wikipedia.org/wike/Fisher-Yates_shuffle)
		shuffle : function(list){
			var st = _.isArray(list) ? list : _.toarray(list),
					ln = st.length,
					disorder = Array(ln);
			for( var i=0 , ra; i<ln; i++){
				ra = _.random(0,i);
				if(ra !==i)
					disorder[i] = disorder[ra];
				disorder[ra] = st[i];
			}

			return disorder;
		},

		trim : function(str){
			return str.replace(/^\s+|\s+$/gm , "");
		},

		merge : function(){
			var tmp = [] , args = _slice.call(arguments);
			args.forEach(function(arr){ 
				tmp = tmp.concat(arr); 
			});

			return this.unique(tmp);
		},

		partial : function(func){
			var boundArgs = _slice.call(arguments,1);

			return function(){
				var position = 0;
				var args = boundArgs.slice();

				for (var i = 0, len = args.length; i < len; i++){
					if(args[i] === _)
						args[i] = arguments[position++];
				}

				while(position < arguments.length)
					args.push(arguments[position++]);

				return func.apply(this,args);
			};
		},

		before : function(times,func){
			var undef;
			return function(){
				if(--times > 0)
					undef = func.apply(this,arguments);
				else
					func = null;
				return undef;
			};
		},

		// building the (*) times Function
		// base it on _.once  --- underscore.js
		part : function(fn,times){
			var creater = _.partial(_.before,(parseInt(times)||1)+1);
			return creater(fn);
		},

		// create function run once time
		once: function(fn){
			return _.part(fn,1);
		},

		isequal : function(x,y,strictmode){
			if((strictmode||(x==null||y==null))||
				((_.isFunction(x)||_.isFunction(y))||x===y))
				return x===y;

			if(_.typeof(x) !== _.typeof(y))
				return false;

			if(x.toString() === y.toString()){
				if(_.isArray(x)){
					if(x.length === y.length){
						for(var i=x.length; i--; )
							if(x[i]!==y[i])
								return false;
						return true;
					}else{
						return false;
					}

				} else if(_.isObject(x)){
					var xkeys = _.keys(x);
					var ykeys = _.keys(y);
					if(xkeys.length === ykeys.length){
						for(var i=xkeys.length; i--; )
							if(x[xkeys[i]]!==y[xkeys[i]])
								return false;
						return true;
					}
					return false;

				}
			}
			return false;
		},

		typeof : function(def){
	  	//[
	  	//'Array',
	  	//'Arguments',
	  	//'Boolean',
	  	//'Function',
	  	//'String',
	  	//'Number',
	  	//'Null',
	  	//'Date',
	  	//'RegExp',
	  	//'NodeList',
	  	//'Undefined',
	  	//"HTMLCollection"
	  	//]
	  	var index,
					types = [
				_.isArray(def),
				_.isArguments(def),
				_.isBoolean(def),
				_.isFunction(def),
				_.isString(def),
				_.isNumber(def),
				_.isNull(def),
				_.isDate(def),
				_.isRegExp(def),
				_.isNodeList(def),
				_.isUndefined(def),
				_.isHTMLCollection(def)
			];

			index = _.findindex(types,function(type){ return type===true; }).shift();
			return index == null ? "object" : typeArray[index].toLowerCase(); 
		},

		// make the jQuery.serializeArray to Object
		// make the __.formdataArray to Object
		requery : function(arr){
			var res = {};
			_.foreach(arr,function(elm){
				res[elm.name] = elm.value;
			});
			return res;
		},

		async : function(fn,time){
			return setTimeout(fn,time||0);
		},

		combom : function(list,fn){
			var res;
			for(var i=0, l= list.length; i<l; i++){
				if(fn.call(list,list[i],i,list)){
					res = list[i];
					break;
				}
			}
			return res;
		}
	});

	// URL parse and stringify
	// useful browser
	var whiteSpace = /[\t\r\n\f\x20]/g;

	function pP_rSpace(part){ 
		return decodeURIComponent(part.replace(/\+/g," ")); 
	}

	function sP_rInsignia(part){ 
		return encodeURIComponent(part).replace(" ","%20"); 
	}

	_.extend({
		
		// @ parse the queryString to JSON Object
		paramparse : function(url){
			var findQuery = url.indexOf("?"),
				reg = /([^&=]+)=?([^&]*)/g ,
				param , match , x = {};

			param = findQuery === -1 ? url : url.substr(findQuery+1);

			while( match = reg.exec(param) )
				x[pP_rSpace(match[1])] = pP_rSpace(match[2]);

			return x;
		},

		// @ make its Param Object to queryString
		paramstringify : function(param){
			var Cparam = _.clone(param);

			for(var key in Cparam)
				Cparam[key] = sP_rInsignia(
					(_.isObject(Cparam[key]) || _.isArray(Cparam[key])) ?
					JSON.stringify(Cparam[key]) :
					Cparam[key]
				);

			var str = JSON.stringify(Cparam);
			return str.replace(/[\"\{\}]/g,"")
							  .replace(/:/g,"=")
							  .replace(/,/g,"&")
							  .replace(whiteSpace,"");
		},

		stringparse : function(val){
			return _.isBoolean(val) ? val : (val+"");
		}
	});


	// _.doom DOOM template. 
	// use for base mvc framwork
	// support node.js
	var ecode = {
		"&" : "&amp;",
		">" : "&gt;",
		"<" : "&lt;",
		'"' : "$quot;",
		"'" : "&#x27;",
		"`" : "&#x60"
	};
	var dcode = {
		"&amp;"  : '&',
		"&gt;"   : '>',
		"&lt;"   : '<',
		"&quot;" : '"',
		"&#x27;" : "'",
		"&#x60;" : '`'
	};

	var no = "(.)^",
		escaper = /\\|'|\r|\n|\u2028|\u2029/g,
		escapes = {
			"'"      : "'",
			"\\"     : "\\",
			"\r"     : "r",
			"\n"	   : "n",
			"\u2028" : "u2028",
			"\u2029" : "u2029"
		};

	var doomSetting = _.doomSetting = {
		escape      : "{{-([\\s\\S]+?)}}",
		interpolate : "{{#([\\s\\S]+?)}}",
		evaluate    : "{{([\\s\\S]+?)}}"
	};

	function c_ecode(str){ return ecode[str] || str; }
	function c_dcode(str){ return dcode[str] || str; }
	function c_escape(get){ return '\\' + escapes[get]; }

	_.extend({

		encodeHTML : function(str){
			return +str===str ? str : str.replace(/[&<">'](?:(amp|lt|quot|gt|#39);)?/g , c_ecode);
		},

		decodeHTML : function(str){
			return +str===str ? str : str.replace(/&((g|l|quo)t|amp|#39);/g , c_dcode);
		},

		// _.doom template
		doom : function(txt,name){
			var index = 0,
					res = "_p+='",
					args = _slice.call(arguments,2),

					exp = RegExp((this.doomSetting.escape||no) + 
								"|" + (this.doomSetting.interpolate||no) + 
								"|" + (this.doomSetting.evaluate||no) +"|$","g");

			// start replace working
			txt.replace( exp , function(match,escape,interpolate,evaluate,offset){

				res += txt.slice(index,offset).replace(escaper,c_escape);
				// refresh index where to find text string
				index = offset + match.length;

				if(escape)
					// if command is - should encodeHTML string
					res += "'+\n((_t=(" + escape + "))==null?'':_.encodeHTML(_t))+\n'";
				else if (interpolate)
					res += "'+\n((_t=(" + interpolate + "))==null?'':_t)+\n'";
				else if(evaluate)
					res += "';\n" + evaluate + "\n_p+='";
				return match;
			});

			// End wrap res@ String
			res += "';\n";
			if(!name) res = "with(_x||{}){\n" + res + "}\n";
			res = "var _t,_p='';\n" + res + "return _p;\n";

			// Complete building Function string
			// try to build anmousyous function
			try {
				// var render = new Function(name||"_x","_",res);
				var render = (0,eval)("(function("+(name||"_x") 
													+ ",_" 
													+ ( args.length ? ","+args.toString() : "" ) 
													+ "){" 
													+ res 
													+ "})"
												 );
			}catch(e){
				e.res = res;
				console.log(res);
				throw e;
			}

      // @ Precomplete JavaScript Template Function
      // @ the you build once template that use diff Data, not use diff to build function again
			// @ protect your template code other can observe it?
			return function(data){
				return render.apply(this , 
					[data,_].concat(_slice.call(arguments,1))
				);
			};
		}

	});

	// Object watcher
	// Most important part in javascript
	// Don't use it on IE8
	_.extend({
		
		watch : function(obj,prop,handler){
			var oldval = obj[prop] , newval = oldval;
			function getter(){ return newval; }
			function setter(val){ 
				oldval = newval; 
				return newval = handler.call(obj,val,oldval,prop); 
			}

			if(delete obj[prop]){
				if(Object.defineProperty){
					Object.defineProperty(obj,prop,{
						get: getter,
						set: setter,
						enumerable: true,
						configurable: true
					});
				}else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__){
					Object.prototype.__defineGetter__.call(obj, prop, getter);
          Object.prototype.__defineSetter__.call(obj, prop, setter);
				}
			}

			return obj;
		},

		unwatch : function(obj,prop){
			var val = obj[prop];
			delete obj[prop]; 
			obj[prop] = val;
			return obj;
		}

	});


	// Object Events
	// Use [ defineProperty ]. not support IE8
	_.extend({
		addEvent : function(obj,type,fn){
			if(!obj._events)
				_.define(obj,"_events",{
					value : {},
					writable : true,
					enumerable: false,
					configurable: true
				});
			if(!obj._events[type])
				obj._events[type] = [];
			if(!_.has(obj._events[type],fn))
				obj._events[type].push(fn);
			return obj;
		},

		removeEvent : function(obj,type,fn){
			if(obj._events[type]){
				_.not(obj._events[type],fn);
				if(!obj._events[type].length || !fn)
					delete obj._events[type];
			}else if(!type && !fn){
				return _.release(obj); 
			}
			return obj;
		},

		release: function(obj){
			delete obj._events;
			return obj;
		},

		dispatch : function(obj,type,fn,args){
			var hasFn = _.isFunction(fn);
			if(obj._events)
				if(obj._events[type])
					hasFn ? 
					_.foreach(obj._events[type],function(f){
						if(f===fn) f.apply(obj,args||[]);
					}) : 
					_.foreach(obj._events[type],function(f){
						f.apply(obj,args||[]);
					});
			return obj;
		},

		trigger : function(){
			return _.dispatch(_.slice(arguments));
		}

	});

	
	// about browser api
	// support Browser eval struct
	if(_.root.self){
		// UserAgent
		var checkUA = function(ng){
			this.info = ng.userAgent;
			this.language  = ng.language;
			this.platform  = ng.platform;
		};

		_.extend(checkUA.prototype,{
			defineBroswer : function(browserlist,identifylist){
				var ua = this.info;
				this.browser = {};

				for(var i = browserlist.length; i--; ){
					if(identifylist[i].call(ua,_.root)){
						this.browser[browserlist[i]] = true;
					} else {
						this.browser[browserlist[i]] = false;
					}
				}
				return this;
			},

			definePlatform : function(proplist,checklist){
				var ua = this.info;
				this.version = {};

				for(var i = proplist.length ;i--;)
					this.version[proplist[i]] = checklist[i].call(ua,_.root);
				return this;
			}

		});

		var _CHECKER = (new checkUA(_.root.navigator))
			.defineBroswer([
				"IE",				"Edge",
				"Opera",		"Chrome",
				"Safari",		"FireFox",

				"Mobile",		"Desktop"
			],[
				//IE
				function(){
					return /(Trident|MSIE)/i.test(this);
				},
				//Edge
				function(){
					return /Edge/i.test(this) && /Webkit/i.test(this);
				},
				//Opera
				function(){
					return /Opera/i.test(this) && /Webkit/i.test(this);
				},
				//Chrome
				function(root){
					return root.chrome != null;
				},
				//Safari
				function(){
					return /Safari/i.test(this) && !/Chrome/i.test(this);
				},
				//FireFox
				function(root){
					return /Firefox/i.test(this) && root.netscape && /Gecko/.test(this);
				},
				//Mobile
				function(root){
					return root.devicePixelRatio > 1;
				},
				//Desktop
				function(root){
					return root.devicePixelRatio == null || root.devicePixelRatio === 1;
				}
			])
			.definePlatform([
				"OS",
				"RenderEnginner",
				"Chrome",
				"Firefox",
				"IE"
			],[
				//Operating System
				function(root){
					if(/Windows/gi.test(this))
						return "Windows";
					if(/(Linux|Ubuntu|CentOS|Debian|Arach|RedHat|FreeBSD|Unix)/gi.test(this))
						return "Linux";
					if(/Macintosh/gi.test(this))
						return "Mac OS X";
					if(/iOS|iPad|iPhone/gi.test(this))
						return "iOS";
					if(/Android/gi.test(this))
						return "Android";
					return "UnKown";
				},
				//Render Enginner
				function(root){
					return /(Webkit|Gecko|Trident)/gi.exec(this)[0];
				},
				//Chrome Version
				function(root){
					if(/Chrome/gi.test(this))
						return this.match(/(Chrome)\/([\d\.]+)/gi)[0].replace(/[^\d\.]/gi,"");
					return false;
				},
				//FireFox Version
				function(root){
					if(/Firefox/gi.test(this))
						return (/Firefox\/([\d\.]+)/gi.exec(this)[1]);
					return false;
				},
				//IE version
				function(root){
					if(/IE/gi.test(this))
						return parseInt(/MSIE\ ([\d\.]+)/gi.exec(this)[1]); 
					return false;
				}
			]);

	// about browser's api local
	// ajax counter
	var xhrcount = 0;
	// ajax setcache
	var ls = _.root.localStorage;
	if(!ls.getItem("aixcache"))
			ls.setItem("aixcache","{}");
	
	// dom parser
	var bdlevel = /<(\/)?(\w+)\s?([^>]+?)?\>{1}/gi;
	var parseattr = function(str,nodetarget){
		var res = {};
		var arr = str ? str.split(" "):[];
		_.foreach(arr,function(prop,i){
			var pr = prop.split("=");
			res[pr[0]] = (pr[1]||"").replace(/[\'\"]/gm,"");
		});

		res["x-aim"] = nodetarget;
		return res;
	};

	// auto close tag
	var htmlcstags = [
		"input",
		"hr",
		"br",
		"img",
		"area",
		"base",
		"!DOCTYPE",
		"!--"
	];

	// create Elm form node info
	function createttreeElm(node){
		var elm = document.createElement(node.tagname);
		_.foreach(node.attributes,function(val,name){
			elm.setAttribute(name,val);
		});

		if(!node.child)
			elm.innerHTML= node.content;
		else if(!node.child.length)
			elm.innerHTML= node.content;
	
		return elm;
	}

	function converttree(tree){
		// create top Element;
		var wrap = document.createElement("x-tree");
				wrap.id = "@";

		if(tree.length){
			var level1 = tree[1];

			for(var i=0,l=level1.length;i<l;i++){
				wrap.appendChild(createttreeElm(level1[i]));
			}

			for(var i=2,l=tree.length;i<l;i++){
				for(var j=0,k=tree[i].length;j<k;j++){
					var node = tree[i][j];
					var elm = createttreeElm(node); 

					wrap.querySelector("[x-aim='"+node.parent["@"]+"']")
						.appendChild(elm);
				}
			}
		}

		return wrap;
	}

	function virtualupprops(prop1,prop2){
		// old new
		var props = _.bale(prop1,prop2);
		_.foreach(prop1,function(val,key){
			if(props[key]===val)
				delete props[key];
		});

		return props;
	}

	_.extend({
		// parse data require
		// parse by http [ Content-type ]
		datamime : function(header,param){
			if(_.isObject(header)){
				if(header["Content-type"]){
					switch(header["Content-type"]){
						case "application/json":
							return JSON.stringify(param||{});
							break;
						default : 
							return _.paramstringify(param||{});
							break;
					}
				}
			}

			return _.paramstringify(param||{})
		},

		strip: function(str,strict){
			var s = _.isString(str) ? str
							.replace(/<script\b[^>]*>(.*?)<\/script>/img,'') : "";
			return strict ? s.replace(/[\t\r\n\f]/gm,'') : s;
		},

		// dom parse 
		domparse : function(domstr){
			var str = _.trim(_.strip(domstr));

			// make a newtree default node
			var newlevel = 1; 
			var find = 1;
			var newtree  = [];

			var resentnode = [];
			var nodeindex = 1;

			str.replace(bdlevel,function($match,close,tag,attr,offset){
				var node = {};
						node["@"] = nodeindex++;

				var level;

				if(close !== "/"){
					// find begin
					level = newlevel++;

					// check parent
					// save the level;

					if(newtree[level]==null)
						newtree[level] = [];
					var n = level-1;
					var nlevel = level-find++;

					_.compose(node,{
						tagname:tag,
						attributes:parseattr(_.trim(attr||""),node["@"]),
						$ob:offset+$match.length
					});
					newtree[level].push(node);

					if(_.has(htmlcstags,tag)){
						--newlevel; --find;
						node.$oe = 0;
					}else{
						resentnode.push(node);
					}

		  	} else {
		  		// find end
					level = --newlevel; --find; --nodeindex;

					var gtn = resentnode.pop();
					gtn.$oe = offset-gtn.$ob;
				}

				return $match;
			});


			for(var i=1,l=newtree.length;i<l;i++){
				var np = newtree[i];
				var npc = newtree[i+1];
				var npp = newtree[i-1]; 

				for(var j=0,k=np.length;j<k;j++){
					var begin = np[j].$ob;
					var end = np[j].$oe;
					var child = null

					np[j].content = _.trim(str.substr(begin,end));

					// find child
					if(npc){
						child = _.filter(npc,function(node,index){
							return node.$ob>begin && (node.$ob+node.$oe)<(begin+end);
						}); 
						if(child.length===0)
							child = null
					}
					np[j].child = child

					// find parent
					np[j].parent = npp ? _.combom(npp,function(node,index){
						return begin>node.$ob && (begin+end)<(node.$ob+node.$oe);
					}) : null;
				}
			}

			return newtree;
		},

		// vitruldom
		virtualDOM : function(html){
			var parse = _.domparse(html||"");
			var vDOM = converttree(parse);

			vDOM.xdom = parse;
			vDOM.xbase = html;
			vDOM.xhtml = vDOM.innerHTML;

			return vDOM;
		},

		// v1 old
		// v2 new
		virtualDIFF : function(v1,v2){
			var res = []
			var banlist = [];
			var p1 = v1.xdom; //old
			var p2 = v2.xdom; //new

			if(_.strip(v1.xhtml) === _.strip(v2.xhtml))
				return res;

			if(p1.length&&p2.length){
				for(var i=1,len = Math.max(p1.length,p2.length);i<len;i++){
					var p1level = p1[i]||[];
					var p2level = p2[i]||[];
					
					for(var j=0,jlen = Math.max(p1level.length,p2level.length); j<jlen; j++){
						var hp1n = p1level[j];
						var hp2n = p2level[j];

						var hasp1j = ( hp1n != null);
						var hasp2j = ( hp2n != null);

						// has same level node
						if(hasp1j&&hasp2j){
							if(hp1n.tagname !== hp2n.tagname){
								res.push({
									type:"replace",
									aim:hp1n["@"],
									root:true,
									content: v2.querySelector("[x-aim='"+hp2n["@"]+"']")
								});

								banlist.push(hp1n["@"]);

							} else {

								if(!_.isequal(hp1n.attributes,hp2n.attributes)){
									res.push({
										type:"props",
										aim:hp1n["@"],
										props:virtualupprops(hp1n.attributes,hp2n.attributes)
									});
								}

								if(!hp1n.child&&!hp2n.child){
									if(hp1n.content !== hp2n.content){
										res.push({
											type:"text",
											aim:hp1n["@"],
											content: hp2n.content
										});
									}
								}
							}
						// old elm exsit but remove in new level
						}else if(hasp1j&&!hasp2j){
							res.push({ 
								type:"remove",
								aim: hp1n["@"] 
							});
						// old elm not exsit but add in new level
						}else if(!hasp1j&&hasp2j){
							res.push({ 
								type:"append",
								aim: _.isObject(hp2n) ? (hp2n.parent !=null ? hp2n.parent["@"] : "root" ) : "root",
								content: v2.querySelector("[x-aim='"+hp2n["@"]+"']")
							});
						}
					}
				}
			}else{
				if(p1.length === 0){
					res.push({ type:"create", aim:"root", content:v2.innerHTML })
					return res;
				}
				if(p2.length === 0){
					res.push({ type:"destory", aim:"root" })
					return res;
				}
			}

			// cat ban list
			res = _.filter(res,function(item){
				return item.root || !_.has(banlist,item.aim);
			});

			// sort res operater
			for(var i=0,l=res.length;i<l;i++){
				if(res[i].type==="remove"){
					res.unshift(res.splice(i,1).pop());
				}else if(res[i].type==="replace"){
					res.push(res.splice(i,1).pop());
				}
			}

			return res;
		},

		// cookies
		cookieparse : function(ckstr){
			var tmp ;
			var res = {};
			var pars = ckstr ? ckstr.split(";") : [];

			pars.forEach(function(item){
				tmp = (item||"").split("=");
				if(tmp.length)
					res[_.trim(tmp[0])] = _.trim(tmp[1]);
			});

			return res;
		},

		cookie : function(param){
			// args :( name , value, expires, path, domain, secure)
			var args = _.slice(arguments);
			var len = args.length;
			var parsec = _.cookieparse(_.root.document.cookie);


			if(len){
				// get cookie
				if(len === 1)
					return parsec[param];
				else{
					var time = new Date();
					time.setDate(time.getDate()+365);

					return _.root.document.cookie = _.trim(
										  args[0]+"="+(args[1]||"") + ';' 
										+  "expires="+(args[2]||time.toGMTString()) + ';'
										+  "path="   +(args[3]||"/") + ';'
										+  "domain=" +(args[4]||"") + ';'
										+  ( args[5] ? "secure":"" ));
				}
			}

			return parsec;
		},

		// ajax, 
		// aix-pipe require api
		aix : function(options){
			var _s = _.compose({
				// default
				url       : "",
				type      : "GET",
				param     : _.broken,
				aysnc     : true,
				vaild     : true,
				cache     : false,
				success   : _.NULL,
				fail      : _.NULL,
				loading   : null,
				loaded    : null,
				header    : _.broken,
				username  : null,
				password  : null,
				timeout   : 0
			} , options || {} );


			// if use cache assign
			if(_s.cache){
				var aixcache = JSON.parse(ls.getItem("aixcache"));
				var key = _s.url || _.root.location.href.split("#")[0];

				if(aixcache[key])
					return _s.success.call(_.root,aixcache[key]);
			}

			// create AJAX XMLHttpRequest constructor
			var xhr = new XMLHttpRequest();

			// typeof "GET" method
			// do not send param , compose param in url
			if( _s.type.toUpperCase() === "GET" && _s.param){
				_s.url += (_s.url.search(/\?/g) === -1 ? 
					(_.keys(_s.param).length ? "?" : "") : "&" )
					+ _.paramstringify(_s.param);
				_s.param = null;
			}

			if(_.isFunction(_s.loading)){
				var lfn = function(event){ _s.loading.call(_.root,event); };
				xhr.addEventListener("loadstart",function(event){
					lfn(event);
					xhr.removeEventListener("loadstart",lfn);
					lfn = null;
				});
			}

			if(_.isFunction(_s.loaded)){
				var rfn = function(event){ _s.loaded.call(_.root,event); };
				xhr.addEventListener("loadend",function(event){
					rfn(event);
					xhr.removeEventListener("loadend",rfn);
					rfn = null;
				});
			}

			if(_s.username != null)
				xhr.open(_s.type,_s.url,_s.aysnc, _s.username , _s.password||"");
			else
				xhr.open(_s.type,_s.url,_s.aysnc);

			// typeof "POST" method
			if( _s.type === "POST" && _s.param && !_.isObject(_s.header))
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
			xhr.setRequestHeader("Aix-Requested","AixHttpRequest");

			if(_.isObject(_s.header) && _s.header !== _.broken)
				_.foreach(_s.header,function(val,key){ 
					xhr.setRequestHeader(key,val); 
				});

			xhr.onreadystatechange = function(event){
				// response HTTP response header 200 or lower 300
				// 304 not modifined
				if(xhr.readyState === 4 && xhr.responseText){
					var status = xhr.status;

					if(( status >= 200 && status < 300) || status === 304){
						_s.success.call(_.root,xhr.responseText,xhr,event);
						// if cache been set writeJSON in chache
						if(_s.cache){
							var aixcache = JSON.parse(ls.getItem("aixcache"));
							aixcache[_s.url||_.root.location.href.split("#")[0]] = xhr.responseText;
							ls.setItem("aixcache",JSON.stringify(aixcache));
						}
					} else {
						_s.fail.call(_.root,xhr,event);
					}
				}
			};

			xhr.send(_s.param ? 
				(!_.isObject(_s.param) ? 
					_s.param : 
					_.datamime(_s.header,_s.param))
					:null);
			xhrcount++;

			// if set timeout for ajax , should abort after 
			// trigger fail callee
			if(_s.timeout){
				_.async(function(){ 
					xhr.abort(); _s.fail.call(_.root,xhr);
				},_s.timeout*1000||5000);
			}

			return xhr;
		},

		// jsonp api
		aixp : function(option){
			var _s = _.compose({
				url : "",
				param : _.broken,
				key : "callback",
				fn : ("jsonp"+Math.random()).replace(".",""),
				timeout: 5,
				success : _.NULL,
				fail : _.NULL
			}, option || {} );

			var url = _s.url+"?"
							+ _.paramstringify(_s.param)
							+ (_.keys(_s.param).length ? "&" : "") 
							+ _s.key + "=" + _s.fn;

			var aixp_tag = _.root.document.createElement("script");
					aixp_tag.src = url;

			// define callback
			_.root[_s.fn] = function(res){
				clearTimeout(_s.timesetup);
				
				_.root.document.body.removeChild(aixp_tag);
				_.root[_s.fn] = null;
				_s.success.call(_.root,res);
			};

			// append elm
			// send request
			_.root.document.body.append(aixp_tag);

			// if timeout will trigger failcall
			if(_s.timeout){
				_s.timesetup = setTimeout(function(){
					_.root.document.body.removeChild(aixp_tag);
					_.root[_s.fn] = null;

					_s.success.call(_.root);
				},_s.timeout * 1000);
			}

			xhrcount++;
		},

		// HTML page info 
		pagepref : function(){
			var tags = _.slice(document.getElementsByTagName("*"));
			var ids = "";
			var idchecker = {};

			var classes = "" ; 
			var classchecker = {};

			var links = "";

			var imges = "" ;
			var imgtags = _.slice(document.getElementsByTagName("img"));

			var scriptfiles = [];
			var scripttags = _.slice(document.getElementsByTagName("script"));

			var regclass = function(arr,e,n){
				if(arr[n])
					arr[n].push(e);
				else
					arr[n] = [e];
			};

			_.foreach(tags,function(elm){
				var t = elm.getAttribute("class");
				if(t){
					classes+= " "+ t;

					t = _.trim(t).split(" ");
					_.foreach(t,function(classname){
						regclass(classchecker,elm,classname);
					});
				}

				t = elm.getAttribute("id");
				if(t){
					ids+= " "+t;
					t = _.trim(t);
					regclass(idchecker,elm,t);
				}

				t = _.root.getComputedStyle(elm);
				if(   t 
					&& t.backgroundImage
					&& t.backgroundImage.toLowerCase() !== "none")
					imges += " "+ t.backgroundImage;

				t = elm.getAttribute("href");
				if(t)
					links += " "+t;
			});

			_.foreach(imgtags,function(elm){
				var t = elm.getAttribute("src");
				if(t)
					imges+= " "+ t;
			});

			_.foreach(scripttags,function(elm){
				var t = elm.getAttribute("src");
				if(t)
					scriptfiles.push(t.split("/").pop().slice(0,-3));
			});

			var idlist = ids.split(" ");
			idlist.shift();
			idlist = _.unique(idlist);

			var classlist = classes.split(" ");
			classlist.shift();
			classlist = _.unique(classlist);

			var imglist = imges.split(" ");
			imglist.shift();
			imglist = _.unique(imglist);

			var linklist = links.split(" ");
			linklist.shift();
			linklist = _.unique(linklist);

			return {
				_url : window.location.href,

				htmlsize : (document.body.innerHTML + document.head.innerHTML).replace(whiteSpace,"").length,
				htmltags : tags.length, 

				idlist : idlist.sort(),
				idchecker : idchecker,

				classlist : classlist.sort(),
				classchecker : classchecker,

				scriptlist : scriptfiles,

				imglist : imglist.sort(),
				linklist : linklist.sort(),

				cookies : _.cookie(),
				localstorage : ls || {},

				_aixxhr : xhrcount
			};
		},

		// userAgent
		ua: _CHECKER

	});
	}

	// _.stack
	// trunk aysnc function
	var stack;
	_.stack = stack = function(arr){
		var ram = arr || [];
		//[[fn:func,time:0]]
		
		var firelist = [];
		_.foreach(ram,function(g){
			var x = _.isObject(g) ? _.toarray(g) : (g||[]);
			var fn = _.isFunction(x[0]) ? x[0] : _.NULL;
			var t = _.isNumber(x[1]) ? x[1] : 0;
			
			var fire = function(arg){
				setTimeout(function(){ 
					var nx = firelist.pop();
					var tmp = fn.call(_.root,arg);
					nx && nx.call(_.root,tmp);
				},t*1000);
			};

			firelist.push(fire);
		});

		_.define(this,"=",{
			value : firelist,
			writable : true,
			enumerable: false,
			configurable: false
		});
	};

	_.extend(stack.prototype,{
		noop : function(){
			this["="] = [];
			return this;
		},
		
		fire : function(){
			return this["="].length && 
						 this["="].pop().call(_.root);
		},

		add : function(){
			return this.push.apply(this,_.slice(arguments));
		},

		push : function(){
			var _this = this;
			var args = _.slice(arguments);

			_.foreach(args,function(item){
				if(!_.isFunction(item)&&!_.isArray(item))
					return console.error("add/push arguments error when assign to stack!");
				var fn = _.isArray(item) ? item[0] : item;
				var t = _.isArray(item) ? (item[1]||0) : parseFloat(item||0);
				 
				var fire = function(arg){
					setTimeout(function(){ 
						var nx = _this["="].pop();
						var tmp = fn.call(_.root,arg);
						nx && nx.call(_.root,tmp);
					},t*1000);
				};

				_this["="].push(fire);
			});
		}
	});

	// Parallel queue
	var hack;
	_.hack = hack = function(arr,complete){
		var _this = this;
		var ram = arr || [];
		var ramlen = ram.length;

		var checklist=new Array(ramlen);
		var firelist =[];

		// define property
		_.define(this,{
			"complete" : {
				value : (complete||_.NULL),
				writable : true,
				enumerable: false,
				configurable: false
			},

			"-" : {
				value : firelist,
				writable : true,
				enumerable: false,
				configurable: false
			}
		});

		_.foreach(ram,function(g,i){
			var index = i;
			var x = _.isObject(g) ? _.toarray(g) : (g||[]);
			var fn = _.isFunction(x[0]) ? x[0] : _.NULL;
			var t = _.isNumber(x[1]) ? x[1] : 0;
			
			var fire = function(){
				setTimeout(function(){ 
					var tmp = fn();
					checklist[index] = (tmp||1) ;
					if(!_.has(checklist)){
						_this.complete.apply(_.root,checklist);
						_this.noop();
					}
				},t*1000);
			};

			firelist.push(fire);
		});
	
	};

	_.extend(hack.prototype,{
		noop : function(){
			this["-"] = null;
			this.complete = null;
			return this;
		},

		fire: function(){
			return !this["-"].length ? 0 : _.foreach(this["-"],function(fn){
				return fn.call(_.root);
			});
		}

	});

	return _;

}));
