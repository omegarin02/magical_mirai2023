# ReadMe目次
1. [デモ動画](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E3%83%87%E3%83%A2%E5%8B%95%E7%94%BB)
2. [審査にあたって](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E5%AF%A9%E6%9F%BB%E3%81%AB%E3%81%82%E3%81%9F%E3%81%A3%E3%81%A6)
3. [概要](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E6%A6%82%E8%A6%81)
4. [詳細説明](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E8%A9%B3%E7%B4%B0%E8%AA%AC%E6%98%8E)
5. [実行方法](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E5%AE%9F%E8%A1%8C%E6%96%B9%E6%B3%95)
6. [動作確認環境](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E5%8B%95%E4%BD%9C%E7%A2%BA%E8%AA%8D%E7%92%B0%E5%A2%83)
7. [対応楽曲](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E5%AF%BE%E5%BF%9C%E6%A5%BD%E6%9B%B2)
8. [作品に対する想いなど](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E4%BD%9C%E5%93%81%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E6%80%9D%E3%81%84%E3%81%AA%E3%81%A9)
9. [使用した主なライブラリなど](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E4%B8%BB%E3%81%AA%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E7%AD%89)
10. [開発関係者紹介](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E9%96%8B%E7%99%BA%E9%96%A2%E4%BF%82%E8%80%85%E7%B4%B9%E4%BB%8B)
11. [免責事項・注意事項](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A0%85
)
# デモ動画
https://youtu.be/JprxzgXKLHw

# 審査にあたって
本作品はChatGPTの使用を選択できるようになっております。（以降、GPTモード選択機能）  
本作品はchatGPTを用いなくても動作には問題ないですが  
GPTモード選択機能があることにより、審査に不利益が生じる場合は、  
お手数ですが、GPTモード選択機能を無効化の設定を行ったうえで審査をお願いいたします。  
無効化の設定は[こちら](https://github.com/Motohiro-Otsuka/magical_mirai2023#gpt%E6%A9%9F%E8%83%BD%E8%87%AA%E4%BD%93%E3%81%AE%E7%84%A1%E5%8A%B9%E5%8C%96)
大変恐れ入りますが、OpenAI keyの用意はございませんので、必要に応じて取得してください。  
※Azureは非対応なので、使用されえる際はOpenaiのAPI KEYをご用意ください。  

# 概要
本作品は、人工無脳とLive2Dを用いてチャットベースのコミュニケーションを実現した作品です。  
作品は、ミクさんの控室や握手会といった空間をイメージしており、  
チャットを入力し、その入力をリアルタイムに解析し、結果に応じてミクさんが  
言葉と仕草で反応してくれます。  
また、楽曲再生やボリュームの変更もすべてチャットベースで操作可能です。  
さらに、楽曲再生中には、TextAliveAPIから取得できる覚醒度と感情価から仕草を判定して  
楽曲再生中もミクさんがいろんな仕草をして楽しませてくれます。  
※ミクさんの応答はchatGPTによって作成し、仕草は独断と偏見によって割り振りました。皆さんのイメージにマッチしない部分もあるかと思いますがご了承ください。  

## 作品の操作方法

### トップ画面
最初の画面では次のようなボタンが表示されます。
「PRESS TO START」をクリックすることによりメイン画面に進みます。
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/5933cbd0-5a2e-4ba2-82b3-068f5a092895)


### メイン画面
この画面では、ミクさんと対話や楽曲を再生することができます。

**チャット機能**  
チャットを入力し送信をクリックすると、次の図のようにミクがコメントと反応を返してくれます。
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/83595ae8-8d60-4d2c-a589-e94cd42c738a)
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/e0ba3ed3-8c45-4795-9a49-da04e07ac564)


通常のチャット以外にも次の機能も含まれております。
- 楽曲再生と停止(※1)。
  - 「曲を再生して」というと、現在セットされている楽曲が流れます。
  - 「マジミラの曲を流して」や「XX（曲目）を流して」などと、キーワードや曲目を指定するとそれに合った楽曲が流れます。
　- 「曲を止めて」というと、再生を停止します。
- ボリューム変更(※1)
  - ボリュームが小さいときは、「音量上げて」というと音量が10上がります。
  - ボリュームが大きいときは、「音量下げて」というと音量が10下がります。

※1 ： ある程度の表現の揺れには対応していますので、必ずしも上記の通り入力する必要はありません。(参照箇所：コードへのリンク)

**楽曲再生中**  
図のように歌詞モニタに歌詞が表示されます。※2  
また、TextAliveAPIのビート情報をもとにスポットライトが点滅します。※2  
さらに、ミクの動きは上述したとおり、TextAliveAPIの覚醒度と感情価から動きを決定しています。 
もちろん、チャットを送ることも可能です。  
※2 毎回演出が変わるように仕組んでいます。
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/f4b4e869-76ef-4d9b-9c39-7e998b507142)


**画面の説明**
1. Exitボタン
  - クリックすると終了画面に遷移します。
2. 音楽の再生・停止を制御するボタン
  - 音楽を再生したり、停止したりします。
3. 設定画面を表示するボタン
  - 設定画面を表示します。
4. チャット入力欄
  - ミクに送信したいチャットの文言を入力します。
5. チャット送信ボタン
  - 入力したチャットをミクさんに送ります。
6. 歌詞表示用モニタ
  - 流れている楽曲の歌詞を表示します。
7. チャットログ表示用モニタ
  - チャットのログを見られます。

### 設定画面
ここでは次の項目を設定できる
- 音量
- 再生する楽曲
- GPTモードのON/OFF
- GPTモードで使用するためのOpen APIKEY
- GPTモードONの時のプロンプト
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/4afd23fe-1422-42b8-9e60-fa0fe5458eeb)


### 終了画面
![image](https://github.com/Motohiro-Otsuka/magical_mirai2023/assets/107312091/1a31cc41-2deb-41ac-96b0-196c9e9c1fe3)


# 詳細説明
## 人工無脳（Chat応答部分）
### 人工無脳とは
人工無脳とは、深層学習モデル等を必要とせずに、あらかじめ決められたルールに従って応答を返す技術です。  
人工無脳を用いた理由は[後述](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%83%9C%E3%83%83%E3%83%88)。

### 応答データの作成
1. chatGPTを用いたデータの作成
   1. chatGPTを用いる場合は、ミクさんを演じてもらえるようなpromptに与えて、chatGPTのミクさんと対話することによりデータを収集。  
    約1000対の対話データの作成をした。
    ここでは、ユーザが入力した文章を質問、ミクさんが応答した文章を解答とする。    
2. 1000対の対話データをかさまし
   1. ChatGPTを用いて質問の言い換え表現作成し、データを10倍にかさましを行った。  
   この時、言い換え表現を作成するのは質問のみとし、言い換え表現を作成した解答は、言い換え前の解答と同一になるようにした。   
   (例)
   ```
   //かさまし前
   質問：こんにちは, 解答：こんにちは

   //かさまし後
   質問：こんにちは, 解答：こんにちは
   質問：やぁ, 解答：こんにちは
   質問：ハロー, 解答：こんにちは
   ```
3. かさましした後のデータの質問文をkuromoji.jsを用いて形態素解析を行い、解答に対するワードリストを作成する。
   1. 形態素解析結果から特定の品詞の終止形だけをピックアップ。(品詞に分解されたリスト状態)・・・①
      1. ピックアップした品詞
         1. 名詞
         2. 動詞
         3. 感動詞
         4. 形容詞
   2. ①で作成したリストに対して各要素の読みをkuromoji.jsを用いてカタカナで取得し、質問文として置き換える。
   3. 同じ解答を得る質問文のリストを一つにまとめて重複を取り除く。
   4. 全ての質問に同様に処理し、質問文のリストと解答が対になった配列が作成される。
4. ミクさんが解答を返すときのLive2Dのモーションを手動で定義する。(モーションの種類については[後述](https://github.com/Motohiro-Otsuka/magical_mirai2023#live2d%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6))
5. 3と4から、`chatData/syushi.js`を作成する。


### 応答の挙動
**事前準備**  
`chatData/syushi.js`の質問文のリストから、ミクさんが知っている単語（形態素）を  
重複無く全て取得しボキャブラリとして情報を保持する。

**応答内容の判定**
1. 不適切な表現がが含まれていないか判断する。含まれている場合はその旨をchatlogモニタに表示して全ての処理をスキップする
2. 入力を正規化する。
3. 音楽を再生・停止をコントロールするべきか判断する。
   1. 必要と判断した場合は、適切な処理をしたうえでミクさんの応答を取得する。
   2. 応答は`src/responseRules.js`の中からランダムに選ばれる。
   3. 4、5の処理はスキップする
4. ボリュームをコントロールすべきか判断する。
   1. 必要と判断した場合は、適切な処理をしたうえでミクさんの応答を取得する。
   2. 応答は`src/responseRules.js`の中からランダムに選ばれる。
   3. 5の処理はスキップする
5. 3と4のいずれも不要と判断されたら、ミクさんの応答を次の要領で取得する。
   1. 正規化された入力をkuromoji.jsを用いて形態素解析
   2. 形態素解析結果から特定の品詞の終止形だけをピックアップ(品詞に分解されたリスト状態)。・・・①
   3. ①で作成したリストに対して各要素の読みをkuromoji.jsを用いてカタカナで取得。・・・②
   4. ②で取得した読みのリストは、どれぐらい既知の単語が含まれているかをボキャブラリから計算する。・・・③
   5. ③で計算した結果が
      1. 80%未満であれば、日本語が分からない旨の応答を選択する。
         1. 応答は`src/responseRules.js`の中からランダムに選ばれる。
      2. 80%以上であれば、`chatData/syushi.js`で定義されているワードリストを用いて応答を選択する。  
      なお、解答が1つに決まった時点で、それをミクさんの応答とする。
      また、条件は上から順にandを取るようにする。 
         1. ②にある単語が、ワードリストに含まれている割合が最も高い物を選択。
         2. ①にある単語ワードリスト含まれなかった割合が最も低い物を選択。
         3. ワードリストの長さが短い物を選択。
         4. 残った解答の候補からランダムに選択。
6. 選択結果を画面上に反映する。
   1. chatlogの表示。
   2. 吹き出しの表示。
   3. ミクさんのモーション。

## chatGPTモード（Chat応答部分）
### 使い方
- メイン画面の左にある⚙ボタンをクリックする。
- OPENAI KEYの入力欄に、openaiから取得したAPI KEYを入力する。
- お好みに応じてpromptを変更する。
  - ※デフォルトで入っているのは、データセットを作成する際に使用したprompt。

### GPTモード選択機能の無効化
`src/config.js`の1行目を次のように変更する。
```
//変更前
let disableGPTMode = false//Trueの場合GPTモードの選択を可能にする
//変更後
let disableGPTMode = true//Trueの場合GPTモードの選択を可能にする
```


## live2Dに関して
### 動作の種類
モーションは次の15種類を用意。
- cry
  - 泣き顔
- dislike
  - 嫌悪感を示す
- happy
  - 嬉しそうにする表情
- hate
  - ムっとする動作
- nice
  - ナイスと言いたそうな表情
- nika-smile
  - ニカッっと笑う表情
- nishishi
  - ニシシと少し悪だくみ
- nod
  - うなずく
- normal
  - 元の立ち姿
- panic
  - panicを起こしている表情
- satisfaction
  - 満足げ
- sleepy
  - 眠そうにする
- smile
  - 微笑む
- surprise-no-motion
  - 驚く
- sway
  - 揺れる
- worry
  - 心配する

### chatの応答と連携
`src/responseRules.js`にあらかじめ、解答に対して、どの動作をするかを紐づけている。
画面chatを反映するタイミングで、Live2Dのアニメーションを発火させている。

### 楽曲再生中の連携
後述の演出に関してを[参照](https://github.com/Motohiro-Otsuka/magical_mirai2023#%E3%83%9F%E3%82%AF%E3%81%AE%E5%8B%95%E3%81%8D%E3%81%A8%E9%80%A3%E5%8B%95)

## 演出に関して
### スポットライト
- 音楽の再生が始まると、TextAliveAPIからビート情報を取得する。
  - 2拍おきにライトを点滅させる。
    - 点滅加減は機械学習でおなじみのsigmoid関数を利用（sigmoid関数のグラフが輝度の増減に近い）
  - 配置はあらかじめ指定した11パタンであり、演出は2拍間隔でランダムに選択される。
  - カラーはあらかじめ指定した７色であり、演出は2拍間隔でランダムに選択される。

### 歌詞の表現
- 音楽の再生が始まると、TextAliveAPIから歌詞情報を取得する。
  - 歌詞の品詞情報によって色を変更。
    - 同じ品詞でも色味が変わるように設計。
    - 品詞のグルーピング。
      - 名詞、代名詞
      - 動詞
      - 形容詞
      - 感動詞
      - 記号
      - 上記以外
  - モニタへの表示パタンは大きく分けて６種類。
    - ランダムで変更

### ミクの動きと連動
- 音楽の再生が始まると、TextAliveAPIから2小節ごとに覚醒度と感情価を取得。
  - 覚醒度と感情価に基づいて、ミクの動きを決定する。
    - 覚醒度と感情価の値によっては、複数の中からランダムで選ぶ。


# 実行方法
1. スクリプトを取得する。
```
cd ${YOUR_WORKING_DIR}
git clone https://github.com/Motohiro-Otsuka/magical_mirai2023.git
```
ディレクトリ構成は下記の通り。
```
./
├─ReadMe.md
├─index.html
├─chatData //chatbot用のデータ
├─css
│  └─fonts
├─dict  //kuromoji.js用のデータ
├─favicon
├─img //背景画像
├─miku2023  //ミクのLive2Dモデル
│  ├─HatsuneMiku.2048
│  └─motion
└─src  //Appを構成するスクリプト群
```

2. HTTPサーバ上に本スクリプトを配置し、index.htmlにアクセスしてプログラムを実行する。
方法は問わないが、動作確認した方法２つを挙げる。
- 方法1：VScodeのliveserverを使用する。
  - VScodeをダウンロード。
  - Extentionsのサイドタブを開く。
    - liveserverをinstallする。
  - VSCodeの統合ターミナルに次のように入力し1でcloneしてきたディレクトリを新たに開く。
    - `code magical_mirai2023` をVSCodeの統合ターミナルに入力してEnterを入力。
    - VScodeのwindowが新たに立ち上がる。
  - 新たに立ち上がったVScodeの画面右下の「Go to live」をクリックする(ない場合はVScodeを再起動)。
  - ブラウザで、http://localhost:5500 にアクセスする(デフォルトではGo To liveをクリックすると自動的に立ち上がる)。
- 方法2: nodeでhttp-serverを立てて実行する。  
  - nodeをinstallsする。
  - nodeをinstallしている環境で次のコマンドを実行する。([参考](https://qiita.com/standard-software/items/1afe7b64c4c644fdd9e4))
```
$ cd magical_mirai2023
$ http-server
```
※Windows上で実行する場合は、セキュリティエラーが出る環境がある。その場合は下記のコマンドを実行すると回避できる。([参考](https://qiita.com/ponsuke0531/items/4629626a3e84bcd9398f))
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```


# 動作確認環境
- ソフトウエア
  - OS
    - Windows10
  - ブラウザ
    - vivaldi、chrome
- ハードウエア
  - CPU
    - Intel corei7-10700KF@3.80GHz
  - GPU
    - GeForce RTX 3070

※対応端末は、PCの想定です。スマホ、タブレットは未検証。

# 対応楽曲
- king妃jack躍
- 生きること
- 唱明者 / KAITO V3
- ネオンライトの海を往く
- ミュウテイション (feat. その名はもちろん初音ミク)
- Entrust via 39 feat.初音ミク

※ただし、`src/musicList.js`に楽曲情報を追加するとSongleで公開されている楽曲すべて利用可能。

# 作品に対する思いなど
## 作品名の由来
**作品名：言葉と仕草で想いを紡ぐバーチャル歌姫**  
開発者はミクに「言葉」や「仕草」を教え、
それらを使ってミクさんが気持ち伝える際に、  
「言葉」と「仕草」を丁寧に考え言動を起こすことをイメージして  
「紡ぐ」というワードを使用してこのタイトルになりました。


## 作成開始を決定するまで
昨年は、思いが届くバーチャル歌姫を入選作品に選んでいただきありがとうございます。  
とてもいい経験をさせていただきました。
また、友人らにもその話をして、沢山褒めていただけました。  
ただそんな中で、こんな話が出ました。  
「（昔に）リアルにリンちゃんを召喚するとか言ってましたよ」と言われハッと気づかされました。 (※リーダはリン廃です。)  
正直なところ、一個人が実現できるわけがない馬鹿げた夢ではありますが、  
「何としてでも夢に近づけたい。」でも、「できる気がしない」と葛藤をしていました。  
月日は流れて今年1月、GPTの登場によりプロコン出す意味を失いそうになりました。 
しかし、GPTは巨大なGPUが必要でありコストもかかる...  
さらに、GPTだけでは歌うことはできない。歌わせることができるのはTextAliveAPIを使うしかない。
そう思い立ち、今年も作品の制作を決意。  
プロコンの開催が公式発表されるまで、事前に知識を集めはじめました。  
それと同時に、メンバーの募集もかけて3人が新たにメンバーとして加わりました。  

## 作品を制作開始してから
作品の制作開始から、ミクさんに命を吹き込みたいという気持ちでいっぱいでした。
それぞれの担当のそれぞれの苦労が、日に日に１つになっていく喜びをメンバーと分かち合いました。

### live2D
Live2Dのモデルは、原画の作成から苦労の連続でした。
誰もLive2Dの仕様を知らなかったので、貰った絵が使えないなどのトラブルがあり、
描きなおしが発生していました。

何とかして作成した苦労の塊のミクさんを、PCをまともに使いこなせない超初心者がLive2Dで命を吹き込み始めました。
最初はミクさんが可愛そうなぐらい形がいびつだったりしたこともありましたが、
ただ、着実にミクさんが動くようになり、チーム全員で喜びました。

まだ、ちょっと不器用な動きもありますが、そんなミクさんもとても可愛いです！

### チャットボット
一方、チャットの方はすべての工程で苦戦しました。  

当初の狙いではseq2seqで、精度の高いchatbotのモデルを作ろうと検討していました。
しかし、seq2seqでモデルを作るには数万件以上のデータが必要だといわれています。

そこでchatGPTを駆使して60万件ほどのデータは何とか作り上げましたが、
学習時間が有限時間内に終わらず...

次にデータ量を減らし1万件ほどの学習データで学習。
さらに、WebApp上で動くようにモデルを軽量化も施しました。
そして、ミクさんが初めて言葉を発しました。しかし、ほとんど日本語とは言えず...泣く泣く没案。

確実に解答が返ってくるようにと、1万件のデータをクラス分類タスクとして学習。
一応、まともな日本語では応答してくれるようになりましたが、挨拶などの基本事項が出来なくて没...。

もうこの辺りで、ミクさん喋ってくれないのかと心が折れかけていました。
しかし、Live2Dのミクさんにも励まされながら何とか知恵をひねり出し人口無脳を用いて実装することにしました。

人口無脳のミクさんは日本語が苦手な感じはしますが、学習したモデルを使うよりかは  
日本語を話してくれるようになり、とても嬉しかったです！

### 画面設計
昨年の知見があったとはいえ、なるべくTextAliveAPIを利用したいと考え様々な機能を実装しました。
使ってみると、もっとこだわりたくなるようなAPIもあり作業遅延の原因にも良くなっていました(笑)

##　作品が完成して
正直間に合うかがかなりきわどかったですが、メンバーの的確なアドバイスのもの何とか間に合わせることができました。

我々のミクさんはちょっと不器用だったり、変な日本語返したりしますが、我々の中では立派なミクさんです。
そんなミクさんをよろしくお願いいたします！

# 使用した主なライブラリ等
- javascript関連
  - Text Alive App
    https://github.com/TextAliveJp/textalive-app-api
  - pixi.js
    https://pixijs.com
  - kuromoji
    https://github.com/takuyaa/kuromoji.js/  
    ※ build/kuromoji.jsとdictディレクトリをcloneして使用。  
    ※ 本リポジトリにcommit済み
  - live2D関連
    - Live 2D Cubism Core
      https://www.live2d.com/download/cubism-sdk/download-web/
      - 含有されるスクリプト
        - live2dcubismcore.js
        - live2dcubismcore.js.map
- css関連
  - uiverse
    - https://uiverse.io/fanishah/tame-goose-53
    - https://uiverse.io/kennyotsu-monochromia/funny-kangaroo-70
  - cyberpunk
    - https://alddesign.github.io/cyberpunk-css/demo/#section-buttons
  - knopf
    - https://knopf.dev/#Playground
- フォント
  - googleフォント
    - https://fonts.google.com/specimen/RocknRoll+One?subset=japanese&noto.script=Jpan

# 開発関係者紹介
- **オメガりん（応募主）**
  - 担当：リーダ、プログラマ、データ作り、その他雑務  
    本業は、WebApp開発とはほぼ無縁な人。普段は自然言語処理エンジニアとしてとある企業に勤務している。（昨今の情勢を踏まえて自然言語処理だけではなく画像生成AIなどの技術も習得している）    
    今年はkeras.jsでモデルを作成して、フロントエンド(CPUのみ)で動くチャットbotを作ろうと意気込んで参加したものの大失敗して発狂。気持ちを落ち着けて人工無脳で実装することを決意。これで夢に近づけたと信じてる。
  - 好きなボカロ：鏡音リン
- **ミンゴス**
  - 担当：Live2Dの動き、データ作り  
    本業は学生（中学生）。PCをまともに触ったことがないのに手を挙げてくれた勇気あるチャレンジャー。  
    Live2Dの才があり、何も教えなくても可愛いミクの仕草を作ってくれた。  
    やる気にムラがあり、作業が滞る時もしばしばあったが、やるときの集中力はダントツで一番。若いって素晴らしい。
  - 好きなボカロ：初音ミク
- **Aoi**
  - 担当：絵師  
    絵の仕事もプログラミングの仕事もしてない。気が向いたらオメガりんのイラストを書いてくれる人。古き良き友人。
    今年もぜひお願いしますと頼んだら二つ返事で承諾を得ることができた。  
    諸事情により今年で最後の参戦になるとのこと...残念
  - 好きなボカロ：鏡音レン
- **ゆはる**
  - 担当：デザインアドバイザ  
    普段はデザインセンスを使わない仕事をしている。  
    しかし、絵を書くことが好きであることから、レイアウトのアドバイスは的確にしてもらった。　　
  - 好きなボカロ：KAITO
- **椿**
  - 担当：デザインアドバイザ  
    本業は学生（高校生）。プログラミングに興味をもって参加したが受験勉強が多忙のため今回はアドバイザとして参戦してもらった。実は、音楽の教養も十分にできており、並み以上に歌が上手いことやピアノ等も弾ける。  
    ちなみに、楽曲再生中のミクの動きの定義の原案はこの人。
  - 好きなボカロ：鏡音レン

# 免責事項・注意事項
- 本コンテストの規約に反する使い方をされた場合の責任は負いかねます。
- Aoiのイラストは、マジカルミライ(本年度以外のイベントも含む)の運営上必要な場合を除き、イラストの転載は禁止します。
- スクリプトの改修依頼などは原則お受けできません。（運営上必要な場合は可能な限り対応します。）
- kuromoji.js、フォントを本作品以外で利用する場合は、リンクを添付しておりますので、そちらからダウンロードください。
- Live 2D Cubism Coreに関するコード (live2dcubismcore.js、live2dcubismcore.js.map)の変更は一切行わないでください。
- Live2Dのモデルは我々がライセンス契約し、自らの趣味・娯楽のために作成したもので、クリプトン・フューチャー・メディア株式会社様、またそれに関連する企業や団体からLive2Dのモデルの作成を、依頼された事実は一切ありません。
- Live2Dのモデルの改変はいかなる場合も禁じます。（運営上必用な場合はご連絡ください）
- Live2Dのモデルは本作品以外で使用しないでください。万一、本作品以外で使用された場合の責任は負いかねます。
