// Variables globales
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    renderCategories();
    renderProducts();
    updateCartCount();
});

// Función para inicializar el tema
function initTheme() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        updateThemeButton(true);
    }
    
    // Alternar tema
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeButton(isDark);
    });
}

// Actualizar botón de tema
function updateThemeButton(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    if (isDark) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Modo Oscuro</span>';
    }
}

// Renderizar categorías
function renderCategories() {
    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';
    
    database.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn' + (category.id === 'all' ? ' active' : '');
        button.textContent = category.name;
        button.onclick = () => filterProducts(category.id);
        container.appendChild(button);
    });
}

// Renderizar productos
function renderProducts() {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';
    
    database.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.dataset.name = product.name.toLowerCase();
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${product.price > 0 ? `<div class="price">$${product.price} CUP</div>` : ''}
                <button class="details-button" ${product.disabled ? 'disabled' : ''} onclick="openModal('${product.id}')">
                    ${product.disabled ? 'Próximamente' : 'Más detalles'}
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Función para filtrar productos por categoría
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.category-btn');
    
    // Actualizar botones activos
    buttons.forEach(btn => {
        if(btn.textContent.toLowerCase() === database.categories.find(c => c.id === category).name.toLowerCase() || 
           (category === 'all' && btn.textContent === 'Todos')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mostrar/ocultar productos
    products.forEach(product => {
        if(category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Función para buscar productos
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.dataset.name;
        if(productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Permitir búsqueda al presionar Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        searchProducts();
    }
});

// Funciones para el modal de detalles
function openModal(productId) {
    const modal = document.getElementById('productModal');
    currentProduct = database.products.find(p => p.id === productId);
    
    if (!currentProduct) return;
    
    document.getElementById('modalProductTitle').textContent = currentProduct.name;
    setupProductOptions();
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function setupProductOptions() {
    const optionsContainer = document.getElementById('productOptions');
    optionsContainer.innerHTML = '';
    
    // Agregar opciones del producto
    if (currentProduct.options) {
        for (const [optionName, options] of Object.entries(currentProduct.options)) {
            const optionGroup = document.createElement('div');
            optionGroup.className = 'option-group';
            
            const optionTitle = document.createElement('h4');
            optionTitle.textContent = optionName.charAt(0).toUpperCase() + optionName.slice(1);
            optionGroup.appendChild(optionTitle);
            
            options.forEach((option, index) => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                
                const optionId = `${currentProduct.id}-${optionName}-${option.id}`;
                
                optionItem.innerHTML = `
                    <label>
                        <input type="radio" name="${optionName}" value="${option.id}" 
                            ${index === 0 ? 'checked' : ''} 
                            data-price="${option.price}">
                        ${option.name}
                    </label>
                    ${option.price > 0 ? `<span class="option-price">+$${option.price} CUP</span>` : ''}
                `;
                
                optionGroup.appendChild(optionItem);
            });
            
            optionsContainer.appendChild(optionGroup);
        }
    }
    
    // Agregar selector de cantidad
    const quantityGroup = document.createElement('div');
    quantityGroup.className = 'option-group';
    
    quantityGroup.innerHTML = `
        <h4>Cantidad</h4>
        <div class="quantity-selector">
            <button onclick="decreaseQuantity()">-</button>
            <input type="number" id="productQuantity" value="1" min="1">
            <button onclick="increaseQuantity()">+</button>
        </div>
    `;
    optionsContainer.appendChild(quantityGroup);
    
    // Agregar campo de notas
    const notesGroup = document.createElement('div');
    notesGroup.className = 'option-group';
    
    notesGroup.innerHTML = `
        <h4>Notas especiales</h4>
        <textarea id="specialNotes" rows="3" style="width: 100%; padding: 10px;" placeholder="Alguna indicación especial..."></textarea>
    `;
    optionsContainer.appendChild(notesGroup);
    
    // Agregar total y botón
    const totalPrice = document.createElement('div');
    totalPrice.className = 'total-price';
    
    totalPrice.innerHTML = `
        <h4>Total: <span id="modalTotalPrice">$${currentProduct.price} CUP</span></h4>
    `;
    optionsContainer.appendChild(totalPrice);
    
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart-modal';
    addButton.textContent = 'Agregar al carrito';
    addButton.onclick = addToCart;
    optionsContainer.appendChild(addButton);
    
    // Actualizar precio cuando cambian las opciones
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', updateTotalPrice);
    });
}

function increaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateTotalPrice();
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    if(parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateTotalPrice();
    }
}

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    let total = currentProduct.price * quantity;
    
    // Sumar extras según las opciones seleccionadas
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        total += parseInt(radio.dataset.price) * quantity;
    });
    
    document.getElementById('modalTotalPrice').textContent = `$${total} CUP`;
}

function addToCart() {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const notes = document.getElementById('specialNotes').value;
    
    // Obtener opciones seleccionadas
    const selectedOptions = {};
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.checked) {
            const optionName = radio.name;
            const optionValue = radio.value;
            const optionPrice = parseInt(radio.dataset.price);
            
            selectedOptions[optionName] = {
                value: optionValue,
                price: optionPrice
            };
        }
    });
    
    // Calcular precio total con extras
    let totalPrice = currentProduct.price * quantity;
    Object.values(selectedOptions).forEach(option => {
        totalPrice += option.price * quantity;
    });
    
    // Crear objeto del producto para el carrito
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        quantity: quantity,
        unitPrice: currentProduct.price,
        options: selectedOptions,
        totalPrice: totalPrice,
        notes: notes
    };
    
    // Agregar al carrito
    cart.push(cartItem);
    saveCart();
    updateCartCount();
    renderCartItems();
    
    alert(`${quantity} ${currentProduct.name} han sido agregados al carrito`);
    closeModal();
}

// Funciones del carrito
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    
    if (cartModal.style.display === 'block') {
        renderCartItems();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('cartTotalPrice');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Tu carrito está vacío</p>';
        totalPriceElement.textContent = '$0 CUP';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        totalPrice += item.totalPrice;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Construir detalles de las opciones
        let optionsText = '';
        if (item.options) {
            optionsText = Object.entries(item.options).map(([key, value]) => {
                return `${key}: ${value.value}`;
            }).join(', ');
        }
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} x${item.quantity}</div>
                ${optionsText ? `<div class="cart-item-details">${optionsText}</div>` : ''}
                ${item.notes ? `<div class="cart-item-details">Notas: ${item.notes}</div>` : ''}
            </div>
            <div class="cart-item-price">$${item.totalPrice} CUP</div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        container.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = `$${totalPrice} CUP`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí puedes implementar la lógica para finalizar la compra
    // Por ejemplo, enviar los datos a un servidor o mostrar un resumen
    
    // Ejemplo: Mostrar resumen en consola
    console.log('Resumen del pedido:');
    console.table(cart);
    
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    alert(`Pedido realizado con éxito! Total: $${total} CUP\n\nGracias por tu compra.`);
    
    // Limpiar carrito después de la compra
    cart = [];
    saveCart();
    updateCartCount();
    renderCartItems();
    toggleCart();
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if(event.target == modal) {
        closeModal();
    }
    
    const cartModal = document.getElementById('cartModal');
    if(event.target == cartModal) {
        cartModal.style.display = 'none';
    }
}
