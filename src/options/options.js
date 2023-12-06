function restoreOptions() {
  let gettingItem = browser.storage.local.get(["matchMode"]);
  gettingItem.then((res) => {
    if(!res.matchMode){
      browser.storage.local.set({matchMode: "url-only"});
      res.matchMode = "url-only";
    }
    let item = document.getElementById(`${res.matchMode}-radio`);
    if(item){
      item.checked = true
    }else{
      console.warn("matchMode is set to unsupported value: " + res.matchMode)
    }
  });
}
function init(){
  restoreOptions();
  let radios = Array.from(document.querySelectorAll("input"));
  for (let radio of radios){
    radio.addEventListener("change",(ev) => {
      const validValues =["url-only","title-only","url-and-title"];
      if(ev.target.checked && validValues.includes(ev.target.value)){
        browser.storage.local.set({matchMode:ev.target.value})
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);