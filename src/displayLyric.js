let monitor1 = [] //(100,100) ~ (450,300) //[[startTime,endTime,Obj]]
let monitor2 = [] //(700,100) ~ (1200,300)
let monitor3 = [] //(1450,100) ~ (1800,300)
let mikuTension = 0
let screenMode = 0
let nextBuffer = 50
let lyricFontSize = 25*compressionSquare
let latestLyricEndTime = 0
let beforeLatestLyricEndTime = 0
let sizeMonitor1 = {"x1":100*compressionSquare,
                    "y1":100*compressionSquare,
                    "x2":450*compressionSquare,
                    "y2":300*compressionSquare,
                    "width":(450-100)*compressionSquare,
                    "height":(300-100)*compressionSquare}
let sizeMonitor2 = {"x1":750*compressionSquare,
                    "y1":100*compressionSquare,
                    "x2":1200*compressionSquare,
                    "y2":300*compressionSquare,
                    "width":(1200-700)*compressionSquare,
                    "height":(300-100)*compressionSquare}
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
//compressionSquare

//画面サイズの変動に伴って圧縮率を掛ける
//ベースとなる画面の大きさは1920x1080
//ベースのサイズで40pxサイズの文字を書いていて、縦幅と横幅が半分になったときは
//40 x 0.5 = 20 px を設定すると思うが毎回それをすると面倒なので
//40 x compressionSquare で求める。
//一般化すると、「ベースの時指定したい大きさ×compressionSquare」で必ず計算すること

//新しいテキストボックスの定義の方法
//let テキストボックス名（変数名） = new PIXI.Text( "デフォルトの文字", { 色の設定など } );
/* 色の設定などはこんな感じで書く
{
  fontFamily: 'Arial',
  fontSize: 36,
  fill: ['#000000'],
}
*/
//作ったテキストボックスを追加するとき
//scenes["mainScene"].addChild(テキストボックス名)
//作ったテキストボックスを追加するとき
//scenes["mainScene"].removeChild(テキストボックス名)
async function deleteLryic(allDelete){
  //削除処理
  for(let i = 0 ; i < monitor1.length ; i++){
    if(allDelete){
      scenes["mainScene"].removeChild(monitor1[i][2])
    }else if(beforeLyricNumberId >= monitor1[i][3]){//オブジェクトを追加する
      scenes["mainScene"].removeChild(monitor1[i][2])
      monitor1.shift()
      i =- 1
    }else{
      break
    }
  }
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

let redColors = ["#ff0000","#dc143c","#c71585","#ff1493","#ff6347"]
let greenColors = ["#008000","#2e8b57","#008080","#3cb371","#008b8b"]
let blueColors = ["#0000ff","#1e90ff","#4169e1","#00008b","#000080"]
let orengeColors = ["#ffa500","#f4a460","#d2691e","#ffd700","#ff4500"]
let purpleColors = ["#800080","#4b0082","#8a2be2","#9370db","#9932cc"]

function getLryricColor(pos){
  wordColor = "#eeeeee"
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

async function displayLyric(position,playFlag){
  //歌詞の表示を行うための関数
  //positionは再生位置が今どのへんか（ミリ秒)
    //positionは0以上の小数なので普通に四則演算ができる
  //playFlagは今音楽が再生されているか(再生されていたらture,されていなかったらfalse)
  //ビート情報の取得
  let beatInfo = player.findBeat(position+nextBuffer)
  //コード情報の取得
  let chordInfo = player.findChord(position+nextBuffer)
  //歌詞などの情報を取得
  let iVideoInfo = player.video
  let wordInfo = iVideoInfo.findWord(position+nextBuffer)
  let onePhrase = ""
  let endPhraseTime = 0
  //音楽が再生されているときの処理
  //console.log(position,playFlag)
  if(playFlag){
    //ビート情報の取り方
      //beatInfoにはpositionで指定した時間の情報が全て入っている
      //console.log(beatInfo)
        //次の情報(次のbeatInfoが見れる)
          //console.log(beatInfo.next)
        //前の情報(前のbeatInfoが見れる)
          //console.log(beatInfo.previous)
        //このビートが始まる時間
          //console.log(beatInfo.startTime)
        //このビートの長さ(4なら4拍分 多分...)
          //console.log(beatInfo.length)
        //何小節目か(多分？)
          //console.log(beatInfo.index)
    //コードの取り方
      //chordtInfoにはpositionで指定した時間の情報が全て入っている
      //console.log(chordInfo)
      //次の情報を取る(ない場合はnull)
        //onsole.log(chordInfo.next)
      //前の情報を取る(ない場合はnull)
        //console.log(chordInfo.next)
      //このコードが開始される時間(ミリ秒)
        //console.log(chordInfo.startTime)
      //このコードが終了する時間(ミリ秒)
        //console.log(chordInfo.endTime)
      //コードネーム
        //console.log(chordInfo.name)
    //歌詞情報の取りかた
    //wordInfoがnullの時はデータがないのでエラーが出る
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
          lyricFontSize = 70 * compressionSquare
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
          lyricFontSize = 70 * compressionSquare
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
          lyricFontSize = 70 * compressionSquare
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
          lyricFontSize = 70 * compressionSquare
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
          lyricFontSize = 70 * compressionSquare
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
          lyricFontSize = 80 * compressionSquare
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




        //ワンフレーズのデータ
          //console.log(wordInfo._children)
        //前のワンフレーズのデータ
          //console.log(wordInfo._previous)
        //次のワンフレーズのデータ
          //console.log(wordInfo._next)
        //ワンフレーズのデータ全部
          //console.log(wordInfo._data)
        //ワンフレーズの品詞情報
          //console.log(wordInfo._data.rawPoS)
        //ワンフレーズの終了時間
          //console.log(wordInfo._data.startTime)
        //endPhraseTime = wordInfo._data.startTime
        //ワンフレーズの開始時間
          //console.log(wordInfo._data.endTime)
        //ワンフレーズを一文字ずつ取り出す方法１つめ
        /*
        for(let i = 0 ; i < wordInfo._children.length ; i++){
          wordInfo._children[i]._color
          wordInfo._children[i]._data
          //歌詞の文字を取り出すには
          wordInfo._children[i]._data.char
          //歌詞を発声開始時間を取り出す
          wordInfo._children[i]._data.startTime
          //歌詞を発声終了時間を取り出す
          wordInfo._children[i]._data.endTime
          onePhrase+=wordInfo._children[i]._data.char
          //ワンフレーズ最後の時間を取得
        }
        */
        //ワンフレーズを一文字ずつ取り出す方法２つめ
        /*
        for(let i = 0 ; i < wordInfo._data.characters.length ; i++){
          
          //文字
            //console.log(wordInfo._data.characters[i].char)
          //発声開始タイミング
            //console.log(wordInfo._data.characters[i].startTime)
          //発声終了タイミング
            //console.log(wordInfo._data.characters[i].endTime)
        }
        */
    }
  }
}