let spotLightColor = ["white","blue","green","red","orange"]
let gain = 0.2
let sigmoidRenge = 20
let maxBrightness = 0.8
let minBrightness = 0.2
function clucAlphaFunc(x){//sigmoid
	let alpha = 1/(1+Math.exp(1)**(-gain*x))
	if(alpha > maxBrightness){
		alpha = maxBrightness
	}else if(alpha < minBrightness){
		alpha = minBrightness
	}
	return alpha
}
let nowBeatStartTime = 0
let nowBeatEndTime = 0

function lightsOut(){
	for (let i = 0 ; i < spotLightTriangles.length ; i++){
    spotLightTriangles[i].alpha = 0
	}
}

function controleSpotLight(position,playFlag){
  //ビート情報の取得
  let beatInfo = player.findBeat(position)
  //コード情報の取得
  let chordInfo = player.findChord(position)
  if(beatInfo?.next === undefined && position >=nowBeatEndTime){
		lightsOut()//ライトの消灯
		deleteLryic(true)//ディスプレイの歌詞を削除
	}

	if(nowBeatStartTime == 0 && nowBeatEndTime == 0){//楽曲が始まった直後
		nowBeatStartTime = beatInfo.startTime
		nowBeatEndTime = beatInfo.next.next.startTime - 1 
	}
	else if(position > nowBeatStartTime  && position < nowBeatEndTime){//ライトの明るさの変更をする
		let positionRate = (position - nowBeatStartTime)/(nowBeatEndTime - nowBeatStartTime)
		if(positionRate > 0.5){
			positionRate = (1 - positionRate) * 2
		}else{
			positionRate = positionRate*2
		}
		let x =  positionRate * sigmoidRenge - sigmoidRenge/2
		let brightness = clucAlphaFunc(x)
		for (let i = 0 ; i < spotLightTriangles.length ; i++){
			spotLightTriangles[i].alpha = brightness
			spotLightTriangles[i].tint = 0xffffff
		}
	}else if(beatInfo?.next?.next !== undefined){//seekbarによって再生位置が操作された場合
		nowBeatStartTime = beatInfo.startTime
		nowBeatEndTime = beatInfo.next.next.startTime - 1 
		//ライトの明るさ変更をする
	}
}

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