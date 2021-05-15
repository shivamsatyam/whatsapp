io.on('connection',(socket)=>{
	console.log('client conneted')
	socket.emit('chat-message',"hellow world")
})

