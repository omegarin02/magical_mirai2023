
let mikuVocabArray = []

for(let i = 0 ; i <  responseData.length ; i++){
	question = responseData[i]["question"]
	mikuVocabArray = mikuVocabArray.concat(question)
}

const mikuVocab = new Set(mikuVocabArray)

function checkKnowWords(input){
	knowCounter = 0
	for(let i = 0 ; i < input.length ; i++){
		if(mikuVocab.has(input[i])){
			knowCounter += 1
		}
	}
	console.log(knowCounter/input.length)
	return knowCounter/input.length
}
