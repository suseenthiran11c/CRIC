/* ====================================================
   TOSS SCREEN 3D COIN CONTROLLER
   ==================================================== */

class TossController {
  static flipCoin(onComplete) {
    const coin = document.getElementById('toss-coin-element');
    const resultText = document.getElementById('toss-result-text');
    if (!coin) return;

    coin.classList.remove('flip-heads', 'flip-tails');
    void coin.offsetWidth; // Trigger reflow

    const isHeads = Math.random() < 0.5;
    const resultSide = isHeads ? 'Heads' : 'Tails';

    if (resultText) {
      resultText.innerHTML = `<span class="badge-cyan">Coin is in the air...</span>`;
    }

    setTimeout(() => {
      coin.classList.add(isHeads ? 'flip-heads' : 'flip-tails');
    }, 100);

    setTimeout(() => {
      if (resultText) {
        resultText.innerHTML = `Coin landed on: <strong style="color: var(--primary); font-size: 1.2rem;">${resultSide}</strong>`;
      }
      if (onComplete) onComplete(resultSide);
    }, 3200);
  }
}
