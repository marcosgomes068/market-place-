document.addEventListener('DOMContentLoaded', () => {
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/cart.html';
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        displayCartItems();
    }

    const quantityInputs = document.querySelectorAll('.quantity-input');
    if (quantityInputs) {
        quantityInputs.forEach(input => {
            input.addEventListener('change', updateCartItem);
        });
    }
});

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCounter();
}

function addToCart(product) {
    const cart = getCart();
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image || product.images[0],
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    
    displayCartItems();
    updateCartTotal();
    showNotification('Produto removido do carrinho!');
}

function updateCartItem(event) {
    const input = event.target;
    const productId = input.getAttribute('data-id');
    const quantity = parseInt(input.value);
    
    if (quantity < 1) {
        input.value = 1;
        return;
    }
    
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
        saveCart(cart);
        updateCartTotal();
    }
}

function updateCartCounter() {
    const cart = getCart();
    const counter = document.getElementById('cart-counter');
    
    if (counter) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        counter.textContent = totalItems;
        
        if (totalItems > 0) {
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
}

function displayCartItems() {
    const cartItems = getCart();
    const container = document.getElementById('cart-items');
    
    if (!container) return;
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        document.getElementById('checkout-section').classList.add('hidden');
        return;
    }
    
    document.getElementById('checkout-section').classList.remove('hidden');
    
    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" id="cart-item-${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button type="button" class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                        <button type="button" class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button type="button" class="remove-btn" data-id="${item.id}">Remover</button>
                </div>
            </div>
            <p class="cart-item-subtotal">R$ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
    
    updateCartTotal();
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            removeFromCart(button.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
            
            if (button.classList.contains('plus')) {
                input.value = parseInt(input.value) + 1;
            } else if (button.classList.contains('minus')) {
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            }
            
            input.dispatchEvent(new Event('change'));
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateCartItem);
    });
}

function updateCartTotal() {
    const cartItems = getCart();
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !taxElement || !totalElement) return;
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    taxElement.textContent = `R$ ${tax.toFixed(2)}`;
    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

function getCartSummary() {
    const cartItems = getCart();
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + tax + shipping;
    
    return {
        items: cartItems,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2)
    };
}

async function handleCheckout(event) {
    event.preventDefault();
    
    if (!isAuthenticated()) {
        showNotification('Faça login para continuar com a compra', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    
    const shippingAddress = {
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country')
    };
    
    const paymentMethod = formData.get('paymentMethod');
    
    const cart = getCartSummary();
    
    try {
        showSpinner();
        
        const response = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                orderItems: cart.items.map(item => ({
                    name: item.title,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.id
                })),
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(cart.tax),
                shippingPrice: parseFloat(cart.shipping),
                totalPrice: parseFloat(cart.total)
            })
        });
        
        hideSpinner();
        
        if (response.ok) {
            const data = await response.json();
            clearCart();
            showNotification('Pedido realizado com sucesso!');
            
            setTimeout(() => {
                window.location.href = `/order-success.html?id=${data.order._id || data.order.id}`;
            }, 1500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro ao processar pedido', 'error');
        }
    } catch (error) {
        hideSpinner();
        console.error('Checkout error:', error);
        showNotification('Erro ao processar pagamento', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
});

const buyNowButtons = document.querySelectorAll('.buy-now-btn');
if (buyNowButtons) {
    buyNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            addToCart({
                id: productId,
                title: button.getAttribute('data-title'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image')
            });
            
            setTimeout(() => {
                window.location.href = '/cart.html';
            }, 1000);
        });
    });
}
