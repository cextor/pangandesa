import React from 'react';

/**
 * Trigger fly-to-cart animation for a clicked button
 */
export const triggerFlyToCartAnimation = (
  clickEvent: React.MouseEvent<any> | MouseEvent,
  productImage: string | null
) => {
  const btn = clickEvent.currentTarget as HTMLElement;
  if (!btn) return;

  const cartBtn = document.getElementById('header-cart-btn');
  if (!cartBtn) return;

  const btnRect = btn.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  // Create flyer element
  const flyer = document.createElement('div');
  flyer.style.position = 'fixed';
  flyer.style.left = `${btnRect.left + btnRect.width / 2 - 15}px`;
  flyer.style.top = `${btnRect.top + btnRect.height / 2 - 15}px`;
  flyer.style.width = '30px';
  flyer.style.height = '30px';
  flyer.style.borderRadius = '50%';
  flyer.style.zIndex = '99999';
  flyer.style.pointerEvents = 'none';
  flyer.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  flyer.style.border = '2px solid #1a4d2e';
  flyer.style.boxShadow = '0 4px 12px rgba(26, 77, 46, 0.3)';
  flyer.style.backgroundColor = '#1a4d2e';
  flyer.style.display = 'flex';
  flyer.style.alignItems = 'center';
  flyer.style.justifyContent = 'center';
  flyer.style.overflow = 'hidden';

  if (productImage) {
    const img = document.createElement('img');
    img.src = productImage;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    flyer.appendChild(img);
  } else {
    flyer.innerText = '🌾';
    flyer.style.fontSize = '12px';
  }

  document.body.appendChild(flyer);

  // Trigger fly action on next paint
  requestAnimationFrame(() => {
    flyer.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
    flyer.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
    flyer.style.width = '20px';
    flyer.style.height = '20px';
    flyer.style.opacity = '0.3';
    flyer.style.transform = 'scale(0.3)';
  });

  // Clean up flyer and animate/shake the header cart icon
  setTimeout(() => {
    flyer.remove();
    const originalTransform = cartBtn.style.transform || 'none';
    cartBtn.style.transition = 'transform 0.15s ease';
    cartBtn.style.transform = 'scale(1.3) rotate(8deg)';
    setTimeout(() => {
      cartBtn.style.transform = 'scale(0.9) rotate(-8deg)';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1.1) rotate(4deg)';
        setTimeout(() => {
          cartBtn.style.transform = originalTransform === 'none' ? '' : originalTransform;
        }, 100);
      }, 100);
    }, 150);
  }, 800);
};
