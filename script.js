const cart = [];

const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');
const whatsappOrder = document.getElementById('whatsapp-order');

const whatsappNumber = '967712337567';
/*تنسيق الرقم يعرضه بلغة التطبيق*/
function formatPrice(price) {
    return Number(price).toLocaleString('ar-SA');
}
/*إضافة سلة المنتج */
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    renderCart();
}
/*تغيير الكمية*/
function changeQuantity(name, amount) {
    const item = cart.find(product => product.name === name);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        const itemIndex = cart.indexOf(item);
        cart.splice(itemIndex, 1);
    }

    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">السلة فارغة حاليًا.</p>';
        cartTotal.textContent = '0';
        updateWhatsAppLink();
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${formatPrice(item.price)} ريال × ${item.quantity} = ${formatPrice(itemTotal)} ريال</p>
                </div>

                <div class="quantity-controls">
                    <button class="quantity-button" onclick="changeQuantity('${item.name}', -1)">−</button>
                    <strong>${item.quantity}</strong>
                    <button class="quantity-button" onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = formatPrice(total);
    updateWhatsAppLink();
}

function updateWhatsAppLink() {
    if (cart.length === 0) {
        whatsappOrder.href = '#cart';
        return;
    }

    const orderLines = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `- ${item.name}: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(itemTotal)} ريال`;
    });

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const message = `السلام عليكم، أريد طلب:\n${orderLines.join('\n')}\n\nالمجموع: ${formatPrice(total)} ريال`;

    whatsappOrder.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.sweet-card');
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        addToCart(name, price);

        const originalText = button.textContent;
        button.textContent = 'تمت الإضافة ✓';

        setTimeout(() => {
            button.textContent = originalText;
        }, 1200);
    });
});

clearCartButton.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
});

renderCart();
