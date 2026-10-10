(() => {
  alert(1);
  const marker = 'CORTEX_GITHUB_EXTERNAL_JS_CONFIRMED';
  document.title = marker;
  document.documentElement.setAttribute('data-cortex-github-js', marker);
  window.__CORTEX_GITHUB_JS__ = marker;
})();