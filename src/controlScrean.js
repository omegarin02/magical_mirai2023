//index.jsで使うのでスコープを外す
let app;
let fontSize = 25*compressionSquare
let lyricText = new PIXI.Text( "", { fill: 0xffffff } );
let chatTextBox = new PIXI.Text( "", { fill: "blue",fontSize: fontSize } );
let artistTextBox = new PIXI.Text( "", { fill: "blue",fontSize: fontSize } );
let titleTextBox = new PIXI.Text( "", { fill: "blue",fontSize: fontSize } );

// PixiJS
let {
  Application, live2d: { Live2DModel }
} = PIXI;

// Kalidokit
let {
  Face, Vector: { lerp }, Utils: { clamp }
} = Kalidokit;

//ボタンの定義
let startButtonDiv = document.getElementById("startButtonDiv")
let exitButtonDiv = document.getElementById("exitButtonDiv")
let homeButtonDiv = document.getElementById("homeButtonDiv")
let inputChatboxDiv = document.getElementById("inputChatboxDiv")
let sendButtonDiv = document.getElementById("sendButtonDiv")
let musicStartStopButtonDiv = document.getElementById("musicStartStopButtonDiv")
let musicStartButton = document.getElementById("musicStartButton")
let musicStopButton = document.getElementById("musicStopButton")
//その他のdivの定義
let mediaInfoDiv = document.getElementById("mediaInfo")
let canvasDiv = document.getElementById("canvasDiv")
//seekbarの定義はcontrolTextAliveApi.jsで実施

// 1, Live2Dモデルへのパスを指定する
let modelUrl = "miku2023/miku2023.model3.json";
let currentModel;


//スクリーンのパディング調整
canvasDiv.style.paddingLeft = ((window.innerWidth-width)/2).toString()+"px"
canvasDiv.style.paddingTop = ((Math.floor(window.innerHeight)-height)/2).toString()+"px"

//startbuttonのサイズ調整
  //buttonParts.jsで実施
//homebuttonのサイズ調整
  //buttonParts.jsで実施
//入力欄のサイズ・位置調整
let inputTextWidth = 1200*compressionSquare
inputChatboxDiv.style.width = inputTextWidth.toString()+"px"
inputChatboxDiv.style.marginLeft = (leftMarginNum+10).toString()+"px"
inputChatboxDiv.style.marginTop = (maxmMarginTopNum-(18+28+30)*compressionSquare ).toString()+"px"//18pxはフォントサイズ
//送信ボタンの位置調整
  //大きさ調整はbuttonParts.js
sendButtonDiv.style.marginLeft = (leftMarginNum+inputTextWidth+(20+95)*compressionSquare).toString()+"px"
sendButtonDiv.style.marginTop = (maxmMarginTopNum-(18+28+25)*compressionSquare ).toString()+"px"//18pxはフォントサイズ

//再生ボタンとかの位置調整
musicStartStopButtonDiv.style.marginLeft = (leftMarginNum).toString()+"px"
musicStartStopButtonDiv.style.marginTop = (45).toString()+"px"
musicStartButton.style.fontSize = (20*compressionSquare).toString()+"px"
musicStopButton.style.fontSize = (20*compressionSquare).toString()+"px"
//exitボタンの位置調整
  //大きさ調整はbuttonParts.js
exitButtonDiv.style.marginLeft = (leftMarginNum).toString()+"px"

//seekbar
  //一部はcontrolTextAliveApi.jsで実施
seekbar.style.marginLeft = (leftMarginNum).toString()+"px"
seekbar.style.marginTop = (maxmMarginTopNum-10*compressionSquare ).toString()+"px"


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

async function setStartScene(){
  const startScene = new PIXI.Container()
  scenes["startScene"] = startScene

  //let startButton = document.getElementById('startButton');
  //ボタンを作る

}

async function setMainScene(){
  const mainScene = new PIXI.Container()
  //Live2Dモデルをロードする
  currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });

  currentModel.scale.set(0.3*compressionSquare);//モデルの大きさ★
  currentModel.interactive = true;
  //currentModel.anchor.set(0.3, 0.3);//モデルのアンカー★
  currentModel.position.set(650*compressionSquare,250*compressionSquare)//window.innerWidth/3, window.innerHeight/3);//モデルの位置★

  //背景を設定
  let background = PIXI.Sprite.fromImage('img/stage.png');
  background.width = app.screen.width
  background.height = app.screen.height
  background.x = 0;
  background.y = 0
  background.height = app.screen.height;
  background.width = app.screen.width;
  chatTextBox.x = 1080 * compressionSquare  //TODO 後で治す
  chatTextBox.y = 360 *compressionSquare - fontSize//TODO 後で治す
  chatTextBox.angle = 2.5

  artistTextBox.x = 1500 * compressionSquare
  artistTextBox.y = 10 * compressionSquare
  titleTextBox.x = 1500 * compressionSquare
  titleTextBox.y = 40 * compressionSquare

  //デバッグ用のグリッド線
  const gridHorizontalArray = []
  const gridVerticalArray  = []
  for (let i = 0 ; i*50*compressionSquare < height ; i++){
    gridHorizontalArray.push(new PIXI.Graphics())
    if( (i*50) % 250 == 0 ){
      gridHorizontalArray[i].lineStyle(1, 0xFF0000);
    }else{
      gridHorizontalArray[i].lineStyle(1, 0x00FFFF);
    }
    gridHorizontalArray[i].moveTo(0,i*50*compressionSquare)
    gridHorizontalArray[i].lineTo(width,i*50*compressionSquare);
  }
  for (let i = 0 ; i*50*compressionSquare < width ; i++){
    gridVerticalArray.push(new PIXI.Graphics())
    if( (i*50) % 250 == 0 ){
      gridVerticalArray[i].lineStyle(1, 0xFF0000);
    }else{
      gridVerticalArray[i].lineStyle(1, 0x00FFFF);
    }
    gridVerticalArray[i].moveTo(i*50*compressionSquare,0)
    gridVerticalArray[i].lineTo(i*50*compressionSquare,height);
  }
  //背景を配置する
  mainScene.addChild(background)
  // 6, Live2Dモデルを配置する
  
  mainScene.addChild( lyricText );
  mainScene.addChild(chatTextBox)
  mainScene.addChild(artistTextBox)
  mainScene.addChild(titleTextBox)
  mainScene.addChild(currentModel)
  
  for (let i = 0 ; i < gridHorizontalArray.length ; i++){
    mainScene.addChild(gridHorizontalArray[i])
  }
  for (let i = 0 ; i < gridVerticalArray.length ; i++){
    mainScene.addChild(gridVerticalArray[i])
  }

  app.stage.addChild(mainScene);
  scenes["mainScene"] = mainScene
}

async function setEndScene(){
  const endScene = new PIXI.Container()
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
  canvasDiv.style.paddingLeft = (Math.floor(window.innerWidth)-width)/2
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
      scenes["mainScene"].children[1].scale.x = resizeRaito
      scenes["mainScene"].children[1].scale.y = resizeRaito
      scenes["mainScene"].children[1].scale.x = resizeRaito
      scenes["mainScene"].children[1].scale.y = resizeRaito
  }
  
  app.renderer.resize(x, y);//レンダラーをリサイズ
}
//画面サイズがリサイズされると発火する関数の定義
//window.addEventListener('resize',screenResize,false);

function sendButtonOnClick(){
  console.log("send")
  let inputText = document.getElementById("inputText")
  console.log(inputText.value)//入力したテキストを取得
  showChatLog(inputText.value,chatTextBox)
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

    musicStartStopButtonDiv.style.zIndex=3
    exitButtonDiv.style.zIndex=3
    seekbar.style.width = (width).toString()+"px"
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

    musicStartStopButtonDiv.style.zIndex=-3
    mediaInfoDiv.style.zIndex=-3
    seekbar.style.Zindex=-3
    seekbar.style.width = (0).toString()+"px"
    player.requestStop();
    

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