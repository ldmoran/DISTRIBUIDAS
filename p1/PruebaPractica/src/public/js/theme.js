const THEME_KEY = "espe-alert-theme";

const setTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  buttons.forEach((button) => {
    button.textContent = theme === "light" ? "Modo oscuro" : "Modo claro";
  });
  localStorage.setItem(THEME_KEY, theme);
};

const getPreferredTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

const initThemeToggle = () => {
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) {
    return;
  }

  setTheme(getPreferredTheme());

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";
      setTheme(next);
    });
  });
};

initThemeToggle();
