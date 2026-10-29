# Bio site estilo Coonexta — Etapa 1

## Objetivo
Página única de "link na bio", pensada para celular, no estilo do Coonexta (coonexta.com.br),
para a irmã do usuário (nicho: cabelo). Deve ser fácil trocar de nicho/cliente, porque o usuário
pretende, depois, oferecer isso a outros clientes por mensalidade (Etapa 2, fora deste escopo).

## Fora do escopo (Etapa 2)
Painel do cliente, login, banco de dados, bloqueio automático de horários ocupados, cobrança de mensalidade.

## Decisões já tomadas
- Confirmar agendamento = abrir o WhatsApp da profissional com a mensagem pronta (ela já agenda assim hoje).
- Tecnologia: HTML + CSS + JavaScript simples, sem servidor e sem bibliotecas novas.
- Todos os dados do cliente ficam em um único arquivo de configuração (`config.js`).

## Funcionalidades (vistas nos prints do Coonexta)
1. Capa no topo, foto de perfil quadrada arredondada sobreposta, nome, frase curta com emojis.
2. Botões grandes e arredondados com ícone: Agende aqui (expansível), Instagram, WhatsApp,
   Avaliar no Google (azul), Chave Pix (expansível), WiFi (expansível).
3. Agendamento: serviço (nome, duração, preço) → dia (calendário, dias fechados desabilitados)
   → horário (gerado a partir do expediente, de 15 em 15 min) → nome, telefone, observações
   → abre WhatsApp com a mensagem.
4. Pix: nome + valor → QR Code e código "copia e cola" gerados na própria página a partir da chave Pix; botão copiar.
5. WiFi: mostra rede e senha, com botões para copiar.
6. Vitrine: carrossel "Nossos serviços" (foto, título, descrição, botão), galeria "Conheça mais do nosso trabalho".
7. "Como chegar": endereço e botão que abre o Google Maps (sem mapa embutido nesta etapa).

## Arquivos
- `index.html` — estrutura
- `style.css` — visual (cores, arredondados), tudo controlado por variáveis de cor
- `app.js` — comportamento
- `config.js` — todos os dados (nome, frase, imagens, serviços, expediente, links, chave Pix, WiFi, galeria, endereço)
- `img/` — fotos

## Dados
Começa com dados de exemplo (cabelo). Dados reais (nome, serviços, preços, horários, chave Pix, fotos)
são preenchidos pelo usuário em `config.js` depois.

## Limitação conhecida
Sem servidor, a página não sabe quais horários já foram ocupados; a profissional resolve na conversa do WhatsApp.

## Como verificar
Abrir no navegador em largura de celular e testar: cada botão, o fluxo completo de agendamento
(a mensagem do WhatsApp sai correta), geração e cópia do Pix, WiFi, carrossel e "Como chegar".
