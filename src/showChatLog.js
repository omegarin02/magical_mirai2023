let chatLog = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
//楽曲load用のタイマー
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
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
  console.log(musicUrlTitle)
  if(musicUrlTitle.length == 0){
    return [[],false]
  }else{
    return [musicUrlTitle[Math.floor(Math.random() * musicUrlTitle.length)],true]
  }
}

async function checkWantStatStopMusic(input){
  response = ""
  if(input.indexOf("再生") !== -1){//再生コマンドのバリエーションを増やす
    if(playFlag){
      response = "もう再生してるよ！"
      console.log(player.isLoading,player.isVideoSeeking)
    }else{
      response = "OK!再生するよ！"
      console.log(player.isLoading,player.isVideoSeeking)
      await sleep( 5000 );//5秒待たせてみる
      
      while(player.isLoading){
        await sleep( 1000 );
        console.log(player.isLoading,player.isVideoSeeking)
      }
      player.requestPlay();
    }
  }else if(input.indexOf("停止")!== -1){//停止コマンドのバリエーションを増やす
    if(playFlag){
      response = "聴いてくれてありがと～"
      player.requestStop();
    }else{
      response = "あれ？まだ音楽再生していないよ？"
    }
  }
  return response
}

async function getMikuChat(input){//chatbotの推論に置き換える
  //楽曲を再生してほしいとき
  let response = ""
  //楽曲変更の希望があるか
  let musicUrl = checkChangeMusic(input)//複数候補がある場合ランダムで１曲選ぶ
  //変更の希望があるときは、楽曲を変更する
  console.log(musicUrl)
  if(musicUrl[1]){
    changeMusic(musicUrl[0][1])
  }
  //楽曲を流してほしいのか
  response = checkWantStatStopMusic(input)//楽曲を流してほしい時は流す
  console.log(response)
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