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

function loadDictionary(phoneNumber) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const dictionary = this.responseText.split(',');
            buildWordList(phoneNumber, dictionary);
        }
    };
    xhttp.open("GET", "words.txt", true);
    xhttp.send();
}


function buildWordList(phoneNumber, dictionary) {
    //    seed list of words with empty array for 0, letters of alphabet for 1, and empty arrays for 2 through 10
    const words = [[],['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],[],[],[],[],[],[],[],[],[]];
}



//function handler() {
//    if(this.status == 200 &&
//       this.responseXML != null) {
//        // success!
//        alert("Success!");
////        processData(this.responseXML.getElementById('test').textContent);
//    } else {
//        alert("Failure");
//        // something went wrong
//    }
//}
//
//let client = new XMLHttpRequest();
//client.onload = handler;
//client.open("GET", "words.txt");
//client.send();


//dawords = readTextFile("words.txt");
//console.log(dawords);
listen();
