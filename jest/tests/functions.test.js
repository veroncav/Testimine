let 
{
    sum, 
    isPalindrome, 
    isStrongPassword, 
    lengthOfSentence,
    lengthOfLastWord,
    climbingStairs,
    longestCommonPrefix,
    createLinkedList,
    linkedListToArray,
    removeDuplicates,
    minDepth,
    createBinaryTree
} 
= require('../src/functions');

describe("sum function", () => {
    test("sum two numbers", () => {
        expect(sum(2, 2)).toBe(4);
    });

    test("work with null", () => {
        expect(sum(0, 0)).toBe(0);
    });
});

// toBeGreaterThan, toBeLessThan, toBeGreaterThanOrEqual, toBeLessThanOrEqual

describe("check if string is palindrome", () => {
    let strArray = ['Anna', 'civic', 'kayak', 'level', 'madam', 'mom', 'noon', 'radar'];
    strArray.forEach(element => {
        test(`${element}" is palindrome`, () => {
            expect(isPalindrome(element)).toBe(true);
        });
    });
})

describe("is strong password", () => {
    let passArray = 
    [
        'Abcd1234!@#$%^&*()', 
        'StrongPassw0rd!@#$', 
        'MyP@ssw0rdIsVery$trong123', 
        'This1sAV3ry$trongP@ssw0rd'
    ];
    passArray.forEach(element => {
        test(`${element} is strong password`, () => {
            expect(isStrongPassword(element)).toBe(true);
        });
    });
});

describe("is weak password", () => {
    let passArray = 
    [
        'Maria', 
        'Qwerty12'
    ];
    passArray.forEach(element => {
        test(`${element} is weak password`, () => {
            expect(isStrongPassword(element)).toBe(false);
        });
    });
});

describe("length of sentence", () => {
    let strArray = [
        ["Hello world this is Jest", 5],
        ["I love coding", 3],
        ["JavaScript is a versatile language used for web development", 9],
        ["Testing is essential for software quality", 6]
    ];
    strArray.forEach((elem) => {
        test(`"${elem[0]}" has ${elem[1]} words`, () => {
            expect(lengthOfSentence(elem[0])).toBe(elem[1]);
        });
    });
});

// 14. Longest Common Prefix
describe("longest common prefix", () => {
    let strArray = [
        [["flower","flow","flight"], "fl"],
        [["abcdef","abcxyz","abc123"], "abc"],
        [["a"], "a"],
        [["dog"], "dog"],
        [["dog","racecar","car"], ""]
    ];
    strArray.forEach(([input, expected]) => {
        test(`Input: [${input}] - Common prefix: "${expected}"`, () => {
            expect(longestCommonPrefix(input)).toBe(expected);
        });
    });
});

// 58. Length of Last Word
describe("length of last word", () => {
    let strArray = [
        ["Hello world", 5],
        ["I love coding", 6],
        ["JavaScript is fun", 3],
        ["Testing is essential", 9]
    ];
    strArray.forEach((elem) => {
        test(`Last word in "${elem[0]}" has ${elem[1]} letters`, () => {
            expect(lengthOfLastWord(elem[0])).toBe(elem[1]);
        });
    });
});

// 70. Climbing Stairs
describe("climbing stairs", () => {
    let numArray = [
        [2, 2],
        [3, 3],
        [4, 5],
        [5, 8],
        [6, 13],
        [7, 21]
    ];
    numArray.forEach((elem) => {
        test(`There are ${elem[1]} ways to climb ${elem[0]} stairs to the top`, () => {
            expect(climbingStairs(elem[0])).toBe(elem[1]);
        });
    });
});

// 83. Remove Duplicates from Sorted Array
describe("remove duplicates from sorted list", () => {
   let numArray = [
    [[1,1,2], [1,2]],
    [[1,1,2,3,3], [1,2,3]],
    [[], []],
    [[1], [1]],
    [[1,1,1,1], [1]],
    [[-1,-1,0,0,0,1,2,2], [-1,0,1,2]],
  ];
  numArray.forEach(([input, expected]) => {
    test(`Input: [${input}] - List with removed duplicates: [${expected}]`, () => {
        let linkedList = createLinkedList(input);
        let result = removeDuplicates(linkedList);
        expect(linkedListToArray(result)).toEqual(expected);
    });
  }); 
});

// 111. Minimum Depth of Binary Tree
describe("minimum depth of binary tree", () => {
    let treeArray = [
        [[], 0],                        
        [[3,9,20,null,null,15,7], 2],   
        [[2,null,3,null,4,null,5,null,6], 5], 
        [[1], 1],                        
        [[1,2], 2],                        
        [[3,9,20,null,null,15,7], 2],     
        [[1,2,3,4,5], 2]                  
    ];
    treeArray.forEach(([input, expected]) => {
        test(`Tree [${input}] has minimum depth ${expected}`, () => {
            let tree = createBinaryTree(input);
            expect(minDepth(tree)).toBe(expected);
        });
    });
});