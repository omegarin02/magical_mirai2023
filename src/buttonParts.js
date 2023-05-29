let startButtonWidth = (400 * compressionSquare).toString()+"px"
let startButtonFontSize = (20 * compressionSquare).toString()+"px"
let homeButtonWidth = startButtonWidth
let homeButtonFontSize = startButtonFontSize
let sendButtonFontSize = (20 * compressionSquare).toString()+"px"
const startButtonHtml = `
<button
  class="cyber-button bg-red fg-white"
  id="startButton"
  style="width:${startButtonWidth};font-size:${startButtonFontSize}"
> 
  Press to start 
  <span class="glitchtext"> 
    Some edgy txt
  </span>
  <span class="tag"> 
  </span>
</button>`

const exitButtonHtml = '<button class="exitButtonBody"  id="exitButton">\
<div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>\
<div class="exitButtonText">EXIT</div>\
</button>'

const homeButtonHtml = `
<button
  class="cyber-button bg-red fg-white"
  id="homeButton"
  style="width:${homeButtonWidth};font-size:${homeButtonFontSize}"
> 
  Go back to home 
  <span class="glitchtext"> 
    Some edgy txt
  </span>
  <span class="tag"> 
  </span>
</button>`

const commentSendButtonHtml = `
<button class="sendButton" id="commentSendButton" style="font-size:${sendButtonFontSize}"> 
  <div class="sendIcon"> 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"></path> 
    </svg>
  </div>
  <p>SEND</p>
</button>`
