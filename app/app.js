(() => {
  const scripts = ['./core.js?v=102-final', './screens.js?v=102-final', './runtime.js?v=102-final'];
  scripts.reduce(
    (chain, src) => chain.then(() => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Nepodařilo se načíst ${src}`));
      document.head.appendChild(script);
    })),
    Promise.resolve(),
  ).catch((error) => {
    const app = document.querySelector('#app');
    if (app) app.textContent = `UI preview se nepodařilo načíst: ${error.message}`;
  });
})();
