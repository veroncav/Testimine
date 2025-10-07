let { 
    hello, 
    doubleNumber, 
    average, 
    joinWords,
    repeatWord
} = require('../src/simpleAsync');

describe("Hello", () => {
    test("hello function", async () => {
        let text = await hello("World");
        expect(text).toBe("Hello, World!");
    });
    test("Hello function with empty string", () => {
        expect(hello("")).resolves.toBe("Hello, !");
    });
});

describe("doubleNumber", () => {
    test("doubleNumber function", async () => {
        let result = await doubleNumber(5);
        expect(result).toBe(10);
    });
});

describe("average", () => {
    test("average of  numbers", async () => {
        const result = await average([1, 2, 3, 4, 5]);
        expect(result).toBe(3);
    });
});

describe("joinWords", () => {
    test("joinWords function", async () => {
        const result = await joinWords(["Hello", "World"]);
        expect(result).toBe("Hello World");
    });
});

describe("repeatWord", () => {
    test("repeatWord function", async () => {
        const result = await repeatWord("Hello", 3);
        expect(result).toBe("Hello Hello Hello");
    });
});