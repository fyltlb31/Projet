const users = [
    { name: "Mohamed", email: "Mohamed@gmail.com", role: "Vendeur" },
    { name: "Fayçal", email: "Fayçal@gmail.com", role: "Acheteur" }
];
const transactions = [
    { id: 1, produit: "PS5", user: "Mohamed", statut: "En attente" },
    { id: 2, produit: "Vélo", user: "Fayçal", statut: "Validée" }
];

// Affichage utilisateurs
function renderUsers() {
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = users.map((u, i) => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td><button onclick="deleteUser(${i})">Supprimer</button></td>
        </tr>
    `).join('');
}
window.deleteUser = function(i) {
    users.splice(i, 1);
    renderUsers();
};

// Affichage transactions
function renderTransactions() {
    const tbody = document.getElementById('transactions-table');
    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.produit}</td>
            <td>${t.user}</td>
            <td>${t.statut}</td>
        </tr>
    `).join('');
}

// Gestion des onglets
document.getElementById('tab-users').onclick = function() {
    document.getElementById('users-section').style.display = '';
    document.getElementById('transactions-section').style.display = 'none';
};
document.getElementById('tab-transactions').onclick = function() {
    document.getElementById('users-section').style.display = 'none';
    document.getElementById('transactions-section').style.display = '';
};

renderUsers();
renderTransactions();