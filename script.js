// ===============================
// BACKEND API URL & VARIABLES
// ===============================
const API_URL = "http://localhost:3000/api/products";
let products = []; // MongoDB se data aane ke baad yahan store hoga
let cart = [];
let selectedProduct = null;

// ===============================
// FETCH PRODUCTS FROM MONGODB
// ===============================
async function getProductsFromDB() {
  try {
    const res = await fetch(API_URL);
    products = await res.json();
    displayProducts(products); // Fetch hone ke baad display karo
  } catch (error) {
    console.error("Error connecting to backend:", error);
    document.getElementById("productContainer").innerHTML = `
      <div class="col-12 text-center text-danger">
        <h4>Failed to connect to Database!</h4>
        <p>Make sure 'node server.js' is running in backend terminal.</p>
      </div>`;
  }
}

// ===============================
// DISPLAY PRODUCTS
// ===============================
function displayProducts(productList) {
  let container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (productList.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted">No products found.</div>`;
    return;
  }

  productList.forEach((product) => {
    // Handling image placeholder fallback if image path fails
    const imageSrc = product.image || "https://via.placeholder.com/150";

    container.innerHTML += `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="product-card">
          <div class="discount-badge">20% OFF</div>
          <div class="wishlist"><i class="bi bi-heart"></i></div>
          <img src="${imageSrc}" alt="${product.name}">
          <div class="card-body">
            <h5>${product.name}</h5>
            <div class="rating">⭐⭐⭐⭐☆ <span>(4.8)</span></div>
            <p class="delivery">🚚 Delivery in 10 mins</p>
            <h4 class="price">
              ₹${product.price}
              <small>₹${product.price + 30}</small>
            </h4>
            <button class="btn btn-success w-100" onclick="openModal('${product._id}')">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// ===============================
// SEARCH
// ===============================
document.getElementById("searchProduct")?.addEventListener("keyup", function () {
  let value = this.value.toLowerCase();
  let result = products.filter((product) =>
    product.name.toLowerCase().includes(value)
  );
  displayProducts(result);
});

// ===============================
// FILTER SYSTEM
// ===============================
function filterProducts() {
  let category = document.getElementById("categoryFilter").value.toLowerCase();
  let price = document.getElementById("priceFilter").value;
  let brand = document.getElementById("brandFilter").value;

  let result = products.filter((product) => {
    let matchesCategory =
      category === "all" || (product.category && product.category.toLowerCase() === category);
    let matchesBrand =
      brand === "all" || (product.brand && product.brand === brand);
    let matchesPrice =
      price === "all" || product.price <= Number(price);

    return matchesCategory && matchesBrand && matchesPrice;
  });

  displayProducts(result);
}

document.querySelectorAll("select").forEach((select) => {
  select.addEventListener("change", filterProducts);
});

// ===============================
// PRODUCT MODAL (MongoDB ID '_id' support)
// ===============================
function openModal(id) {
  selectedProduct = products.find((p) => p._id === id);

  if (!selectedProduct) return;

  document.getElementById("modalTitle").innerHTML = selectedProduct.name;
  document.getElementById("modalImage").src = selectedProduct.image || "https://via.placeholder.com/150";
  document.getElementById("modalPrice").innerHTML = "₹" + selectedProduct.price;
  document.getElementById("modalDescription").innerHTML =
    selectedProduct.description || "Fresh and best quality grocery item.";
  document.getElementById("modalQuantity").value = 1;

  let modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

// ===============================
// QUANTITY BUTTONS
// ===============================
document.getElementById("plusQty")?.addEventListener("click", () => {
  let qty = document.getElementById("modalQuantity");
  qty.value = Number(qty.value) + 1;
});

document.getElementById("minusQty")?.addEventListener("click", () => {
  let qty = document.getElementById("modalQuantity");
  if (qty.value > 1) qty.value = Number(qty.value) - 1;
});

// ===============================
// ADD TO CART
// ===============================
document.getElementById("modalCartBtn")?.addEventListener("click", () => {
  let quantity = Number(document.getElementById("modalQuantity").value);
  let existing = cart.find((item) => item._id === selectedProduct._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...selectedProduct, quantity: quantity });
  }

  updateCart();
});

// ===============================
// UPDATE CART UI
// ===============================
function updateCart() {
  let cartBox = document.getElementById("cartItems");
  cartBox.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartBox.innerHTML = `<p class="text-center text-muted">Your cart is empty</p>`;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;
    cartBox.innerHTML += `
      <div class="cart-item d-flex justify-content-between align-items-center mb-2">
        <div>
          <b>${item.name}</b><br>
          <small class="text-muted">₹${item.price} x ${item.quantity}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-success me-1" onclick="changeQty('${item._id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-success ms-1 me-2" onclick="changeQty('${item._id}', 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="removeCart('${item._id}')">X</button>
        </div>
      </div>
    `;
  });

  document.getElementById("totalAmount").innerHTML = total;
  document.getElementById("cartCount").innerHTML = cart.length;
}

// ===============================
// CHANGE QUANTITY & REMOVE
// ===============================
function changeQty(id, value) {
  let item = cart.find((p) => p._id === id);
  if (item) {
    item.quantity += value;
    if (item.quantity <= 0) removeCart(id);
    else updateCart();
  }
}

function removeCart(id) {
  cart = cart.filter((item) => item._id != id);
  updateCart();
}

// ===============================
// INITIAL LOAD FROM DB
// ===============================
getProductsFromDB();
// ===============================
// CHECKOUT FUNCTIONALITY
// ===============================
async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderItems = cart.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const totalAmount = Number(document.getElementById("totalAmount").innerText);

  try {
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: orderItems,
        totalAmount: totalAmount
      })
    });

    const data = await response.json();

    if (response.ok) {
      // 1. Order ID Modal me insert karo
      document.getElementById("modalOrderId").innerText = data.orderId;

      // 2. Browser ka standard alert hata kar Bootstrap Modal show karo
      const successModal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
      successModal.show();

      // 3. Cart clear kar do
      cart = [];
      updateCart();
    } else {
      alert("Failed to place order: " + data.message);
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    alert("Unable to connect to server. Please check if backend is running.");
  }
}