let monitor1 = [] //左の歌詞情報を保存するための変数
let monitor2 = [] //中央の歌詞情報を保存するための変数
let monitor3 = [] //右の歌詞情報を保存するための変数
let screenMode = 0//画面の表示方法を格納するための関数
let nextBuffer = 50//次の歌詞を取得するためのbuffer時間(ms)
let lyricFontSize = 25*compressionSquare
let latestLyricEndTime = 0//最後に表示した歌詞が終了する時間
let beforeLatestLyricEndTime = 0
//左のモニタの座標情報
let sizeMonitor1 = {"x1":100*compressionSquare,
                    "y1":100*compressionSquare,
                    "x2":450*compressionSquare,
                    "y2":300*compressionSquare,
                    "width":(450-100)*compressionSquare,
                    "height":(300-100)*compressionSquare}
//中央のモニタの座標情報
let sizeMonitor2 = {"x1":750*compressionSquare,
                    "y1":100*compressionSquare,
                    "x2":1200*compressionSquare,
                    "y2":300*compressionSquare,
                    "width":(1200-700)*compressionSquare,
                    "height":(300-100)*compressionSquare}
//右のモニタの座標情報
let sizeMonitor3 = {"x1":1450*compressionSquare,
                    "y1":100*compressionSquare,
                    "x2":1800*compressionSquare,
                    "y2":300*compressionSquare,
                    "width":(1800-1450)*compressionSquare,
                    "height":(300-100)*compressionSquare}
let lyricNumberId = 0
let beforeLyricNumberId = 0
let resetPosition = 0
let beforePosition = 0

//歌詞の表示を消す
async function deleteLryic(allDelete){
  //削除処理
  //左のモニタの処理
  for(let i = 0 ; i < monitor1.length ; i++){
    if(allDelete){//全ての歌詞情報を削除する場合
      scenes["mainScene"].removeChild(monitor1[i][2])
    }else if(beforeLyricNumberId >= monitor1[i][3]){//オブジェクトを追加する
      scenes["mainScene"].removeChild(monitor1[i][2])
      monitor1.shift()
      i =- 1
    }else{
      break
    }
  }
  //中央のモニタの処理
  for(let i = 0 ; i < monitor2.length ; i++){
    if(allDelete){
      scenes["mainScene"].removeChild(monitor2[i][2])
    }else if(beforeLyricNumberId >= monitor2[i][3]){//オブジェクトを追加する
      scenes["mainScene"].removeChild(monitor2[i][2])
      monitor2.shift()
      i =- 1
    }else{
      break
    }
  }
  //右のモニタの処理
  for(let i = 0 ; i < monitor3.length ; i++){
    if(allDelete){
      scenes["mainScene"].removeChild(monitor3[i][2])
    }else if(beforeLyricNumberId >= monitor3[i][3]){//オブジェクトを追加する
      scenes["mainScene"].removeChild(monitor3[i][2])
      monitor3.shift()
      i =- 1
    }else{
      break
    }
  }
  if(allDelete){
    monitor1=[]
    monitor2=[]
    monitor3=[]
    latestLyricEndTime = 0
    beforeLatestLyricEndTime = 0
  }
}

//再生位置が変わったときに一時的に情報を破棄する
async function resetLyric(position){
  await deleteLryic(true)
  latestLyricEndTime = 0  
  beforeLatestLyricEndTime = 0
  screenMode = 0
  lyricNumberId = 0
  beforeLyricNumberId = 0
  monitor1 = []
  monitor2 = []
  monitor3 = []
  resetPosition = position
}

//表示する文字色パレット
let redColors = ["#ff0000","#dc143c","#c71585","#ff1493","#ff6347"]
let greenColors = ["#008000","#2e8b57","#008080","#3cb371","#008b8b"]
let blueColors = ["#0000ff","#1e90ff","#4169e1","#00008b","#000080"]
let orengeColors = ["#ffa500","#f4a460","#d2691e","#ffd700","#ff4500"]
let purpleColors = ["#800080","#4b0082","#8a2be2","#9370db","#9932cc"]

//TextAliveAPIから提供する品詞情報をもとに歌詞の色を決める関数
function getLryricColor(pos){
  wordColor = "#777777"
  colorCodeIndex = Math.floor(Math.random() * redColors.length)
  if(pos == "N" || pos == "PN"){//名詞 or 代名詞
    wordColor = redColors[colorCodeIndex]//赤系の色
  }
  else if(pos == "V"){//動詞
    wordColor = greenColors[colorCodeIndex]//緑系の色
  }
  else if(pos == "J"){//形容詞
    wordColor = blueColors[colorCodeIndex]//青系の色
  }
  else if(pos == "W"){//感動詞
    wordColor = orengeColors[colorCodeIndex]//Orange系の色
  }
  else if(pos == "S"){//記号
    wordColor = purpleColors[colorCodeIndex]//紫系の色
  }
  //wordColor = [wordColor,wordColor,"#a9a9a9",wordColor,wordColor]
  return wordColor
}

//歌詞の表示を行うための関数
async function displayLyric(position,playFlag){
  let iVideoInfo = player.video
  let wordInfo = iVideoInfo.findWord(position+nextBuffer)
  let onePhrase = ""
  let endPhraseTime = 0
  //音楽が再生されているときの処理
  //console.log(position,playFlag)
  if(playFlag){
    if(wordInfo != null){//次のデータがある
      if((beforePosition > resetPosition && position > beforePosition && resetPosition > 0)){ //巻き戻しているのに進んでいる →　処理をしない
        ;
      } else if(latestLyricEndTime - position < nextBuffer){//一番最後に表示される歌詞の消えるタイミングとpositionの差が500ms未満
        resetPosition = 0
        beforeLatestLyricEndTime = latestLyricEndTime
        beforeLyricNumberId = lyricNumberId
        lyricNumberId += 1
        screenMode = Math.floor(Math.random() * 7) //TODO 乱数にする
      /*歌詞の描画情報格納処理*/
        /*パターン0 左右のmonitorが同じ*/
        if(screenMode == 0){
          lyricFontSize = 60 * compressionSquare
          //monitor1用 
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize

          maxColChar = maxColChar1
          maxLine = maxLineChar1
          if(maxColChar < maxColChar3){
            maxColChar = maxColChar3
          }
          if(maxLine < maxLineChar3){
            maxLine = maxLineChar3
          }
          let maxChar = maxLine * maxColChar
          
          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount = 0
          while(maxChar-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor1 = getLryricColor(pos)
            wordColor2 = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill: wordColor1,
                                            fontSize: lyricFontSize,
                                            fontFamily: textfont,
                                          } 
                                          ),
                            lyricNumberId])
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                              wordInfo._children[i]._data.char,
                              { fill: wordColor2,
                                fontSize: lyricFontSize, 
                                fontFamily: textfont } 
                              ),
                              lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar){
                baseX1 += lyricFontSize
                baseX3 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar = maxChar-wordInfo._children.length
            wordInfo = wordInfo._next
          }
        
        }/*パターン1 すべてのmonitorが同じ*/
          else if(screenMode == 1){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize

          maxColChar = maxColChar1
          maxLine = maxLineChar1
          if(maxColChar1 < maxColChar2 && maxColChar2 < maxColChar3){
            maxColChar = maxColChar3
          }else if(maxColChar1 < maxColChar2 && maxColChar2 > maxColChar3){
            maxColChar = maxColChar2
          }
          if(maxLineChar1 < maxLineChar2 && maxLineChar2 < maxLineChar3 ){
            maxLine = maxLineChar3
          }else if(maxLineChar1 < maxLineChar2 && maxLineChar2 > maxLineChar3){
            maxLine = maxLineChar2
          }
          let maxChar =maxLine*maxColChar
          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount=0
          while(maxChar-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor1 = getLryricColor(pos)
            wordColor2 = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor1,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              monitor2.push([wordInfo._children[i]._data.startTime,
                              wordInfo._children[i]._data.endTime,
                              new PIXI.Text( 
                                wordInfo._children[i]._data.char,
                                { fill: wordColor2,fontSize: lyricFontSize, fontFamily: textfont } 
                                ),
                                lyricNumberId])
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                              wordInfo._children[i]._data.char,
                              { fill: wordColor1,fontSize: lyricFontSize, fontFamily: textfont } 
                              ),
                              lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1

              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2

              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1

              //次の表示位置にする
              if(charCount < maxColChar){
                baseX1 += lyricFontSize
                baseX2 += lyricFontSize
                baseX3 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar = maxChar-wordInfo._children.length
            wordInfo = wordInfo._next
          }        
        }/*左から順に１，２，３と表示される*/
          else if(screenMode == 2){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          maxChar1 = maxColChar1 * maxLineChar1
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          maxChar2 = maxColChar2 * maxLineChar2
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize
          maxChar3 = maxColChar3 * maxLineChar3

          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount = 0
          while(maxChar1-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar1){
                baseX1 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar1 = maxChar1-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar2-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor2.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor2.length - 1 
              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar2){
                baseX2 += lyricFontSize
              }else{
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar2 = maxChar2-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar3-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor3.length - 1 
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar3){
                baseX3 += lyricFontSize
              }else{
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar3 = maxChar3-wordInfo._children.length
            wordInfo = wordInfo._next
          }


        }/*右から順に３，２，１と表示される*/
        else if(screenMode == 3){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          maxChar1 = maxColChar1 * maxLineChar1
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          maxChar2 = maxColChar2 * maxLineChar2
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize
          maxChar3 = maxColChar3 * maxLineChar3

          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount = 0
          while(maxChar3-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor3.length - 1 
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar3){
                baseX3 += lyricFontSize
              }else{
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar3 = maxChar3-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar2-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor2.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor2.length - 1 
              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar2){
                baseX2 += lyricFontSize
              }else{
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar2 = maxChar2-wordInfo._children.length
            wordInfo = wordInfo._next
          }

          charCount = 0
          while(maxChar1-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar1){
                baseX1 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar1 = maxChar1-wordInfo._children.length
            wordInfo = wordInfo._next
          }

        }/*右左中央に１，３，２と表示される*/
        else if(screenMode == 4){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          maxChar1 = maxColChar1 * maxLineChar1
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          maxChar2 = maxColChar2 * maxLineChar2
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize
          maxChar3 = maxColChar3 * maxLineChar3

          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount = 0
          while(maxChar1-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar1){
                baseX1 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar1 = maxChar1-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar3-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor3.length - 1 
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar3){
                baseX3 += lyricFontSize
              }else{
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar3 = maxChar3-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar2-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor2.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor2.length - 1 
              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar2){
                baseX2 += lyricFontSize
              }else{
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar2 = maxChar2-wordInfo._children.length
            wordInfo = wordInfo._next
          }


        }/*中央と左右の順*/
        else if(screenMode==5){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          maxChar2 = maxColChar2 * maxLineChar2
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize

          maxColChar = maxColChar1
          maxLine = maxLineChar1
          if(maxColChar < maxColChar3){
            maxColChar = maxColChar3
          }
          if(maxLine < maxLineChar3){
            maxLine = maxLineChar3
          }
          let maxChar = maxLine * maxColChar

          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]
          charCount = 0
          while(maxChar2-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor2.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor2.length - 1 
              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar2){
                baseX2 += lyricFontSize
              }else{
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar2 = maxChar2-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor1 = getLryricColor(pos)
            wordColor2 = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill: wordColor1,
                                            fontSize: lyricFontSize,
                                            fontFamily: textfont,
                                          } 
                                          ),
                            lyricNumberId])
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                              wordInfo._children[i]._data.char,
                              { fill: wordColor2,
                                fontSize: lyricFontSize, 
                                fontFamily: textfont } 
                              ),
                              lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar){
                baseX1 += lyricFontSize
                baseX3 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar = maxChar-wordInfo._children.length
            wordInfo = wordInfo._next
          }
        }//左右から中央
        else if(screenMode==6){
          lyricFontSize = 60 * compressionSquare
          //monitor1用
          maxColChar1 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar1 = sizeMonitor1["height"]/lyricFontSize
          //monitor2用
          maxColChar2 = sizeMonitor1["width"]/lyricFontSize
          maxLineChar2 = sizeMonitor1["height"]/lyricFontSize
          maxChar2 = maxColChar2 * maxLineChar2
          //monitor3用
          maxColChar3 = sizeMonitor3["width"]/lyricFontSize
          maxLineChar3 = sizeMonitor3["height"]/lyricFontSize

          maxColChar = maxColChar1
          maxLine = maxLineChar1
          if(maxColChar < maxColChar3){
            maxColChar = maxColChar3
          }
          if(maxLine < maxLineChar3){
            maxLine = maxLineChar3
          }
          let maxChar = maxLine * maxColChar

          baseX1 = sizeMonitor1["x1"]
          baseY1 = sizeMonitor1["y1"]
          baseX2 = sizeMonitor2["x1"]
          baseY2 = sizeMonitor2["y1"]
          baseX3 = sizeMonitor3["x1"]
          baseY3 = sizeMonitor3["y1"]

          charCount = 0
          while(maxChar-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor1 = getLryricColor(pos)
            wordColor2 = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor1.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill: wordColor1,
                                            fontSize: lyricFontSize,
                                            fontFamily: textfont,
                                          } 
                                          ),
                            lyricNumberId])
              monitor3.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                              wordInfo._children[i]._data.char,
                              { fill: wordColor2,
                                fontSize: lyricFontSize, 
                                fontFamily: textfont } 
                              ),
                              lyricNumberId])
              //初期位置を決める
              lastIndex = monitor1.length - 1 
              monitor1[lastIndex][2].x = baseX1
              monitor1[lastIndex][2].y = baseY1
              monitor3[lastIndex][2].x = baseX3
              monitor3[lastIndex][2].y = baseY3
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar){
                baseX1 += lyricFontSize
                baseX3 += lyricFontSize
              }else{
                baseX1 = sizeMonitor1["x1"]
                baseY1 += lyricFontSize
                baseX3 = sizeMonitor3["x1"]
                baseY3 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar = maxChar-wordInfo._children.length
            wordInfo = wordInfo._next
          }
          charCount = 0
          while(maxChar2-wordInfo._children.length > 0){
            pos = wordInfo._data.pos
            wordColor = getLryricColor(pos)
            for(let i = 0 ; i < wordInfo._children.length ; i++){//ワンフレーズごとにデータを取得する
              onePhrase+=wordInfo._children[i]._data.char
              //取得したデータを格納する
              monitor2.push([wordInfo._children[i]._data.startTime,
                            wordInfo._children[i]._data.endTime,
                            new PIXI.Text( 
                                          wordInfo._children[i]._data.char,
                                          { fill:wordColor,fontSize: lyricFontSize, fontFamily: textfont } 
                                          ),
                            lyricNumberId])
              //初期位置を決める
              lastIndex = monitor2.length - 1 
              monitor2[lastIndex][2].x = baseX2
              monitor2[lastIndex][2].y = baseY2
              //文字カウンターの更新
              charCount += 1
              //次の表示位置にする
              if(charCount < maxColChar2){
                baseX2 += lyricFontSize
              }else{
                baseX2 = sizeMonitor2["x1"]
                baseY2 += lyricFontSize
                charCount = 0
              }
              latestLyricEndTime = wordInfo._children[i]._data.endTime
            }
            maxChar2 = maxChar2-wordInfo._children.length
            wordInfo = wordInfo._next
          }
        }
      }
    //画面描画処理
    for(let i = 0 ; i < monitor1.length ; i++){
      if(monitor1[i][0] !== null && position+50 > monitor1[i][0]){//オブジェクトを追加する
        scenes["mainScene"].addChild(monitor1[i][2])
        monitor1[i][0] == null
      }
    }
    for(let i = 0 ; i < monitor2.length ; i++){
      if(monitor2[i][0] !== null && position+50 > monitor2[i][0]){//オブジェクトを追加する
        scenes["mainScene"].addChild(monitor2[i][2])
        monitor2[i][0] == null
      }
    }
    for(let i = 0 ; i < monitor3.length ; i++){
      if(monitor3[i][0] !== null && position+50 > monitor3[i][0]){//オブジェクトを追加する
        scenes["mainScene"].addChild(monitor3[i][2])
        monitor3[i][0] == null
      }
    }
    if(beforeLatestLyricEndTime < position  ){
      await deleteLryic(false)
    }
    beforePosition = position
    }
  }
}