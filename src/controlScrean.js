//index.jsで使うのでスコープを外す
let app;
let fontSize = 25*compressionSquare
let textfont = "RocknRoll One"
let lyricText = new PIXI.Text( "", { fill: 0xffffff } );
let chatTextBox = new PIXI.Text( "", { fill: 0x00ac9b,fontSize: 22.5*compressionSquare,fontFamily: textfont } );
//let artistTextBox = new PIXI.Text( "", { fill: "blue",fontSize: fontSize,fontFamily: textfont } );
//let titleTextBox = new PIXI.Text( "", { fill: "blue",fontSize: fontSize,fontFamily: textfont } );
//let musicInfoBox = new PIXI.Text( "", { fill: 0x33ffff,fontSize: fontSize,fontFamily: textfont } );
let nowVolumeTextBox = new PIXI.Text( "", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let openAIKeyLabelText = new PIXI.Text( "OPENAI KEY(自己責任でお願いします。※GPTモードは有料です。)", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let promptLabelText = new PIXI.Text( "Prompt", { fill:"cyan",fontSize: 22.5*compressionSquare,fontFamily: textfont } );
let musicInfoTexts = []
let marginStage = -50*3.5/2
let lightRadius = 200
let lightHeight = 880 //- lightRadius/2
let spotLightInterval = 343
let spotLightTriangles = []
let spotLightCirclesBack = []
let spotLightCirclesFront = []
let sportLightGradationStart = "#808080"
let sportLightGradationSecond = "#d3d3d3"
let sportLightGradationEnd = "#FFFFFF"
let lightSourceWidth = 20
let vanishingPoint = 25
let afterConfigFlag = false


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
//let exitButtonDiv = document.getElementById("exitButtonDiv")
let homeButtonDiv = document.getElementById("homeButtonDiv")
let inputChatboxDiv = document.getElementById("inputChatboxDiv")
let sendButtonDiv = document.getElementById("sendButtonDiv")
let configPageDiv = document.getElementById("configPageDiv")
let configDecisionButtonDiv = document.getElementById("configDecisionButtonDiv")
let volumeControllerDiv = document.getElementById("volumeControllerDiv")
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
//musicStartStopButtonDiv.style.marginTop = (45).toString()+"px"
musicStartButton.style.fontSize = (20*compressionSquare).toString()+"px"
musicStartButton.style.marginTop = (3*compressionSquare).toString()+"px"
musicStopButton.style.fontSize = (20*compressionSquare).toString()+"px"
musicStopButton.style.marginTop = (3*compressionSquare).toString()+"px"
configButton.style.fontSize = (20*compressionSquare).toString()+"px"
configButton.style.marginTop = (3*compressionSquare).toString()+"px"

configDecisionButtonDiv.style.marginTop = (10*compressionSquare ).toString()+"px"
volumeControllerDiv.style.marginTop = (100*compressionSquare ).toString()+"px"
useGPTCheckboxDiv.style.marginTop = (200*compressionSquare ).toString()+"px"
chatGPTPromptDiv.style.marginTop = (500*compressionSquare ).toString()+"px"
chatGPTPapikeyDiv.style.marginTop = (300*compressionSquare ).toString()+"px"

//configButton.style.fontSize = (20*compressionSquare).toString()+"px"
//configButton.style.marginTop = (3*compressionSquare).toString()+"px"
//exitボタンの位置調整
  //大きさ調整はbuttonParts.js
//exitButtonDiv.style.marginLeft = (leftMarginNum).toString()+"px"

//seekbar
  //一部はcontrolTextAliveApi.jsで実施
seekbar.style.marginLeft = (leftMarginNum).toString()+"px"
seekbar.style.marginTop = (maxmMarginTopNum-10*compressionSquare ).toString()+"px"

//初回だけExitボタンにイベントをつける
exitButton.addEventListener("click",{scene: "endScene",handleEvent:changeScene})
//設定ボタンにイベントをつける  
configButton.addEventListener("click",{scene: "configScene",handleEvent:changeScene})


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


async function createGradient (width, height, colorFrom, colorTo){
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
  //gradient.addColorStop(0.8, sportLightGradationSecond)
  //gradient.addColorStop(1, sportLightGradationStart)

  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, width, height)

  return PIXI.Sprite.from(canvas)
}


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

  //artistTextBox.x = 1500 * compressionSquare
  //artistTextBox.y = 10 * compressionSquare
  //titleTextBox.x = 1500 * compressionSquare
  //titleTextBox.y = 40 * compressionSquare
  //musicInfoBox.x = 1450 * compressionSquare
  //musicInfoBox.y = 1050 * compressionSquare - fontSize
  //スポットライト
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
    //スポットライトの下半分の図形を作成
    circlesGraphic = new PIXI.Graphics()
    circlesGraphic.beginFill(0xFFFFFF);
    circlesGraphic.alpha = 0.0
    circlesGraphic.drawEllipse((marginStage+spotLightInterval*i)*compressionSquare, 
                                (lightHeight+lightRadius/4+vanishingPoint)*compressionSquare,
                                lightRadius*compressionSquare,
                                lightRadius*compressionSquare/4)

    circlesGraphicvanishingPoint = new PIXI.Graphics()
    circlesGraphicvanishingPoint.beginFill(0xFFFFFF);
    circlesGraphicvanishingPoint.alpha = 0.0
    circlesGraphicvanishingPoint.drawEllipse((marginStage+spotLightInterval*i)*compressionSquare, 
                                lightHeight*compressionSquare,
                                lightRadius*(1-vanishingPoint*3/lightHeight)*compressionSquare,
                                lightRadius*compressionSquare/4)

                                
    circlesGraphic.endFill(); 
    //作った図形に対してGradationを当てる
    let spriteGradientTriangle = await createGradient(lightRadius*2*compressionSquare,
                                                      (lightHeight+lightRadius/4)*compressionSquare,
                                                      "#000000", "#FFFFFF")
    
    let spriteGradientCircleBack = await createGradient(lightRadius*2*compressionSquare,
                                                    (lightHeight+lightRadius/4)*compressionSquare,
                                                    "#000000", "#FFFFFF")
    /*
    let spriteGradientCircleFront = await createGradient(lightRadius*2*compressionSquare,
                                                      lightRadius*compressionSquare/4,
                                                      "#000000", "#FFFFFF")
    */
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
    /*
    //薄いので増強
    spriteGradientCircleFront.mask = circlesGraphic
    spriteGradientCircleFront.x = (marginStage+spotLightInterval*i - lightRadius)*compressionSquare
    spriteGradientCircleFront.y = lightHeight*compressionSquare
    spriteGradientCircleFront.alpha = 0.0
    */
    spotLightCirclesBack.push(spriteGradientCircleBack)
    spotLightCirclesFront.push(circlesGraphic)
  }


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
  mainScene.addChild(currentModel)  
  //mainScene.addChild( lyricText );
  mainScene.addChild(chatTextBox)
  //mainScene.addChild(artistTextBox)
  //mainScene.addChild(titleTextBox)
  //mainScene.addChild(musicInfoBox)
  

  for (let i = 0 ; i < gridHorizontalArray.length ; i++){
    mainScene.addChild(gridHorizontalArray[i])
  }
  for (let i = 0 ; i < gridVerticalArray.length ; i++){
    mainScene.addChild(gridVerticalArray[i])
  }
  
  
  for (let i = 0 ; i < spotLightTriangles.length ; i++){
    mainScene.addChild(spotLightTriangles[i])
    mainScene.addChild(spotLightCirclesBack[i])
    mainScene.addChild(spotLightCirclesFront[i])
  }


  mainScene.sortableChildren = true;
  app.stage.addChild(mainScene);
  scenes["mainScene"] = mainScene
}

async function setEndScene(){
  const endScene = new PIXI.Container()
  scenes["endScene"] = endScene
}

async function setConfigScene(){
  const configScene = new PIXI.Container()
  nowVolumeTextBox.x = 20*compressionSquare
  nowVolumeTextBox.y = 140*compressionSquare
  nowVolumeTextBox.zIndex = 1000;
  openAIKeyLabelText.x = 20*compressionSquare
  openAIKeyLabelText.y = 270*compressionSquare
  promptLabelText.x = 20*compressionSquare
  promptLabelText.y = 470*compressionSquare
  configScene.addChild(nowVolumeTextBox)
  if(disableGPTMode===false){
    configScene.addChild(openAIKeyLabelText)
    configScene.addChild(promptLabelText)
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
  scenes["startScene"].visible = true
  scenes["mainScene"].visible = false
  scenes["endScene"].visible = false
  scenes["configScene"].visible = false

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
  showChatLog(inputText.value)
  inputText.value = ""
}

function useGPTCheckBoxOnchange(){
  let checkboxFlag = document.getElementById("useGPTCheckBox") 
  useGPTMode=checkboxFlag.checked
}

function GPTPromptOnchange(){
  let promptBox = document.getElementById("promptInputTextBox")
  userPrompt = promptBox.value
}

function apikeyElementOnchange(){
  let apikeyElement = document.getElementById("apikeyInputTextBox")
  openAIKey = apikeyElement.value
}

function volumeOnchange(){
  let tmpVolume =  document.getElementById("volumeControllerInput")
  player.volume = tmpVolume.value
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
    let volumeController = document.getElementById("volumeController")
    if(volumeController !== null){
      volumeController.remove()
    }
    let useGPTcheckBox = document.getElementById("useGPT")
    if(useGPTcheckBox !== null){
      useGPTcheckBox.remove()
    }
    let pronptBox = document.getElementById("promptInput")
    if(pronptBox !== null){
      pronptBox.remove()
    }
    let apikeyBox = document.getElementById("apikeyInput")
    if(apikeyBox !== null){
      apikeyBox.remove()
    }
    //ボリュームcontrolの入力欄を削除
    //let volumeController = document.getElementById("volumeController")
    //volumeController.remove()

    //exitButtonDiv.insertAdjacentHTML('afterbegin', exitButtonHtml);
    
    //チャット入力欄を作成する
    inputChatboxDiv.insertAdjacentHTML('afterbegin', inputChatBoxHtml);
    


    //送信ボタンを作成してイベントを作る
    sendButtonDiv.insertAdjacentHTML('afterbegin', commentSendButtonHtml);
    let sendButton = document.getElementById("commentSendButton")
    sendButton.addEventListener("click",sendButtonOnClick)

    //楽曲再生ボタンを最前面に表示する
    musicStartStopButtonDiv.style.zIndex=3
    seekbar.style.width = (width).toString()+"px"



  }
  else if (this.scene == "endScene"){//end画面に切り替えたとき
    let inputChatBox = document.getElementById("inputChatBox")
    let sendButton = document.getElementById("commentSendButton")
    inputChatBox.remove()
    sendButton.remove()

    configButton.removeEventListener("click",{scene: "configScene",handleEvent:changeScene});

    homeButtonDiv.insertAdjacentHTML('afterbegin', homeButtonHtml);
    let homeButton = document.getElementById("homeButton")
    homeButton.addEventListener("click",{scene: "startScene",handleEvent:changeScene})

    musicStartStopButtonDiv.style.zIndex=-3
    //mediaInfoDiv.style.zIndex=-3
    seekbar.style.Zindex=-3
    seekbar.style.width = (0).toString()+"px"
    player.requestStop();
    
  }else if(this.scene == "startScene"){
    let homeButton = document.getElementById("homeButton")
    homeButton.remove()

    startButtonDiv.insertAdjacentHTML('afterbegin', startButtonHtml);
    let startButton = document.getElementById("startButton")
    startButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})

  }else if(this.scene == "configScene"){//設定画面
    let inputChatBox = document.getElementById("inputChatBox")
    let sendButton = document.getElementById("commentSendButton")
    if(inputChatBox !== null){
      inputChatBox.remove()
    }
    if(sendButton !== null){
      sendButton.remove()
    }
    nowVolumeTextBox.text = "現在の音量："+String(player.volume)
    console.log(player.volume)
    musicStartStopButtonDiv.style.zIndex=-3
    seekbar.style.Zindex=-3
    seekbar.style.width = (0).toString()+"px"

    configPageDiv.style.zIndex=3

    //決定ボタンの追加
    configDecisionButtonDiv.insertAdjacentHTML('afterbegin', configDecisionButtonHtml);
    let configDecisionButton = document.getElementById("configDecisionButton")
    configDecisionButton.addEventListener("click",{scene: "mainScene",handleEvent:changeScene})

    //ボリュウーム変更
    volumeControllerDiv.insertAdjacentHTML('afterbegin', volumeControllerHtml);
    let volumeController =  document.getElementById("volumeController")
    volumeController.addEventListener("change",volumeOnchange)
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