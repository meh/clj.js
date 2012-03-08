clj.js - parse/dump Clojure like you'd do with JSON
===================================================

This library gives you access to few functions to deal with Clojure sexps.

When used in the browser there will be a global variable called Clojure with the usable functions,
on node you have to require `'clj'`.

Helpers
-------
A set of functions is dedicated to create objects present in Clojure but not present in JavaScript.

* `.symbol(string)` -> this creates a `String` object set as symbol.
* `.keyword(string)` -> this creates a `String` object set as keyword.
* `.vector(...)` -> this creates an `Array` object set as vector. You can either pass a normal array or the elements of the vector.
* `.list(...)` -> this creates an `Array` object set as list. You can either pass a normal array or the elements of the list.
* `.set(...)` -> this creates an `Array` object set as set. You can either pass a normal array or the elements of the set. The function checks for uniqueness of the elements.
* `.rational(...)` -> this creates a `Rational` object. You can either pass a string with the rational or numerator and denominator.

Another set of functions is dedicated to checking wether an object is a specific Clojure object.

* `.is_symbol(obj)`
* `.is_keyword(obj)`
* `.is_list(obj)`
* `.is_set(obj)`
* `.is_vector(obj)`
* `.is_rational(obj)`

Printing - `stringify`
----------------------
`stringify(object, options)` transforms the passed object to Clojure sexps.

The available options are:
* `keys_are_keywords`, when set to true the keys of objects that are strings will automatically be transformed in keywords.

Reading - `parse`
-----------------
`parse(string, options)` transforms a string with Clojure sexps to JavaScript objects.

Currently there are no options, it's just reserved for future uses.
