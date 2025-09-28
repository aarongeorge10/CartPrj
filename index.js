// Initial Product Data (Expanded to include all 8 items and the description field)
const products = [
    { id: 1, name: "Adidas", price: 2500.00, image: 'assest/Adidas.jpg', description: "Stylish and comfortable running shoes for all-day wear. Perfect blend of performance and street style." },
    { id: 2, name: "Puma", price: 1500.50, image: 'assest/Puma.jpg', description: "Lightweight trainers designed for agility and speed. Excellent choice for gym workouts and short runs." },
    { id: 3, name: "Nike", price: 3000.99, image: 'assest/Nike.jpg', description: "Premium basketball sneakers with maximum support and cushioning. The gold standard in athletic footwear." },
    { id: 4, name: "Reebok", price: 2599.00, image: 'assest/Reebok.jpg', description: "Classic cross-training shoe, built for durability and stability in various activities." },
    { id: 5, name: "Asics", price: 1599.00, image: 'assest/Asics.jpg', description: "Gel-cushioned running shoes known for superior shock absorption and long-distance comfort." },
    { id: 6, name: "Anime", price: 1999.00, image: 'assest/Anime.webp', description: "Unique, custom-designed lifestyle sneakers featuring vibrant anime artwork. Stand out from the crowd!" },
    { id: 7, name: "HRX", price: 2799.00, image: 'assest/HRX.webp', description: "A pair of off white shoes, has regular Styling, lace-ups detail Upper Cushioned footbed Textured and patterned outsole" },
    { id: 8, name: "Asian", price: 2809.00, image: 'assest/Asian.webp', description: "ASIAN Men THUNDER-07 Stylish Casual Mid Top Sneaker and Trendy Shoes with Laces for Men & Boys, Perfect, College, Parties and Outings, Lightweight, Comfortable, and Durable for All-Day Use" },
    { id: 9, name: "Bacca Bucci", price: 3809.00, image: 'assest/Bacca.jpg', description: "TRUE STREET STYLE CHUNKY DESIGN | FUNCTIONAL HI-TOP SNEAKERS | ANTI-COLLISION TOE & SHOCKING | NON-SLIP & BREATHABILITY | GOES WITH ALL DRESSES." },
    { id: 10, name: "Sparxs", price: 1409.00, image: 'assest/sparx.jpg', description: "Light up your style quotient with these trendy shoes from Sparx. Cushioned insole makes it very comfortable to wear all day long." },
];

// Global DOM Elements
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-value');
const productsContainer = document.getElementById('products-container');
const cartAside = document.getElementById('cart-aside'); // Assuming you add id="cart-aside"
const cartToggleButton = document.getElementById('cart-toggle-btn');


// Helper function for currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function getProductById(id) {
    const productId = parseInt(id);
    return products.find(product => product.id === productId);
}

// ----------------------------------------------------
// QUANTITY MANAGEMENT FUNCTIONS
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

function addMultipleToCart(id, quantity) {
    const productId = parseInt(id);
    const product = getProductById(productId);

    if (!product) return;
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    updateCartDisplay();
}


// ----------------------------------------------------
// DISPLAY FUNCTIONS
// ----------------------------------------------------

function updateCartDisplay() {
    // This function runs on both index.html (product listing) and product.html (single view)

    // 1. Update Product Listing Prices and Images (Only runs if productsContainer exists, i.e., on index.html)
    if (productsContainer && !productsContainer.dataset.pricesFormatted) {
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

    // 2. Update Cart Items and Total (Only runs if cartItemsContainer exists, i.e., on both pages)
    if (cartItemsContainer) {
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
    }
    saveCart();
}

// ----------------------------------------------------
// EVENT LISTENER ATTACHMENT FUNCTIONS
// ----------------------------------------------------

function attachAddEventListeners() {
    // Only runs on index.html
    if (productsContainer) {
        const productCards = productsContainer.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const addButton = card.querySelector('.add-btn');
            const productId = card.dataset.id;

            // 1. Listener for the 'Add to Cart' button 
            addButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents card click listener from firing
                increaseQuantity(productId);
            });

            // 2. Listener for the entire card now links to the product page
            card.addEventListener('click', () => {
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }
}

function attachQuantityEventListeners() {
    // Only runs if the cart is present on the page
    if (cartItemsContainer) {
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
}

function attachDeleteEventListeners() {
    // Only runs if the cart is present on the page
    if (cartItemsContainer) {
        const deleteButtons = cartItemsContainer.querySelectorAll('.remove-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                deleteItemFromCart(productId);
            });
        });
    }
}

function toggleCartVisibility() {
    if (cartAside) {
        cartAside.classList.toggle('hidden');
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    attachAddEventListeners(); // Only attaches listeners if productsContainer exists (index.html)

    // Attach listener for the cart icon toggle (present on both pages)
    if (cartToggleButton) {
        cartToggleButton.addEventListener('click', toggleCartVisibility);
    }

    // Checkout button listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`Checking out with a total of ${cartTotalElement.textContent}. Thank you for your purchase!`);
                cart = [];
                updateCartDisplay();
            } else {
                alert('Your cart is empty. Add some items first!');
            }
        });
    }
});