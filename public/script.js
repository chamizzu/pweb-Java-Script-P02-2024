const catalogGrid = document.getElementById('catalog-grid');
const categoryTitle = document.getElementById('category-title');
let currentCategory = ''; // Menyimpan kategori yang dipilih
let productLimit = 40; // Jumlah produk default

// Fungsi untuk menampilkan halaman error
function displayErrorPage() {
    catalogGrid.innerHTML = `
        <div class="error-page">
            <h2>Oops! Something went wrong.</h2>
            <p>We couldn't fetch the data you're looking for. Please try again later.</p>
            <a href="/public/index.html" class="go-back-btn">Go Back</a>
        </div>
    `;
}

// Fungsi untuk menampilkan semua produk dengan limit
async function fetchProducts() {
    const response = await fetch(`https://dummyjson.com/products?limit=${productLimit}`);
    const data = await response.json();
    displayProducts(data.products);
    categoryTitle.textContent = 'All Products';
}

// Fungsi untuk memperbarui jumlah produk yang ditampilkan berdasarkan radio button
function changeProductLimit() {
    // Mengambil radio button yang dipilih
    const selectedRadio = document.querySelector('input[name="product-count"]:checked');
    
    if (selectedRadio) {
        productLimit = parseInt(selectedRadio.value); // Mengambil nilai dari radio button yang dipilih
    } else {
        productLimit = 30; // Atur ke default jika tidak ada yang dipilih
    }

    if (currentCategory) {
        showCategory(currentCategory); // Jika kategori dipilih, refresh dengan limit baru
    } else {
        fetchProducts(); // Jika tidak ada kategori yang dipilih, tampilkan semua produk dengan limit baru
    }
}

// Menampilkan produk di grid
function displayProducts(products) {
    catalogGrid.innerHTML = ''; // Bersihkan grid sebelumnya
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('catalog-card');
        productItem.innerHTML = `
            <div class="catalog-card-inner">
                <div class="catalog-card-front">
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>Price: $${product.price}</p>
                </div>
                <div class="catalog-card-back">
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(productItem);
    });
}

// Fungsi untuk menampilkan semua produk dengan limit
async function fetchProducts() {
    try {
        const response = await fetch(`https://dummyjson.com/products?limit=${productLimit}`);
        // Cek apakah respons berhasil (status 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }
        const data = await response.json();
        displayProducts(data.products);
        categoryTitle.textContent = 'All Products';
    } catch (error) {
        console.error('Error fetching data:', error);
        displayErrorPage(); // Tampilkan halaman error jika fetching gagal
    }
}

// Menampilkan produk berdasarkan kategori dengan limit
async function showCategory(category) {
    currentCategory = category; // Menyimpan kategori yang dipilih
    try {
        const response = await fetch(`https://dummyjson.com/products/category/${category.toLowerCase()}?limit=${productLimit}`);
        // Cek apakah respons berhasil (status 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }
        const data = await response.json();
        displayProducts(data.products);
        categoryTitle.textContent = `${category} Products`; // Update judul kategori
    } catch (error) {
        console.error('Error fetching data:', error);
        displayErrorPage(); // Tampilkan halaman error jika fetching gagal
    }
}

// Memuat semua produk saat halaman dimuat
window.onload = fetchProducts;

// Menambahkan event listener untuk radio button agar setiap kali dipilih, update produk
document.querySelectorAll('input[name="product-count"]').forEach(radio => {
    radio.addEventListener('change', changeProductLimit);
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Check localStorage for saved state
    const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
    if (sidebarHidden) {
        sidebar.classList.add('hidden');
    }
    
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        // Save state to localStorage
        localStorage.setItem('sidebarHidden', sidebar.classList.contains('hidden'));
    });
});

// Mendapatkan elemen yang diperlukan
const cartIcon = document.querySelector('.cart-icon a');
const sidebar = document.querySelector('.sidebar');
const closeButton = document.querySelector('.sidebar-close');

// Fungsi untuk membuka sidebar
function openSidebar() {
    sidebar.classList.add('open');
}

// Fungsi untuk menutup sidebar
function closeSidebar() {
    sidebar.classList.remove('open');
}

// Menambahkan event listener untuk ikon keranjang
cartIcon.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah aksi default link
    openSidebar(); // Memanggil fungsi untuk membuka sidebar
});

// Menambahkan event listener untuk tombol tutup sidebar
closeButton.addEventListener('click', closeSidebar);




// Mendapatkan elemen yang diperlukan
const cartIconCount = document.querySelector('.cart-icon span');
const cartItemsContainer = document.querySelector('.cart-items');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi untuk memperbarui jumlah barang di ikon keranjang
function updateCartIcon() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIconCount.textContent = totalItems;
}

// Fungsi untuk menambahkan barang ke keranjang
function addToCart(productId, productTitle, productPrice) {
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: productId, title: productTitle, price: productPrice, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
}

// Fungsi untuk menampilkan barang-barang di keranjang
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
            </div>
            <div>
                <button class="decrease-qty" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-qty" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);

        cartItem.querySelector('.decrease-qty').addEventListener('click', () => updateItemQuantity(item.id, item.quantity - 1));
        cartItem.querySelector('.increase-qty').addEventListener('click', () => updateItemQuantity(item.id, item.quantity + 1));
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
    });
}

// Fungsi untuk memperbarui jumlah barang di keranjang
function updateItemQuantity(productId, quantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = quantity;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartIcon();
            renderCartItems();
        }
    }
}

// Fungsi untuk menghapus barang dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
}

// Menambahkan event listener untuk tombol Add to Cart
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productId = event.target.dataset.id;
        const productTitle = event.target.dataset.title;
        const productPrice = event.target.dataset.price;
        addToCart(productId, productTitle, productPrice);
    }
});

// Memperbarui ikon keranjang saat halaman dimuat
updateCartIcon();
renderCartItems();