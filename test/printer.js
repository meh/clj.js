var vows   = require('vows'),
    assert = require('assert'),
    clj    = require('../clj.js');

vows.describe('Clojure Printer').addBatch({
	'when printing true': {
		topic: function () {
			return clj.stringify(true);
		},

		'we get "true"': function (topic) {
			assert.equal(topic, 'true');
		}
	},

	'when printing false': {
		topic: function () {
			return clj.stringify(false);
		},

		'we get "false"': function (topic) {
			assert.equal(topic, 'false');
		}
	},

	'when printing null': {
		topic: function () {
			return clj.stringify(null);
		},

		'we get "nil"': function (topic) {
			assert.equal(topic, 'nil');
		}
	},

	'when printing undefined': {
		topic: function () {
			return clj.stringify(undefined);
		},

		'we get "nil"': function (topic) {
			assert.equal(topic, 'nil');
		}
	},

	'when printing strings, ': {
		'specifically "lol"': {
			topic: function () {
				return clj.stringify('lol');
			},

			'we get \'"lol"\'': function (topic) {
				assert.equal(topic, '"lol"');
			}
		},

		'specifically "lol\\nlol"': {
			topic: function () {
				return clj.stringify('lol\nlol');
			},

			'we get \'"lol\\nlol"\'': function (topic) {
				assert.equal(topic, '"lol\\nlol"');
			}
		}
	},

	'when printing symbols, ': {
		'specifically wat': {
			topic: function () {
				return clj.stringify(clj.symbol('wat'));
			},

			'we get wat': function (topic) {
				assert.equal(topic, 'wat');
			}
		}
	},

	'when printing keywords, ': {
		'specifically :wat': {
			topic: function () {
				return clj.stringify(clj.keyword('wat'));
			},

			'we get ":wat"': function (topic) {
				assert.equal(topic, ':wat');
			}
		}
	},

	'when printing numbers': {
		'specifically 23': {
			topic: function () {
				return clj.stringify(23);
			},

			'we get "23"': function (topic) {
				assert.equal(topic, '23');
			}
		},

		'specifically 2.3': {
			topic: function () {
				return clj.stringify(2.3);
			},

			'we get "2.3"': function (topic) {
				assert.equal(topic, '2.3');
			}
		}
	},

	'when printing rationals, ': {
		'specifically 2/3': {
			topic: function () {
				return clj.stringify(clj.rational(2, 3));
			},

			'we get "2/3"': function (topic) {
				assert.equal(topic, '2/3');
			}
		}
	},

	'when printing regexps, ': {
		'specifically /(\\d+)/': {
			topic: function () {
				return clj.stringify(/(\d+)/);
			},

			'we get \'#"(\\d+)"\'': function (topic) {
				assert.equal(topic, '#"(\\d+)"');
			}
		}
	},

	'when printing arrays, ': {
		'specifically [1, 2, 3]': {
			topic: function () {
				return clj.stringify([1, 2, 3]);
			},

			'we get "[1 2 3]"': function (topic) {
				assert.equal(topic, '[1 2 3]');
			}
		}
	},

	'when printing objects, ': {
		'specifically { a: "b" }': {
			topic: function () {
				return clj.stringify({ a: "b" });
			},

			'we get {"a" "b"}': function (topic) {
				assert.equal(topic, '{"a" "b"}');
			}
		},

		'specifically { a: "b" } with keys_are_keywords on': {
			topic: function () {
				return clj.stringify({ a: "b" }, { keys_are_keywords: true });
			},

			'we get {"a" "b"}': function (topic) {
				assert.equal(topic, '{:a "b"}');
			}
		}
	}
}).export(module);
