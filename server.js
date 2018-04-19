// quick and dirty express / websocket / osc demo.
// gets p5.SpeechRec data and forwards to OSC client.

var http = require('http');
var express = require('express');
var osc = require('node-osc');
var PythonShell = require('python-shell');

var port = 3080;//change back to 3080 for nginx
var client = new osc.Client('127.0.0.1', 9000);
var ejs = require('ejs');
var bots=[];
var botPersonality=[];
var botInitial=true;

const DEBUG = true; // print stuff out

var app = module.exports.app = express();

app.use(express.static(__dirname+'/public'));
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');

var server = http.createServer(app); // web server
var io = require('socket.io').listen(server); // socket server
server.listen(port);  // start
console.log("Listening on port: "+ port);
// get data from web client (e.g. Chrome), forward on to OSC client (e.g. Max)

app.get("/",function(req,res){
	res.render("welcome.html");
});
app.get("/rhyme",function(req,res){
	res.render("indexRhyme.html");
});
app.get("/reply",function(req,res){
	res.render("indexReply.html");
});
app.get("/ml",function(req,res){
	res.render("indexML.html");
});

app.get("/control",function(req,res){
	res.render("indexControl.html");
});
///
// SOCKETS:
///


io.on('connection', function (socket) {
	//create and store id
	bots.push(socket.id);
	botPersonality.push('unknown');
	//if(DEBUG) console.log('websocket connected from browser client.');

	socket.on('amIOn',function(data){
		io.to(socket.id).emit('start',botInitial);
		for(var i=0;i<bots.length;i++){
			if(bots[i]==socket.id){
				botPersonality[i]=data;
				sendBot();
				// console.log("Bot: "+bots[i]+" is "+data);
			}
		}
	});
	//start random bot
	socket.on('start', function (data) {
		var botId=bots[Math.floor(Math.random()*bots.length)];
		io.to(botId).emit('start',data);
		console.log("starting: "+ botId);
	});

	socket.on('target', function (message) {
		console.log("turning: "+message[0]+ " "+message[1]);
		io.to(message[0]).emit('start',message[1]);
	});

	socket.on('SINGFORME', function () {
		var	message='la la la la la';
		io.sockets.emit('sing',message);
	});


	//start all or pause all (send 0 or 1 on data)
	socket.on('startAll', function (data) {
		io.sockets.emit('start',data);
		console.log("starting All");
	});
	socket.on('rhyme', function (word, number) {
		var options = {
		  args: [word,number]
		};
		PythonShell.run('rhyme.py', options, function (err, results) {
			if (err) throw err;
			  // results is an array consisting of messages collected during execution
			  // console.log('results: %j', results);
				io.to(socket.id).emit('rhyme',results[0]);
			});
	});


	socket.on('result', function (data) {
    if(DEBUG) console.log(data.word);
		client.send('/word', data.word, function () {
		});
  });

	socket.on('SILENCE',function(){
		io.sockets.emit('shh');
	});

	socket.on('word',function(data){
		io.sockets.emit('say',data);
  });

	socket.on('thanks',function(){
		io.sockets.emit('thanks');
  });

	//make random bot speak data
	socket.on('speakRandom',function(data){
		var botId=bots[Math.floor(Math.random()*bots.length)];
		io.to(botId).emit('say',data);
	});
	socket.on('showStarted',function(data){
		botInitial=data;
	});


	socket.on('disconnect', function () {
		io.emit('user disconnected');
		//delete bot id
		var index = bots.indexOf(socket.id);
		if (index !== -1) bots.splice(index, 1);
		if (index !== -1) botPersonality.splice(index, 1);
		sendBot();
	});

	function sendBot(){
		io.sockets.emit("botsControl",bots,botPersonality);
		console.log("bots connected:  "+bots+" "+botPersonality);
	}
});
