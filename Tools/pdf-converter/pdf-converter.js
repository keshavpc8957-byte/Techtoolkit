const uploadBox = document.getElementById("uploadBox")
const fileInput = document.getElementById("fileInput")
const imageGrid = document.getElementById("imageGrid")

const convertBtn = document.getElementById("convertBtn")
const downloadBtn = document.getElementById("downloadBtn")

const loader = document.getElementById("loader")

let images = []
let pdfBlob = null


uploadBox.addEventListener("click", () => fileInput.click())

fileInput.addEventListener("change", handleFiles)

uploadBox.addEventListener("dragover", e => {
e.preventDefault()
uploadBox.classList.add("drag")
})

uploadBox.addEventListener("drop", e => {
e.preventDefault()
handleFiles({target:{files:e.dataTransfer.files}})
})

function handleFiles(e){

const files = [...e.target.files]

files.forEach(file => {

const reader = new FileReader()

reader.onload = function(event){

images.push({
name:file.name,
src:event.target.result
})

renderImages()

}

reader.readAsDataURL(file)

})

}


function renderImages(){

imageGrid.innerHTML = ""

images.forEach((img,index)=>{

const card = document.createElement("div")
card.className="image-card"

card.innerHTML=`

<span class="remove" data-index="${index}">✕</span>

<img src="${img.src}" alt="${img.name}">

<p>${img.name}</p>

`

imageGrid.appendChild(card)

})

document.querySelectorAll(".remove").forEach(btn=>{

btn.onclick=()=>{
images.splice(btn.dataset.index,1)
renderImages()
}

})

}


Sortable.create(imageGrid,{
animation:150,
onEnd:(evt)=>{
const moved = images.splice(evt.oldIndex,1)[0]
images.splice(evt.newIndex,0,moved)
}
})


convertBtn.addEventListener("click", async ()=>{

if(images.length===0) return

loader.classList.remove("hidden")

const { jsPDF } = window.jspdf

const orientation = document.getElementById("orientation").value

const pageSize = document.getElementById("pageSize").value

const margin = parseInt(document.getElementById("margin").value)

let pdf = new jsPDF({
orientation:orientation,
unit:"px",
format: pageSize === "letter" ? "letter" : "a4"
})

for(let i=0;i<images.length;i++){

let img = new Image()
img.src = images[i].src

await new Promise(resolve=>{
img.onload=resolve
})

let width = pdf.internal.pageSize.getWidth() - margin*2
let height = (img.height/img.width)*width

if(i>0) pdf.addPage()

pdf.addImage(img,"JPEG",margin,margin,width,height)

}

pdfBlob = pdf.output("blob")

loader.classList.add("hidden")

downloadBtn.style.display="inline-block"

})


downloadBtn.addEventListener("click",()=>{

const url = URL.createObjectURL(pdfBlob)

const a = document.createElement("a")

a.href = url
a.download = "converted.pdf"

a.click()

})


const toggle = document.getElementById("darkToggle")

if(localStorage.getItem("dark") === "true"){
document.body.classList.add("dark")
}

toggle.onclick = ()=>{

document.body.classList.toggle("dark")

localStorage.setItem("dark", document.body.classList.contains("dark"))

}