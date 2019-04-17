//A program to convert phone numbers to a combination of English words (when possible) - 697-466-3686 could become MYPHONENUM; 724-6837 could become PAINTER
//Computation time may be the biggest challenge - if both numbers AND the corresponding letters are checked, a 10-digit phone number could result in over 1 million combinations, each to be checked against a dictionary of over 50,000 words...
//Some numbers will have multiple results, others will have none.  Since no letters correspond to the 0 or 1 keys, those numbers can't be converted to letters.

function listen() {
    document.getElementById("numberInput").addEventListener("submit", getPhoneNumber, false);
}

function getPhoneNumber(event) {
    event.preventDefault();
    let phoneNumber = document.getElementById("numberInput").getElementsByTagName("input")[0].value;
    phoneNumber = phoneNumber.replace(/\D/g,'');
    if (phoneNumber.length > 0) {
        document.getElementById("numberInput").getElementsByTagName("input")[0].placeholder = phoneNumber;
        document.getElementById("putTextHere").innerHTML = `The numerals you entered were: ${phoneNumber}`;

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
// MAY add dictionaries in future - slang, vulgar words, proper names...
function loadDictionary(phoneNumber) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const dictionary = this.responseText.split(',').sort(); // word list may be unsorted; search efficiency demands sorted list
            const words = splitDictionary(dictionary);
            const possibles = createPossibilities(phoneNumber);
            let threeKeys = phoneNumber.match(/[234568]/g) ? phoneNumber.match(/[234568]/g).length : 1;
            let fourKeys = phoneNumber.match(/[79]/g) ? phoneNumber.match(/[79]/g).length : 1;
            let combinations = 3**threeKeys*4**fourKeys;
            document.getElementById("putTextHere").innerHTML += `<br>Checking ${combinations} possible combinations...`;
            let matches = findWordMatches(phoneNumber,possibles,words);
            console.log(matches);
        }
    };
    xhttp.open("GET", "words.txt", true);
    xhttp.send();
}


function splitDictionary(dictionary) {
    //    seed list of words with empty array for 0, letters of alphabet for 1, and empty arrays for 2 through 10
    const words = [[],['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],[],[],[],[],[],[],[],[],[]];
    for (let word of dictionary) {
        if (word.length > 1 && word.length < 11) { // for now, only test against words of 10 or fewer letters
            words[word.length].push(word.toUpperCase());
        }
    }
    return words;
}


function createPossibilities(phoneNumber) {
    let possibles = [""],
        letters = [["0"],["1"],["A","B","C"],["D","E","F"],["G","H","I"],["J","K","L"],["M","N","O"],["P","Q","R","S"],["T","U","V"],["W","X","Y","Z"]];
    for (let digit of phoneNumber) {
        let newPossibilities = [];
        for (let possible of possibles) {
            for (let onelet of letters[parseInt(digit)]) {
                newPossibilities.push(possible+onelet);
            }
        }
        possibles = [...newPossibilities];
    }
    return possibles;
}


function findWordMatches(phoneNumber,possibles,words) {
//    step through each possible combination, starting with longest words
    let matches = new Set();  // ********** NOTE!!!   Need alternative to set, as set is trying to match memory location, not content of array (yielding duplicates)
    for (let shortener = 0; shortener < phoneNumber.length - 1; shortener++) {
        for (let possible of possibles) {
            for (let pointer = 0; pointer <= shortener; pointer++) {
                wordLen = possible.length-shortener;
                if (sortedFind(possible.substring(pointer, wordLen+pointer), words[wordLen])) {
                    matches.add([pointer,wordLen+pointer-1,possible.substring(pointer, wordLen+pointer)])
                }
            }
        }
    }
    return matches;
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



listen();

