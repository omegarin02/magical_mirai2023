let chatLog = []
let speechBalloons = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
const maxLog = 7
const maxChar = 20
const balloonTimeout = 10
const checkInterval = 1000


function prediction(data){
  let builder = kuromoji.builder({dicPath: DICT_PATH});
  builder.build((err, tokenizer)=>{
    tokens = tokenizer.tokenize(data);// 解析データの取得
    console.log(tokens)
  })
  return "ほげほげ"
}




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
  //楽曲再生等を行ってない場合は、ミクさんとチャット
  if(response == ""){
    response = prediction(input)
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

function delSpeechBalloon(){
  for (let i = 0 ; i < speechBalloons.length; i++){
    speechBalloons[i][2] = speechBalloons[i][2] - checkInterval/1000
    if(speechBalloons[i][2] <= 0){
      scenes["mainScene"].removeChild(speechBalloons[i][0])//balloonを削除
      scenes["mainScene"].removeChild(speechBalloons[i][1])//textを削除
      speechBalloons.shift()
      i -= 1
    }
  }
  

}

async function makeSpeechBalloon(mikuText){
  console.log(mikuText)
  baseSize = fontSize*1.8
  textLength = mikuText.length
  //fontSizeはcontrolScrean.jsで定義済みのものを使用する
  balloonWidth = baseSize*textLength
  balloonHeight = baseSize*2
  basePointX = 650*compressionSquare + baseSize*2 //ミクの立っている場所のn文字ずらしたところ
  basePointY = 250*compressionSquare - baseSize*2 //ミクが立っている頭の座標から1文字分ずらしたところ
  speechBalloonPoint = [basePointX-balloonWidth/2, basePointY,//p0 
                        basePointX+balloonWidth/2, basePointY, //p1
                        basePointX+balloonWidth/2+fontSize/2, basePointY+balloonHeight/2,//p2
                        basePointX+balloonWidth/2, basePointY+balloonHeight,//p3
                        basePointX,basePointY+balloonHeight,//p4
                        basePointX+fontSize*1.5,basePointY+balloonHeight*1.3,//p5
                        basePointX-fontSize*1.5,basePointY+balloonHeight,//p6
                        basePointX-balloonWidth/2,basePointY+balloonHeight,//p7
                        basePointX-balloonWidth/2 -1*fontSize/2,basePointY+balloonHeight/2 //p8
  ]

  speechBalloons.push([new PIXI.Graphics(),
                      new PIXI.Text( mikuText, { fill: "white",fontSize: baseSize,fontFamily: textfont } ),
                      balloonTimeout,
                      balloonHeight*1.3])
  lastIndex = speechBalloons.length-1
  speechBalloons[lastIndex][0].lineStyle(1, 0xffffff);//ラインの色
  speechBalloons[lastIndex][0].beginFill(0x000000);//中の色
  speechBalloons[lastIndex][0].alpha = 0.8
  speechBalloons[lastIndex][0].drawPolygon(speechBalloonPoint);
  speechBalloons[lastIndex][0].endFill();
  speechBalloons[lastIndex][0].lineStyle();

  speechBalloons[lastIndex][1].x = basePointX-balloonWidth/2
  speechBalloons[lastIndex][1].y = basePointY+balloonHeight/10

  for(let i = speechBalloons.length-1 ; i > 0  ; i--){
    speechBalloons[i-1][0].y -= speechBalloons[i][3] //吹き出し本体
    speechBalloons[i-1][1].y -= speechBalloons[i][3] //テキスト
  }

  scenes["mainScene"].addChild(speechBalloons[lastIndex][0])
  scenes["mainScene"].addChild(speechBalloons[lastIndex][1])
}


async function showChatLog(input,textBox){
  if(input!=""){
    splitMaxChar(input,"USER")
    let mikuChat = await getMikuChat(input)
    makeSpeechBalloon(mikuChat)
    splitMaxChar(mikuChat,"MIKU")
    let i = chatLog.length-1
    textBox.text=""
    while( i >= 0 && i > chatLog.length - maxLog ){
      textBox.text = chatLog[i] +'\n'+ textBox.text
      i--
    }
  }
}

setInterval(delSpeechBalloon,checkInterval)