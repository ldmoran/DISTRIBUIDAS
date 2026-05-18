const login = document.querySelector("#form");

login.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = document.querySelector("#username").value.trim();

  if (!user) {
    alert("Ingresa un nombre de emisor");
    return;
  }

  document.cookie = `username=${encodeURIComponent(user)}; path=/`;
  document.location.href = "/";
});
