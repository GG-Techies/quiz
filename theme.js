// Apply the saved theme before styles paint; default to the device preference.
(() => {
  const key = 'bora-valendo.theme.v1';
  const modes = ['system', 'light', 'dark'];
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (modes.includes(saved)) preference = saved; } catch {}
  function apply() {
    const active = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = active;
    document.querySelector('meta[name="theme-color"]').content = active === 'dark' ? '#181020' : '#fffcf3';
    window.dispatchEvent(new Event('bora-theme-change'));
  }
  window.BoraTheme = {
    get preference() { return preference; },
    get active() { return document.documentElement.dataset.theme; },
    set(mode) {
      if (!modes.includes(mode)) return;
      preference = mode;
      try { localStorage.setItem(key, mode); } catch {}
      apply();
    }
  };
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = modes.includes(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });
  apply();
})();
