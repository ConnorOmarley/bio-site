const test = require('node:test');
const assert = require('node:assert');
const L = require('../logic.js');

test('crc16 bate com o valor padrão conhecido', () => {
  assert.strictEqual(L.crc16('123456789'), '29B1');
});

test('buildPixPayload monta um BR Code válido', () => {
  const p = L.buildPixPayload({ key: 'maria@exemplo.com', name: 'Maria', city: 'Curitiba', amount: 5 });
  assert.ok(p.startsWith('000201'));
  assert.ok(p.includes('maria@exemplo.com'));
  assert.ok(p.includes('5802BR'));
  assert.ok(p.includes('54045.00'));
  assert.strictEqual(L.crc16(p.slice(0, -4)), p.slice(-4));
  assert.ok(p.slice(-8, -4) === '6304' || p.slice(-8).startsWith('6304'));
});

test('buildPixPayload tira acentos e corta o nome em 25 caracteres', () => {
  const p = L.buildPixPayload({ key: '11999998888', name: 'José da Conceição Ñandú Silva Santos Pereira', city: 'São Paulo', amount: 10 });
  assert.ok(p.includes('5925JOSE DA CONCEICAO NANDU S'));
  assert.ok(p.includes('6009SAO PAULO'));
});

test('generateSlots respeita a duração do serviço', () => {
  const s = L.generateSlots({ start: '08:00', end: '10:00' }, 15, 60);
  assert.strictEqual(s[0], '08:00');
  assert.strictEqual(s[s.length - 1], '09:00');
  assert.strictEqual(s.length, 5);
});

test('generateSlots hoje depois do expediente retorna vazio', () => {
  const today = new Date(2026, 9, 29);
  const now = new Date(2026, 9, 29, 17, 50);
  assert.deepStrictEqual(L.generateSlots({ start: '08:00', end: '18:00' }, 15, 60, now, today), []);
});

test('generateSlots hoje remove só os horários que já passaram', () => {
  const today = new Date(2026, 9, 29);
  const now = new Date(2026, 9, 29, 9, 10);
  const s = L.generateSlots({ start: '08:00', end: '12:00' }, 15, 30, now, today);
  assert.strictEqual(s[0], '09:15');
});

test('isOpenDay usa os dias da semana (0 = domingo)', () => {
  assert.strictEqual(L.isOpenDay(new Date(2026, 9, 29), [2, 3, 4, 5, 6]), true);
  assert.strictEqual(L.isOpenDay(new Date(2026, 10, 1), [2, 3, 4, 5, 6]), false);
});

test('formatPrice', () => {
  assert.strictEqual(L.formatPrice(150).replace(/ /g, ' '), 'R$ 150,00');
  assert.strictEqual(L.formatPrice(null), 'a combinar');
});

test('parseAmount entende vírgula, ponto e milhar', () => {
  assert.strictEqual(L.parseAmount('50,00'), 50);
  assert.strictEqual(L.parseAmount('50.00'), 50);
  assert.strictEqual(L.parseAmount('50.5'), 50.5);
  assert.strictEqual(L.parseAmount('1.234,56'), 1234.56);
  assert.strictEqual(L.parseAmount('1.234'), 1234);
  assert.strictEqual(L.parseAmount('R$ 50,00'), 50);
});

test('parseAmount recusa vazio, texto, zero e menos de 1 centavo', () => {
  for (const bad of ['', 'abc', '0', '0,00', '0,001']) {
    assert.ok(Number.isNaN(L.parseAmount(bad)), 'deveria recusar: ' + bad);
  }
});

test('buildMapEmbedUrl monta o link do mapa embutido com o endereço codificado', () => {
  const url = L.buildMapEmbedUrl('Avenida Paulista, 1000, São Paulo - SP');
  assert.ok(url.startsWith('https://www.google.com/maps?q='));
  assert.ok(url.endsWith('&output=embed'));
  assert.ok(url.includes(encodeURIComponent('Avenida Paulista, 1000, São Paulo - SP')));
});

test('formatOpenDays escreve os dias de atendimento em português', () => {
  assert.strictEqual(L.formatOpenDays([1, 2, 3, 4, 5]), 'segunda a sexta');
  assert.strictEqual(L.formatOpenDays([2, 3, 4, 5, 6]), 'terça a sábado');
  assert.strictEqual(L.formatOpenDays([1, 3, 5]), 'segunda, quarta e sexta');
  assert.strictEqual(L.formatOpenDays([1, 2, 3, 5]), 'segunda a quarta e sexta');
  assert.strictEqual(L.formatOpenDays([6]), 'sábado');
  assert.strictEqual(L.formatOpenDays([0, 1, 2, 3, 4, 5, 6]), 'todos os dias');
  assert.strictEqual(L.formatOpenDays([]), '');
});

test('buildWhatsAppUrl limpa o telefone e inclui os dados do agendamento', () => {
  const b = { service: 'Corte feminino', date: new Date(2026, 7, 12), time: '09:45', name: 'Ana Ç', clientPhone: '(11) 97777-6666', notes: 'primeira vez' };
  const url = L.buildWhatsAppUrl('(11) 98888-7777', b);
  assert.ok(url.startsWith('https://wa.me/5511988887777?text='));
  const text = decodeURIComponent(url.split('?text=')[1]);
  for (const part of ['Corte feminino', 'quarta-feira, 12 de agosto', '09:45', 'Ana Ç']) {
    assert.ok(text.includes(part), 'faltou: ' + part);
  }
  assert.ok(L.buildWhatsAppUrl('5511988887777', b).startsWith('https://wa.me/5511988887777?text='));
});
