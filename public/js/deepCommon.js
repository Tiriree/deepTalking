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
let thankyou=['Thank You','January Punwattana','Gabriel Barcia Colombo',
'Mimi Yin','Allison Parrish','Luke Dubois',
'Daniel Shiffman','Pedro Oliveira','Sam Lavigne',
'Sarah Rothberg','Aarón Montoya-Moraga',
'Aaron Parsekian','Chino Kim',
'Yuli Cai','Davíd Lockard',
'Woraya Boonyapanachoti','Lola Regina Sofia de los dolores del Alba Cantu',
'Rushali Paratey','Akmyrat Tuyliyev','Sejo Manuel Vega Cebrian',
'February Punwattana',
'Net sirisantana',
'ITP Family',
'My Family','Thankyou all for lending me your charger',
'Sebastian Morales','Everyone for coming','and I love you all'];
let thankyouCounter=0;
//bots Peronality
let botPersonality=0;//0=Reply,1=ML,2=Rhyme
let botPitch=1;
let botVoice=1;
let botSpeed=1;
let waiting=false;
let inputText='';
let voiceVol=1;
//fonts stuff
let fonts = ['Impact', 'Arial', 'Arial Black', 'Helvetica', 'Gill Sans'];
let fontSize = ['100', '200' , '300' , '400'];

//ML
const word2Vec = new ml5.Word2Vec('js/data/vectorsPhantom.json', modelLoaded);
let modelReady = false;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  background(255, 255, 255);
  botVariables();
  speechRec.start(continuous, interim);
  //botVariables();
  initText();
  //Ask the server if the client is on or off. If it should start or not
  socket.emit("amIOn",botPersonality);
  socket.emit("amIOn",botPersonality);

}

function checkMatches(words){
  if(words=="sing for me" || words=="sing with me"){
    singForMe();
    socket.emit("SINGFORME");
    return true;
  }
  if(words=="too loud" ||words==" 2 hour"){
    voiceVol-=.2;
    if(voiceVol<0)voiceVol=0;
    speech.setVolume(voiceVol);
    return true;
  }
  if(words=="louder" || words==" loud"){
    voiceVol+=.2;
    if(voiceVol>1)voiceVol=1;
    speech.setVolume(voiceVol);
    return true;
  }
  if(words=='funny'){
    say('hahahahahaha');
    return true;
  }
}




function initSpeech(){
  speech.setPitch(botPitch);
  speech.setVoice(botVoice);
  speech.setRate(botSpeed);
  //socket.emit("amIOn",botPersonality);

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
}

function modelLoaded () {
  modelReady = true;
  initSpeech();//this function calls after everything is initialized, that way it ensures it is loaded.
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
    return output;
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
  fill(245);
  background(clearingColor);
  // text("I'm listening", width/2, height/2);
  fill(0,0,0);
  console.log("clearing que");
}


function singForMe(){
  say("la lah la lah la la");
  say("la lah la lah la la");
}



socket.on('rhyme', function(data){
  //var sentence=data.join(' ');
  if(data=="no match found"){
    console.log("no match found");
  }else{
    try{
      data=data.replace(/'/g, '"');
      let sentence=JSON.parse(data);
      sentence=sentence.join(' ');
      speech.speak((sentence));
      background(255);

      text((sentence), width/2, height/2, width,height);
      console.log((sentence));
      lastSpeechTime=millis();
    }
    catch(err){
      //do nothing
    }
  }
  waiting=false;
});


//SOCKETS CODE
socket.on('connect', function(){
    console.log("Socket connected");

});

//start
socket.on('start', function(data){
  start=data;
  initSpeech();
  if(data==false){
    background(0);
  }
  console.log(data);
});

//data from server
socket.on('shh', function(){
  speech.cancel();
  console.log("shhh!");
  socket.emit("amIOn",botPersonality);

  });

socket.on('thanks', function(){
  speech.cancel();
  thankyouLoves();
});

socket.on('sing', function(){
  singForMe();
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

function thankyouLoves(){
  start=false;
  speech.setRate(1);
  // speech.cancel();
  background(humanColor[0],humanColor[1],humanColor[2]);
  fill((255-humanColor[0]),(255-humanColor[1]),(255-humanColor[2]))
  speech.cancel();
  if(thankyouCounter<thankyou.length){
    speech.speak("Thank you "+thankyou[thankyouCounter]);
    console.log("Thank you "+thankyou[thankyouCounter]);
    background(humanColor[0],humanColor[1],humanColor[2]);
    text(thankyou[thankyouCounter], width/2, height/2);
    thankyouCounter++;
  }

  setTimeout(function(){thankyouLoves()}, 3000);

}

function say(socketMessage,message){
   socket.emit(socketMessage,message);
}

function say(message){
    socket.emit('word',message);
}

function sayRandom(message){
    socket.emit('speakRandom',message);
}

function randStart(val){
  socket.emit("start",1);
}

function startAll(val){
  socket.emit("startAll",val);
}

function turnGroup(group,val){
  for(let i=0;i<bots.length;i++){
    if(botPersonality[i]==group){
      socket.emit('target',bot[i],val);
    }
  }
}

function turnGroupRan(group,val){
  let ranNumbers=[]
  for(let i=0;i<bots.length;i++){
    ranNumbers.push(i);
  }
  shuffle(ranNumbers,true);
  console.log(ranNumbers);
  for(let i=0;i<bots.length;i++){
    if(botPersonality[ranNumbers[i]]==group){
      socket.emit('target',bots[ranNumbers[i]],val);
    }
  }
}

function jan(val){
  //do nothing;
}
