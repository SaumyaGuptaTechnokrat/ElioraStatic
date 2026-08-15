// ---------------------------------------------------------
// ELIORA — site behaviours
// ---------------------------------------------------------

// Mark active link in top + bottom nav based on current page
(function setActiveNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .bottomnav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
})();

// Product category filter + live search (products.html)
(function productFilter(){
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('product-search');
  const noResults = document.getElementById('no-results');
  if(!buttons.length) return;

  let activeCategory = 'all';

  function applyFilters(){
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card=>{
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const nameEl = card.querySelector('h3');
      const descEl = card.querySelector('.product-body p');
      const name = nameEl ? nameEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';
      const searchMatch = query === '' || name.includes(query) || desc.includes(query);

      const visible = categoryMatch && searchMatch;
      card.style.display = visible ? '' : 'none';
      if(visible) visibleCount++;
    });

    if(noResults){
      noResults.classList.toggle('show', visibleCount === 0);
    }
  }

  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  if(searchInput){
    searchInput.addEventListener('input', applyFilters);
  }

  // Support ?category= query param coming from home page category cards
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if(cat){
    const target = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
    if(target){
      buttons.forEach(b=>b.classList.remove('active'));
      target.classList.add('active');
      activeCategory = cat;
    }
  }

  applyFilters();
})();

// Enquiry form (contact.html)
(function enquiryForm(){
  const form = document.getElementById('enquiry-form');
  if(!form) return;
  const success = document.getElementById('form-success');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    // Basic client-side validation feedback is handled by required attrs.
    success.classList.add('show');
    form.reset();
    success.scrollIntoView({behavior:'smooth', block:'center'});
  });
})();

// Simple scroll-reveal for cards/sections
(function reveal(){
  const items = document.querySelectorAll('.cat-card, .product-card, .process-step, .trust-item');
  if(!('IntersectionObserver' in window) || !items.length) return;
  items.forEach(el=>{ el.style.opacity=0; el.style.transform='translateY(16px)'; el.style.transition='opacity .6s ease, transform .6s ease'; });
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  items.forEach(el=>io.observe(el));
})();