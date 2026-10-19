<template>
  <div class="not-found-page">
    <div class="md-empty-state">
      <div class="error-code">404</div>
      <h2 class="md-empty-title">Page not found</h2>
      <p class="md-empty-desc">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <router-link to="/" class="md-btn md-btn-filled">
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 180px);
  padding: 32px 16px;
}

.error-code {
  font-size: 72px;
  font-weight: 800;
  color: var(--md-outline-variant);
  line-height: 1;
  margin-bottom: 12px;
  letter-spacing: -0.04em;
}
</style>