function sum(a, b) {
    if(typeof a === "number" && typeof b === 'number'){
        return a + b;
    }

    throw TypeError('wrong type');
}

module.exports = sum;
