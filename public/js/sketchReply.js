//REPLY
function botVariables(){
  botPitch=(random(.2,1.7));
  let botVoicePossible=[28,32,36,39];
  botVoice=random(botVoicePossible);
  botSpeed=(random(.2,2));
  botPersonality=0;//0=Reply,1=ML,2=Rhyme

  initSpeech();
}

function gotSpeech() {
  lastSpeechTime=millis();
  if (speechRec.resultValue && start) {
    let input = speechRec.resultString;
    if(checkMatches(input)){
      return;
    }
    speech.speak(input);
    background(255);
    text(input, width/2, height/2, width,height);
    console.log(input);
  }
}
