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
                    <button class="add-to-cart-btn" onclick="TukuItemRek('${product.title}', '${product.price}', '${product.thumbnail}')">Add to Cart</button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(productItem);
    });
}

// Function to handle adding items to the cart
function TukuItemRek(ProdukTitle, ProdukPrice, ProdukThumbnail) {
    let belanjaan = JSON.parse(localStorage.getItem("All")) || [];
    
    let newItem = {
        "gambar": ProdukThumbnail,
        "barang": ProdukTitle,
        "harga": ProdukPrice
    };

    // Add new item to the cart
    belanjaan.push(newItem);
    localStorage.setItem("All", JSON.stringify(belanjaan));

    // Update the checkout sidebar
    renderCheckout();
}

// Function to render the checkout sidebar
function renderCheckout() {
    let belanjaan = JSON.parse(localStorage.getItem("All")) || [];
    let checkoutItems = document.getElementById('checkout-items');
    let totalPriceEl = document.getElementById('total-price');
    let totalItemsEl = document.getElementById('total-items');
    checkoutItems.innerHTML = '';


    let totalPrice = 0;
    let totalItems = 0;

    belanjaan.forEach((item, index) => {
        let itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');
        itemElement.innerHTML = `
            <div class="groceries-card" >
                <img src="${item.gambar}" alt="${item.barang}">
                <div>
                <h4>${item.barang}</h4>
                <p>Price: $${item.harga}</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;

        checkoutItems.appendChild(itemElement);
        totalItems++;
        totalPrice += parseFloat(item.harga);
    });
    
    totalPriceEl.textContent = `Total: $${totalPrice.toFixed(2)}`;
    totalItemsEl.textContent = `Total Items: ${totalItems}`;
}

function removeItem(index) {
    let belanjaan = JSON.parse(localStorage.getItem("All")) || [];

    belanjaan.splice(index, 1);
    localStorage.setItem("All", JSON.stringify(belanjaan));

    renderCheckout();
}

document.addEventListener('DOMContentLoaded', function() {
    renderCheckout();
});




function saveArray(arrayName, array) {
    localStorage.setItem(arrayName, JSON.stringify(array));
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

document.addEventListener('DOMContentLoaded', function() {
    // Mendapatkan elemen untuk Shopbar (Cart)
    const shopToggle = document.getElementById('shopToggle');
    const shopbar = document.getElementById('shopbar');

    // Fungsi untuk membuka Shopbar
    function openShopbar() {
        shopbar.classList.add('open');
    }

    // Fungsi untuk menutup Shopbar
    function closeShopbar() {
        shopbar.classList.remove('open');
    }

    // Event Listener untuk membuka Shopbar saat tombol di klik
    shopToggle.addEventListener('click', function(event) {
        event.preventDefault();
        if (shopbar.classList.contains('open')) {
            closeShopbar();  // Jika sudah terbuka, maka tutup
        } else {
            openShopbar();   // Jika belum terbuka, maka buka
        }
    });
});

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

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('shopToggle');
    const sidebar = document.getElementById('shopbar');
    
    const sidebarHidden = localStorage.getItem('shopbarHidden') === 'true';
    if (sidebarHidden) {
        sidebar.classList.add('hidden');
    }
    
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        localStorage.setItem('shopbarHidden', sidebar.classList.contains('hidden'));
    });
});

// Menambahkan event listener untuk tombol Show All
document.getElementById('show-all-btn').addEventListener('click', () => {
    productLimit = 40; // Atur limit yang ingin ditampilkan
    fetchProducts(); // Panggil fungsi untuk mendapatkan semua produk
});

function SimpenItemRek() {

}

