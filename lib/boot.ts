/** Runs before paint: restores theme + decides whether to play the intro curtain. */
export const bootScript = `(function(){try{
  var r=document.documentElement;
  var t=null;try{t=localStorage.getItem("theme");}catch(e){}
  r.dataset.theme=(t==="light"||t==="dark")?t:"dark";
  var reduce=false;try{reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){}
  var seen=null;try{seen=sessionStorage.getItem("intro-seen");}catch(e){}
  if(!reduce&&!seen){
    r.setAttribute("data-intro","1");
    r.style.setProperty("--intro-delay","760ms");
    try{sessionStorage.setItem("intro-seen","1");}catch(e){}
    setTimeout(function(){r.removeAttribute("data-intro");},2800);
  }
}catch(e){}})();`;
