let search_chat = document.querySelector('.sidebar_search_input').querySelector('input')
let sidebar_chat_box = document.getElementsByClassName('sidebar_chat_box')
let sidebar_add_chat = document.querySelector('.sidebar_add_chat')
sidebar_chat_box[0].click()
let hamburger = document.querySelector('.hamburger')
let sidebar_search_cross = document.querySelector('.sidebar_search_cross')

hamburger.addEventListener('click',(e) => {
    document.querySelector('.sidebar').style.display = 'flex'
});


sidebar_search_cross.addEventListener('click',(e) => {
    document.querySelector('.sidebar').style.display = 'none'
  
});



function not(){
	
sidebar_add_chat.addEventListener('click',(e) => {
	console.log('click sidebar_add_chat')
  	const id = prompt("Enter the new member id")

  	if(id){
  		fetch(`/addNew/${id}`).then((data)=>{return data.json()})
  		.then((response)=>{
  			console.log(response)
  			alert(response.resText)
  		})		
  	}	
});


}





search_chat.addEventListener('input',(e) => {
	// console.log(e)
  	let value = e.target.value.toLowerCase()
  	Array.from(sidebar_chat_box).forEach((item) => {
  	  const h2 = item.querySelector('h2').innerText.toLowerCase()
  	  // console.log('includes ',h2.includes(value))
  	  if(value=="" || value==undefined){
  	  		item.style.display = 'flex'
  	  }
  	  else if(h2.includes(value)){
  	  		item.style.display = 'flex'
  	  }else{
  	  	item.style.display = 'none'
  	  }		

  	})
});


