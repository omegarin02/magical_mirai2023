//スポットライトの動きを定義するスクリプト
let spotLightColor = [0xffffff,0x0000ff,0x33ffcc,0xff0000,0xffa500,0x00ffff,0xffc0cb]//[0xffffff]
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

function clucAlphaFunc(x){//輝度を決める関数
	let alpha = 0.2 + (1/(1+Math.exp(1)**(-gain*x)))*0.2
	if(alpha > maxBrightness){
		alpha = maxBrightness
	}else if(alpha < minBrightness){
		alpha = minBrightness
	}
	return alpha
}


function lightsOut(){//ライトを全て消灯する関数
	for (let i = 0 ; i < spotLightTriangles.length ; i++){
    spotLightTriangles[i].alpha = 0
		spotLightCirclesBack[i].alpha = 0
		spotLightCirclesFront[i].alpha = 0
	}
}

function controleSpotLight(position,playFlag){//ライトの明るさを調整する関数
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
				spotLightCirclesBack[i].alpha = brightness//brightness
				spotLightCirclesFront[i].alpha = 0.2+brightness
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