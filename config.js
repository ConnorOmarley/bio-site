// ============================================================
// TODOS OS DADOS DO CLIENTE FICAM AQUI. Para trocar de cliente
// ou de nicho, só mude este arquivo (e as fotos da pasta img/).
// Campo vazio ('') faz o botão ou bloco correspondente sumir.
// ============================================================
window.CONFIG = {
  // true = página de demonstração: mostra o aviso "chave Pix fictícia" nas janelas do Pix.
  // Troque para false quando colocar a chave Pix real do cliente.
  demo: true,

  // TODOS OS DADOS ABAIXO SÃO FICTÍCIOS (demonstração). Troque pelos dados reais de cada cliente.
  name: 'ATELIÊ LUMI',
  tagline: 'Beleza que ilumina você',

  avatar: 'img/avatar.jpg', // foto de perfil (redonda)
  cover: 'img/cover.svg', // imagem de capa (também aparece enquanto o vídeo carrega)
  coverVideo: 'img/cover.mp4', // vídeo curto da capa (sem som, repete sozinho). Vazio = só a imagem.

  // Só números, com DDI 55 e DDD. É para este WhatsApp que o agendamento é enviado.
  // Número FICTÍCIO: o "Confirmar" abre o WhatsApp, mas a conversa não chega a ninguém.
  // Para receber os agendamentos de teste, coloque aqui o seu número (ex.: '5511999999999').
  whatsapp: '5500000000000',

  instagram: 'https://instagram.com/exemplo',
  googleReview: 'https://g.page/r/exemplo/review',

  // Chave Pix FICTÍCIA para a demonstração. name = nome do recebedor, city = cidade.
  pix: { key: 'demonstracao@exemplo.com', name: 'Ateliê Lumi', city: 'Sao Paulo' },

  wifi: { network: 'Atelie-Lumi', password: 'demonstracao123' },

  // Dias de atendimento: 0 = domingo, 1 = segunda ... 6 = sábado
  openWeekdays: [1, 2, 3, 4, 5],
  hours: { start: '09:00', end: '18:00' },

  // price: null mostra "a combinar".
  services: [
    { name: 'Alisamento', minutes: 120, price: null, photo: 'img/liso.jpg', description: 'Fios alinhados, brilho de espelho' },
    { name: 'Cílios', minutes: 90, price: null, photo: 'img/cilios.jpg', description: 'Olhar marcante com leveza' },
    { name: 'Epilação', minutes: 30, price: null, photo: 'img/epilacao.jpg', description: 'Pele lisa, com todo o cuidado' },
  ],

  gallery: ['img/galeria1.jpg', 'img/galeria2.jpg', 'img/galeria3.jpg'],

  address: {
    text: 'Avenida Paulista, 1000, Bela Vista, São Paulo - SP',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+Paulista+1000+Bela+Vista+S%C3%A3o+Paulo+SP',
  },

  // Assinatura no rodapé ("Feito por ..."). Vazio = não aparece.
  credit: '',
  creditUrl: '',

  // Cores: primary = botão principal, ink = textos e topo, accent = linhas finas,
  // background = fundo. (Os ícones de WhatsApp, Instagram, Google e Pix usam as cores oficiais das marcas.)
  theme: { primary: '#C2307A', ink: '#3A1240', accent: '#CDA877', background: '#FBF6F8' },
};
