const cache = {};
let currentLang = 'en';

function heroFormSubmit() {
  const name = (document.getElementById('hero-name')?.value || '').trim();
  const phone = (document.getElementById('hero-phone')?.value || '').trim();
  const plotSize = (document.getElementById('hero-plot-size')?.value || '').trim();

  if (!name || !phone) {
    // Shake the form to indicate missing fields
    const form = document.getElementById('hero-name')?.closest('.relative.bg-white\\/10');
    if (form) { form.classList.add('animate-[shake_0.3s_ease-in-out]'); setTimeout(() => form.classList.remove('animate-[shake_0.3s_ease-in-out]'), 500); }
    return;
  }

  const sizeLabel = plotSize === '30x50' ? '30×50 ft (Standard)' : plotSize === '30x70' ? '30×70 ft (Premium)' : 'Not decided yet';
  const msg = `Hello Shiva Kumar Sir 🙏\n\nI am interested in Happy World Layout plots.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Preferred Plot Size:* ${sizeLabel}\n\nPlease share the plot details and pricing. Thank you!`;

  window.open(`https://wa.me/919945608767?text=${encodeURIComponent(msg)}`, '_blank');
}


async function loadComponent(componentName) {
  const container = document.getElementById('content-' + componentName);
  
  if (cache[componentName]) {
    container.innerHTML = cache[componentName];
    applyLanguage(); // Re-apply language to newly injected content
    return;
  }
  
  try {
    const res = await fetch(`components/${componentName}.html`);
    const html = await res.text();
    cache[componentName] = html;
    container.innerHTML = html;
    applyLanguage(); // Re-apply language to newly injected content
  } catch(e) {
    console.error("Error loading component:", e);
    container.innerHTML = `<p class="text-error p-4">Error loading content.</p>`;
  }
}

async function switchPage(pageId) {
  const pages = ['home', 'about'];
  
  for (const p of pages) {
    const container = document.getElementById('page-' + p);
    if (!container) continue;
    
    if (p === pageId) {
      container.classList.remove('hidden');
      container.classList.add('flex');
      
      if (p === 'about' && container.innerHTML.trim() === '') {
        try {
          const res = await fetch(`components/about-me.html`);
          const html = await res.text();
          container.innerHTML = html;
          applyLanguage();
        } catch(e) {
          console.error("Error loading about component:", e);
          container.innerHTML = `<p class="text-error p-4">Error loading content.</p>`;
        }
      }
      
      window.scrollTo(0, 0);
    } else {
      container.classList.add('hidden');
      container.classList.remove('flex');
    }
  }

  // Update Mobile Nav Active States
  const navHome = document.getElementById('nav-btn-home');
  const navAbout = document.getElementById('nav-btn-about');
  if (navHome && navAbout) {
    if (pageId === 'home') {
      navHome.className = 'flex flex-col items-center justify-center w-[60px] h-[50px] rounded-full transition-all text-primary bg-primary/5';
      navAbout.className = 'flex flex-col items-center justify-center w-[60px] h-[50px] rounded-full text-outline hover:text-primary transition-all';
    } else {
      navHome.className = 'flex flex-col items-center justify-center w-[60px] h-[50px] rounded-full text-outline hover:text-primary transition-all';
      navAbout.className = 'flex flex-col items-center justify-center w-[60px] h-[50px] rounded-full transition-all text-primary bg-primary/5';
    }
  }
}

async function switchCategory(cat) {
  const tabs = ['villa-plots', 'gated-layouts', 'commercial-land'];
  
  for (const t of tabs) {
    const btn = document.getElementById('tab-' + t);
    const content = document.getElementById('content-' + t);
    
    if (t === cat) {
      btn.className = 'flex-1 min-w-[100px] py-2 px-3 rounded-lg bg-primary-container text-on-primary font-label-badge text-label-badge transition-all flex items-center justify-center gap-1 shadow-sm';
      content.classList.remove('hidden');
      content.classList.add('grid');
      
      // Fetch the component HTML on demand
      if (content.innerHTML.trim() === '') {
        await loadComponent(cat);
      }
    } else {
      btn.className = 'flex-1 min-w-[100px] py-2 px-3 rounded-lg text-on-surface-variant hover:text-primary font-label-badge text-label-badge transition-all flex items-center justify-center gap-1';
      content.classList.add('hidden');
      content.classList.remove('grid');
    }
  }
}

// ----------------------------------------------------
// Lead Form Logic
// ----------------------------------------------------
function selectDate(btn, val) {
  // Reset all chips
  const chips = document.querySelectorAll('.date-chip');
  chips.forEach(c => {
    c.classList.remove('bg-primary', 'text-white', 'border-primary');
    c.classList.add('bg-surface-container-low', 'border-surface-container', 'text-on-surface', 'hover:bg-primary/5');
  });
  
  // Highlight selected chip
  btn.classList.remove('bg-surface-container-low', 'border-surface-container', 'text-on-surface', 'hover:bg-primary/5');
  btn.classList.add('bg-primary', 'text-white', 'border-primary');
  
  // Update hidden input
  document.getElementById('visit-date').value = val;
}

function submitInquiry() {
  const name = document.getElementById('visitor-name').value;
  const phone = document.getElementById('visitor-phone').value;
  const propType = document.querySelector('input[name="property_type"]:checked').value;
  
  const successNotice = document.getElementById('form-success');
  successNotice.classList.remove('hidden');
  
  // Compose WhatsApp fallback redirect
  const waMsg = encodeURIComponent("Hello Shiva Kumar Sir, I have an inquiry.\nName: " + name + "\nPhone: " + phone + "\nCategory: " + propType);
  setTimeout(() => {
    window.open("https://wa.me/919945608767?text=" + waMsg, '_blank');
  }, 700);
}

// ----------------------------------------------------
// Language Switcher Logic
// ----------------------------------------------------
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'kn' : 'en';
  
  // Update toggle button visuals
  const btnEn = document.getElementById('lang-en');
  const btnKn = document.getElementById('lang-kn');
  
  if (currentLang === 'en') {
    btnEn.className = 'px-2 py-1 rounded-lg transition-all bg-secondary text-primary shadow-sm';
    btnKn.className = 'px-2 py-1 rounded-lg transition-all text-white/60 hover:text-white';
  } else {
    btnKn.className = 'px-2 py-1 rounded-lg transition-all bg-secondary text-primary shadow-sm';
    btnEn.className = 'px-2 py-1 rounded-lg transition-all text-white/60 hover:text-white';
  }

  applyLanguage();
}

function applyLanguage() {
  // Plain text elements
  const elements = document.querySelectorAll('[data-en][data-kn]');
  elements.forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  // Rich HTML elements (gold accents etc.)
  const htmlElements = document.querySelectorAll('[data-en-html][data-kn-html]');
  htmlElements.forEach(el => {
    el.innerHTML = el.getAttribute(`data-${currentLang}-html`);
  });
}

// ----------------------------------------------------
// EMI Calculator Logic
// ----------------------------------------------------
function updateEmi() {
  const plotVal = parseInt(document.getElementById('range-plot').value);
  const dpPercent = parseInt(document.getElementById('range-dp').value);
  const years = parseInt(document.getElementById('range-years').value);
  
  const dpAmount = plotVal * (dpPercent / 100);
  const loanAmount = plotVal - dpAmount;
  
  const r = 8.5 / 12 / 100; // 8.5% annual interest rate monthly
  const n = years * 12; // total months
  
  // EMI formula = [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = loanAmount > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  
  // Update UI Labels
  document.getElementById('val-plot').innerText = formatCurrency(plotVal);
  document.getElementById('val-dp').innerText = `${dpPercent}% (${formatCurrency(dpAmount)})`;
  document.getElementById('val-years').innerText = `${years} Years`;
  document.getElementById('val-loan').innerText = formatCurrency(loanAmount);
  document.getElementById('val-emi').innerText = formatCurrency(Math.round(emi));
}

function formatCurrency(num) {
  return '₹' + num.toLocaleString('en-IN');
}

// ----------------------------------------------------
// Initialization
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  switchCategory('villa-plots');
  
  // Initialize counters animation
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const suffix = counter.getAttribute('data-suffix') || '';
    
    // Simple instant set for now, can be animated later
    counter.innerText = target + suffix;
  });
});
