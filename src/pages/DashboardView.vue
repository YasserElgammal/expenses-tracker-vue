<template>
  <div class="dashboard-page">
    <!-- Top Welcome Header & Quick Actions -->
    <div class="page-header">
      <div>
        <h1 class="welcome-title">Dashboard</h1>
        <p class="welcome-subtitle">Financial overview for <strong>{{ currentUser.name || 'User' }}</strong></p>
      </div>
      <div class="header-actions">
        <button class="md-btn md-btn-outlined" @click="openCategoryModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>New Category</span>
        </button>
        <button class="md-btn md-btn-filled" @click="openTransactionModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>New Transaction</span>
        </button>
      </div>
    </div>

    <!-- Alert / Feedback banner -->
    <div v-if="toastMessage" class="md-banner" :class="toastType === 'error' ? 'md-banner-error' : 'md-banner-success'" role="alert">
      <span>{{ toastMessage }}</span>
      <button class="md-banner-close" @click="toastMessage = ''" aria-label="Close">&times;</button>
    </div>

    <form class="md-card summary-filter" :class="{ expanded: showSummaryFilter }" @submit.prevent="applySummaryFilter">
      <div class="filter-header">
        <div class="filter-heading">
          <h2 class="filter-title">Financial Summary</h2>
          <p class="filter-subtitle">{{ summaryPeriodLabel }}</p>
        </div>
        <button
          type="button"
          class="md-btn md-btn-tonal filter-toggle"
          :aria-expanded="showSummaryFilter"
          aria-controls="summary-filter-controls"
          @click="showSummaryFilter = !showSummaryFilter"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 5h16M7 12h10M10 19h4"/>
          </svg>
          <span>{{ showSummaryFilter ? 'Hide Filters' : 'Show Filters' }}</span>
        </button>
      </div>

      <div v-show="showSummaryFilter" id="summary-filter-controls" class="filter-controls">
        <div class="filter-field">
          <label for="summary-month" class="md-label">Month</label>
          <select id="summary-month" v-model="summaryMonth" class="md-select">
            <option value="">Current month</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="filter-field">
          <label for="summary-year" class="md-label">Year</label>
          <input
            id="summary-year"
            v-model="summaryYear"
            class="md-input"
            type="number"
            min="2000"
            :max="maxFilterYear"
            placeholder="Current year"
          />
        </div>

        <div class="filter-actions">
          <button type="button" class="md-btn md-btn-text" :disabled="loadingStats" @click="resetSummaryFilter">
            Reset
          </button>
          <button type="submit" class="md-btn md-btn-filled" :disabled="loadingStats">
            <span v-if="loadingStats" class="md-spinner"></span>
            <span>{{ loadingStats ? 'Loading...' : 'Apply Filter' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Metric Stat Cards (M3 Elevated Surfaces) -->
    <div class="stats-grid">
      <!-- Income Card -->
      <div class="md-card stat-card">
        <div class="stat-header">
          <span class="stat-label">Total Monthly Income</span>
          <div class="stat-icon-wrapper income">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        </div>
        <div class="stat-value text-income">
          {{ formatCurrency(currentStats.month_income_total || 0, true) }}
        </div>
        <span class="stat-period">{{ summaryPeriodLabel }}</span>
      </div>

      <!-- Expense Card -->
      <div class="md-card stat-card">
        <div class="stat-header">
          <span class="stat-label">Total Monthly Expense</span>
          <div class="stat-icon-wrapper expense">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
        </div>
        <div class="stat-value text-expense">
          {{ formatCurrency(currentStats.month_expense_total || 0, true) }}
        </div>
        <span class="stat-period">{{ summaryPeriodLabel }}</span>
      </div>

      <!-- Savings Card -->
      <div class="md-card stat-card">
        <div class="stat-header">
          <span class="stat-label">Net Monthly Savings</span>
          <div class="stat-icon-wrapper savings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
        </div>
        <div class="stat-value" :class="parseNumericValue(currentStats.month_saving_total) >= 0 ? 'text-income' : 'text-expense'">
          {{ formatCurrency(currentStats.month_saving_total || 0, true) }}
        </div>
        <span class="stat-period">{{ summaryPeriodLabel }}</span>
      </div>
    </div>

    <!-- Recent Transactions Section -->
    <div class="md-card section-card">
      <div class="md-card-header">
        <div>
          <h2 class="section-title">Recent Transactions</h2>
          <p class="section-subtitle">Latest movements across your accounts</p>
        </div>
        <router-link to="/transactions" class="view-all-link">
          View All Transactions &rarr;
        </router-link>
      </div>

      <div v-if="loadingTransactions" class="md-empty-state">
        <div class="md-spinner"></div>
        <p style="margin-top: 12px;">Loading recent transactions...</p>
      </div>

      <div v-else-if="!recentTransactions.length" class="md-empty-state">
        <svg class="md-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 class="md-empty-title">No transactions recorded</h3>
        <p class="md-empty-desc">Begin tracking by adding your initial transaction.</p>
        <button class="md-btn md-btn-tonal" @click="openTransactionModal">
          Add First Transaction
        </button>
      </div>

      <div v-else class="md-table-container">
        <table class="md-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th class="text-right">Amount</th>
              <th class="text-center" style="width: 100px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in recentTransactions" :key="tx.id">
              <td class="whitespace-nowrap text-muted">{{ tx.date }}</td>
              <td>
                <span class="md-badge" :class="tx.category?.type === 'income' ? 'md-badge-income' : 'md-badge-expense'">
                  {{ tx.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="desc-cell">{{ tx.description }}</td>
              <td class="text-right font-semibold whitespace-nowrap" :class="parseNumericValue(tx.amount) >= 0 ? 'text-income' : 'text-expense'">
                {{ formatCurrency(tx.amount, true) }}
              </td>
              <td class="text-center whitespace-nowrap">
                <div class="action-buttons">
                  <button class="md-icon-btn btn-edit" @click="editTransaction(tx)" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="md-icon-btn btn-delete" @click="confirmDelete(tx)" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transaction Form Modal -->
    <TransactionFormModal
      v-if="showTransactionModal"
      :transactionData="selectedTransaction"
      @saved="handleTransactionSaved"
      @close="closeTransactionModal"
    />

    <!-- Category Form Modal -->
    <CategoryFormModal
      v-if="showCategoryModal"
      @saved="handleCategorySaved"
      @close="closeCategoryModal"
    />

    <!-- Material 3 Confirm Delete Dialog -->
    <div v-if="transactionToDelete" class="md-dialog-scrim" @click.self="transactionToDelete = null">
      <div class="md-dialog" role="dialog" aria-modal="true">
        <h3 class="md-dialog-title">Delete Transaction?</h3>
        <p class="md-dialog-subtitle">
          Are you sure you want to delete this transaction of
          <strong :class="parseNumericValue(transactionToDelete.amount) >= 0 ? 'text-income' : 'text-expense'">
            {{ formatCurrency(transactionToDelete.amount) }}
          </strong>? This action cannot be undone.
        </p>
        <div class="md-dialog-actions">
          <button class="md-btn md-btn-text" @click="transactionToDelete = null" :disabled="deleting">
            Cancel
          </button>
          <button class="md-btn md-btn-danger" @click="executeDelete" :disabled="deleting">
            <span v-if="deleting" class="md-spinner"></span>
            <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transactionService from '@/services/transaction.service';
import TransactionFormModal from '@/components/TransactionFormModal.vue';
import CategoryFormModal from '@/components/CategoryFormModal.vue';
import { formatCurrency, parseNumericValue } from '@/utils/currency';

export default {
  name: 'DashboardView',
  components: {
    TransactionFormModal,
    CategoryFormModal,
  },
  data() {
    return {
      currentUser: {},
      statisticsList: [],
      currentStats: {
        month_year: 'Current Month',
        month_income_total: 0,
        month_expense_total: 0,
        month_saving_total: 0,
      },
      recentTransactions: [],
      loadingTransactions: false,
      loadingStats: false,
      showSummaryFilter: false,
      summaryMonth: '',
      summaryYear: '',
      appliedSummaryMonth: '',
      appliedSummaryYear: '',
      showTransactionModal: false,
      showCategoryModal: false,
      selectedTransaction: null,
      transactionToDelete: null,
      deleting: false,
      toastMessage: '',
      toastType: 'success',
    };
  },
  computed: {
    months() {
      return Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, index, 1)),
      }));
    },
    maxFilterYear() {
      return this.currentYear + 1;
    },
    currentYear() {
      return new Date().getFullYear();
    },
    summaryPeriodLabel() {
      if (!this.appliedSummaryMonth && !this.appliedSummaryYear) return 'Current Month';
      const month = this.months.find((item) => item.value === Number(this.appliedSummaryMonth));
      return [month?.label, this.appliedSummaryYear].filter(Boolean).join(' ') || 'Current Month';
    },
  },
  mounted() {
    this.loadUserData();
    this.fetchDashboardData();
  },
  methods: {
    loadUserData() {
      try {
        const raw = localStorage.getItem('user_data');
        if (raw) {
          this.currentUser = JSON.parse(raw);
        }
      } catch (e) {
        console.error(e);
      }
    },

    formatCurrency(val, includeSign = false) {
      return formatCurrency(val, includeSign);
    },

    parseNumericValue(val) {
      return parseNumericValue(val);
    },

    async fetchDashboardData() {
      await Promise.all([
        this.fetchStatistics(this.appliedSummaryMonth, this.appliedSummaryYear),
        this.fetchRecentTransactions(),
      ]);
    },

    async fetchStatistics(month, year) {
      this.loadingStats = true;
      try {
        const effectiveYear = year || this.currentYear;
        const res = await transactionService.getStatistics({
          page: 1,
          items_per_page: 1,
          ...(month ? { month } : {}),
          year: effectiveYear,
        });
        this.statisticsList = res?.data || [];
        this.currentStats = this.statisticsList[0] || {
          month_year: 'Current Month',
          month_income_total: 0,
          month_expense_total: 0,
          month_saving_total: 0,
        };
        return true;
      } catch (err) {
        console.error('Failed to load statistics', err);
        return false;
      } finally {
        this.loadingStats = false;
      }
    },

    async applySummaryFilter() {
      const loaded = await this.fetchStatistics(this.summaryMonth, this.summaryYear);
      if (loaded) {
        this.appliedSummaryMonth = this.summaryMonth;
        this.appliedSummaryYear = this.summaryYear || (this.summaryMonth ? this.currentYear : '');
      }
    },

    async resetSummaryFilter() {
      this.summaryMonth = '';
      this.summaryYear = '';
      const loaded = await this.fetchStatistics();
      if (loaded) {
        this.appliedSummaryMonth = '';
        this.appliedSummaryYear = '';
      }
    },

    async fetchRecentTransactions() {
      this.loadingTransactions = true;
      try {
        const res = await transactionService.getAll({ page: 1 });
        const list = res?.data || [];
        this.recentTransactions = list.slice(0, 7);
      } catch (err) {
        console.error('Failed to load recent transactions', err);
      } finally {
        this.loadingTransactions = false;
      }
    },

    openTransactionModal() {
      this.selectedTransaction = null;
      this.showTransactionModal = true;
    },

    editTransaction(tx) {
      this.selectedTransaction = { ...tx };
      this.showTransactionModal = true;
    },

    closeTransactionModal() {
      this.showTransactionModal = false;
      this.selectedTransaction = null;
    },

    openCategoryModal() {
      this.showCategoryModal = true;
    },

    closeCategoryModal() {
      this.showCategoryModal = false;
    },

    handleTransactionSaved() {
      this.closeTransactionModal();
      this.showToast('Transaction saved successfully!', 'success');
      this.fetchDashboardData();
    },

    handleCategorySaved() {
      this.closeCategoryModal();
      this.showToast('Category created successfully!', 'success');
    },

    confirmDelete(tx) {
      this.transactionToDelete = tx;
    },

    async executeDelete() {
      if (!this.transactionToDelete) return;

      this.deleting = true;
      try {
        await transactionService.delete(this.transactionToDelete.id);
        this.showToast('Transaction deleted successfully.', 'success');
        this.transactionToDelete = null;
        this.fetchDashboardData();
      } catch (err) {
        this.showToast('Failed to delete transaction. Please try again.', 'error');
      } finally {
        this.deleting = false;
      }
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg;
      this.toastType = type;
      setTimeout(() => {
        if (this.toastMessage === msg) {
          this.toastMessage = '';
        }
      }, 4000);
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-on-surface);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.welcome-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--md-on-surface-variant);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.summary-filter {
  padding: 16px 20px;
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.filter-heading { flex: 1; }
.filter-title { margin: 0 0 2px; font-size: 16px; color: var(--md-on-surface); }
.filter-subtitle { margin: 0; font-size: 13px; color: var(--md-on-surface-variant); }
.filter-toggle { flex-shrink: 0; }
.filter-controls {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--md-outline-variant);
}
.filter-field { width: 170px; }
.filter-field .md-label { margin-bottom: 5px; }
.filter-field .md-input,
.filter-field .md-select { height: 42px; padding: 8px 12px; }
.filter-actions { display: flex; align-items: center; gap: 8px; }

.stat-card {
  padding: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.stat-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.income {
  background-color: var(--md-income-container);
  color: var(--md-on-income-container);
}

.stat-icon-wrapper.expense {
  background-color: var(--md-expense-container);
  color: var(--md-on-expense-container);
}

.stat-icon-wrapper.savings {
  background-color: var(--md-tertiary-container);
  color: var(--md-on-tertiary-container);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
}

.stat-period {
  font-size: 12px;
  color: var(--md-outline);
}

.section-card {
  margin-bottom: 28px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--md-on-surface);
  margin: 0 0 2px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--md-on-surface-variant);
  margin: 0;
}

.view-all-link {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--md-primary);
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.desc-cell {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  display: inline-flex;
  gap: 4px;
}

@media (max-width: 860px) {
  .filter-controls { width: 100%; }
  .filter-field { flex: 1; min-width: 150px; }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
