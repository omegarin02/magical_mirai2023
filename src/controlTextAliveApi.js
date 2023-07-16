const { Player } = TextAliveApp;
const DICT_PATH = "./dict"
//楽曲load用のタイマー
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
// プレイヤーの初期化 / Initialize TextAlive Player
const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: { token: "8KBfjCmqKXJE1Kut" },
  mediaElement: document.querySelector("#media"),
  valenceArousalEnabled: true,
  vocalAmplitudeEnabled: true,
});

const overlay = document.querySelector("#overlay");
const bar = document.querySelector("#bar");
const textContainer = document.querySelector("#text");
let seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
seekbar.style.height = (10*compressionSquare).toString()+"px"
let b, c;
let playFlag = false;
let lyrics_id = 0;
let start_latest = 0;
let monitor_start_time = 0;
let timing_id = 0;
let monitor_timing_id=0;
let miku_position = 1;
let moveInterval = 100
let baseMusicInfoX = 1450
let baseMusicInfoY = 1050
//楽曲を再生するためのワード
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
//楽曲を停止するためのワード
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
  ["ミュージック","ストップ"],
]
//楽曲の音量を上げるためのワード
const volumeUpWord = [
  ["音量","上げて"],
  ["音量","あげて"],
  ["音量","大きく"],
  ["音量","小さい"],
  ["ボリューム","上げて"],
  ["ボリューム","あげて"],
  ["ボリューム","大きく"],
  ["ボリューム","小さい"],
  ["音楽","小さい"],
  ["音楽","聴こえない"],
  ["音楽","きこえない"],
  ["音","上げて"],
  ["音","あげて"],
  ["音","大きく"],
  ["音","小さい"],
  ["音","聴こえない"],
  ["音","きこえない"],
]
//楽曲の音量を下げるためのワード
const volumeDownWord = [
  ["音量","下げて"],
  ["音量","さげて"],
  ["音量","小さく"],
  ["音量","大きい"],
  ["ボリューム","下げて"],
  ["ボリューム","さげて"],
  ["ボリューム","小さく"],
  ["ボリューム","大きい"],
  ["音楽","でかい"],
  ["音楽","うるさい"],
  ["音","下げて"],
  ["音","さげて"],
  ["音","小さく"],
  ["音","大きい"],
  ["音","うるさい"],
]



player.addListener({
    /* APIの準備ができたら呼ばれる */
    onAppReady(app) {
      if (app.managed) {
        document.querySelector("#control").className = "disabled";
      }
      if (!app.songUrl) {
        // king妃jack躍 / 宮守文学 feat. 初音ミク
        //デフォルトの曲目を設定
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
      ;
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
      lightsOut()
      deleteLryic(true);
    },
    async onTimeUpdate(position) {
      // シークバーの表示を更新
      paintedSeekbar.style.width = `${
        parseInt((position * 1000) / player.video.duration) / 10
      }%`;
      //歌詞情報の更新
      await displayLyric(position,playFlag);
      controleSpotLight(position,playFlag);
      danceMotion(position,playFlag);
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
    await resetLyric(nowPosition)
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
      lightsOut()
      deleteLryic(true);
    }
    return false;
  });

function changeMusic(url){
  player.createFromSongUrl(url);
}

//テキストによる楽曲検索機能
//データは、musicList.jsで定義している
function checkChangeMusic(input){
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
    //アーティスト情報が一致するか
    if(input.indexOf(musicList[i].artist) !== -1){
      score++
    }
    //使用しているボーカロイドが一致するか
    if(input.indexOf(musicList[i].Voc) !== -1){
      score++
    }
    //あらかじめ登録した楽曲に対するキーワードが一致するか
    for(let j = 0 ; j < musicList[i].keyWord.length ; j++){     
      if(input.indexOf(musicList[i].keyWord[j]) !== -1){
        score++
      }
    }
    //最も検索スコアが良かったものを検索結果として使用する
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

//楽曲情報をセットして画面上に表示する
async function setMusicInfo(){
  for (let i = 0; i < musicInfoTexts.length; i++){//楽曲情報の表示を全て削除
    scenes["mainScene"].removeChild(musicInfoTexts[i])
  }
  musicInfoTexts = [];
  let musicInfo="✎："+player.data.song.artist.name + " " +"♬："+player.data.song.name+ " "
  let MusicInfoArray = [...musicInfo]
  nowSongName = player.data.song.name
  for (let i = 0 ; i < MusicInfoArray.length ; i++ ){
    musicInfoChar = new PIXI.Text( MusicInfoArray[i], { fill: 0x33ffff,fontSize: fontSize,fontFamily: textfont } )
    musicInfoChar.x =baseMusicInfoX * compressionSquare + fontSize * i
    musicInfoChar.y =baseMusicInfoY * compressionSquare - fontSize
    musicInfoTexts.push(musicInfoChar)
    scenes["mainScene"].addChild(musicInfoTexts[musicInfoTexts.length-1])
  }
}

//入力されたテキストに、楽曲の再生・停止命令が含まれているか確認する
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

//入力されたテキストに、音量操作命令が含まれているか確認する
async function checkVolumeUpDownWord(input,checkWordList){
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


//入力されたテキストに、楽曲の再生・停止命令が含まれている場合は楽曲を再生・停止する
async function checkWantStatStopMusic(input){
  response = ""
  if(await checkStartStopWord(input,musicStartWord)){//再生コマンドのバリエーションを増やす
    if(playFlag && !player.isLoading){
      response = musicStartedResponse[Math.floor(Math.random() * musicStartedResponse.length)]
    }else{
      //楽曲変更の希望があるか
      let musicUrl = checkChangeMusic(input)//複数候補がある場合ランダムで１曲選ぶ
      if(musicUrl[1]){
        changeMusic(musicUrl[0][1])
      }
      response = musicStartResponse[Math.floor(Math.random() * musicStartResponse.length)]
      deleteLryic(true);
      while(player.isLoading){
        await sleep( 1000 );
      }
      setMusicInfo()
      player.requestPlay();
    }
  }else if(await checkStartStopWord(input,musicStopWord)){
    deleteLryic(true);
    if(playFlag){
      response = musicStopResponse[Math.floor(Math.random() * musicStopResponse.length)]
      player.requestStop();
    }else{
      response = musicStopedResponse[Math.floor(Math.random() * musicStopedResponse.length)]
    }
  }
  return response
}

//入力されたテキストに、音量調整の命令が含まれている場合は楽曲の音量を調整する
async function volumeUpDown(input){
  let response = ""
  let nowVolume = player.volume
  if(await checkVolumeUpDownWord(input,volumeUpWord)){
    if(nowVolume == 100){//音量MAXの時
      response = maxVolumeResponse[Math.floor(Math.random() * maxVolumeResponse.length)]
    }else if(nowVolume > 90){
      player.volume = 100
      response = volumeUpResponse[Math.floor(Math.random() * volumeUpResponse.length)]
    }else{
      player.volume += 10
      response = volumeUpResponse[Math.floor(Math.random() * volumeUpResponse.length)]
    }
  }else if(await checkVolumeUpDownWord(input,volumeDownWord)){
    if(nowVolume == 0){//音量MINの時
      response = minVolumeResponse[Math.floor(Math.random() * minVolumeResponse.length)]
    }else if(nowVolume < 10){
      player.volume = 0
      response = volumeDownResponse[Math.floor(Math.random() * volumeDownResponse.length)]
    }else{
      player.volume -= 10
      response = volumeDownResponse[Math.floor(Math.random() * volumeDownResponse.length)]
    }
  }

  return response
}


//楽曲情報を自動でするための関数
function moveMusicInfo(){
  let musicInfoLen = musicInfoTexts.length
  for(let i = 0; i < musicInfoLen ; i++){
    if(musicInfoTexts[i].x < baseMusicInfoX * compressionSquare){
      if(i == 0){
        musicInfoTexts[i].x = musicInfoTexts[musicInfoLen-1].x + fontSize
      }else{
        musicInfoTexts[i].x = musicInfoTexts[i-1].x + fontSize
      }
    }else{
      musicInfoTexts[i].x -= 3* compressionSquare
    }
  }
}


setInterval(moveMusicInfo,moveInterval)