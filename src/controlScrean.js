//index.jsで使うのでスコープを外す
let app;

// PixiJS
let {
  Application, live2d: { Live2DModel }
} = PIXI;

// Kalidokit
let {
  Face, Vector: { lerp }, Utils: { clamp }
} = Kalidokit;


// 1, Live2Dモデルへのパスを指定する
let modelUrl = "miku2023/miku2023.model3.json";
let currentModel;
let width = Math.floor(window.innerWidth*0.98);
let height = Math.floor(window.innerHeight*0.98);
//scenes
let scenes = {}


//描画領域を作成する
app = new PIXI.Application({
  view: document.getElementById("my-live2d"),
  autoStart: true,
  backgroundAlpha: 0,
  backgroundColor: 0x000000,
  width: width,
  height: height
});
//ボタンの定義
let startButtonDiv = document.getElementById("startButtonDiv")
let exitButtonDiv = document.getElementById("exitButtonDiv")
let homeButtonDiv = document.getElementById("homeButtonDiv")
let inputChatboxDiv = document.getElementById("inputChatboxDiv")
let sendButtonDiv = document.getElementById("sendButtonDiv")


async function setStartScene(){
  const startScene = new PIXI.Container()
  /*
  let background = PIXI.Sprite.fromImage('img/start.png');
  background.anchor.set(0.5);
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
  background.height = app.screen.height;
  background.width = app.screen.width;
  //startScene.addChild(background)
  //app.stage.addChild(startScene);
  */
  scenes["startScene"] = startScene

  //let startButton = document.getElementById('startButton');
  //ボタンを作る

}

async function setMainScene(){
  const mainScene = new PIXI.Container()
  //Live2Dモデルをロードする
  currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
  currentModel.scale.set(0.2);//モデルの大きさ★
  currentModel.interactive = true;
  currentModel.anchor.set(0.3, 0.3);//モデルのアンカー★
  currentModel.position.set(window.innerWidth/3, window.innerHeight/3);//モデルの位置★

  //背景を設定
  let background = PIXI.Sprite.fromImage('img/stage.jpg');
  background.anchor.set(0.5);
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
  background.height = app.screen.height;
  background.width = app.screen.width;
  mainScene.addChild(background)
  // 6, Live2Dモデルを配置する
  mainScene.addChild(currentModel)
  app.stage.addChild(mainScene);
  scenes["mainScene"] = mainScene


}

async function setEndScene(){
  const endScene = new PIXI.Container()
  /*
  let background = PIXI.Sprite.fromImage('img/end.png');
  background.anchor.set(0.5);
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
  background.height = app.screen.height;
  background.width = app.screen.width;
  endScene.addChild(background)
  app.stage.addChild(endScene);
  */
  scenes["endScene"] = endScene


}
//アプリの読み込み
async function setup() { 
  //画面定義
  await setStartScene()//startSceneの定義
  await setMainScene()
  await setEndScene()
  scenes["startScene"].visible = true
  scenes["mainScene"].visible = false
  scenes["endScene"].visible = false

  startButtonDiv.insertAdjacentHTML('afterbegin', startButtonHtml);
  let startButton = document.getElementById("startButton")
  startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})
  /*
  let startButton = document.createElement("button")
  startButton.innerHTML = "start"
  startButtonDiv.appendChild(startButton)
  startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})
  startButton.setAttribute("id","startButton")
  */
}

//画面サイズを自動的にリサイズ
function screenResize() {
  let wid = window.innerWidth;//ゲームを表示できる最大横幅
  let hei = window.innerHeight;//ゲームを表示できる最大縦幅
  let x =  window.innerWidth;
  let y =  window.innerHeight;
  app.stage.scale.x = app.stage.scale.y = 1;//スクリーン幅が十分の時は画面倍率を1にする
  resizeRatio = Math.min(wid/width, hei/height);//横幅と縦幅の、ゲーム画面に対する比のうち小さい方に合わせる
  
  if(wid < width || hei < height) {//スクリーン幅が足りないとき
      //リサイズ倍率を調整
      x = width*resizeRatio; 
      y = height*resizeRatio; 
      app.stage.scale.x = resizeRatio;
      app.stage.scale.y = resizeRatio;
  }
  
  app.renderer.resize(x, y);//レンダラーをリサイズ
}
//画面サイズがリサイズされると発火する関数の定義
window.addEventListener('resize',screenResize,false);

function sendButtonOnClick(){
  console.log("send")
  let inputText = document.getElementById("inputText")
  console.log(inputText.value)//入力したテキストを取得
  inputText.value = ""
}


function changeScene(e){
  for (let scene in scenes){//画面の切り替え
    if(scene == this.scene){
      scenes[this.scene].visible = true
    }else{
      scenes[scene].visible = false
    }
  }
  //画面に表示するパーツ類の切り替え
  if(this.scene == "mainScene"){//メイン画面に切り替えたとき
    let startButton = document.getElementById("startButton")
    startButton.remove()

    exitButtonDiv.insertAdjacentHTML('afterbegin', exitButtonHtml);
    let exitButton = document.getElementById("exitButton")
    exitButton.addEventListener("click",{scene: "endScene",handleEvent:changeScene})
    inputChatboxDiv.insertAdjacentHTML('afterbegin', inputChatBoxHtml);
    
    sendButtonDiv.insertAdjacentHTML('afterbegin', commentSendButtonHtml);
    let sendButton = document.getElementById("commentSendButton")
    sendButton.addEventListener("click",sendButtonOnClick)
    
  }
  else if (this.scene == "endScene"){//end画面に切り替えたとき
    let exitButton = document.getElementById("exitButton")
    let inputChatBox = document.getElementById("inputChatBox")
    let sendButton = document.getElementById("commentSendButton")
    exitButton.remove()
    inputChatBox.remove()
    sendButton.remove()

    homeButtonDiv.insertAdjacentHTML('afterbegin', homeButtonHtml);
    let homeButton = document.getElementById("homeButton")
    homeButton.addEventListener("click",{scene: "startScene",handleEvent:changeScene})



  }else if(this.scene == "startScene"){
    let homeButton = document.getElementById("homeButton")
    homeButton.remove()

    startButtonDiv.insertAdjacentHTML('afterbegin', startButtonHtml);
    let startButton = document.getElementById("startButton")
    startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})
  
  }
}


//画面情報をセットアップ
setup()