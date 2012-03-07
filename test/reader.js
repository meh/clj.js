var vows   = require('vows'),
    assert = require('assert'),
		clj    = require('../clj.js');

vows.describe('Clojure Reader').addBatch({
	'when reading nil': {
		topic: function () {
			return clj.parse('nil');
		},

		'we get null': function (topic) {
			assert.equal(topic, null);
		}
	}
}).run();
