/* ─── V-gram script.js ────────────────────────────────────────────────────── */

const API = 'http://localhost:5000/api';

/* ════════════════════════════════════════════════════════
   AUTH HELPERS
════════════════════════════════════════════════════════ */
function getToken() {
  return localStorage.getItem('vgram_token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

function checkAuth() {
  if (!getToken()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('vgram_token');
  localStorage.removeItem('vgram_user');
  window.location.href = 'index.html';
}

/* ════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════ */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function avatarUrl(id) {
  return `https://i.pravatar.cc/80?u=${id}`;
}

function randomUnsplash(seed) {
  const s = Math.abs(seed || Math.floor(Math.random() * 9999));
  return `https://picsum.photos/seed/${s}/640/420`;
}

/* ════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
════════════════════════════════════════════════════════ */
function ensureToastContainer() {
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function showToast(msg, type = 'info') {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-dot"></div><span class="toast-msg">${esc(msg)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ════════════════════════════════════════════════════════
   AUTH — LOGIN
════════════════════════════════════════════════════════ */
async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('login-btn');

  if (!email || !password) return showToast('Please fill in all fields', 'error');

  btn.classList.add('btn-loading');
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || 'Login failed', 'error');
      return;
    }

    localStorage.setItem('vgram_token', data.token);
    localStorage.setItem('vgram_user', JSON.stringify(data.user));
    window.location.href = 'feed.html';
  } catch {
    showToast('Network error. Is the server running?', 'error');
  } finally {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}

/* ════════════════════════════════════════════════════════
   AUTH — REGISTER
════════════════════════════════════════════════════════ */
async function registerUser(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn      = document.getElementById('register-btn');

  if (!username || !email || !password) return showToast('Please fill in all fields', 'error');
  if (password.length < 6) return showToast('Password must be at least 6 characters', 'error');

  btn.classList.add('btn-loading');
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || 'Registration failed', 'error');
      return;
    }

    localStorage.setItem('vgram_token', data.token);
    localStorage.setItem('vgram_user', JSON.stringify(data.user));
    showToast('Account created! Welcome to V-gram 🎉', 'success');
    setTimeout(() => { window.location.href = 'feed.html'; }, 800);
  } catch {
    showToast('Network error. Is the server running?', 'error');
  } finally {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}

/* ════════════════════════════════════════════════════════
   SIDEBAR & CURRENT USER
════════════════════════════════════════════════════════ */
async function loadCurrentUser() {
  try {
    const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
    if (!res.ok) { logout(); return; }
    const { user } = await res.json();
    localStorage.setItem('vgram_user', JSON.stringify(user));

    const nameEl   = document.getElementById('sidebar-username');
    const avatarEl = document.getElementById('sidebar-avatar');
    if (nameEl)   nameEl.textContent  = user.username;
    if (avatarEl) avatarEl.src        = avatarUrl(user._id);
  } catch {
    // silently fail
  }
}

/* ════════════════════════════════════════════════════════
   POSTS
════════════════════════════════════════════════════════ */
function renderSkeletons(n = 3) {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;
  feed.innerHTML = Array.from({ length: n }).map(() => `
    <div class="skeleton-post">
      <div class="sk-row">
        <div class="skeleton sk-avatar"></div>
        <div style="flex:1">
          <div class="skeleton sk-line" style="width:40%;margin-bottom:8px"></div>
          <div class="skeleton sk-line" style="width:25%"></div>
        </div>
      </div>
      <div class="skeleton sk-line" style="width:90%;margin-bottom:8px"></div>
      <div class="skeleton sk-line" style="width:75%;margin-bottom:14px"></div>
      <div class="skeleton sk-image"></div>
    </div>
  `).join('');
}

async function fetchPosts() {
  renderSkeletons();
  try {
    const res = await fetch(`${API}/posts`);
    if (!res.ok) { showToast('Failed to load posts', 'error'); return; }
    const { posts } = await res.json();
    renderPosts(posts);
  } catch {
    showToast('Cannot reach server', 'error');
  }
}

function renderPosts(posts) {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;

  if (!posts.length) {
    feed.innerHTML = `<div class="card text-center" style="padding:40px;color:var(--text-3)">
      No posts yet. Be the first to share something! ✨
    </div>`;
    return;
  }

  const me = JSON.parse(localStorage.getItem('vgram_user') || '{}');

  feed.innerHTML = posts.map((post, idx) => {
    const liked   = me._id && post.likes.includes(me._id);
    const hasImg  = Math.random() < 0.6;
    const imgSeed = (post._id ? post._id.slice(-4) : idx) + idx;
    const imgHtml = hasImg
      ? `<img class="post-image" src="${randomUnsplash(parseInt(imgSeed, 16) || idx * 7)}" alt="post image" loading="lazy">`
      : '';

    return `
    <div class="post-card" data-post-id="${esc(post._id)}">
      <div class="post-header">
        <img class="post-avatar" src="${avatarUrl(post.user)}" alt="${esc(post.username)}">
        <div class="post-meta">
          <div class="post-username">${esc(post.username)}</div>
          <div class="post-time">${timeAgo(post.createdAt)}</div>
        </div>
      </div>
      <div class="post-body">
        <div class="post-text">${esc(post.content)}</div>
        ${imgHtml}
      </div>
      <div class="post-actions">
        <button class="action-btn like-btn ${liked ? 'liked' : ''}" onclick="handleLike('${esc(post._id)}', this)">
          <svg fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span class="like-count">${post.likes.length}</span>
        </button>
        <button class="action-btn" onclick="toggleComments('${esc(post._id)}')">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <span>${post.comments.length}</span>
        </button>
      </div>
      <div class="comments-section" id="comments-${esc(post._id)}">
        <div class="comment-list">
          ${(post.comments || []).map(c => `
            <div class="comment-item">
              <img src="${avatarUrl(c.user)}" alt="${esc(c.username)}">
              <div>
                <div class="comment-username">${esc(c.username)}</div>
                <div class="comment-text">${esc(c.text)}</div>
                <div class="comment-time">${timeAgo(c.createdAt)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="comment-input-row">
          <img src="${avatarUrl(me._id || 'guest')}" alt="you">
          <input type="text" class="comment-input" placeholder="Add a comment…" 
            onkeydown="if(event.key==='Enter') handleComment('${esc(post._id)}', this)">
          <button class="comment-send" onclick="handleComment('${esc(post._id)}', this.previousElementSibling)">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function createPost() {
  const textarea = document.getElementById('post-content');
  const btn      = document.getElementById('post-btn');
  const content  = textarea.value.trim();

  if (!content) return showToast('Write something first!', 'error');

  btn.disabled = true;
  btn.classList.add('btn-loading');

  try {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content }),
    });
    const data = await res.json();

    if (!res.ok) { showToast(data.message || 'Post failed', 'error'); return; }

    textarea.value = '';
    showToast('Post shared! ✨', 'success');
    fetchPosts();
  } catch {
    showToast('Network error', 'error');
  } finally {
    btn.disabled = false;
    btn.classList.remove('btn-loading');
  }
}

async function handleLike(postId, btn) {
  if (!getToken()) return showToast('Log in to like posts', 'info');

  try {
    const res = await fetch(`${API}/posts/like/${postId}`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    if (!res.ok) return;
    const { likes, liked } = await res.json();

    const svg = btn.querySelector('svg');
    btn.classList.toggle('liked', liked);
    svg.setAttribute('fill', liked ? 'currentColor' : 'none');
    btn.querySelector('.like-count').textContent = likes;
  } catch {
    showToast('Network error', 'error');
  }
}

async function handleComment(postId, input) {
  const text = input.value.trim();
  if (!text) return;
  if (!getToken()) return showToast('Log in to comment', 'info');

  try {
    const res = await fetch(`${API}/posts/comment/${postId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Comment failed', 'error'); return; }

    input.value = '';
    const list = document.querySelector(`#comments-${postId} .comment-list`);
    const c = data.comment;
    const me = JSON.parse(localStorage.getItem('vgram_user') || '{}');
    const el = document.createElement('div');
    el.className = 'comment-item';
    el.innerHTML = `
      <img src="${avatarUrl(me._id)}" alt="${esc(c.username)}">
      <div>
        <div class="comment-username">${esc(c.username)}</div>
        <div class="comment-text">${esc(c.text)}</div>
        <div class="comment-time">just now</div>
      </div>
    `;
    list.appendChild(el);
    list.scrollTop = list.scrollHeight;
  } catch {
    showToast('Network error', 'error');
  }
}

function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (section) section.classList.toggle('open');
}

/* ════════════════════════════════════════════════════════
   STORIES
════════════════════════════════════════════════════════ */
const STORY_USERS = [
  { id: 'u1', name: 'alex_v',   color: '#7C3AED' },
  { id: 'u2', name: 'mia_c',    color: '#0ea5e9' },
  { id: 'u3', name: 'devjordan',color: '#10b981' },
  { id: 'u4', name: 'sara_l',   color: '#f59e0b' },
  { id: 'u5', name: 'kai_d',    color: '#ef4444' },
  { id: 'u6', name: 'nova_x',   color: '#8b5cf6' },
];

function loadStories() {
  const bar = document.getElementById('stories-bar');
  if (!bar) return;

  bar.innerHTML = STORY_USERS.map((u, i) => `
    <div class="story-item" onclick="openStory('${u.id}', '${esc(u.name)}', ${i})">
      <div class="story-ring">
        <img src="${avatarUrl(u.id)}" alt="${esc(u.name)}">
      </div>
      <span class="story-name">${esc(u.name)}</span>
    </div>
  `).join('');
}

let storyTimer = null;

function openStory(userId, username, idx) {
  const overlay = document.getElementById('story-modal-overlay');
  const fill    = document.getElementById('story-progress-fill');
  const userImg = document.getElementById('story-user-img');
  const userEl  = document.getElementById('story-username');
  const storyImg= document.getElementById('story-image');

  if (!overlay) return;

  userImg.src       = avatarUrl(userId);
  userEl.textContent = username;
  storyImg.src = `https://picsum.photos/seed/${idx * 31 + 5}/340/560`;
  
  overlay.classList.add('open');

  // Progress animation
  fill.style.transition = 'none';
  fill.style.width = '0%';
  requestAnimationFrame(() => {
    fill.style.transition = 'width 5s linear';
    fill.style.width = '100%';
  });

  if (storyTimer) clearTimeout(storyTimer);
  storyTimer = setTimeout(closeStory, 5000);
}

function closeStory() {
  const overlay = document.getElementById('story-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  if (storyTimer) clearTimeout(storyTimer);
}

/* ════════════════════════════════════════════════════════
   SUGGESTIONS (Who to Follow)
════════════════════════════════════════════════════════ */
async function loadSuggestions() {
  const container = document.getElementById('suggestions-list');
  if (!container) return;

  try {
    const res = await fetch(`${API}/users/suggestions`, { headers: authHeaders() });
    const data = await res.json();
    const users = data.users || [];

    if (!users.length) {
      container.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem">No suggestions yet</p>';
      return;
    }

    container.innerHTML = users.map(u => `
      <div class="suggestion-item">
        <img src="${avatarUrl(u._id)}" alt="${esc(u.username)}">
        <div class="suggestion-info">
          <div class="suggestion-name">${esc(u.username)}</div>
          <div class="suggestion-sub">${esc(u.bio || 'V-gram user')}</div>
        </div>
        <button class="follow-btn" onclick="toggleFollow(this)">${'Follow'}</button>
      </div>
    `).join('');
  } catch {
    // silently fail
  }
}

function toggleFollow(btn) {
  const isFollowing = btn.classList.toggle('following');
  btn.textContent = isFollowing ? 'Following' : 'Follow';
  showToast(isFollowing ? 'Followed!' : 'Unfollowed', 'info');
}

/* ════════════════════════════════════════════════════════
   SEARCH (right panel quick search)
════════════════════════════════════════════════════════ */
async function searchUsers(query) {
  const results = document.getElementById('search-results');
  if (!results) return;
  if (!query.trim()) { results.innerHTML = ''; return; }

  try {
    const res = await fetch(`${API}/users/search?q=${encodeURIComponent(query)}`, {
      headers: authHeaders(),
    });
    const data = await res.json();

    if (!data.users.length) {
      results.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem;padding:8px">No users found</p>';
      return;
    }

    results.innerHTML = data.users.map(u => `
      <div class="user-result-item" onclick="window.location.href='profile.html?u=${esc(u.username)}'">
        <img src="${avatarUrl(u._id)}" alt="${esc(u.username)}">
        <div>
          <div class="user-result-name">${esc(u.username)}</div>
          <div class="user-result-bio">${esc(u.bio || 'V-gram user')}</div>
        </div>
      </div>
    `).join('');
  } catch {
    // silently fail
  }
}

/* ════════════════════════════════════════════════════════
   EXPLORE (search page grid)
════════════════════════════════════════════════════════ */
function loadExplore() {
  const grid = document.getElementById('explore-grid');
  if (!grid) return;

  const seeds = [10,20,30,40,50,60,70,80,90,100,110,120];
grid.innerHTML = seeds.map((s) => `
  <div class="explore-item">
    <img src="https://picsum.photos/seed/${s}/400/400" alt="explore" loading="lazy">
    <div class="explore-overlay"><span>♥ Explore</span></div>
  </div>
`).join('');
}

/* ════════════════════════════════════════════════════════
   PROFILE PAGE
════════════════════════════════════════════════════════ */
async function loadProfilePage() {
  const params = new URLSearchParams(window.location.search);
  const me     = JSON.parse(localStorage.getItem('vgram_user') || '{}');
  const uname  = params.get('u') || me.username;

  if (!uname) return;

  try {
    // Load user info
    const res = await fetch(`${API}/users/${uname}`, { headers: authHeaders() });
    if (!res.ok) { showToast('User not found', 'error'); return; }
    const { user } = await res.json();

    const nameEl  = document.getElementById('profile-name');
    const unEl    = document.getElementById('profile-username');
    const bioEl   = document.getElementById('profile-bio');
    const avatarEl= document.getElementById('profile-avatar');
    const postsC  = document.getElementById('profile-posts-count');
    const follC   = document.getElementById('profile-followers-count');
    const followC = document.getElementById('profile-following-count');

    if (nameEl)   nameEl.textContent   = user.username;
    if (unEl)     unEl.textContent     = `@${user.username}`;
    if (bioEl)    bioEl.textContent    = user.bio || 'No bio yet.';
    if (avatarEl) avatarEl.src         = avatarUrl(user._id);
    if (follC)    follC.textContent    = (user.followers || []).length;
    if (followC)  followC.textContent  = (user.following || []).length;

    // Load posts count
    const postsRes = await fetch(`${API}/posts`, { headers: authHeaders() });
    const postsData = await postsRes.json();
    const userPosts = (postsData.posts || []).filter(p => p.username === user.username);
    if (postsC) postsC.textContent = userPosts.length;

    // Render posts grid
    const grid = document.getElementById('profile-posts-grid');
    if (grid) {
      grid.innerHTML = userPosts.length
        ? userPosts.map((p, i) => `
          <div class="posts-grid-item">
            <img src="${randomUnsplash(i * 13 + 7)}" alt="post" loading="lazy">
          </div>
        `).join('')
        : `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-3)">
            No posts yet
          </div>`;
    }
  } catch {
    showToast('Failed to load profile', 'error');
  }
}

/* ════════════════════════════════════════════════════════
   PASSWORD TOGGLE
════════════════════════════════════════════════════════ */
function setupPasswordToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = show
      ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
         </svg>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
           <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
         </svg>`;
  });
}

/* ════════════════════════════════════════════════════════
   SEARCH PAGE TABS
════════════════════════════════════════════════════════ */
function setupSearchTabs() {
  const tabs = document.querySelectorAll('.search-tab');
  const sections = {
    explore: document.getElementById('tab-explore'),
    people:  document.getElementById('tab-people'),
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      Object.entries(sections).forEach(([k, el]) => {
        if (el) el.classList.toggle('hidden', k !== target);
      });
    });
  });
}

/* ════════════════════════════════════════════════════════
   PAGE INIT — auto-detect page and run appropriate setup
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  // Password toggles (auth pages)
  setupPasswordToggle('pw-toggle', 'password');

  if (page === 'login') {
    // Already logged in?
    if (getToken()) window.location.href = 'feed.html';
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', loginUser);
  }

  if (page === 'register') {
    if (getToken()) window.location.href = 'feed.html';
    const form = document.getElementById('register-form');
    if (form) form.addEventListener('submit', registerUser);
  }

  if (page === 'feed') {
    if (!checkAuth()) return;
    loadCurrentUser();
    loadStories();
    fetchPosts();
    loadSuggestions();

    // Quick search debounce
    const searchInput = document.getElementById('quick-search');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchUsers(searchInput.value), 350);
      });
    }

    // Create post
    const postBtn = document.getElementById('post-btn');
    if (postBtn) postBtn.addEventListener('click', createPost);
  }

  if (page === 'search') {
    if (!checkAuth()) return;
    loadCurrentUser();
    loadExplore();
    setupSearchTabs();

    // People search
    const input = document.getElementById('people-search-input');
    if (input) {
      let debounceTimer;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const results = document.getElementById('people-results');
          if (!results) return;
          if (!input.value.trim()) { results.innerHTML = ''; return; }

          try {
            const res = await fetch(`${API}/users/search?q=${encodeURIComponent(input.value)}`, { headers: authHeaders() });
            const data = await res.json();
            results.innerHTML = (data.users || []).map(u => `
              <div class="user-result-item" onclick="window.location.href='profile.html?u=${esc(u.username)}'">
                <img src="${avatarUrl(u._id)}" alt="${esc(u.username)}">
                <div>
                  <div class="user-result-name">${esc(u.username)}</div>
                  <div class="user-result-bio">${esc(u.bio || 'V-gram user')}</div>
                </div>
              </div>
            `).join('') || '<p style="color:var(--text-3);font-size:0.85rem;padding:8px">No users found</p>';
          } catch {}
        }, 350);
      });
    }
  }

  if (page === 'profile') {
    if (!checkAuth()) return;
    loadCurrentUser();
    loadProfilePage();
  }
});
