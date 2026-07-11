import { faqData } from './faq-data';

interface SPHistoryEntry {
  query: string;
  amount: number;
  type: 'award' | 'penalty';
  date: string;
}

interface User {
  name: string;
  email: string;
  password?: string;
  date: string;
  status: string;
  lastSignIn: string;
  sp?: number;
  spHistory?: SPHistoryEntry[];
  attendance?: string[];
}

interface Admin {
  email: string;
  password?: string;
}

interface Query {
  term: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  proposedAnswer?: string;
  proposedBy?: string;
}

interface ResolvedQuery {
  term: string;
  answer: string;
  userName: string;
  userEmail: string;
  resolvedBy: string;
}

interface SavedFaq {
  question: string;
  answer: string;
  category: string;
}

// LocalStorage State (Clean slate)
let users: User[] = JSON.parse(localStorage.getItem('faq_users_v2') || '[]');

let admins: Admin[] = JSON.parse(localStorage.getItem('faq_admins_v2') || '[]');

let unresolvedQueries: Query[] = JSON.parse(localStorage.getItem('faq_queries_v2') || '[]');

let resolvedQueries: ResolvedQuery[] = JSON.parse(localStorage.getItem('faq_resolved_v2') || '[]');

function getSavedFaqs(): SavedFaq[] {
  return JSON.parse(localStorage.getItem('faq_saved_v2') || '[]');
}

function setSavedFaqs(faqs: SavedFaq[]) {
  localStorage.setItem('faq_saved_v2', JSON.stringify(faqs));
}

function isFaqSaved(question: string): boolean {
  return getSavedFaqs().some(f => f.question === question);
}

function toggleSavedFaq(question: string, answer: string, category: string) {
  let saved = getSavedFaqs();
  const idx = saved.findIndex(f => f.question === question);
  if (idx !== -1) {
    saved.splice(idx, 1);
  } else {
    saved.push({ question, answer, category });
  }
  setSavedFaqs(saved);
}

function saveState() {
  localStorage.setItem('faq_users_v2', JSON.stringify(users));
  localStorage.setItem('faq_admins_v2', JSON.stringify(admins));
  localStorage.setItem('faq_queries_v2', JSON.stringify(unresolvedQueries));
  localStorage.setItem('faq_resolved_v2', JSON.stringify(resolvedQueries));
}

// Admin-added FAQs (persisted separately so they survive page refresh)
interface AdminAddedFaq {
  question: string;
  answer: string;
  categoryIndex: number;
  addedBy: string;
  addedDate: string;
  askerEmail: string;
}

function getAdminAddedFaqs(): AdminAddedFaq[] {
  return JSON.parse(localStorage.getItem('faq_admin_added_v2') || '[]');
}

function setAdminAddedFaqs(faqs: AdminAddedFaq[]) {
  localStorage.setItem('faq_admin_added_v2', JSON.stringify(faqs));
}

// Merge admin-added FAQs into faqData on load
function mergeAdminFaqsIntoData() {
  const adminFaqs = getAdminAddedFaqs();
  adminFaqs.forEach(af => {
    if (faqData[af.categoryIndex]) {
      // Avoid duplicates
      const exists = faqData[af.categoryIndex].questions.some(q => q.q === af.question);
      if (!exists) {
        faqData[af.categoryIndex].questions.push({ q: af.question, a: af.answer });
      }
    }
  });
}
mergeAdminFaqsIntoData();

const ADMIN_SECURITY_KEY = 'vins2026';
let currentUserEmail = null;
let currentUserName = null;
let currentAdminEmail = null;

// Data Migration for Legacy SP
let stateChanged = false;
users.forEach(user => {
  if (user.sp !== undefined && user.sp !== 0) {
    if (!user.spHistory) user.spHistory = [];
    if (user.spHistory.length === 0) {
      user.spHistory.push({
        query: "Legacy SP Balance Carried Over",
        amount: user.sp,
        type: user.sp > 0 ? 'award' : 'penalty',
        date: new Date().toLocaleDateString()
      });
      stateChanged = true;
    }
  }
});
if (stateChanged) saveState();

function seedDummyUsers() {
  if (users.length < 7) {
    const generateFakeAttendance = () => {
      const att = [];
      const now = new Date();
      for(let i=14; i>=0; i--) {
        if(Math.random() > 0.3) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          att.push(d.toLocaleDateString());
        }
      }
      return att;
    };
    const dummies = [
      { name: 'Sarah Chen', email: 'sarah@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 150, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'Alex Johnson', email: 'alex@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 120, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'Maria Garcia', email: 'maria@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 90, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'David Kim', email: 'david@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 60, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'Priya Patel', email: 'priya@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 40, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'James Wilson', email: 'james@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 20, spHistory: [], attendance: generateFakeAttendance() },
      { name: 'Emma Brown', email: 'emma@example.com', password: '123', date: new Date().toLocaleDateString(), status: 'Active', lastSignIn: 'Recently', sp: 10, spHistory: [], attendance: generateFakeAttendance() }
    ];
    dummies.forEach(d => {
      if (!users.some(u => u.email === d.email)) {
        users.push(d);
      }
    });
    saveState();
  }
}
seedDummyUsers();

document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sidebar = document.getElementById('sidebar');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const contentSections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('page-title');

  // Login Modal Elements
  const loginModalBtn = document.getElementById('login-modal-btn');
  const loginModal = document.getElementById('login-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const authSection = document.getElementById('auth-section');
  const userProfile = document.getElementById('user-profile');
  const userEmailDisplay = document.getElementById('user-email-display');
  const logoutBtn = document.getElementById('logout-btn');

  // Book Elements
  const flipPage = document.getElementById('flip-page');
  const goToSignupBtn = document.getElementById('go-to-signup');
  const goToSigninBtn = document.getElementById('go-to-signin');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  const signupSuccess = document.getElementById('signup-success');

  // Admin Elements
  const adminStep1 = document.getElementById('admin-step-1');
  const adminStep2 = document.getElementById('admin-step-2');
  const adminStep3 = document.getElementById('admin-step-3');
  const adminSecurityKey = document.getElementById('admin-security-key');
  const adminVerifyKeyBtn = document.getElementById('admin-verify-key-btn');
  const adminKeyError = document.getElementById('admin-key-error');
  const adminUsername = document.getElementById('admin-username');
  const adminPassword = document.getElementById('admin-password');
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const adminLoginError = document.getElementById('admin-login-error');
  const adminLockBtn = document.getElementById('admin-lock-btn');
  const adminUsersTableBody = document.getElementById('admin-users-table-body');
  
  // Reject Modal Elements
  const rejectModal = document.getElementById('reject-modal');
  const rejectQueryText = document.getElementById('reject-query-text');
  const rejectPenaltySelect = document.getElementById('reject-penalty-select');
  const rejectSubmitBtn = document.getElementById('reject-submit-btn');
  const rejectCancelBtn = document.getElementById('reject-cancel-btn');
  let currentRejectIndex = null;

  // Home Elements
  const homeViewFaqsBtn = document.getElementById('home-view-faqs-btn');
  const faqSearchInput = document.getElementById('faq-search-input');
  const faqSearchBtn = document.getElementById('faq-search-btn');
  const homeCategoriesGrid = document.getElementById('home-categories-grid');
  const popularFaqLinks = document.querySelectorAll('.popular-faq-link');

  // 1. Theme Toggle
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeToggleBtn.textContent = '🌙';
  } else {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
  });

  // 2. Sidebar Navigation
  function switchSection(targetId, titleText) {
    contentSections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    pageTitle.textContent = titleText;
    
    // Close sidebar on mobile
    if (window.innerWidth <= 850) {
      sidebar.classList.remove('open');
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const targetId = link.getAttribute('data-target');
      if (targetId === 'faq' && !currentUserEmail && !currentAdminEmail) {
        alert("Please sign in as a student or admin to access FAQs.");
        loginModal.classList.add('active');
        return;
      }
      if (targetId === 'admin' && currentUserEmail) {
        alert("You are currently signed in as a student. Please log out first to access the Admin portal.");
        return;
      }
      switchSection(targetId, link.textContent.trim().replace(/^[\W_]+/, ''));
    });
  });

  hamburgerMenu.addEventListener('click', () => {
    if (window.innerWidth <= 850) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // 3. Render FAQ and Home Categories
  const faqContainer = document.getElementById('faq-container');
  
  function renderFaqs(searchTerm = "") {
    faqContainer.innerHTML = '';
    homeCategoriesGrid.innerHTML = '';
    
    const lowerSearch = searchTerm.toLowerCase();

    faqData.forEach((cat, catIndex) => {
      // Create Home Category Card
      const categoryCard = document.createElement('a');
      categoryCard.href = "#";
      categoryCard.className = 'category-card';
      categoryCard.innerHTML = `<span>${cat.category}</span>`;
      categoryCard.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUserEmail) {
          alert("Please sign in to access FAQs.");
          loginModal.classList.add('active');
          return;
        }
        // Click the FAQ Nav Tab
        document.querySelector('[data-target="faq"]').click();
        
        // Scroll to the specific category in the FAQ section and highlight it
        setTimeout(() => {
          const targetCatElement = document.getElementById(`faq-cat-${catIndex}`);
          if (targetCatElement) {
            targetCatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight effect for the category block
            const originalBg = targetCatElement.style.backgroundColor;
            targetCatElement.style.transition = 'all 0.5s ease';
            targetCatElement.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            targetCatElement.style.borderRadius = '12px';
            targetCatElement.style.padding = '1rem';
            
            setTimeout(() => {
              targetCatElement.style.backgroundColor = originalBg;
            }, 1500);
          }
        }, 100);
      });
      homeCategoriesGrid.appendChild(categoryCard);

      // Filter questions if searching
      const filteredQuestions = cat.questions.filter(qObj => 
        qObj.q.toLowerCase().includes(lowerSearch) || qObj.a.toLowerCase().includes(lowerSearch)
      );

      // If searching and no questions match this category, skip rendering the category
      if (searchTerm && filteredQuestions.length === 0) return;

      // Render FAQ Category
      const catDiv = document.createElement('div');
      catDiv.className = 'faq-category';
      catDiv.id = `faq-cat-${catIndex}`;
      
      const catTitle = document.createElement('h3');
      catTitle.className = 'faq-category-title';
      catTitle.textContent = cat.category;
      catDiv.appendChild(catTitle);

      // ADD DESCRIPTION IF EXISTS
      if (cat.description) {
        const catDesc = document.createElement('p');
        catDesc.className = 'faq-category-desc';
        catDesc.textContent = cat.description;
        catDiv.appendChild(catDesc);
      }

      const qsToRender = searchTerm ? filteredQuestions : cat.questions;

      qsToRender.forEach((qObj, qIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'faq-item';
        // Auto-expand if searching to highlight results
        if (searchTerm) itemDiv.classList.add('active');
        
        // Highlight logic
        let questionText = qObj.q;
        let answerText = qObj.a;
        if (searchTerm) {
          const regex = new RegExp(`(${searchTerm})`, 'gi');
          questionText = questionText.replace(regex, '<span class="highlight">$1</span>');
          answerText = answerText.replace(regex, '<span class="highlight">$1</span>');
        }

        const btn = document.createElement('button');
        btn.className = 'faq-question';
        btn.innerHTML = `<span>${questionText}</span> <span class="faq-icon">▼</span>`;

        // Bookmark icon (visible on hover)
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'faq-bookmark-icon' + (isFaqSaved(qObj.q) ? ' bookmarked' : '');
        bookmarkBtn.title = isFaqSaved(qObj.q) ? 'Remove Bookmark' : 'Bookmark this FAQ';
        bookmarkBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isFaqSaved(qObj.q) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
        bookmarkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSavedFaq(qObj.q, qObj.a, cat.category);
          const saved = isFaqSaved(qObj.q);
          bookmarkBtn.classList.toggle('bookmarked', saved);
          bookmarkBtn.title = saved ? 'Remove Bookmark' : 'Bookmark this FAQ';
          bookmarkBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
        });
        
        const ansDiv = document.createElement('div');
        ansDiv.className = 'faq-answer';
        ansDiv.innerHTML = `<div class="faq-answer-inner">${answerText}</div>`;
        
        btn.addEventListener('click', () => {
          if (!searchTerm) { // allow independent toggling if not searching
            document.querySelectorAll('.faq-item.active').forEach(item => {
              if (item !== itemDiv) item.classList.remove('active');
            });
          }
          itemDiv.classList.toggle('active');
        });

        itemDiv.appendChild(btn);
        itemDiv.appendChild(bookmarkBtn);
        itemDiv.appendChild(ansDiv);
        catDiv.appendChild(itemDiv);
      });

      faqContainer.appendChild(catDiv);
    });

    if (faqContainer.innerHTML === '') {
      faqContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="margin-bottom: 1rem;">No FAQs match your search.</p>
          <button id="redirect-ask-btn" class="btn primary-btn">Click here to Ask a Query</button>
        </div>
      `;
      
      const redirectBtn = document.getElementById('redirect-ask-btn');
      if (redirectBtn) {
        redirectBtn.addEventListener('click', () => {
          document.querySelector('[data-target="my-queries"]')?.click();
          // Select Ask a Query tab
          const askTabBtn = document.querySelector('.query-tab-btn[data-qtab="ask"]') as HTMLElement;
          if (askTabBtn) askTabBtn.click();
          
          const askInput = document.getElementById('ask-query-input') as HTMLInputElement;
          const askBtn = document.getElementById('ask-query-search-btn') as HTMLElement;
          if (askInput && askBtn) {
            askInput.value = searchTerm;
            askBtn.click();
          }
        });
      }
    }
  }

  // Initial Render
  renderFaqs();

  // Saved FAQs Toggle & Rendering
  const savedFaqToggle = document.getElementById('saved-faq-toggle');
  const savedFaqsOverlay = document.getElementById('saved-faqs-overlay');
  const savedFaqsContainer = document.getElementById('saved-faqs-container');
  const closeSavedFaqs = document.getElementById('close-saved-faqs');

  function renderSavedFaqs() {
    if (!savedFaqsContainer) return;
    const saved = getSavedFaqs();
    savedFaqsContainer.innerHTML = '';
    
    if (saved.length === 0) {
      savedFaqsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem 0;">You haven\'t saved any FAQs yet. Hover over a FAQ and click the 🔖 bookmark icon to save it here!</p>';
      return;
    }

    saved.forEach((faq) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'faq-item';

      const btn = document.createElement('button');
      btn.className = 'faq-question';
      btn.innerHTML = `<span>${faq.question}</span> <span class="faq-icon">▼</span>`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-bookmark-btn';
      removeBtn.title = 'Remove from Saved';
      removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="var(--color-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSavedFaq(faq.question, faq.answer, faq.category);
        renderSavedFaqs();
        renderFaqs(); // refresh bookmark icons in main list
      });

      const ansDiv = document.createElement('div');
      ansDiv.className = 'faq-answer';
      ansDiv.innerHTML = `<div class="faq-answer-inner"><p style="font-size: 0.75rem; opacity: 0.6; margin-bottom: 0.5rem;">Category: ${faq.category}</p>${faq.answer}</div>`;

      btn.addEventListener('click', () => {
        itemDiv.classList.toggle('active');
      });

      itemDiv.appendChild(btn);
      itemDiv.appendChild(removeBtn);
      itemDiv.appendChild(ansDiv);
      savedFaqsContainer.appendChild(itemDiv);
    });
  }

  if (savedFaqToggle) {
    savedFaqToggle.addEventListener('click', () => {
      if (savedFaqsOverlay) {
        const isVisible = savedFaqsOverlay.style.display !== 'none';
        savedFaqsOverlay.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) renderSavedFaqs();
      }
    });
  }

  if (closeSavedFaqs) {
    closeSavedFaqs.addEventListener('click', () => {
      if (savedFaqsOverlay) savedFaqsOverlay.style.display = 'none';
    });
  }

  // Search Logic
  function doSearch() {
    const term = faqSearchInput.value.trim();
    document.querySelector('[data-target="faq"]').click();
    renderFaqs(term);
  }

  faqSearchBtn.addEventListener('click', doSearch);
  faqSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  homeViewFaqsBtn.addEventListener('click', () => {
    if (!currentUserEmail) {
      alert("Please sign in to access FAQs.");
      loginModal.classList.add('active');
      return;
    }
    document.querySelector('[data-target="faq"]').click();
  });

  // Popular FAQ clicks
  popularFaqLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUserEmail) {
        alert("Please sign in to search or view FAQs.");
        loginModal.classList.add('active');
        return;
      }
      faqSearchInput.value = e.target.textContent.trim().replace('?', '');
      doSearch();
    });
  });


  // 4. Modal Logic
  loginModalBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
  });

  // 5. Book Flip Logic
  goToSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    flipPage.classList.add('flipped');
    signinForm.reset();
    loginError.style.display = 'none';
  });

  goToSigninBtn.addEventListener('click', (e) => {
    e.preventDefault();
    flipPage.classList.remove('flipped');
    signupForm.reset();
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
  });

  const navMyQueries = document.getElementById('nav-my-queries');
  const myUnresolvedContainer = document.getElementById('my-unresolved-container');
  const myResolvedContainer = document.getElementById('my-resolved-container');
  
  // Tab logic
  const queryTabBtns = document.querySelectorAll('.query-tab-btn');
  const queryTabContents = document.querySelectorAll('.query-tab-content');
  
  queryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      queryTabBtns.forEach(b => b.classList.remove('active'));
      queryTabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const targetId = 'qtab-' + btn.getAttribute('data-qtab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Ask a Query Logic
  const askQueryInput = document.getElementById('ask-query-input') as HTMLInputElement;
  const askQuerySearchBtn = document.getElementById('ask-query-search-btn');
  const askQueryResults = document.getElementById('ask-query-results');
  const raiseQueryContainer = document.getElementById('raise-query-container');
  const raiseQueryBtn = document.getElementById('raise-query-btn');
  let currentAskTerm = '';

  if (askQuerySearchBtn) {
    askQuerySearchBtn.addEventListener('click', () => {
      currentAskTerm = askQueryInput.value.trim();
      if (!currentAskTerm) return;
      
      const lowerSearch = currentAskTerm.toLowerCase();
      let foundMatches = false;
      askQueryResults!.innerHTML = '';
      
      faqData.forEach(cat => {
        const filteredQs = cat.questions.filter(qObj => 
          qObj.q.toLowerCase().includes(lowerSearch) || qObj.a.toLowerCase().includes(lowerSearch)
        );
        
        if (filteredQs.length > 0) {
          foundMatches = true;
          filteredQs.forEach(qObj => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'faq-item';
            
            let questionText = qObj.q;
            let answerText = qObj.a;
            const regex = new RegExp(`(${currentAskTerm})`, 'gi');
            questionText = questionText.replace(regex, '<span class="highlight">$1</span>');
            answerText = answerText.replace(regex, '<span class="highlight">$1</span>');
            
            const btn = document.createElement('button');
            btn.className = 'faq-question';
            btn.innerHTML = `<span>${questionText}</span> <span class="faq-icon">▼</span>`;
            
            const ansDiv = document.createElement('div');
            ansDiv.className = 'faq-answer';
            ansDiv.innerHTML = `<div class="faq-answer-inner">${answerText}</div>`;
            
            btn.addEventListener('click', () => {
              itemDiv.classList.toggle('active');
            });
            
            itemDiv.appendChild(btn);
            itemDiv.appendChild(ansDiv);
            askQueryResults!.appendChild(itemDiv);
          });
        }
      });
      
      if (foundMatches) {
        raiseQueryContainer!.style.display = 'none';
      } else {
        askQueryResults!.innerHTML = '<p class="text-center" style="margin-bottom: 1rem;">No matching FAQs found for your question.</p>';
        raiseQueryContainer!.style.display = 'block';
      }
    });
    
    askQueryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') askQuerySearchBtn.click();
    });
  }

  if (raiseQueryBtn) {
    raiseQueryBtn.addEventListener('click', () => {
      if (currentAskTerm && currentUserEmail) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];
        unresolvedQueries.push({ 
          term: currentAskTerm, 
          userName: currentUserName || 'Unknown', 
          userEmail: currentUserEmail, 
          date: dateStr, 
          time: timeStr 
        });
        saveState();
        
        askQueryInput.value = '';
        askQueryResults!.innerHTML = '';
        raiseQueryContainer!.style.display = 'none';
        
        // Switch to unresolved tab
        const unresolvedTabBtn = document.querySelector('.query-tab-btn[data-qtab="unresolved"]') as HTMLElement;
        if (unresolvedTabBtn) unresolvedTabBtn.click();
        
        renderMyQueries();
        alert('Your query has been raised to the admins and community!');
      }
    });
  }

  function renderMyQueries() {
    if (!myUnresolvedContainer || !myResolvedContainer) return;
    myUnresolvedContainer.innerHTML = '';
    myResolvedContainer.innerHTML = '';
    
    const myResolved = resolvedQueries.filter(q => q.userEmail === currentUserEmail);
    const myUnresolved = unresolvedQueries.filter(q => q.userEmail === currentUserEmail);
    
    // Render Unresolved
    if (myUnresolved.length === 0) {
      myUnresolvedContainer.innerHTML = '<p>You have no pending queries.</p>';
    } else {
      myUnresolved.forEach((q) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'faq-item';
        
        const btn = document.createElement('button');
        btn.className = 'faq-question';
        btn.innerHTML = `<span>${q.term}</span> <span class="faq-icon" style="opacity: 0.5;">🕒</span>`;
        
        const ansDiv = document.createElement('div');
        ansDiv.className = 'faq-answer';
        ansDiv.innerHTML = `<div class="faq-answer-inner">
          <p><em>Your query has been sent to the Admin team. Please check back later for an answer!</em></p>
        </div>`;
        
        btn.addEventListener('click', () => {
          itemDiv.classList.toggle('active');
        });
        itemDiv.appendChild(btn);
        itemDiv.appendChild(ansDiv);
        myUnresolvedContainer.appendChild(itemDiv);
      });
    }

    // Render Resolved
    if (myResolved.length === 0) {
      myResolvedContainer.innerHTML = '<p>You have no resolved queries yet.</p>';
    } else {
      myResolved.forEach((q) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'faq-item';
        
        const btn = document.createElement('button');
        btn.className = 'faq-question';
        btn.innerHTML = `<span>${q.term}</span> <span class="faq-icon">▼</span>`;
        
        const ansDiv = document.createElement('div');
        ansDiv.className = 'faq-answer';
        ansDiv.innerHTML = `<div class="faq-answer-inner">
          <p><strong>Answer:</strong> ${q.answer}</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">Resolved by ${q.resolvedBy}</p>
        </div>`;
        
        btn.addEventListener('click', () => {
          itemDiv.classList.toggle('active');
        });
        itemDiv.appendChild(btn);
        itemDiv.appendChild(ansDiv);
        myResolvedContainer.appendChild(itemDiv);
      });
    }
  }

  const navCommunityQueries = document.getElementById('nav-community-queries');
  const communityQueriesContainer = document.getElementById('community-queries-container');

  function renderCommunityQueries() {
    communityQueriesContainer.innerHTML = '';
    
    const isAdmin = !!currentAdminEmail;
    
    // Admin sees ALL queries (both unresolved and resolved); students see only others' unresolved
    if (isAdmin) {
      // Show unresolved queries
      const allUnresolved = unresolvedQueries;
      if (allUnresolved.length > 0) {
        const unresolvedTitle = document.createElement('h3');
        unresolvedTitle.className = 'color-heading-2 mb-1';
        unresolvedTitle.textContent = `Open Queries (${allUnresolved.length})`;
        communityQueriesContainer.appendChild(unresolvedTitle);
        
        allUnresolved.forEach(q => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'faq-item';
          const btn = document.createElement('button');
          btn.className = 'faq-question';
          btn.innerHTML = `<span>${q.term}</span> <span class="faq-icon">▼</span>`;
          const ansDiv = document.createElement('div');
          ansDiv.className = 'faq-answer';
          let details = `<p style="font-size: 0.85rem;"><strong>Asked by:</strong> ${q.userName || 'Unknown'} (${q.userEmail})</p>`;
          details += `<p style="font-size: 0.85rem;"><strong>Date:</strong> ${q.date} at ${q.time || '-'}</p>`;
          if (q.proposedAnswer) {
            details += `<p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--accent-secondary);"><strong>💡 Proposed Answer by ${q.proposedBy}:</strong> ${q.proposedAnswer}</p>`;
          } else {
            details += `<p style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.6;"><em>No proposed answer yet.</em></p>`;
          }
          ansDiv.innerHTML = `<div class="faq-answer-inner">${details}</div>`;
          btn.addEventListener('click', () => itemDiv.classList.toggle('active'));
          itemDiv.appendChild(btn);
          itemDiv.appendChild(ansDiv);
          communityQueriesContainer.appendChild(itemDiv);
        });
      }
      
      // Show resolved queries
      if (resolvedQueries.length > 0) {
        const resolvedTitle = document.createElement('h3');
        resolvedTitle.className = 'color-heading-3 mt-2 mb-1';
        resolvedTitle.textContent = `Resolved Queries (${resolvedQueries.length})`;
        communityQueriesContainer.appendChild(resolvedTitle);
        
        resolvedQueries.forEach(q => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'faq-item';
          const btn = document.createElement('button');
          btn.className = 'faq-question';
          btn.innerHTML = `<span>${q.term}</span> <span class="faq-icon">▼</span>`;
          const ansDiv = document.createElement('div');
          ansDiv.className = 'faq-answer';
          let details = `<p style="font-size: 0.85rem;"><strong>Asked by:</strong> ${q.userName || 'Unknown'} (${q.userEmail})</p>`;
          details += `<p style="font-size: 0.85rem;"><strong>Answer:</strong> ${q.answer}</p>`;
          details += `<p style="font-size: 0.85rem; opacity: 0.7;"><strong>Resolved by:</strong> ${q.resolvedBy}</p>`;
          ansDiv.innerHTML = `<div class="faq-answer-inner">${details}</div>`;
          btn.addEventListener('click', () => itemDiv.classList.toggle('active'));
          itemDiv.appendChild(btn);
          itemDiv.appendChild(ansDiv);
          communityQueriesContainer.appendChild(itemDiv);
        });
      }
      
      if (allUnresolved.length === 0 && resolvedQueries.length === 0) {
        communityQueriesContainer.innerHTML = '<p>No community activity yet.</p>';
      }
      return;
    }
    
    // Student view: only others' unresolved queries without proposed answers
    const communityQueries = unresolvedQueries.filter(q => q.userEmail !== currentUserEmail && !q.proposedAnswer);
    
    if (communityQueries.length === 0) {
      communityQueriesContainer.innerHTML = '<p>There are no open questions from the community right now. Check back later!</p>';
      return;
    }

    communityQueries.forEach((q) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'faq-item';
      
      const btn = document.createElement('button');
      btn.className = 'faq-question';
      btn.innerHTML = `<span>${q.term}</span> <span class="faq-icon">▼</span>`;
      
      const ansDiv = document.createElement('div');
      ansDiv.className = 'faq-answer';
      
      const innerDiv = document.createElement('div');
      innerDiv.className = 'faq-answer-inner';
      
      const infoP = document.createElement('p');
      infoP.style.fontSize = '0.9rem';
      infoP.style.marginBottom = '0.5rem';
      infoP.style.fontStyle = 'italic';
      infoP.style.opacity = '0.8';
      infoP.textContent = 'Asked anonymously by a student';
      
      const textarea = document.createElement('textarea');
      textarea.rows = 3;
      textarea.style.cssText = 'width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: var(--bg-tertiary); color: var(--text-primary);';
      textarea.placeholder = 'Write your proposed solution here...';
      
      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn primary-btn btn-small';
      submitBtn.textContent = 'Submit Solution';
      
      submitBtn.addEventListener('click', () => {
        const solution = textarea.value.trim();
        if (solution) {
          q.proposedAnswer = solution;
          q.proposedBy = currentUserEmail;
          saveState();
          alert('Your solution has been submitted to the Admin for review! Thank you for helping the community.');
          renderCommunityQueries();
        }
      });
      
      innerDiv.appendChild(infoP);
      innerDiv.appendChild(textarea);
      innerDiv.appendChild(submitBtn);
      ansDiv.appendChild(innerDiv);
      
      btn.addEventListener('click', () => {
        itemDiv.classList.toggle('active');
      });

      itemDiv.appendChild(btn);
      itemDiv.appendChild(ansDiv);
      communityQueriesContainer.appendChild(itemDiv);
    });
  }

  // 6. User Auth Logic
  const navSpHistory = document.getElementById('nav-sp-history');
  const spHistoryTableBody = document.getElementById('sp-history-table-body');
  const userSpCount = document.getElementById('user-sp-count');
  const navLeaderboard = document.getElementById('nav-leaderboard');
  const leaderboardTableBody = document.getElementById('leaderboard-table-body');
  const spGraphContainer = document.getElementById('sp-graph-container');
  const leaderboardRankBanner = document.getElementById('leaderboard-rank-banner');

  function renderSpHistory() {
    spHistoryTableBody.innerHTML = '';
    const user = users.find(u => u.email === currentUserEmail);
    if (!user || !user.spHistory || user.spHistory.length === 0) {
      spHistoryTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No SP history available.</td></tr>';
      return;
    }

    // Render history in reverse chronological order
    const historyRev = [...user.spHistory].reverse();
    historyRev.forEach(entry => {
      const tr = document.createElement('tr');
      const isAward = entry.type === 'award';
      tr.innerHTML = `
        <td>${entry.date}</td>
        <td><span style="color: ${isAward ? 'var(--color-3)' : 'var(--error-color)'}; font-weight: bold;">${isAward ? 'Awarded' : 'Penalized'}</span></td>
        <td style="font-weight: bold;">${entry.amount > 0 ? '+' : ''}${entry.amount}</td>
        <td style="max-width: 250px; word-wrap: break-word; font-style: italic;">"${renderLongText(entry.query)}"</td>
      `;
      spHistoryTableBody.appendChild(tr);
    });
  }

  function getInitials(name: string, email: string) {
    if (name && name.trim() !== '') {
      const parts = name.trim().split(' ');
      if (parts.length > 1 && parts[1].length > 0) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  let currentCalendarMonth: number = new Date().getMonth();
  let currentCalendarYear: number = new Date().getFullYear();

  function renderAttendanceTracker() {
    const attendanceContainer = document.getElementById('attendance-tracker-container');
    const currentStreakBadge = document.getElementById('current-streak-badge');
    const attendanceSection = document.getElementById('your-attendance-section');
    
    if (!attendanceContainer || !currentStreakBadge || !attendanceSection) return;
    
    if (currentAdminEmail) {
      attendanceSection.style.display = 'none';
      return;
    } else {
      attendanceSection.style.display = 'block';
    }

    const user = users.find(u => u.email === currentUserEmail);
    if (!user) return;

    attendanceContainer.innerHTML = '';
    
    // Ensure attendance array exists
    const attendance = user.attendance || [];
    
    // Parse start date from user.date (format: MM/DD/YYYY, h:mm:ss A or similar depending on toLocaleString)
    // To be safe, try to parse it. If it fails, fallback to something reasonable.
    const startDate = new Date(user.date.split(',')[0]); 
    if (isNaN(startDate.getTime())) {
      startDate.setTime(Date.now() - 30 * 24 * 60 * 60 * 1000); // Fallback to 30 days ago
    }
    startDate.setHours(0,0,0,0);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 2); // 2 months duration
    endDate.setHours(23,59,59,999);
    
    // Set Header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthTitle = document.getElementById('calendar-month-title');
    if (monthTitle) monthTitle.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
    
    // Generate Calendar Grid
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Fill empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      const emptyNode = document.createElement('div');
      attendanceContainer.appendChild(emptyNode);
    }
    
    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentCalendarYear, currentCalendarMonth, day);
      const dateStr = d.toLocaleDateString();
      const node = document.createElement('div');
      node.className = 'calendar-cell';
      node.textContent = day.toString();
      
      // Check if within internship period
      if (d < startDate || d > endDate) {
        node.classList.add('blurred-date');
      } else {
        if (d > today) {
          node.classList.add('pending-date');
        } else {
          const isPresent = attendance.includes(dateStr);
          if (isPresent) {
            node.classList.add('present');
          } else {
            node.classList.add('absent');
          }
        }
      }
      
      attendanceContainer.appendChild(node);
    }
    
    // Calculate streak properly (start from today, go backwards infinitely)
    let streakCount = 0;
    let tempDate = new Date();
    while (true) {
      const tStr = tempDate.toLocaleDateString();
      if (attendance.includes(tStr)) {
        streakCount++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        // If today is missing, streak is 0, break
        break;
      }
    }
    
    currentStreakBadge.innerHTML = `🔥 ${streakCount} Day Streak`;
    
    if (streakCount > 0) {
      currentStreakBadge.style.color = '#f59e0b'; // orange/amber
      currentStreakBadge.style.background = 'rgba(245, 158, 11, 0.1)';
      currentStreakBadge.style.border = '1px solid rgba(245, 158, 11, 0.5)';
    } else {
      currentStreakBadge.style.color = 'var(--text-secondary)';
      currentStreakBadge.style.background = 'rgba(255, 255, 255, 0.05)';
      currentStreakBadge.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    }
  }

  // Calendar Event Listeners
  const prevBtn = document.getElementById('calendar-prev-btn');
  const nextBtn = document.getElementById('calendar-next-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentCalendarMonth--;
      if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
      }
      renderAttendanceTracker();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentCalendarMonth++;
      if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
      }
      renderAttendanceTracker();
    });
  }

  function renderLeaderboard() {
    const spActivitySection = document.getElementById('your-sp-activity-section');
    if (spActivitySection) {
      if (currentAdminEmail) {
        spActivitySection.style.display = 'none';
      } else {
        spActivitySection.style.display = 'block';
      }
    }

    const podiumContainer = document.getElementById('leaderboard-podium-container');
    if (!leaderboardTableBody || !spGraphContainer || !leaderboardRankBanner || !podiumContainer) return;
    
    // Sort active users by SP
    const activeUsers = users.filter(u => u.status === 'Active').sort((a, b) => (b.sp || 0) - (a.sp || 0));
    
    leaderboardTableBody.innerHTML = '';
    podiumContainer.innerHTML = '';
    let currentUserRank = -1;
    
    // Find current user rank
    activeUsers.forEach((u, index) => {
      if (u.email === currentUserEmail) currentUserRank = index + 1;
    });

    if (currentUserRank !== -1) {
      leaderboardRankBanner.textContent = `You are Rank #${currentUserRank} out of ${activeUsers.length} students!`;
    } else {
      leaderboardRankBanner.textContent = `See where you stand among your peers!`;
    }

    const topThree = activeUsers.slice(0, 3);
    const rest = activeUsers.slice(3);

    // Render Podium
    topThree.forEach((u, index) => {
      const rank = index + 1;
      const initials = getInitials(u.name, u.email);
      
      const stepWrapper = document.createElement('div');
      stepWrapper.className = `podium-step-wrapper rank-${rank}`;
      
      let crownHtml = '';
      if (rank === 1) {
        crownHtml = `<div class="crown">👑</div>`;
      }

      stepWrapper.innerHTML = `
        <div class="podium-avatar-container">
          ${crownHtml}
          <div class="podium-avatar">${initials}</div>
          <div class="podium-name" title="${u.name || u.email}">${u.name || u.email.split('@')[0]}</div>
          <div class="podium-sp">${u.sp || 0} SP</div>
        </div>
        <div class="podium-step">${rank}</div>
      `;
      podiumContainer.appendChild(stepWrapper);
    });

    // Render List (include all ranks)
    activeUsers.forEach((u, index) => {
      const rank = index + 1;
      const initials = getInitials(u.name, u.email);
      
      const tr = document.createElement('tr');
      if (u.email === currentUserEmail) tr.className = 'highlight-row';
      tr.innerHTML = `
        <td style="font-weight: bold; font-size: 1.1rem; opacity: 0.8;">
          ${rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank}
        </td>
        <td>
          <div class="list-avatar">${initials}</div>
          ${u.name || 'Unknown'} ${u.email === currentUserEmail ? '<span style="opacity: 0.6; font-size: 0.8rem;">(You)</span>' : ''}
        </td>
        <td style="font-weight: bold; color: var(--accent-primary);">${u.sp || 0} SP</td>
      `;
      leaderboardTableBody.appendChild(tr);
    });
    
    if (!currentAdminEmail) {
      renderSPGraph();
    }
  }

  function renderSPGraph() {
    if (!spGraphContainer) return;
    spGraphContainer.innerHTML = '';
    
    const user = users.find(u => u.email === currentUserEmail);
    if (!user) return;
    
    spGraphContainer.style.display = 'block';
    spGraphContainer.style.overflowX = 'auto';
    spGraphContainer.style.paddingBottom = '5px';
    
    // Aggregate by Date
    const dailySP: Record<string, number> = {};
    if (user.spHistory) {
      user.spHistory.forEach(entry => {
        if (!dailySP[entry.date]) dailySP[entry.date] = 0;
        dailySP[entry.date] += entry.amount;
      });
    }
    
    const now = new Date();
    let startDate = new Date(user.date);
    if (isNaN(startDate.getTime())) {
      startDate = new Date();
      startDate.setDate(now.getDate() - 14);
    }
    
    // Find the absolute earliest date in history to calculate running total properly
    let earliestDate = new Date(startDate);
    if (user.spHistory && user.spHistory.length > 0) {
      // Find min date
      user.spHistory.forEach(entry => {
        const ed = new Date(entry.date);
        if (!isNaN(ed.getTime()) && ed < earliestDate) {
          earliestDate = ed;
        }
      });
    }
    
    // Build cumulative SP up to now
    const cumulativeSP: Record<string, number> = {};
    let runningTotal = 0;
    for (let d = new Date(earliestDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateString = d.toLocaleDateString();
      if (dailySP[dateString]) {
        runningTotal += dailySP[dateString];
      }
      cumulativeSP[dateString] = runningTotal;
    }

    // Now figure out the visible window (Max 30 days)
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    }
    if (diffDays < 7) {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    const timelineDates: { key: string, label: string }[] = [];
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      timelineDates.push({
        key: d.toLocaleDateString(),
        label: `${day}/${month}/${year}`
      });
    }
    
    const minWidth = timelineDates.length * 60; // 60px per day
    
    spGraphContainer.innerHTML = `
      <div id="sp-graph-wrapper" style="min-width: ${minWidth}px; padding-top: 30px;">
        <div id="sp-graph-bars" style="display: flex; height: 120px; align-items: flex-end; width: 100%; border-bottom: 2px solid rgba(255,255,255,0.1); gap: 4px;"></div>
        <div id="sp-graph-labels" style="display: flex; width: 100%; height: 20px; margin-top: 5px; gap: 4px;"></div>
      </div>
    `;
    
    const barsContainer = document.getElementById('sp-graph-bars');
    const labelsContainer = document.getElementById('sp-graph-labels');
    if (!barsContainer || !labelsContainer) return;
    
    let maxCumValue = 10;
    timelineDates.forEach(item => {
      const val = cumulativeSP[item.key] || 0;
      if (Math.abs(val) > maxCumValue) {
        maxCumValue = Math.abs(val);
      }
    });
    
    timelineDates.forEach((item, index) => {
      const cumVal = cumulativeSP[item.key] || 0;
      const dailyVal = dailySP[item.key] || 0;
      
      let typeClass = 'baseline';
      if (cumVal > 0) typeClass = 'positive';
      else if (cumVal < 0) typeClass = 'negative';
      
      let heightPercent = 5; // Base level
      // Show cumulative bar height
      if (cumVal !== 0) {
        heightPercent = Math.max(15, Math.floor((Math.abs(cumVal) / maxCumValue) * 100));
      }
      
      const bar = document.createElement('div');
      bar.className = `graph-bar ${typeClass}`;
      bar.style.height = '0%';
      bar.style.maxWidth = 'none'; // fill wrapper
      bar.style.flex = '1';
      bar.style.borderLeft = '1px solid rgba(255,255,255,0.02)';
      bar.style.borderRight = '1px solid rgba(0,0,0,0.1)';
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.position = 'relative';
      
      // Show cumulative SP label on every bar
      const valLabel = document.createElement('div');
      valLabel.className = 'graph-value';
      valLabel.textContent = `SP: ${cumVal}`;
      valLabel.style.fontSize = '0.7rem';
      valLabel.style.whiteSpace = 'nowrap';
      bar.appendChild(valLabel);
      
      barsContainer.appendChild(bar);
      
      // Horizontal un-slanted label
      const labelWrapper = document.createElement('div');
      labelWrapper.style.flex = '1';
      labelWrapper.style.display = 'flex';
      labelWrapper.style.justifyContent = 'center';
      
      const dateLabel = document.createElement('div');
      dateLabel.className = 'graph-label';
      dateLabel.textContent = item.label;
      dateLabel.style.whiteSpace = 'nowrap';
      dateLabel.style.fontSize = '0.65rem';
      dateLabel.style.marginTop = '0';
      
      labelWrapper.appendChild(dateLabel);
      labelsContainer.appendChild(labelWrapper);
      
      // Animate
      setTimeout(() => {
        bar.style.height = `${heightPercent}%`;
      }, 30 * index);
    });
  }

  function loginUser(email) {
    currentUserEmail = email;
    loginModal.classList.remove('active');
    authSection.style.display = 'none';
    userProfile.style.display = 'flex';
    userEmailDisplay.textContent = email;
    
    // Clear search bar to prevent User1's search from leaking to User2
    faqSearchInput.value = '';
    renderFaqs();
    
    navMyQueries.style.display = 'flex';
    navCommunityQueries.style.display = 'flex';
    navSpHistory.style.display = 'flex';
    if (navLeaderboard) navLeaderboard.style.display = 'flex';
    const navAttendance = document.getElementById('nav-attendance');
    if (navAttendance) navAttendance.style.display = 'flex';
    
    document.getElementById('popular-faq-list-container').style.display = 'block';
    document.getElementById('popular-faq-login-msg').style.display = 'none';
    
    // Update last sign in and SP
    const user = users.find(u => u.email === email);
    if (user) {
      currentUserName = user.name || "Unknown";
      user.lastSignIn = new Date().toLocaleString();
      
      const todayStr = new Date().toLocaleDateString();
      if (!user.attendance) user.attendance = [];
      if (!user.attendance.includes(todayStr)) {
        user.attendance.push(todayStr);
      }
      
      if (user.sp === undefined) user.sp = 0;
      userSpCount.textContent = user.sp;
      saveState();
    }

    renderMyQueries();
    renderCommunityQueries();
    renderSpHistory();
    renderLeaderboard();
    renderAttendanceTracker();

    // Save session to localStorage
    localStorage.setItem('faq_session_email', email);
    localStorage.setItem('faq_session_lastActive', Date.now().toString());
  }

  logoutBtn.addEventListener('click', () => {
    performLogout();
  });

  function performLogout() {
    currentUserEmail = null;
    currentUserName = null;
    
    // Clear session
    localStorage.removeItem('faq_session_email');
    localStorage.removeItem('faq_session_lastActive');
    
    authSection.style.display = 'flex';
    userProfile.style.display = 'none';
    
    navMyQueries.style.display = 'none';
    navCommunityQueries.style.display = 'none';
    navSpHistory.style.display = 'none';
    if (navLeaderboard) navLeaderboard.style.display = 'none';
    const navAttendance = document.getElementById('nav-attendance');
    if (navAttendance) navAttendance.style.display = 'none';
    
    document.getElementById('popular-faq-list-container').style.display = 'none';
    document.getElementById('popular-faq-login-msg').style.display = 'block';
    
    if (myUnresolvedContainer) myUnresolvedContainer.innerHTML = '';
    if (myResolvedContainer) myResolvedContainer.innerHTML = '';
    communityQueriesContainer.innerHTML = '';
    
    // Clear search bar
    faqSearchInput.value = '';
    renderFaqs();
    
    // Also lock admin if logged out
    lockAdmin();
    
    // Switch back to Home page
    document.querySelector('[data-target="home"]').click();
    
    // Clear sign in form
    signinForm.reset();
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (users.some(u => u.email === email)) {
      signupError.style.display = 'block';
    } else {
      const currentDateTime = new Date().toLocaleString();
      const todayStr = new Date().toLocaleDateString();
      users.push({ name, email, password, date: currentDateTime, status: 'Active', lastSignIn: 'Never', sp: 0, spHistory: [], attendance: [todayStr] });
      saveState();
      signupError.style.display = 'none';
      signupSuccess.style.display = 'block';
      signupForm.reset();
      
      setTimeout(() => {
        flipPage.classList.remove('flipped');
        signupSuccess.style.display = 'none';
        document.getElementById('signin-email').value = email;
      }, 1500);
    }
  });

  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      loginError.style.display = 'none';
      loginUser(email);
    } else {
      loginError.style.display = 'block';
    }
  });

  // 7. Admin Auth Logic
  const adminQueriesTableBody = document.getElementById('admin-queries-table-body');
  const adminResolvedTableBody = document.getElementById('admin-resolved-table-body');
  
  // Resolve Modal Elements
  const resolveModal = document.getElementById('resolve-modal');
  const resolveQueryText = document.getElementById('resolve-query-text');
  const resolveAnswerInput = document.getElementById('resolve-answer-input') as HTMLTextAreaElement;
  const resolveSubmitBtn = document.getElementById('resolve-submit-btn');
  const resolveCancelBtn = document.getElementById('resolve-cancel-btn');
  const creditProposerContainer = document.getElementById('credit-proposer-container');
  const creditProposerCheckbox = document.getElementById('credit-proposer-checkbox') as HTMLInputElement;
  const proposerNameDisplay = document.getElementById('proposer-name-display');
  
  let currentResolveIndex = null;
  let currentOriginalProposedAnswer = '';
  let currentProposerEmail = '';

  if (resolveAnswerInput) {
    resolveAnswerInput.addEventListener('input', () => {
      if (currentProposerEmail && creditProposerContainer) {
        if (resolveAnswerInput.value.trim() !== currentOriginalProposedAnswer) {
          creditProposerContainer.style.display = 'block';
        } else {
          creditProposerContainer.style.display = 'none';
        }
      }
    });
  }

  // Add to FAQ elements
  const addToFaqCheckbox = document.getElementById('add-to-faq-checkbox') as HTMLInputElement;
  const addToFaqOptions = document.getElementById('add-to-faq-options');
  const faqCategorySelect = document.getElementById('faq-category-select') as HTMLSelectElement;
  const faqReframeInput = document.getElementById('faq-reframe-input') as HTMLInputElement;

  // Toggle the FAQ options panel when checkbox is toggled
  if (addToFaqCheckbox && addToFaqOptions) {
    addToFaqCheckbox.addEventListener('change', () => {
      addToFaqOptions.style.display = addToFaqCheckbox.checked ? 'block' : 'none';
    });
  }

  // Populate category dropdown from faqData
  function populateFaqCategoryDropdown() {
    if (!faqCategorySelect) return;
    faqCategorySelect.innerHTML = '';
    faqData.forEach((cat, i) => {
      const opt = document.createElement('option');
      opt.value = i.toString();
      opt.textContent = cat.category;
      faqCategorySelect.appendChild(opt);
    });
  }
  populateFaqCategoryDropdown();
  
  function renderLongText(text) {
    if (!text) return '-';
    if (text.length > 50) {
      return `<details style="cursor: pointer;">
                <summary style="outline: none; font-weight: 500;">${text.substring(0, 50)}...</summary>
                <div style="margin-top: 0.5rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 6px; font-weight: normal; line-height: 1.4;">
                  ${text}
                </div>
              </details>`;
    }
    return text;
  }

  function renderAdminUsersTable() {
    adminUsersTableBody.innerHTML = '';
    users.forEach((u, uIndex) => {
      const tr = document.createElement('tr');
      const badgeClass = u.status === 'Active' ? 'status-active' : '';
      tr.innerHTML = `
        <td>${u.name || 'Unknown'}</td>
        <td>${u.email}</td>
        <td>${u.sp !== undefined ? u.sp : 0} SP</td>
        <td></td>
        <td><span class="status-badge ${badgeClass}">${u.status}</span></td>
        <td>${u.date}</td>
        <td>${u.lastSignIn || 'Never'}</td>
      `;
      
      // Add Manage SP button in the 4th column
      const spTd = tr.querySelectorAll('td')[3];
      const editSpBtn = document.createElement('button');
      editSpBtn.className = 'btn primary-btn';
      editSpBtn.style.cssText = 'padding: 0.3rem 0.6rem; font-size: 0.8rem;';
      editSpBtn.textContent = '✏️ Edit';
      editSpBtn.addEventListener('click', () => {
        openSpEditModal(uIndex);
      });
      spTd.appendChild(editSpBtn);
      
      adminUsersTableBody.appendChild(tr);
    });
    
    adminQueriesTableBody.innerHTML = '';
    unresolvedQueries.forEach((q, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="max-width: 300px; word-wrap: break-word;">${renderLongText(q.term)}</td>
        <td>${q.userName || 'Unknown'}</td>
        <td>${q.userEmail}</td>
        <td>${q.date}</td>
        <td>${q.time || '-'}</td>
      `;
      const actionTd = document.createElement('td');
      actionTd.style.display = 'flex';
      actionTd.style.gap = '0.5rem';
      
      const resolveBtn = document.createElement('button');
      resolveBtn.className = 'btn primary-btn';
      resolveBtn.style.padding = '0.4rem 0.8rem';
      resolveBtn.textContent = 'Resolve';
      resolveBtn.onclick = () => {
        currentResolveIndex = index;
        currentProposerEmail = q.proposedBy || '';
        currentOriginalProposedAnswer = q.proposedAnswer || '';
        
        let queryDetails = `Question: "${q.term}" (Asked by ${q.userName || q.userEmail})`;
        if (q.proposedAnswer) {
          queryDetails += `<br><br><span style="color: var(--accent-secondary);">💡 A solution has been proposed by ${q.proposedBy}! Please review it below.</span>`;
          if (proposerNameDisplay) proposerNameDisplay.textContent = q.proposedBy;
        }
        
        resolveQueryText.innerHTML = queryDetails;
        resolveAnswerInput.value = q.proposedAnswer || '';
        
        if (creditProposerContainer) {
          creditProposerContainer.style.display = 'none'; // hidden by default, shown if modified
        }
        if (creditProposerCheckbox) {
          creditProposerCheckbox.checked = true; // default to giving credit if modified
        }

        // Reset FAQ promotion section
        if (addToFaqCheckbox) addToFaqCheckbox.checked = false;
        if (addToFaqOptions) addToFaqOptions.style.display = 'none';
        if (faqReframeInput) faqReframeInput.value = '';
        resolveModal.classList.add('active');
      };
      
      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'btn';
      rejectBtn.style.padding = '0.4rem 0.8rem';
      rejectBtn.style.backgroundColor = '#ef4444';
      rejectBtn.style.color = '#fff';
      rejectBtn.textContent = 'Reject';
      rejectBtn.onclick = () => {
        currentRejectIndex = index;
        rejectQueryText.textContent = `Question: "${q.term}" (Asked by ${q.userName || q.userEmail})`;
        rejectPenaltySelect.value = "0";
        rejectModal.classList.add('active');
      };

      actionTd.appendChild(resolveBtn);
      actionTd.appendChild(rejectBtn);
      tr.appendChild(actionTd);
      
      adminQueriesTableBody.appendChild(tr);
    });

    adminResolvedTableBody.innerHTML = '';
    resolvedQueries.forEach(q => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="max-width: 250px; word-wrap: break-word;">${renderLongText(q.term)}</td>
        <td style="max-width: 250px; word-wrap: break-word;">${renderLongText(q.answer)}</td>
        <td>${q.userName || 'Unknown'}</td>
        <td>${q.resolvedBy}</td>
      `;
      adminResolvedTableBody.appendChild(tr);
    });

    // Render promoted FAQs table
    renderPromotedFaqsTable();
  }

  const adminPromotedTableBody = document.getElementById('admin-promoted-table-body');

  function renderPromotedFaqsTable() {
    if (!adminPromotedTableBody) return;
    adminPromotedTableBody.innerHTML = '';
    
    const adminFaqs = getAdminAddedFaqs();
    
    if (adminFaqs.length === 0) {
      adminPromotedTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; opacity: 0.6;">No promoted FAQs yet.</td></tr>';
      return;
    }

    adminFaqs.forEach((af, index) => {
      const categoryName = faqData[af.categoryIndex] ? faqData[af.categoryIndex].category : 'Unknown';
      const tr = document.createElement('tr');
      
      const questionTd = document.createElement('td');
      questionTd.style.cssText = 'max-width: 200px; word-wrap: break-word;';
      questionTd.textContent = af.question;
      
      const answerTd = document.createElement('td');
      answerTd.style.cssText = 'max-width: 200px; word-wrap: break-word;';
      answerTd.textContent = af.answer.length > 80 ? af.answer.slice(0, 80) + '...' : af.answer;
      
      const catTd = document.createElement('td');
      catTd.textContent = categoryName;
      
      const addedByTd = document.createElement('td');
      addedByTd.textContent = af.addedBy;
      
      const dateTd = document.createElement('td');
      dateTd.textContent = af.addedDate;
      
      const actionTd = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn';
      removeBtn.style.cssText = 'padding: 0.3rem 0.6rem; background-color: #ef4444; color: white; font-size: 0.8rem;';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        if (confirm(`Remove this FAQ?\n\n"${af.question}"\n\nThis will also deduct the +50 SP awarded to the student.`)) {
          // Remove from localStorage
          const faqs = getAdminAddedFaqs();
          faqs.splice(index, 1);
          setAdminAddedFaqs(faqs);
          
          // Remove from in-memory faqData
          if (faqData[af.categoryIndex]) {
            const qIdx = faqData[af.categoryIndex].questions.findIndex(q => q.q === af.question);
            if (qIdx !== -1) {
              faqData[af.categoryIndex].questions.splice(qIdx, 1);
            }
          }

          // Deduct the +50 SP from the student who asked the question
          const asker = users.find(u => u.email === af.askerEmail);
          if (asker) {
            if (asker.sp === undefined) asker.sp = 0;
            if (!asker.spHistory) asker.spHistory = [];
            
            asker.sp -= 50;
            asker.spHistory.push({
              query: af.question,
              amount: -50,
              type: 'penalty',
              date: new Date().toLocaleDateString()
            });
            saveState();
          }
          
          renderFaqs();
          renderPromotedFaqsTable();
        }
      });
      actionTd.appendChild(removeBtn);
      
      tr.appendChild(questionTd);
      tr.appendChild(answerTd);
      tr.appendChild(catTd);
      tr.appendChild(addedByTd);
      tr.appendChild(dateTd);
      tr.appendChild(actionTd);
      adminPromotedTableBody.appendChild(tr);
    });
  }

  // SP Edit Modal Logic
  const spEditModal = document.getElementById('sp-edit-modal');
  const spEditUserInfo = document.getElementById('sp-edit-user-info');
  const spEditCurrent = document.getElementById('sp-edit-current');
  const spEditAction = document.getElementById('sp-edit-action') as HTMLSelectElement;
  const spEditAmount = document.getElementById('sp-edit-amount') as HTMLInputElement;
  const spEditReason = document.getElementById('sp-edit-reason') as HTMLInputElement;
  const spEditSubmit = document.getElementById('sp-edit-submit');
  const spEditCancel = document.getElementById('sp-edit-cancel');
  let currentSpEditIndex: number | null = null;

  function openSpEditModal(userIndex: number) {
    const user = users[userIndex];
    if (!user) return;
    currentSpEditIndex = userIndex;
    spEditUserInfo.textContent = `${user.name || 'Unknown'} (${user.email})`;
    spEditCurrent.innerHTML = `Current SP: <strong>${user.sp || 0}</strong>`;
    spEditAction.value = 'award';
    spEditAmount.value = '';
    spEditReason.value = '';
    spEditModal.classList.add('active');
  }

  if (spEditCancel) {
    spEditCancel.addEventListener('click', () => {
      spEditModal.classList.remove('active');
    });
  }

  if (spEditSubmit) {
    spEditSubmit.addEventListener('click', () => {
      if (currentSpEditIndex === null) return;
      const amount = parseInt(spEditAmount.value);
      if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid positive number.');
        return;
      }
      const reason = spEditReason.value.trim() || 'Admin manual adjustment';
      const action = spEditAction.value;
      const user = users[currentSpEditIndex];
      if (!user) return;

      if (user.sp === undefined) user.sp = 0;
      if (!user.spHistory) user.spHistory = [];

      let change = 0;
      let historyType: 'award' | 'penalty' = 'award';

      if (action === 'award') {
        change = amount;
        user.sp += amount;
        historyType = 'award';
      } else if (action === 'deduct') {
        change = -amount;
        user.sp -= amount;
        historyType = 'penalty';
      } else if (action === 'set') {
        change = amount - user.sp;
        historyType = change >= 0 ? 'award' : 'penalty';
        user.sp = amount;
      }

      user.spHistory.push({
        query: reason,
        amount: change,
        type: historyType,
        date: new Date().toLocaleDateString()
      });

      saveState();
      renderAdminUsersTable();
      spEditModal.classList.remove('active');
    });
  }

  resolveCancelBtn.addEventListener('click', () => {
    resolveModal.classList.remove('active');
  });

  resolveSubmitBtn.addEventListener('click', () => {
    const answer = resolveAnswerInput.value.trim();
    if (!answer) return;
    
    if (currentResolveIndex !== null) {
      const queryToResolve = unresolvedQueries[currentResolveIndex];
      
      let giveCreditToProposer = false;
      let finalResolvedBy = currentAdminEmail;

      if (currentProposerEmail) {
        if (answer === currentOriginalProposedAnswer) {
          giveCreditToProposer = true;
        } else if (creditProposerCheckbox && creditProposerCheckbox.checked) {
          giveCreditToProposer = true;
        }
      }

      // Award SP if proposed by another student and they are getting credit
      if (giveCreditToProposer) {
        const proposer = users.find(u => u.email === currentProposerEmail);
        if (proposer) {
          if (proposer.sp === undefined) proposer.sp = 0;
          if (!proposer.spHistory) proposer.spHistory = [];
          
          proposer.sp += 30;
          proposer.spHistory.push({
            query: queryToResolve.term,
            amount: 30,
            type: 'award',
            date: new Date().toLocaleDateString()
          });
          
          finalResolvedBy = `Approved by Admin (Answered by ${proposer.name || proposer.email})`;
        }
      }

      // Handle FAQ Promotion
      if (addToFaqCheckbox && addToFaqCheckbox.checked) {
        const categoryIndex = parseInt(faqCategorySelect.value);
        const reframedQuestion = faqReframeInput.value.trim() || queryToResolve.term;
        
        // Add question to faqData in memory
        if (faqData[categoryIndex]) {
          faqData[categoryIndex].questions.push({
            q: reframedQuestion,
            a: answer
          });
        }

        // Persist to localStorage
        const adminFaqs = getAdminAddedFaqs();
        adminFaqs.push({
          question: reframedQuestion,
          answer: answer,
          categoryIndex: categoryIndex,
          addedBy: currentAdminEmail || 'Admin',
          addedDate: new Date().toLocaleDateString(),
          askerEmail: queryToResolve.userEmail
        });
        setAdminAddedFaqs(adminFaqs);

        // Award +50 SP to the student who asked the question
        const asker = users.find(u => u.email === queryToResolve.userEmail);
        if (asker) {
          if (asker.sp === undefined) asker.sp = 0;
          if (!asker.spHistory) asker.spHistory = [];
          
          asker.sp += 50;
          asker.spHistory.push({
            query: queryToResolve.term,
            amount: 50,
            type: 'award',
            date: new Date().toLocaleDateString()
          });
        }

        // Re-render FAQs and promoted table
        renderFaqs();
        renderPromotedFaqsTable();
      }

      resolvedQueries.push({
        term: queryToResolve.term,
        answer: answer,
        userName: queryToResolve.userName,
        userEmail: queryToResolve.userEmail,
        resolvedBy: finalResolvedBy
      });
      unresolvedQueries.splice(currentResolveIndex, 1);
      saveState();
      renderAdminUsersTable();
      resolveModal.classList.remove('active');
    }
  });

  rejectCancelBtn.addEventListener('click', () => {
    rejectModal.classList.remove('active');
  });

  rejectSubmitBtn.addEventListener('click', () => {
    if (currentRejectIndex !== null) {
      const queryToReject = unresolvedQueries[currentRejectIndex];
      const penaltyStr = rejectPenaltySelect.value;
      const penalty = parseInt(penaltyStr, 10);
      
      // Apply penalty to the user who asked
      if (penalty > 0) {
        const offendingUser = users.find(u => u.email === queryToReject.userEmail);
        if (offendingUser) {
          if (offendingUser.sp === undefined) offendingUser.sp = 0;
          if (!offendingUser.spHistory) offendingUser.spHistory = [];
          
          offendingUser.sp -= penalty;
          offendingUser.spHistory.push({
            query: queryToReject.term,
            amount: -penalty,
            type: 'penalty',
            date: new Date().toLocaleDateString()
          });
        }
      }
      
      unresolvedQueries.splice(currentRejectIndex, 1);
      saveState();
      renderAdminUsersTable();
      rejectModal.classList.remove('active');
    }
  });

  const adminEmail = document.getElementById('admin-email');
  const adminSignupBtn = document.getElementById('admin-signup-btn');
  const adminSignupSuccess = document.getElementById('admin-signup-success');
  const toggleAdminFormBtn = document.getElementById('toggle-admin-form');
  const adminFormTitle = document.getElementById('admin-form-title');
  const adminFormSubtitle = document.getElementById('admin-form-subtitle');
  let isAdminSignupMode = false;

  // Show community & leaderboard links when admin logs in
  function showAdminNavLinks() {
    navCommunityQueries.style.display = 'flex';
    if (navLeaderboard) navLeaderboard.style.display = 'flex';
  }

  // On admin lock, hide community/leaderboard ONLY if no student is logged in
  function hideAdminNavLinks() {
    if (!currentUserEmail) {
      navCommunityQueries.style.display = 'none';
      if (navLeaderboard) navLeaderboard.style.display = 'none';
    }
  }

  function lockAdmin() {
    currentAdminEmail = null;
    adminStep3.style.display = 'none';
    adminStep2.style.display = 'none';
    adminStep1.style.display = 'block';
    adminSecurityKey.value = '';
    adminEmail.value = '';
    adminPassword.value = '';
    adminKeyError.style.display = 'none';
    adminLoginError.style.display = 'none';
    adminSignupSuccess.style.display = 'none';
    hideAdminNavLinks();
  }

  // Step 1 -> Step 2
  adminVerifyKeyBtn.addEventListener('click', () => {
    if (adminSecurityKey.value === ADMIN_SECURITY_KEY) {
      adminKeyError.style.display = 'none';
      adminStep1.style.display = 'none';
      adminStep2.style.display = 'block';
    } else {
      adminKeyError.style.display = 'block';
    }
  });

  // Toggle Admin Login / Signup
  toggleAdminFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isAdminSignupMode = !isAdminSignupMode;
    adminLoginError.style.display = 'none';
    adminSignupSuccess.style.display = 'none';
    adminEmail.value = '';
    adminPassword.value = '';

    if (isAdminSignupMode) {
      adminFormTitle.textContent = 'Create Admin Account';
      adminFormSubtitle.textContent = 'Register a new admin with your email and password.';
      adminLoginBtn.style.display = 'none';
      adminSignupBtn.style.display = 'inline-block';
      toggleAdminFormBtn.textContent = 'Already have an admin account? Sign in';
    } else {
      adminFormTitle.textContent = 'Admin Login';
      adminFormSubtitle.textContent = 'Please sign in with your individual administrator credentials.';
      adminLoginBtn.style.display = 'inline-block';
      adminSignupBtn.style.display = 'none';
      toggleAdminFormBtn.textContent = 'Create a new admin account';
    }
  });

  // Admin Signup Logic
  adminSignupBtn.addEventListener('click', () => {
    const email = adminEmail.value.trim();
    const pass = adminPassword.value.trim();
    
    if (!email || !pass) {
      adminLoginError.textContent = 'Please enter an email and password.';
      adminLoginError.style.display = 'block';
      return;
    }

    if (admins.some(a => a.email === email)) {
      adminLoginError.textContent = 'Admin with this email already exists.';
      adminLoginError.style.display = 'block';
    } else {
      admins.push({ email, password: pass });
      saveState();
      adminLoginError.style.display = 'none';
      adminSignupSuccess.style.display = 'block';
      adminEmail.value = '';
      adminPassword.value = '';
    }
  });

  // Step 2 -> Step 3 (Admin Login Logic)
  adminLoginBtn.addEventListener('click', () => {
    const uEmail = adminEmail.value.trim();
    const uPass = adminPassword.value.trim();
    
    const admin = admins.find(a => a.email === uEmail && a.password === uPass);
    if (admin) {
      currentAdminEmail = uEmail;
      adminLoginError.style.display = 'none';
      adminStep2.style.display = 'none';
      adminStep3.style.display = 'block';
      showAdminNavLinks();
      renderAdminUsersTable();
      renderCommunityQueries();
      renderLeaderboard();
    } else {
      adminLoginError.textContent = 'Invalid Admin Email or Password.';
      adminLoginError.style.display = 'block';
    }
  });



  adminLockBtn.addEventListener('click', lockAdmin);

  // ===== Session Persistence & 5-Minute Inactivity Auto-Logout =====
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in ms

  // Track user activity — update lastActive timestamp
  function updateActivity() {
    if (currentUserEmail) {
      localStorage.setItem('faq_session_lastActive', Date.now().toString());
    }
  }

  // Listen for any user activity
  ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, updateActivity, { passive: true });
  });

  // Check every 30 seconds if user has been inactive for 5 minutes
  setInterval(() => {
    if (!currentUserEmail) return;
    const lastActive = parseInt(localStorage.getItem('faq_session_lastActive') || '0');
    if (Date.now() - lastActive > INACTIVITY_TIMEOUT) {
      alert('You have been signed out due to inactivity.');
      performLogout();
    }
  }, 30000);

  // Restore session on page load (if user was logged in and still active)
  const savedSessionEmail = localStorage.getItem('faq_session_email');
  const savedLastActive = parseInt(localStorage.getItem('faq_session_lastActive') || '0');

  if (savedSessionEmail && (Date.now() - savedLastActive < INACTIVITY_TIMEOUT)) {
    // User was active less than 5 min ago — restore session
    const userExists = users.some(u => u.email === savedSessionEmail);
    if (userExists) {
      loginUser(savedSessionEmail);
    } else {
      // User no longer exists, clear stale session
      localStorage.removeItem('faq_session_email');
      localStorage.removeItem('faq_session_lastActive');
    }
  } else if (savedSessionEmail) {
    // Session expired, clean up
    localStorage.removeItem('faq_session_email');
    localStorage.removeItem('faq_session_lastActive');
  }

});
