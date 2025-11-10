document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const mainView = document.getElementById('mainViewContainer');
    const detailView = document.getElementById('detailViewContainer');
    const checkoutView = document.getElementById('checkoutViewContainer');
    
    const productsContainer = document.getElementById('productsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const searchInput = document.getElementById('searchInput');
    const themeToggleButton = document.getElementById('theme-toggle');
    const homeLink = document.getElementById('home-link');

    // Cart Elements
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const checkoutFromCartBtn = document.getElementById('checkoutFromCartBtn');

    // Modals
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

    // --- State ---
    let vehiclesData = [];
    let cart = [];
    let vehicleForCheckout = null; // Vehicle for direct purchase

    const VEHICLES_API_URL = 'https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/refs/heads/main/vehiculos.json';

    // --- View Management ---
    const showMainView = () => {
        mainView.classList.remove('d-none');
        detailView.classList.add('d-none');
        checkoutView.classList.add('d-none');
        window.scrollTo(0, 0);
    };

    const showDetailView = (vehicle) => {
        vehicleForCheckout = vehicle; // Set the vehicle for a potential direct purchase
        renderDetailView(vehicle);
        mainView.classList.add('d-none');
        detailView.classList.remove('d-none');
        checkoutView.classList.add('d-none');
        window.scrollTo(0, 0);
    };

    const showCheckoutView = (items) => {
        renderCheckoutView(items);
        mainView.classList.add('d-none');
        detailView.classList.add('d-none');
        checkoutView.classList.remove('d-none');
        cartModal.hide();
        window.scrollTo(0, 0);
    };

    // --- Theme Management ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggleButton.innerHTML = `<i class="fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>`;
    };

    const toggleTheme = () => {
        const newTheme = (localStorage.getItem('theme') || 'dark') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    // --- Data Loading & Rendering ---
    async function loadVehicles() {
        try {
            loadingSpinner.classList.remove('d-none');
            const response = await fetch(VEHICLES_API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            vehiclesData = await response.json();
            displayVehicles(vehiclesData);
        } catch (error) {
            productsContainer.innerHTML = `<p class="text-danger text-center">Error al cargar: ${error.message}</p>`;
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }

    function displayVehicles(vehicles) {
        productsContainer.innerHTML = '';
        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${vehicle.imagen}" class="card-img-top" alt="${vehicle.marca} ${vehicle.modelo}" loading="lazy">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                        <p class="card-text text-muted">${vehicle.categoria}</p>
                        <p class="card-text fs-4 fw-bold text-danger mt-auto">${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(vehicle.precio_venta)}</p>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-danger view-details-btn" data-codigo="${vehicle.codigo}">Ver Detalles</button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });
    }

    function renderDetailView(vehicle) {
        detailView.innerHTML = `
            <div class="row">
                <div class="col-12 mb-3">
                    <button id="back-to-list-btn" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-2"></i>Volver al listado</button>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-7 detail-gallery">
                    <img src="${vehicle.imagen}" alt="${vehicle.marca} ${vehicle.modelo}">
                </div>
                <div class="col-lg-5 detail-info">
                    <h2>${vehicle.marca} ${vehicle.modelo}</h2>
                    <p class="text-muted">${vehicle.categoria}</p>
                    <p class="price">${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(vehicle.precio_venta)}</p>
                    <ul class="detail-specs">
                        <li><strong>Año:</strong> ${vehicle.ano}</li>
                        <li><strong>Kilometraje:</strong> ${vehicle.kilometraje.toLocaleString('es-DO')} km</li>
                        <li><strong>Transmisión:</strong> ${vehicle.transmision}</li>
                        <li><strong>Condición:</strong> ${vehicle.condicion}</li>
                        <li><strong>Motor:</strong> ${vehicle.motor}</li>
                        <li><strong>Combustible:</strong> ${vehicle.combustible}</li>
                    </ul>
                    <div class="d-grid gap-2 mt-4">
                         <button id="buy-now-btn" class="btn btn-danger btn-lg"><i class="fas fa-credit-card me-2"></i>Comprar Ahora</button>
                         <button id="add-to-cart-detail-btn" class="btn btn-outline-danger btn-lg"><i class="fas fa-cart-plus me-2"></i>Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('back-to-list-btn').addEventListener('click', showMainView);
        document.getElementById('buy-now-btn').addEventListener('click', () => showCheckoutView([vehicle]));
        document.getElementById('add-to-cart-detail-btn').addEventListener('click', () => {
            addItemToCart(vehicle, 1);
            alert(`${vehicle.marca} ${vehicle.modelo} ha sido añadido a tu carrito.`);
        });
    }

    function renderCheckoutView(items) {
        const total = items.reduce((sum, item) => sum + (item.precio_venta * (item.quantity || 1)), 0);
        checkoutView.innerHTML = `
            <h2 class="mb-4">Finalizar Compra</h2>
            <div class="row g-5">
                <div class="col-lg-7">
                    <form id="checkout-form" class="checkout-form" novalidate>
                        <div class="form-section">
                            <h5>Información del Comprador</h5>
                            <div class="row g-3">
                                <div class="col-sm-6"><input type="text" class="form-control" placeholder="Nombre" required></div>
                                <div class="col-sm-6"><input type="text" class="form-control" placeholder="Apellido" required></div>
                                <div class="col-12"><input type="email" class="form-control" placeholder="Correo Electrónico" required></div>
                                <div class="col-12"><input type="tel" class="form-control" placeholder="Teléfono" required></div>
                                <div class="col-12"><input type="text" class="form-control" placeholder="Dirección" required></div>
                            </div>
                        </div>
                        <div class="form-section">
                            <h5>Información de Pago</h5>
                            <div class="row g-3">
                                <div class="col-12"><input type="text" id="checkoutCardName" class="form-control" placeholder="Nombre en la tarjeta" required></div>
                                <div class="col-12"><input type="text" class="form-control" placeholder="Número de tarjeta" required></div>
                                <div class="col-sm-6"><input type="text" class="form-control" placeholder="MM/AA" required></div>
                                <div class="col-sm-6"><input type="text" class="form-control" placeholder="CVC" required></div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-lg-5">
                    <div class="checkout-summary">
                        <h5>Resumen de la Compra</h5>
                        <hr>
                        ${items.map(item => `
                            <div class="d-flex justify-content-between">
                                <span>${item.marca} ${item.modelo} ${item.quantity ? `(x${item.quantity})` : ''}</span>
                                <strong>${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.precio_venta * (item.quantity || 1))}</strong>
                            </div>
                        `).join('')}
                        <hr>
                        <div class="d-flex justify-content-between fs-4">
                            <strong>Total:</strong>
                            <strong class="text-danger">${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(total)}</strong>
                        </div>
                        <div class="d-grid gap-2 mt-4">
                            <button id="finalize-purchase-btn" class="btn btn-danger btn-lg">Finalizar Compra</button>
                            <button id="cancel-purchase-btn" class="btn btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('cancel-purchase-btn').addEventListener('click', showMainView);
        document.getElementById('finalize-purchase-btn').addEventListener('click', () => {
            const form = document.getElementById('checkout-form');
            if (form.checkValidity()) {
                generateInvoice(items, document.getElementById('checkoutCardName').value);
                alert('¡Compra realizada con éxito! Se ha generado su factura.');
                // If the purchase came from the cart, clear the cart
                if (items.length > 1 || (items[0] && items[0].quantity)) {
                    cart = [];
                    updateCartUI();
                }
                showMainView();
            } else {
                form.reportValidity();
            }
        });
    }

    // --- Cart Management ---
    function addItemToCart(vehicle, quantity) {
        const existingItem = cart.find(item => item.codigo === vehicle.codigo);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...vehicle, quantity });
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                total += item.precio_venta * item.quantity;
                totalItems += item.quantity;
                cartItemsContainer.innerHTML += `<div class="d-flex justify-content-between"><span>${item.marca} ${item.modelo} (x${item.quantity})</span> <strong>${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.precio_venta * item.quantity)}</strong></div>`;
            });
        }
        cartTotalSpan.textContent = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(total);
        cartCount.textContent = totalItems;
        cartCount.style.animation = totalItems > 0 ? 'pulse 1.5s infinite' : 'none';
    }

    // --- PDF Generation ---
    function generateInvoice(items, clientName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Factura - DELUXE CAR", 20, 20);
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-DO')}`, 20, 30);
        doc.text(`Cliente: ${clientName || 'N/A'}`, 20, 35);
        
        const tableBody = items.map(item => [
            `${item.marca} ${item.modelo}`,
            item.quantity || 1,
            new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.precio_venta * (item.quantity || 1))
        ]);

        doc.autoTable({
            startY: 45,
            head: [['Descripción', 'Cantidad', 'Subtotal']],
            body: tableBody,
        });
        
        const total = items.reduce((sum, item) => sum + (item.precio_venta * (item.quantity || 1)), 0);
        const finalY = doc.autoTable.previous.finalY;
        doc.setFontSize(14);
        doc.text(`Total: ${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(total)}`, 140, finalY + 15);
        doc.save(`factura-DELUXE-CAR-${Date.now()}.pdf`);
    }

    // --- Event Listeners ---
    themeToggleButton.addEventListener('click', toggleTheme);
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMainView();
    });
    searchInput.addEventListener('input', () => displayVehicles(vehiclesData.filter(v => 
        `${v.marca} ${v.modelo} ${v.categoria}`.toLowerCase().includes(searchInput.value.toLowerCase())
    )));

    productsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.view-details-btn');
        if (target) {
            const vehicleCode = parseInt(target.dataset.codigo, 10);
            const vehicle = vehiclesData.find(v => v.codigo === vehicleCode);
            if (vehicle) showDetailView(vehicle);
        }
    });

    checkoutFromCartBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showCheckoutView(cart);
        } else {
            alert('Tu carrito está vacío.');
        }
    });

    // --- Initial Load ---
    applyTheme(localStorage.getItem('theme') || 'dark');
    loadVehicles();
});

