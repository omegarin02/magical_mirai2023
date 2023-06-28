function Motion(number){
  console.log("call Motion")
  index = scenes["mainScene"].children.indexOf(currentModel)
  console.log( scenes["mainScene"].children[index])
  scenes["mainScene"].children[index].internalModel.motionManager.startMotion('HOGE',number);
  //currentModel.internalModel.motionManager.startMotion('HOGE',number,2);
  }