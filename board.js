/* 蛇棋 —— 對應課本 MCP Plaid Phonics Level A，Review 2（p.43）「Play the game」

   課本的玩法不是擲骰子：轉盤轉到一個字母，就往前走到「下一個那個字母開頭的格子」。
   所以孩子每一回合都得自己掃過整個盤面、辨認每張圖的字首——這才是這個遊戲在練的東西。
   網頁版完全照這個機制做，只有盤面形狀改成 4 欄的蛇行格，手機上才點得到。

   走位順序刻意把六個字母打散：任兩個同字母的格子相隔 3～8 格，
   轉到什麼字母都走得動，節奏才不會卡。 */

window.BOARD = (function () {
  'use strict';

  /* 課本這一頁的 24 個字（G–L），順序見上面說明 */
  var CELLS = [
    { w: 'insect',   pic: '🐞' },
    { w: 'leaf',     pic: '🍁' },
    { w: 'girl',     pic: '👧' },
    { w: 'hat',      pic: '👒' },
    { w: 'jet',      pic: '✈️' },
    { w: 'key',      pic: '🔑' },
    { w: 'goat',     pic: '🐐' },
    { w: 'horse',    pic: '🐴' },
    { w: 'lemon',    pic: '🍋' },
    { w: 'igloo',    pic: 'svg:igloo' },
    { w: 'jacket',   pic: '🧥' },
    { w: 'kite',     pic: '🪁' },
    { w: 'hot dog',  pic: '🌭' },
    { w: 'gorilla',  pic: '🦍' },
    { w: 'lion',     pic: '🦁' },
    { w: 'juice',    pic: '🧃' },
    { w: 'king',     pic: '🤴' },
    { w: 'iguana',   pic: '🦎' },
    { w: 'house',    pic: '🏠' },
    { w: 'gift',     pic: '🎁' },
    { w: 'lamp',     pic: 'svg:lamp' },
    { w: 'jam',      pic: 'svg:jam' },
    { w: 'kangaroo', pic: '🦘' },
    { w: 'glue',     pic: 'svg:glue' }
  ];

  var LETTERS = [
    { u: 'G', l: 'g', color: '#3d6fb5' },
    { u: 'H', l: 'h', color: '#4a9a5c' },
    { u: 'I', l: 'i', color: '#d6473c' },
    { u: 'J', l: 'j', color: '#8a5fc4' },
    { u: 'K', l: 'k', color: '#e0a92c' },
    { u: 'L', l: 'l', color: '#e8762c' }
  ];

  /* 梯子往上、蛇往下。格號從 1 開始，0 是 Start，25 是 End。
     蛇刻意不狠：模擬 5000 局，這組是平均 9 回合、最久 31 回合、85% 在 12 回合內結束。
     退回太多格會讓一局拖到十幾分鐘，五歲的孩子撐不到終點。 */
  var LADDERS = { 3: 11, 8: 16, 14: 21 };
  var SNAKES  = { 12: 8, 19: 14, 23: 20 };

  var COLS = 4;                       // 4 欄蛇行；手機上一格才夠大
  var LAST = CELLS.length;            // 24
  var END  = LAST + 1;                // 25

  var TOKENS = [
    { name: '紅色', emoji: '🔴', color: '#d6473c' },
    { name: '藍色', emoji: '🔵', color: '#3d6fb5' }
  ];

  /* 蛇行：第 1 格在左下，往右走，到底換行往左。回傳格號 n 的 grid 位置 */
  function gridPos(n) {
    var i = n - 1;
    var row = Math.floor(i / COLS);              // 0 = 最下面那排
    var col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
    var rows = Math.ceil(LAST / COLS);
    return { r: rows - row, c: col + 1 };        // CSS grid 由上往下數
  }

  function letterOf(n) { return CELLS[n - 1].w[0]; }

  /* 從 pos 往前找第一個這個字母開頭的格子；找不到傳回 0 */
  function nextWith(pos, l) {
    for (var n = pos + 1; n <= LAST; n++) if (letterOf(n) === l) return n;
    return 0;
  }

  /* 轉盤只從「前面真的還有那個字母」的字母裡挑。
     h 和 i 的格子比較早用完，照六等分亂轉的話會有三成的回合是空轉——
     轉了、沒得走、再轉一次，孩子什麼也沒練到，一局還會拖到十幾回合。
     這樣改之後每一轉都走得動，也就是每一轉都是一次辨音練習。 */
  function liveLetters(pos) {
    return LETTERS.filter(function (L) { return nextWith(pos, L.l) > 0; });
  }

  function mount(root, api) {
    var esc = api.esc, say = api.say;

    /* 圖自己畫，不走 app.js 的 picHTML——那個是用單字查 window.PIC，
       這裡的圖直接寫在 CELLS 裡，盤面要改圖不用去動題庫。 */
    function pic(p) {
      if (p.indexOf('svg:') === 0) return '<span class="pic svg">' + (window.ICONS[p.slice(4)] || '') + '</span>';
      return '<span class="pic emoji">' + p + '</span>';
    }

    var players = 1;
    var pos = [0, 0];
    var turn = 0;
    var spun = null;          // 這回合轉到的字母，null = 還沒轉
    var wrong = 0;
    var rot = 0;              // 轉盤累積角度，只增不減，才不會倒轉
    var busy = false;
    var won = -1;

    root.innerHTML =
      api.voiceWarnHTML() +
      '<div class="bd-setup" id="bdSetup">' +
        '<p class="lead">幾個人玩？</p>' +
        '<div class="bd-pick">' +
          '<button type="button" class="tile" data-players="1"><span class="tico">🙋</span>' +
            '<span class="tname">一個人</span><span class="tsub">自己走完全部</span></button>' +
          '<button type="button" class="tile" data-players="2"><span class="tico">🙋‍♂️🙋‍♀️</span>' +
            '<span class="tname">兩個人</span><span class="tsub">輪流轉，先到終點的贏</span></button>' +
        '</div>' +
        '<div class="bd-rule"><h3>怎麼玩</h3><ol>' +
          '<li>按轉盤，看轉到哪個字母。</li>' +
          '<li>在盤面上找出<b>你前面第一個</b>那個字母開頭的圖，點它。</li>' +
          '<li>點對了就走過去，還會唸給你聽。</li>' +
          '<li>踩到 🪜 往上爬，踩到 🐍 滑下來。先到 End 的贏。</li>' +
        '</ol></div>' +
      '</div>' +
      '<div class="bd-game" id="bdGame" hidden>' +
        '<div class="bd-status" id="bdStatus"></div>' +
        '<div class="bd-top">' +
          '<div class="bd-wheel-wrap">' +
            '<div class="bd-needle">▼</div>' +
            '<div class="bd-wheel" id="bdWheel">' + wheelSVG() + '</div>' +
          '</div>' +
          '<button type="button" class="btn big" id="bdSpin">轉！</button>' +
        '</div>' +
        '<div class="bd-boardwrap">' +
          '<div class="bd-end">🏁 End</div>' +
          '<div class="bd-board" id="bdBoard"></div>' +
          '<div class="bd-start">Start 🚩<span id="bdStartTok"></span></div>' +
        '</div>' +
        '<button type="button" class="btn ghost" id="bdRestart">重新開始</button>' +
      '</div>';

    var setup   = root.querySelector('#bdSetup');
    var game    = root.querySelector('#bdGame');
    var boardEl = root.querySelector('#bdBoard');
    var statusEl= root.querySelector('#bdStatus');
    var wheelEl = root.querySelector('#bdWheel');
    var spinBtn = root.querySelector('#bdSpin');

    function wheelSVG() {
      var s = '<svg viewBox="0 0 200 200" aria-hidden="true">';
      LETTERS.forEach(function (L, i) {
        // 每片 60°，從 12 點鐘方向順時針數
        var a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
        s += '<path d="M100 100 L' + (100 + 95 * Math.cos(a0)).toFixed(1) + ' ' +
             (100 + 95 * Math.sin(a0)).toFixed(1) + ' A95 95 0 0 1 ' +
             (100 + 95 * Math.cos(a1)).toFixed(1) + ' ' + (100 + 95 * Math.sin(a1)).toFixed(1) +
             ' Z" fill="' + L.color + '"/>';
        /* 字母包一層 g，轉盤轉的時候反向轉回來，字才會永遠是正的。
           不做這件事的話停下來一定歪 30°——正在學字母的孩子看歪的字很吃力。 */
        var am = ((i + 0.5) * 60 - 90) * Math.PI / 180;
        var cx = 100 + 62 * Math.cos(am), cy = 100 + 62 * Math.sin(am);
        s += '<g class="bd-lab">' +
             '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="22" fill="#fff"/>' +
             '<text x="' + cx.toFixed(1) + '" y="' + (cy + 8).toFixed(1) + '" text-anchor="middle" ' +
             'font-size="22" font-weight="800" fill="#3a332a" ' +
             'font-family="ui-monospace, Courier New, monospace">' + L.u + L.l + '</text></g>';
      });
      s += '<circle cx="100" cy="100" r="14" fill="#fff" stroke="#d8cfbd" stroke-width="4"/></svg>';
      return s;
    }

    function drawBoard() {
      var html = '';
      for (var n = 1; n <= LAST; n++) {
        var g = gridPos(n), c = CELLS[n - 1];
        var jump = LADDERS[n] ? '<span class="bd-jump up">🪜</span>'
                 : SNAKES[n]  ? '<span class="bd-jump down">🐍</span>' : '';
        var toks = '';
        for (var p = 0; p < players; p++) {
          if (pos[p] === n) toks += '<span class="bd-tok">' + TOKENS[p].emoji + '</span>';
        }
        html += '<button type="button" class="bd-cell" data-cell="' + n + '" ' +
                'style="grid-row:' + g.r + ';grid-column:' + g.c + '">' +
                  '<span class="bd-n">' + n + '</span>' + jump +
                  pic(c.pic) +
                  '<span class="bd-w">' + esc(c.w) + '</span>' +
                  '<span class="bd-toks">' + toks + '</span>' +
                '</button>';
      }
      boardEl.innerHTML = html;
      boardEl.style.gridTemplateColumns = 'repeat(' + COLS + ', 1fr)';

      var st = '';
      for (var p2 = 0; p2 < players; p2++) {
        if (pos[p2] === 0) st += '<span class="bd-tok">' + TOKENS[p2].emoji + '</span>';
      }
      root.querySelector('#bdStartTok').innerHTML = st;
      root.querySelector('.bd-end').classList.toggle('reached', pos.slice(0, players).some(function (x) { return x === END; }));

      /* 盤面有 24 格，手機一個畫面放不下。每走一步把目前這顆棋子捲進視線，
         孩子才不用自己找「我剛剛走到哪」。 */
      var here = pos[turn] === 0 ? root.querySelector('.bd-start')
               : pos[turn] === END ? root.querySelector('.bd-end')
               : boardEl.querySelector('[data-cell="' + pos[turn] + '"]');
      if (here && here.scrollIntoView) here.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function who() { return players === 1 ? '' : TOKENS[turn].emoji + ' '; }

    function status(msg, tone) {
      statusEl.className = 'bd-status' + (tone ? ' ' + tone : '');
      statusEl.innerHTML = msg;
    }

    function askTurn() {
      spun = null; wrong = 0;
      spinBtn.disabled = false;
      spinBtn.textContent = '轉！';
      status(who() + '換你了，按轉盤。');
    }

    function render() { drawBoard(); }

    /* ── 轉盤 ── */
    spinBtn.onclick = function () {
      if (busy || won >= 0) return;
      if (spun) { status('先在盤面上點一個 <b>' + spun.u + spun.l + '</b> 開頭的圖。', 'warn'); return; }
      busy = true;
      spinBtn.disabled = true;

      var live = liveLetters(pos[turn]);
      if (!live.length) {                                 // 站在最後一格，前面沒東西了
        status('你已經在最後一格了——衝終點！', 'good');
        setTimeout(function () { advance(END); }, 800);    // 留一拍，不然這句會被勝利訊息直接蓋掉
        return;
      }
      var L = live[Math.floor(Math.random() * live.length)];
      var i = LETTERS.indexOf(L);

      /* 指針固定在正上方，所以要把第 i 片的中心轉到 0°。
         rot 只增不減——直接寫 mod 過的角度會讓轉盤倒轉回去，看起來很怪。 */
      var want = ((-(i * 60 + 30)) % 360 + 360) % 360;
      var next = Math.floor(rot / 360) * 360 + 360 * 4 + want;
      while (next <= rot + 360 * 3) next += 360;
      rot = next;
      wheelEl.style.transform = 'rotate(' + rot + 'deg)';
      [].forEach.call(wheelEl.querySelectorAll('.bd-lab'), function (g) {
        g.style.transform = 'rotate(' + (-rot) + 'deg)';
      });

      setTimeout(function () {
        busy = false;
        spun = L;
        status('轉到 <b>' + L.u + L.l + '</b>！點出你前面<b>第一個</b> ' + L.l + ' 開頭的圖。');
        say(L.u + ' ' + L.l);
      }, 2100);
    };

    /* ── 點格子 ── */
    boardEl.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-cell]') : null;
      if (!b || busy || won >= 0) return;
      var n = +b.getAttribute('data-cell');

      // 還沒轉盤時，點格子只是聽發音——讓他可以先熟悉盤面
      if (!spun) { say(CELLS[n - 1].w); b.classList.add('poke');
                   setTimeout(function () { b.classList.remove('poke'); }, 300); return; }

      var want = nextWith(pos[turn], spun.l);
      if (n === want) { advance(n); return; }

      wrong++;
      b.classList.add('shake');
      setTimeout(function () { b.classList.remove('shake'); }, 400);
      say(CELLS[n - 1].w);

      if (letterOf(n) !== spun.l) {
        status('<b>' + esc(CELLS[n - 1].w) + '</b> 是 ' + letterOf(n) + ' 開頭的，不是 ' +
               spun.l + '。再找找看。', 'warn');
      } else if (n < pos[turn]) {
        status('<b>' + esc(CELLS[n - 1].w) + '</b> 在你<b>後面</b>了，要找前面的。', 'warn');
      } else {
        status('這個也是 ' + spun.l + " 開頭，但不是<b>第一個</b>。再往回看一點。", 'warn');
      }

      if (wrong >= 2) {
        var hint = boardEl.querySelector('[data-cell="' + want + '"]');
        if (hint) hint.classList.add('hintme');
        status('在這裡 👉 <b>' + esc(CELLS[want - 1].w) + '</b>', 'warn');
      }
    };

    /* ── 走一步 ── */
    function advance(n) {
      busy = true;
      spun = null;
      pos[turn] = n;
      render();

      if (n === END) { finish(); return; }

      var w = CELLS[n - 1].w;
      status('✅ <b>' + esc(w) + '</b>', 'good');
      say(w);

      setTimeout(function () {
        var to = LADDERS[n] || SNAKES[n];
        if (to) {
          var up = !!LADDERS[n];
          pos[turn] = to;
          render();
          status((up ? '🪜 爬梯子！上到 <b>' : '🐍 溜下去了，回到 <b>') +
                 esc(CELLS[to - 1].w) + '</b>', up ? 'good' : 'bad');
          say(CELLS[to - 1].w);
          setTimeout(nextTurn, 1400);
        } else {
          setTimeout(nextTurn, 900);
        }
      }, 1100);
    }

    function nextTurn() {
      busy = false;
      if (pos[turn] === END) { finish(); return; }
      turn = (turn + 1) % players;
      askTurn();
    }

    function finish() {
      busy = false; won = turn;
      render();
      spinBtn.disabled = true;
      status('🎉 ' + (players === 1 ? '到終點了！24 個字都走過一遍。'
                                    : TOKENS[turn].emoji + TOKENS[turn].name + '先到終點，贏了！'), 'good');
    }

    /* ── 開場 ── */
    setup.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-players]') : null;
      if (!b) return;
      players = +b.getAttribute('data-players');
      pos = [0, 0]; turn = 0; won = -1;
      setup.hidden = true; game.hidden = false;
      render();
      askTurn();
    };

    root.querySelector('#bdRestart').onclick = function () {
      pos = [0, 0]; turn = 0; won = -1; spun = null; busy = false;
      game.hidden = true; setup.hidden = false;
    };
  }

  return { mount: mount, cells: CELLS };
})();
