const socket = io();

const send = document.querySelector('#send-message');
const allMessages = document.querySelector('#all-messages');
const inputMessage = document.querySelector('#message');
const typingIndicator = document.querySelector('#typing-indicator');
const themeToggle = document.querySelector('#theme-toggle');
const avatarInput = document.querySelector('#avatar-input');
const avatarUpload = document.querySelector('#avatar-upload');
const currentAvatar = document.querySelector('#current-avatar');
const currentUserLabel = document.querySelector('#current-user');

let isTyping = false;
let typingTimeoutId = null;
let audioContext = null;
let currentUsername = null;

send.addEventListener('click', () => {
    const message = inputMessage.value;
    if(message.trim() === '') return;
    socket.emit('message', message);
    inputMessage.value = '';
    playSendSound();
    stopTyping();
});

inputMessage.addEventListener('input', () => {
    const value = inputMessage.value.trim();

    if (value === '') {
        stopTyping();
        return;
    }

    if (!isTyping) {
        isTyping = true;
        socket.emit('typing');
    }

    if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
    }

    typingTimeoutId = setTimeout(() => {
        stopTyping();
    }, 800);
});

socket.on('message', ({ user, message, timeStamp, id, avatarUrl }) => {
    appendMessage({ user, message, timeStamp, id, avatarUrl });
});

socket.on('messages:init', messages => {
    allMessages.innerHTML = '';
    messages.forEach(msg => appendMessage({
        user: msg.user,
        message: msg.text,
        timeStamp: msg.timeStamp,
        id: msg._id,
        avatarUrl: msg.avatarUrl,
    }));
});

socket.on('messageDeleted', ({ id }) => {
    const item = document.querySelector(`[data-message-id="${id}"]`);
    if (item) item.remove();
});

socket.on('messageUpdated', ({ id, text }) => {
    const item = document.querySelector(`[data-message-id="${id}"]`);
    if (!item) return;
    const body = item.querySelector('.message-body p');
    if (body) body.textContent = text;
});

socket.on('avatarUpdated', ({ username, avatarUrl }) => {
    document
        .querySelectorAll(`[data-user="${username}"] .image-container img`)
        .forEach(img => {
            img.src = avatarUrl;
        });

    if (username === currentUsername && currentAvatar) {
        currentAvatar.src = avatarUrl;
    }
});

socket.on('typing', ({ user }) => {
    if (!typingIndicator) return;
    typingIndicator.textContent = `${user} esta escribiendo...`;
    typingIndicator.classList.add('is-visible');
});

socket.on('stopTyping', ({ user }) => {
    if (!typingIndicator) return;

    const current = typingIndicator.textContent;
    if (current.startsWith(user)) {
        typingIndicator.textContent = '';
        typingIndicator.classList.remove('is-visible');
    }
});

function stopTyping() {
    if (!isTyping) return;

    isTyping = false;
    socket.emit('stopTyping');

    if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        typingTimeoutId = null;
    }
}

function playSendSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;

    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
}

function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function appendMessage({ user, message, timeStamp, id, avatarUrl }) {
    const time = new Date(timeStamp).toLocaleTimeString();
    const safeAvatar = avatarUrl || '/img/avatar-default.svg';
    const canDelete = currentUsername && user === currentUsername && id;
    const msg = document.createRange().createContextualFragment(`
        <div class="message" data-user="${user}" ${id ? `data-message-id="${id}"` : ''}>
            <div class="image-container">
                <img src="${safeAvatar}">
                <div class="message-body">
                    <div class="user-info">
                        <span class="username">${user}</span>
                        <span class="time">${time}</span>
                    </div>
                    <p>${message}</p>
                </div>
            </div>
        </div>`);
    const element = msg.firstElementChild;
    if (canDelete) attachDoubleClickMenu(element, id);
    allMessages.appendChild(element);
}

function refreshDeleteButtons() {
    if (!currentUsername) return;
    document.querySelectorAll('[data-message-id]').forEach(item => {
        const user = item.getAttribute('data-user');
        const id = item.getAttribute('data-message-id');
        if (user === currentUsername && id && !item.dataset.deleteBound) {
            attachDoubleClickMenu(item, id);
        }
    });
}

function attachDoubleClickMenu(element, id) {
    if (!element || !id) return;
    element.dataset.deleteBound = 'true';
    element.addEventListener('dblclick', async () => {
        if (!window.Swal) return;

        const result = await window.Swal.fire({
            title: 'Que deseas hacer?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Editar',
            denyButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            width: 320,
        });

        if (result.isDenied) {
            const confirmDelete = await window.Swal.fire({
                title: 'Eliminar mensaje?',
                text: 'Se eliminara para todos.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                width: 320,
            });

            if (confirmDelete.isConfirmed) {
                socket.emit('deleteMessage', { id });
            }
            return;
        }

        if (result.isConfirmed) {
            const currentText = element.querySelector('.message-body p')?.textContent || '';
            const editResult = await window.Swal.fire({
                title: 'Editar mensaje',
                input: 'text',
                inputValue: currentText,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                width: 360,
            });

            if (editResult.isConfirmed) {
                const nextText = (editResult.value || '').trim();
                if (nextText) {
                    socket.emit('editMessage', { id, text: nextText });
                }
            }
        }
    });
}

if (avatarUpload && avatarInput) {
    avatarUpload.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/profile/avatar', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            if (currentAvatar) currentAvatar.src = data.avatarUrl;
        } else {
            alert('No se pudo actualizar la foto');
        }

        avatarInput.value = '';
    });
}

fetch('/api/me')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
        if (!data) return;
        currentUsername = data.username;
        if (currentUserLabel) currentUserLabel.textContent = data.username;
        if (currentAvatar) currentAvatar.src = data.avatarUrl;
        refreshDeleteButtons();
    })
    .catch(() => {});

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