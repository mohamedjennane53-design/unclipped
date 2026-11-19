// Unclipped site: hero loop (loaded only when motion and data allow) and the 40 s demo dialog.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  // Hero loop: the poster shows until the video is allowed and loaded.
  const loop = document.querySelector(".hero-loop");
  const toggle = document.querySelector(".loop-toggle");
  if (loop && !reduce && !saveData) {
    loop.querySelectorAll("source[data-src]").forEach((s) => { s.src = s.dataset.src; });
    loop.load();
    const started = loop.play();
    if (started) started.catch(() => {});
    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", () => {
        if (loop.paused) {
          loop.play();
          toggle.textContent = "Pause";
          toggle.setAttribute("aria-pressed", "false");
        } else {
          loop.pause();
          toggle.textContent = "Play";
          toggle.setAttribute("aria-pressed", "true");
        }
      });
    }
  } else if (loop) {
    loop.removeAttribute("autoplay");
  }

  // Demo dialog: the video loads on the first click only. Without dialog support, the link opens the MP4.
  const dialog = document.getElementById("demo-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const demo = dialog.querySelector("video");
  document.querySelectorAll("[data-demo]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (!demo.getAttribute("src")) demo.src = demo.dataset.src;
      dialog.showModal();
      const played = demo.play();
      if (played) played.catch(() => {});
    });
  });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => demo.pause());
})();
