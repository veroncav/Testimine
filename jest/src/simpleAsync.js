async function hello(name) {
    return `Hello, ${name}!`;
}

async function doubleNumber(n) {
    return n * 2;
}

async function average(nums) {
    if (nums.length === 0) 
        return 0;
    const calculateAverage = array => array.reduce((a, b) => a + b) / array.length;
    return calculateAverage(nums);
}

async function joinWords(words) {
    return words.join(' ');
}

async function repeatWord(word, times) {
    return Array(times).fill(word).join(' ');
}

module.exports = 
{ 
    hello, 
    doubleNumber, 
    average, 
    joinWords, 
    repeatWord 
};