const socket = io();

const form = document.querySelector("#alert-form");
const alertList = document.querySelector("#alert-list");
const alertType = document.querySelector("#alert-type");
const alertMessage = document.querySelector("#alert-message");

const renderAlert = ({ user, message, type, date }) => {
  const item = document.createElement("article");
  item.className = `alert-item ${type}`;
  item.innerHTML = `
    <div class="alert-header">
      <span class="alert-badge">${type.toUpperCase()}</span>
      <span class="alert-time">${date}</span>
    </div>
    <h3>${message}</h3>
    <p class="alert-user">Emitido por: <strong>${user}</strong></p>
  `;

  alertList.prepend(item);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = alertMessage.value.trim();
  const type = alertType.value;

  if (!message) {
    alert("Escribe un mensaje de alerta");
    return;
  }

  socket.emit("alert", { message, type });
  alertMessage.value = "";
});

socket.on("alert", (payload) => {
  renderAlert(payload);
});
