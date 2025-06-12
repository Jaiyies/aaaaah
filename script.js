// LOGIN AND REDIRECT
if (document.getElementById('signInForm')) {
  document.getElementById('signInForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === '' || password === '') {
      alert('Please fill in both fields.');
      return;
    }

    localStorage.setItem('loggedInUser', email);
    window.location.href = 'journal.html';
  });
}

const currentUser = localStorage.getItem('loggedInUser');
if (!currentUser && window.location.pathname.includes('journal.html')) {
  window.location.href = 'index.html';
}

function getUserKey(type) {
  return `${type}_${currentUser}`;
}

// COLLECTIONS
function loadCollections() {
  let collections = JSON.parse(localStorage.getItem(getUserKey('collections'))) || ['Default'];
  localStorage.setItem(getUserKey('collections'), JSON.stringify(collections));
  return collections;
}

function populateCollectionDropdown() {
  const collections = loadCollections();
  const select = document.getElementById('collectionSelect');
  if (!select) return;
  select.innerHTML = '';
  collections.forEach((col) => {
    const option = document.createElement('option');
    option.value = col;
    option.textContent = col;
    select.appendChild(option);
  });
}

function addCollection() {
  const newCol = document.getElementById('newCollectionInput').value.trim();
  if (!newCol) return alert('Collection name cannot be empty.');

  let collections = loadCollections();
  if (collections.includes(newCol)) return alert('Collection already exists.');

  collections.push(newCol);
  localStorage.setItem(getUserKey('collections'), JSON.stringify(collections));
  document.getElementById('newCollectionInput').value = '';
  populateCollectionDropdown();
}

// JOURNAL BUTTONS FUNCTIONALITY
function createEntryElement(text, timestamp) {
  const entryDiv = document.createElement("div");
  entryDiv.classList.add("entry");
  entryDiv.innerHTML = `<p>${text}</p><span>${timestamp}</span>`;
  return entryDiv;
}

function saveEntryText() {
  const entryField = document.getElementById("entry");
  const entriesContainer = document.getElementById("entries");
  const text = entryField.value.trim();
  if (text === '') return;
  const timestamp = new Date().toLocaleString();
  const entry = createEntryElement(text, timestamp);
  entriesContainer.appendChild(entry);
  entryField.value = '';
}

function editLastEntry() {
  const entriesContainer = document.getElementById("entries");
  const entryField = document.getElementById("entry");
  const entries = entriesContainer.querySelectorAll(".entry");
  if (entries.length > 0) {
    const lastEntry = entries[entries.length - 1];
    const text = lastEntry.querySelector("p").textContent;
    entryField.value = text;
    lastEntry.remove();
  }
}

function deleteLastEntry() {
  const entriesContainer = document.getElementById("entries");
  const entries = entriesContainer.querySelectorAll(".entry");
  if (entries.length > 0) {
    entries[entries.length - 1].remove();
  }
}

function saveDraft() {
  const entryField = document.getElementById("entry");
  const draftText = entryField.value.trim();
  if (draftText !== '') {
    alert("Draft saved: " + draftText);
  }
}

// LOGOUT FUNCTION
function logout() {
  localStorage.removeItem('loggedInUser');
  alert('You have been logged out!');
  window.location.href = 'index.html';
}

// ON LOAD
window.onload = () => {
  if (document.getElementById('collectionSelect')) {
    populateCollectionDropdown();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const draftBtn = document.getElementById("draftBtn");

  if (saveBtn) saveBtn.addEventListener("click", saveEntryText);
  if (editBtn) editBtn.addEventListener("click", editLastEntry);
  if (deleteBtn) deleteBtn.addEventListener("click", deleteLastEntry);
  if (draftBtn) draftBtn.addEventListener("click", saveDraft);
});
