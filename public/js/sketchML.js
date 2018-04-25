//ML
function botVariables(){
  botPitch=1;
  botVoice=10;
  botSpeed=1.0;
  botPersonality=1;//0=Reply,1=ML,2=Rhyme
  initSpeech();
}

function gotSpeech() {
  lastSpeechTime=millis();
  if (speechRec.resultValue && start) {
    let input = speechRec.resultString;
    if(checkMatches(input)){
      return;
    }
    //ML
    var words=input.split(' ');
    var vecWords=[];
    for (var i=0;i<words.length;i++){
      var response= findNearest(words[i],1);
      vecWords.push(response);
    }
    var sentence=vecWords.join(' ');

    speech.speak(sentence);
    background(255);
    text(sentence, width/2, height/2, width,height);
    console.log(input);
  }
}
