<template>
  <div class="pagination-container" v-if="total > 0">
    <div class="pagination-info">
      Showing <strong>{{ fromItem }}</strong> - <strong>{{ toItem }}</strong> of <strong>{{ total }}</strong> results
      <span class="page-summary">(Page {{ currentPage }} of {{ lastPage }})</span>
    </div>

    <div class="pagination-wrapper" role="navigation" aria-label="Pagination Navigation">
      <!-- First Page Button -->
      <button
        type="button"
        class="pagination-nav-btn"
        :disabled="currentPage <= 1 || loading"
        @click="goToPage(1)"
        title="First Page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="11 17 6 12 11 7"/>
          <polyline points="18 17 13 12 18 7"/>
        </svg>
      </button>

      <!-- Previous Page Button -->
      <button
        type="button"
        class="pagination-nav-btn"
        :disabled="currentPage <= 1 || loading"
        @click="goToPage(currentPage - 1)"
        title="Previous Page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span class="nav-btn-text">Prev</span>
      </button>

      <!-- Numbered Page Items & Ellipses -->
      <div class="page-numbers-list">
        <template v-for="(item, index) in visiblePages" :key="index">
          <!-- Ellipsis indicator -->
          <span v-if="item === '...'" class="pagination-ellipsis">
            •••
          </span>

          <!-- Page Number Button -->
          <button
            v-else
            type="button"
            class="page-number-btn"
            :class="{ active: item === currentPage }"
            :disabled="loading || item === currentPage"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>
      </div>

      <!-- Next Page Button -->
      <button
        type="button"
        class="pagination-nav-btn"
        :disabled="currentPage >= lastPage || loading"
        @click="goToPage(currentPage + 1)"
        title="Next Page"
      >
        <span class="nav-btn-text">Next</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <!-- Last Page Button -->
      <button
        type="button"
        class="pagination-nav-btn"
        :disabled="currentPage >= lastPage || loading"
        @click="goToPage(lastPage)"
        title="Last Page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1,
    },
    lastPage: {
      type: Number,
      required: true,
      default: 1,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 15,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fromItem() {
      if (this.total === 0) return 0;
      return (this.currentPage - 1) * this.perPage + 1;
    },
    toItem() {
      if (this.total === 0) return 0;
      return Math.min(this.currentPage * this.perPage, this.total);
    },
    visiblePages() {
      const current = this.currentPage || 1;
      const total = this.lastPage || 1;

      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      const pages = [];

      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(current - 1);
        pages.push(current);
        pages.push(current + 1);
        pages.push('...');
        pages.push(total);
      }

      return pages;
    },
  },
  methods: {
    goToPage(page) {
      if (page === '...' || page === this.currentPage || page < 1 || page > this.lastPage) {
        return;
      }
      this.$emit('page-change', page);
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 18px;
  margin-top: 12px;
  border-top: 1px solid var(--md-outline-variant);
}

.pagination-info {
  font-size: 13.5px;
  color: var(--md-on-surface-variant);
}

.pagination-info strong {
  color: var(--md-on-surface);
}

.page-summary {
  margin-left: 6px;
  color: var(--md-outline);
  font-size: 12.5px;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--md-surface-container-low);
  padding: 4px 6px;
  border-radius: 12px;
  border: 1px solid var(--md-outline-variant);
}

.page-numbers-list {
  display: flex;
  align-items: center;
  gap: 3px;
}

.page-number-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  border: 1px solid transparent;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-number-btn:hover:not(:disabled) {
  background-color: var(--md-surface-container-high);
  color: var(--md-on-surface);
}

.page-number-btn.active {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  border-color: var(--md-primary);
  font-weight: 600;
  cursor: default;
}

.pagination-ellipsis {
  min-width: 28px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--md-outline);
  letter-spacing: 1px;
  user-select: none;
}

.pagination-nav-btn {
  height: 34px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.pagination-nav-btn:hover:not(:disabled) {
  background-color: var(--md-surface-container-high);
  color: var(--md-on-surface);
}

.pagination-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.nav-btn-text {
  font-size: 12.5px;
}

@media (max-width: 680px) {
  .pagination-container {
    justify-content: center;
  }
  .nav-btn-text {
    display: none;
  }
  .page-summary {
    display: block;
    margin-left: 0;
    margin-top: 2px;
  }
}
</style>
