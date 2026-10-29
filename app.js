// Lê o CONFIG e monta a página. As contas (horários, Pix, WhatsApp) ficam no logic.js.
(function () {
  const C = window.CONFIG;
  const L = window.Logic;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v7M14 20h3"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  const icon = (n, cls) => '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[n] + '</svg>';

  // ---------- utilitários ----------
  // Aviso dentro das janelas do Pix quando a página é só uma demonstração (config.js: demo: true).
  const demoNote = () => (C.demo ? '<p class="demo-note">Modo demonstração: a chave Pix é fictícia. Não faça pagamentos reais.</p>' : '');

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { t.hidden = true; }, 1800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast('Copiado!');
  }

  function openModal(html) {
    $('#modal-content').innerHTML = html;
    $('#modal').hidden = false;
  }
  function closeModal() { $('#modal').hidden = true; }

  // Foto que não carrega some, e fica só a cor de fundo.
  function guardImages(root) {
    root.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
    });
  }

  // ---------- topo ----------
  function renderProfile() {
    const rs = document.documentElement.style;
    rs.setProperty('--primary', C.theme.primary);
    rs.setProperty('--ink', C.theme.ink);
    rs.setProperty('--accent', C.theme.accent);
    rs.setProperty('--google', C.theme.google);
    rs.setProperty('--bg', C.theme.background);
    document.title = C.name;
    const cover = $('#cover');
    cover.style.backgroundImage = 'url("' + C.cover + '")';
    if (C.coverVideo && !reduceMotion()) {
      // O vídeo fica por cima da imagem; se não carregar, ele some e a imagem continua.
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.preload = 'metadata';
      v.poster = C.cover;
      v.src = C.coverVideo;
      v.addEventListener('error', () => v.remove());
      cover.appendChild(v);
    }
    $('#avatar').src = C.avatar;
    $('#name').textContent = C.name;
    $('#tagline').textContent = C.tagline;
  }

  // ---------- botões ----------
  function renderLinks() {
    const waUrl = 'https://wa.me/' + C.whatsapp.replace(/\D/g, '');
    // Uma linha da lista: link para fora (<a>) ou ação da própria página (<button>).
    const row = (tag, attrs, cls, ic, label) =>
      '<' + tag + ' class="item ' + cls + '" ' + attrs + '><span class="chip">' + icon(ic) + '</span><span>' + label + '</span>' + icon('arrow', 'end') + '</' + tag + '>';
    const link = (href, cls, ic, label) => row('a', 'href="' + esc(href) + '" target="_blank" rel="noopener"', cls, ic, label);
    const action = (act, ic, label) => row('button', 'data-act="' + act + '"', '', ic, label);

    // Linha sem dado no config.js (campo vazio) não aparece.
    const items = [
      link(waUrl, '', 'chat', 'WhatsApp'),
      C.instagram && link(C.instagram, '', 'instagram', 'Instagram'),
      C.googleReview && link(C.googleReview, 'google', 'star', 'Avaliar no Google'),
      C.pix.key && action('pix', 'qr', 'Chave Pix'),
      C.wifi.network && action('wifi', 'wifi', 'WiFi'),
    ].filter(Boolean);

    // Só "Agende aqui" é um botão grande: é a ação que traz cliente. O resto fica numa lista calma.
    $('#links').innerHTML =
      '<div class="accordion" id="booking">' +
        '<button class="cta" data-act="toggle-booking">' + icon('calendar') + '<span class="grow">Agende aqui</span>' + icon('chevron', 'chev') + '</button>' +
        '<div class="panel" id="booking-body"></div>' +
      '</div>' +
      '<div class="list">' + items.join('') + '</div>';
  }

  // ---------- agendamento ----------
  const state = { step: 'service', service: null, date: null, time: null, month: null };

  function serviceLine(sv) {
    return sv.minutes + ' min · ' + L.formatPrice(sv.price);
  }

  function renderBooking() {
    const body = $('#booking-body');
    const sv = C.services[state.service];
    let html = '';

    if (state.step === 'service') {
      html = '<p class="hint">Escolha o serviço:</p>' + C.services.map((s, i) =>
        '<button class="option" data-act="service" data-i="' + i + '"><strong>' + esc(s.name) + '</strong><span>' + icon('clock') + serviceLine(s) + '</span></button>'
      ).join('');
    }

    if (state.step === 'day') {
      const m = state.month;
      const first = new Date(m.getFullYear(), m.getMonth(), 1);
      const total = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const now = new Date();
      const isCurrent = m.getFullYear() === today.getFullYear() && m.getMonth() === today.getMonth();
      let cells = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((d) => '<span class="wd">' + d + '</span>').join('');
      for (let i = 0; i < first.getDay(); i++) cells += '<span></span>';
      for (let d = 1; d <= total; d++) {
        const date = new Date(m.getFullYear(), m.getMonth(), d);
        const ok = date >= today && L.isOpenDay(date, C.openWeekdays) && L.generateSlots(C.hours, 15, sv.minutes, now, date).length > 0;
        cells += '<button class="day" data-act="day" data-d="' + d + '"' + (ok ? '' : ' disabled') + '>' + d + '</button>';
      }
      html =
        '<p class="hint">Escolha o dia:</p>' +
        '<div class="cal-head"><button data-act="prev-month"' + (isCurrent ? ' disabled' : '') + ' aria-label="Mês anterior">‹</button>' +
        '<span>' + esc(m.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })) + '</span>' +
        '<button data-act="next-month" aria-label="Próximo mês">›</button></div>' +
        '<div class="cal-grid">' + cells + '</div>' +
        '<button class="back" data-act="to-service">' + icon('back') + 'Voltar</button>';
    }

    if (state.step === 'time') {
      const slots = L.generateSlots(C.hours, 15, sv.minutes, new Date(), state.date);
      html = '<p class="hint">Escolha o horário:</p>' +
        (slots.length
          ? '<div class="slots">' + slots.map((t) => '<button class="slot" data-act="time" data-t="' + t + '">' + t + '</button>').join('') + '</div>'
          : '<p class="empty">Sem horários neste dia.</p>') +
        '<button class="back" data-act="to-day">' + icon('back') + 'Voltar</button>';
    }

    if (state.step === 'form') {
      html =
        '<div class="summary"><strong>' + esc(sv.name) + '</strong> · ' + serviceLine(sv) +
        '<small>' + esc(L.formatDateLong(state.date)) + ' às ' + state.time + '</small></div>' +
        '<label for="f-name">Nome*</label><input id="f-name" autocomplete="name">' +
        '<label for="f-phone">Telefone</label><input id="f-phone" type="tel" inputmode="tel" placeholder="(11) 99999-0000" autocomplete="tel">' +
        '<label for="f-notes">Observações</label><textarea id="f-notes"></textarea>' +
        '<p class="error" id="f-error" hidden>Digite seu nome.</p>' +
        '<div class="row"><button class="back" data-act="to-time">' + icon('back') + 'Voltar</button>' +
        '<button class="primary" data-act="confirm">' + icon('check') + 'Confirmar</button></div>';
    }

    body.innerHTML = html;
  }

  function openBooking(serviceIndex) {
    const box = $('#booking');
    box.classList.add('open');
    if (serviceIndex !== undefined) {
      state.service = serviceIndex;
      state.step = 'day';
      state.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    renderBooking();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onBookingClick(btn) {
    const act = btn.dataset.act;
    const now = new Date();
    if (act === 'service') {
      state.service = Number(btn.dataset.i);
      state.step = 'day';
      state.month = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (act === 'prev-month') {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    } else if (act === 'next-month') {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    } else if (act === 'day') {
      state.date = new Date(state.month.getFullYear(), state.month.getMonth(), Number(btn.dataset.d));
      state.step = 'time';
    } else if (act === 'time') {
      state.time = btn.dataset.t;
      state.step = 'form';
    } else if (act === 'to-service') {
      state.step = 'service';
    } else if (act === 'to-day') {
      state.step = 'day';
    } else if (act === 'to-time') {
      state.step = 'time';
    } else if (act === 'confirm') {
      const name = $('#f-name').value.trim();
      if (!name) { $('#f-error').hidden = false; return; }
      const url = L.buildWhatsAppUrl(C.whatsapp, {
        service: C.services[state.service].name,
        date: state.date,
        time: state.time,
        name: name,
        clientPhone: $('#f-phone').value.trim(),
        notes: $('#f-notes').value.trim(),
      });
      window.open(url, '_blank', 'noopener');
      return;
    }
    renderBooking();
  }

  // ---------- Pix e WiFi (a tela do Pix é concluída na Tarefa 4) ----------
  function showPixForm(error) {
    openModal(
      '<div class="badge">' + icon('qr') + '</div>' +
      '<h3>Pagar com Pix</h3><p class="sub">Preencha os dados: o Pix cai direto para ' + esc(C.name) + '.</p>' +
      '<label for="p-name">Seu nome</label><input id="p-name" placeholder="Ex: João Silva" autocomplete="name">' +
      '<label for="p-amount">Valor (R$)</label><input id="p-amount" inputmode="decimal" placeholder="50,00">' +
      (error ? '<p class="error">' + esc(error) + '</p>' : '') + demoNote() +
      '<div class="row"><button class="primary" data-act="pix-generate">' + icon('qr') + 'Gerar Pix</button></div>'
    );
  }

  function showPixResult(amount) {
    const payload = L.buildPixPayload({ key: C.pix.key, name: C.pix.name, city: C.pix.city, amount: amount });
    let qr = '';
    if (typeof window.qrcode === 'function') {
      const q = window.qrcode(0, 'M');
      q.addData(payload);
      q.make();
      qr = '<div class="qr">' + q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }) + '</div>';
    }
    openModal(
      '<h3>' + (qr ? 'Escaneie ou copie' : 'Copie o código') + '</h3>' +
      '<p class="sub">Abra o app do seu banco e ' + (qr ? 'leia o QR Code ou cole o código.' : 'use Pix copia e cola.') + '</p>' +
      qr + '<p class="code">' + esc(payload) + '</p>' + demoNote() +
      '<div class="row"><button class="back" data-act="pix-back">' + icon('back') + 'Voltar</button>' +
      '<button class="primary" data-act="copy" data-copy="' + esc(payload) + '">' + icon('copy') + 'Copiar Pix</button></div>'
    );
  }

  function generatePix() {
    const amount = L.parseAmount($('#p-amount').value);
    if (isNaN(amount)) { showPixForm('Digite um valor de pelo menos R$ 0,01.'); return; }
    showPixResult(amount);
  }

  function showWifi() {
    openModal(
      '<div class="badge">' + icon('wifi') + '</div>' +
      '<h3>Conectar ao WiFi</h3><p class="sub">Use os dados abaixo para se conectar.</p>' +
      '<div class="field"><small>REDE</small><span>' + esc(C.wifi.network) + '</span></div>' +
      '<div class="field"><small>SENHA</small><span>' + esc(C.wifi.password) + '</span></div>' +
      '<div class="row"><button class="back" data-act="copy" data-copy="' + esc(C.wifi.network) + '">' + icon('copy') + 'Rede</button>' +
      '<button class="primary" data-act="copy" data-copy="' + esc(C.wifi.password) + '">' + icon('copy') + 'Senha</button></div>'
    );
  }

  // ---------- vitrine, galeria, localização ----------
  function dotsFor(track, dotsEl) {
    const n = track.children.length;
    dotsEl.innerHTML = Array.from({ length: n }, () => '<i></i>').join('');
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const idx = max > 0 ? Math.round((track.scrollLeft / max) * (n - 1)) : 0;
      Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('on', i === idx));
    };
    track.addEventListener('scroll', update, { passive: true });
    update();
  }

  // Avança sozinho a cada `ms`. Pausa por alguns segundos quando a pessoa mexe, e quando a aba está oculta.
  function autoplay(track, ms) {
    if (reduceMotion() || track.children.length < 2) return;
    let lastTouch = 0;
    const touch = () => { lastTouch = Date.now(); };
    ['pointerdown', 'touchstart', 'wheel', 'mouseenter'].forEach((ev) => track.addEventListener(ev, touch, { passive: true }));
    setInterval(() => {
      if (document.hidden || Date.now() - lastTouch < ms * 1.5) return;
      const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
      const idx = Math.round(track.scrollLeft / step);
      const next = (idx + 1) % track.children.length;
      track.scrollTo({ left: next * step, behavior: 'smooth' });
    }, ms);
  }

  function renderShowcase() {
    $('#showcase').innerHTML =
      '<h2 class="section-title">Nossos serviços</h2>' +
      '<div class="track" id="svc-track">' + C.services.map((s, i) =>
        '<div class="slide"><img src="' + esc(s.photo) + '" alt="' + esc(s.name) + '">' +
        '<div class="over"><strong>' + esc(s.name) + '</strong><p>' + esc(s.description) + '</p>' +
        '<button class="go" data-act="book-service" data-i="' + i + '">Agendar</button></div></div>'
      ).join('') + '</div><div class="dots" id="svc-dots"></div>';
    dotsFor($('#svc-track'), $('#svc-dots'));
    autoplay($('#svc-track'), 4000);
  }

  function renderGallery() {
    $('#gallery').innerHTML =
      '<h2 class="section-title">Conheça mais do nosso trabalho</h2>' +
      // Mosaico: a primeira foto ocupa a largura toda, as outras ficam em duas colunas.
      '<div class="mosaic">' + C.gallery.map((src) =>
        '<div class="tile"><img src="' + esc(src) + '" alt="" loading="lazy"></div>'
      ).join('') + '</div>';
  }

  function renderLocation() {
    $('#location').innerHTML =
      '<div class="where"><h2 class="section-title">Como chegar</h2>' +
      '<p class="addr">' + icon('pin') + '<span>' + esc(C.address.text) + '</span></p>' +
      '<p class="addr">' + icon('clock') + '<span>Atendimento ' + esc(L.formatOpenDays(C.openWeekdays)) + ', das ' + esc(C.hours.start) + ' às ' + esc(C.hours.end) + '</span></p>' +
      '<div class="map"><iframe src="' + esc(L.buildMapEmbedUrl(C.address.text)) + '" loading="lazy" title="Mapa: ' + esc(C.address.text) + '" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
      '</div>' +
      '<a class="btn-outline" href="' + esc(C.address.mapsUrl) + '" target="_blank" rel="noopener">' + icon('nav') + 'Nossa Localização</a></div>';
  }

  // Assinatura no fim da página (ex.: "Feito por Vision Local"). Sem credit no config.js, não aparece.
  function renderCredit() {
    if (!C.credit) return;
    const name = C.creditUrl
      ? '<a href="' + esc(C.creditUrl) + '" target="_blank" rel="noopener">' + esc(C.credit) + '</a>'
      : '<strong>' + esc(C.credit) + '</strong>';
    $('#credit').innerHTML = 'Feito por ' + name;
  }

  // ---------- cliques ----------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) {
      if (e.target.id === 'modal') closeModal();
      return;
    }
    const act = btn.dataset.act;
    if (btn.closest('#booking-body')) return onBookingClick(btn);
    if (act === 'toggle-booking') {
      const box = $('#booking');
      box.classList.toggle('open');
      if (box.classList.contains('open')) renderBooking();
    } else if (act === 'book-service') openBooking(Number(btn.dataset.i));
    else if (act === 'pix' || act === 'pix-back') showPixForm();
    else if (act === 'pix-generate') generatePix();
    else if (act === 'wifi') showWifi();
    else if (act === 'copy') copyText(btn.dataset.copy);
    else if (act === 'close') closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  renderProfile();
  renderLinks();
  renderBooking();
  renderShowcase();
  renderGallery();
  renderLocation();
  renderCredit();
  guardImages(document);
})();
