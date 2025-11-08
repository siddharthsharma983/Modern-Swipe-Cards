const carousel = document.querySelector(".carousel");
const cards = document.querySelectorAll(".card");

let isDown = false;
let startX;
let scrollLeft;
let velocity = 0;
let momentumID;

// Mouse + Touch drag with momentum
carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX;
  scrollLeft = carousel.scrollLeft;
  cancelMomentum();
});

carousel.addEventListener("mouseleave", endDrag);
carousel.addEventListener("mouseup", endDrag);

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - startX;
  const prevScrollLeft = carousel.scrollLeft;
  carousel.scrollLeft = scrollLeft - x;
  velocity = carousel.scrollLeft - prevScrollLeft;
});

carousel.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.touches[0].pageX;
  scrollLeft = carousel.scrollLeft;
  cancelMomentum();
});

carousel.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - startX;
  const prevScrollLeft = carousel.scrollLeft;
  carousel.scrollLeft = scrollLeft - x;
  velocity = carousel.scrollLeft - prevScrollLeft;
});

carousel.addEventListener("touchend", endDrag);

function endDrag() {
  isDown = false;
  startMomentum();
  snapToNearestCard();
}

function startMomentum() {
  cancelMomentum();
  momentumID = requestAnimationFrame(momentumLoop);
}

function cancelMomentum() {
  cancelAnimationFrame(momentumID);
}

function momentumLoop() {
  carousel.scrollLeft += velocity;
  velocity *= 0.95;
  if (Math.abs(velocity) > 0.5) {
    momentumID = requestAnimationFrame(momentumLoop);
  }
}

// Snap to nearest card center
function snapToNearestCard() {
  setTimeout(() => {
    const cardWidth = cards[0].offsetWidth + 25;
    const index = Math.round(carousel.scrollLeft / cardWidth);
    carousel.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });

    cards.forEach((c) => c.classList.remove("active"));
    if (cards[index]) cards[index].classList.add("active");
  }, 200);
}

// Initial active card
snapToNearestCard();
