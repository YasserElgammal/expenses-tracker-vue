<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="eyebrow-pill">Smart Personal Finance</span>
          <span class="eyebrow-text">Take control of your cash flow</span>
        </div>

        <h1 class="hero-title">
          Track your expenses <span class="highlight">efficiently</span> and master your money.
        </h1>

        <p class="hero-description">
          Gain complete visibility over where every dollar goes. From daily coffee runs to monthly salary deposits,
          Expenses Tracker organizes your transactions into structured categories and calculates your net savings automatically.
        </p>

        <div class="hero-actions">
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="md-btn md-btn-filled hero-btn">
              <span>Go to Dashboard</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/register" class="md-btn md-btn-filled hero-btn">
              <span>Get Started Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
            <router-link to="/login" class="md-btn md-btn-outlined hero-btn-secondary">
              <span>Sign In</span>
            </router-link>
          </template>
        </div>
      </div>
    </section>

    <!-- Key Feature Highlights (Material 3 Cards) -->
    <section class="features-section">
      <div class="section-heading">
        <h2 class="features-title">Everything you need to stay on budget</h2>
        <p class="features-subtitle">Designed with Google Material 3 principles for focus, clarity, and ease of use.</p>
      </div>

      <div class="features-grid">
        <!-- Feature 1 -->
        <div class="md-card feature-card">
          <div class="feature-icon-wrapper income-tint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h3 class="feature-title">Smart Categorization</h3>
          <p class="feature-text">
            Group your cash movements by purpose. Expenses are automatically formatted and signed so your ledger stays accurate without manual math.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="md-card feature-card">
          <div class="feature-icon-wrapper savings-tint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h3 class="feature-title">Monthly Net Savings</h3>
          <p class="feature-text">
            See your total monthly income vs expenditures at a glance. Understand your actual savings rate month over month to achieve your financial goals faster.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="md-card feature-card">
          <div class="feature-icon-wrapper primary-tint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 class="feature-title">Secure & Transparent</h3>
          <p class="feature-text">
            Protected by Laravel Sanctum token-based authentication. Your financial entries remain private, searchable, and fully under your control.
          </p>
        </div>
      </div>
    </section>

    <!-- Metrics Banner -->
    <section class="metrics-section">
      <div class="md-card metrics-card">
        <div class="metric-item">
          <span class="metric-number">100%</span>
          <span class="metric-label">Private & Free to use</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-number">Real-Time</span>
          <span class="metric-label">Calculations & Balances</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-number">M3 Design</span>
          <span class="metric-label">Clean, accessible typography</span>
        </div>
      </div>
    </section>

    <!-- Open Source Author Callout -->
    <section class="opensource-section">
      <div class="opensource-banner">
        <div class="opensource-text">
          <span class="md-badge md-badge-income">Open Source</span>
          <p>
            Crafted with passion by <strong>Yasser Elgammal</strong>. Free, open, and community-driven.
          </p>
        </div>
        <a
          href="https://github.com/yasserelgammal"
          target="_blank"
          rel="noopener noreferrer"
          class="md-btn md-btn-outlined"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      isAuthenticated: false,
    };
  },
  mounted() {
    this.checkAuth();
    window.addEventListener('auth-changed', this.checkAuth);
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.checkAuth);
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('access_token');
      this.isAuthenticated = !!token;
    },
  },
};
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 48px 12px 64px;
}

.hero-content {
  max-width: 820px;
  margin: 0 auto;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--md-surface-container-high);
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--md-outline-variant);
}

.eyebrow-pill {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 11.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eyebrow-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.hero-title {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.18;
  color: var(--md-on-surface);
  letter-spacing: -0.025em;
  margin-bottom: 20px;
}

.hero-title .highlight {
  color: var(--md-primary);
  text-decoration: underline;
  text-decoration-color: var(--md-primary-container);
  text-underline-offset: 6px;
}

.hero-description {
  font-size: 17px;
  line-height: 1.65;
  color: var(--md-on-surface-variant);
  margin: 0 auto 36px;
  max-width: 720px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-btn {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

.hero-btn-secondary {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

/* Features Section */
.features-section {
  margin-top: 24px;
  margin-bottom: 64px;
}

.section-heading {
  text-align: center;
  margin-bottom: 40px;
}

.features-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.features-subtitle {
  font-size: 15px;
  color: var(--md-on-surface-variant);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.income-tint {
  background-color: var(--md-income-container);
  color: var(--md-on-income-container);
}

.savings-tint {
  background-color: var(--md-tertiary-container);
  color: var(--md-on-tertiary-container);
}

.primary-tint {
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--md-on-surface);
  margin-bottom: 10px;
}

.feature-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--md-on-surface-variant);
  margin: 0;
}

/* Metrics Section */
.metrics-section {
  display: flex;
  justify-content: center;
}

.metrics-card {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 32px;
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-number {
  font-size: 28px;
  font-weight: 800;
  color: var(--md-primary);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 13.5px;
  color: var(--md-on-surface-variant);
  font-weight: 500;
}

.metric-divider {
  width: 1px;
  height: 48px;
  background-color: var(--md-outline-variant);
}

@media (max-width: 860px) {
  .hero-title {
    font-size: 32px;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .metric-divider {
    display: none;
  }
}

/* Open Source Section */
.opensource-section {
  margin-top: 48px;
}

.opensource-banner {
  background-color: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.opensource-text {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.opensource-text p {
  margin: 0;
  font-size: 14px;
  color: var(--md-on-surface-variant);
}

.opensource-text strong {
  color: var(--md-on-surface);
}
</style>
