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
        document.getElementById("putTextHere").innerHTML = `The numerals you entered were: ${phoneNumber}`;
    }
    else {
        document.getElementById("putTextHere").innerHTML = "The information which you entered did not contain any numerals";
    }
    document.getElementById("numberInput").getElementsByTagName("input")[0].value = "";
    document.getElementById("numberInput").getElementsByTagName("input")[0].placeholder = phoneNumber;
}

listen();
