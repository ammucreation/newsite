// Page-Specific Features (Product Details, Product Gallery, etc.  products details page)
function setupImageGallery() {
  if (!document.querySelector('.product-gallery')) return;

  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelectorAll('.thumbnail');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image
      const newSrc = this.src.replace('-thumb', '-main');
      mainImage.src = newSrc;
      mainImage.alt = this.alt.replace('Thumbnail', 'Main Preview');
      
      // Optional: Add smooth transition
      mainImage.style.opacity = 0;
      setTimeout(() => {
        mainImage.style.opacity = 1;
      }, 100);
    });
  });
}

function setupTabs() {
  if (!document.querySelector('.product-tabs')) return;

  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  // Initialize first tab as active by default
  if (tabLinks.length > 0 && tabContents.length > 0) {
    tabLinks[0].classList.add('active');
    tabContents[0].classList.add('active');
  }

  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tabs
      tabLinks.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const tabId = this.getAttribute('data-tab');
      if (tabId) {
        document.getElementById(tabId).classList.add('active');
      }
    });
  });
}

function setupFAQAccordion() {
  if (!document.querySelector('.faq-section')) return;

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function() {
      // Toggle current item
      const isOpening = !this.classList.contains('active');
      
      // Close all other items if opening this one
      if (isOpening) {
        faqItems.forEach(faq => {
          if (faq !== item) {
            faq.querySelector('.faq-question').classList.remove('active');
            faq.querySelector('.faq-answer').classList.remove('active');
          }
        });
      }
      
      // Toggle current item
      this.classList.toggle('active');
      answer.classList.toggle('active');
      
      // Optional: Smooth height transition
      if (answer.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = 0;
      }
    });
  });
}

function setupStatsAnimation() {
  if (!document.querySelector('.stats-container')) return;

  const statItems = document.querySelectorAll('.stat-item h3');
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats(entry.target.querySelectorAll('h3'));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(document.querySelector('.stats-container'));
}

function animateStats(statItems) {
  statItems.forEach(stat => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 30; // Smoother animation
    const duration = 1500; // 1.5 seconds
    const intervalTime = duration / (target / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      stat.textContent = Math.floor(current);
    }, intervalTime);
  });
}

// Initialize all page-specific features
document.addEventListener('DOMContentLoaded', function() {
  setupImageGallery();
  setupTabs();
  setupFAQAccordion();
  setupStatsAnimation();
});