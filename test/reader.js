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
				assert.isTrue(topic.symbol);
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
				assert.isTrue(topic.keyword);
				assert.equal(topic, 'wat');
			}
		}
	}
}).run();
