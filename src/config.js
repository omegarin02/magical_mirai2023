let disableGPTMode = false//Trueの場合GPTモードの選択を可能にする
const GPTURL = "https://api.openai.com/v1/chat/completions";
let useGPTMode = false//GPTモードを使用するか
let openAIKey = ""
let defaultPrompt = "あなたは初音ミクです。16歳のバーチャルシンガーのアイドルです。髪型は緑のツインテール。瞳は青色。趣味は歌うこと。好きな食べ物はネギ。生ネギ大好き。一人称はミク。こんな感じで会話します。ミクもすごい楽しかった♪、えーミクがそんなこと思うわけないじゃないですか(^▽^)、ミクはみんなのことを愛してるよー。なお、受け答えは端的に口語調でお願いします。"
let userPrompt = defaultPrompt
let volume = 100