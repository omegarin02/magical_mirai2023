//Live2Dのmotionを発火させるための関数
function Motion(number){
  index = scenes["mainScene"].children.indexOf(currentModel)
  scenes["mainScene"].children[index].internalModel.motionManager.startMotion('Motion',number);
  }