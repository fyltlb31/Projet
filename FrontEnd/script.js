document.addEventListener('DOMContentLoaded', function() {
    // --- Navigation mobile responsif ---
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '☰';
    navToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary-color);
        cursor: pointer;
    `;

    if (window.matchMedia('(max-width: 768px)').matches) {
        navToggle.style.display = 'block';
    }

    const nav = document.querySelector('nav');
    const navList = document.querySelector('nav ul');
    if (nav && navList) {
        nav.insertBefore(navToggle, navList);

        navToggle.addEventListener('click', function() {
            navList.classList.toggle('nav-open');
        });
    }

    // --- Recherche produits ---
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) filterProducts(searchTerm);
    }

    function filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        const searchLower = searchTerm.toLowerCase();
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            card.style.display = title.includes(searchLower) ? 'block' : 'none';
        });
    }

    // --- Animation des cartes au scroll ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .product-card, .service-card').forEach(card => {
        observer.observe(card);
    });

    // --- Afficher/masquer les détails sur clic du bouton Détails ---
    document.querySelectorAll('.product-card .btn-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const details = card.querySelector('.product-details');
            if (details) {
                details.classList.toggle('active');
                this.textContent = details.classList.contains('active') ? 'Masquer' : 'Détails';
            }
        });
    });

    // --- Actions Produits (hors détails) ---
    document.querySelectorAll('.product-actions .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-details')) return;
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const action = this.textContent.trim();
            handleProductAction(action, productTitle, productCard);
        });
    });

    function handleProductAction(action, productTitle, productCard) {
        switch(action) {
            case 'Louer': openRentalModal(productTitle); break;
            case 'Acheter': openPurchaseModal(productTitle); break;
            case 'Échanger': openExchangeModal(productTitle); break;
        }
    }

    // --- Actions Section Services ---
    document.querySelectorAll('#services .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            switch(action) {
                case 'Vendre un produit': openSellModal(); break;
                case 'Acheter maintenant': openPurchaseModal('Produit sélectionné'); break;
                case 'Louer un produit': openRentalModal('Produit sélectionné'); break;
                case 'Réserver maintenant': openReservationModal(); break;
                case 'Choisir la livraison': openDeliveryModal(); break;
                case 'Choisir l\'échange': openExchangeModal('Produit sélectionné'); break;
            }
        });
    });

    // --- Modales ---
    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                ${content}
            </div>`;
        modal.style.cssText = `
            display: block; position: fixed; z-index: 1000; left: 0; top: 0;
            width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);`;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background-color: white; margin: 10% auto; padding: 30px;
            border-radius: 8px; width: 90%; max-width: 500px; position: relative;`;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute; right: 15px; top: 15px; font-size: 28px;
            font-weight: bold; cursor: pointer; color: #aaa;`;

        document.body.appendChild(modal);
        closeBtn.addEventListener('click', () => closeModal(modal));
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });

        return modal;
    }

    function closeModal(modal) {
        document.body.removeChild(modal);
    }

    // --- Fonctions modales ---
    function openRentalModal(productTitle) {
        const content = `<h2>Location - ${productTitle}</h2>
            <form class="rental-form">
                <div class="form-group"><label>Date début:</label><input type="date" required></div>
                <div class="form-group"><label>Date fin:</label><input type="date" required></div>
                <div class="form-group"><label>Nom:</label><input type="text" required></div>
                <div class="form-group"><label>Email:</label><input type="email" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Confirmer</button></div>
            </form>`;
        const modal = createModal(content);
        modal.querySelector('.rental-form').addEventListener('submit', function(e) {
            e.preventDefault(); alert('Demande envoyée'); closeModal(modal);
        });
    }

    function openPurchaseModal(productTitle) {
        const content = `<h2>Achat - ${productTitle}</h2>
            <p>Procédez à l'achat de ce produit.</p>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="alert('Paiement en cours')">Paiement</button>
            </div>`;
        createModal(content);
    }

    function openSellModal() {
        const content = `<h2>Vente</h2>
            <form class="sell-form">
                <div class="form-group"><label>Produit:</label><input type="text" required></div>
                <div class="form-group"><label>Prix (DZD):</label><input type="number" required></div>
                <div class="form-group"><label>Description:</label><textarea required></textarea></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Vendre</button></div>
            </form>`;
        const modal = createModal(content);
        modal.querySelector('.sell-form').addEventListener('submit', function(e) {
            e.preventDefault(); alert('Produit mis en vente !'); closeModal(modal);
        });
    }

    function openReservationModal() {
        const content = `<h2>Réservation</h2>
            <form class="reservation-form">
                <div class="form-group"><label>Produit:</label><input type="text" required></div>
                <div class="form-group"><label>Date:</label><input type="date" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Réserver</button></div>
            </form>`;
        const modal = createModal(content);
        modal.querySelector('.reservation-form').addEventListener('submit', function(e) {
            e.preventDefault(); alert('Réservation faite !'); closeModal(modal);
        });
    }

    function openDeliveryModal() {
        const content = `<h2>Livraison</h2>
            <form class="delivery-form">
                <div class="form-group"><label>Adresse:</label><input type="text" required></div>
                <div class="form-group"><label>Ville:</label><input type="text" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Valider</button></div>
            </form>`;
        const modal = createModal(content);
        modal.querySelector('.delivery-form').addEventListener('submit', function(e) {
            e.preventDefault(); alert('Livraison confirmée'); closeModal(modal);
        });
    }

    function openExchangeModal(productTitle) {
        const content = `
            <h2>Échange - ${productTitle}</h2>
            <form class="exchange-form">
                <div class="form-group">
                    <label>Produit que vous proposez en échange:</label>
                    <input type="text" name="exchangeProduct" required>
                </div>
                <div class="form-group">
                    <label>Description de votre produit:</label>
                    <textarea name="description" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label>Valeur estimée:</label>
                    <input type="number" name="estimatedValue" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Proposer l'échange</button>
                </div>
            </form>
        `;
        const modal = createModal(content);
        modal.querySelector('.exchange-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Proposition d\'échange envoyée avec succès!');
            closeModal(modal);
        });
    }

    function openLoginModal() {
        const content = `
            <h2>Connexion</h2>
            <form class="login-form">
                <div class="form-group">
                    <label>Rôle :</label>
                    <select name="role" required>
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group"><label>Email :</label><input type="email" required></div>
                <div class="form-group"><label>Mot de passe :</label><input type="password" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Se connecter</button></div>
            </form>
            <p style="margin-top:10px;">Pas encore de compte ? <a href="#" id="open-register-link">S'inscrire</a></p>
        `;
        const modal = createModal(content);
        modal.querySelector('.login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const role = this.querySelector('select[name="role"]').value;
            alert('Connexion réussie en tant que ' + (role === 'admin' ? 'Admin' : 'Utilisateur') + ' ! (simulation)');
            closeModal(modal);
        });
        modal.querySelector('#open-register-link').addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(modal);
            openRegisterModal();
        });
    }

    function openRegisterModal() {
        const content = `
            <h2>Inscription</h2>
            <form class="register-form">
                <div class="form-group">
                    <label>Rôle :</label>
                    <select name="role" required>
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group"><label>Nom :</label><input type="text" required></div>
                <div class="form-group"><label>Email :</label><input type="email" required></div>
                <div class="form-group"><label>Mot de passe :</label><input type="password" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">S'inscrire</button></div>
            </form>
            <p style="margin-top:10px;">Déjà un compte ? <a href="#" id="open-login-link">Se connecter</a></p>
        `;
        const modal = createModal(content);
        modal.querySelector('.register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const role = this.querySelector('select[name="role"]').value;
            alert('Inscription réussie en tant que ' + (role === 'admin' ? 'Admin' : 'Utilisateur') + ' ! (simulation)');
            closeModal(modal);
        });
        modal.querySelector('#open-login-link').addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(modal);
            openLoginModal();
        });
    }

    // --- Gestion des liens du footer pour afficher les sections info ---
    document.querySelectorAll('footer a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.info-section').forEach(section => {
                    section.style.display = 'none';
                });
                const target = document.querySelector(href);
                if (target) {
                    target.style.display = 'block';
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // --- Gestion du formulaire de contact ---
    const contactForm = document.querySelector('#contact-us form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            alert('Merci pour votre message! Nous vous répondrons dès que possible.');
            this.reset();
        });
    }

    // --- Défilement fluide pour tous les liens d'ancre ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Effet de parallaxe léger sur la section hero ---
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // --- Ajout des styles CSS pour les animations ---
    const styles = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
        }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-color);}
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;}
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);}
        .form-actions { text-align: center; margin-top: 25px; }
        .detail-section { margin-bottom: 20px; }
        .detail-section h3 { color: var(--primary-color); margin-bottom: 10px; }
        .detail-section ul { padding-left: 20px; }
        .detail-section li { margin-bottom: 5px; }
        .price-summary { background-color: var(--light-bg); padding: 15px; border-radius: 4px; margin: 20px 0; }
        .product-details {
            display: none;
            margin: 10px 0 0 0;
            padding-left: 18px;
            font-size: 0.97em;
            color: #444;
            list-style: disc inside;
        }
        .product-details.active {
            display: block;
        }
        .product-details li {
            margin-bottom: 3px;
        }
        @media (max-width: 768px) {
            .nav-open { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background-color: white; box-shadow: var(--shadow); padding: 20px;}
            nav ul { display: none; }
            .user-actions { flex-direction: column; gap: 10px; }
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // --- Fonctions utilitaires ---
    window.formatPrice = function(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'DZD'
        }).format(price);
    };

    window.validateEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    console.log('NovaShop/LocEchange JavaScript chargé avec succès!');

    // --- Filtrage détaillé des produits ---
    function getProductData(card) {
        return {
            category: card.getAttribute('data-category') || '',
            etat: (() => {
                const li = card.querySelector('.product-details li');
                return li ? li.textContent.replace('État :', '').trim() : '';
            })(),
            ville: (() => {
                const lis = card.querySelectorAll('.product-details li');
                if (lis.length > 0) {
                    const last = lis[lis.length - 1].textContent;
                    return last.includes('Disponibilité') ? last.replace('Disponibilité :', '').trim() : '';
                }
                return '';
            })(),
            prix: (() => {
                const txt = card.querySelector('.product-price')?.textContent || '';
                const match = txt.match(/(\d+)[\s ]?DZD/);
                return match ? parseInt(match[1], 10) : null;
            })()
        };
    }

    function filterDetailedProducts() {
        const cat = document.getElementById('filter-category').value;
        const etat = document.getElementById('filter-etat').value;
        const ville = document.getElementById('filter-ville').value;
        const prixMin = document.getElementById('filter-prix-min').value ? parseInt(document.getElementById('filter-prix-min').value, 10) : null;
        const prixMax = document.getElementById('filter-prix-max').value ? parseInt(document.getElementById('filter-prix-max').value, 10) : null;

        document.querySelectorAll('.product-card').forEach(card => {
            const data = getProductData(card);
            let show = true;
            if (cat && data.category !== cat) show = false;
            if (etat && data.etat !== etat) show = false;
            if (ville && data.ville !== ville) show = false;
            if (prixMin !== null && (data.prix === null || data.prix < prixMin)) show = false;
            if (prixMax !== null && (data.prix === null || data.prix > prixMax)) show = false;
            card.style.display = show ? 'block' : 'none';
        });
    }

    const filterBtn = document.getElementById('filter-btn');
    const resetBtn = document.getElementById('reset-filter-btn');
    if (filterBtn && resetBtn) {
        filterBtn.addEventListener('click', filterDetailedProducts);
        resetBtn.addEventListener('click', function() {
            document.getElementById('filter-category').value = '';
            document.getElementById('filter-etat').value = '';
            document.getElementById('filter-ville').value = '';
            document.getElementById('filter-prix-min').value = '';
            document.getElementById('filter-prix-max').value = '';
            document.querySelectorAll('.product-card').forEach(card => card.style.display = 'block');
        });
    }

// --- Panier ---
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');

// Ajouter au panier
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.product-card');
        const title = card.querySelector('.product-title').textContent;
        const price = card.querySelector('.product-price').textContent;
        cart.push({ title, price });
        cartCount.textContent = cart.length;
    });
});

// Afficher le panier (modale simple)
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        let content = '<h2>Votre panier</h2>';
        if (cart.length === 0) {
            content += '<p>Le panier est vide.</p>';
        } else {
            content += '<ul style="margin-bottom:20px;">' +
                cart.map(item => `<li>${item.title} - <span style="color:#3498db">${item.price}</span></li>`).join('') +
                '</ul>';
            content += '<button class="btn btn-primary" id="checkout-btn">Valider la commande</button>';
        }
        const modal = createModal(content);
        if (cart.length > 0) {
            modal.querySelector('#checkout-btn').addEventListener('click', function() {
                alert('Commande validée ! (simulation)');
                cart = [];
                cartCount.textContent = '0';
                closeModal(modal);
            });
        }
    });
}


});