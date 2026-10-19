<template>
  <div class="md-dialog-scrim" @click.self="$emit('close')">
    <div class="md-dialog" role="dialog" aria-modal="true">
      <div class="dialog-header">
        <div>
          <h3 class="md-dialog-title">{{ isEdit ? 'Edit Transaction' : 'New Transaction' }}</h3>
          <p class="md-dialog-subtitle">
            {{ isEdit ? 'Update transaction details' : 'Record an expense or income entry' }}
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
        <!-- Category Selection -->
        <div class="md-form-group">
          <label class="md-label" for="transaction-category">
            Category <span class="required">*</span>
          </label>
          <select
            id="transaction-category"
            class="md-select"
            :class="{ 'has-error': errors.category_id }"
            v-model="form.category_id"
            :disabled="loadingCategories || loading"
          >
            <option value="">{{ loadingCategories ? 'Loading categories...' : 'Select a Category' }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }} ({{ cat.type === 'income' ? 'Income' : 'Expense' }})
            </option>
          </select>
          <span v-if="errors.category_id" class="md-field-error">{{ errors.category_id[0] }}</span>
        </div>

        <!-- Amount Input with Smart Sanitization & Live Preview -->
        <div class="md-form-group">
          <div class="md-label">
            <label for="transaction-amount">Amount <span class="required">*</span></label>
            <span class="md-badge" :class="selectedCategoryType === 'income' ? 'md-badge-income' : 'md-badge-expense'">
              {{ selectedCategoryType === 'income' ? '+ Income' : '- Expense' }}
            </span>
          </div>

          <div class="amount-field-wrapper" :class="{ 'has-error': errors.amount }">
            <span class="currency-prefix">{{ selectedCategoryType === 'expense' ? '-' : '+' }}</span>
            <input
              id="transaction-amount"
              type="text"
              inputmode="decimal"
              class="amount-input"
              v-model="rawAmountInput"
              @input="onAmountInput"
              placeholder="e.g. 5000"
              :disabled="loading"
            />
          </div>

          <!-- Live Formatted Preview -->
          <div class="amount-preview-card" v-if="parsedAmount > 0">
            <div class="preview-row">
              <span class="preview-label">Live Preview:</span>
              <strong class="preview-value" :class="selectedCategoryType === 'income' ? 'text-income' : 'text-expense'">
                {{ formatCurrency(selectedCategoryType === 'expense' ? -parsedAmount : parsedAmount, true) }}
              </strong>
            </div>

            <!-- Auto-converted notice if user typed 5.000 or 11.000 -->
            <div v-if="thousandsAutoConverted" class="dot-warning-notice">
              <span>✓ Auto-detected thousand separator: <strong>{{ rawAmountInput }}</strong> will be saved as <strong>{{ parsedAmount.toLocaleString('en-US') }}</strong></span>
            </div>
          </div>

          <span v-if="errors.amount" class="md-field-error">{{ errors.amount[0] }}</span>
        </div>

        <!-- Date Input -->
        <div class="md-form-group">
          <label class="md-label" for="transaction-date">
            Date <span class="required">*</span>
          </label>
          <input
            id="transaction-date"
            type="date"
            class="md-input"
            :class="{ 'has-error': errors.date }"
            v-model="form.date"
            :disabled="loading"
          />
          <span v-if="errors.date" class="md-field-error">{{ errors.date[0] }}</span>
        </div>

        <!-- Description -->
        <div class="md-form-group">
          <div class="md-label">
            <label for="transaction-desc">Description <span class="required">*</span></label>
            <span class="char-count">{{ (form.description || '').length }}/255</span>
          </div>
          <textarea
            id="transaction-desc"
            rows="3"
            class="md-textarea"
            :class="{ 'has-error': errors.description }"
            v-model.trim="form.description"
            placeholder="e.g. Monthly salary or grocery shopping"
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
            <span>{{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Save Transaction') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import categoryService from '@/services/category.service';
import transactionService from '@/services/transaction.service';
import { formatCurrency } from '@/utils/currency';

export default {
  name: 'TransactionFormModal',
  props: {
    transactionData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      categories: [],
      categoryDetailsMap: {},
      rawAmountInput: '',
      form: {
        category_id: '',
        description: '',
        date: new Date().toISOString().slice(0, 10),
      },
      errors: {},
      generalError: '',
      loading: false,
      loadingCategories: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.transactionData?.id;
    },
    selectedCategoryType() {
      if (!this.form.category_id) return 'expense';
      return this.categoryDetailsMap[this.form.category_id] || 'expense';
    },
    parsedAmount() {
      if (!this.rawAmountInput) return 0;
      let str = String(this.rawAmountInput).trim();

      // Case 1: Multiple dots used as thousands (e.g. 1.000.000)
      if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
        str = str.replace(/\./g, '');
      }
      // Case 2: Number with dot followed by exactly 3 zeros or 3 digits (e.g. "5.000", "11.000")
      // In Arabic/Egyptian inputs, typing .000 represents thousands, not 3 decimal zeros.
      else if (/^\d+\.000$/.test(str)) {
        str = str.replace(/\.000$/, '000');
      }
      // Case 3: Comma separated thousands (e.g. "5,000" or "5,000.50")
      else if (str.includes(',')) {
        str = str.replace(/,/g, '');
      }

      const num = parseFloat(str);
      return isNaN(num) ? 0 : Math.abs(num);
    },
    thousandsAutoConverted() {
      const str = String(this.rawAmountInput).trim();
      return /^\d{1,3}(\.\d{3})+$/.test(str) || /^\d+\.000$/.test(str);
    },
  },
  async mounted() {
    await this.fetchCategories();
    if (this.transactionData) {
      this.populateEditData();
    }
  },
  methods: {
    formatCurrency,

    onAmountInput() {
      // Allow only digits, dots, commas
      this.rawAmountInput = this.rawAmountInput.replace(/[^0-9.,]/g, '');
    },

    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const res = await categoryService.getAll({ items_per_page: 100 });
        const list = res?.data || [];
        this.categories = list;
        list.forEach((c) => {
          this.categoryDetailsMap[c.id] = c.type;
        });

        if (list.length > 0 && !this.form.category_id && !this.isEdit) {
          this.form.category_id = list[0].id;
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        this.generalError = 'Failed to load categories list.';
      } finally {
        this.loadingCategories = false;
      }
    },

    populateEditData() {
      const data = this.transactionData;
      this.form.category_id = data.category?.id || data.category_id || '';
      const absVal = Math.abs(parseFloat(data.amount));
      this.rawAmountInput = String(absVal);
      this.form.description = data.description || '';
      this.form.date = data.date ? data.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
    },

    validate() {
      this.errors = {};

      if (!this.form.category_id) {
        this.errors.category_id = ['Category is required'];
      }

      if (!this.parsedAmount || this.parsedAmount <= 0) {
        this.errors.amount = ['Please enter a valid amount greater than zero'];
      }

      if (!this.form.description || this.form.description.trim().length < 3) {
        this.errors.description = ['Description must be at least 3 characters'];
      } else if (this.form.description.length > 255) {
        this.errors.description = ['Description cannot exceed 255 characters'];
      }

      if (!this.form.date) {
        this.errors.date = ['Date is required'];
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      this.generalError = '';
      if (!this.validate()) return;

      this.loading = true;
      this.errors = {};

      const isExpense = this.selectedCategoryType === 'expense';
      const finalAmount = isExpense
        ? -this.parsedAmount
        : this.parsedAmount;

      const payload = {
        category_id: Number(this.form.category_id),
        amount: finalAmount,
        description: this.form.description.trim(),
        date: this.form.date,
      };

      try {
        if (this.isEdit) {
          await transactionService.update(this.transactionData.id, payload);
        } else {
          await transactionService.create(payload);
        }
        this.$emit('saved');
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data?.errors || {};
        } else if (err.response?.data?.message) {
          this.generalError = err.response.data.message;
        } else {
          this.generalError = 'An error occurred while saving the transaction.';
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

.amount-field-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--md-surface-container-lowest);
  border: 1px solid var(--md-outline-variant);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.amount-field-wrapper:focus-within {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 1px var(--md-primary);
}

.amount-field-wrapper.has-error {
  border-color: var(--md-error);
}

.currency-prefix {
  padding: 12px 14px;
  font-weight: 700;
  font-size: 16px;
  color: var(--md-on-surface-variant);
  background-color: var(--md-surface-container-high);
  border-right: 1px solid var(--md-outline-variant);
}

.amount-input {
  flex: 1;
  padding: 12px 14px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: transparent;
  outline: none;
  color: var(--md-on-surface);
  font-family: inherit;
}

.amount-preview-card {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: var(--md-surface-container-low);
  border-radius: 8px;
  border: 1px solid var(--md-outline-variant);
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.preview-label {
  color: var(--md-on-surface-variant);
}

.preview-value {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.dot-warning-notice {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--md-outline-variant);
  font-size: 12px;
  color: #b45309;
  line-height: 1.4;
}

.char-count {
  font-size: 11px;
  color: var(--md-outline);
}
</style>
