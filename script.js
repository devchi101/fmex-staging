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
