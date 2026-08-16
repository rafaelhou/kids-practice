/* 圓形時鐘：畫圖 ＋ 中文報時
   教學設計：短針一律紅色、長針一律藍色，全站一致。
   孩子已經認得數字，缺的是「哪一支針看什麼」，用顏色把兩支針分開最直接。 */
(function () {
  'use strict';

  var CX = 100, CY = 100;

  function pt(r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }
  function n(v) { return Math.round(v * 10) / 10; }

  /* h: 1–12, m: 0–59 */
  window.clockSVG = function (h, m, opt) {
    opt = opt || {};
    var s = '<svg viewBox="0 0 200 200" class="clock" role="img" aria-label="' +
            (opt.label || (h + '點' + m + '分')) + '">';

    // 錶面
    s += '<circle cx="100" cy="100" r="95" fill="#fff" stroke="#d9cbb8" stroke-width="3"/>';
    s += '<circle cx="100" cy="100" r="88" fill="none" stroke="#f0e6d8" stroke-width="1.5"/>';

    // 刻度：五分處加粗。mini 只留四個大刻度——一公分大的錶面塞六十根刻度只會糊掉
    for (var i = 0; i < 60; i++) {
      var big = i % 5 === 0;
      if (opt.mini && i % 15 !== 0) continue;
      var a = pt(big ? 79 : 83, i * 6), b = pt(87, i * 6);
      s += '<line x1="' + n(a[0]) + '" y1="' + n(a[1]) + '" x2="' + n(b[0]) + '" y2="' + n(b[1]) +
           '" stroke="' + (big ? '#6b6259' : '#c9beb0') + '" stroke-width="' + (opt.mini ? 6 : (big ? 3 : 1.4)) +
           '" stroke-linecap="round"/>';
    }

    // 時鐘數字 1–12（mini 不畫，太小看不清楚，反而變成雜訊）
    if (!opt.mini) {
      for (var k = 1; k <= 12; k++) {
        var p = pt(65, k * 30);
        s += '<text x="' + n(p[0]) + '" y="' + n(p[1]) + '" text-anchor="middle" ' +
             'dominant-baseline="central" font-size="21" font-weight="700" fill="#2f2a26">' + k + '</text>';
      }
    }

    // 分鐘數字（進階單元才顯示）：把「數字 × 5」直接寫出來
    if (opt.minuteNumbers) {
      for (var j = 1; j <= 12; j++) {
        var q = pt(89, j * 30);
        s += '<text x="' + n(q[0]) + '" y="' + n(q[1]) + '" text-anchor="middle" ' +
             'dominant-baseline="central" font-size="9.5" font-weight="700" fill="#4a9bd1">' +
             (j === 12 ? 0 : j * 5) + '</text>';
      }
    }

    // 長針（分）藍色、細而長
    var ma = m * 6, mp = pt(72, ma);
    s += '<line x1="100" y1="100" x2="' + n(mp[0]) + '" y2="' + n(mp[1]) +
         '" stroke="#4a9bd1" stroke-width="5" stroke-linecap="round"/>';

    // 短針（時）紅色、粗而短
    var ha = (h % 12) * 30 + m * 0.5, hp = pt(46, ha);
    s += '<line x1="100" y1="100" x2="' + n(hp[0]) + '" y2="' + n(hp[1]) +
         '" stroke="#e05252" stroke-width="8" stroke-linecap="round"/>';

    s += '<circle cx="100" cy="100" r="6" fill="#2f2a26"/>';
    s += '<circle cx="100" cy="100" r="2.4" fill="#fff"/>';
    s += '</svg>';
    return s;
  };

  var ZH = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  function zhNum(v) {
    if (v <= 10) return ZH[v];
    if (v < 20) return '十' + ZH[v - 10];
    var t = Math.floor(v / 10), o = v % 10;
    return ZH[t] + '十' + (o ? ZH[o] : '');
  }

  /* 三點半 / 三點十五分 / 三點 */
  window.zhTime = function (h, m) {
    if (m === 0) return zhNum(h) + '點';
    if (m === 30) return zhNum(h) + '點半';
    return zhNum(h) + '點' + zhNum(m) + '分';
  };

  /* 9點 / 9點半 / 9點15分
     選項用阿拉伯數字：孩子已經認得數字，錶面也是數字，
     選項再寫成國字反而多一層轉換。發音仍走 zhTime。 */
  window.numTime = function (h, m) {
    if (m === 0) return h + '點';
    if (m === 30) return h + '點半';
    return h + '點' + m + '分';
  };

  window.digitalTime = function (h, m) {
    return h + ':' + (m < 10 ? '0' + m : m);
  };
})();
