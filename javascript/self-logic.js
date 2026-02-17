// self-logic.js - Menu / Order page cart logic for Delight Bites
// Uses fixed price per weight selected via radio buttons
// Badge feature removed as per user request

document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded! Starting cart setup...');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved:', cart);
    }

    // Add item to cart using the selected weight's fixed price
    function addToCart(id, name, button) {
        // Find the selected radio button for this product
        const selectedRadio = document.querySelector(`input[name="weight_${id}"]:checked`);

        if (!selectedRadio) {
            alert('Please select a weight / quantity before adding to cart!');
            console.warn('No weight selected for product:', name);
            return;
        }

        const weight = selectedRadio.value;
        const price = parseFloat(selectedRadio.getAttribute('data-price')) || 0;

        if (price <= 0) {
            alert('Invalid price for selected option. Please check the menu.');
            console.warn('Invalid price for', name, weight);
            return;
        }

        console.log(`Adding ${name} (${weight}) at ₹${price}`);

        // Check if same product + same weight already exists
        const existingItemIndex = cart.findIndex(item => item.id === id && item.weight === weight);

        if (existingItemIndex !== -1) {
            // Increase quantity
            cart[existingItemIndex].quantity += 1;
            console.log(`Increased quantity for ${name} (${weight}) → ${cart[existingItemIndex].quantity}`);
        } else {
            // Add new item
            cart.push({
                id: id,
                name: name,
                price: price,
                weight: weight,
                quantity: 1,
                image: button.dataset.image || 'https://via.placeholder.com/150'
                // You can add more fields later: flavor, message, etc.
            });
            console.log(`New item added: ${name} (${weight}) @ ₹${price}`);
        }

        saveCart();
        showToast(name, weight);
        flashButton(button);
    }

    // Show toast notification (if toast element exists)
    function showToast(itemName, weight) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.warn('Toast element (#toast) not found on page');
            return;
        }

        toast.textContent = `${itemName} (${weight}) added to cart!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Flash "Added!" feedback on button
    function flashButton(button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Added!';
        button.style.backgroundColor = '#8f6565';

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 1000);
    }

    // Attach click listeners to all "Add to Cart" buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log('Found add-to-cart buttons:', addButtons.length);

    if (addButtons.length === 0) {
        console.warn('No .add-to-cart-btn elements found on the page');
    }

    addButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            const id = button.dataset.id;
            const name = button.dataset.name;

            if (!id || !name) {
                console.error('Missing data-id or data-name on button:', button);
                return;
            }

            console.log('Add to cart clicked:', { id, name });
            addToCart(id, name, button);
        });
    });
});