/* ===================== 종목 메타 ===================== */
const STOCK_META = [
  { name: '삼성전자',      code: '005930', symbol: '005930.KS', cap: '431조' },
  { name: 'SK하이닉스',    code: '000660', symbol: '000660.KS', cap: '135조' },
  { name: 'LG에너지솔루션', code: '373220', symbol: '373220.KS', cap: '89조'  },
  { name: '삼성바이오로직스',code: '207940', symbol: '207940.KS', cap: '65조'  },
  { name: 'POSCO홀딩스',   code: '005490', symbol: '005490.KS', cap: '27조'  },
  { name: '현대차',        code: '005380', symbol: '005380.KS', cap: '46조'  },
  { name: '카카오',        code: '035720', symbol: '035720.KS', cap: '18조'  },
  { name: '네이버',        code: '035420', symbol: '035420.KS', cap: '29조'  },
  { name: 'LG화학',       code: '051910', symbol: '051910.KS', cap: '21조'  },
  { name: 'KB금융',       code: '105560', symbol: '105560.KS', cap: '27조'  },
];

const INDEX_META = [
  { id: 'kospi',  name: 'KOSPI',   symbol: '^KS11' },
  { id: 'kosdaq', name: 'KOSDAQ',  symbol: '^KQ11' },
  { id: 'sp500',  name: 'S&P 500', symbol: '^GSPC' },
  { id: 'nasdaq', name: 'NASDAQ',  symbol: '^IXIC' },
  { id: 'dow',    name: 'DOW',     symbol: '^DJI'  },
  { id: 'nikkei', name: 'NIKKEI',  symbol: '^N225' },
];

const NEWS = [
  { category: '시장분석',  title: 'KOSPI, 외국인 순매수에 반등…반도체 강세', summary: '외국인 투자자들이 반도체 섹터를 중심으로 매수세를 이어가며 KOSPI가 반등에 성공했다.', source: '한국경제', time: '10분 전' },
  { category: '해외증시',  title: 'S&P 500, 기술주 반등에 상향 돌파', summary: '빅테크 실적 기대감과 연준의 금리 인하 신호로 미국 주요 지수가 상승 흐름을 이어가고 있다.', source: '매일경제', time: '25분 전' },
  { category: '개별종목',  title: '삼성전자, HBM4 양산 임박…목표주가 상향', summary: '삼성전자가 차세대 HBM4 메모리 양산을 앞두고 엔비디아와의 납품 협상이 마무리 단계에 접어들었다.', source: '조선비즈', time: '1시간 전' },
  { category: '거시경제',  title: '미 연준, FOMC 금리 동결…연내 2회 인하 시사', summary: '파월 의장은 인플레이션 둔화를 확인한 후 금리 인하에 나설 것이라고 밝혀 시장 불확실성을 낮췄다.', source: '연합인포맥스', time: '2시간 전' },
  { category: '업종',      title: '2차전지 섹터 강세…LG에너지솔루션 신고가', summary: '전기차 수요 회복 기대와 원자재 가격 안정화로 배터리 관련주들이 일제히 상승 마감했다.', source: '이데일리', time: '3시간 전' },
  { category: '환율·금리', title: '원·달러 환율 안정…외국인 자금 유입 긍정적', summary: '달러 약세와 위험선호 심리 회복으로 원화가 강세를 보이며 외국인 자금 유입에 우호적인 환경이 형성됐다.', source: 'FN뉴스', time: '4시간 전' },
];

const ECONOMIC_CALENDAR = [
  { date: '2026.03.18', title: '미 FOMC 회의 결과 발표', country: '🇺🇸 미국', impact: 'high',   detail: '기준금리 결정 및 파월 의장 기자회견' },
  { date: '2026.03.20', title: '한국 2월 소비자물가지수', country: '🇰🇷 한국', impact: 'medium', detail: '전월 대비 소비자물가 변화율 발표' },
  { date: '2026.03.25', title: '미국 3월 소비자신뢰지수', country: '🇺🇸 미국', impact: 'medium', detail: 'Conference Board 소비자신뢰지수' },
  { date: '2026.03.28', title: '미국 2월 PCE 물가지수', country: '🇺🇸 미국', impact: 'high',   detail: '연준 선호 물가지표, 금리 방향 영향' },
  { date: '2026.04.01', title: '삼성전자 1분기 잠정실적', country: '🇰🇷 한국', impact: 'high',   detail: '반도체·스마트폰 실적 발표' },
  { date: '2026.04.04', title: '미국 3월 고용보고서',     country: '🇺🇸 미국', impact: 'high',   detail: '비농업 고용, 실업률, 임금 상승률' },
];

/* ===================== 런타임 데이터 ===================== */
let INDICES = [];
let STOCKS  = [];

/* ===================== 유틸 ===================== */
const fmt    = n => (n == null ? '-' : Number(n).toLocaleString('ko-KR'));
const fmtPct = p => (p >= 0 ? '+' : '') + Number(p).toFixed(2) + '%';
const updown = v => v >= 0 ? 'up' : 'down';
const arrow  = v => v >= 0 ? '▲' : '▼';

function fmtVol(n) {
  if (n == null) return '-';
  if (n >= 1e12) return (n/1e12).toFixed(1)+'조';
  if (n >= 1e8)  return (n/1e8).toFixed(0)+'억';
  if (n >= 1e4)  return (n/1e4).toFixed(0)+'만';
  return n.toLocaleString();
}
function fmtCap(n, fallback) {
  if (!n) return fallback || '-';
  const won = n * 1350;
  return won >= 1e12 ? (won/1e12).toFixed(0)+'조' : (won/1e8).toFixed(0)+'억';
}
function buildHist(prevClose, currentPrice) {
  return Array.from({length:10}, (_,i) => Math.round(prevClose + (currentPrice-prevClose)*(i/9)));
}

/* ===================== TOAST ===================== */
let toastContainer;
function showToast(msg, type = 'info') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ===================== 테마 ===================== */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('sv_theme', isDark ? 'light' : 'dark');
}
function initTheme() {
  const saved = localStorage.getItem('sv_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙' : '☀️';
}

/* ===================== 모달 ===================== */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }
function openAddWatchlistModal() {
  populateWatchlistAddSelect();
  openModal('addWatchlistModal');
}

/* ===================== 시계 ===================== */
function updateClock() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('ko-KR', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

/* ===================== 장 상태 ===================== */
function updateMarketStatus() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const total = h * 60 + m;
  const bar = document.getElementById('marketStatusBar');
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

  if (isWeekday && total >= 540 && total < 930) {
    bar.className = 'market-status-bar open';
    bar.textContent = '🟢 KOSPI 장중 (09:00 ~ 15:30)';
  } else {
    bar.className = 'market-status-bar close';
    const nextOpen = isWeekday && total < 540 ? '오늘 09:00' : '다음 거래일 09:00';
    bar.textContent = `🔴 장 마감 · 다음 개장: ${nextOpen}`;
  }

  // 장 시작 알림 (9:00)
  if (isWeekday && h === 9 && m === 0) {
    browserNotify('📈 장 시작', 'KOSPI 장이 열렸습니다. (09:00)');
  }
  // 장 마감 알림 (15:30)
  if (isWeekday && h === 15 && m === 30) {
    browserNotify('📉 장 마감', 'KOSPI 장이 마감됐습니다. (15:30)');
  }
}

/* ===================== 브라우저 알림 ===================== */
function browserNotify(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '📈' });
  }
}
function requestNotificationPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

/* ===================== 가격 알림 ===================== */
let priceAlerts = JSON.parse(localStorage.getItem('sv_alerts') || '[]');

function saveAlerts() { localStorage.setItem('sv_alerts', JSON.stringify(priceAlerts)); }

function addAlert() {
  const symbol = document.getElementById('alertSymbol').value;
  const cond   = document.getElementById('alertCondition').value;
  const price  = parseFloat(document.getElementById('alertPrice').value);
  if (!symbol || !price) return showToast('종목과 목표가를 입력하세요.', 'warn');
  const meta = STOCK_META.find(s => s.symbol === symbol);
  priceAlerts.push({ symbol, name: meta?.name || symbol, cond, price, triggered: false });
  saveAlerts();
  renderAlertList();
  document.getElementById('alertPrice').value = '';
  showToast(`✅ ${meta?.name} 알림이 설정됐습니다.`, 'success');
}

function removeAlert(i) {
  priceAlerts.splice(i, 1);
  saveAlerts();
  renderAlertList();
}

function renderAlertList() {
  const el = document.getElementById('alertList');
  if (!priceAlerts.length) { el.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px">설정된 알림 없음</div>'; return; }
  el.innerHTML = priceAlerts.map((a, i) => `
    <div class="alert-item">
      <span><strong>${a.name}</strong> ${a.cond === 'above' ? '≥' : '≤'} <strong>${fmt(a.price)}원</strong></span>
      <button class="del-btn" onclick="removeAlert(${i})">✕</button>
    </div>
  `).join('');
}

function checkPriceAlerts() {
  priceAlerts.forEach(a => {
    if (a.triggered) return;
    const stock = STOCKS.find(s => s.symbol === a.symbol);
    if (!stock) return;
    const hit = a.cond === 'above' ? stock.price >= a.price : stock.price <= a.price;
    if (hit) {
      a.triggered = true;
      saveAlerts();
      showToast(`🔔 ${a.name} 목표가 도달! ${fmt(stock.price)}원`, 'warn');
      browserNotify(`🔔 ${a.name} 알림`, `현재가 ${fmt(stock.price)}원 — 목표가 ${fmt(a.price)}원 ${a.cond === 'above' ? '이상' : '이하'} 도달`);
    }
  });
}

function populateAlertSelect() {
  const sel = document.getElementById('alertSymbol');
  sel.innerHTML = '<option value="">선택하세요</option>' +
    STOCK_META.map(s => `<option value="${s.symbol}">${s.name}</option>`).join('');
}

/* ===================== 관심종목 (localStorage) ===================== */
let watchlistCodes = JSON.parse(localStorage.getItem('sv_watchlist') || '["005930","000660","035420","035720"]');

function saveWatchlist() { localStorage.setItem('sv_watchlist', JSON.stringify(watchlistCodes)); }

function addToWatchlist() {
  const sel = document.getElementById('watchlistAddSymbol');
  const code = sel.value;
  if (!code) return;
  if (!watchlistCodes.includes(code)) {
    watchlistCodes.push(code);
    saveWatchlist();
    buildWatchlist();
    showToast(`⭐ 관심종목에 추가됐습니다.`, 'success');
  }
  closeModal('addWatchlistModal');
}

function removeFromWatchlist(code) {
  watchlistCodes = watchlistCodes.filter(c => c !== code);
  saveWatchlist();
  buildWatchlist();
}

function populateWatchlistAddSelect() {
  const sel = document.getElementById('watchlistAddSymbol');
  sel.innerHTML = '<option value="">종목 선택</option>' +
    STOCK_META.filter(s => !watchlistCodes.includes(s.code))
      .map(s => `<option value="${s.code}">${s.name}</option>`).join('');
}

/* ===================== 포트폴리오 (localStorage) ===================== */
let portfolio = JSON.parse(localStorage.getItem('sv_portfolio') || '[]');

function savePortfolio() { localStorage.setItem('sv_portfolio', JSON.stringify(portfolio)); }

function addPortfolioItem() {
  const sym  = document.getElementById('portfolioSymbol').value;
  const qty  = parseInt(document.getElementById('portfolioQty').value);
  const avg  = parseInt(document.getElementById('portfolioAvg').value);
  if (!sym || !qty || !avg) return showToast('종목, 수량, 매입가를 입력하세요.', 'warn');
  const meta = STOCK_META.find(s => s.symbol === sym);
  const existing = portfolio.find(p => p.symbol === sym);
  if (existing) {
    const totalQty = existing.qty + qty;
    existing.avg = Math.round((existing.avg * existing.qty + avg * qty) / totalQty);
    existing.qty = totalQty;
  } else {
    portfolio.push({ symbol: sym, name: meta?.name || sym, qty, avg });
  }
  savePortfolio();
  renderPortfolio();
  document.getElementById('portfolioQty').value = '';
  document.getElementById('portfolioAvg').value = '';
  showToast(`💼 포트폴리오에 추가됐습니다.`, 'success');
}

function removePortfolioItem(symbol) {
  portfolio = portfolio.filter(p => p.symbol !== symbol);
  savePortfolio();
  renderPortfolio();
}

function renderPortfolio() {
  const body = document.getElementById('portfolioBody');
  const summary = document.getElementById('portfolioSummary');
  if (!portfolio.length) {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--text-muted)">종목을 추가해주세요</td></tr>';
    summary.innerHTML = '';
    return;
  }
  let totalInvest = 0, totalValue = 0;
  body.innerHTML = portfolio.map(p => {
    const stock = STOCKS.find(s => s.symbol === p.symbol);
    const cur = stock?.price || 0;
    const value = cur * p.qty;
    const invest = p.avg * p.qty;
    const profit = value - invest;
    const profitPct = invest ? (profit / invest * 100) : 0;
    totalInvest += invest; totalValue += value;
    return `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${fmt(p.qty)}</td>
        <td>${fmt(p.avg)}</td>
        <td>${fmt(cur)}</td>
        <td>${fmt(value)}</td>
        <td class="${updown(profit)}">${profit >= 0 ? '+' : ''}${fmt(profit)}</td>
        <td class="${updown(profitPct)}">${fmtPct(profitPct)}</td>
        <td><button class="del-btn" onclick="removePortfolioItem('${p.symbol}')">✕</button></td>
      </tr>
    `;
  }).join('');
  const totalProfit = totalValue - totalInvest;
  const totalPct = totalInvest ? (totalProfit/totalInvest*100) : 0;
  summary.innerHTML = `
    <span>총 투자금액: <strong>${fmt(totalInvest)}원</strong></span>
    <span>총 평가금액: <strong>${fmt(totalValue)}원</strong></span>
    <span>총 손익: <strong class="${updown(totalProfit)}">${totalProfit>=0?'+':''}${fmt(totalProfit)}원</strong></span>
    <span>수익률: <strong class="${updown(totalPct)}">${fmtPct(totalPct)}</strong></span>
  `;
}

function populatePortfolioSelect() {
  const sel = document.getElementById('portfolioSymbol');
  sel.innerHTML = '<option value="">종목 선택</option>' +
    STOCK_META.map(s => `<option value="${s.symbol}">${s.name}</option>`).join('');
}

/* ===================== API (GitHub Pages / Static Mode) ===================== */
const CORS_PROXY = 'https://corsproxy.io/?url=';

async function proxyFetch(url) {
  const res = await fetch(CORS_PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error('fetch failed: ' + res.status);
  return res.json();
}

async function fetchYahooMeta(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const data = await proxyFetch(url);
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) return null;
  const prev = meta.chartPreviousClose || meta.regularMarketPreviousClose || meta.regularMarketPrice;
  return {
    symbol,
    regularMarketPrice:         meta.regularMarketPrice,
    regularMarketChange:        meta.regularMarketPrice - prev,
    regularMarketChangePercent: ((meta.regularMarketPrice - prev) / prev) * 100,
    regularMarketPreviousClose: prev,
    regularMarketOpen:          meta.regularMarketOpen,
    regularMarketDayHigh:       meta.regularMarketDayHigh,
    regularMarketDayLow:        meta.regularMarketDayLow,
    regularMarketVolume:        meta.regularMarketVolume,
    marketCap:                  meta.marketCap,
  };
}

async function fetchQuotes() {
  try {
    const symbols = [...INDEX_META.map(m => m.symbol), ...STOCK_META.map(m => m.symbol)];
    const results = await Promise.all(symbols.map(s => fetchYahooMeta(s).catch(() => null)));
    return results.filter(Boolean);
  } catch (e) { console.warn('Quote API 오류:', e.message); return []; }
}

async function fetchChart(symbol, range) {
  try {
    const intervalMap = {'1D':'5m','1W':'1d','1M':'1d','3M':'1d','1Y':'1wk'};
    const rangeMap    = {'1D':'1d','1W':'5d','1M':'1mo','3M':'3mo','1Y':'1y'};
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${intervalMap[range]||'1d'}&range=${rangeMap[range]||'1d'}`;
    const json = await proxyFetch(url);
    const chart = json?.chart?.result?.[0];
    if (!chart) return null;
    const timestamps = chart.timestamp || [];
    const closes     = chart.indicators?.quote?.[0]?.close || [];
    const labels = timestamps.map(ts => {
      const d = new Date(ts * 1000);
      return range === '1D' ? `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}` : `${d.getMonth()+1}/${d.getDate()}`;
    });
    return { labels, data: closes.map(v => v == null ? null : Math.round(v*100)/100).filter(Boolean) };
  } catch (e) { return null; }
}

async function fetchForex() {
  try {
    const symbols = ['KRW=X', 'JPYKRW=X', 'EURKRW=X'];
    const results = await Promise.all(symbols.map(s => fetchYahooMeta(s).catch(() => null)));
    return results.filter(Boolean);
  } catch (e) { return []; }
}


/* ===================== 데이터 변환 ===================== */
function parseQuotes(quotes) {
  INDICES = INDEX_META.map(meta => {
    const q = quotes.find(q => q.symbol === meta.symbol) || {};
    return { ...meta, value: q.regularMarketPrice??0, change: q.regularMarketChange??0,
      pct: q.regularMarketChangePercent??0, open: q.regularMarketOpen??0,
      high: q.regularMarketDayHigh??0, low: q.regularMarketDayLow??0, vol: fmtVol(q.regularMarketVolume) };
  });
  STOCKS = STOCK_META.map(meta => {
    const q = quotes.find(q => q.symbol === meta.symbol) || {};
    const price = q.regularMarketPrice ?? 0;
    const prev  = q.regularMarketPreviousClose ?? price;
    return { ...meta, price, prevClose: prev,
      change: Math.round(q.regularMarketChange ?? 0),
      pct: +((q.regularMarketChangePercent ?? 0).toFixed(2)),
      vol: fmtVol(q.regularMarketVolume), cap: fmtCap(q.marketCap, meta.cap),
      hist: buildHist(prev, price) };
  });
}

/* ===================== 티커 ===================== */
function buildTicker() {
  const all = [
    ...INDICES.map(i => ({ name: i.name, price: i.value.toLocaleString(undefined,{maximumFractionDigits:2}), pct: i.pct })),
    ...STOCKS.slice(0,6).map(s => ({ name: s.name, price: fmt(s.price), pct: s.pct })),
  ];
  const doubled = [...all, ...all];
  document.getElementById('tickerTrack').innerHTML = doubled.map(item => `
    <span class="ticker-item">
      <span class="ticker-name">${item.name}</span>
      <span class="ticker-price ${updown(item.pct)}">${item.price}</span>
      <span class="${updown(item.pct)}">${arrow(item.pct)}${Math.abs(item.pct).toFixed(2)}%</span>
    </span>
  `).join('');
}

/* ===================== 지수 카드 ===================== */
function buildIndices() {
  document.getElementById('indicesGrid').innerHTML = INDICES.map(idx => `
    <div class="index-card ${updown(idx.change)}" onclick="loadIndexChart('${idx.symbol}','${idx.name}')">
      <div class="index-name">${idx.name}</div>
      <div class="index-value">${idx.value.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
      <div class="index-change ${updown(idx.change)}">${arrow(idx.change)} ${Math.abs(idx.change).toLocaleString(undefined,{maximumFractionDigits:2})} (${fmtPct(idx.pct)})</div>
      <div class="index-mini">고가 ${idx.high.toLocaleString(undefined,{maximumFractionDigits:2})} · 저가 ${idx.low.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
    </div>
  `).join('');
}

/* ===================== 환율 위젯 ===================== */
async function buildForex() {
  const data = await fetchForex();
  const labels = { 'KRW=X': '달러/원', 'JPYKRW=X': '엔/원', 'EURKRW=X': '유로/원' };
  document.getElementById('forexWidgets').innerHTML = data.map(q => `
    <div class="forex-card">
      <div class="forex-label">${labels[q.symbol] || q.symbol}</div>
      <div class="forex-value">${q.regularMarketPrice?.toLocaleString(undefined,{maximumFractionDigits:2}) || '-'}</div>
      <div class="forex-change ${updown(q.regularMarketChange)}">
        ${arrow(q.regularMarketChange)} ${Math.abs(q.regularMarketChange||0).toFixed(2)} (${fmtPct(q.regularMarketChangePercent||0)})
      </div>
    </div>
  `).join('');
}


/* ===================== 차트 ===================== */
let chartInstance = null;
let currentRange  = '1D';
let currentSymbol = '^KS11';

function drawChart(labels, data) {
  const isUp  = data[data.length-1] >= data[0];
  const color = isUp ? '#3fb950' : '#f85149';
  const ctx   = document.getElementById('stockChart').getContext('2d');
  const grad  = ctx.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, isUp ? 'rgba(63,185,80,.25)' : 'rgba(248,81,73,.25)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ data, borderColor: color, borderWidth: 2, backgroundColor: grad,
      fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: color }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { display: false },
        tooltip: { backgroundColor:'#21262d', titleColor:'#8b949e', bodyColor:'#e6edf3',
          borderColor:'#30363d', borderWidth:1, callbacks: { label: c => ' '+c.parsed.y.toLocaleString() } } },
      scales: {
        x: { grid:{color:'rgba(48,54,61,.5)'}, ticks:{color:'#8b949e',maxTicksLimit:8,font:{size:11}} },
        y: { position:'right', grid:{color:'rgba(48,54,61,.5)'},
             ticks:{color:'#8b949e',font:{size:11},callback:v=>v.toLocaleString()} }
      }
    }
  });
  const ch = data[data.length-1] - data[0];
  document.getElementById('chartInfo').innerHTML = `
    <span class="chart-info-item">현재 <strong class="${updown(ch)}">${data[data.length-1].toLocaleString()}</strong></span>
    <span class="chart-info-item">변동 <strong class="${updown(ch)}">${arrow(ch)} ${Math.abs(ch).toFixed(2)} (${fmtPct(ch/data[0]*100)})</strong></span>
    <span class="chart-info-item">고가 <strong>${Math.max(...data).toLocaleString()}</strong></span>
    <span class="chart-info-item">저가 <strong>${Math.min(...data).toLocaleString()}</strong></span>
  `;
}

function generateFallbackChart(range) {
  const now = new Date(), pts = {'1D':78,'1W':35,'1M':30,'3M':90,'1Y':52}[range]||78;
  const base = INDICES[0]?.value || 2600;
  let val = base * 0.98, labels = [], data = [];
  for (let i=0;i<pts;i++) {
    val += (Math.random()-.47)*base*.003;
    data.push(Math.round(val*100)/100);
    const d = new Date(now.getTime()-(pts-i)*(range==='1Y'?7:1)*86400000);
    labels.push(range==='1D'?`${9+Math.floor(i/pts*6.5)}:${String(Math.floor(i/pts*390%60)).padStart(2,'0')}`:`${d.getMonth()+1}/${d.getDate()}`);
  }
  return {labels,data};
}

async function renderChart(range) {
  currentRange = range;
  const result = await fetchChart(currentSymbol, range);
  if (result?.data?.length > 1) drawChart(result.labels, result.data);
  else { const f = generateFallbackChart(range); drawChart(f.labels, f.data); }
}

async function setRange(r, btn) {
  document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  await renderChart(r);
}

async function loadIndexChart(symbol, name) {
  currentSymbol = symbol;
  document.getElementById('chartTitle').textContent = `${name} 지수`;
  await renderChart(currentRange);
}

/* ===================== 관심종목 ===================== */
function buildWatchlist() {
  const list = watchlistCodes.map(code => STOCKS.find(s => s.code === code)).filter(Boolean);
  document.getElementById('watchlist').innerHTML = list.length ? list.map(s => `
    <div class="watchlist-item">
      <div class="stock-name-group">
        <span class="stock-name">${s.name}</span>
        <span class="stock-code">${s.code}</span>
      </div>
      <div class="stock-price-group">
        <span class="stock-price">${fmt(s.price)}</span>
        <span class="stock-change ${updown(s.pct)}">${arrow(s.pct)} ${fmtPct(s.pct)}</span>
      </div>
      <button class="del-btn" onclick="removeFromWatchlist('${s.code}')" style="margin-left:6px">✕</button>
    </div>
  `).join('') : '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px">관심종목을 추가해주세요</div>';
}

/* ===================== 상승/하락 TOP ===================== */
function buildRanking() {
  const sorted  = [...STOCKS].sort((a,b) => b.pct - a.pct);
  const gainers = sorted.slice(0,5), losers = sorted.slice(-5).reverse();
  const bc = i => ['gold','silver','bronze'][i]||'';
  const row = (s,i) => `
    <div class="rank-item">
      <div class="rank-badge ${bc(i)}">${i+1}</div>
      <div class="stock-name-group" style="flex:1;margin:0 8px"><span class="stock-name">${s.name}</span></div>
      <div class="stock-price-group">
        <span class="stock-price">${fmt(s.price)}</span>
        <span class="stock-change ${updown(s.pct)}">${fmtPct(s.pct)}</span>
      </div>
    </div>`;
  document.getElementById('gainers').innerHTML = gainers.map(row).join('');
  document.getElementById('losers').innerHTML  = losers.map(row).join('');
}

/* ===================== 테이블 ===================== */
let currentFilter = 'all';

function buildTable(stocks) {
  const hasAlert = s => priceAlerts.some(a => a.symbol === s.symbol && !a.triggered);
  document.getElementById('stockTableBody').innerHTML = stocks.map((s,i) => `
    <tr>
      <td><div class="td-name">${s.name}</div><div class="td-code">${s.code}</div></td>
      <td>${fmt(s.price)}</td>
      <td class="${updown(s.change)}">${arrow(s.change)} ${fmt(Math.abs(s.change))}</td>
      <td><span class="badge ${updown(s.pct)}">${fmtPct(s.pct)}</span></td>
      <td>${s.vol}</td>
      <td>${s.cap}</td>
      <td><button class="alert-bell-btn ${hasAlert(s)?'active':''}" onclick="quickSetAlert('${s.symbol}','${s.name}')" title="알림 설정">🔔</button></td>
      <td class="spark-cell"><canvas id="spark${i}" width="80" height="32" class="spark-canvas"></canvas></td>
    </tr>
  `).join('');
  stocks.forEach((s,i) => setTimeout(() => drawSparkline(`spark${i}`, s.hist, s.pct>=0), 0));
}

function quickSetAlert(symbol, name) {
  document.getElementById('alertSymbol').value = symbol;
  const stock = STOCKS.find(s => s.symbol === symbol);
  if (stock) document.getElementById('alertPrice').value = stock.price;
  openModal('alertModal');
}

function drawSparkline(id, data, isUp) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d'), W=80, H=32;
  const min = Math.min(...data), max = Math.max(...data), range = max-min||1;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = isUp ? '#3fb950' : '#f85149';
  ctx.lineWidth = 1.5; ctx.beginPath();
  data.forEach((v,i) => {
    const x=(i/(data.length-1))*W, y=H-((v-min)/range)*(H-4)-2;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.stroke();
}

function filterTable(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = f==='up'?STOCKS.filter(s=>s.pct>=0):f==='down'?STOCKS.filter(s=>s.pct<0):STOCKS;
  buildTable(filtered);
}

/* ===================== 뉴스 ===================== */
function buildNews() {
  document.getElementById('newsGrid').innerHTML = NEWS.map(n => `
    <div class="news-card">
      <div class="news-category">${n.category}</div>
      <div class="news-title">${n.title}</div>
      <div class="news-summary">${n.summary}</div>
      <div class="news-meta"><span>${n.source}</span><span>${n.time}</span></div>
    </div>
  `).join('');
}

/* ===================== 경제 캘린더 ===================== */
function buildCalendar() {
  document.getElementById('calendarGrid').innerHTML = ECONOMIC_CALENDAR.map(e => `
    <div class="calendar-card ${e.impact}">
      <div class="cal-date">${e.date} · ${e.country}</div>
      <div class="cal-title">${e.title}</div>
      <div class="cal-meta">
        <span>${e.detail}</span>
        <span class="cal-impact ${e.impact}">${e.impact==='high'?'고위험':e.impact==='medium'?'중위험':'저위험'}</span>
      </div>
    </div>
  `).join('');
}

/* ===================== 검색 ===================== */
function searchStock() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  const found = STOCKS.filter(s => s.name.includes(q) || s.code.includes(q));
  if (found.length) {
    buildTable(found);
    document.querySelector('.stock-table').scrollIntoView({ behavior: 'smooth' });
  } else {
    showToast(`"${q}" 검색 결과가 없습니다.`, 'warn');
  }
}
document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key==='Enter') searchStock(); });

/* ===================== 주기적 갱신 ===================== */
async function refreshData() {
  const quotes = await fetchQuotes();
  if (!quotes.length) return;
  parseQuotes(quotes);
  buildIndices(); buildTicker(); buildWatchlist(); buildRanking();
  buildTable(currentFilter==='up'?STOCKS.filter(s=>s.pct>=0):currentFilter==='down'?STOCKS.filter(s=>s.pct<0):STOCKS);
  renderPortfolio();
  checkPriceAlerts();
  updateMarketStatus();
}

/* ===================== 로딩 ===================== */
function showLoading(show) {
  let el = document.getElementById('loadingOverlay');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'loadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(13,17,23,.85);display:flex;align-items:center;justify-content:center;z-index:999;font-size:16px;color:#8b949e;';
    el.innerHTML = '<span>📡 실시간 데이터 로딩 중...</span>';
    document.body.appendChild(el);
  } else if (el && !show) { el.remove(); }
}

function loadFallbackData() {
  INDICES = INDEX_META.map((m,i) => ({...m, value:[2674,862,6775,22716,47417,54210][i],
    change:[18,-4,20,20,-323,-815][i], pct:[0.69,-0.56,0.30,0.09,-0.68,-1.48][i],
    open:[2658,867,6795,22695,47740,55025][i], high:[2681,870,6811,22877,47711,54733][i],
    low:[2651,859,6745,22602,47185,53796][i], vol:['6.2조','8.7조','$3.2T','$5.8T','$1.9T','¥3.1T'][i]}));
  const prices = [187600,935000,373500,1614000,349000,521000,50600,222500,306500,149500];
  const prevs  = [187900,938000,367000,1592000,343500,525000,51800,220500,311000,147400];
  STOCKS = STOCK_META.map((m,i) => ({...m, price:prices[i], prevClose:prevs[i],
    change:prices[i]-prevs[i], pct:+((prices[i]-prevs[i])/prevs[i]*100).toFixed(2),
    vol:'-', cap:m.cap, hist:buildHist(prevs[i],prices[i])}));
}

/* ===================== 초기화 ===================== */
async function init() {
  initTheme();
  showLoading(true);
  requestNotificationPermission();
  populateAlertSelect();
  populatePortfolioSelect();
  buildNews();
  buildCalendar();
  renderAlertList();
  renderPortfolio();

  const quotes = await fetchQuotes();
  if (quotes.length > 0) parseQuotes(quotes);
  else { console.warn('샘플 데이터 사용'); loadFallbackData(); }

  showLoading(false);
  buildTicker(); buildIndices(); buildWatchlist(); buildRanking(); buildTable(STOCKS);
  await renderChart('1D');
  buildForex();
  updateMarketStatus();

  setInterval(refreshData, 30000);
  setInterval(updateMarketStatus, 60000);
}

init();
