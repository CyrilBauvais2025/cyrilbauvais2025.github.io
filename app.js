const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const progress = document.querySelector('.reading-progress span');
function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('span').textContent = '+'; }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('span').textContent = open ? '−' : '+'; });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
function updateScroll() { header.classList.toggle('scrolled', window.scrollY > 30); document.body.classList.toggle('hero-active', window.scrollY < window.innerHeight * .55); const total = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`; }
window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); updateScroll(); });
updateScroll();
const sections = [...document.querySelectorAll('main > section')];
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (!entry.isIntersecting) return; nav.querySelectorAll('a').forEach(link => { if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); }); }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 }); sections.forEach(section => observer.observe(section)); }

const portraitSections = [document.querySelector('#profil'), document.querySelector('#contact')];
function updatePortraitVisibility() {
  const middle = window.innerHeight / 2;
  const visible = portraitSections.some(section => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= middle && bounds.bottom > middle;
  });
  document.body.classList.toggle('portrait-visible', visible);
}
window.addEventListener('scroll', updatePortraitVisibility, { passive: true });
window.addEventListener('resize', updatePortraitVisibility);
window.addEventListener('hashchange', updatePortraitVisibility);
updatePortraitVisibility();

// Reveal the supplied laboratory wireframe with a soft lens that follows the pointer.
const meshBackdrop = document.querySelector('.backdrop');
const meshLayer = meshBackdrop.querySelector('.mesh-layer');
let meshX = -500, meshY = -500, targetX = -500, targetY = -500, meshFrame = 0;
function followMesh() {
  meshX += (targetX - meshX) * .2;
  meshY += (targetY - meshY) * .2;
  meshLayer.style.setProperty('--mesh-x', `${meshX}px`);
  meshLayer.style.setProperty('--mesh-y', `${meshY}px`);
  if (Math.abs(targetX - meshX) + Math.abs(targetY - meshY) > .5) meshFrame = requestAnimationFrame(followMesh);
  else meshFrame = 0;
}
function revealMesh(event) {
  const area = meshBackdrop.getBoundingClientRect();
  if (event.clientX < area.left || event.clientX > area.right || event.clientY < area.top || event.clientY > area.bottom) {
    meshBackdrop.classList.remove('mesh-active');
    return;
  }
  targetX = event.clientX - area.left;
  targetY = event.clientY - area.top;
  if (!meshBackdrop.classList.contains('mesh-active')) {
    meshX = targetX;
    meshY = targetY;
    meshLayer.style.setProperty('--mesh-x', `${meshX}px`);
    meshLayer.style.setProperty('--mesh-y', `${meshY}px`);
    meshBackdrop.classList.add('mesh-active');
  }
  if (!meshFrame) meshFrame = requestAnimationFrame(followMesh);
}
document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'touch') revealMesh(event);
}, { passive: true });
document.addEventListener('pointerdown', revealMesh, { passive: true });
document.addEventListener('pointerup', event => {
  if (event.pointerType === 'touch') meshBackdrop.classList.remove('mesh-active');
}, { passive: true });
document.addEventListener('pointerout', event => {
  if (!event.relatedTarget) meshBackdrop.classList.remove('mesh-active');
});
window.addEventListener('blur', () => meshBackdrop.classList.remove('mesh-active'));

document.querySelectorAll('.inline-detail').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    detail.closest('.screen').querySelectorAll('.inline-detail[open]').forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});
