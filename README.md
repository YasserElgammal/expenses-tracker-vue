# Expenses Tracker System — Frontend

An open-source, modern personal finance and expenses tracker frontend built with **Vue.js 3 (Options API)** and designed with **Google Material Design 3 (Material You)** principles.

Developed and maintained by **[Yasser Elgammal](https://github.com/yasserelgammal)**.

---

## 🌟 Key Features

- **Material You (M3) Design System:** Authentic tonal palettes, flat surfaces, clean typography (Roboto / Inter), and no CSS gradients.
- **Vue.js Options API Strictly:** Fully structured using `data()`, `computed`, `methods`, and lifecycle hooks.
- **Laravel Sanctum Auth Integration:** Bearer token authentication with automatic request injection and 401 redirect handling.
- **Live Net Savings & Analytics:** Real-time monthly breakdown of total income, expenditures, and net savings.
- **Smart Amount Management:** Automatically signs expenses as negative and income as positive according to backend rules.
- **Numbered Pagination with Ellipsis:** Intuitive navigation (`1 ... 5 6 7 ... 20`) for high-volume ledgers.
- **Optimized Performance:** Centralized design system reducing repetitive CSS by over 40%.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yasserelgammal/expenses.git
cd expenses
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory:
```env
VUE_APP_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Run development server
```bash
npm run serve
```
The application will be available at `http://localhost:8080`.

---

## 🛠️ Build & Quality Checks

```bash
# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## 👤 Author

**Yasser Elgammal**
- GitHub: [@yasserelgammal](https://github.com/yasserelgammal)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
