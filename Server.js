const express= require('express');

const app=express();
const server=require('http').Server(app);
const io= require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
// const { Socket } = require('dgram');
const { ExpressPeerServer }=require('peer');
const peerServer=ExpressPeerServer(server,{
  debug:true
});

app.set('view engine','ejs');
app.use(express.static('public'))


app.use('/peerjs',peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  })

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })

  // io.on('connection',Socket =>{
  //   Socket.on('join-room',()=>{
  //     socket.join(roomId);
  //     socket.io(roomId).broadcast.emit('user-connected');
  //     // console.log("we join the room");
  //   })
  // })
  io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected',userId);
      socket.on('message',message=>{
        io.to(roomId).emit('createMessage',message)
      })
      // console.log("joines room");
    })


  })

  
server.listen(9000);