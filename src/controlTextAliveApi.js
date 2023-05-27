const { Player } = TextAliveApp;
const DICT_PATH = "./dict"
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
//seekbar.style.width = (width).toString()+"px"
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
        document.querySelector("#media").className = "disabled";
        player.createFromSongUrl("https://piapro.jp/t/ucgN/20230110005414");
      }
    },
  
  
    /* 楽曲情報が取れたら呼ばれる */
    onVideoReady(video) {
      // 最後に表示した文字の情報をリセット
      c = null;
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

      a.appendChild(document.createTextNode("⏸️"));
      playFlag = true;
    },
  
    /* 楽曲の再生が止まったら呼ばれる */
    onPause() {
      const a =  document.getElementById("musicStartButton")
      while (a.firstChild) a.removeChild(a.firstChild);

      a.appendChild(document.createTextNode("▶️"));
      playFlag = false;

    },
    onStop: () => {
      ;
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
  seekbar.addEventListener("click", (e) => {
    e.preventDefault();
    if (player) {
      player.requestMediaSeek(
        (player.video.duration * e.offsetX) / seekbar.clientWidth
      );
    }
    lyrics = player.video.getChar(lyrics_id)
    if(lyrics.startTime < position){
      timing_id = 0;
      lyrics_id = 0;
    }
    
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