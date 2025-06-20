const valores = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
const naipes = ["♦", "♠", "♥", "♣"];
let cartas = [];

valores.forEach(valor => {
  naipes.forEach(naipe => {
    cartas.push({ nome: `${valor}${naipe}`, valor, naipe });
  });
});

let manilhas = [];
let vira = null;
let playerWins = 0;
let botWins = 0;
let gameOver = false;

const valorForca = {
  "4": 1,
  "5": 2,
  "6": 3,
  "7": 4,
  "Q": 5,
  "J": 6,
  "K": 7,
  "A": 8,
  "2": 9,
  "3": 10
};

function definirManilhas(vira) {
  let index = valores.indexOf(vira.valor);
  let proximo = valores[(index + 1) % valores.length];
  let manilhas = cartas.filter(c => c.valor === proximo);
  return manilhas;
}

function cartaForca(carta) {
  let isManilha = manilhas.some(m => m.nome === carta.nome);
  if (isManilha) {
    let naipePeso = { "♣": 4, "♦": 3, "♥": 2, "♠": 1 };
    return 100 + naipePeso[carta.naipe];
  }
  return valorForca[carta.valor];
}

function atualizarViraEManilha() {
  vira = cartas[Math.floor(Math.random() * cartas.length)];
  manilhas = definirManilhas(vira);
  document.getElementById("viraCard").innerText = "🃏 Vira: " + vira.nome;
  document.getElementById("manilhaInfo").innerText = "💥 Manilhas: " + manilhas.map(c => c.nome).join(", ");
}

function playRound() {
  if (gameOver) return;

  const playerCard = cartas[Math.floor(Math.random() * cartas.length)];
  const botCard = cartas[Math.floor(Math.random() * cartas.length)];

  document.getElementById("playerCard").innerText = "🧑 Sua carta: " + playerCard.nome;
  document.getElementById("botCard").innerText = "🤖 Carta do Bot: " + botCard.nome;

  const forcaPlayer = cartaForca(playerCard);
  const forcaBot = cartaForca(botCard);

  let statusMsg = "";

  if (forcaPlayer > forcaBot) {
    playerWins++;
    statusMsg = "✅ Você ganhou essa rodada!";
  } else if (forcaBot > forcaPlayer) {
    botWins++;
    statusMsg = "❌ O Bot venceu essa rodada!";
  } else {
    statusMsg = "😐 Empate na rodada!";
  }

  document.getElementById("status").innerText = statusMsg;
  document.getElementById("roundScore").innerText = `Rodadas: Você ${playerWins} x ${botWins} Bot`;

  if (playerWins === 2) {
    endGame("🎉 Você venceu a partida!");
  } else if (botWins === 2) {
    endGame("💀 O Bot venceu a partida!");
  }
}

function endGame(msg) {
  document.getElementById("status").innerText = msg;
  gameOver = true;
  document.getElementById("playBtn").style.display = "none"; 
  document.getElementById("resetBtn").style.display = "flex"; 
}

function resetGame() {
  playerWins = 0;
  botWins = 0;
  gameOver = false;
  document.getElementById("status").innerText = "Clique para jogar uma rodada!";
  document.getElementById("roundScore").innerText = "Rodadas: Você 0 x 0 Bot";
  document.getElementById("playerCard").innerText = "🧑 Sua carta: -";
  document.getElementById("botCard").innerText = "🤖 Carta do Bot: -";
  document.getElementById("playBtn").style.display = "flex"; 
  document.getElementById("resetBtn").style.display = "none"; 
  atualizarViraEManilha();
}

atualizarViraEManilha();
