// Admin Dashboard JavaScript

// Check if admin is authenticated
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('adminLogin').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    } else {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        initializeDashboard();
    }
}

// Admin Login
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    
    // Simple auth check (in production, use proper backend auth)
    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUser', username);
        
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        
        initializeDashboard();
    } else {
        alert('Invalid credentials! Try admin/admin123');
    }
}

// Admin Logout
function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

// Initialize Dashboard
function initializeDashboard() {
    updateStats();
    loadRecentOrders();
    loadTopProducts();
    initChart();
    startClock();
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        updateStats();
        loadRecentOrders();
    }, 30000);
}

// Update Statistics
function updateStats() {
    // Get data from localStorage or use mock data
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || getMockOrders();
    const today = new Date().toDateString();
    
    const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
    const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingVerifications = orders.filter(o => o.status === 'pending').length;
    
    document.getElementById('todaySales').textContent = '$' + todaySales.toFixed(2);
    document.getElementById('newOrders').textContent = todayOrders.length;
    document.getElementById('pendingVerifications').textContent = pendingVerifications;
    document.getElementById('totalCustomers').textContent = Math.floor(Math.random() * 500) + 1000;
    
    // Update badges
    document.getElementById('newOrdersBadge').textContent = pendingVerifications;
}

// Load Recent Orders
function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || getMockOrders();
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    
    tbody.innerHTML = orders.slice(0, 5).map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.items} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Top Products
function loadTopProducts() {
    const products = [
        { name: '310 Diamonds', sales: 245, revenue: 3672.55, trend: 'up' },
        { name: 'Grandmaster Account', sales: 89, revenue: 26691.11, trend: 'up' },
        { name: '520 Diamonds', sales: 178, revenue: 4448.22, trend: 'down' },
        { name: 'Elite Pass', sales: 312, revenue: 3116.88, trend: 'up' },
        { name: 'Heroic Account', sales: 134, revenue: 20098.66, trend: 'up' }
    ];
    
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    container.innerHTML = products.map((p, i) => `
        <div class="product-list-item">
            <div class="product-rank">${i + 1}</div>
            <div class="product-info">
                <h4>${p.name}</h4>
                <p>${p.sales} sales</p>
            </div>
            <div class="product-revenue">
                <span>$${p.revenue.toFixed(2)}</span>
                <i class="fas fa-arrow-${p.trend} ${p.trend === 'up' ? 'positive' : 'negative'}"></i>
            </div>
        </div>
    `).join('');
}

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales',
                data: [1200, 1900, 1500, 2200, 1800, 2800, 2400],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Orders',
                data: [45, 62, 48, 75, 58, 89, 72],
                borderColor: '#39ff14',
                backgroundColor: 'rgba(57, 255, 20, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0a0b0' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0a0b0' }
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: '#a0a0b0' }
                }
            }
        }
    });
}

// Update Chart
function updateChart(days) {
    // In real app, fetch data for selected days
    console.log('Updating chart for', days, 'days');
}

// Clock
function startClock() {
    const updateTime = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const el = document.getElementById('serverTime');
        if (el) el.textContent = timeStr;
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Sidebar Toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Refresh Data
function refreshData() {
    const btn = document.querySelector('.header-btn i.fa-sync-alt');
    btn.classList.add('fa-spin');
    
    setTimeout(() => {
        updateStats();
        loadRecentOrders();
        btn.classList.remove('fa-spin');
    }, 1000);
}

// Notifications
function toggleNotifications() {
    alert('Notifications panel would open here');
}

// Mock Data
function getMockOrders() {
    return [
        { id: 'GZ-2024-001', customer: 'John Doe', items: 2, total: 49.99, status: 'completed', date: new Date().toISOString() },
        { id: 'GZ-2024-002', customer: 'Sarah Smith', items: 1, total: 299.99, status: 'pending', date: new Date().toISOString() },
        { id: 'GZ-2024-003', customer: 'Mike Johnson', items: 3, total: 89.97, status: 'processing', date: new Date().toISOString() },
        { id: 'GZ-2024-004', customer: 'Emma Wilson', items: 1, total: 149.99, status: 'pending', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'GZ-2024-005', customer: 'David Brown', items: 2, total: 199.98, status: 'completed', date: new Date(Date.now() - 86400000).toISOString() }
    ];
}

// View Order Detail
function viewOrder(orderId) {
    const orders = getMockOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderModalContent');
    
    content.innerHTML = `
        <div class="order-detail-grid">
            <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customer}</p>
                <p><strong>Email:</strong> customer@email.com</p>
                <p><strong>WhatsApp:</strong> +1234567890</p>
                <p><strong>IP:</strong> 192.168.1.100</p>
            </div>
            <div class="detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p><strong>Payment:</strong> Credit Card</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status}</span></p>
            </div>
        </div>
        <div class="detail-section">
            <h4>Items</h4>
            <p>310 Diamonds x 1 - $14.99</p>
            <p>Elite Pass x 1 - $9.99</p>
        </div>
    `;
    
    modal.classList.add('open');
}

// Quick Actions
function addProduct() {
    document.getElementById('productModal').classList.add('open');
}

function addAccount() {
    alert('Add account modal would open');
}

function processRefund() {
    alert('Refund processing modal would open');
}

function generateReport() {
    alert('Generating report... Download will start shortly.');
}

function clearCache() {
    if (confirm('Clear all cached data?')) {
        alert('Cache cleared successfully!');
    }
}

function backupData() {
    const data = {
        orders: getMockOrders(),
        timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

// Modal Controls
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

// Save Product
function saveProduct(e) {
    e.preventDefault();
    alert('Product saved successfully!');
    closeModal('productModal');
    e.target.reset();
}

// WhatsApp Functions
function connectWhatsApp() {
    alert('Connecting to WhatsApp Web... QR code would appear here.');
}

function testWhatsApp() {
    alert('Test message sent! Check your WhatsApp.');
}

function broadcastMessage() {
    alert('Broadcast modal would open here');
}

function addTemplate() {
    alert('Add template modal would open');
}

function editTemplate(id) {
    alert('Editing template ' + id);
}

function testTemplate(id) {
    alert('Test message sent for template ' + id);
}

function deleteTemplate(id) {
    if (confirm('Delete this template?')) {
        alert('Template deleted');
    }
}

function selectChat(id) {
    document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    const messages = document.getElementById('chatMessages');
    messages.innerHTML += `
        <div class="message sent">
            <div class="message-content">${text}</div>
            <span class="message-time">Just now</span>
        </div>
    `;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
}

function viewOrderFromChat() {
    alert('Opening order details...');
}

function sendBroadcast(e) {
    e.preventDefault();
    alert('Broadcast sent to all recipients!');
}

// Order Management Functions
function loadOrders() {
    const orders = getMockOrders();
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><input type="checkbox" class="order-check" value="${order.id}"></td>
            <td>${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.customer}</td>
            <td>+1234567890</td>
            <td>${order.items} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>Credit Card</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetail('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('totalOrdersBadge').textContent = orders.length + ' orders';
}

function viewOrderDetail(orderId) {
    document.getElementById('modalOrderId').textContent = '#' + orderId;
    document.getElementById('orderDetailModal').classList.add('open');
}

function searchOrders() {
    const term = document.getElementById('orderSearch').value.toLowerCase();
    // Filter implementation would go here
    console.log('Searching for:', term);
}

function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    console.log('Filtering by status:', status);
    loadOrders();
}

function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('orderSearch').value = '';
    loadOrders();
}

function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    document.querySelectorAll('.order-check').forEach(cb => cb.checked = checked);
}

function applyBulkAction() {
    const action = document.getElementById('bulkAction').value;
    if (!action) return;
    
    const selected = document.querySelectorAll('.order-check:checked');
    if (selected.length === 0) {
        alert('Select orders first');
        return;
    }
    
    alert(`${action} applied to ${selected.length} orders`);
}

function prevPage() {
    console.log('Previous page');
}

function nextPage() {
    console.log('Next page');
}

function exportOrders() {
    alert('Exporting orders to CSV...');
}

// Product Management
function openProductModal() {
    document.getElementById('productEditModal').classList.add('open');
}

function saveProductEdit(e) {
    e.preventDefault();
    alert('Product updated successfully!');
    closeModal('productEditModal');
}

function filterProducts(category) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    console.log('Filtering products:', category);
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('open');
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});