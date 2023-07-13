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
  id="useGPTCheckBox"/>&nbsp;&nbsp;GPTモード
</label>`

const promptInputHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="promptInput" style="font-size:${inputChatBoxTextSize}"> \
  <input id="promptInputTextBox" type="text" placeholder="prompt" style="width:100%" /> \
</div>`

const apikeyInputHtml = `
<div class="cyber-input ac-cyan gb-black fg-cyan" id="apikeyInput" style="font-size:${inputChatBoxTextSize}"> \
  <input id="apikeyInputTextBox" type="text" placeholder="APIKEY" style="width:100%" /> \
</div>`
