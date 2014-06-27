
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = io.listen(server);

var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key:'',
  consumer_secret:'',
  access_token_key:'',
  access_token_secret:'',
  proxy: { // Proxy settings
    host: 'proxy.kdc.fujixerox.co.jp', // Defaults to 'localhost'
    port: 8080, // Defaults to 80
  }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users', user.list);


server.listen(app.get('port'),function(){
  console.log('Express server listening on port' + app.get('port'));
});

var keyword ="ガンダム";

app.get('/', function(req, res){
  //リクエストからキーワードを取得する
  if (req.query.keyword){
    keyword = req.query.keyword;
  }
  res.render('index', {
    keyword: keyword,
    title: 'tokunamiの部屋'
  });
});

io.sockets.on('connection', function(socket){
  console.log("connected");

  socket.on('keyword post', function(keyword){
  //Twitter Streaming APIの呼び出し
    console.log('keyword post受信', keyword);
    twit.stream('statuses/filter', {'track': keyword}, function(stream){
      console.log('twit.stream start');
      stream.on('data', function (data){
        console.log('here');
//        io.sockets.emit('message', data.text);
        console.log(keyword);
      });
//      stream.on('end', function(response){
      //Handle a disconnection
//        console.log('切断されました');
//      });
//      stream.on('destroy', function(response){
      //Handle a 'silent' disconnection from Twitter, no end/error event fired
//        console.log('破棄されました');
//      });
      // Disconnect stream after five seconds
//      setTimeout(stream.destroy, 5000);
    });
  });
});
