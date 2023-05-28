let chatLog = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
const maxLog = 10



async function getMikuChat(input){//chatbotの推論に置き換える時に、外に出す
  //楽曲を再生してほしいとき
  let response = ""
  //楽曲変更の希望があるか
  let musicUrl = checkChangeMusic(input)//複数候補がある場合ランダムで１曲選ぶ
  //変更の希望があるときは、楽曲を変更する
  if(musicUrl[1]){
    changeMusic(musicUrl[0][1])
  }
  //楽曲を流してほしいのか
  response = checkWantStatStopMusic(input)//楽曲を流してほしい時は流す
  //楽曲再生等を行ってない場合は、ミクさんとチャット
  if(response == ""){
    response = input
  }
  return response
}

async function showChatLog(input,textBox){
  if(input!=""){
    chatLog.push(input)
    let mikuChat = await getMikuChat(input)
    chatLog.push(mikuChat)
    let i = chatLog.length-1
    textBox.text=""
    while( i >= 0 && i > chatLog.length - maxLog ){
      if(i % 2 == 0){//自分の発言
        textBox.text = "YOU > "+chatLog[i] +'\n'+ textBox.text
      }else{//ミクの発言
        textBox.text = "MIKU > "+chatLog[i] +'\n'+ textBox.text
      }
      i--
    }
  }
}