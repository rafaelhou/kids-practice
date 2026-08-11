(function () {
  'use strict';

  var UNITS = window.UNITS, PIC = window.PIC, ICONS = window.ICONS;
  if (!UNITS) return;

  var app = document.getElementById('app');
  var back = document.getElementById('back');
  var barTitle = document.getElementById('barTitle');

  // ══════════════ 設定與紀錄 ══════════════
  var KEY_STAT = 'ph-stats', KEY_CFG = 'ph-cfg';
  var stats = load(KEY_STAT, {});          // word -> {r: 對, w: 錯}
  var cfg = load(KEY_CFG, { voice: '', rate: 0.8 });

  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function mark(word, ok) {
    var s = stats[word] || { r: 0, w: 0 };
    if (ok) s.r++; else s.w++;
    stats[word] = s;
    save(KEY_STAT, stats);
  }

  // ══════════════ 發音 ══════════════
  var voices = [];

  function pickVoice() {
    if (cfg.voice) {
      var m = voices.filter(function (v) { return v.name === cfg.voice; })[0];
      if (m) return m;
    }
    return voices.filter(function (v) { return v.lang === 'en-US'; })[0] ||
           voices.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }

  function say(text, rate) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate || cfg.rate || 0.8;
    var v = pickVoice();
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  /* 時鐘單元是中文題目，要用中文語音唸 */
  function sayZh(text, rate) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW';
    u.rate = rate || cfg.rate || 0.8;
    var v = voices.filter(function (x) { return /^zh[-_]?(TW|Hant)/i.test(x.lang); })[0] ||
            voices.filter(function (x) { return /^zh/i.test(x.lang); })[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function loadVoices() {
    voices = speechSynthesis.getVoices();
    var sel = document.getElementById('voiceSel');
    var en = voices.filter(function (v) { return /^en/i.test(v.lang); });
    sel.innerHTML = en.length
      ? en.map(function (v) {
          return '<option value="' + esc(v.name) + '"' + (v.name === cfg.voice ? ' selected' : '') + '>' +
                 esc(v.name) + '（' + v.lang + '）</option>';
        }).join('')
      : '<option value="">找不到英文語音</option>';
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  /* 有些裝置只裝了中文語音（實測過），英文會完全沒聲音。
     voices 是非同步載入的，所以只有在「已經載到語音、但裡面沒有英文」時才警告，
     避免載入前誤報。 */
  function enVoiceMissing() {
    return voices.length > 0 && !voices.some(function (v) { return /^en/i.test(v.lang); });
  }
  function voiceWarnHTML() {
    return enVoiceMissing()
      ? '<div class="warn">⚠️ 這台裝置<b>找不到英文語音</b>。「聽音找字」會改成把字寫出來，' +
        '其他遊戲不受影響。想要有聲音的話，換用 Chrome 或 Edge 再開一次。</div>'
      : '';
  }

  // ══════════════ 小工具 ══════════════
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }

  // 圖一律帶 role="img" 與 aria-label——emoji 與內嵌 SVG 預設都沒有可讀名稱
  function picHTML(word) {
    var p = PIC[word];
    var a = ' role="img" aria-label="' + esc(word) + '"';
    if (!p) return '<span class="pic emoji"' + a + '>❔</span>';
    if (p.indexOf('svg:') === 0) return '<span class="pic svg"' + a + '>' + (ICONS[p.slice(4)] || '') + '</span>';
    return '<span class="pic emoji"' + a + '>' + p + '</span>';
  }

  // ══════════════ 遊戲定義 ══════════════
  var GAMES = [
    // 英文拼讀
    { id: 'listen',  name: '聽音找字', icon: '👂', desc: '聽一個字，點出正確的圖',
      has: function (u) { return u.kind === 'phonics' && u.words.length >= 4; } },
    { id: 'choose',  name: '看圖選字', icon: '👀', desc: '看圖，選出正確的英文字',
      has: function (u) { return !!u.choose; } },
    { id: 'missing', name: '少了哪個音', icon: '🔤', desc: '補上不見的那個字母',
      has: function (u) { return !!u.missing; } },
    { id: 'rhyme',   name: '找押韻', icon: '🎵', desc: '哪些字唸起來一樣？',
      has: function (u) { return !!u.rhyme; } },
    { id: 'build',   name: '拼單字', icon: '🧱', desc: '把字母排成正確的順序',
      has: function (u) { return u.kind === 'phonics'; } },
    // 認識時鐘
    { id: 'readclock', name: '現在幾點？', icon: '⏰', desc: '看時鐘，選出正確的時間',
      has: function (u) { return u.kind === 'clock'; } },
    { id: 'findclock', name: '哪一個時鐘？', icon: '🔍', desc: '聽時間，找出對的時鐘',
      has: function (u) { return u.kind === 'clock'; } },
    { id: 'digital',   name: '配數字鐘', icon: '🔢', desc: '圓形時鐘配電子鐘',
      has: function (u) { return u.kind === 'clock'; } }
  ];

  // ══════════════ 時鐘出題 ══════════════
  function randTime(u) {
    return { h: 1 + Math.floor(Math.random() * 12),
             m: u.minutes[Math.floor(Math.random() * u.minutes.length)] };
  }
  function sameTime(a, b) { return a.h === b.h && a.m === b.m; }

  /* 干擾選項刻意挑「最容易看錯」的那幾種：
     短針看成下一個／上一個數字、長針看錯格、時分顛倒。 */
  function distractors(t, u, n) {
    var c = [];
    c.push({ h: t.h % 12 + 1, m: t.m });
    c.push({ h: (t.h + 10) % 12 + 1, m: t.m });
    u.minutes.forEach(function (m) { if (m !== t.m) c.push({ h: t.h, m: m }); });
    u.minutes.forEach(function (m) { if (m !== t.m) c.push({ h: t.h % 12 + 1, m: m }); });
    if (t.m % 5 === 0 && t.m !== 0) c.push({ h: t.m / 5, m: (t.h % 12) * 5 });

    var out = [];
    shuffle(c).forEach(function (x) {
      if (out.length >= n) return;
      if (x.h < 1 || x.h > 12) return;
      if (sameTime(x, t)) return;
      if (out.some(function (y) { return sameTime(x, y); })) return;
      out.push(x);
    });
    // 還不夠就隨機補
    var guard = 0;
    while (out.length < n && guard++ < 200) {
      var r = randTime(u);
      if (!sameTime(r, t) && !out.some(function (y) { return sameTime(r, y); })) out.push(r);
    }
    return out;
  }

  // ══════════════ 畫面：選單元 ══════════════
  var state = { unit: null, game: null };

  function screenUnits() {
    state.unit = null; state.game = null;
    back.hidden = true;
    barTitle.textContent = '小練習場';
    app.innerHTML =
      '<p class="lead">選一個單元開始。<span class="dim">每一關 10 題，答錯的會記下來給爸媽看。</span></p>' +
      window.AREAS.map(function (a) {
        var us = UNITS.filter(function (u) { return u.area === a.id; });
        if (!us.length) return '';
        return '<section class="area">' +
                 '<h2><span>' + a.icon + '</span>' + esc(a.name) + '</h2>' +
                 '<p class="anote">' + esc(a.note) + '</p>' +
                 '<div class="grid">' + us.map(function (u) {
                   var sub = u.kind === 'clock' ? u.en : u.en;
                   var cnt = u.kind === 'clock' ? u.note : u.words.length + ' 個字';
                   return '<button type="button" class="tile" data-unit="' + u.id + '">' +
                            '<span class="tico">' + u.icon + '</span>' +
                            '<span class="tname">' + esc(u.name) + '</span>' +
                            '<span class="tsub">' + esc(sub) + '</span>' +
                            '<span class="tnote">' + esc(cnt) + '</span>' +
                          '</button>';
                 }).join('') + '</div>' +
               '</section>';
      }).join('');
  }

  // ══════════════ 畫面：選遊戲 ══════════════
  function screenGames(u) {
    state.unit = u; state.game = null;
    back.hidden = false;
    barTitle.textContent = u.icon + ' ' + u.name;
    var avail = GAMES.filter(function (g) { return g.has(u); });
    var tail;
    if (u.kind === 'clock') {
      // 時鐘單元附一張「怎麼看」的示範錶，兩支針的顏色和題目裡完全一樣
      tail =
        '<div class="howto"><h3>怎麼看</h3>' +
          '<div class="demo">' + clockSVG(3, u.minutes.indexOf(30) >= 0 ? 30 : 0,
                                          { minuteNumbers: u.minuteNumbers, label: '示範時鐘' }) +
            '<ul class="legend">' +
              '<li><i class="sw hour"></i><b>紅色短針</b>＝幾<b>點</b></li>' +
              '<li><i class="sw min"></i><b>藍色長針</b>＝幾<b>分</b></li>' +
            '</ul>' +
          '</div></div>';
    } else {
      tail =
        '<div class="wordbank"><h3>這個單元的字</h3><div class="bank">' +
        u.words.map(function (w) {
          return '<button type="button" class="chip" data-say="' + esc(w) + '">' +
                 picHTML(w) + '<span>' + esc(w) + '</span></button>';
        }).join('') +
        '</div><p class="dim small">點任何一個字都會唸給你聽。</p></div>';
    }

    app.innerHTML =
      (u.kind === 'phonics' ? voiceWarnHTML() : '') +
      '<p class="lead">' + u.hint + '</p>' +
      '<div class="grid">' +
      avail.map(function (g) {
        return '<button type="button" class="tile game" data-game="' + g.id + '">' +
                 '<span class="tico">' + g.icon + '</span>' +
                 '<span class="tname">' + esc(g.name) + '</span>' +
                 '<span class="tsub">' + esc(g.desc) + '</span>' +
               '</button>';
      }).join('') +
      '</div>' + tail;
  }

  // ══════════════ 出題 ══════════════
  var QN = 10;

  function makeQuestions(u, gameId) {
    var qs = [], i;

    if (gameId === 'listen') {
      var ws = shuffle(u.words);
      for (i = 0; i < Math.min(QN, ws.length); i++) {
        var others = sample(u.words.filter(function (w) { return w !== ws[i]; }), 3);
        qs.push({ kind: 'listen', answer: ws[i], opts: shuffle(others.concat([ws[i]])) });
      }
    }

    if (gameId === 'choose') {
      shuffle(u.choose).slice(0, QN).forEach(function (c) {
        qs.push({ kind: 'choose', answer: c.w, opts: shuffle(c.opts) });
      });
    }

    if (gameId === 'missing') {
      shuffle(u.missing).slice(0, QN).forEach(function (m) {
        qs.push({ kind: 'missing', answer: m.w, blank: m.blank,
                  letter: m.w[m.blank], opts: shuffle(m.opts) });
      });
    }

    if (gameId === 'rhyme') {
      shuffle(u.rhyme).forEach(function (r) {
        qs.push({ kind: 'rhyme', pool: shuffle(r.pool), yes: r.yes });
      });
    }

    if (gameId === 'build') {
      shuffle(u.words).slice(0, QN).forEach(function (w) {
        qs.push({ kind: 'build', answer: w, tiles: shuffle(w.split('')) });
      });
    }

    if (gameId === 'readclock' || gameId === 'findclock' || gameId === 'digital') {
      var used = [];
      for (i = 0; i < QN; i++) {
        var t, guard = 0;
        do { t = randTime(u); guard++; }
        while (guard < 60 && used.some(function (x) { return sameTime(x, t); }));
        used.push(t);
        qs.push({ kind: gameId, t: t, opts: shuffle(distractors(t, u, 3).concat([t])) });
      }
    }

    return qs;
  }

  function timeKey(t) { return t.h + ':' + t.m; }

  // ══════════════ 畫面：玩 ══════════════
  var run = null;

  function screenPlay(u, g) {
    state.game = g;
    back.hidden = false;
    barTitle.textContent = g.icon + ' ' + g.name;
    run = { qs: makeQuestions(u, g.id), i: 0, right: 0, missed: [] };
    if (!run.qs.length) { screenGames(u); return; }
    renderQ();
  }

  function renderQ() {
    var q = run.qs[run.i];
    var head =
      '<div class="pbar"><div class="pfill" style="width:' + (run.i / run.qs.length * 100) + '%"></div></div>' +
      '<p class="qcount">第 ' + (run.i + 1) + ' / ' + run.qs.length + ' 題</p>';

    var body = '';

    if (q.kind === 'listen') {
      // 沒有英文語音時降級：把字寫出來，至少還玩得動
      var silent = enVoiceMissing();
      body =
        '<p class="ask">' + (silent ? '找出這個字' : '聽聽看，是哪一個？') + '</p>' +
        (silent ? '<p class="wordshow">' + esc(q.answer) + '</p>' : '') +
        '<button type="button" class="speaker" id="replay">🔊</button>' +
        '<div class="opts pics">' + q.opts.map(function (w) {
          return '<button type="button" class="opt pic-opt" data-pick="' + esc(w) + '">' + picHTML(w) + '</button>';
        }).join('') + '</div>';
    }

    if (q.kind === 'choose') {
      body =
        '<p class="ask">這是什麼？</p>' +
        '<div class="stage">' + picHTML(q.answer) +
        '<button type="button" class="speaker small" id="replay">🔊</button></div>' +
        '<div class="opts words">' + q.opts.map(function (w) {
          return '<button type="button" class="opt word-opt" data-pick="' + esc(w) + '">' + esc(w) + '</button>';
        }).join('') + '</div>';
    }

    if (q.kind === 'missing') {
      var shown = q.answer.split('').map(function (ch, idx) {
        return idx === q.blank ? '<i class="blank">?</i>' : ch;
      }).join('');
      body =
        '<p class="ask">少了哪一個字母？</p>' +
        '<div class="stage">' + picHTML(q.answer) +
        '<button type="button" class="speaker small" id="replay">🔊</button></div>' +
        '<p class="wordshow">' + shown + '</p>' +
        '<div class="opts letters">' + q.opts.map(function (l) {
          return '<button type="button" class="opt letter-opt" data-pick="' + esc(l) + '">' + esc(l) + '</button>';
        }).join('') + '</div>';
    }

    if (q.kind === 'rhyme') {
      body =
        '<p class="ask">哪些字唸起來押韻？<span class="dim">（可以選多個，選好按「看答案」）</span></p>' +
        '<div class="opts pics rhyme">' + q.pool.map(function (w) {
          return '<button type="button" class="opt pic-opt sel-toggle" data-pick="' + esc(w) + '">' +
                 picHTML(w) + '<span class="cap">' + esc(w) + '</span></button>';
        }).join('') + '</div>' +
        '<button type="button" class="btn big" id="submitRhyme">看答案</button>';
    }

    if (q.kind === 'build') {
      body =
        '<p class="ask">把字母排好</p>' +
        '<div class="stage">' + picHTML(q.answer) +
        '<button type="button" class="speaker small" id="replay">🔊</button></div>' +
        '<div class="slots" id="slots"></div>' +
        '<div class="opts letters" id="tiles">' + q.tiles.map(function (l, idx) {
          return '<button type="button" class="opt letter-opt" data-tile="' + idx + '">' + esc(l) + '</button>';
        }).join('') + '</div>' +
        '<button type="button" class="btn ghost" id="undo">← 拿掉一個</button>';
    }

    var mn = state.unit && state.unit.minuteNumbers;

    if (q.kind === 'readclock') {
      body =
        '<p class="ask">現在幾點？</p>' +
        '<div class="clockstage">' + clockSVG(q.t.h, q.t.m, { minuteNumbers: mn, label: '時鐘' }) + '</div>' +
        '<div class="opts times">' + q.opts.map(function (t) {
          return '<button type="button" class="opt time-opt" data-pick="' + timeKey(t) + '">' +
                 esc(zhTime(t.h, t.m)) + '</button>';
        }).join('') + '</div>';
    }

    if (q.kind === 'digital') {
      body =
        '<p class="ask">這個時間，電子鐘會顯示幾號？</p>' +
        '<div class="clockstage">' + clockSVG(q.t.h, q.t.m, { minuteNumbers: mn, label: '時鐘' }) + '</div>' +
        '<div class="opts times">' + q.opts.map(function (t) {
          return '<button type="button" class="opt digi-opt" data-pick="' + timeKey(t) + '">' +
                 esc(digitalTime(t.h, t.m)) + '</button>';
        }).join('') + '</div>';
    }

    if (q.kind === 'findclock') {
      body =
        '<p class="ask">哪一個是 <b class="tgt">' + esc(zhTime(q.t.h, q.t.m)) + '</b>？</p>' +
        '<button type="button" class="speaker small mid" id="replay">🔊</button>' +
        '<div class="opts clocks">' + q.opts.map(function (t) {
          return '<button type="button" class="opt clock-opt" data-pick="' + timeKey(t) + '">' +
                 clockSVG(t.h, t.m, { minuteNumbers: mn, label: '時鐘' }) + '</button>';
        }).join('') + '</div>';
    }

    app.innerHTML = head + '<div class="qbox">' + body + '</div>';

    // 自動唸題
    var isClock = /clock|digital/.test(q.kind);
    if (q.kind === 'listen') say(q.answer);
    if (q.kind === 'findclock') sayZh(zhTime(q.t.h, q.t.m));
    var rp = document.getElementById('replay');
    if (rp) rp.onclick = function () {
      if (isClock) sayZh(zhTime(q.t.h, q.t.m)); else say(q.answer);
    };

    if (q.kind === 'build') buildInit(q);
    if (q.kind === 'rhyme') {
      document.getElementById('submitRhyme').onclick = function () {
        var picked = [].map.call(app.querySelectorAll('.sel-toggle.on'), function (b) { return b.getAttribute('data-pick'); });
        judgeRhyme(q, picked);
      };
    }
  }

  // ── 拼單字 ──
  function buildInit(q) {
    var placed = [];
    var slots = document.getElementById('slots');
    var tiles = document.getElementById('tiles');

    function draw() {
      slots.innerHTML = q.answer.split('').map(function (_, i) {
        return '<span class="slot">' + (placed[i] ? esc(q.tiles[placed[i] - 1]) : '') + '</span>';
      }).join('');
      [].forEach.call(tiles.children, function (b, i) {
        b.disabled = placed.indexOf(i + 1) >= 0;
      });
      if (placed.length === q.answer.length) {
        var word = placed.map(function (p) { return q.tiles[p - 1]; }).join('');
        judge(q, word === q.answer, q.answer, word);
      }
    }

    tiles.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-tile]') : null;
      if (!b || b.disabled) return;
      placed.push(+b.getAttribute('data-tile') + 1);
      draw();
    };
    document.getElementById('undo').onclick = function () { placed.pop(); draw(); };
    draw();
  }

  // ══════════════ 判題 ══════════════
  /* key 用來累積統計，label 是顯示與發音用的文字。
     時鐘題的 key 形如 clock:3:30，跟英文單字不會撞。 */
  function judge(q, ok, key, pickedLabel, opts) {
    opts = opts || {};
    var label = opts.label || key;

    mark(key, ok);
    if (ok) run.right++; else if (run.missed.indexOf(key) < 0) run.missed.push(key);

    var box = app.querySelector('.qbox');
    box.classList.add(ok ? 'ok' : 'bad');
    [].forEach.call(app.querySelectorAll('.opt'), function (b) { b.disabled = true; });

    var msg = document.createElement('div');
    msg.className = 'verdict ' + (ok ? 'good' : 'oops');
    msg.innerHTML = ok
      ? '<span class="vico">✅</span><span>答對了！<b>' + esc(label) + '</b></span>'
      : '<span class="vico">💡</span><span>是 <b>' + esc(label) + '</b>' +
        (pickedLabel && pickedLabel !== label ? '，不是 ' + esc(pickedLabel) : '') + '</span>';
    box.appendChild(msg);

    (opts.zh ? sayZh : say)(label, 0.7);
    setTimeout(next, ok ? 1100 : 2200);
  }

  /* 統計清單裡的一顆藥丸：英文字顯示圖，時鐘顯示小錶面 */
  function chipHTML(key) {
    if (key.indexOf('clock:') === 0) {
      var p = key.split(':'), h = +p[1], m = +p[2];
      return '<button type="button" class="chip" data-sayzh="' + esc(zhTime(h, m)) + '">' +
             '<span class="pic mini">' + clockSVG(h, m, { mini: true, label: zhTime(h, m) }) + '</span>' +
             '<span>' + esc(zhTime(h, m)) + '</span></button>';
    }
    return '<button type="button" class="chip" data-say="' + esc(key) + '">' +
           picHTML(key) + '<span>' + esc(key) + '</span></button>';
  }

  function judgeRhyme(q, picked) {
    var yes = q.yes.slice().sort().join(',');
    var got = picked.slice().sort().join(',');
    var ok = yes === got;
    q.yes.forEach(function (w) { mark(w, ok); });
    if (ok) run.right++; else q.yes.forEach(function (w) { if (run.missed.indexOf(w) < 0) run.missed.push(w); });

    [].forEach.call(app.querySelectorAll('.sel-toggle'), function (b) {
      var w = b.getAttribute('data-pick');
      b.disabled = true;
      if (q.yes.indexOf(w) >= 0) b.classList.add('answer');
      else if (b.classList.contains('on')) b.classList.add('wrong');
    });
    var sb = document.getElementById('submitRhyme'); if (sb) sb.disabled = true;

    var box = app.querySelector('.qbox');
    box.classList.add(ok ? 'ok' : 'bad');
    var msg = document.createElement('div');
    msg.className = 'verdict ' + (ok ? 'good' : 'oops');
    msg.innerHTML = (ok ? '<span class="vico">✅</span><span>全對！' : '<span class="vico">💡</span><span>答案是 ') +
                    '<b>' + q.yes.map(esc).join(' · ') + '</b></span>';
    box.appendChild(msg);

    sayList(q.yes);
    setTimeout(next, 2600);
  }

  function sayList(ws) {
    var i = 0;
    (function nextWord() {
      if (i >= ws.length) return;
      say(ws[i++], 0.7);
      setTimeout(nextWord, 900);
    })();
  }

  function next() {
    run.i++;
    if (run.i >= run.qs.length) screenResult();
    else renderQ();
  }

  // ══════════════ 畫面：結果 ══════════════
  function screenResult() {
    var total = run.qs.length, r = run.right;
    var pct = r / total;
    var face = pct === 1 ? '🏆' : pct >= 0.8 ? '🌟' : pct >= 0.5 ? '👍' : '💪';
    var word = pct === 1 ? '全對！太厲害了' : pct >= 0.8 ? '很棒！' : pct >= 0.5 ? '不錯，再來一次會更好' : '慢慢來，多練幾次就會了';

    app.innerHTML =
      '<div class="result">' +
        '<span class="rico">' + face + '</span>' +
        '<p class="rscore">' + r + ' / ' + total + '</p>' +
        '<p class="rword">' + esc(word) + '</p>' +
        (run.missed.length
          ? '<div class="missed"><h3>再看一次這幾個字</h3><div class="bank">' +
            run.missed.map(chipHTML).join('') + '</div></div>'
          : '') +
        '<div class="ractions">' +
          '<button type="button" class="btn big" id="again">再玩一次</button>' +
          '<button type="button" class="btn ghost" id="other">換一個遊戲</button>' +
        '</div>' +
      '</div>';

    document.getElementById('again').onclick = function () { screenPlay(state.unit, state.game); };
    document.getElementById('other').onclick = function () { screenGames(state.unit); };
  }

  // ══════════════ 事件 ══════════════
  app.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;

    var unitBtn = t.closest('[data-unit]');
    if (unitBtn) {
      var u = UNITS.filter(function (x) { return x.id === unitBtn.getAttribute('data-unit'); })[0];
      if (u) screenGames(u);
      return;
    }

    var gameBtn = t.closest('[data-game]');
    if (gameBtn) {
      var g = GAMES.filter(function (x) { return x.id === gameBtn.getAttribute('data-game'); })[0];
      if (g) screenPlay(state.unit, g);
      return;
    }

    var chipZh = t.closest('[data-sayzh]');
    if (chipZh) { sayZh(chipZh.getAttribute('data-sayzh')); return; }

    var chip = t.closest('[data-say]');
    if (chip) { say(chip.getAttribute('data-say')); return; }

    var opt = t.closest('[data-pick]');
    if (opt && !opt.disabled) {
      var q = run && run.qs[run.i];
      if (!q) return;
      var v = opt.getAttribute('data-pick');

      if (q.kind === 'rhyme') { opt.classList.toggle('on'); return; }
      if (q.kind === 'listen') { judge(q, v === q.answer, q.answer, v); return; }
      if (q.kind === 'choose') { judge(q, v === q.answer, q.answer, v); return; }
      if (q.kind === 'missing') { judge(q, v === q.letter, q.answer, null); return; }

      if (/clock|digital/.test(q.kind)) {
        var want = timeKey(q.t);
        var picked = q.opts.filter(function (t) { return timeKey(t) === v; })[0];
        judge(q, v === want, 'clock:' + q.t.h + ':' + q.t.m,
              picked ? zhTime(picked.h, picked.m) : null,
              { label: zhTime(q.t.h, q.t.m), zh: true });
        return;
      }
    }
  });

  back.onclick = function () {
    if (state.game) screenGames(state.unit);
    else screenUnits();
  };

  // ══════════════ 家長設定 ══════════════
  var panel = document.getElementById('panel');

  function renderReview() {
    var bad = Object.keys(stats).filter(function (w) { return stats[w].w > 0; })
      .sort(function (a, b) { return stats[b].w - stats[a].w; });
    var hint = document.getElementById('reviewHint');
    var list = document.getElementById('reviewList');
    if (!bad.length) {
      hint.textContent = '還沒有紀錄。答錯的字會累積在這裡。';
      list.innerHTML = '';
      return;
    }
    hint.textContent = '錯得最多的排前面。點字會唸出來。';
    list.innerHTML = bad.map(function (w) {
      return chipHTML(w).replace('</button>',
        '<i class="cnt">錯 ' + stats[w].w + ' · 對 ' + stats[w].r + '</i></button>');
    }).join('');
  }

  document.getElementById('teacher').onclick = function () { renderReview(); panel.hidden = false; };
  document.getElementById('closePanel').onclick = function () { panel.hidden = true; };
  panel.addEventListener('click', function (e) {
    if (e.target === panel) panel.hidden = true;
    var cz = e.target.closest ? e.target.closest('[data-sayzh]') : null;
    if (cz) { sayZh(cz.getAttribute('data-sayzh')); return; }
    var c = e.target.closest ? e.target.closest('[data-say]') : null;
    if (c) say(c.getAttribute('data-say'));
  });

  document.getElementById('voiceSel').onchange = function () {
    cfg.voice = this.value; save(KEY_CFG, cfg); say('cat');
  };
  var rate = document.getElementById('rate');
  rate.value = cfg.rate;
  document.getElementById('rateVal').textContent = cfg.rate;
  rate.oninput = function () {
    cfg.rate = +this.value; document.getElementById('rateVal').textContent = cfg.rate; save(KEY_CFG, cfg);
  };
  document.getElementById('testVoice').onclick = function () { say('cat'); };
  document.getElementById('clearAll').onclick = function () {
    if (!confirm('要清除所有練習紀錄嗎？')) return;
    stats = {}; save(KEY_STAT, stats); renderReview();
  };

  screenUnits();
})();
