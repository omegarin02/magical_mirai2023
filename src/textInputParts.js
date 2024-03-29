//input関係のPartsを定義する関数
let inputChatBoxTextSize = (25 * compressionSquare).toString()+"px"

const inputChatBoxHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="inputChatBox" style="font-size:${inputChatBoxTextSize}"> \
  <input id="inputText" type="text" placeholder="チャットを入力してね" style="width:100%" /> \
</div>`

const volumeControllerHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="volumeController" style="font-size:${inputChatBoxTextSize}"> \
  <input id="volumeControllerInput" type="number" placeholder="volume(0～100)" style="width:100%" min="0" max="100"/> \
</div>`

const useGPTCheckboxHtml = `
<label style="color:cyan;font-size:${inputChatBoxTextSize}" id="useGPT">
  <input type="checkbox" class="cyber-check  ac-cyan gb-cyan fg-cyan" 
  style="border:2px solid cyan;--checkbox-size:${inputChatBoxTextSize}"
  id="useGPTCheckBox"/>&nbsp;&nbsp;GPTモード（<a href="https://platform.openai.com/account/org-settings">OPENAI KEYの取得　OPENAIのページに飛びます</a>）
</label>`

const promptInputHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="promptInput" style="font-size:${inputChatBoxTextSize}"> \
  <input id="promptInputTextBox" type="text" placeholder="prompt" style="width:100%" /> \
</div>`

const apikeyInputHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="apikeyInput" style="font-size:${inputChatBoxTextSize}"> \
  <input id="apikeyInputTextBox" type="password" placeholder="OPENAI KEY" style="width:100%" /> \
</div>`

let nowSongName = ""
let musicSelectHtml = ""

async function updateMusicSerector(){
  musicSelectHtml = `
  <div class="cyber-select" id="musicSelectBoxDiv">
      <select id="musicSelectBox" class="cyber-input ac-cyan gb-cyan fg-cyan" style="font-size:${inputChatBoxTextSize};color:cyan;width:120%">
  `  
  for(let i = 0 ; i < musicList.length; i++){
    if(nowSongName == musicList[i].title){
      musicSelectHtml += `<option value="${i}" class="selectContent" selected>${musicList[i].title}</option>`
    }else{
      musicSelectHtml += `<option value="${i}" class="selectContent" >${musicList[i].title}</option>`
    }
  }
  musicSelectHtml +=`
      </select>
  </div>
  `
}

updateMusicSerector()