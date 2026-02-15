import "./App.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ClickerButton from "./components/ClickerButton";
import Stats from "./components/Stats";
import UpgradesList from "./components/UpgradesList";
import MultiplierShop from "./components/MultiplierShop";

const STORAGE_KEY = "arcane-clicker-save-v1";

const defaultUpgrades = [
  { id: "apprentice", name: "Apprenti Mage", baseCost: 20, bonusPerSec: 1, purchases: 0 },
  { id: "tower", name: "Tour de Sorcier", baseCost: 120, bonusPerSec: 5, purchases: 0 },
  { id: "ritual", name: "Cercle d’Invocation", baseCost: 700, bonusPerSec: 20, purchases: 0 },
];

function calcDynamicCost(baseCost, purchases, factor = 1.15) {
  return Math.floor(baseCost * Math.pow(factor, purchases));
}

export default function App() {
  const [mana, setMana] = useState(0);
  const [production, setProduction] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [upgrades, setUpgrades] = useState(defaultUpgrades);

 
  const [totalClicks, setTotalClicks] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [multPurchases, setMultPurchases] = useState(0);
  const multBaseCost = 60;
  const multStep = 0.2;
  const multCost = useMemo(
    () => calcDynamicCost(multBaseCost, multPurchases, 1.25),
    [multPurchases]
  );

    const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);

      if (typeof saved.mana === "number") setMana(saved.mana);
      if (typeof saved.production === "number") setProduction(saved.production);
      if (typeof saved.multiplier === "number") setMultiplier(saved.multiplier);
      if (Array.isArray(saved.upgrades)) setUpgrades(saved.upgrades);

      if (typeof saved.multPurchases === "number") setMultPurchases(saved.multPurchases);
      if (typeof saved.totalClicks === "number") setTotalClicks(saved.totalClicks);
      if (typeof saved.bestScore === "number") setBestScore(saved.bestScore);
    } catch {
      
    } finally {
      setHasLoaded(true); 
    }
  }, []);

  
  useEffect(() => {
    if (!hasLoaded) return;

    const payload = {
      mana,
      production,
      multiplier,
      upgrades,
      multPurchases,
      totalClicks,
      bestScore,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hasLoaded, mana, production, multiplier, upgrades, multPurchases, totalClicks, bestScore]);

  useEffect(() => {
    const id = setInterval(() => {
      setMana((m) => {
        const next = m + production;
        setBestScore((b) => Math.max(b, Math.floor(next)));
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [production]);

  function showToast(message, type = "ok") {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }

 
  function handleClick() {
    setTotalClicks((t) => t + 1);

    setMana((m) => {
      const next = m + 1 * multiplier;
      setBestScore((b) => Math.max(b, Math.floor(next)));
      return next;
    });
  }

  
  function buyUpgrade(id) {
    const upgrade = upgrades.find((u) => u.id === id);
    if (!upgrade) return;

    const cost = calcDynamicCost(upgrade.baseCost, upgrade.purchases);

    setMana((currentMana) => {
      if (currentMana < cost) {
        showToast("Mana insuffisant", "error");
        return currentMana;
      }

      setProduction((p) => p + upgrade.bonusPerSec);

      setUpgrades((prev) =>
        prev.map((u) => (u.id === id ? { ...u, purchases: u.purchases + 1 } : u))
      );

      showToast(`Invocation réussie ! (+${upgrade.bonusPerSec}/sec)`, "ok");
      return currentMana - cost;
    });
  }

  
  function buyMultiplier() {
    const cost = multCost;

    setMana((currentMana) => {
      if (currentMana < cost) {
        showToast("Mana insuffisant", "error");
        return currentMana;
      }

      setMultPurchases((n) => n + 1);
      setMultiplier((m) => Math.round((m + multStep) * 10) / 10);

      showToast("Amplification arcanique activée ✨", "ok");
      return currentMana - cost;
    });
  }

  
  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    setMana(0);
    setProduction(0);
    setMultiplier(1);
    setMultPurchases(0);
    setUpgrades(defaultUpgrades);
    setTotalClicks(0);
    setBestScore(0);
    showToast("Réinitialisation effectuée ✨", "ok");
  }


  const manaPerSecond = production * multiplier;
  const manaPerMinute = manaPerSecond * 60;

  const upgradesForUI = useMemo(() => {
    return upgrades.map((u) => ({
      ...u,
      cost: calcDynamicCost(u.baseCost, u.purchases),
    }));
  }, [upgrades]);

  return (
    <div className="app">
      <h1>🧙 Arcane Clicker</h1>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="grid">
        <div className="panel">
          <Stats
            mana={mana}
            production={production}
            multiplier={multiplier}
            manaPerSecond={manaPerSecond}
            manaPerMinute={manaPerMinute}
            totalClicks={totalClicks}
            bestScore={bestScore}
          />

          <ClickerButton onClick={handleClick} multiplier={multiplier} />

          <MultiplierShop
            multiplier={multiplier}
            cost={multCost}
            onBuy={buyMultiplier}
            canBuy={mana >= multCost}
          />
        </div>

        <div className="panel">
          <UpgradesList mana={mana} upgrades={upgradesForUI} onBuy={buyUpgrade} />
        </div>
      </div>

      <footer className="footer">
        <button className="reset" onClick={resetGame}>
          Réinitialiser
        </button>
      </footer>
    </div>
  );
}