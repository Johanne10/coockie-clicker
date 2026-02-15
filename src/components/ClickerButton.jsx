import React from "react";
import orbImg from "../assets/MagicOrb.png";

export default function ClickerButton({ onClick, multiplier }) {
  return (
    <div className="clicker">
      <button className="orb-btn" onClick={onClick}>
        <img src={orbImg} alt="Magic Orb" className="orb-img" />
      </button>
      <p>+{multiplier} mana par incantation</p>
    </div>
  );
}