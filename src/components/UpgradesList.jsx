export default function UpgradesList({ mana, upgrades, onBuy }) {
  return (
    <div>
      <h2>Améliorations</h2>
      {upgrades.map((u) => (
        <div key={u.id} className="upgrade">
          <h3>{u.name}</h3>
          <p>+{u.bonusPerSec} mana/sec</p>
          <button
            onClick={() => onBuy(u.id)}
            disabled={mana < u.cost}
          >
            Acheter ({u.cost})
          </button>
        </div>
      ))}
    </div>
  );
}