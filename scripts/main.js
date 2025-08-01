document.addEventListener('DOMContentLoaded', function() {
  // Pagination variables
  let currentPage = 1;
  const productsPerPage = 6;
  let allProducts = [];
  let filteredProducts = [];

  // DOM elements
  const productsContainer = document.getElementById('products-container');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const tagList = document.getElementById('tagList');
  let selectedTags = new Set();

  // Mobile menu elements
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const navLinksContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Initialize
  loadProducts();
  setupMobileMenu();

  // Mobile Menu Functionality
  function setupMobileMenu() {
    function toggleMobileMenu(open) {
      navLinksContainer.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu(true);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu(false);
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('active')) {
          toggleMobileMenu(false);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-links-container') &&
          !e.target.closest('#mobileMenuBtn') &&
          navLinksContainer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
  }

  // Product Loading and Display
  async function loadProducts() {
    try {
      showLoading();
      
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('Failed to load products');
      
      allProducts = await response.json();
      filteredProducts = [...allProducts];
      
      displayProducts();
      setupTagFilters();
      setupSearch();
      
      hideLoading();
    } catch (error) {
      console.error('Error loading products:', error);
      showErrorMessage();
      hideLoading();
    }
  }

  function displayProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try different search terms or tags</p>
        </div>
      `;
    } else {
      productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card">
          <div class="product-row">
            <div class="product-left">
              <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-content">
              <h3 class="product-title">${product.title}</h3>
              ${product.tags ? `<div class="product-tags">${
                product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')
              }</div>` : ''}
              <div class="price-row">
                <span class="price-new">${product.priceNew}</span>
                <span class="price-old">${product.priceOld}</span>
                <span class="price-off">${product.priceOff}</span>
              </div>
              <p class="product-info">${product.info}</p>
              <a href="${product.link}" class="view-btn" target="_blank">View Details</a>
            </div>
          </div>
        </div>
      `).join('');
    }
    
    updatePaginationControls();
  }

  // Pagination Controls (without auto-scroll to top)
  function updatePaginationControls() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    let pageButtons = '';
    for (let i = startPage; i <= endPage; i++) {
      pageButtons += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    const showFirstEllipsis = startPage > 1;
    const showLastEllipsis = endPage < totalPages;

    paginationContainer.innerHTML = `
      <button class="nav-btn first-btn" ${currentPage === 1 ? 'disabled' : ''}>
        &laquo; First
      </button>
      <button class="nav-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
        &lsaquo; Prev
      </button>
      ${showFirstEllipsis ? '<span class="ellipsis">...</span>' : ''}
      ${pageButtons}
      ${showLastEllipsis ? '<span class="ellipsis">...</span>' : ''}
      <button class="nav-btn next-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
        Next &rsaquo;
      </button>
      <button class="nav-btn last-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
        Last &raquo;
      </button>
      <span class="page-info">Page ${currentPage} of ${totalPages}</span>
    `;

    // Event listeners without scroll-to-top
    document.querySelector('.first-btn')?.addEventListener('click', () => {
      if (currentPage > 1) goToPage(1);
    });

    document.querySelector('.last-btn')?.addEventListener('click', () => {
      if (currentPage < totalPages) goToPage(totalPages);
    });

    document.querySelector('.prev-btn')?.addEventListener('click', () => {
      if (currentPage > 1) goToPage(currentPage - 1);
    });

    document.querySelector('.next-btn')?.addEventListener('click', () => {
      if (currentPage < totalPages) goToPage(currentPage + 1);
    });

    document.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        goToPage(page);
      });
    });
  }

  function goToPage(page) {
    if (page !== currentPage) {
      currentPage = page;
      displayProducts();
      // No scroll-to-top here
    }
  }

  // Search and Filter Functionality
  function setupSearch() {
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentPage = 1;
        filterProducts();
      }, 300);
    });
  }

  function setupTagFilters() {
    const allTags = new Set();
    allProducts.forEach(product => {
      product.tags?.forEach(tag => allTags.add(tag.toLowerCase()));
    });

    tagList.innerHTML = '';
    allTags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag-item';
      tagElement.textContent = tag;
      tagElement.addEventListener('click', () => {
        tagElement.classList.toggle('active');
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
        } else {
          selectedTags.add(tag);
        }
        currentPage = 1;
        filterProducts();
      });
      tagList.appendChild(tagElement);
    });
  }

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredProducts = allProducts.filter(product => {
      const matchesSearch = searchTerm === '' ||
        product.title.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

      const matchesTags = selectedTags.size === 0 ||
        (product.tags && Array.from(selectedTags).every(tag => 
          product.tags.map(t => t.toLowerCase()).includes(tag)));

      return matchesSearch && matchesTags;
    });
    
    displayProducts();
  }

  // Utility Functions
  function showLoading() {
    productsContainer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
  }

  function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) loadingElement.remove();
  }

  function showErrorMessage() {
    productsContainer.innerHTML = `
      <div class="error">
        <p>Failed to load products. Please try again later.</p>
      </div>
    `;
  }
});


