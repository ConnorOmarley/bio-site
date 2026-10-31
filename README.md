# Bio site (link na bio)

Página única, feita para celular, no estilo "link na bio": o cliente do seu cliente abre o link do Instagram e já consegue **agendar pelo WhatsApp**, **pagar com Pix**, ver os serviços, a galeria e como chegar.

Este repositório é uma **demonstração**: todos os dados (nome "Ateliê Lumi", número, chave Pix e senha de Wi-Fi) são fictícios.

## O que a página faz

- **Agendamento:** a pessoa escolhe o serviço, o dia e o horário, informa nome, telefone e observações, e o WhatsApp abre com a mensagem pronta. Dias fechados ficam desabilitados e os horários são gerados a partir do expediente.
- **Pix:** informa o valor e a página gera o **QR Code** e o código "copia e cola" na hora, direto no navegador, com botão de copiar.
- **Wi-Fi:** mostra a rede e a senha, com botões para copiar.
- **Vitrine:** carrossel de serviços (foto, descrição e botão) e galeria de trabalhos.
- **Como chegar:** endereço, mapa embutido e botão que abre o Google Maps.
- **Atalhos:** Instagram, WhatsApp e avaliação no Google. Se um campo ficar vazio, o botão correspondente some.
- **Capa em vídeo** curto (sem som, repete sozinho) ou só imagem.
- **Cores trocáveis** por variáveis (botão, textos, detalhes e fundo).

## Como trocar de cliente ou de nicho

Todos os dados ficam em **um único arquivo: [`config.js`](config.js)**. Para um novo cliente:

1. Edite `config.js` (nome, frase, WhatsApp com DDI 55 e DDD, serviços, horários, endereço, links, cores).
2. Troque as fotos da pasta `img/`.
3. Coloque `demo: false` quando usar a chave Pix real, para esconder o aviso de "chave fictícia".

Não precisa mexer em mais nada.

## Como rodar

Não precisa instalar nada. Abra o `index.html` no navegador (de preferência em largura de celular) ou, se preferir um servidor local:

```bash
python -m http.server 5173
```

e acesse `http://localhost:5173`.

## Testes

A lógica (Pix, horários, mensagem do WhatsApp, dias de atendimento) tem testes automáticos. Com o Node.js instalado:

```bash
node --test tests/
```

## Limitação conhecida

Como não há servidor nem banco de dados, a página **não sabe quais horários já foram ocupados**. A confirmação final do horário acontece na conversa do WhatsApp.

## Tecnologias

HTML, CSS e JavaScript puros, sem build e sem dependências para instalar. O QR Code é gerado pela biblioteca [QR Code Generator for JavaScript](http://www.d-project.com/) (Kazuhiko Arase, licença MIT), que está em `vendor/qrcode.js`.

## Estrutura

```
index.html   estrutura da página
style.css    visual (cores e arredondados por variáveis)
app.js       comportamento (agendamento, Pix, carrossel, mapa)
logic.js     regras puras, com testes
config.js    todos os dados do cliente
img/         fotos e vídeo da capa
vendor/      biblioteca de QR Code
tests/       testes automáticos
```
