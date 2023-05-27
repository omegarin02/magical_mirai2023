let chatLog = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
const maxLog = 10

function checkChangeMusic(input){//TODO検索エンジンの強化
  musicUrlTitle = []
  maxScoreIndex = []
  maxScore = 0
  for(let i = 0; i < musicList.length ; i++){
    let score = 0
    //タイトル一致するか
    if(input.indexOf(musicList[i].title) !== -1){
      musicUrlTitle.push([musicList[i].title,musicList[i].url])
      maxScoreIndex = []
      break
    }
    if(input.indexOf(musicList[i].artist) !== -1){
      score++
    }
    if(input.indexOf(musicList[i].Voc) !== -1){
      score++
    }
    
    for(let j = 0 ; j < musicList[i].keyWord.length ; j++){     
      if(input.indexOf(musicList[i].keyWord[j]) !== -1){
        score++
      }
    }
    if(maxScore < score){
      maxScore = score
      maxScoreIndex = []
      maxScoreIndex.push(i)
    }else if (maxScore == score && score > 0 ){
      maxScoreIndex.push(i)
    }
  }
  if(musicUrlTitle.length == 0){//タイトルで曲が決まらなかった場合
    for(let i = 0 ; i < maxScoreIndex.length ; i++){
      index = maxScoreIndex[i]
      musicUrlTitle.push([musicList[index].title,musicList[index].url])
    }
  }
  return musicUrlTitle
}

async function getMikuChat(input){//chatbotの推論に置き換える
  //楽曲を再生してほしいとき
  let response = ""
  let musicUrl = checkChangeMusic(input)
  console.log(musicUrl)
  //楽曲に関連する情報をを言っていない時
  if(musicUrl.length == 0){
    if(input.indexOf("再生") !== -1){
      if(playFlag){
        response = "もう再生してるよ！"
      }else{
        response = "OK!再生するよ！"
        player.requestPlay();
      }
    }else if(input.indexOf("停止")!== -1){
      if(playFlag){
        response = "聴いてくれてありがと～"
        player.requestStop();
      }else{
        response = "あれ？まだ音楽再生していないよ？"
      }
    }else{
      checkMusicStartFlag=false
      response = input
    }
  //楽曲に関連する情報を１つ言ったとき
  }else if(musicUrl.length == 1){
    //再生と言われた時
    if(input.indexOf("再生") !== -1){
      if(playFlag){
        response = "再生する曲を変えるね"
        player.requestStop();
      }else{
        response = musicUrl[0][0] + "を流すね"
      }
      changeMusic(musicUrl[0][1])
      player.requestPlay();
    }if(!checkMusicStartFlag){
      changeMusic(musicUrl[0][1])
      response = musicUrl[0][0] + "を再生する？"
      checkMusicStartFlag=true
    }else{
      changeMusic(musicUrl[0][1])
      player.requestPlay();
      checkMusicStartFlag=false
    }
  //楽曲に関連する情報を2つ以上言ったとき
  }else if(musicUrl.length >= 2){
    response = "どの楽曲を再生再生する?\n"
    for(let i = 0 ; i<musicUrl.length; i++){
      response += musicUrl[i][0] + "?\n"
    }
    checkMusicStartFlag=true
    tmpMusicUrl = musicUrl
  }
  return response
}

async function showChatLog(input,textBox){
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