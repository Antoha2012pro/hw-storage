const ls_key = 'contacts';

let contacts = [];

function saveContacts() {
  localStorage.setItem(ls_key, JSON.stringify(contacts));
}

function loadContacts() {
  const saved = localStorage.getItem(ls_key);
  contacts = saved ? JSON.parse(saved) : [];
}

const inputNameEl = document.querySelector('#bookmarkName');
const inputSurnameEl = document.querySelector('#bookmarkSurname');
const inputTelefonEl = document.querySelector('#bookmarkTelefon');
const inputEmailEl = document.querySelector('#bookmarkEmail');
const btnAddEl = document.querySelector('#addBookmarkBtn');
const listEl = document.querySelector('#bookmarkList');

loadContacts();
renderList();

btnAddEl.addEventListener('click', addContact);
listEl.addEventListener('click', onListClick);

function renderList() {
    listEl.innerHTML = contacts
    .map((item) => {
      return `
        <li class="card" data-id="${item.id}">
          ${item.name} ${item.surname}
          <a href="tel:${item.phone}">${item.phone}</a>
          <a href="mailto:${item.email}">${item.email}</a>
          <div class="card__actions">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="delete">Delete</button>
          </div>
        </li>
      `;
    }).join('');
}

function addContact() {
  const name = inputNameEl.value.trim();
  const surname = inputSurnameEl.value.trim();
  const phone = inputTelefonEl.value.trim();
  const email = inputEmailEl.value.trim();

  if (!name) return showError(inputNameEl, "Введи ім'я");
  if (!surname) return showError(inputSurnameEl, 'Введи прізвище');
  if (!phone) return showError(inputTelefonEl, 'Введи телефон');
  if (!phone.startsWith('+')) return showError(inputTelefonEl, 'Телефон повинен починатися з +');
  if (!email) return showError(inputEmailEl, 'Введи email');
  if (!email.includes('@')) return showError(inputEmailEl, 'Email повинен мати @');

  clearError(inputNameEl);
  clearError(inputSurnameEl);
  clearError(inputTelefonEl);
  clearError(inputEmailEl);

  contacts.push({
    id: Date.now(),
    name,
    surname,
    phone,
    email,
  });

  saveContacts();
  renderList();

  inputNameEl.value = '';
  inputSurnameEl.value = '';
  inputTelefonEl.value = '';
  inputEmailEl.value = '';
}

function onListClick(event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const card = btn.closest('.card');
  if (!card) return;

  const id = Number(card.dataset.id);

  if (btn.dataset.action === 'delete') {
    contacts = contacts.filter((c) => c.id !== id);
    saveContacts();
    renderList();
  }

  if (btn.dataset.action === 'edit') {
    const c = contacts.find((x) => x.id === id);
    if (!c) return;

    const newName = prompt("Ім'я:", c.name);
    if (newName === null) return;

    const newSurname = prompt('Фамилия:', c.surname);
    if (newSurname === null) return;

    const newPhone = prompt('Телефон (+...):', c.phone);
    if (newPhone === null) return;

    const newEmail = prompt('Email:', c.email);
    if (newEmail === null) return;

    const nName = newName.trim();
    const nSurname = newSurname.trim();
    const nPhone = newPhone.trim();
    const nEmail = newEmail.trim();

    if (!nName || !nSurname || !nPhone || !nEmail) return;
    if (!nPhone.startsWith('+')) return;
    if (!nEmail.includes('@')) return;

    c.name = nName;
    c.surname = nSurname;
    c.phone = nPhone;
    c.email = nEmail;

    saveContacts();
    renderList();
  }
}

function showError(input, msg) {
  input.classList.add('is-error');
  input.value = '';
  input.placeholder = msg;
  input.focus();
}

function clearError(input) {
  input.classList.remove('is-error');
}
