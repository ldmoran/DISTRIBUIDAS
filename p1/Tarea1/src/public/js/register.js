const login = document.querySelector("#login");
const registerForm = document.querySelector("form");
const themeToggle = document.querySelector('#theme-toggle');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }
}

if (themeToggle) {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
}
if (registerForm) {
  registerForm.addEventListener("submit", event => {
    const user = document.querySelector("#username").value.trim();
    if (!user) {
      event.preventDefault();
      alert("Please enter a username");
    }
  });
}