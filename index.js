// Initial Product Data 
const products = [
    { id: 1, name: "Adidas", price: 2500.00, image: 'assest/Adidas.jpg', description: "Stylish and comfortable running shoes for all-day wear. Perfect blend of performance and street style." },
    { id: 2, name: "Puma", price: 1500.50, image: 'assest/Puma.jpg', description: "Lightweight trainers designed for agility and speed. Excellent choice for gym workouts and short runs." },
    { id: 3, name: "Nike", price: 3000.99, image: 'assest/Nike.jpg', description: "Premium basketball sneakers with maximum support and cushioning. The gold standard in athletic footwear." },
    { id: 4, name: "Reebok", price: 2599.00, image: 'assest/Reebok.jpg', description: "Classic cross-training shoe, built for durability and stability in various activities." },
    { id: 5, name: "Asics", price: 2599.00, image: 'assest/Asics.jpg', description: "Gel-cushioned running shoes known for superior shock absorption and long-distance comfort." },
    { id: 6, name: "Anime", price: 1999.00, image: 'assest/Anime.webp', description: "Unique, custom-designed lifestyle sneakers featuring vibrant anime artwork. Stand out from the crowd!" },
];

// Cart State and DOM Elements
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-value');
const productsContainer = document.getElementById('products-container');

// NEW MODAL ELEMENTS
const productModal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-btn');

// Helper function for currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// --- Core Logic Functions ---

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function getProductById(id) {
    const productId = parseInt(id);
    return products.find(product => product.id === productId);
}

// ----------------------------------------------------
// QUANTITY MANAGEMENT FUNCTIONS (These must be present)
// ----------------------------------------------------

function increaseQuantity(id) {
    const productId = parseInt(id);
    const product = getProductById(productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    updateCartDisplay();
}

function decreaseQuantity(id) {
    const cartItemIndex = cart.findIndex(item => item.id === parseInt(id));

    if (cartItemIndex > -1) {
        const item = cart[cartItemIndex];
        
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(cartItemIndex, 1);
        }
    }
    updateCartDisplay();
}

function deleteItemFromCart(id) {
    cart = cart.filter(item => item.id !== parseInt(id));
    updateCartDisplay();
}

// ----------------------------------------------------
// DISPLAY FUNCTIONS
// ----------------------------------------------------

function updateCartDisplay() {
    // 1. Update Product Listing Prices and Images (Run only once on load)
    if (!productsContainer.dataset.pricesFormatted) {
        products.forEach(product => {
            const productCard = productsContainer.querySelector(`[data-id="${product.id}"]`);
            if (productCard) {
                const priceElement = productCard.querySelector('.price');
                priceElement.textContent = formatCurrency(product.price);
                productCard.insertAdjacentHTML('afterbegin', `<img src="${product.image}" alt="${product.name}" class="product-image">`);
            }
        });
        productsContainer.dataset.pricesFormatted = 'true';
    }

    // 2. Update Cart Items and Total
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li class="empty-message">Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const productDetails = getProductById(item.id);
            if (!productDetails) return; 

            total += item.price * item.quantity;

            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            
            listItem.innerHTML = `
                <img src="${productDetails.image}" alt="${item.name}" class="cart-item-image"> 
                <div class="cart-item-info">
                    ${item.name} 
                    <p class="item-quantity">(${formatCurrency(item.price)} x ${item.quantity})</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease-btn" data-id="${item.id}">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="increase-btn" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">X</button> 
            `;
            
            cartItemsContainer.appendChild(listItem);
        });
    }

    cartTotalElement.textContent = formatCurrency(total);
    
    // CRITICAL: Re-attach listeners after rebuilding the cart HTML
    attachQuantityEventListeners();
    attachDeleteEventListeners(); 
    saveCart();
}

function showProductDetails(id) {
    const product = getProductById(id);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="modal-detail-content">
            <img src="${product.image}" alt="${product.name}" class="modal-product-image">
            <div class="modal-text">
                <h2>${product.name}</h2>
                <p class="modal-price">Price: ${formatCurrency(product.price)}</p>
                <p class="modal-description">${product.description}</p>
                <button class="add-btn modal-add-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    // Re-attach listener to the 'Add to Cart' button inside the modal
    const modalAddBtn = modalBody.querySelector('.modal-add-btn');
    modalAddBtn.addEventListener('click', (event) => {
        const productId = event.target.dataset.id;
        increaseQuantity(productId);
        productModal.style.display = 'none'; // Close modal after adding to cart
    });

    productModal.style.display = 'block';
}

// ----------------------------------------------------
// EVENT LISTENER ATTACHMENT FUNCTIONS
// ----------------------------------------------------

function attachAddEventListeners() {
    const productCards = productsContainer.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const addButton = card.querySelector('.add-btn');
        const productId = card.dataset.id;

        // 1. Listener for the 'Add to Cart' button 
        addButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the card click listener from firing
            increaseQuantity(productId); 
        });
        
        // 2. Listener for the entire card (Excluding the button)
        card.addEventListener('click', () => {
            showProductDetails(productId); 
        });
    });
}

function attachQuantityEventListeners() {
    const increaseButtons = cartItemsContainer.querySelectorAll('.increase-btn');
    const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease-btn');
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            increaseQuantity(productId);
        });
    });
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            decreaseQuantity(productId);
        });
    });
}

function attachDeleteEventListeners() {
    const deleteButtons = cartItemsContainer.querySelectorAll('.remove-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            deleteItemFromCart(productId);
        });
    });
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    attachAddEventListeners();
    
    // Modal close listeners
    closeModalBtn.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`Checking out with a total of ${cartTotalElement.textContent}. Thank you for your purchase!`);
            cart = [];
            updateCartDisplay();
        } else {
            alert('Your cart is empty. Add some items first!');
        }
    });
});