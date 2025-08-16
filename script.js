// Cart functionality
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.updateCartPreview();
        this.setupEventListeners();
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
        document.getElementById('mobile-cart-count').textContent = totalItems;
    }

    updateCartPreview() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSubtotal = document.getElementById('cart-subtotal');
        
        if (this.cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.innerHTML = '';
            cartSubtotal.textContent = '$0.00';
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        
        let itemsHTML = '';
        let subtotal = 0;
        
        this.cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemsHTML += `
                <div class="flex justify-between items-center py-2 border-b">
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <div class="flex items-center mt-1">
                            <button class="decrease-quantity text-xs bg-gray-200 hover:bg-gray-300 rounded-full h-5 w-5 flex items-center justify-center" data-id="${item.id}">-</button>
                            <span class="mx-2 text-sm">${item.quantity}</span>
                            <button class="increase-quantity text-xs bg-gray-200 hover:bg-gray-300 rounded-full h-5 w-5 flex items-center justify-center" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-item block text-xs text-red-500 hover:text-red-700 mt-1" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    addToCart(id, name, price) {
        const existingItem = this.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id,
                name,
                price: parseFloat(price),
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(name);
    }

    updateQuantity(id, change) {
        const item = this.cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(item => item.id !== id);
            }
            
            this.saveCart();
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartPreview();
    }

    showNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg cart-notification';
        notification.textContent = `${itemName} added to cart!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    setupEventListeners() {
        // Cart toggle
        document.getElementById('cart-toggle').addEventListener('click', () => this.toggleCart());
        document.getElementById('mobile-cart-toggle').addEventListener('click', () => this.toggleCart());
        
        // Clear cart
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());
        
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const id = e.target.getAttribute('data-id');
                const name = e.target.getAttribute('data-name');
                const price = e.target.getAttribute('data-price');
                this.addToCart(id, name, price);
            }
            
            if (e.target.classList.contains('decrease-quantity')) {
                const id = e.target.getAttribute('data-id');
                this.updateQuantity(id, -1);
            }
            
            if (e.target.classList.contains('increase-quantity')) {
                const id = e.target.getAttribute('data-id');
                this.updateQuantity(id, 1);
            }
            
            if (e.target.classList.contains('remove-item')) {
                const id = e.target.getAttribute('data-id');
                this.removeFromCart(id);
            }
        });
    }

    toggleCart() {
        document.getElementById('cart-preview').classList.toggle('open');
        // Close other open overlays
        document.getElementById('table-booking-form').classList.remove('open');
    }
}

// Menu functionality
class Menu {
    constructor() {
        this.menuItems = [
            {
                id: 5,
                name: "Bruschetta",
                price: 9.99,
                category: "starters",
                description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
                image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 6,
                name: "Calamari",
                price: 12.99,
                category: "starters",
                description: "Crispy fried squid served with lemon aioli",
                image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 7,
                name: "Filet Mignon",
                price: 34.99,
                category: "mains",
                description: "8oz tender beef filet with truffle mashed potatoes",
                image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 8,
                name: "Grilled Salmon",
                price: 26.99,
                category: "mains",
                description: "Fresh Atlantic salmon with lemon butter sauce",
                image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 9,
                name: "Tiramisu",
                price: 10.99,
                category: "desserts",
                description: "Classic Italian dessert with coffee-soaked ladyfingers",
                image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 10,
                name: "Chocolate Lava Cake",
                price: 11.99,
                category: "desserts",
                description: "Warm chocolate cake with a molten center, served with ice cream",
                image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 11,
                name: "Craft Cocktails",
                price: 12.99,
                category: "drinks",
                description: "Ask your server about our seasonal craft cocktails",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 12,
                name: "Wine Selection",
                price: 9.99,
                category: "drinks",
                description: "Glass of our sommelier's selected wines",
                image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
        ];
        
        this.init();
    }

    init() {
        this.renderMenuItems();
        this.setupEventListeners();
    }

    renderMenuItems(category = 'all') {
        const container = document.getElementById('menu-items-container');
        let filteredItems = this.menuItems;
        
        if (category !== 'all') {
            filteredItems = this.menuItems.filter(item => item.category === category);
        }
        
        container.innerHTML = filteredItems.map(item => `
            <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 menu-item">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover transition duration-300">
                <div class="p-6">
                    <div class="flex justify-between items-start">
                        <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
                        <span class="text-primary font-bold">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${item.description}</p>
                    <button class="add-to-cart bg-secondary hover:bg-opacity-90 text-white py-1 px-4 rounded-full text-sm transition" 
                            data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.querySelectorAll('.food-category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                
                // Update active button
                document.querySelectorAll('.food-category-btn').forEach(btn => {
                    btn.classList.remove('active', 'bg-primary', 'text-white');
                    btn.classList.add('bg-gray-200');
                });
                
                e.target.classList.add('active', 'bg-primary', 'text-white');
                e.target.classList.remove('bg-gray-200');
                
                this.renderMenuItems(category);
            });
        });
    }
}

// Booking functionality
class Booking {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setMinBookingDate();
    }

    setupEventListeners() {
        // Booking form toggle
        document.getElementById('reservation-toggle').addEventListener('click', () => this.toggleBookingForm());
        document.getElementById('mobile-reservation-toggle').addEventListener('click', () => this.toggleBookingForm());
        document.getElementById('hero-reservation-btn').addEventListener('click', () => this.toggleBookingForm());
        document.getElementById('footer-reservation-btn').addEventListener('click', () => this.toggleBookingForm());
        document.getElementById('close-booking-form').addEventListener('click', () => this.toggleBookingForm());
        
        // Booking form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    toggleBookingForm() {
        document.getElementById('table-booking-form').classList.toggle('hidden');
        document.getElementById('table-booking-form').classList.toggle('flex');
        // Close cart if open
        document.getElementById('cart-preview').classList.remove('open');
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('booking-name').value;
        const email = document.getElementById('booking-email').value;
        const phone = document.getElementById('booking-phone').value;
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const guests = document.getElementById('booking-guests').value;
        const notes = document.getElementById('booking-notes').value;
        
        // Here you would typically send this data to your server
        console.log('Booking submitted:', { name, email, phone, date, time, guests, notes });
        
        // Show success message
        alert(`Thank you, ${name}! Your table for ${guests} on ${date} at ${time} has been reserved. We'll send a confirmation to ${email}.`);
        
        // Reset form and close
        document.getElementById('booking-form').reset();
        this.toggleBookingForm();
    }

    setMinBookingDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').min = today;
    }
}

// Image Modal functionality
class ImageModal {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'image-modal') {
                this.close();
            }
        });
    }

    open(src) {
        document.getElementById('modal-image').src = src;
        document.getElementById('image-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.getElementById('image-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    const cart = new Cart();
    
    // Initialize menu
    const menu = new Menu();
    
    // Initialize booking system
    const booking = new Booking();
    
    // Initialize image modal
    const imageModal = new ImageModal();
    
    // Initialize mobile menu
    const mobileMenu = new MobileMenu();
    
    // Global functions for inline event handlers
    window.openImageModal = (src) => imageModal.open(src);
    window.closeImageModal = () => imageModal.close();
    window.openInstagram = () => window.open('https://www.instagram.com/explore/tags/food/', '_blank');
});