document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  if (status) {
    status.textContent = 'Hello World! Extension is running.';
  }
});