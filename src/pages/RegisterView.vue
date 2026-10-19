<template>
  <div class="auth-page-wrapper">
    <div class="md-card auth-card">
      <div class="auth-header">
        <div class="brand-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Set up your credentials to begin tracking expenses</p>
      </div>

      <div v-if="generalError" class="md-banner md-banner-error" role="alert">
        <span>{{ generalError }}</span>
      </div>

      <form @submit.prevent="handleRegister" novalidate>
        <!-- Full Name -->
        <div class="md-form-group">
          <label class="md-label" for="reg-name">Full Name</label>
          <input
            id="reg-name"
            type="text"
            class="md-input"
            :class="{ 'has-error': errors.name }"
            v-model.trim="form.name"
            placeholder="John Doe"
            autocomplete="name"
            maxlength="255"
            :disabled="loading"
          />
          <span v-if="errors.name" class="md-field-error">{{ errors.name[0] }}</span>
        </div>

        <!-- Email Address -->
        <div class="md-form-group">
          <label class="md-label" for="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            class="md-input"
            :class="{ 'has-error': errors.email }"
            v-model.trim="form.email"
            placeholder="name@example.com"
            autocomplete="email"
            maxlength="255"
            :disabled="loading"
          />
          <span v-if="errors.email" class="md-field-error">{{ errors.email[0] }}</span>
        </div>

        <!-- Password -->
        <div class="md-form-group">
          <div class="md-label">
            <label for="reg-password">Password</label>
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
            id="reg-password"
            :type="showPassword ? 'text' : 'password'"
            class="md-input"
            :class="{ 'has-error': errors.password }"
            v-model="form.password"
            placeholder="Min 8 chars, mixed case, number & symbol"
            autocomplete="new-password"
            :disabled="loading"
          />
          <span v-if="errors.password" class="md-field-error">{{ errors.password[0] }}</span>

          <!-- Material 3 Password Checklist -->
          <div class="pwd-criteria-box">
            <div class="criterion" :class="{ met: pwdCriteria.length }">
              <span class="criterion-dot"></span> 8+ Characters
            </div>
            <div class="criterion" :class="{ met: pwdCriteria.mixed }">
              <span class="criterion-dot"></span> Upper & lower case
            </div>
            <div class="criterion" :class="{ met: pwdCriteria.number }">
              <span class="criterion-dot"></span> Number
            </div>
            <div class="criterion" :class="{ met: pwdCriteria.symbol }">
              <span class="criterion-dot"></span> Symbol
            </div>
          </div>
        </div>

        <!-- Password Confirmation -->
        <div class="md-form-group">
          <label class="md-label" for="reg-confirm">Confirm Password</label>
          <input
            id="reg-confirm"
            :type="showPassword ? 'text' : 'password'"
            class="md-input"
            :class="{ 'has-error': errors.password_confirmation }"
            v-model="form.password_confirmation"
            placeholder="Repeat password"
            autocomplete="new-password"
            :disabled="loading"
          />
          <span v-if="errors.password_confirmation" class="md-field-error">
            {{ errors.password_confirmation[0] }}
          </span>
        </div>

        <button type="submit" class="md-btn md-btn-filled auth-submit-btn" :disabled="loading">
          <span v-if="loading" class="md-spinner"></span>
          <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <span>Already have an account?</span>
        <router-link to="/login" class="auth-link">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      errors: {},
      generalError: '',
      loading: false,
      showPassword: false,
    };
  },
  computed: {
    pwdCriteria() {
      const p = this.form.password || '';
      return {
        length: p.length >= 8,
        mixed: /[a-z]/.test(p) && /[A-Z]/.test(p),
        number: /[0-9]/.test(p),
        symbol: /[^a-zA-Z0-9]/.test(p),
      };
    },
  },
  methods: {
    validateClient() {
      this.errors = {};

      if (!this.form.name || !this.form.name.trim()) {
        this.errors.name = ['Name is required'];
      } else if (this.form.name.length > 255) {
        this.errors.name = ['Name must not exceed 255 characters'];
      }

      if (!this.form.email || !this.form.email.trim()) {
        this.errors.email = ['Email is required'];
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.form.email)) {
          this.errors.email = ['Please provide a valid email address'];
        } else if (this.form.email.length > 255) {
          this.errors.email = ['Email must not exceed 255 characters'];
        }
      }

      if (!this.form.password) {
        this.errors.password = ['Password is required'];
      } else {
        const c = this.pwdCriteria;
        if (!c.length || !c.mixed || !c.number || !c.symbol) {
          this.errors.password = [
            'Password must include uppercase, lowercase, numbers, and symbols (8+ chars)',
          ];
        }
      }

      if (!this.form.password_confirmation) {
        this.errors.password_confirmation = ['Password confirmation is required'];
      } else if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = ['Passwords do not match'];
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleRegister() {
      this.generalError = '';

      if (!this.validateClient()) {
        return;
      }

      this.loading = true;

      try {
        const response = await authService.register(this.form);

        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          if (response.user) {
            localStorage.setItem('user_data', JSON.stringify(response.user));
          }

          window.dispatchEvent(new Event('auth-changed'));
          this.$router.push('/dashboard');
        } else {
          this.generalError = 'Account created. Please proceed to sign in.';
          setTimeout(() => this.$router.push('/login'), 1500);
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || {};
        } else if (error.response?.data?.message) {
          this.generalError = error.response.data.message;
        } else {
          this.generalError = 'An unexpected error occurred. Please try again.';
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
  max-width: 440px;
  padding: 36px 32px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
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

.pwd-criteria-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
  background-color: var(--md-surface-container-low);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--md-outline-variant);
}

.criterion {
  font-size: 12px;
  color: var(--md-outline);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease;
}

.criterion-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--md-outline-variant);
}

.criterion.met {
  color: var(--md-primary);
  font-weight: 500;
}

.criterion.met .criterion-dot {
  background-color: var(--md-primary);
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
