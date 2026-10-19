<template>
  <div id="app" class="app-layout">
    <!-- Material 3 Top App Bar -->
    <header class="navbar">
      <div class="nav-container">
        <!-- Brand Logo -->
        <router-link :to="isAuthenticated ? '/dashboard' : '/'" class="brand-link">
          <div class="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="6" y1="15" x2="10" y2="15"/>
            </svg>
          </div>
          <span class="brand-title">Expenses<span class="brand-accent">Tracker</span></span>
        </router-link>

        <!-- Navigation Links -->
        <nav class="nav-menu" v-if="isAuthenticated">
          <router-link to="/dashboard" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/transactions" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Transactions</span>
          </router-link>

          <router-link to="/categories" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>
            </svg>
            <span>Categories</span>
          </router-link>
        </nav>

        <!-- Right Side Auth / User Controls -->
        <div class="nav-right">
          <template v-if="isAuthenticated">
            <div class="user-profile-badge">
              <div class="user-avatar">{{ userInitials }}</div>
              <div class="user-details">
                <span class="user-name">{{ currentUser.name || 'User' }}</span>
                <span class="user-email">{{ currentUser.email || '' }}</span>
              </div>
            </div>

            <button class="md-btn md-btn-outlined logout-btn" @click="handleLogout" :disabled="loggingOut" title="Log out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>{{ loggingOut ? 'Exiting...' : 'Logout' }}</span>
            </button>
          </template>

          <template v-else>
            <router-link to="/login" class="md-btn md-btn-text">Sign In</router-link>
            <router-link to="/register" class="md-btn md-btn-filled">Get Started</router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- App Content Body -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Small Application Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <p class="footer-copy">
          &copy; {{ new Date().getFullYear() }} Expenses Tracker &bull; Open-source by
          <a href="https://github.com/yasserelgammal" target="_blank" rel="noopener noreferrer" class="author-link">
            Yasser Elgammal
          </a>
        </p>
        <div class="footer-links">
          <router-link to="/">Home</router-link>
          <span class="footer-dot">&bull;</span>
          <router-link :to="isAuthenticated ? '/dashboard' : '/login'">
            {{ isAuthenticated ? 'Dashboard' : 'Sign In' }}
          </router-link>
          <span class="footer-dot">&bull;</span>
          <a href="https://github.com/yasserelgammal" target="_blank" rel="noopener noreferrer" class="github-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      currentUser: {},
      loggingOut: false,
    };
  },
  computed: {
    userInitials() {
      if (!this.currentUser?.name) return 'U';
      const parts = this.currentUser.name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    },
  },
  watch: {
    $route() {
      this.syncAuthState();
    },
  },
  mounted() {
    this.syncAuthState();
    window.addEventListener('auth-changed', this.syncAuthState);
    window.addEventListener('storage', this.syncAuthState);
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.syncAuthState);
    window.removeEventListener('storage', this.syncAuthState);
  },
  methods: {
    syncAuthState() {
      const token = localStorage.getItem('access_token');
      this.isAuthenticated = !!token;

      if (token) {
        try {
          const raw = localStorage.getItem('user_data');
          this.currentUser = raw ? JSON.parse(raw) : {};
        } catch (e) {
          this.currentUser = {};
        }
      } else {
        this.currentUser = {};
      }
    },

    async handleLogout() {
      this.loggingOut = true;
      try {
        await authService.logout();
      } catch (err) {
        console.warn('Logout API error', err);
      } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        this.syncAuthState();
        this.loggingOut = false;
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: var(--md-surface-container-lowest);
  border-bottom: 1px solid var(--md-outline-variant);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--md-on-surface);
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.brand-accent {
  color: var(--md-primary);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  transition: all 0.15s ease;
}

.nav-item:hover {
  background-color: var(--md-surface-container-high);
  color: var(--md-on-surface);
}

.nav-item.router-link-active {
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface);
  line-height: 1.2;
}

.user-email {
  font-size: 11px;
  color: var(--md-on-surface-variant);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  height: 36px;
  padding: 0 16px;
  border-color: var(--md-outline-variant);
  color: var(--md-error);
}

.logout-btn:hover:not(:disabled) {
  background-color: var(--md-error-container);
  border-color: var(--md-error);
}

.main-content {
  flex: 1;
}

/* Small Footer */
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--md-outline-variant);
  background-color: var(--md-surface-container-lowest);
  padding: 16px 20px;
}

.footer-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: var(--md-outline);
}

.footer-copy {
  margin: 0;
}

.author-link {
  color: var(--md-primary);
  text-decoration: none;
  font-weight: 600;
}

.author-link:hover {
  text-decoration: underline;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-links a {
  color: var(--md-on-surface-variant);
  text-decoration: none;
  transition: color 0.15s ease;
}

.github-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.footer-links a:hover {
  color: var(--md-primary);
  text-decoration: underline;
}

.footer-dot {
  color: var(--md-outline-variant);
}

@media (max-width: 768px) {
  .nav-item span {
    display: none;
  }
  .user-details {
    display: none;
  }
  .footer-container {
    justify-content: center;
    text-align: center;
  }
}
</style>
