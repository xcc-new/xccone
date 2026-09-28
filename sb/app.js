/* ===== 名表验真 · 品牌跳转列表 ===== */
(function () {
  'use strict';

  function render() {
    const list = document.getElementById('brandList');
    if (!list) return;
    list.innerHTML = '';

    BRANDS.forEach(function (b) {
      const a = document.createElement('a');
      a.className = 'brand-link';
      a.href = b.url;
      a.target = '_blank';
      a.rel = 'noopener';

      const info = document.createElement('span');
      info.className = 'brand-link__info';

      const name = document.createElement('span');
      name.className = 'brand-link__name';
      name.textContent = b.name;

      const en = document.createElement('span');
      en.className = 'brand-link__en';
      en.textContent = b.en;

      info.appendChild(name);
      info.appendChild(en);

      const arrow = document.createElement('span');
      arrow.className = 'brand-link__arrow';
      arrow.textContent = '打开查询';

      a.appendChild(info);
      a.appendChild(arrow);
      list.appendChild(a);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
