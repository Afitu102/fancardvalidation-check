
/* CELEBRITY DATABASE */

const celebs=[

{name:"Taylor Swift",category:"American"},
{name:"Beyoncé",category:"American"},
{name:"Ariana Grande",category:"American"},
{name:"Selena Gomez",category:"American"},
{name:"Jennifer Lopez",category:"American"},
{name:"Kim Kardashian",category:"American"},
{name:"Zendaya",category:"American"},
{name:"Billie Eilish",category:"American"},
{name:"Lady Gaga",category:"American"},
{name:"Miley Cyrus",category:"American"},
{name:"Will Smith",category:"American"},
{name:"Leonardo DiCaprio",category:"American"},
{name:"Tom Cruise",category:"American"},
{name:"Denzel Washington",category:"American"},
{name:"Robert Downey Jr.",category:"American"},
{name:"Scarlett Johansson",category:"American"},
{name:"Oprah Winfrey",category:"American"},
{name:"Chris Evans",category:"American"},
{name:"Jennifer Aniston",category:"American"},
{name:"Keanu Reeves",category:"American"},
{name:"Elon Musk",category:"American"},

{name:"David Beckham",category:"British"},
{name:"Victoria Beckham",category:"British"},
{name:"Tom Holland",category:"British"},
{name:"Emma Watson",category:"British"},
{name:"Daniel Radcliffe",category:"British"},
{name:"Harry Styles",category:"British"},
{name:"Ed Sheeran",category:"British"},
{name:"Adele",category:"British"},
{name:"Dua Lipa",category:"British"},
{name:"Jason Statham",category:"British"},
{name:"Rowan Atkinson",category:"British"},
{name:"Henry Cavill",category:"British"},
{name:"Benedict Cumberbatch",category:"British"},
{name:"Kate Winslet",category:"British"},
{name:"Simon Cowell",category:"British"},

{name:"Will Parfitt",category:"International"},
{name:"Justin Bieber",category:"International"},
{name:"Rihanna",category:"International"}

];


/* VARIABLES */

let selected=0;
let category="All";
let fanID="";

let currentTheme={
main:"#172e59",
accent:"#d4af37"
};

const celebrityImages={};


/* FALLBACK IMAGE */

function fallback(name){

return "https://ui-avatars.com/api/?name="+
encodeURIComponent(name)+
"&background=172e59&color=ffffff&size=300";

}


/* CATEGORY FILTER */

function setCategory(value,button){

category=value;

document.querySelectorAll(".filters button").forEach(b=>{
b.classList.remove("active");
});

button.classList.add("active");

renderCelebs();

}


/* CELEBRITY GRID */

function renderCelebs(){

const grid=document.getElementById("celebGrid");

const search=document.getElementById("search").value.toLowerCase();

grid.innerHTML="";

celebs.forEach((c,index)=>{

if(category!=="All" && c.category!==category)return;

if(!c.name.toLowerCase().includes(search))return;

const div=document.createElement("div");

div.className="celeb"+(selected===index?" active":"");

const img=document.createElement("img");

img.src=celebrityImages[index]||fallback(c.name);

img.alt=c.name;

img.onerror=()=>{
img.onerror=null;
img.src=fallback(c.name);
};

const name=document.createElement("b");

name.textContent=c.name;

const small=document.createElement("small");

small.textContent=c.category;

div.append(img,name,small);

div.onclick=()=>{

selected=index;
fanID="";

generateID();

renderCelebs();

update();

};

grid.appendChild(div);

});

}


/* LOAD CELEBRITY PHOTOGRAPHS */

async function loadCelebrityImages(){

for(let i=0;i<celebs.length;i++){

try{

const url="https://en.wikipedia.org/api/rest_v1/page/summary/"+
encodeURIComponent(celebs[i].name.replace(/ /g,"_"));

const response=await fetch(url);

if(!response.ok)continue;

const data=await response.json();

if(data.thumbnail?.source){

celebrityImages[i]=data.thumbnail.source;

renderCelebs();

if(selected===i){
update();
}

}

}catch(error){

console.log("Could not load:",celebs[i].name);

}

}

}


/* THEME SELECTION */

function setTheme(main,accent,element){

currentTheme.main=main;
currentTheme.accent=accent;

document.querySelectorAll(".theme-option").forEach(el=>{
el.classList.remove("active");
});

if(element)element.classList.add("active");

document.getElementById("customColor").value=main;

update();

}


function setCustomTheme(color){

currentTheme.main=color;
currentTheme.accent="#d4af37";

document.querySelectorAll(".theme-option").forEach(el=>{
el.classList.remove("active");
});

update();

}


/* GENERATE FAN ID */

function generateID(){

const prefix=celebs[selected].name
.replace(/[^a-zA-Z]/g,"")
.substring(0,3).toUpperCase();

fanID=prefix+"-"+new Date().getFullYear()+"-"+
Math.floor(100000+Math.random()*900000);

update();

}


/* UPDATE CARD */

function update(){

const c=celebs[selected];

const name=document.getElementById("fanName").value.trim()||"FAN NAME";

const type=document.getElementById("cardType").value;

const disclaimer=document.getElementById("disclaimer").value;

const year=new Date().getFullYear();


/* THEMES */

document.getElementById("frontCard").style.setProperty("--main",currentTheme.main);

document.getElementById("frontCard").style.setProperty("--accent",currentTheme.accent);

document.getElementById("backCard").style.setProperty("--main",currentTheme.main);

document.getElementById("backCard").style.setProperty("--accent",currentTheme.accent);


/* HEADER */

document.getElementById("headerName").textContent=
c.name+" Membership Card";


/* CELEBRITY PHOTO */

document.getElementById("celebLargePhoto").src=
celebrityImages[selected]||fallback(c.name);

document.getElementById("celebPhotoName").textContent=c.name;


/* FAN INFORMATION */

document.getElementById("pName").textContent=name.toUpperCase();

document.getElementById("pSex").textContent=
document.getElementById("sex").value;

document.getElementById("pType").textContent=type;

document.getElementById("pCountry").textContent=
document.getElementById("country").value;

document.getElementById("pYear").textContent=year;

document.getElementById("pFav").textContent=
document.getElementById("fav").value;


/* SIGNATURE */

const parts=name.split(" ");

document.getElementById("pSig").textContent=
parts[0].charAt(0)+". "+(parts.slice(1).join(" ")||"");


/* FAN ID */

document.getElementById("pId").textContent=fanID;

document.getElementById("barcodeNum").textContent=fanID;

document.getElementById("backId").textContent=fanID;


/* BARCODE */

try{

JsBarcode("#barcode",fanID,{
format:"CODE128",
displayValue:false,
height:35,
margin:0,
width:1.5
});

}catch(error){}


/* QR CODE */

const qrData=JSON.stringify({
type:"Unofficial fan-made collectible",
celebrity:c.name,
fan:name,
fanID:fanID,
cardType:type
});

const qr="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data="+
encodeURIComponent(qrData);

document.getElementById("qrImg").src=qr;

document.getElementById("qrBack").src=qr;


/* BENEFITS */

const benefits=document.getElementById("backBenefits").value
.split("\n")
.filter(x=>x.trim());

const list=document.getElementById("backBenefitsList");

list.innerHTML="";

benefits.forEach(b=>{

const li=document.createElement("li");

li.textContent=b;

list.appendChild(li);

});


/* BACK INFORMATION */

document.getElementById("backTermsText").textContent=
document.getElementById("backTerms").value;

document.getElementById("backValidText").textContent=
document.getElementById("backValid").value;

document.getElementById("backContactText").textContent=
document.getElementById("backContact").value;


/* DISCLAIMER ON BOTH SIDES */

document.getElementById("frontDisclaimer").textContent=disclaimer;

document.getElementById("backDisclaimer").textContent=disclaimer;


/* ADAPT BACK TEXT TO AVAILABLE SPACE */

fitBackContent();

}


/* AUTOMATIC BACK-CARD TEXT FITTING */

function fitBackContent(){

const content=document.querySelector(".back-content");

let fontSize=1.8;

content.querySelectorAll("li,p").forEach(el=>{
el.style.fontSize=fontSize+"cqw";
});

let attempts=0;

while(content.scrollHeight>content.clientHeight && fontSize>1.1 && attempts<15){

fontSize-=0.1;

content.querySelectorAll("li,p").forEach(el=>{
el.style.fontSize=fontSize+"cqw";
});

attempts++;

}

}


/* UPLOAD FAN PHOTO */

function loadPhoto(event){

const file=event.target.files[0];

if(!file)return;

if(!file.type.startsWith("image/")){
alert("Please select an image.");
return;
}

if(file.size>5*1024*1024){
alert("Image must be smaller than 5MB.");
return;
}

const reader=new FileReader();

reader.onload=()=>{
document.getElementById("fanPhoto").src=reader.result;
};

reader.readAsDataURL(file);

}


/* DOWNLOAD CARD */

async function downloadCard(id,filename){

const element=document.getElementById(id);

const buttons=document.querySelectorAll("button.action");

buttons.forEach(b=>b.disabled=true);

try{

await document.fonts.ready;

const images=Array.from(element.querySelectorAll("img"));

await Promise.all(images.map(img=>{

if(img.complete)return Promise.resolve();

return new Promise(resolve=>{

img.onload=resolve;
img.onerror=resolve;

});

}));

const canvas=await html2canvas(element,{

scale:4,
useCORS:true,
allowTaint:false,
backgroundColor:null,
logging:false

});

const link=document.createElement("a");

link.download=filename;

link.href=canvas.toDataURL("image/png");

link.click();

}catch(error){

console.error(error);

alert("Download failed. Please check your internet connection and try again.");

}finally{

buttons.forEach(b=>b.disabled=false);

}

}


/* INITIALIZE */

renderCelebs();

generateID();

loadCelebrityImages();
