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

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "https://esm.sh/@solana/web3.js";

// DOM Elements
const buyButton = document.getElementById("buyButton");
const solInput = document.getElementById("solAmount");
const confirmMsg = document.getElementById("confirmationMessage");
const toast = document.getElementById("toast");

const recipientAddress = "dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1"; // Replace if needed

function showToast(message, isError = false, playSound = false) {
  toast.textContent = message;
  toast.style.background = isError ? "#b00020" : "#222";
  toast.classList.add("show");

  if (playSound) {
    const sound = document.getElementById("toast-sound");
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.warn("Autoplay failed:", err.message);
      });
    }
  }

  setTimeout(() => toast.classList.remove("show"), 7000);
}

buyButton.addEventListener("click", async () => {
  if (!window.solana?.isPhantom) {
    window.location.href = "https://phantom.app/ul/browse/" + encodeURIComponent(window.location.href);
    return;
  }

  const amount = parseFloat(solInput.value);
  if (isNaN(amount) || amount < 0.1) {
    showToast("Enter at least 0.1 SOL", true);
    return;
  }

  try {
    buyButton.disabled = true;
    buyButton.textContent = "⏳ Processing...";
    confirmMsg.textContent = "";

    const provider = window.solana;
    await provider.connect();

    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const fromPubkey = provider.publicKey;
    const toPubkey = new PublicKey(recipientAddress);

    // Retry blockhash fetch
    let latest;
    for (let i = 0; i < 3; i++) {
      try {
        latest = await connection.getLatestBlockhash('finalized');
        break;
      } catch (err) {
        console.warn(`Retrying blockhash fetch... (${i + 1})`, err);
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    if (!latest) {
      showToast("❌ Failed to get blockhash. Try clearing cache and refreshing.", true);
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * 1e9,
      })
    );

    transaction.recentBlockhash = latest.blockhash;
    transaction.feePayer = fromPubkey;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature, 'finalized');

    showToast("✅ Transaction successful!! Your $FMEX will be sent in 24 hrs after verification", false, true);
    confirmMsg.textContent = `❤️ Congrats, ${amount} SOL bought! Your ex still sucks, but now you have $FMEX — Txn: ${signature}`;
    confirmMsg.style.color = "green";

  } catch (err) {
    console.error(err);
    showToast("❌ " + err.message, true);
    confirmMsg.textContent = `❌ Transaction failed: ${err.message}`;
    confirmMsg.style.color = "red";
  } finally {
    buyButton.disabled = false;
    buyButton.textContent = "Buy with SOL";
  }
});
