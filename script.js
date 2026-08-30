const days=[
  "Monday","Tuesday","Wednesday","Thursday",
  "Friday","Saturday","Sunday"
];

/*
  IMPORTANT:
  Every question contains THREE CONSECUTIVE DAYS.
  Exactly ONE coach is blank.
  The answer is always the missing day.
*/
const questions=[
  {days:["Monday","Tuesday","Wednesday"],blank:2,answer:"Wednesday",
   question:"Which day comes after Tuesday?"},
  {days:["Tuesday","Wednesday","Thursday"],blank:1,answer:"Wednesday",
   question:"Which day comes between Tuesday and Thursday?"},
  {days:["Wednesday","Thursday","Friday"],blank:0,answer:"Wednesday",
   question:"Which day comes before Thursday?"},
  {days:["Thursday","Friday","Saturday"],blank:2,answer:"Saturday",
   question:"Which day comes after Friday?"},
  {days:["Friday","Saturday","Sunday"],blank:1,answer:"Saturday",
   question:"Which day comes between Friday and Sunday?"},
  {days:["Saturday","Sunday","Monday"],blank:0,answer:"Saturday",
   question:"Which day comes before Sunday?"},
  {days:["Sunday","Monday","Tuesday"],blank:1,answer:"Monday",
   question:"Which day comes between Sunday and Tuesday?"},
  {days:["Monday","Tuesday","Wednesday"],blank:1,answer:"Tuesday",
   question:"Which day comes between Monday and Wednesday?"},
  {days:["Thursday","Friday","Saturday"],blank:0,answer:"Thursday",
   question:"Which day comes before Friday?"},
  {days:["Friday","Saturday","Sunday"],blank:2,answer:"Sunday",
   question:"Which day comes after Saturday?"}
];

let quiz=[];
let index=0;
let score=0;
let locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
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
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function playMusic(){
  music.volume=0.15;
  const p=music.play();
  if(p) p.catch(()=>{});
}

function setCoachText(id,text){
  // The blank coach gets NO text at all.
  document.getElementById(id).textContent=text || "";
}

function render(){
  locked=false;
  const q=quiz[index];

  instruction.textContent=q.question;

  // Exactly one of the three coaches is blank.
  setCoachText("coach1",q.blank===0 ? "" : q.days[0]);
  setCoachText("coach2",q.blank===1 ? "" : q.days[1]);
  setCoachText("coach3",q.blank===2 ? "" : q.days[2]);

  progress.textContent=`${index+1} / 10`;
  answers.innerHTML="";

  shuffle(days.slice()).forEach(day=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="answer";
    b.textContent=day;
    b.addEventListener("click",()=>check(day,b));
    answers.appendChild(b);
  });

  setTimeout(()=>{
    speak(`${q.question} Tap the missing day.`);
  },300);
}

function correctFeedback(){
  feedback.textContent="✓";
  feedback.style.color="#34a853";
  feedback.classList.remove("hidden");

  confetti.innerHTML="";
  for(let i=0;i<55;i++){
    const p=document.createElement("div");
    p.className="piece";
    p.style.left=Math.random()*100+"vw";
    p.style.animationDelay=Math.random()*.3+"s";
    p.style.background=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"][i%5];
    confetti.appendChild(p);
  }

  correctSound.currentTime=0;
  correctSound.play().catch(()=>{});

  setTimeout(()=>{
    feedback.classList.add("hidden");
    confetti.innerHTML="";
  },1000);
}

function wrongFeedback(){
  feedback.textContent="✕";
  feedback.style.color="#e53935";
  feedback.classList.remove("hidden");

  wrongSound.currentTime=0;
  wrongSound.play().catch(()=>{});

  setTimeout(()=>feedback.classList.add("hidden"),850);
}

function check(day,button){
  if(locked)return;

  const q=quiz[index];

  if(day===q.answer){
    locked=true;
    button.classList.add("correct");
    score++;
    scoreEl.textContent="⭐ "+score;

    speak("Correct! Well done.");
    correctFeedback();

    setTimeout(()=>{
      index++;
      if(index>=10){
        finish();
      }else{
        render();
      }
    },1050);

  }else{
    button.classList.add("wrong");
    wrongFeedback();
    speak("Try again. Look at the three days.");

    setTimeout(()=>{
      button.classList.remove("wrong");
    },700);
  }
}

function finish(){
  game.classList.add("hidden");
  endScreen.classList.remove("hidden");
  document.getElementById("finalScore").textContent=
    `You scored ${score} out of 10!`;
  speak(`Great job! You scored ${score} out of 10.`);
}

function start(){
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  game.classList.remove("hidden");

  playMusic();

  quiz=shuffle(questions.slice());
  index=0;
  score=0;
  scoreEl.textContent="⭐ 0";

  render();
}

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("againBtn").addEventListener("click",start);

document.getElementById("hearBtn").addEventListener("click",()=>{
  if(quiz[index]){
    speak(`${quiz[index].question} Tap the missing day.`);
  }
});

// Innovine logo remains visible for 5 seconds.
window.addEventListener("load",()=>{
  setTimeout(()=>{
    splash.style.display="none";
    startScreen.classList.remove("hidden");
  },5000);
});
