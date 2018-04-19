let waitToFinish=400;
let lastRec=0;
let secondLastRec=0;
//REPLY
function botVariables(){
  botPitch=(random(.2,1.7));
  let botVoicePossible=[28,32,36,39];
  botVoice=random(botVoicePossible);
  botSpeed=(1);
  continuous=true;
  interim=false;
  fontSize=[50,100,150,200];
  botPersonality=2;//0=Reply,1=ML,2=Rhyme

  initSpeech();
}

function gotSpeech() {
  let now=millis();
  if(lastRec+700<now){
    //console.log("not yet: "+now);
    secondLastRec=now;
  }
  lastRec=now;
  //  console.log("now: "+now+" lastRec: "+lastRec+"  secondLastRec: "+secondLastRec);
  // if(lastRec-lastSpeechTime+waitToFinish < millis()){
    lastSpeechTime=millis();
    if (speechRec.resultValue && start && !waiting) {
      let input = speechRec.resultString;
      if(lastRec-secondLastRec>waitToFinish){
        if(checkMatches(input)){
          return;
      }
      var words=input.split(' ');
      inputText=words[words.length-1]
      //for (var i=0;i<words.length;i++){
      console.log("sending "+inputText);
      socket.emit("rhyme",inputText,-1);
      waiting=true;
      //}
    }
  }
  secondLastRec=lastRec;
}
