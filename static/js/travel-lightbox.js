document.addEventListener("DOMContentLoaded", function () {
  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&lsaquo;</button>' +
    '<img src="" alt="" />' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next">&rsaquo;</button>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector("img");
  var images = [];
  var current = 0;

  function show(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    current = index;
    img.src = images[current].src;
    img.alt = images[current].alt;
  }

  document.querySelectorAll(".gallery img").forEach(function (el, i) {
    images.push({ src: el.src, alt: el.alt || "" });
    el.addEventListener("click", function () {
      current = i;
      show(current);
      overlay.classList.add("active");
    });
  });

  overlay.querySelector(".lightbox-prev").addEventListener("click", function (e) {
    e.stopPropagation();
    show(current - 1);
  });

  overlay.querySelector(".lightbox-next").addEventListener("click", function (e) {
    e.stopPropagation();
    show(current + 1);
  });

  overlay.querySelector(".lightbox-close").addEventListener("click", function () {
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.classList.remove("active");
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape") overlay.classList.remove("active");
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
});
