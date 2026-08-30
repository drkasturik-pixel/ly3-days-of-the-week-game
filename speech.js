function speak(text){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.82;
  u.pitch=1.05;
  u.volume=1;
  window.speechSynthesis.speak(u);
}
