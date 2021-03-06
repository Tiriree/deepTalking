let socket = io();
let speech = new p5.Speech();
let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let continuous = true;
let interim = false;

let lastSpeechTime=0;
let silenceAllowed=6000;
let humanColor = [10,14, 0];
let clearingColor = [255, 24, 0];
let start=false;

//bots Peronality
let botPersonality="ML";

//fonts stuff
let fonts = ['Impact', 'Arial', 'Arial Black', 'Helvetica', 'Gill Sans', 'Georgia'];
let fontSize = ['100', '200' , '300' , '400'];
let voices=[1,2,3,4,5,6];

//ML
const word2Vec = new ml5.Word2Vec('js/data/wordvecs10000.json', modelLoaded);
let modelReady = false;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  background(255, 255, 255);

  initSpeech();
  initText();

  //Ask the server if the client is on or off. If it should start or not
  socket.emit("amIOn");
}






//called by speechRec every time it detects something
function gotSpeech() {
  lastSpeechTime=millis();
  //console.log("last Speech: "+lastSpeechTime);
  if (speechRec.resultValue && start) {
    let input = speechRec.resultString;
//    speech.setRate(random(0.1,2));
    speech.setRate(1);
    // speech.setPitch(random(0.5,1.5));
    // speech.setRate3);

    if(input=="sing with me"){
      say("la la la la lalalalallala");
      return;
    }
    //ML
    var words=input.split(' ');
    var vecWords=[];
    for (var i=0;i<words.length;i++){
      var response= findNearest(words[i],5);
      vecWords.push(response);
    }
    var sentence=vecWords.join(' ');

    speech.speak(sentence);
    background(255);
    text(sentence, width/2, height/2, width,height);
    console.log(input);
  }
    // socket.emit('result', { 'word': res });
}




function initSpeech(){
  speechRec.start(continuous, interim);
  speech.setPitch(random(.2,1.7));
  speech.setVoice(10);
}

function initText(){
  textAlign(CENTER);
  textFont(random(fonts));
  rectMode(CENTER);//make the text on center of screen
  textSize(random(fontSize));

}

function draw(){
  //if we think the speechRec stopped working
  let now=millis();
  if(lastSpeechTime+silenceAllowed<now && start){
    lastSpeechTime=millis();
    console.log("reseting");
    reset();
  }
}

function initWord2Vec(){
  let nearWordInput = select('#nearword');
  let nearButton = select('#submit');
  let nearResults = select('#results');

  let betweenWordInput1 = select("#between1");
  let betweenWordInput2 = select("#between2");
  let betweenButton = select("#submit2");
  let betweenResults = select("#results2");

  let addInput1 = select("#isto1");
  let addInput2 = select("#isto2");
  let addInput3 = select("#isto3");
  let addButton = select("#submit3");
  let addResults = select("#results3");
}
function modelLoaded () {
  modelReady = true;
}

function findNearest(word, n) {
  if(word=='undefined'){
    return('');
  }
  console.log("finding nearest to ["+word+"]");
  if(modelReady){
    let nearest = word2Vec.nearest(word, n);
    if (!nearest) {
      // console.log("nothoing found");
      return '';
    }
    let output=[nearest.length];
    for (let i = 0; i < nearest.length; i++) {
      // output += nearest[i].vector + '<br/>';
      output[i] = nearest[i].vector;
    }
    randResponse=output[Math.floor(Math.random() * n)];

    console.log(output);
    return randResponse;
  }
  return 'Model has not loaded yet!';
}




//if silence has been too long
function  reset(){
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = true; // do continuous recognition
  speechRec.interimResults = true; // allow partial recognition (faster, less accurate)
  speechRec.start(); // start engine
  //clear que for new text to come in
  if(random(100)>40){
    iAmListening();
    //background(clearingColor);
  }
}

function iAmListening(){
  speech.cancel(); // only once rec that cancel
  fill(245);
  background(clearingColor);
  text("I'm listening", width/2, height/2);
  fill(0,0,0);
  console.log("clearing que");
}





//SOCKETS CODE
socket.on('connect', function(){
    console.log("Socket connected");

});

//start
socket.on('start', function(data){
  start=data;
  if(data==false){
    background(0);
  }
  console.log(data);
});

//data from server
socket.on('shh', function(data){
  speech.cancel();
  console.log("shhh!");
  });

socket.on('say',function(data){
   speech.cancel();
   speech.speak(data);
    console.log("say " + data);
    background(humanColor[0],humanColor[1],humanColor[2]);
    fill((255-humanColor[0]),(255-humanColor[1]),(255-humanColor[2]))
    text(data, width/2, height/2);
    fill(0,0,0);
});



function say(socketMessage,message){
   socket.emit(socketMessage,message);
}

function say(message){
    socket.emit('word',message);
}

function sayRandom(message){
    socket.emit('speakRandom',message);
}
