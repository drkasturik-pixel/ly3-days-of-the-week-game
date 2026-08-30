const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const questions=[
 {type:"next",a:"Monday",b:"Tuesday",answer:"Tuesday"},
 {type:"before",a:"Wednesday",b:"Thursday",answer:"Wednesday"},
 {type:"next",a:"Tuesday",b:"Wednesday",answer:"Wednesday"},
 {type:"before",a:"Friday",b:"Saturday",answer:"Friday"},
 {type:"next",a:"Thursday",b:"Friday",answer:"Friday"},
 {type:"before",a:"Sunday",b:"Monday",answer:"Sunday"},
 {type:"next",a:"Saturday",b:"Sunday",answer:"Sunday"},
 {type:"before",a:"Tuesday",b:"Wednesday",answer:"Tuesday"},
 {type:"next",a:"Wednesday",b:"Thursday",answer:"Thursday"},
 {type:"before",a:"Thursday",b:"Friday",answer:"Thursday"}
];

let quiz=[],index=0,score=0,locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const sequence=document.getElementById("sequence");
const instruction=document.getElementById("instruction");
const answers=document.getElementById("answers");
const progress=document.getElementById("progress");
const scoreEl=document.getElementById("score");
const feedback=document.getElementById("feedback");
const confetti=document.getElementById("confetti");
const music=document.getElementById("music");
const correctSound=document.getElementById("correctSound");
const wrongSound=document.getElementById("wrongSound");

function shuffle(a){
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
function playMusic(){
 music.volume=.15;
 const p=music.play();
 if(p)p.catch(()=>{});
}
function render(){
 locked=false;
 const q=quiz[index];
 instruction.textContent=q.type==="next" ? "Which day comes next?" : "Which day comes before?";
 sequence.innerHTML=`<div class="dayCard">${q.a}</div><div class="dayCard blank">?</div><div class="dayCard">${q.b}</div>`;
  document.getElementById("coach1").textContent=q.a;
  document.getElementById("coach2").textContent="?";
  document.getElementById("coach3").textContent=q.b;

 progress.textContent=`${index+1} / 10`;
 answers.innerHTML="";
 // Correct answer is not always in the same button position.
 shuffle(days.slice()).forEach(day=>{
   const b=document.createElement("button");
   b.type="button"; b.className="answer"; b.textContent=day;
   b.addEventListener("click",()=>check(day,b));
   answers.appendChild(b);
 });
 setTimeout(()=>speak(`${instruction.textContent} The train shows ${q.a} and ${q.b}. Tap the missing day.`),300);
}
function correctFeedback(){
 feedback.textContent="✓";
 feedback.style.color="#34a853";
 feedback.classList.remove("hidden");
 confetti.innerHTML="";
 for(let i=0;i<55;i++){
   const p=document.createElement("div"); p.className="piece";
   p.style.left=Math.random()*100+"vw";
   p.style.animationDelay=Math.random()*.3+"s";
   p.style.background=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"][i%5];
   confetti.appendChild(p);
 }
 correctSound.currentTime=0; correctSound.play().catch(()=>{});
 setTimeout(()=>{feedback.classList.add("hidden");confetti.innerHTML=""},1000);
}
function wrongFeedback(){
 feedback.textContent="✕"; feedback.style.color="#e53935"; feedback.classList.remove("hidden");
 wrongSound.currentTime=0; wrongSound.play().catch(()=>{});
 setTimeout(()=>feedback.classList.add("hidden"),850);
}
function check(day,button){
 if(locked)return;
 const q=quiz[index];
 if(day===q.answer){
   locked=true; button.classList.add("correct"); score++;
   scoreEl.textContent="⭐ "+score;
   speak("Correct! Well done.");
   correctFeedback();
   setTimeout(()=>{index++; if(index>=10)finish(); else render()},1050);
 }else{
   button.classList.add("wrong");
   wrongFeedback();
   speak("Try again. Look at the train.");
   setTimeout(()=>button.classList.remove("wrong"),700);
 }
}
function finish(){
 game.classList.add("hidden"); endScreen.classList.remove("hidden");
 document.getElementById("finalScore").textContent=`You scored ${score} out of 10!`;
 speak(`Great job! You scored ${score} out of 10.`);
}
function start(){
 startScreen.classList.add("hidden"); game.classList.remove("hidden");
 playMusic(); quiz=shuffle(questions.slice()); index=0; score=0; scoreEl.textContent="⭐ 0"; render();
}
document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("againBtn").addEventListener("click",start);
document.getElementById("hearBtn").addEventListener("click",()=>{
 const q=quiz[index]; speak(`${q.type==="next"?"Which day comes next?":"Which day comes before?"} ${q.a} and ${q.b}.`);
});

// Innovine logo is shown for exactly 5 seconds before the start screen.
window.addEventListener("load",()=>{
 setTimeout(()=>{splash.style.display="none";startScreen.classList.remove("hidden")},5000);
});
