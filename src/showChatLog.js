let chatLog = []
let speechBalloons = []
let checkMusicStartFlag = false
let tmpMusicUrl = []
const maxLog = 8
const maxChar = 20
const balloonTimeout = 10
const checkInterval = 1000


async function prediction(input){
  let builder = kuromoji.builder({dicPath: DICT_PATH});
  let tmp = []
  let genkei = []
  let syushi = []
  builder.build((err, tokenizer)=>{
    tokens = tokenizer.tokenize(input);// 形態素解析
    tokens.forEach((token)=>{
      if(token["pos"] == "名詞" || token["pos"] == "動詞" || token["pos"] == "感動詞" || token["pos"] == "形容詞" ){
        if(token["pos_detail_1"] == "形容動詞語幹" || 
          token["pos_detail_1"] == "接尾"|| 
          token["pos_detail_1"] == "代名詞" || 
          token["pos_detail_2"] == "地域" ||
          token["pos_detail_2"] == "副詞可能" ||
          token["pos_detail_1"] == "数" 
          ){
            tmp.push(token["basic_form"]);
            genkei.push(token["reading"])
        }else if(token["basic_form"]!=="*"){
          tmp.push(token["basic_form"]);
          genkei.push(token["reading"])
        }else if(token["pos_detail_1"] == "固有名詞"){
          tmp.push(token["surface_form"]);
          genkei.push(token["reading"])
        }
      }
    })
    for(let i = 0 ; i < tmp.length ; i++){
      tokens = tokenizer.tokenize(tmp[i])
      tokens.forEach((token)=>{
        syushi.push(token["reading"])
      })
    }
    if(checkKnowWords(syushi) < 0.8){
      result = unknownRespons[Math.floor(Math.random() * unknownRespons.length)]
      makeSpeechBalloon(result)
      splitMaxChar(result,"MIKU")
        let i = chatLog.length-1
        chatTextBox.text=""
        while( i >= 0 && i > chatLog.length - maxLog ){
          chatTextBox.text = chatLog[i] +'\n'+ chatTextBox.text
          i--
        }
      Motion(Number(0))
    }else{
      maxScore = 0
      maxScoreIndexArray = []//最も精度が高かったindexのリスト
      incorrectRateArray = []//間違い率のリスト
      questionCorpusLenArray = []//questionの単語Corpusの長さ
      inputLength = syushi.length
      for(let i = 0 ; i <  responseData.length ; i++){
        correctCounter = 0
        question = responseData[i]["question"]
        corpusLength = question.length
        for(let j = 0 ; j < inputLength;j++){//推論
          if(question.includes(syushi[j])){
            correctCounter += 1
          }
        }
        correctScore = correctCounter/inputLength
        if(correctScore == maxScore){
          maxScoreIndexArray.push(i)
          incorrectRateArray.push((corpusLength - correctCounter)/corpusLength)
          questionCorpusLenArray.push(corpusLength)
        }else if(correctScore > maxScore){
          maxScore = correctScore
          maxScoreIndexArray = []
          incorrectRateArray = []
          questionCorpusLenArray = []
          maxScoreIndexArray.push(i)
          incorrectRateArray.push((corpusLength - correctCounter)/corpusLength)
          questionCorpusLenArray.push(corpusLength)
        } 
      }
      result = ""
      action = ""
      if( maxScoreIndexArray.length == 1){//最もスコアが高いものが決まったとき
        result = responseData[maxScoreIndexArray[0]]["answer"]
        action = responseData[maxScoreIndexArray[0]]["action"]
      }else{//最もスコアが高いものが２つ以上あった
        //誤答率で求める
        let tmpQuestionCorpusLenArray = []
        let tmpMaxScoreIndexArray = []
        let minIncorrectRate = 1
        for (let i = 0 ; i < incorrectRateArray.length ; i++){
          if(minIncorrectRate == incorrectRateArray[i]){
            tmpQuestionCorpusLenArray.push(questionCorpusLenArray[i])
            tmpMaxScoreIndexArray.push(maxScoreIndexArray[i])
          }else if(minIncorrectRate > incorrectRateArray[i]){
            minIncorrectRate = incorrectRateArray[i]
            tmpQuestionCorpusLenArray = []
            tmpMaxScoreIndexArray = []
            tmpQuestionCorpusLenArray.push(questionCorpusLenArray[i])
            tmpMaxScoreIndexArray.push(maxScoreIndexArray[i])
          }
        }
        maxScoreIndexArray = tmpMaxScoreIndexArray
        console.log(maxScoreIndexArray,tmpQuestionCorpusLenArray)
        if(maxScoreIndexArray.length == 1){//誤答率で決着が付いたとき
          result = responseData[maxScoreIndexArray[0]]["answer"]
          action = responseData[maxScoreIndexArray[0]]["action"]
        }else{//誤答率で決着が付かなかったとき
          //Corpusの大きさで評価する(短い方が良いとする)
          questionCorpusLenArray = tmpQuestionCorpusLenArray
          maxCorpusLength = Math.max(...questionCorpusLenArray)
          tmpMaxScoreIndexArray = []
          for (let i = 0 ; i < questionCorpusLenArray.length; i++){
            if(maxCorpusLength == questionCorpusLenArray[i]){
              tmpMaxScoreIndexArray.push(maxScoreIndexArray[i])
            }else if(maxCorpusLength > questionCorpusLenArray[i]){
              maxCorpusLength = questionCorpusLenArray[i]
              tmpMaxScoreIndexArray = []
              tmpMaxScoreIndexArray.push(maxScoreIndexArray[i])
            }
          }
          maxScoreIndexArray = tmpMaxScoreIndexArray
          if(maxScoreIndexArray.length == 1){//Corpusの大きさで決着が付いたとき
            result = responseData[maxScoreIndexArray[0]]["answer"]
            action = responseData[maxScoreIndexArray[0]]["action"]
          }else{//ここまでして決まらなかったら乱数
            index = maxScoreIndexArray[Math.floor(Math.random() * maxScoreIndexArray.length)]
            result = responseData[index]["answer"]
            action = responseData[index]["action"]
          }
        }
      }
      makeSpeechBalloon(result)
      splitMaxChar(result,"MIKU")
        let i = chatLog.length-1
        chatTextBox.text=""
        while( i >= 0 && i > chatLog.length - maxLog ){
          chatTextBox.text = chatLog[i] +'\n'+ chatTextBox.text
          i--
        }
      Motion(Number(action))
    }
  })
}




async function getMikuChat(input){//chatbotの推論に置き換える時に、外に出す
  //楽曲を再生してほしいとき
  let response = ""
  //楽曲を流してほしいのか
  response = await checkWantStatStopMusic(input)//楽曲を流してほしい時は流す
  console.log(response)
  //楽曲再生等を行ってない場合は、ミクさんとチャット
  if(response == ""){
    prediction(input)
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
  maxWidth = 1200
  baseSize = fontSize*1.8
  textLength = mikuText.length
  //fontSizeはcontrolScrean.jsで定義済みのものを使用する
  balloonWidth = baseSize*textLength
  balloonHeight = baseSize*2//これをn行分にする
  if(maxWidth*compressionSquare < balloonWidth){
    n = Math.ceil(balloonWidth/(1000*compressionSquare))
    balloonWidth = maxWidth*compressionSquare
    balloonHeight = baseSize*(2+n)
  }
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
                      new PIXI.Text( mikuText, { fill: "white",fontSize: baseSize,fontFamily: textfont , wordWrap:true, wordWrapWidth:balloonWidth, breakWords: true} ),
                      balloonTimeout,
                      balloonHeight*1.3])
  lastIndex = speechBalloons.length-1
  speechBalloons[lastIndex][0].lineStyle(1, 0xffffff);//ラインの色
  speechBalloons[lastIndex][0].beginFill(0x000000);//中の色
  speechBalloons[lastIndex][0].alpha = 0.8
  speechBalloons[lastIndex][0].drawPolygon(speechBalloonPoint);
  speechBalloons[lastIndex][0].endFill();
  speechBalloons[lastIndex][0].lineStyle();
  speechBalloons[lastIndex][0].zIndex = 1000;
  speechBalloons[lastIndex][0].y -= balloonHeight - baseSize*2

  speechBalloons[lastIndex][1].x = basePointX-balloonWidth/2
  speechBalloons[lastIndex][1].y = basePointY+balloonHeight/10 - (balloonHeight - baseSize*2)
  speechBalloons[lastIndex][1].zIndex = 1100;


  for(let i = speechBalloons.length-1 ; i > 0  ; i--){
    speechBalloons[i-1][0].y -= speechBalloons[i][3] //吹き出し本体
    speechBalloons[i-1][1].y -= speechBalloons[i][3] //テキスト
  }

  scenes["mainScene"].addChild(speechBalloons[lastIndex][0])
  scenes["mainScene"].addChild(speechBalloons[lastIndex][1])
}


async function nomarizeText(input){
  
  let result = zenkaku2Hankaku(input)
  result = hankana2Zenkana(result)
  result = nomarizeMiku(result)
  result = nomarizeFirstPerson(result)
  return result
}


async function showChatLog(input){
  if(input!=""){
    if(await checkSwearing(input)){
      splitMaxChar("不適切な表現のため削除されました","SYSTEM")
    }else{
      text = await nomarizeText(input)
      splitMaxChar(input,"USER")
      let mikuChat = await getMikuChat(text)
      console.log(mikuChat)
      if(mikuChat !== ""){
        makeSpeechBalloon(mikuChat)
        splitMaxChar(mikuChat,"MIKU")
      }
    }
    let i = chatLog.length-1
    chatTextBox.text=""
    while( i >= 0 && i > chatLog.length - maxLog ){
      chatTextBox.text = chatLog[i] +'\n'+ chatTextBox.text
      i--
    }
  }
}

setInterval(delSpeechBalloon,checkInterval)