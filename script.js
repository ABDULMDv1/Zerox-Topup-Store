// Payment & WhatsApp Integration Functions

let currentOrder = {
    id: '',
    items: [],
    total: 0,
    customer: {},
    paymentMethod: '',
    status: 'pending'
};

// Generate Order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `GZ-${timestamp}-${random}`;
}

// Load Checkout Data
function loadCheckoutData() {
    const checkoutItems = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (!checkoutItems) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Display items
    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <h4>${item.name}</h4>
                ${item.playerId ? `<p>Player ID: ${item.playerId}</p>` : ''}
            </div>
            <div class="summary-item-price">$${item.price.toFixed(2)}</div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Store for later
    currentOrder.items = [...cart];
    currentOrder.total = total;
}

// Generate Transfer Reference
function generateOrderReference() {
    const ref = generateOrderId();
    const refEl = document.getElementById('transferReference');
    if (refEl) refEl.textContent = ref;
}

// Payment Method Selection
function selectPayment(method) {
    // Hide all forms
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('paypalForm').style.display = 'none';
    document.getElementById('cryptoForm').style.display = 'none';
    document.getElementById('manualForm').style.display = 'none';
    
    // Show selected
    if (method === 'card') document.getElementById('cardForm').style.display = 'block';
    if (method === 'paypal') document.getElementById('paypalForm').style.display = 'block';
    if (method === 'crypto') document.getElementById('cryptoForm').style.display = 'block';
    if (method === 'manual') document.getElementById('manualForm').style.display = 'block';
    
    currentOrder.paymentMethod = method;
}

// Process Payment
function processPayment() {
    // Validate form
    const name = document.getElementById('customerName')?.value;
    const whatsapp = document.getElementById('whatsappNumber')?.value;
    const email = document.getElementById('customerEmail')?.value;
    
    if (!name || !whatsapp || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate WhatsApp format
    const whatsappRegex = /^[+]?[\d\s-]{10,}$/;
    if (!whatsappRegex.test(whatsapp)) {
        alert('Please enter a valid WhatsApp number (e.g., +1234567890)');
        return;
    }
    
    // Store customer info
    currentOrder.customer = { name, whatsapp, email };
    currentOrder.id = generateOrderId();
    
    // Save to session storage for next pages
    sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    
    // Show processing modal
    const modal = document.getElementById('processingModal');
    modal.classList.add('open');
    
    // Simulate processing
    setTimeout(() => {
        modal.classList.remove('open');
        
        // Send WhatsApp verification message
        sendWhatsAppVerification();
        
        // Redirect to verification page
        window.location.href = 'payment.html';
    }, 3000);
}

// Send WhatsApp Verification Message
function sendWhatsAppVerification() {
    const { id, total, customer, paymentMethod } = currentOrder;
    
    // Format WhatsApp message
    const message = `👋 Hi ${customer.name}!

🔒 *Payment Verification Required*
Order: ${id}
Amount: $${total.toFixed(2)}
Method: ${paymentMethod.toUpperCase()}

Please reply with *YES* to confirm this payment, or *NO* to cancel.

⏰ This link expires in 10 minutes.`;
    
    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${customer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Store for simulation
    sessionStorage.setItem('whatsappVerificationUrl', whatsappUrl);
    sessionStorage.setItem('verificationMessage', message);
    
    console.log('WhatsApp Verification URL:', whatsappUrl);
    console.log('Message:', message);
    
    // In real implementation, you would:
    // 1. Send via WhatsApp Business API
    // 2. Or open WhatsApp Web with pre-filled message
    // window.open(whatsappUrl, '_blank');
}

// Load Verification Data
function loadVerificationData() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    if (!order) {
        window.location.href = 'index.html';
        return;
    }
    
    currentOrder = order;
    
    // Update UI
    document.getElementById('verifyOrderId').textContent = order.id;
    document.getElementById('verifyAmount').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('verifyMethod').textContent = order.paymentMethod.toUpperCase();
    
    // Update chat preview
    document.getElementById('chatCustomerName').textContent = order.customer.name;
    document.getElementById('chatOrderId').textContent = order.id;
    document.getElementById('chatAmount').textContent = `$${order.total.toFixed(2)}`;
    
    // Auto-open WhatsApp after 2 seconds (optional)
    setTimeout(() => {
        const waUrl = sessionStorage.getItem('whatsappVerificationUrl');
        if (waUrl && confirm('Open WhatsApp to verify payment?')) {
            window.open(waUrl, '_blank');
        }
    }, 2000);
}

// Simulate WhatsApp Reply
function simulateWhatsAppReply(reply) {
    const chat = document.getElementById('whatsappChat');
    const actions = document.getElementById('whatsappActions');
    const notice = document.getElementById('verificationNotice');
    const timelineVerify = document.getElementById('timelineVerify');
    const timelineProcess = document.getElementById('timelineProcess');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const verifyStatus = document.getElementById('verifyStatus');
    
    // Add user reply to chat
    const userReply = document.createElement('div');
    userReply.className = 'chat-message received';
    userReply.innerHTML = `
        <div class="message-bubble">${reply.toUpperCase()}</div>
        <span class="message-time">Just now</span>
    `;
    chat.appendChild(userReply);
    chat.scrollTop = chat.scrollHeight;
    
    if (reply.toLowerCase() === 'yes') {
        // Payment verified
        setTimeout(() => {
            actions.style.display = 'none';
            notice.style.display = 'block';
            
            // Update timeline
            timelineVerify.classList.add('completed');
            timelineProcess.classList.add('active');
            
            // Update status
            statusIcon.className = 'status-icon success';
            statusIcon.innerHTML = '<i class="fas fa-check"></i>';
            statusText.textContent = 'Payment verified successfully!';
            verifyStatus.textContent = 'Verified';
            verifyStatus.className = 'status-badge success';
            
            // Send confirmation and redirect
            setTimeout(() => {
                sendTopupDoneMessage();
                window.location.href = 'success.html';
            }, 2000);
        }, 1000);
    } else {
        // Payment cancelled
        statusIcon.className = 'status-icon error';
        statusIcon.innerHTML = '<i class="fas fa-times"></i>';
        statusText.textContent = 'Payment cancelled by user';
        verifyStatus.textContent = 'Cancelled';
        verifyStatus.className = 'status-badge error';
        actions.style.display = 'none';
    }
}

// Send TOPUP DONE WhatsApp Message
function sendTopupDoneMessage() {
    const { id, total, customer, items } = currentOrder;
    
    // Format items list
    const itemsList = items.map(item => `• ${item.name}`).join('\n');
    
    const message = `🎉 *TOPUP DONE!*

Order: ${id}
Status: *COMPLETED ✅*
Amount: $${total.toFixed(2)}

*Items Delivered:*
${itemsList}

Thank you for choosing Gaming Zerox! 🎮

Need help? Contact support anytime.`;
    
    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${customer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Store for display on success page
    sessionStorage.setItem('topupDoneMessage', message);
    sessionStorage.setItem('topupDoneUrl', whatsappUrl);
    
    console.log('TOPUP DONE Message:', message);
    console.log('WhatsApp URL:', whatsappUrl);
    
    // In real implementation, send via WhatsApp Business API
    // or open WhatsApp
    // window.open(whatsappUrl, '_blank');
}

// Load Success Data
function loadSuccessData() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    const message = sessionStorage.getItem('topupDoneMessage');
    
    if (!order) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update order details
    document.getElementById('successOrderId').textContent = order.id;
    document.getElementById('successAmount').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('successMethod').textContent = order.paymentMethod.toUpperCase();
    document.getElementById('successTransaction').textContent = 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    
    // Update WhatsApp preview
    document.getElementById('waOrderId').textContent = order.id;
    document.getElementById('waAmount').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('waItems').textContent = order.items.map(i => i.name).join(', ');
    
    // Auto-send WhatsApp after 3 seconds
    setTimeout(() => {
        const waUrl = sessionStorage.getItem('topupDoneUrl');
        if (waUrl) {
            // Create hidden iframe or use API to send
            console.log('Sending TOPUP DONE message...');
            
            // Visual feedback
            const confirmation = document.getElementById('whatsappConfirmation');
            confirmation.style.animation = 'pulse 1s';
        }
    }, 3000);
}

// Clear Cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// Update cart page to link to checkout
function renderCart() {
    const container = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyCartMessage');
    const cartContainer = document.getElementById('cartContainer');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!container) return;
    
    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (cartContainer) cartContainer.style.display = 'none';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartContainer) cartContainer.style.display = 'grid';
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas ${item.type === 'account' ? 'fa-user' : 'fa-gem'}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.playerId ? `<div class="cart-item-meta">Player ID: ${item.playerId}</div>` : ''}
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update summary
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Update checkout button to link to checkout page
    if (checkoutBtn) {
        checkoutBtn.onclick = () => window.location.href = 'checkout.html';
    }
}