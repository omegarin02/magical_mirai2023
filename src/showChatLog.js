let chatLog = []
const maxLog = 10

async function getMikuChat(input){//chatbotの推論に置き換える
  return input+"応答"
}

async function showChatLog(input,textBox){
  chatLog.push(input)
  let mikuChat = await getMikuChat(input)
  chatLog.push(mikuChat)
  let i = chatLog.length-1
  while( i >= 0 && i > chatLog.length - maxLog ){
    if(i % 2 == 0){//自分の発言
      textBox.text = "YOU > "+chatLog[i] +'\n'+ textBox.text
    }else{//ミクの発言
      textBox.text = "MIKU > "+chatLog[i] +'\n'+ textBox.text
    }
    
    console.log(chatLog[i],i)
    i--
  }
}