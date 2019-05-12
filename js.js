//A program to convert phone numbers to a combination of English words (when possible) - 697-466-3686 could become MYPHONENUM; 724-6837 could become PAINTER
//Computation time may be the biggest challenge - if both numbers AND the corresponding letters are checked, a 10-digit phone number could result in over 1 million combinations, each to be checked against a dictionary of over 50,000 words...
//Some numbers will have multiple results, others will have none.  Since no letters correspond to the 0 or 1 keys, those numbers can't be converted to letters.

const FULLLIST = new Set();
const LETTERS = [["0"],["1"],["A","B","C"],["D","E","F"],["G","H","I"],["J","K","L"],["M","N","O"],["P","Q","R","S"],["T","U","V"],["W","X","Y","Z"]];

function listen() {
    document.getElementById("letterInput").addEventListener("submit", getText, false);
    document.getElementById("numberInput").addEventListener("submit", getPhoneNumber, false);
}

function getText(event) {
    event.preventDefault();
    let text = document.getElementById("letterInput").getElementsByTagName("input")[0].value;
    text = text.toLocaleUpperCase().replace(/[^A-Z0-9]/g,'');
    let number = textToNum(text);
    document.getElementById("putTextHere").innerHTML = `The phone number associated with the text you entered is: ${number}`;
}

function textToNum(text) {
    returnNumber = "";
    for (let character of text) {
        if (!isNaN(character)) {
            returnNumber += character;
        }
        else {
            for (let pointer = 2; pointer < LETTERS.length; pointer++) {
                if (LETTERS[pointer].indexOf(character) !== -1) {
                    returnNumber += pointer;
                    break;
                }
            }
        }
    }
    return returnNumber;
}

function getPhoneNumber(event) {
    event.preventDefault();
    let phoneNumber = document.getElementById("numberInput").getElementsByTagName("input")[0].value;
    phoneNumber = phoneNumber.replace(/\D/g,'');
    if (phoneNumber.length > 0) {
        document.getElementById("numberInput").getElementsByTagName("input")[0].placeholder = phoneNumber;
        document.getElementById("putTextHere").innerHTML = `The numerals you entered were: ${phoneNumber}`;
        let fourKeys = phoneNumber.match(/[234568]/g) ? phoneNumber.match(/[234568]/g).length : 0; // 3 letters + number
        let fiveKeys = phoneNumber.match(/[79]/g) ? phoneNumber.match(/[79]/g).length : 0;  // 4 letters + number
        let combinations = 4**fourKeys*5**fiveKeys;
        document.getElementById("putTextHere").innerHTML += `<br>Checking ${combinations} possible combinations...<br>`;

//        ADD CONTROL HERE IN FUTURE TO CONFIRM GOING AHEAD WITH CALCULATIONS FOR NUMERALS ENTERED.
//        ONCE CALCULATIONS BEGIN, LOCK SUBMIT BUTTON UNTIL CALCS COMPLETE?

        loadDictionary(phoneNumber);
    }
    else {
        document.getElementById("putTextHere").innerHTML = "The information which you entered did not contain any numerals";
    }
    document.getElementById("numberInput").getElementsByTagName("input")[0].value = "";
}

// for speed, MAY consider loading the dictionary as page loads rather than after phone number entered
// MAY add more dictionaries in future - slang, vulgar words, proper names...
function loadDictionary(phoneNumber) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const dictionary = this.responseText.split(',').sort(); // word list may be unsorted; search efficiency demands sorted list
            const words = splitDictionary(dictionary);
            const possibles = createPossibilities(phoneNumber);
            let matches = findWordMatches(phoneNumber,possibles,words);
            compileCombinations(matches,phoneNumber);
            let sortedList = FULLLIST.size > 0 ? tripleSort() : [];
            let maxResults = 100; // Make this user-defined?
            document.getElementById("putTextHere").innerHTML += sortedList.length > 0 ? `<br>Your results:<br>` : `<br>We found no results.<br>`;
            document.getElementById("loader").style.display = "none";
            for (let oneResult of sortedList.slice(0,maxResults)) {
                let aResult = `<nobr class='oneResult'>`;
                for (let letter of oneResult) {
//                    aResult += `<span>${letter}</span>`;
                    letter = letter === "-" ? "dash" : letter;
                    aResult += `<img src="images/${letter}.jpg">`
                }
                aResult += `</nobr> `
                document.getElementById("putTextHere").innerHTML += aResult;
            }
        }
    };
    xhttp.open("GET", "words.txt", true);  // BEWARE OF CORS ISSUES
    document.getElementById("loader").style.display = "block";
    xhttp.send();
}


function splitDictionary(dictionary) {
    //    seed list of words with empty array for 0, letters of alphabet for 1, and empty arrays for 2 through 10
    const words = [[],['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],[],[],[],[],[],[],[],[],[]];
    for (let word of dictionary) {
        if (word.length < 11) { // for now, only test against words of 10 or fewer letters
            words[word.length].push(word.toUpperCase());
        }
    }
    return words;
}


function createPossibilities(phoneNumber) {
    let possibles = [""];
    for (let digit of phoneNumber) {
        let newPossibilities = [];
        for (let possible of possibles) {
            for (let onelet of LETTERS[parseInt(digit)]) {
                newPossibilities.push(possible+onelet);
            }
        }
        possibles = [...newPossibilities];
    }
    return possibles;
}


function findWordMatches(phoneNumber,possibles,words) {
//    step through each possible combination, starting with longest words
    let matches = new Set();
    for (let possible of possibles) {
        for (let x=0; x<possible.length; x++) {
            if (possible[x] === "A" || possible[x] === "I") {
                // concatenating start and end index to word (instead of creating array) so that Set can be used to eliminate duplicates
                matches.add(x + possible[x] + x);
            }
        }
    }
    for (let shortener = 0; shortener < phoneNumber.length - 1; shortener++) {
        for (let possible of possibles) {
            for (let pointer = 0; pointer <= shortener; pointer++) {
                wordLen = possible.length-shortener;
// !!!!!!!!!! ****************** ###################               NOTE!!!!: LINE BELOW BREAKS IF PHONE NUMBER LONGER THAN 10 DIGITS IS ENTERED...
                if (sortedFind(possible.substring(pointer, wordLen+pointer), words[wordLen])) {
                    // concatenating start and end index to word (instead of creating array) so that Set can be used to eliminate duplicates
                    matches.add(pointer + possible.substring(pointer, wordLen+pointer) + (wordLen + pointer - 1));
                }
            }
        }
    }
    let returnArray = [];
    for (let match of matches) {
        // extracting arrays from set
        returnArray.push([Number(match.match(/^[0-9]+/)[0]),match.match(/[A-Z]+/)[0],Number(match.match(/[0-9]+$/)[0])]);
    }
    return returnArray;
}


function sortedFind(word, sortedList) {
    let startPoint = 0;
    let endPoint = sortedList.length;
    while (startPoint < endPoint) {
        let midPoint = Math.floor((endPoint-startPoint)/2) + startPoint;
        if (sortedList[midPoint] === word) {
            return true;
        }
        if (word > sortedList[midPoint]) {
            startPoint = midPoint + 1;
        }
        else {
            endPoint = midPoint;
        }
    }
    return false;
}

function compileCombinations(matches,phoneNumber) {
    FULLLIST.clear(); // empty the set in case more than one number has been entered
    for (let match of matches) {
        FULLLIST.add((`${phoneNumber.substring(0,match[0])}-${match[1]}-${phoneNumber.substring(match[2]+1)}`).replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-'));
        addToWord(match, matches, phoneNumber);
    }
}

function addToWord(item, matches, phoneNumber) {
    if (item[2] <= phoneNumber.length - 1) {
        for (let match of matches) {
            if ((match[0] > item[2]) && (match[2] < phoneNumber.length)) {
                FULLLIST.add((`${phoneNumber.substring(0,item[0])}-${item[1]}-${phoneNumber.substring(item[2]+1,match[0])}-${match[1]}-${phoneNumber.substring(match[2]+1)}`).replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-'));
                let recursiveCheck = [item[0],(`${item[1]}-${phoneNumber.substring(item[2]+1,match[0])}-${match[1]}`).replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-'),match[2]];
                addToWord(recursiveCheck, matches, phoneNumber);
            }
        }
    }
}

// sort by (1) most letters found; (2) fewest dashes; (3) alphabetically
// ??? REPLACING ALL 2s WITH A's AND ALL 4s WITH I's; DO I WANT TO DO THAT?  ADD RATHER THAN REPLACE?
function tripleSort() {
    let finalList = [...FULLLIST];
//    let returnSort = [finalList.pop().replace(/2/g,"-A-").replace(/4/g,"-I-").replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-')];
    let returnSort = [finalList.pop().replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-')];
    for (let item of finalList) {
//        item = item.replace(/2/g,"-A-").replace(/4/g,"-I-").replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-');
        item = item.replace(/^\-+|\-+$/g,'').replace(/\-\-/g,'-');
        let dashLength = item.match(/\-/g) ? item.match(/\-/g).length : 0,
            letterLength = item.match(/[A-Z]/g).length,
            found = false;
        for (let x=0; x<returnSort.length; x++) {
            let itemDashLength = returnSort[x].match(/\-/g) ? returnSort[x].match(/\-/g).length : 0;
            if (letterLength > returnSort[x].match(/[A-Z]/g).length ||
                (letterLength === returnSort[x].match(/[A-Z]/g).length && dashLength < itemDashLength) ||
                (letterLength === returnSort[x].match(/[A-Z]/g).length && dashLength === itemDashLength && returnSort[x] > item)) {
                found = true;
                returnSort = returnSort.slice(0,x).concat(item).concat(returnSort.slice(x));
                break;
            }
        }
        if (!found) {
            returnSort.push(item);
        }
    }
    return returnSort;
}

window.addEventListener('load', () => {
    listen();
})


