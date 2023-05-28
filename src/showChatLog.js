let chatLog = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
const maxLog = 9
const maxChar = 20


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
  response = await checkWantStatStopMusic(input)//楽曲を流してほしい時は流す
  console.log(response)
  //楽曲再生等を行ってない場合は、ミクさんとチャット
  if(response == ""){
    response = input
  }
  return response
}

function splitMaxChar(input,user){
  let tmpInput = user+" > "+input
  if(tmpInput.length < maxChar ){
    chatLog.push(tmpInput)
  }else{
    let tmp = ""
    for(let i = 0 ; i < tmpInput.length ; i++){
      if( i % maxChar == 0 && i > 0){
        chatLog.push(tmp)
        tmp = ""
      }else{
        tmp += tmpInput[i]
      }
    }
    if(tmp != ""){
      chatLog.push(tmp)
    }
  }
}

async function showChatLog(input,textBox){
  if(input!=""){
    splitMaxChar(input,"USER")
    let mikuChat = await getMikuChat(input)
    splitMaxChar(mikuChat,"MIKU")
    let i = chatLog.length-1
    textBox.text=""
    while( i >= 0 && i > chatLog.length - maxLog ){
      textBox.text = chatLog[i] +'\n'+ textBox.text
      i--
    }
  }
}