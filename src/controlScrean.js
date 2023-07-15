//画面遷移等を制御する関数
let app;//画面を格納する変数
let fontSize = 25*compressionSquare//デフォルトの文字のサイズを定義
let textfont = "RocknRoll One"//フォント名
let chatTextBox = new PIXI.Text( "", { fill: 0x00ac9b,fontSize: 22.5*compressionSquare,fontFamily: textfont } );//chatのログの表示用
let nowVolumeTextBox = new PIXI.Text( "", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );//現在の音量表示用
let openAIKeyLabelText = new PIXI.Text( "OPENAI KEY(自己責任でお願いします。※GPTモードは有料です。)", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let promptLabelText = new PIXI.Text( "Prompt(モデル：gpt-3.5-turbo)", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let requestLabelText = new PIXI.Text( "GPTへのリクエストは[{'system':prompt},{'user':チャット}]。チャットは最新の1会話分", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let musicInfoTexts = []//楽曲情報を格納しておくための配列
let marginStage = -50*3.5/2 //ステージの位置を調整
let lightRadius = 200//スポットライトの最大半径
let lightHeight = 880 //スポットライトの高さ
let spotLightInterval = 343//スポットライトの左右方向の間隔
let spotLightTriangles = []//スポットライトの台形の部分を格納する変数
let spotLightCirclesBack = []//スポットライト三角錐の底の部分
let spotLightCirclesFront = []//スポットライトの床の光のPartsを格納する関数
let sportLightGradationStart = "#808080" //スポットライトのGradation開始カラー
let sportLightGradationSecond = "#d3d3d3"//スポットライトのGradation中間カラー
let sportLightGradationEnd = "#FFFFFF"//スポットライトのGradation終端カラー
let lightSourceWidth = 20//光源の太さ
let vanishingPoint = 25//光の消失点(スポットライト高さからの差分)



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
let homeButtonDiv = document.getElementById("homeButtonDiv")
let inputChatboxDiv = document.getElementById("inputChatboxDiv")
let sendButtonDiv = document.getElementById("sendButtonDiv")
let configPageDiv = document.getElementById("configPageDiv")
let configDecisionButtonDiv = document.getElementById("configDecisionButtonDiv")
let volumeControllerDiv = document.getElementById("volumeControllerDiv")
let musicSelectDiv = document.getElementById("musicSelectDiv")
let useGPTCheckboxDiv = document.getElementById("useGPTCheckboxDiv")
let chatGPTPromptDiv = document.getElementById("chatGPTPromptDiv")
let chatGPTPapikeyDiv = document.getElementById("chatGPTPapikeyDiv")
let musicStartStopButtonDiv = document.getElementById("musicStartStopButtonDiv")
let musicStartButton = document.getElementById("musicStartButton")
let musicStopButton = document.getElementById("musicStopButton")
let configButton = document.getElementById("configButton")
let exitButton = document.getElementById("exitButton")

//その他のdivの定義
let mediaInfoDiv = document.getElementById("mediaInfo")
let canvasDiv = document.getElementById("canvasDiv")
//seekbarの定義はcontrolTextAliveApi.jsで実施

// 1, Live2Dモデルへのパスを指定する
let modelUrl = "miku2023/HatsuneMiku.model3.json";
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
musicStartStopButtonDiv.style.marginLeft = (leftMarginNum+10).toString()+"px"
musicStartStopButtonDiv.style.marginTop = (topMarginNum+2).toString()+"px"
configPageDiv.style.marginLeft = (leftMarginNum+10).toString()+"px"
configPageDiv.style.marginTop = (topMarginNum+2).toString()+"px"
configPageDiv.style.width = (width).toString()+"px"
musicStartButton.style.fontSize = (20*compressionSquare).toString()+"px"
musicStartButton.style.marginTop = (3*compressionSquare).toString()+"px"
musicStopButton.style.fontSize = (20*compressionSquare).toString()+"px"
musicStopButton.style.marginTop = (3*compressionSquare).toString()+"px"
configButton.style.fontSize = (20*compressionSquare).toString()+"px"
configButton.style.marginTop = (3*compressionSquare).toString()+"px"
//設定モードのボタンの位置調整
configDecisionButtonDiv.style.marginTop = (10*compressionSquare ).toString()+"px"
volumeControllerDiv.style.marginTop = (100*compressionSquare ).toString()+"px"
musicSelectDiv.style.marginTop = (90*compressionSquare ).toString()+"px"
musicSelectDiv.style.marginLeft = (800*compressionSquare ).toString()+"px"
useGPTCheckboxDiv.style.marginTop = (200*compressionSquare ).toString()+"px"
chatGPTPromptDiv.style.marginTop = (500*compressionSquare ).toString()+"px"
chatGPTPapikeyDiv.style.marginTop = (300*compressionSquare ).toString()+"px"

//seekbar
  //一部はcontrolTextAliveApi.jsで実施
seekbar.style.marginLeft = (leftMarginNum).toString()+"px"
seekbar.style.marginTop = (maxmMarginTopNum-10*compressionSquare ).toString()+"px"

//初回だけExitボタンにイベントをつける
exitButton.addEventListener("click",{scene: "endScene",handleEvent:changeScene})
//設定ボタンにイベントをつける  
configButton.addEventListener("click",{scene: "configScene",handleEvent:changeScene})


let scenes = {}//画面情報を格納する変数


//描画領域を作成する
app = new PIXI.Application({
  view: document.getElementById("my-live2d"),
  autoStart: true,
  backgroundAlpha: 0,
  backgroundColor: 0x000000,
  width: width,
  height: height
});


//Gradationパターンを作成する関数
async function createGradient (width, height){
  const canvas = document.createElement('canvas')  
  const ctx = canvas.getContext('2d')
  const gradient1 = ctx.createLinearGradient(width/2, 0, width/2, height)
  const gradient2 = ctx.createLinearGradient(0, 0, width, 0)
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  gradient1.addColorStop(0, sportLightGradationStart)
  gradient1.addColorStop(0.5, sportLightGradationSecond)
  gradient1.addColorStop(0.8, sportLightGradationEnd)
  gradient1.addColorStop(1, sportLightGradationEnd)

  gradient2.addColorStop(0, sportLightGradationStart)
  gradient2.addColorStop(0.2, sportLightGradationSecond)
  gradient1.addColorStop(0.5, sportLightGradationEnd)
  gradient2.addColorStop(0.8, sportLightGradationSecond)
  gradient2.addColorStop(1, sportLightGradationStart)

  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, width, height)

  return PIXI.Sprite.from(canvas)
}

//ゲームのトップ画面を作成する
async function setStartScene(){
  const startScene = new PIXI.Container()
  scenes["startScene"] = startScene
}

//ゲームのメイン画面を作成する
async function setMainScene(){
  const mainScene = new PIXI.Container()
  //Live2Dモデルをロードする
  currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });

  currentModel.scale.set(0.3*compressionSquare);//モデルの大きさ★
  currentModel.interactive = true;
  currentModel.position.set(650*compressionSquare,250*compressionSquare)
  currentModel.zIndex = 1200

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

  //スポットライトの作成
  for (let i = 1 ; i <= 5 ; i++ ){
    //スポットライト三角形の部分を定義
    trianglePoint = [
        (marginStage+spotLightInterval*i-lightSourceWidth/2)*compressionSquare,0, //x1,y1
        (marginStage+spotLightInterval*i - lightRadius*(1-vanishingPoint*3/lightHeight))*compressionSquare, lightHeight*compressionSquare,
        (marginStage+spotLightInterval*i + lightRadius*(1-vanishingPoint*3/lightHeight))*compressionSquare, lightHeight*compressionSquare,
        (marginStage+spotLightInterval*i+lightSourceWidth/2)*compressionSquare,0,
      ]
    triangleGraphic = new PIXI.Graphics()
    // スポットライトの三角形の部分のポリゴンを作成
    triangleGraphic.beginFill( 0xFFFFFF);
    triangleGraphic.drawPolygon(trianglePoint)
    triangleGraphic.endFill()
    //スポットライトの床に映る光の部分を作成
    circlesGraphic = new PIXI.Graphics()
    circlesGraphic.beginFill(0xFFFFFF);
    circlesGraphic.alpha = 0.0
    circlesGraphic.drawEllipse((marginStage+spotLightInterval*i)*compressionSquare, 
                                (lightHeight+lightRadius/4+vanishingPoint)*compressionSquare,
                                lightRadius*compressionSquare,
                                lightRadius*compressionSquare/4)
    //スポットライトの光の消失点の部分を作成
    circlesGraphicvanishingPoint = new PIXI.Graphics()
    circlesGraphicvanishingPoint.beginFill(0xFFFFFF);
    circlesGraphicvanishingPoint.alpha = 0.0
    circlesGraphicvanishingPoint.drawEllipse((marginStage+spotLightInterval*i)*compressionSquare, 
                                lightHeight*compressionSquare,
                                lightRadius*(1-vanishingPoint*3/lightHeight)*compressionSquare,
                                lightRadius*compressionSquare/4)
                                
    circlesGraphic.endFill(); 
    //作った図形に対してGradationを当てる
    //三角形の部分にGradationを当てるための変数を用意
    let spriteGradientTriangle = await createGradient(lightRadius*2*compressionSquare,
                                                      (lightHeight+lightRadius/4)*compressionSquare,
                                                      )
    //光の消失点にGradationを当てるための変数を用意
    let spriteGradientCircleBack = await createGradient(lightRadius*2*compressionSquare,
                                                    (lightHeight+lightRadius/4)*compressionSquare,
                                                    )
    //三角形の部分のグラデーションを作成
    spriteGradientTriangle.mask = triangleGraphic
    spriteGradientTriangle.x = (marginStage+spotLightInterval*i - lightRadius)*compressionSquare
    spriteGradientTriangle.alpha = 0.0
    spriteGradientTriangle.zIndex = 1300
    spotLightTriangles.push(spriteGradientTriangle)
    
    //円の部分のグラデーションを作成
    spriteGradientCircleBack.mask = circlesGraphicvanishingPoint
    spriteGradientCircleBack.x = (marginStage+spotLightInterval*i - lightRadius)*compressionSquare
    spriteGradientCircleBack.y = lightHeight*compressionSquare
    spriteGradientCircleBack.alpha = 0.0

    spotLightCirclesBack.push(spriteGradientCircleBack)
    spotLightCirclesFront.push(circlesGraphic)
  }
  
  //背景を配置する
  mainScene.addChild(background)
  //Live2Dモデルを配置する
  mainScene.addChild(currentModel)  
  //テキストboxを配置
  mainScene.addChild(chatTextBox)
  //スポットライトを配置
  for (let i = 0 ; i < spotLightTriangles.length ; i++){
    mainScene.addChild(spotLightTriangles[i])
    mainScene.addChild(spotLightCirclesBack[i])
    mainScene.addChild(spotLightCirclesFront[i])
  }
  //Zindexを有効化
  mainScene.sortableChildren = true;
  //メイン画面を追加
  app.stage.addChild(mainScene);
  scenes["mainScene"] = mainScene
}

//ゲーム終了画面の作成
async function setEndScene(){
  const endScene = new PIXI.Container()
  scenes["endScene"] = endScene
}

//設定画面の作成
async function setConfigScene(){
  const configScene = new PIXI.Container()
  nowVolumeTextBox.x = 20*compressionSquare
  nowVolumeTextBox.y = 140*compressionSquare
  nowVolumeTextBox.zIndex = 1000;
  openAIKeyLabelText.x = 20*compressionSquare
  openAIKeyLabelText.y = 270*compressionSquare
  promptLabelText.x = 20*compressionSquare
  promptLabelText.y = 470*compressionSquare
  requestLabelText.x = 20*compressionSquare
  requestLabelText.y = 570*compressionSquare
  configScene.addChild(nowVolumeTextBox)
  if(disableGPTMode===false){//GPTモードが選択できる場合
    configScene.addChild(openAIKeyLabelText)
    configScene.addChild(promptLabelText)
    configScene.addChild(requestLabelText)
  }
  app.stage.addChild(configScene)

  scenes["configScene"] = configScene
}

//アプリの読み込み
async function setup() { 
  //画面定義
  await setStartScene()//startSceneの定義
  await setMainScene()
  await setEndScene()
  await setConfigScene()

  //どの画面を最初に表示ておくかを指定
  scenes["startScene"].visible = true
  scenes["mainScene"].visible = false
  scenes["endScene"].visible = false
  scenes["configScene"].visible = false

  //スタートボタンの配置
  startButtonDiv.insertAdjacentHTML('afterbegin', startButtonHtml);
  let startButton = document.getElementById("startButton")
  startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})
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

//チャット送信ボタンがクリックされた時の動作を決定
function sendButtonOnClick(){
  let inputText = document.getElementById("inputText")
  showChatLog(inputText.value)//showChatLog.jsを呼び出し
  inputText.value = ""
}

//chatGPTモードのON/OFFを検知して反映する
function useGPTCheckBoxOnchange(){
  let checkboxFlag = document.getElementById("useGPTCheckBox") 
  useGPTMode=checkboxFlag.checked
}

//chatGPTのプロンプトの変更を検知して反映する
function GPTPromptOnchange(){
  let promptBox = document.getElementById("promptInputTextBox")
  userPrompt = promptBox.value
}

//APIkeyの変更を検知するして反映する
function apikeyElementOnchange(){
  let apikeyElement = document.getElementById("apikeyInputTextBox")
  openAIKey = apikeyElement.value
}

//volumeの変更を検知して反映する
function volumeOnchange(){
  let tmpVolume =  document.getElementById("volumeControllerInput")
  player.volume = tmpVolume.value
}

//楽曲の変更を検知して反映する
function musicOnchange(){
  let musicSelecter =  document.getElementById("musicSelectBox")
  changeMusic(musicList[Number(musicSelecter.value)].url)
}

//画面の切り替え関数
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
    //ゲームスタートボタンを削除
    let startButton = document.getElementById("startButton")
    if(startButton !== null){
      startButton.remove()
    }
    //config関連のPartsを非表示にする
    configPageDiv.style.zIndex=-3
    let configDecisionButton = document.getElementById("configDecisionButton")
    if(configDecisionButton !== null){
      configDecisionButton.remove()
    }
    //volumeコントローラがあれば削除
    let volumeController = document.getElementById("volumeController")
    if(volumeController !== null){
      volumeController.remove()
    }
    //楽曲セレクターがあれば削除する
    let musicSelectBoxDiv = document.getElementById("musicSelectBoxDiv")
    if(musicSelectBoxDiv !== null){
      musicSelectBoxDiv.remove()
    }
    //GPTを使うかのcheckボタンがあれば削除
    let useGPTcheckBox = document.getElementById("useGPT")
    if(useGPTcheckBox !== null){
      useGPTcheckBox.remove()
    }
    //プロンプト入力欄があれば削除
    let pronptBox = document.getElementById("promptInput")
    if(pronptBox !== null){
      pronptBox.remove()
    }
    //apikey入力欄があれば削除
    let apikeyBox = document.getElementById("apikeyInput")
    if(apikeyBox !== null){
      apikeyBox.remove()
    }
    //チャット入力欄を作成する
    inputChatboxDiv.insertAdjacentHTML('afterbegin', inputChatBoxHtml);
    //送信ボタンを作成してイベントを作る
    sendButtonDiv.insertAdjacentHTML('afterbegin', commentSendButtonHtml);
    let sendButton = document.getElementById("commentSendButton")
    sendButton.addEventListener("click",sendButtonOnClick)

    //楽曲再生ボタンを最前面に表示する
    musicStartStopButtonDiv.style.zIndex=3
    seekbar.style.width = (width).toString()+"px"
  }else if (this.scene == "endScene"){//end画面に切り替えたとき
    //チャット入力欄とチャット送信ボタンの削除
    let inputChatBox = document.getElementById("inputChatBox")
    let sendButton = document.getElementById("commentSendButton")
    inputChatBox.remove()
    sendButton.remove()

    //スタート画面に戻るためのボタンを作成
    homeButtonDiv.insertAdjacentHTML('afterbegin', homeButtonHtml);
    let homeButton = document.getElementById("homeButton")
    homeButton.addEventListener("click",{scene: "startScene",handleEvent:changeScene})

    //楽曲再生関連に使うボタンを最背面にする
    musicStartStopButtonDiv.style.zIndex=-3
    seekbar.style.Zindex=-3
    seekbar.style.width = (0).toString()+"px"
    //音楽の再生を止める
    player.requestStop();
    //ライトの消灯
    lightsOut()
    //歌詞の削除
    deleteLryic(true);
    
  }else if(this.scene == "startScene"){//start画面に遷移したとき
    //スタートに戻るボタンを削除
    let homeButton = document.getElementById("homeButton")
    homeButton.remove()

    //スタートボタンを作成
    startButtonDiv.insertAdjacentHTML('afterbegin', startButtonHtml);
    let startButton = document.getElementById("startButton")
    startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})

  }else if(this.scene == "configScene"){//設定画面
    //チャット入力欄とチャット送信欄を削除する
    let inputChatBox = document.getElementById("inputChatBox")
    let sendButton = document.getElementById("commentSendButton")
    if(inputChatBox !== null){
      inputChatBox.remove()
    }
    if(sendButton !== null){
      sendButton.remove()
    }
    //現在の音量を表示する
    nowVolumeTextBox.text = "現在の音量："+String(player.volume)
    //再生ボタンとかを見えないようにする
    musicStartStopButtonDiv.style.zIndex=-3
    seekbar.style.Zindex=-3
    seekbar.style.width = (0).toString()+"px"
    //設定ページのボタンとかを見えるようにする
    configPageDiv.style.zIndex=3

    //決定ボタンの追加
    configDecisionButtonDiv.insertAdjacentHTML('afterbegin', configDecisionButtonHtml);
    let configDecisionButton = document.getElementById("configDecisionButton")
    configDecisionButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})

    //ボリュウーム変更
    volumeControllerDiv.insertAdjacentHTML('afterbegin', volumeControllerHtml);
    let volumeController =  document.getElementById("volumeController")
    volumeController.addEventListener("change",volumeOnchange)
    //楽曲セレクト
    musicSelectDiv.insertAdjacentHTML('afterbegin', musicSelectHtml);
    let musicSelecter =  document.getElementById("musicSelectBox")
    musicSelecter.addEventListener("change",musicOnchange)


    if(disableGPTMode===false){
      //chatGPTモードを使うかのcheckbox
      useGPTCheckboxDiv.insertAdjacentHTML('afterbegin', useGPTCheckboxHtml);
      let useGPTController =  document.getElementById("useGPTCheckBox")
      useGPTController.checked = useGPTMode
      useGPTController.addEventListener("change",useGPTCheckBoxOnchange)
      //chatGPT用のプロンプト
      chatGPTPromptDiv.insertAdjacentHTML('afterbegin', promptInputHtml);
      let chatGPTPrompt = document.getElementById("promptInputTextBox")
      chatGPTPrompt.value = userPrompt
      chatGPTPrompt.addEventListener("change",GPTPromptOnchange)
      //chagGPT用のAPIKEY
      chatGPTPapikeyDiv.insertAdjacentHTML('afterbegin', apikeyInputHtml);
      let apikeyElement = document.getElementById("apikeyInputTextBox")
      apikeyElement.value = openAIKey
      apikeyElement.addEventListener("change",apikeyElementOnchange)
    }
  }
}

//画面情報をセットアップ
setup()