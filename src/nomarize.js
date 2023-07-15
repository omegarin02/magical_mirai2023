//表記ゆれをなくすためのスクリプト
function zenkaku2Hankaku(str) {
  return str.replace(/[A-Za-z0-9]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

function hankana2Zenkana(str) {
  var kanaMap = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
  };

  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
  return str
    .replace(reg, function (match) {
        return kanaMap[match];
    })
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜');
};

function nomarizeMiku(str){
  var normalizeMiku = {
    "初音ミクさん":"ミク",
    "初音ミクちゃん":"ミク",
    "ミクちゃん":"ミク",
    "ミクちん":"ミク",
    "ミクちゃーん":"ミク",
    "ミクさん":"ミク",
    "ミクたん":"ミク",
    "ミク姉さん":"ミク",
    "ミク姐さん":"ミク",
    "ミク姉":"ミク",
    "ミク姐":"ミク",
    "初音ミク":"ミク",
    "初音":"ミク",
    "ＨＡＴＳＵＮＥＭＩＫＵ":"ミク",
    "ＭＩＫＵ":"ミク",
    "ＨＡＴＳＵＮＥ":"ミク",
  }
  var reg = new RegExp('(' + Object.keys(normalizeMiku).join('|') + ')', 'g');
  return str
    .replace(reg, function (match) {
        return normalizeMiku[match];
  })
}

function nomarizeFirstPerson(str){
  let normalizeFirstPerson ={
    "わたし":"私",
    "ぼく":"私",
    "僕":"私",
    "ボク":"私",
    "ぼく":"私",
    "俺":"私",
    "オレ":"私",
    "あたし":"私",
    "アタシ":"私",
    "わい":"私",
    "ワイ":"私",
  }
  var reg = new RegExp('(' + Object.keys(normalizeFirstPerson).join('|') + ')', 'g');
  return str
    .replace(reg, function (match) {
        return normalizeFirstPerson[match];
  })
}