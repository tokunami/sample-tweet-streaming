$(function(){
  var socket = io.connect();

  socket.on('connect', function(){
    console.log('connected!');
  });

//ボタンを押すとkeyword postイベントを発火しキーワードを送信
  $('#keyword_form').on('submit', function(){
    var keyword = $('#keyword').val();
    if(keyword){
      socket.emit('keyword post',keyword);
      console.log('keyword post発火');

    }
  });

  socket.on('message', function(t){
    $('<div></div>')
      .html('<li>' + t + '</li>')
      .prependTo('#tweets');
  });

});
