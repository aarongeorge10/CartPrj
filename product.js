document.addEventListener('DOMContentLoaded', () => {
    // Check if we are actually on a page that needs product rendering (i.e., product.html)
    if (window.location.pathname.endsWith('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        const productDetailSection = document.querySelector('.product-detail-page'); // Target the detail section

        if (productId) {
            renderProductPage(productId);
        } else {
            // No ID is present in the URL
            if (productDetailSection) {
                productDetailSection.innerHTML = `
                    <h2>Product Selection Required</h2>
                    <p>Please select a product from the <a href="index.html">Home Page</a>.</p>
                `;
            }
        }
    }
});

function renderProductPage(id) {
    const product = getProductById(id);
    const productDetailSection = document.querySelector('.product-detail-page');
    const pageTitle = document.getElementById('page-title');

    if (!product) {
        if (productDetailSection) {
            productDetailSection.innerHTML = `
                <h2>Product Not Found</h2>
                <p>The product with ID ${id} does not exist.</p>
            `;
        }
        return;
    }

    // Update page title
    pageTitle.textContent = `${product.name} - SmartSole`;
    
    // Render the detailed HTML structure
    if (productDetailSection) {
        productDetailSection.innerHTML = `
            <div class="detail-wrapper">
                <img src="${product.image}" alt="${product.name}" class="detail-image">
                <div class="detail-info">
                    <h1>${product.name}</h1>
                    <p class="detail-price">Price: ${formatCurrency(product.price)}</p>
                    <p class="detail-description">${product.description}</p>
                    
                    <div class="purchase-controls">
                        <label for="qty-${product.id}">Quantity:</label>
                        <input type="number" id="qty-${product.id}" value="1" min="1" class="qty-input">
                        <button class="add-btn detail-add-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                    <a href="index.html" class="back-link">← Continue Shopping</a>
                </div>
            </div>
        `;
    }

    // Attach listener to the new Add to Cart button on this page
    const detailAddBtn = document.querySelector('.detail-add-btn');
    if (detailAddBtn) {
        detailAddBtn.addEventListener('click', () => {
            const qtyInput = document.getElementById(`qty-${product.id}`);
            const quantity = parseInt(qtyInput.value) || 1;
            
            // Uses the function defined in index.js
            addMultipleToCart(product.id, quantity); 
            alert(`${quantity} x ${product.name} added to cart!`);
        });
    }
}
