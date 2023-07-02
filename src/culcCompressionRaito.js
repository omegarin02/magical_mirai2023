const default_width = 1920
const default_height = 1080
let compressionWidth = window.innerWidth/default_width
let compressionHeight = window.innerHeight/default_height
let width = Math.floor(window.innerWidth);//ステージの横のサイズ
let height = Math.floor(window.innerHeight);//ステージの縦のサイズ
let compressionSquare = 1//画面の圧縮率
if(compressionWidth > compressionHeight){//幅と比べて高さの方が圧縮率が高い場合
  width = (16*height/9)
  compressionWidth = width/default_width
  compressionSquare = compressionHeight 
}else if (compressionWidth < compressionHeight){
  height = (9*width/16)
  compressionHeight = height/default_height
  compressionSquare = compressionWidth
}
let leftMarginNum = ((window.innerWidth-width)/2)
let topMarginNum =((window.innerHeight-height)/2)
let maxmMarginTopNum = height