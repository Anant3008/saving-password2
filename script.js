const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store key-value in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve value by key from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Clear local storage
function clear() {
  localStorage.clear();
}

// SHA256 hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// Get (or generate) the SHA256 hash of a 3-digit number
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  const number = getRandomArbitrary(MIN, MAX).toString();
  const hashed = await sha256(number);
  store('sha256', hashed);
  store('original', number); // Optional: store original number for debugging
  return hashed;
}

// Show the hash on page load
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Check user's input against stored hash
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Enter a 3-digit number';
    resultView.classList.remove('hidden');
    return;
  }

  const enteredHash = await sha256(pin);
  const correctHash = retrieve('sha256');

  if (enteredHash === correctHash) {
    resultView.innerHTML = '🎉 Success!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect. Try again.';
    resultView.classList.remove('success');
  }
  resultView.classList.remove('hidden');
}

// Only allow 3-digit numbers in input
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// Attach test() to check button
document.getElementById('check').addEventListener('click', test);

// Generate the hash and show it
main();
