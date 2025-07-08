const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggle.textContent = document.body.classList.contains('light') ? '😈' : '🌙';
});

// Phantom Wallet integration
let provider = null;
window.addEventListener("load", async () => {
  if (window.solana && window.solana.isPhantom) {
    provider = window.solana;
    try {
      await provider.connect();
      document.getElementById("status").textContent = `✅ Connected: ${provider.publicKey.toString()}`;
    } catch {
      document.getElementById("status").textContent = "❌ Connection rejected.";
    }
  } else {
    document.getElementById("status").textContent = "🚫 Please install the Phantom wallet.";
  }
});



// Set initial progress (e.g. 22,980.01 out of 50,000)
const raised = 22980.01;
const target = 50000;
const progressPercent = (raised / target) * 100;

// Animate progress bar fill
document.addEventListener("DOMContentLoaded", () => {
  const fill = document.getElementById("progress-fill");
  if (fill) {
    fill.style.width = `${progressPercent.toFixed(2)}%`;
  }
});

let walletAddress = null;

document.getElementById('wallet-button').onclick = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      walletAddress = resp.publicKey.toString();
      document.getElementById('wallet-button').innerText = "Connected: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    } catch (err) {
      console.error("Connection error:", err);
      alert("Failed to connect wallet");
    }
  } else {
    alert("Phantom Wallet not found. Please install it.");
  }
};

window.addEventListener('load', async () => {
  if (window.solana?.isPhantom) {
    try {
      const resp = await window.solana.connect({ onlyIfTrusted: true });
      walletAddress = resp.publicKey.toString();
      document.getElementById('wallet-button').innerText = "Connected: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    } catch (e) {
      // not connected
    }
  }
});

const solInput = document.getElementById("solAmount");
const estimateEl = document.getElementById("fmexEstimate");

function updateEstimate() {
  const sol = parseFloat(solInput.value);
  if (!isNaN(sol) && sol >= 0.1) {
    const fmexAmount = sol * 800_000; // 1 SOL = 800,000 FMEX
    estimateEl.textContent = `You’ll receive: ${fmexAmount.toLocaleString()} $FMEX`;
    estimateEl.style.color = "lime";
  } else {
    estimateEl.textContent = "";
  }
}

if (solInput && estimateEl) {
  solInput.addEventListener("input", updateEstimate);
}

const phrases = [
  "We're not just memeing for fun — this is a lifestyle.",
  "Stake. Meme. Earn. Repeat.",
  "Join the heartbreak-fueled meme empire 💔"
];

const typingText = document.getElementById("typingText");

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let speed = 80;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const currentText = currentPhrase.substring(0, charIndex);

  typingText.textContent = currentText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    speed = 80;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    speed = 40;
  } else {
    if (!isDeleting) {
      isDeleting = true;
      speed = 1000; // pause before deleting
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }
  }

  setTimeout(type, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  type();
});
