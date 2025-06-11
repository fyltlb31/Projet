const products = [
    { name: "PS5", price: "180 000DZD" },
    { name: "Vélo électrique", price: "25 000DZD" }
];
const sellerTransactions = [
    { id: 1, produit: "PS5", statut: "En attente" },
    { id: 2, produit: "Vélo électrique", statut: "Validée" }
];

// Affichage produits
function renderProducts() {
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = products.map((p, i) => `
        <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><button onclick="deleteProduct(${i})">Supprimer</button></td>
        </tr>
    `).join('');
}
window.deleteProduct = function(i) {
    products.splice(i, 1);
    renderProducts();
};

// Affichage transactions vendeur
function renderSellerTransactions() {
    const tbody = document.getElementById('seller-transactions-table');
    tbody.innerHTML = sellerTransactions.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.produit}</td>
            <td>${t.statut}</td>
        </tr>
    `).join('');
}

// Gestion des onglets
document.getElementById('tab-products').onclick = function() {
    document.getElementById('products-section').style.display = '';
    document.getElementById('seller-transactions-section').style.display = 'none';
};
document.getElementById('tab-seller-transactions').onclick = function() {
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('seller-transactions-section').style.display = '';
};

renderProducts();
renderSellerTransactions();