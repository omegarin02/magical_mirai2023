//チャットに含まれている単語が、どれだけデータセットに入っているか計算するスクリプト
let mikuVocabArray = []

for(let i = 0 ; i <  responseData.length ; i++){
	question = responseData[i]["question"]
	mikuVocabArray = mikuVocabArray.concat(question)
}

const mikuVocab = new Set(mikuVocabArray)//知っている単語数をセット

function checkKnowWords(input){//知っている単語の数を計算
	knowCounter = 0
	for(let i = 0 ; i < input.length ; i++){
		if(mikuVocab.has(input[i])){
			knowCounter += 1
		}
	}
	console.log(knowCounter/input.length)
	return knowCounter/input.length
}
