function sum(a, b) {
    return a + b;
}

function isPalindrome(str) {
    str = str.toLowerCase();
    let reverseStr = str.split('').reverse().join('').toLowerCase();
    if (str === reverseStr) {
        return true;
    }
    return false;
}

function isStrongPassword(password) {
    let hasLetter = /[A-Za-z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasSpecialChar = /[!@#$]/.test(password);

    return password.length >= 16 && hasLetter && hasNumber && hasSpecialChar;
}

function lengthOfSentence(sentence) {
    return sentence.trim().split(' ').length;
}

// 14. Longest Common Prefix
function longestCommonPrefix(str) {
    let prefix = str[0];

    for (let i = 1; i < str.length; i++) {
        while (str[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") {
                return "";
            }
        }
    }
    return prefix;
}

// 58. Length of Last Word
function lengthOfLastWord(sentence) {
    let words = sentence.trim().split(' ');
    return words[words.length - 1].length;
}

// 70. Climbing Stairs
function climbingStairs(n) {
    if (n <= 2){
        return n;
    }
    let first = 1, second = 2;
    for (let i = 3; i <= n; i++) {
        let third = first + second;
        first = second;
        second = third;
    }
    return second;
}

// 83. Remove Duplicates from Sorted List
function removeDuplicates(head) {
    let current = head;
    while (current && current.next) {
        if (current.val === current.next.val) {
            current.next = current.next.next;
        }
        else {
            current = current.next;
        }
    }
    return head;
}

// Helper function to create a linked list from an array
function createLinkedList(arr) {
    if (arr.length === 0) {
        return null;
    }
    let head = { val: arr[0], next: null };
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = { val: arr[i], next: null };
        current = current.next;
    }
    return head;
}

// Helper function to convert a linked list to an array
function linkedListToArray(head) {
    let result = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

// 111. Minimum Depth of Binary Tree
function minDepth(root) {
    if (root === null) {
        return 0;
    }
    if (root.left === null && root.right === null) {
        return 1;
    }
    if (root.left === null) {
        return minDepth(root.right) + 1;
    }
    if (root.right === null) {
        return minDepth(root.left) + 1; 
    }
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}

// Helper function to create a binary tree from an array
function createBinaryTree(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  if (arr[0] == null){
    return null;
  }

  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1; 

  while (i < arr.length) {
    const current = queue.shift(); 

    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal != null) {
        current.left = { val: leftVal, left: null, right: null };
        queue.push(current.left);
      }
    }

    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal != null) {
        current.right = { val: rightVal, left: null, right: null };
        queue.push(current.right);
      }
    }
  }

  return root;
}

module.exports = 
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
};