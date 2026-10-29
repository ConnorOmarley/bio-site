// Funções puras: sem acesso à página, por isso podem ser testadas no Node.
(function () {
  const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function crc16(text) {
    let crc = 0xffff;
    for (let i = 0; i < text.length; i++) {
      crc ^= text.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function field(id, value) {
    return id + String(value.length).padStart(2, '0') + value;
  }

  function clean(text, max) {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '')
      .trim()
      .slice(0, max);
  }

  function buildPixPayload({ key, name, city, amount }) {
    let p = field('00', '01');
    p += field('26', field('00', 'br.gov.bcb.pix') + field('01', key));
    p += field('52', '0000');
    p += field('53', '986');
    if (amount > 0) p += field('54', amount.toFixed(2));
    p += field('58', 'BR');
    p += field('59', clean(name, 25));
    p += field('60', clean(city, 15));
    p += field('62', field('05', '***'));
    p += '6304';
    return p + crc16(p);
  }

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function toHHMM(min) {
    return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function generateSlots(opening, stepMin, durationMin, now, day) {
    const last = toMinutes(opening.end) - durationMin;
    const nowRef = now || new Date();
    const filterPast = day && sameDay(day, nowRef);
    const nowMin = nowRef.getHours() * 60 + nowRef.getMinutes();
    const slots = [];
    for (let t = toMinutes(opening.start); t <= last; t += stepMin) {
      if (filterPast && t <= nowMin) continue;
      slots.push(toHHMM(t));
    }
    return slots;
  }

  function isOpenDay(date, openWeekdays) {
    return openWeekdays.includes(date.getDay());
  }

  function formatPrice(value) {
    if (value === null || value === undefined) return 'a combinar';
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Aceita "50,00", "50.00", "1.234,56", "R$ 50". Devolve NaN se inválido ou menor que 1 centavo.
  function parseAmount(text) {
    let s = String(text).replace(/[^\d.,]/g, '');
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    const n = Math.round(Number(s) * 100) / 100;
    return isFinite(n) && n >= 0.01 ? n : NaN;
  }

  // [1,2,3,4,5] -> "segunda a sexta". Semana contada de segunda a domingo; 3 dias seguidos viram "X a Y".
  function formatOpenDays(openWeekdays) {
    if (!openWeekdays.length) return '';
    if (openWeekdays.length === 7) return 'todos os dias';
    const NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const order = (d) => (d + 6) % 7;
    const days = [...openWeekdays].sort((a, b) => order(a) - order(b));
    const parts = [];
    let i = 0;
    while (i < days.length) {
      let j = i;
      while (j + 1 < days.length && order(days[j + 1]) === order(days[j]) + 1) j++;
      if (j - i >= 2) parts.push(NAMES[days[i]] + ' a ' + NAMES[days[j]]);
      else for (let k = i; k <= j; k++) parts.push(NAMES[days[k]]);
      i = j + 1;
    }
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' e ' + parts[parts.length - 1] : parts[0];
  }

  // Mapa do Google embutido, sem chave de API: basta o endereço.
  function buildMapEmbedUrl(addressText) {
    return 'https://www.google.com/maps?q=' + encodeURIComponent(addressText) + '&output=embed';
  }

  function formatDateLong(date) {
    return WEEKDAYS[date.getDay()] + ', ' + date.getDate() + ' de ' + MONTHS[date.getMonth()];
  }

  function onlyDigits(text) {
    return String(text).replace(/\D/g, '');
  }

  function buildWhatsAppUrl(phone, b) {
    let digits = onlyDigits(phone);
    if (digits.length <= 11) digits = '55' + digits;
    const lines = [
      'Olá! Gostaria de agendar:',
      'Serviço: ' + b.service,
      'Dia: ' + formatDateLong(b.date),
      'Horário: ' + b.time,
      'Nome: ' + b.name,
    ];
    if (b.clientPhone) lines.push('Telefone: ' + b.clientPhone);
    if (b.notes) lines.push('Observações: ' + b.notes);
    return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  const api = { crc16, buildPixPayload, generateSlots, isOpenDay, formatPrice, parseAmount, formatOpenDays, buildMapEmbedUrl, formatDateLong, buildWhatsAppUrl };
  if (typeof module !== 'undefined') module.exports = api;
  else window.Logic = api;
})();
