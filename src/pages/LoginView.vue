<template>
  <div class="auth-page-wrapper">
    <div class="md-card auth-card">
      <div class="auth-header">
        <div class="brand-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="2" y="4" width="20" height="16" rx="3"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
            <line x1="6" y1="15" x2="10" y2="15"/>
          </svg>
        </div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Sign in to your account to continue</p>
      </div>

      <div v-if="generalError" class="md-banner md-banner-error" role="alert">
        <span>{{ generalError }}</span>
      </div>

      <div v-if="successMessage" class="md-banner md-banner-success" role="alert">
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <!-- Email Input -->
        <div class="md-form-group">
          <label class="md-label" for="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            class="md-input"
            :class="{ 'has-error': errors.email }"
            v-model.trim="form.email"
            placeholder="name@example.com"
            autocomplete="email"
            :disabled="loading"
          />
          <span v-if="errors.email" class="md-field-error">{{ errors.email[0] }}</span>
        </div>

        <!-- Password Input -->
        <div class="md-form-group">
          <div class="md-label">
            <label for="login-password">Password</label>
            <button
              type="button"
              class="pwd-toggle-btn"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <input
            id="login-password"
            :type="showPassword ? 'text' : 'password'"
            class="md-input"
            :class="{ 'has-error': errors.password }"
            v-model="form.password"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="loading"
          />
          <span v-if="errors.password" class="md-field-error">{{ errors.password[0] }}</span>
        </div>

        <button type="submit" class="md-btn md-btn-filled auth-submit-btn" :disabled="loading">
          <span v-if="loading" class="md-spinner"></span>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <span>Don't have an account?</span>
        <router-link to="/register" class="auth-link">Create one</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {},
      generalError: '',
      successMessage: '',
      loading: false,
      showPassword: false,
    };
  },
  methods: {
    validateClient() {
      this.errors = {};

      if (!this.form.email) {
        this.errors.email = ['Email is required'];
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.form.email)) {
          this.errors.email = ['Please provide a valid email address'];
        }
      }

      if (!this.form.password) {
        this.errors.password = ['Password is required'];
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleLogin() {
      this.generalError = '';
      this.successMessage = '';

      if (!this.validateClient()) {
        return;
      }

      this.loading = true;

      try {
        const response = await authService.login(this.form);

        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          if (response.user) {
            localStorage.setItem('user_data', JSON.stringify(response.user));
          }

          window.dispatchEvent(new Event('auth-changed'));
          const redirect = this.$route.query.redirect || '/dashboard';
          this.$router.push(redirect);
        } else {
          this.generalError = 'Invalid server response. Please try again.';
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || {};
        } else if (error.response?.status === 401) {
          this.generalError = error.response.data?.message || 'Invalid login details';
        } else if (error.response?.data?.message) {
          this.generalError = error.response.data.message;
        } else {
          this.generalError = 'An unexpected network error occurred. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 32px 16px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 36px 32px;
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.brand-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--md-on-surface);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--md-on-surface-variant);
  margin: 0;
}

.pwd-toggle-btn {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--md-primary);
  cursor: pointer;
  padding: 0 4px;
}

.auth-submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 10px;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 13.5px;
  color: var(--md-on-surface-variant);
}

.auth-link {
  color: var(--md-primary);
  text-decoration: none;
  font-weight: 600;
  margin-left: 6px;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
