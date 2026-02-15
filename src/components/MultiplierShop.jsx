export default function MultiplierShop({ multiplier, cost, onBuy, canBuy }) {
  return (
    <div>
      <h2>Amplification Arcanique</h2>
      <p>Actuel : x{multiplier}</p>
      <button onClick={onBuy} disabled={!canBuy}>
        Améliorer ({cost})
      </button>
    </div>
  );
}