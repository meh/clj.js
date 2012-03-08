var vows   = require('vows'),
    assert = require('assert'),
		clj    = require('../clj.js');

vows.describe('Clojure Reader').addBatch({
	'when reading true': {
		topic: function () {
			return clj.parse('true');
		},

		'we get true': function (topic) {
			assert.isTrue(topic);
		}
	},

	'when reading false': {
		topic: function () {
			return clj.parse('false');
		},

		'we get false': function (topic) {
			assert.isFalse(topic);
		}
	},

	'when reading nil': {
		topic: function () {
			return clj.parse('nil');
		},

		'we get null': function (topic) {
			assert.equal(topic, null);
		}
	},

	'when reading numbers, ': {
		'specifically 2': {
			topic: function () {
				return clj.parse('2');
			},

			'we get 2': function (topic) {
				assert.equal(topic, 2);
			}
		},

		'specifically 1337': {
			topic: function () {
				return clj.parse('1337');
			},

			'we get 1337': function (topic) {
				assert.equal(topic, 1337);
			}
		},

		'specifically 16rff': {
			topic: function () {
				return clj.parse('16rff');
			},

			'we get 255': function (topic) {
				assert.equal(topic, 255);
			}
		},

		'specifically 2r11': {
			topic: function () {
				return clj.parse('2r11');
			},

			'we get 3': function (topic) {
				assert.equal(topic, 3);
			}
		},

		'specifically 2.3': {
			topic: function () {
				return clj.parse('2.3');
			},

			'we get 2.3': function (topic) {
				assert.equal(topic, 2.3);
			}
		},

		'specifically 2e3': {
			topic: function () {
				return clj.parse('2e3');
			},

			'we get 2000': function (topic) {
				assert.equal(topic, 2000);
			}
		}
	},

	'when reading strings, ': {
		'specifically "lol"': {
			topic: function () {
				return clj.parse('"lol"');
			},

			'we get "lol"': function (topic) {
				assert.equal(topic, "lol");
			}
		},

		'specifically "lol\\nlol"': {
			topic: function () {
				return clj.parse('"lol\\nlol"');
			},

			'we get "lol\\nlol"': function (topic) {
				assert.equal(topic, "lol\nlol");
			}
		},

		'specifically "\\u4343"': {
			topic: function () {
				return clj.parse('"\\u4343"');
			},

			'we get "\\u43443"': function (topic) {
				assert.equal(topic, "\u4343");
			}
		}
	},

	'when reading symbols, ': {
		'specifically ni': {
			topic: function () {
				return clj.parse('ni');
			},

			'we get ni': function (topic) {
				assert.equal(topic.type, "symbol");
				assert.equal(topic, 'ni');
			}
		}
	},

	'when reading keywords, ': {
		'specifically :wat': {
			topic: function () {
				return clj.parse(':wat');
			},

			'we get :wat': function (topic) {
				assert.equal(topic.type, "keyword");
				assert.equal(topic, 'wat');
			}
		}
	},

	'when reading regexps, ': {
		'specifically #"(\\d+)"': {
			topic: function () {
				return clj.parse('#"(\\d+)"');
			},

			'we get /(\\d+)/': function (topic) {
				assert.equal(topic.toString(), /(\d+)/.toString());
			}
		}
	},

	'when reading instants, ': {
		'specifically #inst "2012-02-03T15:20:59+01:00"': {
			topic: function () {
				return clj.parse('#inst "2012-02-03T15:20:59+01:00"');
			},

			'we get the proper Date object': function (topic) {
				assert.equal(topic.toString(), new Date(1328278859000).toString());
			}
		}
	},

	'when reading vectors, ': {
		'specifically []': {
			topic: function () {
				return clj.parse('[]');
			},

			'we get []': function (topic) {
				assert.deepEqual(topic, clj.vector());
			}
		},

		'specifically [[]]': {
			topic: function () {
				return clj.parse('[[]]');
			},

			'we get [[]]': function (topic) {
				assert.deepEqual(topic, clj.vector(clj.vector()));
			}
		},

		'specifically [[] [] []]': {
			topic: function () {
				return clj.parse('[[] [] []]');
			},

			'we get [[], [], []]': function (topic) {
				assert.deepEqual(topic, clj.vector(clj.vector(), clj.vector(), clj.vector()));
			}
		},

		'specifically [1 2 3]': {
			topic: function () {
				return clj.parse('[1 2 3]');
			},

			'we get [1, 2, 3]': function (topic) {
				assert.deepEqual(topic, clj.vector(1, 2, 3));
			}
		},

		'specifically [23[]]': {
			topic: function () {
				return clj.parse('[23[]]');
			},

			'we get [23, []]': function (topic) {
				assert.deepEqual(topic, clj.vector(23, clj.vector()));
			}
		}
	},

	'when reading lists, ': {
		'specifically ()': {
			topic: function () {
				return clj.parse('()');
			},

			'we get []': function (topic) {
				assert.deepEqual(topic, clj.list());
			}
		},

		'specifically (())': {
			topic: function () {
				return clj.parse('(())');
			},

			'we get [[]]': function (topic) {
				assert.deepEqual(topic, clj.list(clj.list()));
			}
		},

		'specifically (() () ())': {
			topic: function () {
				return clj.parse('(() () ())');
			},

			'we get [[], [], []]': function (topic) {
				assert.deepEqual(topic, clj.list(clj.list(), clj.list(), clj.list()));
			}
		},

		'specifically (1 2 3)': {
			topic: function () {
				return clj.parse('(1 2 3)');
			},

			'we get [1, 2, 3]': function (topic) {
				assert.deepEqual(topic, clj.list(1, 2, 3));
			}
		},

		'specifically (23())': {
			topic: function () {
				return clj.parse('(23())');
			},

			'we get [23, []]': function (topic) {
				assert.deepEqual(topic, clj.list(23, clj.list()));
			}
		}
	},

	'when reading sets, ': {
		'specifically #{1 2 3}': {
			topic: function () {
				return clj.parse('#{1 2 3}');
			},

			'we get [1, 2, 3]': function (topic) {
				assert.deepEqual(topic, clj.set(1, 2, 3));
			}
		},

		'specifically #{1 1}': {
			'we get an exception': function () {
				assert.throws(function () { clj.parse('#{1 1}') }, SyntaxError);
			}
		}
	},

	'when reading maps, ': {
		'specifically {:a "b"}': {
			topic: function () {
				return clj.parse('{:a "b"}');
			},

			'we get { a: "b" }': function (topic) {
				assert.deepEqual(topic, { a: "b" });
			}
		}
	}
}).export(module);
