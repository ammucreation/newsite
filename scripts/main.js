document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const navLinksContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close mobile menu
  closeBtn.addEventListener('click', () => {
    navLinksContainer.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links-container') && 
        !e.target.closest('.mobile-menu-btn') &&
        navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });



  // Load products
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('products-container').innerHTML = `
      <div class="error-message">
        <p>Sorry, we couldn't load the products at this time. Please try again later.</p>
      </div>
    `;
  }
}

function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-products">
        <p>No products available at this time.</p>
      </div>
    `;
    return;
  }
  
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">
          <span class="current-price">${product.price}</span>
          <span class="old-price">${product.originalPrice}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <a href="${product.buyLink}" class="btn" target="_blank">Buy Now</a>
          <a href="${product.demoLink}" class="btn btn-outline" target="_blank">View Demo</a>
        </div>
      </div>
    </div>
  `).join('');
}





// Add these variables at the top
const searchInput = document.getElementById('searchInput');
const tagList = document.getElementById('tagList');
let allProducts = [];
let selectedTags = new Set();

// Update loadProducts function
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    
    allProducts = await response.json();
    displayProducts(allProducts);
    setupSearch();
    setupTagFilters();
    
  } catch (error) {
    console.error('Error loading products:', error);
    showErrorMessage();
  }
}

// New function to setup tag filters
function setupTagFilters() {
  // Get all unique tags from products
  const allTags = new Set();
  allProducts.forEach(product => {
    if (product.tags) {
      product.tags.forEach(tag => allTags.add(tag.toLowerCase()));
    }
  });
  
  // Create tag filter buttons
  tagList.innerHTML = '';
  allTags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag-item';
    tagElement.textContent = tag;
    tagElement.addEventListener('click', () => toggleTagFilter(tag));
    tagList.appendChild(tagElement);
  });
}

// Toggle tag selection
function toggleTagFilter(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }
  
  // Update UI
  document.querySelectorAll('.tag-item').forEach(item => {
    if (item.textContent === tag) {
      item.classList.toggle('active');
    }
  });
  
  filterProducts();
}

// Setup search functionality
function setupSearch() {
  searchInput.addEventListener('input', () => filterProducts());
}

// Main filtering function
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  const filteredProducts = allProducts.filter(product => {
    // Search term matching
    const matchesSearch = searchTerm === '' || 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
    
    // Tag matching
    const matchesTags = selectedTags.size === 0 ||
      (product.tags && Array.from(selectedTags).every(tag => 
        product.tags.map(t => t.toLowerCase()).includes(tag)));
    
    return matchesSearch && matchesTags;
  });
  
  displayProducts(filteredProducts);
}

// Update displayProducts to show "no results" message
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try different search terms or tags</p>
      </div>
    `;
    return;
  }
  
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        ${product.tags ? `<div class="product-tags">${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}</div>` : ''}
        <div class="product-price">
          <span class="current-price">${product.price}</span>
          <span class="old-price">${product.originalPrice}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <a href="${product.buyLink}" class="btn btn-primary" target="_blank">Buy Now</a>
          <a href="${product.demoLink}" class="btn btn-outline" target="_blank">View Demo</a>
        </div>
      </div>
    </div>
  `).join('');
}


















// For all pages
document.addEventListener('DOMContentLoaded', function() {
  // Close mobile menu when clicking a nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
    });
  });
  
  // Product Detail Page - Image Gallery
  if (document.querySelector('.product-gallery')) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Change main image
        const newSrc = this.src.replace('-thumb', '-main');
        mainImage.src = newSrc;
        mainImage.alt = this.alt.replace('Thumbnail', 'Main Preview');
      });
    });
  }
  
  // Product Detail Page - Tabs
  if (document.querySelector('.product-tabs')) {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Remove active class from all tab links and contents
        tabLinks.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab link
        this.classList.add('active');
        
        // Show corresponding tab content
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Contact Page - FAQ Accordion
  if (document.querySelector('.faq-section')) {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        // Toggle active class on question
        this.classList.toggle('active');
        
        // Toggle answer visibility
        const answer = this.nextElementSibling;
        answer.classList.toggle('active');
      });
    });
  }
  
  // About Page - Animation for stats
  if (document.querySelector('.stats-container')) {
    const statItems = document.querySelectorAll('.stat-item h3');
    
    const animateStats = () => {
      statItems.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 20;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            current = target;
          }
          stat.textContent = Math.floor(current);
        }, 50);
      });
    };
    
    // Trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.stats-container'));
  }
});








