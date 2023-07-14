let motionDecision = [
	{"a":0.4,"v":0.3,"motion":[5]},
	{"a":0.4,"v":0.2,"motion":[14]},
	{"a":0.4,"v":0.0,"motion":[2]},
	{"a":0.4,"v":-1,"motion":[9]},
	{"a":0.3,"v":0.3,"motion":[10]},
	{"a":0.3,"v":0.2,"motion":[4,2]},
	{"a":0.3,"v":0.0,"motion":[4]},
	{"a":0.3,"v":-0.2,"motion":[7]},
	{"a":0.2,"v":0.2,"motion":[12,6]},
	{"a":0.2,"v":0.1,"motion":[11]},
	{"a":0.2,"v":-0.1,"motion":[15]},
	{"a":0.1,"v":0.1,"motion":[15]},
	{"a":0.1,"v":-0.1,"motion":[13]},
	{"a":0.1,"v":-1,"motion":[15]},
	{"a":0.0,"v":0.0,"motion":[8]},
	{"a":0.0,"v":-0.1,"motion":[3]},
	{"a":-0.1,"v":-0.1,"motion":[1]},
	{"a":-0.2,"v":0.1,"motion":[7]},
	{"a":-0.2,"v":-0.2,"motion":[3]},
	{"a":-0.3,"v":0.0,"motion":[7]},
	{"a":-0.3,"v":-1.0,"motion":[9]},
	{"a":-0.4,"v":0.0,"motion":[7]},
	{"a":-0.4,"v":-0.2,"motion":[15]},
	{"a":-1.0,"v":0.0,"motion":[11]},
	{"a":-1.0,"v":-1.0,"motion":[0]},
]

let beatCounter = 0
let counterFlag = false

function danceMotion(position,playFlag){
	let beatInfo = player.findBeat(position)
	if(playFlag){
		if(beatInfo.position == 1 && counterFlag === false){
			beatCounter += 1
			counterFlag = true
			if(beatCounter == 2){
				console.log(player.getValenceArousal(position))//a 覚醒度, v 感情価
				let valenceArousal = player.getValenceArousal(position)
				console.log(valenceArousal.a,valenceArousal.v)
				for(let i = 0 ; i < motionDecision.length; i++){
					let motionD = motionDecision[i]
					if(motionD.a <= valenceArousal.a && motionD.v <= valenceArousal.v){
						console.log(motionD)
						motionArray = motionD["motion"]
						motionNum = Math.floor(Math.random() * motionArray.length)
						Motion(motionArray[motionNum])
						break;
					}
				}
				beatCounter = 0
			}
		}else if(beatInfo.position != 1){
			counterFlag = false
		}
	}
	
}