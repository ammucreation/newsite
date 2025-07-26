document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const navLinksContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelectorAll('.nav-links a');

  function closeMobileMenu() {
    navLinksContainer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close mobile menu
  closeBtn.addEventListener('click', closeMobileMenu);

  // Close menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links-container') &&
        !e.target.closest('#mobileMenuBtn') &&
        navLinksContainer.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  loadProducts(); // Load product cards
});

const searchInput = document.getElementById('searchInput');
const tagList = document.getElementById('tagList');
let allProducts = [];
let selectedTags = new Set();

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

function setupTagFilters() {
  const allTags = new Set();
  allProducts.forEach(product => {
    if (product.tags) {
      product.tags.forEach(tag => allTags.add(tag.toLowerCase()));
    }
  });

  tagList.innerHTML = '';
  allTags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag-item';
    tagElement.textContent = tag;
    tagElement.addEventListener('click', () => toggleTagFilter(tag));
    tagList.appendChild(tagElement);
  });
}

function toggleTagFilter(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }

  document.querySelectorAll('.tag-item').forEach(item => {
    if (item.textContent === tag) {
      item.classList.toggle('active');
    }
  });

  filterProducts();
}

function setupSearch() {
  searchInput.addEventListener('input', () => filterProducts());
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = searchTerm === '' ||
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

    const matchesTags = selectedTags.size === 0 ||
      (product.tags && Array.from(selectedTags).every(tag =>
        product.tags.map(t => t.toLowerCase()).includes(tag)));

    return matchesSearch && matchesTags;
  });

  displayProducts(filteredProducts);
}

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
    <div class="product-row">
      <div class="product-left">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.title}</h3>
        ${product.tags ? `<div class="product-tags">${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}</div>` : ''}
        <div class="price-row">
          <span class="price-new">${product.priceNew}</span>
          <span class="price-old">${product.priceOld}</span>
          <span class="price-off">${product.priceOff}</span>
        </div>
        <p class="product-info">${product.info}</p>
        <a href="${product.link}" class="view-btn" title="Click to view more" target="_blank">View Detail’s</a>
      </div>
    </div>
  </div>
  `).join('');
}

function showErrorMessage() {
  document.getElementById('products-container').innerHTML = `
    <div class="error-message">
      <p>Sorry, we couldn't load the products at this time. Please try again later.</p>
    </div>
  `;
}

// For All Pages - Detail & Utility Scripts
document.addEventListener('DOMContentLoaded', function () {
  const navLinksContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
    });
  });

  // Image Gallery
  if (document.querySelector('.product-gallery')) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function () {
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const newSrc = this.src.replace('-thumb', '-main');
        mainImage.src = newSrc;
        mainImage.alt = this.alt.replace('Thumbnail', 'Main Preview');
      });
    });
  }

  // Tabs
  if (document.querySelector('.product-tabs')) {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
      link.addEventListener('click', function () {
        tabLinks.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // FAQ Accordion
  if (document.querySelector('.faq-section')) {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
      question.addEventListener('click', function () {
        this.classList.toggle('active');
        const answer = this.nextElementSibling;
        answer.classList.toggle('active');
      });
    });
  }

  // Animated Stats
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
