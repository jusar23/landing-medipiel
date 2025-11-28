// constantes
(() => {
  const track = document.getElementById('carouselTrack');
  const cardsRow = track.querySelector('.cards');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let cardItems = Array.from(cardsRow.children);
  const totalCards = cardItems.length;

  // Función para calcular cartas por vista según ancho
  function getCardsPerView() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  // Clonar cartas al inicio y al final para loop infinito
  cardItems.forEach(card => {
    const cloneEnd = card.cloneNode(true);
    const cloneStart = card.cloneNode(true);
    cardsRow.appendChild(cloneEnd);
    cardsRow.insertBefore(cloneStart, cardsRow.firstChild);
  });

  // Ajustar posición inicial
  const firstRealIndex = totalCards; 
  let cardWidth = cardItems[0].getBoundingClientRect().width + 12;
  track.scrollLeft = cardWidth * firstRealIndex;

  function getScrollAmount() {
    return cardWidth * getCardsPerView();
  }

  // Botones
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // mouse/touch
  let isDown = false;
  let startX;
  let scrollStart;

  cardsRow.addEventListener('pointerdown', (e) => {
    isDown = true;
    cardsRow.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDown) return;
    isDown = false;
    try { cardsRow.releasePointerCapture(e.pointerId); } catch {}
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  cardsRow.addEventListener('dragstart', (e) => e.preventDefault());

  // Reset infinito 
  track.addEventListener('scroll', () => {
    if (track.scrollLeft >= cardWidth * (totalCards + firstRealIndex)) {
      track.scrollLeft = track.scrollLeft - cardWidth * totalCards;
    }
    if (track.scrollLeft <= cardWidth * (firstRealIndex - 1)) {
      track.scrollLeft = track.scrollLeft + cardWidth * totalCards;
    }
  });

  // Recalcular 
  window.addEventListener('resize', () => {
    cardWidth = cardItems[0].getBoundingClientRect().width + 12;
    track.scrollLeft = cardWidth * firstRealIndex;
  });
})();
