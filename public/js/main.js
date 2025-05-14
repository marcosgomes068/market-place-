let currentUser = null;
const API_URL = '/api';

const menuToggle = document.getElementById('menu-toggle');
const navList = document.querySelector('.nav-list');
const userDropdown = document.getElementById('user-dropdown');

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (menuToggle && !menuToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
        }
    });
    
    const userMenuToggle = document.getElementById('user-menu-toggle');
    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', () => {
            if (userDropdown) {
                userDropdown.classList.toggle('active');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (userMenuToggle && userDropdown && !userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    initProductDetailsPage();
});

function checkAuthState() {
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');
    
    if (token && userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            currentUser = userData;
            
            updateAuthUI(true, userData);
        } catch (error) {
            console.error('Failed to parse user data', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            updateAuthUI(false);
        }
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isAuthenticated, userData = null) {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const sellerDashboardLink = document.getElementById('seller-dashboard-link');
    const adminDashboardLink = document.getElementById('admin-dashboard-link');
    
    if (authLinks && userInfo) {
        if (isAuthenticated) {
            authLinks.classList.add('hidden');
            userInfo.classList.remove('hidden');
            
            const userNameElement = document.getElementById('user-name');
            if (userNameElement && userData) {
                userNameElement.textContent = userData.name;
            }
            
            if (sellerDashboardLink && adminDashboardLink) {
                if (userData.role === 'admin') {
                    adminDashboardLink.classList.remove('hidden');
                    sellerDashboardLink.classList.remove('hidden');
                } else if (userData.role === 'seller') {
                    sellerDashboardLink.classList.remove('hidden');
                    adminDashboardLink.classList.add('hidden');
                } else {
                    sellerDashboardLink.classList.add('hidden');
                    adminDashboardLink.classList.add('hidden');
                }
            }
        } else {
            authLinks.classList.remove('hidden');
            userInfo.classList.add('hidden');
            
            if (sellerDashboardLink) sellerDashboardLink.classList.add('hidden');
            if (adminDashboardLink) adminDashboardLink.classList.add('hidden');
        }
    }
}

function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

function getUserData() {
    const userDataString = localStorage.getItem('user');
    return userDataString ? JSON.parse(userDataString) : null;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        const newNotification = document.createElement('div');
        newNotification.id = 'notification';
        newNotification.className = `notification ${type}`;
        document.body.appendChild(newNotification);
        
        setTimeout(() => {
            newNotification.remove();
        }, 3000);
        
        newNotification.textContent = message;
        
        setTimeout(() => {
            newNotification.classList.add('show');
        }, 10);
    } else {
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function showSpinner() {
    let spinner = document.getElementById('spinner');
    
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.className = 'spinner';
        spinner.innerHTML = '<div class="spinner-border"></div>';
        document.body.appendChild(spinner);
    }
    
    spinner.classList.add('show');
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('show');
    }
}

async function initProductDetailsPage() {
    const productDetails = document.getElementById('product-details');
    if (!productDetails) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = '/';
        return;
    }
    
    showSpinner();
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        
        const data = await response.json();
        const product = data.product;
        
        document.title = `${product.title} - Marketplace`;
        
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.getElementById('product-thumbnails');
        
        if (mainImage) {
            mainImage.src = product.images && product.images.length > 0 ? product.images[0] : '/images/no-image.jpg';
            mainImage.alt = product.title;
        }
        
        if (thumbnails && product.images && product.images.length > 0) {
            thumbnails.innerHTML = product.images.map((img, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}">
                    <img src="${img}" alt="${product.title} - Imagem ${index + 1}" data-index="${index}">
                </div>
            `).join('');
            
            document.querySelectorAll('.thumbnail img').forEach(img => {
                img.addEventListener('click', (e) => {
                    const src = e.target.src;
                    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    e.target.parentElement.classList.add('active');
                    mainImage.src = src;
                });
            });
        }
        
        document.getElementById('product-title').textContent = product.title;
        
        if (product.discountPrice > 0) {
            document.getElementById('product-price').innerHTML = `
                <span class="original-price">R$ ${product.price.toFixed(2)}</span>
                <span class="discount-price">R$ ${product.discountPrice.toFixed(2)}</span>
            `;
        } else {
            document.getElementById('product-price').textContent = `R$ ${product.price.toFixed(2)}`;
        }
        
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-category').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        document.getElementById('product-stock').textContent = product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque';
        
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const buyNowBtn = document.getElementById('buy-now-btn');
        
        if (product.stock > 0) {
            addToCartBtn.disabled = false;
            buyNowBtn.disabled = false;
            
            addToCartBtn.addEventListener('click', () => {
                addToCart(product);
            });
            
            buyNowBtn.addEventListener('click', () => {
                addToCart(product);
                setTimeout(() => {
                    window.location.href = '/cart.html';
                }, 1000);
            });
        } else {
            addToCartBtn.disabled = true;
            buyNowBtn.disabled = true;
        }
        
        hideSpinner();
    } catch (error) {
        console.error('Error loading product details:', error);
        hideSpinner();
        showNotification('Erro ao carregar detalhes do produto', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            addToCart({
                id: button.getAttribute('data-id'),
                title: button.getAttribute('data-title'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image')
            });
        });
    });
});
