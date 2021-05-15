const socket = io(location.href)
let chat_box = document.getElementsByClassName('sidebar_chat_box')
let sender_id = document.getElementById('real_id').innerText
let receiver_id = null
let chat_header = document.querySelector('.chat_header')
let form = document.querySelector('form')
let chat_main = document.querySelector('.chat_main')
let copy = document.querySelector('.copy')


Array.from(chat_box).forEach((item) => {
  item.addEventListener('click',(e) => {
  	let name = item.querySelector('h2').innerText 
  	let id =   item.querySelector('small').innerText
  	receiver_id = id
  	let image = item.querySelector('img').src

  	chat_header.querySelector('img').src = image
  	chat_header.querySelector('h2').innerText = name

  	fetch(`/get_all/${sender_id}/${receiver_id}`).then((res)=>{
  		return res.json()
  	}).then((data)=>{
  		console.log(data)
  		let a = data
  		if(data.response){
  			let str = ``

			data.data.forEach((item) => {
			  	if(item.from_id==sender_id){
			  		str+=`<div class="chat_text chat_text_green">
						<div class="chat_text_text">
							${item.message}
						</div>
						<div class="chat_text_time">
							${item.time_stamp}
						</div>
					</div>`
			  	}else{
			  		str+=`<div class="chat_text chat_text_white">
						<div class="chat_text_text">
							${item.message}
						</div>
						<div class="chat_text_time">
							${item.time_stamp}
						</div>
					</div>`
			  	}
			})		
				

			chat_main.innerHTML = str

  		}
  	})


  });
})

function send_message (input) {
	
if(input!=null || input!=undefined || input!=''){
	
	let data = {
		sender:sender_id,
		receiver:receiver_id,
		message:input,
	}


	  params = {
    method:'post',
    headers:{
      'Content-type':'application/json'
    },
    // body:JSON.stringify(data);
    body:JSON.stringify(data)
  }

  fetch('/message',params).then((a)=>{
  	return a.json()
  }).then((data)=>{

  })
}

}

copy.addEventListener('click',(e) => {
  	let input = document.createElement('input')
  	input.id = "honey"
  	input.value = sender_id
  	let id = document.querySelector('.sidebar_add_chat').querySelector('small').innerText	
  	document.querySelector('body').appendChild(input)
  	let select = document.getElementById('honey')
  	console.log(select)
  	select.select()
  	select.setSelectionRange(0,99999)
  	document.execCommand('copy')
  	alert('text copied',sender_id)

  	document.querySelector('body').removeChild(select)


});



form.addEventListener('submit',(e) => {
  	e.preventDefault()
  	let input = form.querySelector('input')

	if(sender_id!=null & receiver_id!=null & input.value!=''){
		  	console.log('response-message')
  	console.log('response-message')
  	console.log('response-message')
		socket.emit('response-message',{
		sender:sender_id,
		receiver:receiver_id,
		message:input.value,
	})

  	console.log(input.value)
  	let a = new Date()
	let div = document.createElement('div')
	div.className = `chat_text chat_text_green`
	div.innerHTML = `<div class="chat_text_text">
							${input.value}
						</div>
						<div class="chat_text_time">
							${a.toLocaleTimeString()}
						</div>`

	// chat_main.appendChild(div)					

  	send_message(input.value)




  	input.value = ''
	
	}else{
		alert('please add some person in chat group or add some message')
	}
});


socket.on('chat',(data)=>{
	// console.log('chat ',data)
	let a = new Date()
	let time = a.toLocaleTimeString()
	if(data.sender==sender_id){

		  	
		let div = document.createElement('div')			
		div.className = `chat_text chat_text_green`
		div.innerHTML = `<div class="chat_text_text">
							${data.message}
						</div>
						<div class="chat_text_time">
							${time}
						</div>`
		console.log('sender')
		chat_main.appendChild(div)		

	}else if(data.sender == receiver_id){
		console.log('receiver')
		let div = document.createElement('div')			
		div.className = `chat_text chat_text_white`
		div.innerHTML = `<div class="chat_text_text">
							${data.message}
						</div>
						<div class="chat_text_time">
							${time}
						</div>`
		console.log('receiver')
		chat_main.appendChild(div)

	}
})



socket.on('main',(data)=>{
	console.log('scoket connected')
})












