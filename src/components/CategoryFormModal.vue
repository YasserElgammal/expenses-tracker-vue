<template>
  <div class="md-dialog-scrim" @click.self="$emit('close')">
    <div class="md-dialog" role="dialog" aria-modal="true">
      <div class="dialog-header">
        <div>
          <h3 class="md-dialog-title">{{ isEdit ? 'Edit Category' : 'New Category' }}</h3>
          <p class="md-dialog-subtitle">
            {{ isEdit ? 'Modify category properties' : 'Create an expense or income category' }}
          </p>
        </div>
        <button type="button" class="md-icon-btn" @click="$emit('close')" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div v-if="generalError" class="md-banner md-banner-error">
        <span>{{ generalError }}</span>
      </div>

      <form @submit.prevent="submitForm">
        <!-- Type Selection using Material 3 Chips -->
        <div class="md-form-group">
          <label class="md-label">Category Type <span class="required">*</span></label>
          <div class="md-chip-group" style="margin-top: 4px;">
            <button
              type="button"
              class="md-chip"
              :class="{ active: form.type === 'expense' }"
              @click="form.type = 'expense'"
              :disabled="loading"
            >
              Expense
            </button>
            <button
              type="button"
              class="md-chip"
              :class="{ active: form.type === 'income' }"
              @click="form.type = 'income'"
              :disabled="loading"
            >
              Income
            </button>
          </div>
          <span v-if="errors.type" class="md-field-error">{{ errors.type[0] }}</span>
        </div>

        <!-- Name Input -->
        <div class="md-form-group">
          <label class="md-label" for="category-name">
            Category Name <span class="required">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            class="md-input"
            :class="{ 'has-error': errors.name }"
            v-model.trim="form.name"
            placeholder="e.g. Housing, Investments, Salary"
            maxlength="50"
            :disabled="loading"
          />
          <span v-if="errors.name" class="md-field-error">{{ errors.name[0] }}</span>
        </div>

        <!-- Description Input -->
        <div class="md-form-group">
          <div class="md-label">
            <label for="category-desc">Description (Optional)</label>
            <span class="char-count">{{ (form.description || '').length }}/255</span>
          </div>
          <textarea
            id="category-desc"
            rows="3"
            class="md-textarea"
            :class="{ 'has-error': errors.description }"
            v-model.trim="form.description"
            placeholder="Brief details about what belongs in this category..."
            maxlength="255"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.description" class="md-field-error">{{ errors.description[0] }}</span>
        </div>

        <!-- Dialog Actions -->
        <div class="md-dialog-actions">
          <button type="button" class="md-btn md-btn-text" @click="$emit('close')" :disabled="loading">
            Cancel
          </button>
          <button type="submit" class="md-btn md-btn-filled" :disabled="loading">
            <span v-if="loading" class="md-spinner"></span>
            <span>{{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create Category') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import categoryService from '@/services/category.service';

export default {
  name: 'CategoryFormModal',
  props: {
    categoryData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        type: 'expense',
      },
      errors: {},
      generalError: '',
      loading: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.categoryData?.id;
    },
  },
  mounted() {
    if (this.categoryData) {
      this.populateEditData();
    }
  },
  methods: {
    populateEditData() {
      this.form.name = this.categoryData.name || '';
      this.form.description = this.categoryData.description || '';
      this.form.type = this.categoryData.type || 'expense';
    },

    validate() {
      this.errors = {};

      if (!this.form.name || !this.form.name.trim()) {
        this.errors.name = ['Category name is required'];
      } else if (this.form.name.length > 50) {
        this.errors.name = ['Category name must not exceed 50 characters'];
      }

      if (this.form.description && this.form.description.length > 255) {
        this.errors.description = ['Description must not exceed 255 characters'];
      }

      if (!['income', 'expense'].includes(this.form.type)) {
        this.errors.type = ['Type must be either "income" or "expense"'];
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      this.generalError = '';
      if (!this.validate()) return;

      this.loading = true;
      this.errors = {};

      const payload = {
        name: this.form.name.trim(),
        description: this.form.description ? this.form.description.trim() : null,
        type: this.form.type,
      };

      try {
        if (this.isEdit) {
          await categoryService.update(this.categoryData.id, payload);
        } else {
          await categoryService.create(payload);
        }
        this.$emit('saved');
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data?.errors || {};
        } else if (err.response?.data?.message) {
          this.generalError = err.response.data.message;
        } else {
          this.generalError = 'An error occurred while saving the category.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.required {
  color: var(--md-error);
}

.char-count {
  font-size: 11px;
  color: var(--md-outline);
}
</style>
