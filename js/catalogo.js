/* ============================================================
   UNIQ — catalogo.js
   ============================================================ */

const products = [
  { id:1,  name:'Básica Premium Branca',    model:'basico',    color:'branca',   price:59.90, oldPrice:null,  badge:'hot',  sizes:['P','M','G','GG','XG'], img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&fit=crop' },
  { id:2,  name:'Oversized Preta',          model:'oversized', color:'preta',    price:79.90, oldPrice:99.90, badge:'sale', sizes:['M','G','GG'],          img:'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80&fit=crop' },
  { id:3,  name:'Streetwear Cinza',         model:'basico',    color:'cinza',    price:89.90, oldPrice:null,  badge:'new',  sizes:['P','M','G'],           img:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80&fit=crop' },
  { id:4,  name:'Classic Fit Azul',         model:'basico',    color:'azul',     price:54.90, oldPrice:null,  badge:null,   sizes:['P','M','G','GG'],      img:'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80&fit=crop' },
  { id:5,  name:'Oversized Verde',          model:'oversized', color:'verde',    price:84.90, oldPrice:null,  badge:'new',  sizes:['M','G','GG','XG'],     img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80&fit=crop' },
  { id:6,  name:'Cropped Vermelha',         model:'cropped',   color:'vermelha', price:69.90, oldPrice:85.00, badge:'sale', sizes:['P','M'],               img:'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80&fit=crop' },
  { id:7,  name:'Polo Premium Branca',      model:'polo',      color:'branca',   price:119.90,oldPrice:null,  badge:null,   sizes:['P','M','G','GG'],      img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80&fit=crop' },
  { id:8,  name:'Básica Preta Essencial',   model:'basico',    color:'preta',    price:52.90, oldPrice:null,  badge:'hot',  sizes:['P','M','G','GG','XG'], img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&fit=crop' },
  { id:9,  name:'Oversized Cinza London',   model:'oversized', color:'cinza',    price:94.90, oldPrice:null,  badge:'new',  sizes:['G','GG','XG'],         img:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80&fit=crop' },
  { id:10, name:'Básica Verde Sage',        model:'basico',    color:'verde',    price:57.90, oldPrice:null,  badge:null,   sizes:['P','M','G'],           img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80&fit=crop' },
  { id:11, name:'Cropped Azul Pastel',      model:'cropped',   color:'azul',     price:65.90, oldPrice:null,  badge:null,   sizes:['P','M'],               img:'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80&fit=crop' },
  { id:12, name:'Polo Azul Elite',          model:'polo',      color:'azul',     price:129.90,oldPrice:149.90,badge:'sale', sizes:['M','G','GG'],          img:'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80&fit=crop' },
];

const badgeLabels = { hot:'Mais vendido', new:'Novo', sale:'Oferta' };
const badgeClass  = { hot:'badge-hot', new:'badge-new', sale:'badge-sale' };

let activeFilters = { model: [], color: [], size: [], price: [] };
let currentView = 'grid';

// ─── Render ───
function renderProducts() {
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('results-count');
  const sortVal = document.getElementById('sort-select').value;

  let filtered = [...products];

  // Apply filters
  if (activeFilters.model.length)
    filtered = filtered.filter(p => activeFilters.model.includes(p.model));
  if (activeFilters.color.length)
    filtered = filtered.filter(p => activeFilters.color.includes(p.color));
  if (activeFilters.size.length)
    filtered = filtered.filter(p => p.sizes.some(s => activeFilters.size.includes(s)));
  if (activeFilters.price.length) {
    filtered = filtered.filter(p => activeFilters.price.some(range => {
      const [min, max] = range.split('-').map(v => v === '+' ? Infinity : Number(v));
      return p.price >= min && p.price <= (max || Infinity);
    }));
  }

  // Sort
  if (sortVal === 'price-asc')   filtered.sort((a,b) => a.price - b.price);
  if (sortVal === 'price-desc')  filtered.sort((a,b) => b.price - a.price);
  if (sortVal === 'new')         filtered.sort((a,b) => (b.badge==='new'?1:0) - (a.badge==='new'?1:0));

  count.textContent = `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(p => `
    <div class="product-card fade-in" data-id="${p.id}">
      <div class="product-card-image">
        ${p.badge ? `<span class="product-badge ${badgeClass[p.badge]}">${badgeLabels[p.badge]}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="product-card-wishlist" title="Favoritar"><i class="fa-regular fa-heart"></i></button>
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-desc" style="text-transform:capitalize">${p.model} · ${p.color}</div>
        <div class="product-card-footer">
          <div>
            ${p.oldPrice ? `<span class="product-price-old">${formatBRL(p.oldPrice)}</span>` : ''}
            <span class="product-price">${formatBRL(p.price)}</span>
          </div>
          <a href="produto.html" class="product-card-btn" title="Personalizar">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // Wishlist
  grid.querySelectorAll('.product-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      btn.style.color = icon.classList.contains('fa-solid') ? 'var(--error)' : '';
      showToast(icon.classList.contains('fa-solid') ? 'Adicionado aos favoritos!' : 'Removido dos favoritos', 'info');
    });
  });

  // Add to cart quick
  grid.querySelectorAll('.product-card-btn').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const p = filtered[i];
      addToCart({ id: p.id, name: p.name, price: p.price, color: p.color, size: p.sizes[0], img: p.img });
    });
  });

  setTimeout(() => initFadeIn(), 50);
}

// ─── Active filter chips ───
function renderActiveFilters() {
  const container = document.getElementById('active-filters');
  const chips = [];
  Object.entries(activeFilters).forEach(([key, vals]) => {
    vals.forEach(val => {
      chips.push(`
        <span class="active-filter-chip">
          ${val}
          <button onclick="removeFilter('${key}','${val}')">×</button>
        </span>
      `);
    });
  });
  container.innerHTML = chips.join('');
}

function removeFilter(key, val) {
  activeFilters[key] = activeFilters[key].filter(v => v !== val);

  // Uncheck UI
  document.querySelectorAll(`[data-filter="${key}"]`).forEach(el => {
    if ((el.value || el.dataset.value) === val) {
      el.checked = false;
      el.classList.remove('active');
    }
  });

  renderActiveFilters();
  renderProducts();
}

function clearAllFilters() {
  activeFilters = { model:[], color:[], size:[], price:[] };
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.checked = false;
    el.classList.remove('active');
  });
  renderActiveFilters();
  renderProducts();
}

// ─── Filter event listeners ───
document.querySelectorAll('input[data-filter]').forEach(input => {
  input.addEventListener('change', () => {
    const key = input.dataset.filter;
    const val = input.value;
    if (input.checked) {
      if (!activeFilters[key].includes(val)) activeFilters[key].push(val);
    } else {
      activeFilters[key] = activeFilters[key].filter(v => v !== val);
    }
    renderActiveFilters();
    renderProducts();
  });
});

document.querySelectorAll('.filter-swatch').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      if (!activeFilters.color.includes(val)) activeFilters.color.push(val);
    } else {
      activeFilters.color = activeFilters.color.filter(v => v !== val);
    }
    renderActiveFilters();
    renderProducts();
  });
});

document.querySelectorAll('.filter-size').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      if (!activeFilters.size.includes(val)) activeFilters.size.push(val);
    } else {
      activeFilters.size = activeFilters.size.filter(v => v !== val);
    }
    renderActiveFilters();
    renderProducts();
  });
});

document.getElementById('clear-filters').addEventListener('click', clearAllFilters);
document.getElementById('clear-filters-empty')?.addEventListener('click', clearAllFilters);
document.getElementById('sort-select').addEventListener('change', renderProducts);

// ─── Collapsible filter groups ───
document.querySelectorAll('.filter-group-header').forEach(header => {
  header.addEventListener('click', () => {
    header.closest('.filter-group').classList.toggle('collapsed');
  });
});

// ─── View toggle ───
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    const grid = document.getElementById('catalog-grid');
    grid.classList.toggle('list-view', currentView === 'list');
  });
});

// ─── Init ───
renderProducts();
