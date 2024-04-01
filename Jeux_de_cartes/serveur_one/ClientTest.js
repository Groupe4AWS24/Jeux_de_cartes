var app = require('http').createServer(handler),
    io  = require('socket.io').listen(app)

app.listen(3000);

function handler (req, res) {
  res.writeHead(200);
  res.end("<html><script src=\"/socket.io/socket.io.js\"></script><script></html>");
}

io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data);
  });
});