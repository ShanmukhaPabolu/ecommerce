import React from "react";
import { useCart, FREE_DELIVERY_THRESHOLD } from "../context/CartContext.jsx";

export default function DeliveryStrip() {
  const { subtotal, amountToFreeDelivery, freeDeliveryProgress } = useCart();

  if (subtotal === 0) return null;

  return (
    <div className="delivery-strip">
      <div className="container delivery-strip-inner">
        <span className="delivery-strip-text">
          {amountToFreeDelivery > 0 ? (
            <>
              Add <strong>₹{amountToFreeDelivery}</strong> more for{" "}
              <strong className="free-text">FREE DELIVERY</strong>
            </>
          ) : (
            <strong className="free-text">🎉 You've unlocked FREE DELIVERY!</strong>
          )}
        </span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${freeDeliveryProgress}%` }}
            aria-label={`${Math.round(freeDeliveryProgress)}% to free delivery`}
          />
        </div>
        <span className="delivery-strip-threshold">₹{FREE_DELIVERY_THRESHOLD}</span>
      </div>
    </div>
  );
}
