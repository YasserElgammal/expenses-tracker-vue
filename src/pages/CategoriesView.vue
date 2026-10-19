<template>
  <div class="categories-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">Organize and manage transaction classifications for income and expenses</p>
      </div>
      <button class="md-btn md-btn-filled" @click="openCreateModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>New Category</span>
      </button>
    </div>

    <!-- Alert Banner -->
    <div v-if="toastMessage" class="md-banner" :class="toastType === 'error' ? 'md-banner-error' : 'md-banner-success'" role="alert">
      <span>{{ toastMessage }}</span>
      <button class="md-banner-close" @click="toastMessage = ''" aria-label="Close">&times;</button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="md-card filters-toolbar">
      <div class="search-field">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          class="search-input"
          placeholder="Filter categories by name or description..."
        />
      </div>

      <div class="md-chip-group">
        <button
          type="button"
          class="md-chip"
          :class="{ active: typeFilter === 'all' }"
          @click="typeFilter = 'all'"
        >
          All
        </button>
        <button
          type="button"
          class="md-chip"
          :class="{ active: typeFilter === 'income' }"
          @click="typeFilter = 'income'"
        >
          Income
        </button>
        <button
          type="button"
          class="md-chip"
          :class="{ active: typeFilter === 'expense' }"
          @click="typeFilter = 'expense'"
        >
          Expense
        </button>
      </div>
    </div>

    <!-- Table Card Container -->
    <div class="md-card table-card">
      <div v-if="loading" class="md-empty-state">
        <div class="md-spinner"></div>
        <p style="margin-top: 12px;">Loading categories...</p>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="md-empty-state">
        <svg class="md-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>
        </svg>
        <h3 class="md-empty-title">No categories found</h3>
        <p class="md-empty-desc">
          {{ searchQuery || typeFilter !== 'all' ? 'Try adjusting your search filter.' : 'Create categories to start organizing your transactions.' }}
        </p>
        <button class="md-btn md-btn-tonal" @click="openCreateModal">
          Create Category
        </button>
      </div>

      <div v-else class="md-table-container">
        <table class="md-table">
          <thead>
            <tr>
              <th style="width: 70px;">ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Source</th>
              <th class="text-center" style="width: 100px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in filteredCategories" :key="cat.id">
              <td class="text-muted font-medium">#{{ cat.id }}</td>
              <td class="font-semibold">{{ cat.name }}</td>
              <td>
                <span class="md-badge" :class="cat.type === 'income' ? 'md-badge-income' : 'md-badge-expense'">
                  {{ cat.type === 'income' ? 'Income' : 'Expense' }}
                </span>
              </td>
              <td class="desc-cell">{{ cat.description || '—' }}</td>
              <td>
                <span class="md-badge md-badge-neutral">{{ cat.added_source || 'manual' }}</span>
              </td>
              <td class="text-center whitespace-nowrap">
                <div class="action-buttons">
                  <button class="md-icon-btn btn-edit" @click="openEditModal(cat)" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="md-icon-btn btn-delete" @click="confirmDelete(cat)" title="Delete">
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

      <!-- App Pagination -->
      <AppPagination
        :currentPage="currentPage"
        :lastPage="meta.last_page || 1"
        :total="meta.total || 0"
        :perPage="meta.per_page || 15"
        :loading="loading"
        @page-change="changePage"
      />
    </div>

    <!-- Category Form Modal -->
    <CategoryFormModal
      v-if="showModal"
      :categoryData="selectedCategory"
      @saved="handleSaved"
      @close="closeModal"
    />

    <!-- Material 3 Confirm Delete Dialog -->
    <div v-if="categoryToDelete" class="md-dialog-scrim" @click.self="categoryToDelete = null">
      <div class="md-dialog" role="dialog" aria-modal="true">
        <h3 class="md-dialog-title">Delete Category?</h3>
        <p class="md-dialog-subtitle">
          Are you sure you want to delete the category
          <strong>"{{ categoryToDelete.name }}"</strong>? This may affect transactions assigned to this category.
        </p>
        <div class="md-dialog-actions">
          <button class="md-btn md-btn-text" @click="categoryToDelete = null" :disabled="deleting">
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
import categoryService from '@/services/category.service';
import CategoryFormModal from '@/components/CategoryFormModal.vue';
import AppPagination from '@/components/AppPagination.vue';

export default {
  name: 'CategoriesView',
  components: {
    CategoryFormModal,
    AppPagination,
  },
  data() {
    return {
      categories: [],
      meta: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
      },
      currentPage: 1,
      loading: false,
      searchQuery: '',
      typeFilter: 'all',
      showModal: false,
      selectedCategory: null,
      categoryToDelete: null,
      deleting: false,
      toastMessage: '',
      toastType: 'success',
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter((cat) => {
        if (this.typeFilter !== 'all' && cat.type !== this.typeFilter) {
          return false;
        }

        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          const matchName = (cat.name || '').toLowerCase().includes(q);
          const matchDesc = (cat.description || '').toLowerCase().includes(q);
          return matchName || matchDesc;
        }

        return true;
      });
    },
  },
  mounted() {
    const pageFromRoute = parseInt(this.$route.query.page, 10);
    if (!isNaN(pageFromRoute) && pageFromRoute > 0) {
      this.currentPage = pageFromRoute;
    }
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await categoryService.getAll({
          page: this.currentPage,
          items_per_page: 15,
        });
        this.categories = res?.data || [];
        if (res?.meta) {
          this.meta = res.meta;
          this.currentPage = res.meta.current_page || this.currentPage;
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        this.showToast('Failed to load categories', 'error');
      } finally {
        this.loading = false;
      }
    },

    changePage(newPage) {
      if (newPage < 1 || (this.meta.last_page && newPage > this.meta.last_page)) return;
      this.currentPage = newPage;
      this.$router.push({ query: { ...this.$route.query, page: newPage } });
      this.fetchCategories();
    },

    openCreateModal() {
      this.selectedCategory = null;
      this.showModal = true;
    },

    openEditModal(cat) {
      this.selectedCategory = { ...cat };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedCategory = null;
    },

    handleSaved() {
      this.closeModal();
      this.showToast('Category saved successfully!', 'success');
      this.fetchCategories();
    },

    confirmDelete(cat) {
      this.categoryToDelete = cat;
    },

    async executeDelete() {
      if (!this.categoryToDelete) return;
      this.deleting = true;
      try {
        await categoryService.delete(this.categoryToDelete.id);
        this.showToast('Category deleted successfully', 'success');
        this.categoryToDelete = null;
        this.fetchCategories();
      } catch (err) {
        this.showToast('Failed to delete category', 'error');
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
.categories-page {
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
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-on-surface);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--md-on-surface-variant);
}

.filters-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 260px;
  background-color: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: 8px;
  padding: 8px 12px;
}

.search-icon {
  color: var(--md-outline);
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--md-on-surface);
}

.table-card {
  padding: 20px;
}

.desc-cell {
  max-width: 320px;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  display: inline-flex;
  gap: 4px;
}
</style>
