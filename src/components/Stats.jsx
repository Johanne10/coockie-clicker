export default function Stats({
  mana,
  production,
  multiplier,
  manaPerSecond,
  manaPerMinute,
  totalClicks,
  bestScore,
}) {
  return (
    <div>
      <h2>Mana : {Math.floor(mana)}</h2>
      <p>Rituels actifs : {production} / sec</p>
      <p>Amplification : x{multiplier}</p>

      <hr />

      <p>Mana / seconde : {manaPerSecond}</p>
      <p>Mana / minute : {manaPerMinute}</p>
      <p>Total de clics : {totalClicks}</p>

      <hr />

      <p>
        <b>Meilleur score :</b> {bestScore}
      </p>
    </div>
  );
}