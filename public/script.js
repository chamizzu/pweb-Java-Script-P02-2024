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

// Menambahkan event listener untuk tombol Show All
document.getElementById('show-all-btn').addEventListener('click', () => {
    productLimit = 40; // Atur limit yang ingin ditampilkan
    fetchProducts(); // Panggil fungsi untuk mendapatkan semua produk
});
