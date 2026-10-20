<template>
  <div class="statistics-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Statistics</h1>
        <p class="page-subtitle">Monthly income, expenses, and net savings history</p>
      </div>
    </div>

    <div v-if="errorMessage" class="md-banner md-banner-error" role="alert">
      <span>{{ errorMessage }}</span>
      <button class="md-banner-close" @click="errorMessage = ''" aria-label="Close">&times;</button>
    </div>

    <div class="md-card table-card">
      <div v-if="loading" class="md-empty-state">
        <div class="md-spinner"></div>
        <p class="loading-label">Loading statistics...</p>
      </div>

      <div v-else-if="statistics.length === 0" class="md-empty-state">
        <svg class="md-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="4" y1="20" x2="4" y2="10"/>
          <line x1="10" y1="20" x2="10" y2="4"/>
          <line x1="16" y1="20" x2="16" y2="13"/>
          <line x1="22" y1="20" x2="22" y2="7"/>
        </svg>
        <h3 class="md-empty-title">No statistics available</h3>
        <p class="md-empty-desc">Monthly summaries will appear here after transactions are recorded.</p>
      </div>

      <div v-else class="md-table-container">
        <table class="md-table">
          <thead>
            <tr>
              <th>Month / Year</th>
              <th class="text-right">Income</th>
              <th class="text-right">Expenses</th>
              <th class="text-right">Net Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stat, index) in statistics" :key="stat.month_year || index">
              <td class="font-semibold">{{ stat.month_year }}</td>
              <td class="text-right text-income font-medium">
                {{ formatCurrency(stat.month_income_total, true) }}
              </td>
              <td class="text-right text-expense font-medium">
                {{ formatCurrency(stat.month_expense_total, true) }}
              </td>
              <td
                class="text-right font-semibold"
                :class="parseNumericValue(stat.month_saving_total) >= 0 ? 'text-income' : 'text-expense'"
              >
                {{ formatCurrency(stat.month_saving_total, true) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination
        :currentPage="currentPage"
        :lastPage="meta.last_page || 1"
        :total="meta.total || 0"
        :perPage="meta.per_page || 12"
        :loading="loading"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import transactionService from '@/services/transaction.service';
import AppPagination from '@/components/AppPagination.vue';
import { formatCurrency, parseNumericValue } from '@/utils/currency';

export default {
  name: 'StatisticsView',
  components: { AppPagination },
  data() {
    return {
      statistics: [],
      currentPage: 1,
      meta: { current_page: 1, last_page: 1, total: 0, per_page: 12 },
      loading: false,
      errorMessage: '',
    };
  },
  mounted() {
    const page = parseInt(this.$route.query.page, 10);
    if (!Number.isNaN(page) && page > 0) this.currentPage = page;
    this.fetchStatistics();
  },
  methods: {
    formatCurrency,
    parseNumericValue,
    async fetchStatistics() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const res = await transactionService.getStatistics({
          page: this.currentPage,
          items_per_page: 12,
        });
        this.statistics = res?.data || [];
        if (res?.meta) {
          this.meta = res.meta;
          this.currentPage = res.meta.current_page || this.currentPage;
        }
      } catch (err) {
        console.error('Failed to load statistics', err);
        this.errorMessage = 'Failed to load statistics. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.$router.push({ query: { ...this.$route.query, page } });
      this.fetchStatistics();
    },
  },
};
</script>

<style scoped>
.statistics-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.page-header { margin-bottom: 24px; }
.page-title {
  margin: 0 0 4px;
  color: var(--md-on-surface);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.page-subtitle { margin: 0; color: var(--md-on-surface-variant); font-size: 14px; }
.table-card { padding: 20px; }
.loading-label { margin-top: 12px; }
</style>
