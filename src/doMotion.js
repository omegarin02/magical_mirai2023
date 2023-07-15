//Live2Dのmotionを発火させるための関数
function Motion(number){
  console.log("call Motion")
  index = scenes["mainScene"].children.indexOf(currentModel)
  console.log( scenes["mainScene"].children[index])
  scenes["mainScene"].children[index].internalModel.motionManager.startMotion('Motion',number);
  }