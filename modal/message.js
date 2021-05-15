const mongoose = require('mongoose')

const signinSchema = new mongoose.Schema({
	
	
	from_id:{
		type:String,
		required:true
	},
	to_id:{
		type:String,
		required:true
	},
	message:{
		type:String,
		required:true
	},

	time_stamp:{
		type:String,
		required:true
	}
})



module.exports = new mongoose.model('whatsapmessage',signinSchema)




































