/* 拼讀練習場 · 題庫
   對應家教使用的 MCP Plaid Phonics Level A：
   p.63 Consonants Assessment（補開頭的音）
   p.68 Short vowel a: Phonograms/rhyme（找押韻）
   p.69 Short vowel a: Sound to symbol（看圖選字）
   單字與選項盡量沿用課本原題，孩子在紙本練過的東西才接得起來。 */

/* 圖：優先用 emoji；沒有合適 emoji 的字用 svg: 開頭，畫在 icons.js */
window.PIC = {
  // ── 子音單元（p.63）──
  yarn: '🧶', bus: '🚌', vase: 'svg:vase', hat: '🎩', fire: '🔥', heart: '❤️',
  jug: 'svg:jug', zebra: '🦓', pen: '🖊️', queen: 'svg:queen', wagon: 'svg:wagon', tub: '🛁',
  // ── 短母音 a 單元（p.68–69）──
  pan: '🍳', rat: '🐀', ax: '🪓', cat: '🐱', man: '👨', can: '🥫',
  fan: 'svg:fan', lamp: 'svg:lamp', tag: '🏷️', bag: '👜', ant: '🐜',
  ram: '🐏', dad: 'svg:dad', ham: '🍖', lamb: '🐑', bat: 'svg:bat',
  cap: '🧢', map: '🗺️', hand: '✋', van: '🚐', cab: '🚕', band: 'svg:band', tack: '📌'
};

/* 兩個練習區 */
window.AREAS = [
  { id: 'phonics', name: '英文拼讀', icon: '🔤',
    note: '對應家教課本 MCP Plaid Phonics Level A' },
  { id: 'clock',   name: '認識時鐘', icon: '🕐',
    note: '紅色短針看「幾點」，藍色長針看「幾分」' },
  { id: 'board',   name: '玩遊戲', icon: '🎲',
    note: '課本 Review 2 的蛇棋，可以兩個人輪流玩' }
];

window.UNITS = [

{
  id: 'cons',
  area: 'phonics', kind: 'phonics',
  name: '開頭的音',
  en: 'Beginning Sounds',
  icon: '🔤',
  note: '課本 p.63',
  hint: '看圖，選出這個字開頭的字母。',
  words: ['yarn', 'bus', 'vase', 'hat', 'fire', 'heart', 'jug', 'zebra', 'pen', 'queen', 'wagon', 'tub'],

  /* 少了哪個音：blank 是被挖掉的位置（0 = 第一個字母） */
  missing: [
    { w: 'yarn',  blank: 0, opts: ['y', 'w', 'r'] },
    { w: 'bus',   blank: 0, opts: ['b', 'd', 'p'] },
    { w: 'vase',  blank: 0, opts: ['v', 'f', 'b'] },
    { w: 'hat',   blank: 0, opts: ['h', 'n', 'm'] },
    { w: 'fire',  blank: 0, opts: ['f', 'v', 'h'] },
    { w: 'heart', blank: 0, opts: ['h', 'y', 'n'] },
    { w: 'jug',   blank: 0, opts: ['j', 'g', 'y'] },
    { w: 'zebra', blank: 0, opts: ['z', 's', 'j'] },
    { w: 'pen',   blank: 0, opts: ['p', 'b', 'd'] },
    { w: 'queen', blank: 0, opts: ['q', 'g', 'c'] },
    { w: 'wagon', blank: 0, opts: ['w', 'v', 'm'] },
    { w: 'tub',   blank: 0, opts: ['t', 'd', 'b'] }
  ]
},

{
  id: 'shorta',
  area: 'phonics', kind: 'phonics',
  name: '短母音 a',
  en: 'Short Vowel a',
  icon: '🅰️',
  note: '課本 p.68–69',
  hint: 'a 這個母音發「ㄟ」還是「ㄚ」？這一單元都是短音的 a。',
  words: ['pan', 'rat', 'ax', 'cat', 'man', 'can', 'fan', 'lamp', 'tag', 'bag',
          'ant', 'ram', 'dad', 'ham', 'lamb', 'bat', 'cap', 'map', 'hand', 'van',
          'cab', 'band', 'tack'],

  /* 看圖選字 —— 選項完全照課本 p.69 的原題 */
  choose: [
    { w: 'bat',  opts: ['bat', 'bad', 'bag'] },
    { w: 'ax',   opts: ['ant', 'wax', 'ax'] },
    { w: 'can',  opts: ['nap', 'can', 'cat'] },
    { w: 'cap',  opts: ['cab', 'cap', 'nap'] },
    { w: 'band', opts: ['man', 'bag', 'band'] },
    { w: 'tag',  opts: ['tag', 'rag', 'tap'] },
    { w: 'fan',  opts: ['fat', 'fan', 'tan'] },
    { w: 'hand', opts: ['had', 'hand', 'land'] },
    { w: 'lamp', opts: ['tap', 'lap', 'lamp'] },
    { w: 'van',  opts: ['van', 'had', 'ran'] },
    { w: 'dad',  opts: ['bad', 'cab', 'dad'] },
    { w: 'pan',  opts: ['pat', 'pan', 'ran'] }
  ],

  /* 找押韻 —— 五組完全照課本 p.68 的原題 */
  rhyme: [
    { pool: ['pan', 'rat', 'ax', 'cat'],    yes: ['rat', 'cat'] },
    { pool: ['man', 'can', 'fan', 'lamp'],  yes: ['man', 'can', 'fan'] },
    { pool: ['tag', 'tack', 'bag', 'ant'],  yes: ['tag', 'bag'] },
    { pool: ['ram', 'dad', 'ham', 'lamb'],  yes: ['ram', 'ham', 'lamb'] },
    { pool: ['bat', 'cap', 'map', 'hand'],  yes: ['cap', 'map'] }
  ],

  /* 少了哪個音 —— 這一單元練字尾與中間的母音 */
  missing: [
    { w: 'cat',  blank: 2, opts: ['t', 'p', 'n'] },
    { w: 'can',  blank: 2, opts: ['n', 't', 'p'] },
    { w: 'cap',  blank: 2, opts: ['p', 'n', 't'] },
    { w: 'bag',  blank: 2, opts: ['g', 'd', 't'] },
    { w: 'bat',  blank: 2, opts: ['t', 'g', 'd'] },
    { w: 'ham',  blank: 2, opts: ['m', 'n', 't'] },
    { w: 'van',  blank: 2, opts: ['n', 'm', 't'] },
    { w: 'map',  blank: 2, opts: ['p', 'n', 't'] },
    { w: 'pan',  blank: 1, opts: ['a', 'e', 'i'] },
    { w: 'rat',  blank: 1, opts: ['a', 'o', 'u'] },
    { w: 'tag',  blank: 1, opts: ['a', 'i', 'e'] },
    { w: 'ram',  blank: 1, opts: ['a', 'u', 'o'] }
  ]
},

/* ══════════════ 認識時鐘 ══════════════
   難度是「長針停在哪裡」：先只停 12，再加 6，最後才是十二個位置。
   短針的位置會隨分鐘微微偏移（3:30 的短針在 3 和 4 中間），
   這正是孩子最容易看錯的地方，所以第二關開始就讓他遇到。 */

{
  id: 'clock1',
  area: 'clock', kind: 'clock',
  name: '整點',
  en: "O'clock",
  icon: '🕐',
  note: '幾點',
  hint: '<b>長針指著 12</b> 的時候，就是整點。<b>短針指到幾，就是幾點。</b>',
  minutes: [0]
},

{
  id: 'clock2',
  area: 'clock', kind: 'clock',
  name: '半點',
  en: 'Half past',
  icon: '🕜',
  note: '幾點半',
  hint: '<b>長針指著 6</b> 的時候是「半」。這時候短針會停在兩個數字中間——<b>看比較小的那個</b>。',
  minutes: [0, 30]
},

{
  id: 'clock3',
  area: 'clock', kind: 'clock',
  name: '幾點幾分',
  en: 'Five minutes',
  icon: '🕔',
  note: '五分鐘一格',
  hint: '長針指到的數字要<b>乘以 5</b>，才是分鐘。錶面外圈的藍色小字就是答案。',
  minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minuteNumbers: true
},

/* 蛇棋。盤面與玩法都在 board.js，這裡只登記成一個單元讓它出現在首頁。 */
{
  id: 'snakes',
  area: 'board', kind: 'board',
  name: '蛇棋',
  en: 'Snakes & Ladders',
  icon: '🐍',
  note: '課本 p.43',
  hint: '轉盤轉到哪個字母，就往前走到下一個那個字母開頭的圖。'
}

];
