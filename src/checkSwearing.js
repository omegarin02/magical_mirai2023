async function checkSwearing(input){
	negativeWord = [
		"おっぱい",
		"死ね",
		"ボケナス",
		"ボケ",
		"パパ活",
		"喧嘩",
		"えっち",
		"色ガチャ",
		"エッチ",
		"きも",
		"キモ",
		"しね",
		"死ね",
		"消え",
		"殺す",
		"オワコン",
		"氏ね",
		"氏んじゃえ",
		"パクリ",
		"ひどい",
		"キンキンする",
		"消費される",
		"キモ",
		"きしょ",
		"キショ",
		"気持ち悪い",
		"気持ちわるい",
        "ちんちん",
        "ペニス",
        "マンコ",
        "まんこ",
        "ぺにす",
        "射精",
        "シコシコ",
	]
	for(let i = 0; i < negativeWord.length ; i++){
		if(input.indexOf(negativeWord[i]) !== -1){
			return true
		}
	}
	return false
}