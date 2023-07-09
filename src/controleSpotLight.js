let spotLightColor = [0xffffff,0x0000ff,0x008000,0xff0000,0xffa500]//[0xffffff]
let spotLightBrightPattern = [
															[
																[0,2,4],[[0,0,0],[0,1,0],[0,1,2]]
															],
															[
																[1,3],[[0,0]]
															],
															[
																[0,1,3,4],[[0,0,1,1],[0,0,0,0],[0,1,1,0]]
															],
															[
																[0,1,2,3,4],[[0,0,0,0,0],[0,0,1,0,0],[0,1,1,1,0],[0,1,0,1,0]]
															]
]
let gain = 0.2
let sigmoidRenge = 20
let maxBrightness = 0.8
let minBrightness = 0.2
let nowBeatStartTime = 0
let nowBeatEndTime = 0
let pattern
let lightColor1
let lightColor2
let lightColor3
let changedFlag = false

function clucAlphaFunc(x){//sigmoid
	let alpha = 1/(1+Math.exp(1)**(-gain*x))
	if(alpha > maxBrightness){
		alpha = maxBrightness
	}else if(alpha < minBrightness){
		alpha = minBrightness
	}
	return alpha
}


function lightsOut(){
	for (let i = 0 ; i < spotLightTriangles.length ; i++){
    spotLightTriangles[i].alpha = 0
		spotLightCirclesBack[i].alpha = 0
		spotLightCirclesFront[i].alpha = 0
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
			if(useLightPattern.indexOf(i) !== -1){//使うスポットライト
				spotLightTriangles[i].alpha = brightness
				spotLightCirclesBack[i].alpha = brightness
				spotLightCirclesFront[i].alpha = brightness
			}else{//使わない電球
				spotLightTriangles[i].alpha = 0
				spotLightCirclesBack[i].alpha = 0
				spotLightCirclesFront[i].alpha = 0
			}
		}
	}else if(beatInfo?.next?.next !== undefined){//seekbarによって再生位置が操作された場合
			nowBeatStartTime = beatInfo.startTime
			nowBeatEndTime = beatInfo.next.next.startTime - 1 
			//ライトの明るさ変更をする
	}
	if(beatInfo.position == 1 && changedFlag===false){
		pattern = spotLightBrightPattern[Math.floor(Math.random() * spotLightBrightPattern.length)]
		lightColor1 = spotLightColor[Math.floor(Math.random() * spotLightColor.length)]
		lightColor2 = spotLightColor[Math.floor(Math.random() * spotLightColor.length)]
		lightColor3 = spotLightColor[Math.floor(Math.random() * spotLightColor.length)]
		useLightPattern = pattern[0]
		colorPattern = pattern[1][Math.floor(Math.random() * pattern[1].length)]
		colorCounter = 0
		for (let i = 0 ; i < spotLightTriangles.length ; i++){
			if(useLightPattern.indexOf(i) !== -1){//使うスポットライト
				colorPatternNum = colorPattern[colorCounter]
				if(colorPatternNum == 0){
					spotLightTriangles[i].tint = lightColor1
					spotLightCirclesBack[i].tint = lightColor1
					spotLightCirclesFront[i].tint = lightColor1
				}else if(colorPatternNum == 1){
					spotLightTriangles[i].tint = lightColor2
					spotLightCirclesBack[i].tint = lightColor2
					spotLightCirclesFront[i].tint = lightColor2
				}else if(colorPatternNum == 2){
					spotLightTriangles[i].tint = lightColor3
					spotLightCirclesBack[i].tint = lightColor3
					spotLightCirclesFront[i].tint = lightColor3
				}
				colorCounter++
			}
		}
		changedFlag = true
	}else if(beatInfo.position != 1){
		changedFlag = false
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