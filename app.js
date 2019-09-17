//express is a web frameowrk used for node, gives a lot of functionality of a web server, reads/responds to HTTP requests

//to use express, need to require the package
const express = require('express'); 

//morgan logs details of a request
const morgan = require('morgan');

const playstore = require('./playstore.js');

//express module exports a top-level function, which creates a new app object that encapsulates the functionality of your express server
//invoke express function to create the application 
const app = express();

/************************ checkpoint 3 *****************/
/******* 
 * practice drill 1: create a route handler function on the path /sum
 * should accept query parameters a and ba nd find their sum 
********/

app.get('/sum', (req, res) => {
    //req.query gets the query parameters as an object
    const a = req.query.a; 
    const b = req.query.b;

    //validate that the right query parameters are included
    //400 error means that the request was not done properly by the client and the server can't satisfy the request
    if(!a || isNaN(a)){
        return(res.status(400).send('Please provide a numeric value for a'));
    }
    if(!b || isNaN(b)){
        return(res.status(400).send('Please provide a numeric value for b'));
    }

    //if both values are there and numbers, then display a message of the sum
    const message = `The sum of ${a} and ${b} is ${Number(a)+Number(b)}`;

    //send the response
    res.status(200).send(message);
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
    res.status(200).send(caesarCipher);
});

/******* 
 * pracetice drill 3 - endpoint = /lotto
 * endpoint accepts an array of 6 distict numbers between 1 and 20 named numbers (in query parameter, repeat string with the diff values)
 * function randomly generates 6 numbers between 1 and 20
 * determine how many numbers match between function outputs and query parameters
 ********/

app.get('/lotto', (req, res) => {
    let message = '';
    let userArray = req.query.numbers;
    //generate 6 random numbers between 1 and 20 
    const funcArray = Array.from({length: 6}, () => Math.floor(Math.random() * 20) + 1);

    //make sure array has 6 numbers, convert strings to nums if so
    if(userArray.length !== 6 || userArray.some(isNaN)){
        return(res.status(400).send('Please send 6 numeric values.'));
    }else{
        userArray = userArray.map(Number);
    }
    //make sure array values are distinct numbers and between 1 and 20
    userArray.sort();

    for(let i = 0; i < userArray.length; i++){
        if(userArray[i] > 20 || userArray[i] < 1){
            return(res.status(400).send('Please send a numeric value between 1 and 20.'));
        }
        if(userArray[i] === userArray[i+1]){
            return(res.status(400).send('Please send 6 numeric values without duplicates.'));
        }
        
    }

    //compare user values with randomly generated values
    let matches = 0;
    for(let userNum of userArray){
        for(let funcNum of funcArray){
            if(userNum === funcNum){
                matches++;
            }
        }
    }

    if(matches < 4){
        message = "Sorry, you lose";
    }else if(matches === 4){
        message = "Congratulations, you win a free ticket";
    }else if(matches === 5){
        message = "Congratulations! You win $100!";
    }else if(matches === 6){
        message = "Wow! Unbelievable! You could have won the mega millions!";
    }

    console.log(userArray);
    console.log(funcArray);

    res.send(message);
});

/****** checkpoint  4 assignment *******/
//return all apps in the playstore by default
//optionally allow users to sort results by rating or app, and filter by genre one of ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']	
app.get('/apps', (req, res) => {
    //these query parameters aren't required, so if not provided, can default to "" 
    const { genre = "", sort = "" } = req.query;

    if(!['', 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)){
        return res.status(400).send(`Genre must be one of ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']`);
    }

    if(!['', 'Rating', 'App'].includes(sort)){
        return res.status(400).send(`Sort must be one of ['Rating', 'App']`);
    }
    
    let results = playstore.filter(playstoreApp => playstoreApp.Genres.includes(genre));
    
    if(sort === 'Rating'){
        results.sort((a, b) => (a.Rating > b.Rating) ? 1 : -1);
    }else if( sort === 'App'){
        results.sort((a,b) => (a.App > b.App) ? 1 : -1);
    }
  

    res.send(results);
});

// server needs to listen to a specific port (ex. 8000) so that requests to that port are correctly routed to the server
app.listen(8000, () => {
    console.log('express server is listening on port 8000!');
});