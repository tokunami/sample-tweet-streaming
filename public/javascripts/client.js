$(function(){
  var socket = io.connect();

  socket.on('connect', function(){
    console.log('connected!');
  });

  socket.on('message', function(t){
    $('<div></div>')
      .html('<li>' + t + '</li>')
      .prependTo('#tweets');
  });

});
