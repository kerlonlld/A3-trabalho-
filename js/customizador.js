/* ============================================================
   UNIQ — customizador.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initColorSelector();
  initSizeSelector();
  initQuantity();
  initArtUpload();
  initTabsNav();
  initShipping();
  initWishlist();
  initAddToCart();
});

/* ─── Gallery ─── */
const galleryImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=85&fit=crop',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=700&q=85&fit=crop',
  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=700&q=85&fit=crop',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700&q=85&fit=crop',
];
const mockupByColor = {
  branca:   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=85&fit=crop',
  preta:    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=85&fit=crop',
  cinza:    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=85&fit=crop',
  azul:     'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=85&fit=crop',
  verde:    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=85&fit=crop',
  vermelha: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=85&fit=crop',
  amarela:  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=85&fit=crop',
  rosa:     'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=85&fit=crop',
};

function initGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const idx = parseInt(thumb.dataset.idx);
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = galleryImages[idx];
        mainImg.style.opacity = '1';
      }, 150);
    });
  });
  mainImg.style.transition = 'opacity 0.15s ease';
}

/* ─── Color selector ─── */
let selectedColor = 'branca';

function initColorSelector() {
  const mockupImg = document.getElementById('mockup-img');
  const colorName = document.getElementById('selected-color-name');

  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      selectedColor = sw.dataset.color;
      colorName.textContent = sw.dataset.name;

      // Update mockup
      if (mockupImg && mockupByColor[selectedColor]) {
        mockupImg.style.opacity = '0.5';
        mockupImg.style.transition = 'opacity 0.2s';
        setTimeout(() => {
          mockupImg.src = mockupByColor[selectedColor];
          mockupImg.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/* ─── Size selector ─── */
let selectedSize = '';

function initSizeSelector() {
  const sizeName = document.getElementById('selected-size-name');
  document.querySelectorAll('.size-btn:not(.unavailable)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      if (sizeName) sizeName.textContent = selectedSize;
    });
  });
}

/* ─── Quantity ─── */
function initQuantity() {
  const input = document.getElementById('qty-input');
  const minus = document.getElementById('qty-minus');
  const plus  = document.getElementById('qty-plus');
  if (!input) return;

  minus.addEventListener('click', () => {
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
  });
  plus.addEventListener('click', () => {
    if (parseInt(input.value) < 99) input.value = parseInt(input.value) + 1;
  });
}

/* ─── Add to cart ─── */
function initAddToCart() {
  const btn = document.getElementById('add-to-cart');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!selectedSize) {
      showToast('Selecione um tamanho antes de continuar!', 'error');
      // Highlight size selector
      document.querySelector('.size-selector').style.outline = '2px solid var(--error)';
      setTimeout(() => document.querySelector('.size-selector').style.outline = '', 2000);
      return;
    }

    const qty = parseInt(document.getElementById('qty-input').value);
    addToCart({
      id: 1,
      name: 'Básica Premium UNIQ',
      price: 59.90,
      color: selectedColor,
      size: selectedSize,
      qty,
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=70&fit=crop'
    });

    // Button feedback
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado!';
    btn.style.background = 'var(--success)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Adicionar ao Carrinho';
      btn.style.background = '';
    }, 2000);
  });
}

/* ─── Wishlist toggle ─── */
function initWishlist() {
  const btn = document.getElementById('wishlist-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    btn.style.color = icon.classList.contains('fa-solid') ? 'var(--error)' : '';
    showToast(icon.classList.contains('fa-solid') ? 'Adicionado aos favoritos!' : 'Removido dos favoritos', 'info');
  });
}

/* ─── Art Upload & Drag ─── */
function initArtUpload() {
  const fileInput  = document.getElementById('art-upload');
  const artOverlay = document.getElementById('art-overlay');
  const artImg     = document.getElementById('art-img');
  const deleteBtn  = document.getElementById('art-delete');
  const printZone  = document.getElementById('print-zone');

  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Arquivo muito grande! Máximo 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      artImg.src = ev.target.result;
      artOverlay.classList.remove('hidden');
      artOverlay.style.left = '50%';
      artOverlay.style.top  = '50%';
      artOverlay.style.transform = 'translate(-50%, -50%)';
      showToast('Arte carregada! Arraste para posicionar.', 'success');
    };
    reader.readAsDataURL(file);
  });

  // Delete art
  deleteBtn.addEventListener('click', () => {
    artOverlay.classList.add('hidden');
    artImg.src = '';
    fileInput.value = '';
  });

  // Drag & Drop inside mockup
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  artOverlay.addEventListener('mousedown', (e) => {
    if (e.target === deleteBtn || e.target.closest('.art-ctrl-btn')) return;
    isDragging = true;
    const rect = printZone.getBoundingClientRect();
    const artRect = artOverlay.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    startLeft = artRect.left - rect.left + artRect.width / 2;
    startTop  = artRect.top  - rect.top  + artRect.height / 2;

    artOverlay.style.transform = 'none';
    artOverlay.style.left = startLeft + 'px';
    artOverlay.style.top  = startTop  + 'px';

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    artOverlay.style.left = (startLeft + dx) + 'px';
    artOverlay.style.top  = (startTop  + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  artOverlay.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isDragging = true;
    const rect = printZone.getBoundingClientRect();
    const artRect = artOverlay.getBoundingClientRect();
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = artRect.left - rect.left + artRect.width / 2;
    startTop  = artRect.top  - rect.top  + artRect.height / 2;
    artOverlay.style.transform = 'none';
    artOverlay.style.left = startLeft + 'px';
    artOverlay.style.top  = startTop  + 'px';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    artOverlay.style.left = (startLeft + dx) + 'px';
    artOverlay.style.top  = (startTop  + dy) + 'px';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', () => { isDragging = false; });

  // Drag & drop file onto mockup
  const mockupArea = document.getElementById('mockup-area');
  mockupArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    mockupArea.style.outline = '3px dashed var(--accent)';
  });
  mockupArea.addEventListener('dragleave', () => {
    mockupArea.style.outline = '';
  });
  mockupArea.addEventListener('drop', (e) => {
    e.preventDefault();
    mockupArea.style.outline = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
}

/* ─── Side selector (frente/costas) ─── */
function initSideSel() {
  document.querySelectorAll('.side-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Visualizando: ${btn.dataset.side}`, 'info');
    });
  });
}

/* ─── Product tabs ─── */
function initTabsNav() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const id = 'tab-' + btn.dataset.tab;
      const panel = document.getElementById(id);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ─── Shipping ─── */
function initShipping() {
  const btn = document.getElementById('calc-frete');
  const input = document.getElementById('cep-input');
  const results = document.getElementById('shipping-results');
  if (!btn) return;

  // Auto-format CEP
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
    input.value = v;
  });

  btn.addEventListener('click', () => {
    const cep = input.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      showToast('Digite um CEP válido com 8 dígitos.', 'error');
      return;
    }
    btn.textContent = '...';
    setTimeout(() => {
      results.style.display = 'flex';
      results.style.flexDirection = 'column';
      btn.textContent = 'Calculado!';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.textContent = 'Calcular';
        btn.style.background = '';
      }, 2000);
    }, 1200);
  });
}

// Init side selector after DOM ready
initSideSel();
