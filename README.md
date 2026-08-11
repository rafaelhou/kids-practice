# 小練習場

給幼兒的練習遊戲，兩個區域：**英文拼讀**與**認識時鐘**。
不需帳號、不上傳資料，紀錄只存在這台裝置。

**線上瀏覽**
- https://kids-practice-7q9.pages.dev/
- https://rafaelhou.github.io/kids-practice/

---

## 🔤 英文拼讀

題型與單字**對應家教使用的 MCP Plaid Phonics Level A**，孩子在紙本練過的東西能直接接上。

| 課本 | 頁數 | 這裡的遊戲 |
|---|---|---|
| Consonants: Assessment | p.63 | 🔤 少了哪個音 |
| Short vowel a: Phonograms/rhyme | p.68 | 🎵 找押韻 |
| Short vowel a: Sound to symbol | p.69 | 👀 看圖選字 |

p.68 的五組押韻、p.69 的十二題選項**完全沿用課本原題**。
另加兩個紙本做不到的：👂 聽音找字、🧱 拼單字。

## 🕐 認識時鐘

給「已經認得數字、但看不懂圓形鐘」的階段。**紅色短針＝幾點，藍色長針＝幾分**，
全站顏色一致，選遊戲的頁面附一張示範錶加圖例。

| 關卡 | 長針停在 | 要學會的 |
|---|---|---|
| 🕐 整點 | 只停 12 | 短針指幾就幾點 |
| 🕜 半點 | 12 或 6 | 長針指 6 是「半」，且**短針會卡在兩個數字中間，看小的那個** |
| 🕔 幾點幾分 | 十二個位置 | 長針指到的數字**乘以 5**；這關錶面外圈加印藍色分鐘數字 |

三個遊戲：⏰ 現在幾點？（選中文時間）、🔢 配數字鐘（圓形錶配 `3:30`，用他已經會的數字架不會的）、🔍 哪一個時鐘？（聽中文報時挑錶面）。

**干擾選項刻意挑最容易看錯的**：短針看成下一個數字、長針看錯一格、時分顛倒。

---

## 設計取捨

**發音用瀏覽器內建語音合成（Web Speech API），不放音檔。**
英文用 `en-US`、時鐘用 `zh-TW`。好處是零檔案、任何字都唸得出來；
代價是不同裝置的語音不同，而且 Chrome 的英文語音是雲端的、**需要連網**。

**沒有英文語音時會降級而不是壞掉。**
實測有些裝置只裝了中文語音。程式偵測到就會顯示提示，並把「聽音找字」改成把字寫出來——
其他遊戲不受影響。判斷條件是「已載到語音、但裡面沒有英文」，避免載入前誤報。

**圖以 emoji 為主，emoji 表達不了的自己畫 SVG。**
`fan`、`lamp`、`dad`、`bat`、`band`、`vase`、`jug`、`queen`、`wagon` 這九個字
沒有夠明確的 emoji（🦇 是蝙蝠不是球棒、🪔 是油燈不是檯燈），畫在 `icons.js`。

**時鐘是算出來的，不是貼圖。** 短針角度含分鐘偏移——9:30 的短針在 285°（270+15），
不是偷懶畫在 9 上面，因為「短針不在正中間」正是要教的重點。

**答案不放進 DOM。** 選項按鈕只帶自己的值。

**答錯的會累積。** 家長面板列出錯最多的，英文顯示圖、時鐘顯示小錶面，點下去會唸。

## 檔案

```
index.html      外殼與家長面板
style.css
app.js          畫面切換、出題、判題、發音、紀錄
data.js         區域、單元、題目（主要維護這個檔）
icons.js        emoji 沒有的字，自己畫的 SVG
clock.js        錶面繪製 ＋ 中文報時
counter.js      Supabase 瀏覽計數
```

## 加內容

### 加拼讀單元

```js
{
  id: 'shorte', area: 'phonics', kind: 'phonics',
  name: '短母音 e', en: 'Short Vowel e', icon: '🅴',
  note: '課本 p.xx', hint: '一句話說明',
  words: ['bed', 'pen'],                                 // 聽音找字、拼單字會自動出題
  choose:  [ { w:'bed', opts:['bed','bad','bid'] } ],
  missing: [ { w:'bed', blank:0, opts:['b','d','p'] } ], // blank 0 = 第一個字母
  rhyme:   [ { pool:['bed','pen','ten','cat'], yes:['pen','ten'] } ]
}
```

新字要在 `data.js` 的 `PIC` 補圖；用 `svg:名稱` 的話要在 `icons.js` 補圖。

### 加時鐘關卡

```js
{ id:'clock4', area:'clock', kind:'clock', name:'幾點幾分', icon:'🕕',
  note:'一分鐘一格', hint:'說明文字（可用 <b>）',
  minutes:[0,1,2,/* … */59], minuteNumbers:true }
```

`minutes` 決定長針會停在哪些位置，難度全由它控制。

### 資料一致性自我檢查

```js
const bad = [];
UNITS.filter(u => u.kind === 'phonics').forEach(u => {
  u.words.forEach(w => { if (!PIC[w]) bad.push('缺圖 ' + w); });
  (u.choose||[]).forEach(c => {
    if (!PIC[c.w]) bad.push('缺圖 ' + c.w);
    if (c.opts.indexOf(c.w) < 0) bad.push('正解不在選項 ' + c.w);
  });
  (u.missing||[]).forEach(m => {
    if (m.opts.indexOf(m.w[m.blank]) < 0) bad.push('正解字母不在選項 ' + m.w);
  });
  (u.rhyme||[]).forEach(r => r.yes.forEach(w => {
    if (r.pool.indexOf(w) < 0) bad.push('押韻答案不在池中 ' + w);
  }));
});
console.log(bad.length ? bad : '全部通過');
```

## 沒有做的事

沒有廣告、沒有排行榜、沒有計時、沒有帳號。這個年紀不需要被計時追著跑。
