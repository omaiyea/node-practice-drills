//express is a web frameowrk used for node, gives a lot of functionality of a web server, reads/responds to HTTP requests

//to use express, need to require the package
const express = require('express'); 

//express module exports a top-level function, which creates a new app object that encapsulates the functionality of your express server
//invoke express function to create the application 
const app = express();

/******* 
 * practice drill 1: create a route handler function on the path /sum
 * should accept query parameters a and ba nd find their sum 
 ********/

app.get('/sum', (req, res) => {
    //req.query gets the query parameters as an object
    const a = req.query.a; 
    const b = req.query.b;

    //validate that the right query parameters are included
    if(!a || isNaN(a)){
        return(res.status(400).send('Please provide a numeric value for a'));
    }
    if(!b || isNaN(b)){
        return(res.status(400).send('Please provide a numeric value for b'));
    }

    //if both values are there and numbers, then display a message of the sum
    const message = `The sum of ${a} and ${b} is ${Number(a)+Number(b)}`;

    //send the response
    res.send(message);
});

/******* 
 * endpoint = /cipher 
 * should accept query parameter named text and one named shift 
 * and shift each character in the cipher by the number of the shift
 ********/

app.get('/cipher', (req, res) => {
    //get query parametrs
    let cipher = req.query.cipher;
    let shift = req.query.shift;

    //validation
    const letters = /^[A-Za-z]+$/;
    if(!cipher || !cipher.match(letters)){
        return(res.status(400).send('Please provide cipher text, using letters only'));
    }
    if(!shift || isNaN(shift)){
        return(res.status(400).send('Please enter a number for the shift'));
    }else{
        shift = Number(shift);
    }

    //do a caesar cipher
    let caesarCipher = '';
    let caesarCharCode = 0;
    for (let letter of cipher){
        let origCharCode = letter.charCodeAt(0);
        if(origCharCode + shift > 122){ //need to readjust charcode to only use letters
            caesarCharCode = origCharCode + shift - 26; // since there's 26 letters in alphabet
        }else{
            caesarCharCode = origCharCode + shift;
        }

        caesarCipher += String.fromCharCode(caesarCharCode);
    }
    //send the response
    res.send(caesarCipher);
});

// server needs to listen to a specific port (ex. 8000) so that requests to that port are correctly routed to the server
app.listen(8000, () => {
    console.log('express server is listening on port 8000!');
});