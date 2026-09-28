/* ===== 名表验真 · 交互逻辑 ===== */
(function () {
  'use strict';

  /* ---- 验证路径元信息（标签文案与语义色由 CSS 类承载） ---- */
  const PRIMARY_META = {
    online: { label: '官方在线可查', cls: 'online' },
    service: { label: '官方送检', cls: 'service' },
    third: { label: '权威第三方', cls: 'third' }
  };

  let currentGroupId = WATCH_GROUPS[0].id;
  let currentBrandName = WATCH_GROUPS[0].brands[0].name;

  /* ---- 工具 ---- */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function findBrand(groupId, brandName) {
    const group = WATCH_GROUPS.find(function (g) { return g.id === groupId; });
    const brand = group.brands.find(function (b) { return b.name === brandName; });
    return { group: group, brand: brand };
  }

  /* ---- 渲染：分组 Tabs ---- */
  function renderTabs() {
    const wrap = document.getElementById('groupTabs');
    wrap.innerHTML = '';
    WATCH_GROUPS.forEach(function (group) {
      const tab = el('button', 'group-tab');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(group.id === currentGroupId));
      const name = el('span', 'group-tab__name', group.name);
      const sub = el('span', 'group-tab__sub', group.subtitle);
      tab.appendChild(name);
      tab.appendChild(sub);
      tab.addEventListener('click', function () {
        currentGroupId = group.id;
        currentBrandName = group.brands[0].name;
        renderTabs();
        renderBrands();
        renderDetail();
      });
      wrap.appendChild(tab);
    });
  }

  /* ---- 渲染：品牌列表 ---- */
  function renderBrands() {
    const group = WATCH_GROUPS.find(function (g) { return g.id === currentGroupId; });
    const hint = document.getElementById('groupHint');
    hint.textContent = group.subtitle + '（' + group.brands.length + ' 个品牌）';

    const grid = document.getElementById('brandGrid');
    grid.innerHTML = '';
    group.brands.forEach(function (brand) {
      const item = el('button', 'brand-chip');
      item.type = 'button';
      item.setAttribute('role', 'listitem');
      if (brand.name === currentBrandName) item.classList.add('is-active');

      const dot = el('span', 'brand-chip__dot brand-chip__dot--' + PRIMARY_META[brand.primary].cls);
      const txt = el('span', 'brand-chip__name', brand.name);
      const en = el('span', 'brand-chip__en', brand.en);
      item.appendChild(dot);
      item.appendChild(txt);
      item.appendChild(en);

      item.addEventListener('click', function () {
        currentBrandName = brand.name;
        renderBrands();
        renderDetail();
      });
      grid.appendChild(item);
    });
  }

  /* ---- 渲染：品牌详情 ---- */
  function renderDetail() {
    const card = document.getElementById('detailCard');
    const { group, brand } = findBrand(currentGroupId, currentBrandName);
    if (!card) return;
    card.innerHTML = '';
    card.classList.remove('is-empty');

    /* 头部：品牌名 + 主验证徽标 */
    const head = el('div', 'detail-card__head');
    const title = el('div', 'detail-card__title');
    const h = el('h3', '', brand.name);
    const en = el('span', 'detail-card__en', brand.en + ' · ' + brand.origin + ' · ' + brand.tier);
    title.appendChild(h);
    title.appendChild(en);
    head.appendChild(title);

    const meta = PRIMARY_META[brand.primary];
    const badge = el('span', 'verify-badge verify-badge--' + meta.cls);
    badge.appendChild(el('span', 'legend-dot legend-dot--' + meta.cls));
    badge.appendChild(el('span', '', meta.label + '：' + brand.onlineVerify));
    head.appendChild(badge);
    card.appendChild(head);

    /* 序列号查询区 */
    const qwrap = el('div', 'detail-query');
    qwrap.appendChild(el('div', 'detail-query__title', '序列号在线查询'));
    const qrow = el('div', 'detail-query__row');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'detail-query__input';
    input.placeholder = brand.verifyEntry ? '在此输入序列号 / 编号，点查询' : '该品牌不支持在线序列号查询';
    input.setAttribute('aria-label', '输入序列号');
    const btn = el('button', 'detail-query__btn', brand.verifyEntry ? '查询' : '查看验证指引');
    btn.type = 'button';
    const result = el('div', 'detail-query__result', '');
    qrow.appendChild(input);
    qrow.appendChild(btn);
    qwrap.appendChild(qrow);
    qwrap.appendChild(result);

    if (brand.onlineVerify) {
      const note = el('p', 'detail-query__note', '官方能力：' + brand.onlineVerify);
      if (brand.verifyEntryNote) {
        note.appendChild(document.createElement('br'));
        note.appendChild(el('span', '', brand.verifyEntryNote));
      }
      qwrap.appendChild(note);
    }

    function runQuery() {
      const val = input.value.trim();
      if (brand.verifyEntry) {
        if (!val) {
          result.className = 'detail-query__result is-warn';
          result.textContent = '请先在输入框填入序列号 / 编号，再点「查询」。';
          return;
        }
        result.className = 'detail-query__result is-ok';
        result.textContent = '已为你打开 ' + brand.name + ' 官方查询页，请把序列号「' + val + '」粘贴进去核验：官方能返回对应型号 / 保卡信息且一致即为正品；查不到或对不上则高度存疑。';
        window.open(brand.verifyEntry, '_blank', 'noopener');
      } else {
        result.className = 'detail-query__result is-warn';
        result.textContent = '「' + brand.name + '」官方不提供在线序列号真伪查询，序列号无法在线验真。请按下方「序列号核对 + 官方送检 / 权威第三方鉴定」完成验证——这是该品牌唯一可靠的验证方式。';
      }
    }
    btn.addEventListener('click', runQuery);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') runQuery(); });
    if (!brand.verifyEntry) input.disabled = true;
    card.appendChild(qwrap);

    /* 最佳验证路径 */
    const path = el('div', 'detail-card__row');
    path.appendChild(el('div', 'row-label', '最有效验证路径'));
    path.appendChild(el('p', 'row-body', brand.bestPath));
    card.appendChild(path);

    /* 序列号核对要点 */
    const serial = el('div', 'detail-card__row');
    serial.appendChild(el('div', 'row-label', '序列号核对'));
    serial.appendChild(el('p', 'row-body', brand.serial));
    card.appendChild(serial);

    /* 官方送检渠道 */
    const svc = el('div', 'detail-card__row');
    svc.appendChild(el('div', 'row-label', '官方送检 / 服务'));
    svc.appendChild(el('p', 'row-body', brand.service));
    card.appendChild(svc);

    /* 备注 */
    if (brand.note) {
      const note = el('div', 'detail-card__row detail-card__row--note');
      note.appendChild(el('div', 'row-label', '备注'));
      note.appendChild(el('p', 'row-body', brand.note));
      card.appendChild(note);
    }
  }

  /* ---- 渲染：权威第三方机构 ---- */
  function renderAgencies() {
    const grid = document.getElementById('agencyGrid');
    grid.innerHTML = '';
    VERIFY_AGENCIES.forEach(function (ag) {
      const card = el('div', 'agency-card');
      card.appendChild(el('h3', 'agency-card__name', ag.name));
      card.appendChild(el('p', 'agency-card__desc', ag.desc));
      card.appendChild(el('p', 'agency-card__channel', '渠道：' + ag.channel));
      grid.appendChild(card);
    });
  }

  /* ---- 初始化 ---- */
  document.addEventListener('DOMContentLoaded', function () {
    renderTabs();
    renderBrands();
    renderDetail();
    renderAgencies();
  });
})();
