/**
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 **/

Clojure = (function () {
	var Printer = (function () {
		function pad (value, length) {
			var string = value.toString();

			return (new Array(length - string.length + 1).join('0')) + string;
		}

		function rfc3339 (date) {
			var offset = date.getTimezoneOffset();
			
			return pad(date.getFullYear(), 4)
				+ "-" + pad(date.getMonth() + 1, 2)
				+ "-" + pad(date.getDate(), 2)
				+ "T" + pad(date.getHours(), 2)
				+ ":" + pad(date.getMinutes(), 2)
				+ ":" + pad(date.getSeconds(), 2)
				+ "." + pad(date.getMilliseconds(), 3)
				+ (offset > 0 ? "-" : "+")
				+ pad(Math.floor(Math.abs(offset) / 60), 2)
				+ ":" + pad(Math.abs(offset) % 60, 2);
		}

		function inspect (string) {
			var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
					meta      = {
						'\b': '\\b',
						'\t': '\\t',
						'\n': '\\n',
						'\f': '\\f',
						'\r': '\\r',
						'"' : '\\"',
						'\\': '\\\\'
					};

			escapable.lastIndex = 0;

			return '"' + (escapable.test(string) ? string.replace(escapable, function (a) {
				var c = meta[a];

				return typeof c === 'string' ? c :
					'\\\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) : string) + '"';
		}

		var c = function (object, options) {
			this.options = options || {};
		}

		c.prototype.show = function () {
			var obj = this.object;

			if (obj == null) {
				return 'nil';
			}

			switch (typeof obj) {
				case 'boolean': return obj.toString();
				case 'number':  return obj.toString();
				case 'string':  return inspect(obj);
			}
			
			if (obj instanceof Array) {
				var result = '';

				for (var i = 0; i < obj.length; i++) {
					result += stringify(obj[i]) + ' ';
				}

				return '[' + result.substr(0, result.length - 1) + ']';
			}
			else if (obj instanceof RegExp) {
				return '#"' + obj.toString().substr(1).replace(/\/\w*$/, '') + '"';
			}
			else if (obj instanceof Date) {
				return '#inst "' + rfc3339(obj) + '"';
			}
			else if (typeof obj.valueOf() != 'object') {
				return stringify(obj.valueOf());
			}
			else {
				var result = '';

				for (var key in obj) {
					result += (options.keys_are_symbols ? (':' + key) : stringify(key)) + ' ' + stringify(obj[key]) + ' ';
				}

				return '{' + result.substr(0, result.length - 1) + '}';
			}

			throw new Error('unknown object');
		}

		return c;
	})();

	var Reader = (function () {
		function start_with (string, match) {
			for (var i = 0; i < match.length; i++) {
				if (string[i] != match[i]) {
					return false;
				}
			}

			return true;
		}

		var c = function (string, options) {
			this.options  = options || {};
			this.string   = string
			this.position = 0;
		}

		c.prototype.current = function () {
			return this.string[this.position];
		}

		c.prototype.seek = function (n) {
			return this.position += n;
		}

		c.prototype.after = function (n) {
			return this.string[this.position + n];
		}

		c.prototype.eof = function () {
			return this.position >= this.string.length - 1;
		}

		c.prototype.remaining_length = function () {
			return this.string.length - this.position;
		}

		c.prototype.ignore = function () {
			var current = this.current();

			while (!this.eof() && current == ' ' || current == ',' || current == '\t' || current == '\n' || current == '\n') {
				this.seek(1);

				current = this.string[this.position];
			}
		}

		c.prototype.next_type = function () {
			var current = this.current();

			if (current == '-' || current == '+' || !isNaN(parseInt(current))) {
				return "number";
			}

			switch (current) {
				case '^':           return "metadata";
				case 't': case 'f': return "boolean";
				case 'n':           return "nil";
				case '\\':          return "char";
				case ':':           return "keyword";
				case '"':           return "string";
				case '{':           return "map";
				case '(':           return "list";
				case '[':           return "vector";
			}

			if (current == '#') {
				switch (this.after(1)) {
					case 'i': return "instant";
					case '{': return "set";
					case '"': return "regexp";
				}
			}

			throw new Error('unknown type');
		}

		c.prototype.read_next = function () {
			this.ignore();

			if (this.eof()) {
				throw new Error('unexpected EOF');
			}

			return this["read_" + this.next_type()]();
		}

		c.prototype.read_metadata = function () {
			var metadatas = [];
			var result;

			while (this.current() == '^') {
				this.seek(1);

				metadatas.push(this.read_next());
			}

			result = this.read_next();

			return result;
		}

		c.prototype.read_nil = function () {
			if (this.remaining_length() < 3) {
				throw new Error('unexpected EOF');
			}

			if (!start_with(this.string, "nil")) {
				throw new Error('expected nil, got ' + this.string.substr(0, 3));
			}

			this.seek(3);

			return null;
		}

		return c;
	})();

	return {
		Printer: Printer,
		Reader: Reader,

		stringify: function (obj, options) {
			return new Printer(obj, options).show();
		},

		parse: function (obj, options) {
			return new Reader(obj, options).read_next();
		}
	};
})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Clojure
}
