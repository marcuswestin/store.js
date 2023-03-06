/* eslint semi: "off", no-unused-vars: "off" */

var store = require('../..');
const set = (key, value) => store.set(key, value); 
const get = key => store.get(key);

const totalElements = 100

// We are going to insert 100 elements
for (var index = 0; index < totalElements; index++) {
	store.set('k_'+index, index)
}

// We are going to iterate all elements, and we expect to find 100.
// After finding a element we are going to remove the element.
var found_elements = [];
store.each(function(val, key) {
	if(key.indexOf("k_") === 0){
		store.remove(key);
		found_elements.push(key);
	}
});
assert(found_elements.length === totalElements)
