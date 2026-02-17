// self-cart.js
// Cart page logic for Delight Bites
// Updated: Redirects to payment page on checkout (with QR placeholder on payment page)

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const db = window.db || null;

document.addEventListener("DOMContentLoaded", function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart loaded on cart page:", cart);

    const cartList      = document.getElementById("cart-items-list");
    const emptyCart     = document.getElementById("empty-cart");

    const subtotalEl    = document.getElementById("summary-subtotal");
    const deliveryEl    = document.getElementById("summary-delivery");
    const discountEl    = document.getElementById("summary-discount");
    const totalEl       = document.getElementById("summary-total");

    const checkoutBtn   = document.querySelector(".checkout-btn");

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Cart updated:", cart);
    }

    function renderCartItems() {
        cartList.innerHTML = "";

        if (cart.length === 0) {
            emptyCart.style.display = "block";
            updateSummary();
            return;
        }

        emptyCart.style.display = "none";

        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-card";
            cartItem.dataset.index = index;

            cartItem.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name || 'Product'}" />

                <div class="card-content">
                    <div class="item-header">
                        <h3>${item.name || 'Unnamed Item'}</h3>
                    </div>

                    <div class="item-options">
                        ${item.flavor  ? `<span>${item.flavor}</span>` : ''}
                        ${item.weight  ? `<span>${item.weight}</span>` : ''}
                        ${item.message ? `<span>Msg: ${item.message}</span>` : ''}
                    </div>

                    <div class="item-price">
                        ₹${(item.price * item.quantity).toFixed(0)}
                        <small style="color:#777; font-size:0.82rem;">(₹${item.price} × ${item.quantity})</small>
                    </div>

                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button class="qty-btn decrease" data-index="${index}">-</button>
                            <span class="qty-input">${item.quantity}</span>
                            <button class="qty-btn increase" data-index="${index}">+</button>
                        </div>

                        <button class="remove-item" data-index="${index}">×</button>
                    </div>
                </div>
            `;

            cartList.appendChild(cartItem);
        });
    }

    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal > 0 ? 50 : 0;
        const discount = 0;
        const total    = subtotal + delivery - discount;

        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
        if (deliveryEl) deliveryEl.textContent = `₹${delivery}`;
        if (discountEl) discountEl.textContent = `- ₹${discount}`;
        if (totalEl) totalEl.textContent = `₹${total}`;
    }

    if (cartList) {
        cartList.addEventListener("click", function (e) {
            const btn = e.target.closest("button");
            if (!btn) return;

            const index = parseInt(btn.dataset.index, 10);
            if (isNaN(index) || index < 0 || index >= cart.length) return;

            if (btn.classList.contains("increase")) {
                cart[index].quantity += 1;
            } else if (btn.classList.contains("decrease")) {
                if (cart[index].quantity > 1) cart[index].quantity -= 1;
            } else if (btn.classList.contains("remove-item")) {
                cart.splice(index, 1);
            }

            saveCart();
            renderCartItems();
            updateSummary();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            if (!db) {
                alert("Firebase not loaded. Please refresh the page.");
                console.error("db is not available");
                return;
            }

            try {
                const orderData = {
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        weight: item.weight || null,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    total: parseFloat(totalEl.textContent.replace('₹', '').trim()) || 0,
                    createdAt: new Date().toISOString(),
                    status: "Pending"
                };

                const docRef = await addDoc(collection(db, "orders"), orderData);
                console.log("Order saved with ID:", docRef.id);

                // Redirect to payment page with order info
                window.location.href = `../html/self-payment.html?orderId=${docRef.id}&total=${orderData.total}`;

            } catch (error) {
                console.error("Checkout error:", error);
                alert("Oops! Something went wrong while placing the order.\nPlease try again or contact us directly.");
            }
        });
    } else {
        console.warn("Checkout button (.checkout-btn) not found on this page");
    }

    renderCartItems();
    updateSummary();

});