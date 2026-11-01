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
  // Na demonstração, é o WhatsApp da Impulso Tech: quem testar o agendamento fala com o Carlos.
  // Ao entregar para um cliente, troque pelo número dele (ex.: '5581999999999').
  whatsapp: '5581999070229',

  instagram: 'https://www.instagram.com/impulso.teech/',
  // Provisório: abre a busca da Impulso Tech no Google Maps (funciona, mas não abre a janela de avaliação).
  // Quando a Impulso Tech tiver o Perfil da Empresa no Google, troque pelo link de "Pedir avaliações".
  // Vazio = o botão some.
  googleReview: 'https://www.google.com/maps/search/?api=1&query=Impulso+Tech+Recife',

  // Chave Pix FICTÍCIA para a demonstração. name = nome do recebedor, city = cidade.
  pix: { key: 'demonstracao@exemplo.com', name: 'Ateliê Lumi', city: 'Recife' },

  wifi: { network: 'Atelie-Lumi', password: 'demonstracao123' },

  // Dias de atendimento: 0 = domingo, 1 = segunda ... 6 = sábado
  openWeekdays: [1, 2, 3, 4, 5],
  hours: { start: '09:00', end: '18:00' },

  // price: null mostra "a combinar".
  services: [
    { name: 'Alisamento', minutes: 120, price: 180, photo: 'img/liso.jpg', description: 'Fios alinhados, brilho de espelho' },
    { name: 'Cílios', minutes: 90, price: 120, photo: 'img/cilios.jpg', description: 'Olhar marcante com leveza' },
    { name: 'Epilação', minutes: 30, price: 60, photo: 'img/epilacao.jpg', description: 'Pele lisa, com todo o cuidado' },
  ],

  gallery: ['img/galeria1.jpg', 'img/galeria2.jpg', 'img/galeria3.jpg'],

  address: {
    text: 'Avenida Boa Viagem, 1000, Boa Viagem, Recife - PE',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+Boa+Viagem+1000+Boa+Viagem+Recife+PE',
  },

  // Assinatura no rodapé ("Feito por ..."). Vazio = não aparece.
  credit: '',
  creditUrl: '',

  // Cores: primary = botão principal, ink = textos e topo, accent = linhas finas,
  // background = fundo. (Os ícones de WhatsApp, Instagram, Google e Pix usam as cores oficiais das marcas.)
  theme: { primary: '#C2307A', ink: '#3A1240', accent: '#CDA877', background: '#FBF6F8' },
};
