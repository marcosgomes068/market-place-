document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    const categoriesLink = document.getElementById('categories-link');
    if (categoriesLink) {
        categoriesLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            window.location.href = `/products.html?category=${category}`;
        });
    });
    
    displayProducts();
    
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            displayProducts();
        });
    }
    
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('submit', (e) => {
            e.preventDefault();
            displayProducts();
        });
    }
});

function handleSearch(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search').value;
    if (searchTerm.trim()) {
        window.location.href = `/products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

async function getProducts(filters = {}) {
    try {
        let url = `${API_URL}/products`;
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Falha ao carregar produtos');
        }
        
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getProductDetails(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Falha ao carregar detalhes do produto');
        }
        
        const data = await response.json();
        return data.product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

async function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    showSpinner();
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const category = urlParams.get('category');
    
    const minPrice = document.getElementById('min-price')?.value;
    const maxPrice = document.getElementById('max-price')?.value;
    const sortBy = document.getElementById('sort')?.value;
    
    const products = await getProducts({
        search: searchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy
    });
    
    hideSpinner();
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        if (category) {
            pageTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
        } else if (searchTerm) {
            pageTitle.textContent = `Resultados para: ${searchTerm}`;
        }
    }
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado</p>';
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.images && product.images.length > 0 ? product.images[0] : '/images/no-image.jpg'}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">
                    ${product.discountPrice > 0 ? 
                        `<span class="original-price">R$ ${product.price.toFixed(2)}</span> 
                         <span class="discount-price">R$ ${product.discountPrice.toFixed(2)}</span>` : 
                        `<span>R$ ${product.price.toFixed(2)}</span>`
                    }
                </p>
                <div class="product-actions">
                    <a href="/product-details.html?id=${product.id || product._id}" class="btn view-btn">Ver Detalhes</a>
                    <button class="btn add-to-cart-btn" data-id="${product.id || product._id}" data-title="${product.title}" data-price="${product.discountPrice > 0 ? product.discountPrice : product.price}" data-image="${product.images && product.images.length > 0 ? product.images[0] : '/images/no-image.jpg'}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            addToCart({
                id: button.getAttribute('data-id'),
                title: button.getAttribute('data-title'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image')
            });
        });
    });
}
