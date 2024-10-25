let randomNumber = Math.floor(Math.random() * 100) + 1;
let message = document.getElementById('message');

function checkGuess() {
  let userGuess = Number(document.getElementById('guess').value);

  if (userGuess === randomNumber) {
    message.textContent = 'Selamat Kamu berhasil menebaknya!';
    message.style.color = 'green';
  } else if (userGuess > randomNumber) {
    message.textContent = 'Angkanya terlalu tinggi';
    message.style.color = 'red';
  } else if (userGuess < randomNumber) {
    message.textContent = 'Angkanya terlalu rendah.';
    message.style.color = 'red';
  }
}

function resetGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  document.getElementById('guess').value = '';
  message.textContent = '';
}
