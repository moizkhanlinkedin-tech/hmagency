/* =========================================================
   HM AGENCY — LEGAL PAGE TAB TOGGLE
   Kept separate from script.js so the homepage interaction
   layer stays untouched. Reads/writes the URL hash so each
   tab is directly linkable (e.g. legal.html#privacy).
   ========================================================= */
(function () {
  'use strict';

  var tabs = document.querySelectorAll('.legal-tab');
  var panels = document.querySelectorAll('.legal-panel');
  var subnav = document.getElementById('legal-subnav');

  if (!tabs.length || !panels.length) return;

  function activate(name, opts) {
    var shouldScroll = opts && opts.scroll;

    tabs.forEach(function (tab) {
      var isMatch = tab.getAttribute('data-panel') === name;
      tab.setAttribute('aria-selected', String(isMatch));
    });

    panels.forEach(function (panel) {
      var isMatch = panel.getAttribute('data-panel') === name;
      if (isMatch) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });

    document.title = (name === 'privacy' ? 'Privacy Policy' : 'Terms of Service') + ' | HM Agency';

    if (shouldScroll && subnav) {
      var top = subnav.getBoundingClientRect().bottom + window.pageYOffset - subnav.offsetHeight - 12;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-panel');
      activate(name, { scroll: true });
      if (history.replaceState) {
        history.replaceState(null, '', '#' + name);
      } else {
        window.location.hash = name;
      }
    });
  });

  window.addEventListener('hashchange', function () {
    var name = window.location.hash.replace('#', '');
    if (name === 'terms' || name === 'privacy') {
      activate(name);
    }
  });

  // Initialize from the URL hash on load (defaults to Terms of Service)
  var initial = window.location.hash.replace('#', '');
  activate(initial === 'privacy' ? 'privacy' : 'terms');
})();
