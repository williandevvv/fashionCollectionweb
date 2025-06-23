(async function() {
  const container = document.getElementById('categories');
  if (!container) return;
  try {
    const res = await fetch('/api/categories');
    const categories = await res.json();
    container.innerHTML = categories.map(cat => `
      <div class="col-md-6 col-lg-4">
        <a href="${cat.link}" class="category-card d-block" style="background-image: url(${cat.image})">
          <div class="category-overlay">
            <h3 class="h4 fw-bold mb-2">${cat.name}</h3>
            <p class="mb-0">${cat.count} productos</p>
          </div>
        </a>
      </div>
    `).join('');
    document.dispatchEvent(new Event('categoriesLoaded'));
  } catch (err) {
    console.error('Error cargando categorias', err);
  }
})();
