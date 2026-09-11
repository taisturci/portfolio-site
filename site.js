const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const langButton = document.querySelector('[data-lang-toggle]');

const preferredTheme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const preferredLang = localStorage.getItem('lang') || 'pt';

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (themeButton) {
    themeButton.textContent = theme === 'dark' ? '☀︎' : '☾';
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  }
}

function setLang(lang) {
  root.dataset.lang = lang;
  root.lang = lang === 'pt' ? 'pt-BR' : 'en';
  localStorage.setItem('lang', lang);
  if (langButton) {
    langButton.textContent = lang === 'pt' ? 'EN' : 'PT';
    langButton.setAttribute('aria-label', lang === 'pt' ? 'View in English' : 'Ver em português');
  }
  const title = document.querySelector(`[data-title-${lang}]`);
  if (title) document.title = title.dataset[`title${lang[0].toUpperCase()}${lang.slice(1)}`];
}

setTheme(preferredTheme);
setLang(preferredLang);
themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
langButton?.addEventListener('click', () => setLang(root.dataset.lang === 'pt' ? 'en' : 'pt'));

const hero = document.querySelector('.hero');
const canFollowPointer = !matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && canFollowPointer) {
  let currentX = 50;
  let currentY = 50;
  let targetX = 50;
  let targetY = 50;
  let animationFrame;

  const animateGradient = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    hero.style.setProperty('--gradient-x', `${currentX}%`);
    hero.style.setProperty('--gradient-y', `${currentY}%`);

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      animationFrame = requestAnimationFrame(animateGradient);
    } else {
      animationFrame = undefined;
    }
  };

  const moveGradient = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    targetX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    targetY = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
    if (!animationFrame) animationFrame = requestAnimationFrame(animateGradient);
  };

  hero.addEventListener('pointermove', moveGradient);
  hero.addEventListener('pointerleave', () => {
    targetX = 50;
    targetY = 50;
    if (!animationFrame) animationFrame = requestAnimationFrame(animateGradient);
  });
}
