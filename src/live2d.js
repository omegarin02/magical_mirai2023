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
let width = Math.floor(window.innerWidth * 0.9);
let height = Math.floor(window.innerHeight * 0.9);

// メインの処理開始
async function loadmodule() {
  // 2, PixiJSを準備する
  app = new PIXI.Application({
    view: document.getElementById("my-live2d"),
    autoStart: true,
    backgroundAlpha: 0,
    backgroundColor: 0x0000ff,
    width: width,
    height: height
  });

  // 3, Live2Dモデルをロードする
  currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
  currentModel.scale.set(0.2);//モデルの大きさ★
  currentModel.interactive = true;
  currentModel.anchor.set(0.3, 0.3);//モデルのアンカー★
  currentModel.position.set(window.innerWidth/3, window.innerHeight/3);//モデルの位置★

  // 4, Live2Dモデルをドラッグ可能にする
  /*
  currentModel.on("pointerdown", e => {
    currentModel.offsetX = e.data.global.x - currentModel.position.x;
    currentModel.offsetY = e.data.global.y - currentModel.position.y;
    currentModel.dragging = true;
  });
  currentModel.on("pointerup", e => {
    currentModel.dragging = false;
    let updateFn = currentModel.internalModel.motionManager.update;
    let coreModel = currentModel.internalModel.coreModel;
  });
  currentModel.on("pointermove", e => {
    if (currentModel.dragging) {
      currentModel.position.set(
        e.data.global.x - currentModel.offsetX,
        e.data.global.y - currentModel.offsetY
      );
    }
  });
*/

  // 5, Live2Dモデルを拡大/縮小可能に(マウスホイール) #my-live2dはcanvasのidにして下さい
  /*
  document.querySelector("#my-live2d").addEventListener("wheel", e => {
    e.preventDefault();
    currentModel.scale.set(
      clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10)
    );
  });
  */

  //背景を設定./background.jpgを画像のパスに書きかえて下さい
  let background = PIXI.Sprite.fromImage('img/stage.jpg');
  background.anchor.set(0.5);
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
  background.height = app.screen.height;
  background.width = app.screen.width;
  app.stage.addChild(background);
  
  // 6, Live2Dモデルを配置する
  app.stage.addChild(currentModel);

}

function main(){
  loadmodule();
}

main()