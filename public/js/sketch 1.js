// var myRec;
//hola
// var x, y;
// var dx, dy;
//
// var socket;
let speech = new p5.Speech();
let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let continuous = true;
let interim = false;
let lastSpeechTime=0;
let silenceAllowed=6000;

let bot = new RiveScript();
function setup(){
  // graphics stuff:
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 255);
//speech stuff
  speechRec.start(continuous, interim);
// bot rivescript
  // let bot = new RiveScript();
  bot.loadFile("js/brain.rive", brainReady, brainError);

  // instructions:
  textSize(48);
  textAlign(CENTER);
  //make the text on center of screen
  rectMode(CENTER);

// myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
  // speechRec.onEnd = stopped;
  // speechRec.continuous = true; // do continuous recognition
  // speechRec.interimResults = true; // allow partial recognition (faster, less accurate)
  //
  // speechRec.start(); // start engine

  // client-side socket.io:
  // socket = io();

  // noLoop();
}

function brainReady() {
  console.log('Chatbot ready!');
  bot.sortReplies();
}

function brainError(error) {
  if (error) {
    console.log('Chatbot error!')
    console.log(error);
  }
}

// function stopped(){
//   console.log("stopped");
//   speechRec.start();
//
// }
//
// function mousePressed() {
//   console.log("restarting");
//   speechRec.onEnd();
// }



function draw(){
  let now=millis();
  //if we think the speechRec stopped working
  if(lastSpeechTime+silenceAllowed<now){
    //reset
    lastSpeechTime=millis();
    console.log("reseting");
    reset();
  }

}

function  reset(){
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = true; // do continuous recognition
  speechRec.interimResults = true; // allow partial recognition (faster, less accurate)
  speechRec.start(); // start engine
  //clear que for new text to come in
  if(random(100)>80){
    speech.cancel();
    console.log("clearing que");
  }
}


function gotSpeech() {
  lastSpeechTime=millis();
  console.log("last Speech: "+lastSpeechTime);
  if (speechRec.resultValue) {
    let input = speechRec.resultString;
    //user_input.value(input);
    let reply = bot.reply("local-user", input);
    speech.setRate(random(0.1,2));
    speech.setVoice(6)
    // speech.setRate(3);
    speech.speak(reply);


    //output.html(reply);
  }
  let res = speechRec.resultString;
  background(255);
    text(res, width/2, height/2);
    console.log(res);
    // socket.emit('result', { 'word': res });
}
// function parseResult()
// {
//   // recognition system will often append words into phrases.
//   var res = myRec.resultString;
//   background(255);
//   text(res, width/2, height/2);
//   socket.emit('result', { 'word': res });
// }
