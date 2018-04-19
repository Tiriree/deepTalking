let socket = io();
let iSocket, bSocket, tSocket;
let iSay, bSay;
let iRanSay, bRanSay;
let bOnSocket, bOffSocket;
let bShowOn;
let bAllOffSocket, bAllOnSocket;
let bSilenceSocket;
let bThanSocket;
let bTurnReOn,bTurnReOff;
let bTurnMlOn,bTurnMlOff;
let bTurnRhOn,bTurnRhOff;
//random individual in group
let bRanTurnReOn,bRanTurnReOff;
let bRanTurnMlOn,bRanTurnMlOff;
let bRanTurnRhOn,bRanTurnRhOff;


let yPos=10;
let bHeight=30;
let marginX=20;
let showStarted=true;

let bots=[];
let botPersonality=[];

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  background(255, 255, 255);

  bShowOn = createButton('Show On/Off').size(60,bHeight).position(width - iSocket.width, yPos).mousePressed(showOn);
  if(!showStarted){
    bShowOn.style('color', "#FF3399");
  }else{
    bShowOn.style('color', "#000000")
  }

  iSocket = createInput();//'\'val1\',\'val2\'')
  iSocket.position(20, yPos).size(140,bHeight);
  bSocket = createButton('socket').size(60,bHeight).position(iSocket.x + iSocket.width, yPos).mousePressed(socketSend);

  yPos+=bHeight+5;
  iSay = createInput().position(20, yPos).size(140,bHeight);
  bSay = createButton('Say').size(60,bHeight).position(iSay.x + iSay.width, yPos).mousePressed(say);

  yPos+=bHeight+5;
  iRanSay = createInput().position(20, yPos).size(140,bHeight);
  bRanSay = createButton('Random Say').size(60,bHeight).position(iRanSay.x + iRanSay.width, yPos).mousePressed(sayRandom);
  //-


  yPos+=bHeight*2;

  //0=Reply,1=ML,2=Rhyme
  bTurnMlOn = createButton('Turn Reply On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroup(0,1);});
  bTurnMlOff = createButton('Turn Reply Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroup(0,0);});
  yPos+=bHeight+5;
  bTurnMlOn = createButton('Turn ML On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroup(1,1);});
  bTurnMlOff = createButton('Turn ML Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroup(1,0);});
  yPos+=bHeight+5;
  bTurnRhOn = createButton('Turn Rh On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroup(2,1);});
  bTurnRhOff = createButton('Turn Rh Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroup(2,0);});

  yPos+=bHeight*2;
  bRanTurnMlOn = createButton('Ran Reply On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(0,1);});
  bRanTurnMlOff = createButton('Ran Reply Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(0,0);});
  yPos+=bHeight+5;
  bRanTurnMlOn = createButton('Ran ML On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(1,1);});
  bRanTurnMlOff = createButton('Ran ML Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(1,0);});
  yPos+=bHeight+5;
  bRanTurnRhOn = createButton('Ran Rh On').position(marginX, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(2,1);});
  bRanTurnRhOff = createButton('Ran Rh Off').position(marginX+100, yPos).size(100,bHeight).mousePressed(function(){turnGroupRan(2,0);});
  yPos+=bHeight+5;

  yPos+=bHeight+5;
  bOnSocket = createButton('Turn Random On').position(marginX, yPos).size(200,bHeight).mousePressed(function(){randStart(1)});

  yPos+=bHeight+5;
  bOffSocket = createButton('Turn Random Off').position(marginX, yPos).size(200,bHeight).mousePressed(function(){randStart(0)});//randStart

  yPos+=bHeight*2;
  bAllOnSocket = createButton('Turn All On').position(marginX, yPos).size(200,bHeight).mousePressed(function(){startAll(1)});

  yPos+=bHeight+5;
  bAllOffSocket = createButton('Turn All Off').position(marginX, yPos).size(200,bHeight).mousePressed(function(){startAll(0)});

  yPos+=bHeight*2;
  bSilenceSocket = createButton('Silence').position(marginX, yPos).size(200,bHeight).mousePressed(silence);

  yPos+=bHeight*2;
  bThanSocket = createButton('Thankyou').position(marginX, yPos).size(200,bHeight).mousePressed(thanks);


  textAlign(CENTER);
  textSize(50);
  socket.emit("amIOn",'control');

}


function draw(){
}

function showOn(){
  showStarted=!showStarted;
  socket.emit("showStarted",showStarted);
  socket.emit("amIOn");
}
function colorSwitchon(){
  console.log("SHOW IS "+showStarted);
  if(!showStarted){
    bShowOn.style('color', "#FF3399")
  }else{
    bShowOn.style('color', "#000000")
  }
}

function socketSend() {
  var s = iSocket.value().split(",");
  if(s.length>1){
    console.log("Socket Name: "+s[0]);
    console.log("Socket Value: "+s[1]);
    socket.emit(s[0],s[1]);
  }else{
    console.log("Socket Value: "+s[0]);
    socket.emit(s[0]);
  }
  iSocket.value('\'val1\',\'val2\'');
}

function randStart(val){
  socket.emit("start",1);
}

function startAll(val){
  socket.emit("startAll",val);
}

function thanks(){
  socket.emit("thanks");
}

function silence(){
  socket.emit("SILENCE");
}

function say(){
  var message=iSay.value();
  socket.emit('word',message);
  // iSay.value("");
}

function sayRandom(message){
  var message=iRanSay.value();
  socket.emit('speakRandom',message);
  // iRanSay.value("");
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

//start
socket.on('start', function(data){
  showStarted=data;
  colorSwitchon();
});
socket.on('botsControl', function(botArray,personality){
  bots=botArray;
  botPersonality=personality;
  console.log(bots+" "+botPersonality);
});
