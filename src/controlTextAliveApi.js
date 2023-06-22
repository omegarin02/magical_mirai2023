const { Player } = TextAliveApp;
const DICT_PATH = "./dict"
//楽曲load用のタイマー
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
// プレイヤーの初期化 / Initialize TextAlive Player
const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: { token: "8KBfjCmqKXJE1Kut" },
  mediaElement: document.querySelector("#media"),
});
  
const overlay = document.querySelector("#overlay");
const bar = document.querySelector("#bar");
const textContainer = document.querySelector("#text");
let seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
seekbar.style.height = (10*compressionSquare).toString()+"px"
//seekbar.style.marginTop = (height - 10*compressionSquare).toString()+"px"
let b, c;
let playFlag = false;
let lyrics_id = 0;
let start_latest = 0;
let monitor_start_time = 0;
let timing_id = 0;
let monitor_timing_id=0;
let miku_position = 1;


player.addListener({
    /* APIの準備ができたら呼ばれる */
    onAppReady(app) {
      if (app.managed) {
        document.querySelector("#control").className = "disabled";
      }
      if (!app.songUrl) {
        // king妃jack躍 / 宮守文学 feat. 初音ミク
        player.createFromSongUrl("https://piapro.jp/t/ucgN/20230110005414");
      }
    },
  
  
    /* 楽曲情報が取れたら呼ばれる */
    onVideoReady(video) {
      // 最後に表示した文字の情報をリセット
      c = null;
      setMusicInfo()
    },
  
    /* 再生コントロールができるようになったら呼ばれる */
    onTimerReady() {
      //document.querySelector("#control > a#play").className = "";
      //document.querySelector("#control > a#stop").className = "";
    },
  
  
    /* 楽曲の再生が始まったら呼ばれる */
    onPlay() {
      const a = document.getElementById("musicStartButton")
      while (a.firstChild) a.removeChild(a.firstChild);

      a.appendChild(document.createTextNode("　⏸️　"));
      playFlag = true;
    },
  
    /* 楽曲の再生が止まったら呼ばれる */
    onPause() {
      const a =  document.getElementById("musicStartButton")
      while (a.firstChild) a.removeChild(a.firstChild);

      a.appendChild(document.createTextNode("　▶　"));
      playFlag = false;

    },
    onStop: () => {
      deleteLryic(true);
    },
    async onTimeUpdate(position) {
      // シークバーの表示を更新
      paintedSeekbar.style.width = `${
        parseInt((position * 1000) / player.video.duration) / 10
      }%`;
      //歌詞情報の更新
      await displayLyric(position,playFlag);
    }
  
  });
  //seekbar
  seekbar.addEventListener("click", async (e) => {
    e.preventDefault();
    nowPosition = (player.video.duration * e.offsetX) / seekbar.clientWidth 
    if (player) {
      player.requestMediaSeek(
        nowPosition
      );
    }
    await resetLyric(nowPosition)//TODO!!移動後のポジションを獲得しているからこれを何とかする
    return false;
  });
  /* 再生・一時停止ボタン */
  document.getElementById("musicStartButton").addEventListener("click", (e) => {
    e.preventDefault();
    if (player) {
      if (player.isPlaying) {
        player.requestPause();
      } else {
        player.requestPlay();
        //再生を停止したら、歌詞のインデックスをリセットする
        lyrics_id = 0;
        start_latest = 0;
        monitor_start_time = 0;
        timing_id = 0;
        monitor_timing_id=0;
      }
    }
    return false;
  });
  
  /* 停止ボタン */
  document.getElementById("musicStopButton").addEventListener("click", (e) => {
    e.preventDefault();
    if (player) {
      player.requestStop();
    }
    return false;
  });

function changeMusic(url){
  player.createFromSongUrl(url);
}


function checkChangeMusic(input){//TODO検索エンジンの強化
  musicUrlTitle = []
  maxScoreIndex = []
  maxScore = 0
  for(let i = 0; i < musicList.length ; i++){
    let score = 0
    //タイトル一致するか
    if(input.indexOf(musicList[i].title) !== -1){
      musicUrlTitle.push([musicList[i].title,musicList[i].url])
      maxScoreIndex = []
      break
    }
    if(input.indexOf(musicList[i].artist) !== -1){
      score++
    }
    if(input.indexOf(musicList[i].Voc) !== -1){
      score++
    }
    
    for(let j = 0 ; j < musicList[i].keyWord.length ; j++){     
      if(input.indexOf(musicList[i].keyWord[j]) !== -1){
        score++
      }
    }
    if(maxScore < score){
      maxScore = score
      maxScoreIndex = []
      maxScoreIndex.push(i)
    }else if (maxScore == score && score > 0 ){
      maxScoreIndex.push(i)
    }
  }
  if(musicUrlTitle.length == 0){//タイトルで曲が決まらなかった場合
    for(let i = 0 ; i < maxScoreIndex.length ; i++){
      index = maxScoreIndex[i]
      musicUrlTitle.push([musicList[index].title,musicList[index].url])
    }
  }
  if(musicUrlTitle.length == 0){
    return [[],false]
  }else{
    return [musicUrlTitle[Math.floor(Math.random() * musicUrlTitle.length)],true]
  }
}

const musicStartWord = [
  ["音楽","再生"],
  ["音楽","流して"],
  ["音楽","ながして"],
  ["音楽","かけて"],
  ["音楽","スタート"],
  ["曲","再生"],
  ["曲","流して"],
  ["曲","ながして"],
  ["曲","かけて"],
  ["曲","スタート"],
  ["ミュージック","スタート"],
  ["再生","スタート"],
]
const musicStopWord = [
  ["音楽","止めて"],
  ["音楽","とめて"],
  ["音楽","停止"],
  ["音楽","ストップ"],
  ["曲","止めて"],
  ["曲","とめて"],
  ["曲","停止"],
  ["曲","ストップ"],
  ["再生","ストップ"],
]

async function setMusicInfo(){
  artistTextBox.text = "✎："+player.data.song.artist.name
  titleTextBox.text = "♬："+player.data.song.name
}

async function checkStartStopWord(input,checkWordList){
  let checkFlag = false
  for (let i = 0 ; i < checkWordList.length ; i++){
    let rule = checkWordList[i]
    for (let j = 0 ; j < rule.length; j++){
      if(input.indexOf(rule[j]) !== -1){
        checkFlag = true
      }else{
        checkFlag = false
        break
      }
    }
    if(checkFlag){
      break
    }
  }
  return checkFlag
}

async function checkWantStatStopMusic(input){
  response = ""
  if(await checkStartStopWord(input,musicStartWord)){//再生コマンドのバリエーションを増やす
    if(playFlag && !player.isLoading){
      response = musicStartedResponse[Math.floor(Math.random() * musicStartedResponse.length)]
    }else{
      response = musicStartResponse[Math.floor(Math.random() * musicStartResponse.length)]
      while(player.isLoading){
        await sleep( 1000 );
      }
      setMusicInfo()
      player.requestPlay();
    }
  }else if(await checkStartStopWord(input,musicStopWord)){//停止コマンドのバリエーションを増やす
    if(playFlag){
      response = musicStopResponse[Math.floor(Math.random() * musicStopResponse.length)]
      player.requestStop();
    }else{
      response = musicStopedResponse[Math.floor(Math.random() * musicStopedResponse.length)]
    }
  }
  console.log(response)
  return response
}