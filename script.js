const searchInput = document.getElementById("searchInput")
const cards = document.querySelectorAll(".tool-card")
const categoryFilter = document.getElementById("categoryFilter")
const sortTools = document.getElementById("sortTools")
const grid = document.getElementById("toolsGrid")

searchInput.addEventListener("keyup",function(){

const value = this.value.toLowerCase()

cards.forEach(card=>{

const name = card.querySelector("h3").innerText.toLowerCase()

if(name.includes(value))
card.style.display="block"

else
card.style.display="none"

})

})

categoryFilter.addEventListener("change",function(){

const category = this.value

cards.forEach(card=>{

if(category==="all")
card.style.display="block"

else if(card.dataset.category===category)
card.style.display="block"

else
card.style.display="none"

})

})

sortTools.addEventListener("change",function(){

if(this.value==="rating"){

const sorted=[...cards].sort((a,b)=>

b.dataset.rating-a.dataset.rating
)

sorted.forEach(card=>grid.appendChild(card))

}

})

document.getElementById("darkToggle").onclick=()=>{

document.body.classList.toggle("dark")

}

