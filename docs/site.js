(() => {
  'use strict';
  const dialog = document.querySelector('#image-dialog');
  const image = document.querySelector('#viewer-image');
  const stage = document.querySelector('#image-stage');
  const output = document.querySelector('#zoom-value');
  let zoom = 1, x = 0, y = 0, dragging = null, origin = null;
  const draw = () => {
    image.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    output.value = `${Math.round(zoom * 100)}%`;
    output.textContent = output.value;
  };
  const fit = () => { zoom = 1; x = 0; y = 0; draw(); };
  const setZoom = value => { zoom = Math.max(.5, Math.min(6, value)); draw(); };
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      origin = button;
      image.src = button.dataset.image;
      image.alt = button.dataset.title;
      document.querySelector('#image-title').textContent = button.dataset.title;
      fit(); dialog.showModal(); document.body.classList.add('no-scroll');
      document.querySelector('#close-image').focus();
    });
  });
  document.querySelector('#close-image').addEventListener('click', () => dialog.close());
  document.querySelector('#fit-image').addEventListener('click', fit);
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => setZoom(zoom + (button.dataset.zoom === 'in' ? .25 : -.25))));
  dialog.addEventListener('close', () => { document.body.classList.remove('no-scroll'); dragging = null; if (origin) origin.focus(); });
  stage.addEventListener('wheel', event => { event.preventDefault(); setZoom(zoom * (event.deltaY < 0 ? 1.15 : 1 / 1.15)); }, { passive: false });
  stage.addEventListener('dblclick', fit);
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 && event.button !== 1) return;
    event.preventDefault(); dragging = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    x = dragging.x + event.clientX - dragging.startX; y = dragging.y + event.clientY - dragging.startY; draw();
  });
  const stop = () => { dragging = null; };
  stage.addEventListener('pointerup', stop); stage.addEventListener('pointercancel', stop);
})();
