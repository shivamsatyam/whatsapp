require('dotenv').config()
// 609eb8e09143de0d685e9bed
const express = require('express')
const app = express()
const Html5Entities = require('html-entities').Html5Entities
const path = require('path')
const passport = require('passport');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const User = require('./modal/User')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8000
const Message = require('./modal/message')
const  fs = require('fs');




require('./passport_setup');

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const static_path = path.join(__dirname,'public')
app.use(express.static(static_path))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/whatsapp',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true}).then(()=>{
	console.log('the connection is succesfully established')
})

const db = mongoose.connection

const INDEX = '/views/index.ejs'
const PORT = process.env.PORT || 3000

db.once('open',()=>{
	const msgCollection  = db.collection('whatsapmessages')
	const changeStream = msgCollection.watch([])
	

})



function checkData (data,check) {
	if(data.length==0){
		return false
	}

	for (var i = 0; i<data.length; i++) {
		if(data[i].identity==check){
			return true
		}
	}

	return false
}


const isLoggedIn = (req,res,next)=>{
	if (req.user) {
		next();
	}else{
		res.redirect('/google')
	}
}

//initializing the passport js
app.use(passport.initialize());
app.use(passport.session());


app.get('/add',(req,res)=>{
	new User({
				googleId:"ddgdgggfh",
				name:'santosh',
				email:'none@noffme.con',
				image:'none',
				password:null,
				person:'[]'
			}).save().then((newUser)=>{
				
			})

			res.send('none')
})

app.get('/',isLoggedIn,(req,res)=>{
	console.log('user')
	console.log(req.user)
	User.find({'_id':req.user._id},(err,data)=>{
		// console.log(data)
		let person = JSON.parse(data[0].person)
		res.render('index',{data:person,real:data[0]})
	})

	
})

app.get('/good',(req,res)=>{
	console.log(req.user)
	res.redirect('/')
})

app.get('/failed',(req,res)=>{
	res.send('failed')
})


//the real passport js google authentication work
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout',(req,res)=>{
	req.logout()
	console.log(req.user)
	res.send('logout')
})

app.get('/addNew/:id',(req,res)=>{
	const id = req.params.id
	const googleId = req.user.googleId

	if(req.user.id!=id){


	User.find({'googleId':googleId},(error,response)=>{

		if(error){throw error}
		else if (response) {
				console.log('response')
				console.log(response)
				let find_person = JSON.parse(response[0].person)
				console.log('find_person')
				console.log(find_person)
				if(!checkData(find_person,id)){
					console.log('inner')
					User.find({'_id':id},(err,data)=>{
						if(err){
							throw err
						}
						else if(data){
							console.log('first find')
							console.log(data)
							const dataId = data[0]._id
							const email = data[0].email
							const name =  data[0].name
							const image =  data[0].image
							let user_person = JSON.parse(data[0].person)

							user_person.push({identity:response[0]._id,name:response[0].name,email:response[0].email,image:response[0].image})
							find_person.push({identity:dataId,name:name,email:email,image:image})

							User.findByIdAndUpdate(response[0]._id,{$set:{person:JSON.stringify(find_person)}},{new:true},(e,a)=>{
								console.log('first upate')
								console.log(a)
								if(e){
									throw e; 
								}else if(a){
									User.findByIdAndUpdate(data[0]._id,{$set:{person:JSON.stringify(user_person)}},{new:true},(q,w)=>{
											if(q){
												throw q
											}else if(w){
												console.log('second update')
												console.log(w)
												res.json({
													resText:"the user added succesfully",
													data:find_person,
												})
											}
										})
								}										
							})


							

						}
					})

				}else{
					console.log('last')

					res.json({
						resText:"the user is already added",
						data:null
					})
				}
			}	
	})

	}else{
		res.json({
			resText:"you cant add yourself",
			data:null
		})
	}

})


app.post('/delete/:id/:other',(req,res)=>{
	const id  = req.params.id
	const other  = req.params.other
	Message.deleteMany({$and:[{$or:[{from_id:id},{to_id:id}]},{$or:[{from_id:other},{to_id:other}]}]},(err,data)=>{
		if(err){throw err}

		else{
			res.json({
				response:true
			})
		}	
	})	
})

app.get('/get_all/:id/:other',(req,res)=>{
	const id  = req.params.id
	const other  = req.params.other
	Message.find({$and:[{$or:[{from_id:id},{to_id:id}]},{$or:[{from_id:other},{to_id:other}]}]},(err,data)=>{
		if(err){
			throw err
		}else if(data){
			// data.forEach((item) => {
			//   item.message = Html5Entities.decode(item.message)
			// })
			res.json({
				response:true,
				data:data
			})
		}else{
			res.json({
				response:false,
				data:null
			})
		}
	})
})

app.post('/message',(req,res)=>{
	const sender = req.body.sender
	const receiver = req.body.receiver
	const  message= req.body.message

	let date = new Date()
	new Message({
		from_id:sender,
		to_id:receiver,
		message:Html5Entities.encode(message),
		time_stamp:date.toLocaleTimeString(),
	}).save((err)=>{
		if(err){throw err}
			else{
				console.log('save')
			}
	})

})


let server = app.listen(port,()=>{
	console.log('the app is running')
})

let io = require('socket.io')(server)


io.on('connection',(socket)=>{
	console.log('client conneted')
	
	socket.emit('main',"boss")

	socket.on('send-message',(data)=>{
		console.log(data)
	})

	socket.on('response-message',(data)=>{
		console.log('response-message-main')
		console.log(data)
		data.message = Html5Entities.encode(data.message)
		io.emit('chat',data)
		console.log('chat message emitted')
	})


})








































