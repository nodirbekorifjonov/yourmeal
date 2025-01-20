const categories = document.querySelector(".categories__list");

let isDragging = false;
let startX;
let scrollLeft;

// Mouse down event
categories.addEventListener("mousedown", (e) => {
  isDragging = true;
  categories.classList.add("dragging");
  startX = e.pageX - categories.offsetLeft;
  scrollLeft = categories.scrollLeft;
});

// Mouse move event
categories.addEventListener("mousemove", (e) => {
  if (!isDragging) return; // Only drag if the mouse is down
  e.preventDefault();
  const x = e.pageX - categories.offsetLeft;
  const walk = x - startX; // Calculate distance moved
  categories.scrollLeft = scrollLeft - walk;
});

// Mouse up & leave events
categories.addEventListener("mouseup", () => {
  isDragging = false;
  categories.classList.remove("dragging");
});
categories.addEventListener("mouseleave", () => {
  isDragging = false;
  categories.classList.remove("dragging");
});
