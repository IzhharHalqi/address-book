let dataContacts = [];
let selectedIds = [];

function loadFromLocal() {
  const saved = localStorage.getItem("contacts");
  if (saved) {
    dataContacts = JSON.parse(saved);
  } else {
    dataContacts = [
      {
        id: 1,
        fullName: "Syahlana",
        phone: "62881080070700",
        email: "Syahlana@example.com",
        location: "Bandung",
      },
      {
        id: 2,
        fullName: "Syahlana izhhar",
        phone: "62881080080800",
        email: "Izhhar@example.com",
        location: "Jakarta",
      },
    ];
    saveToLocal();
  }
}

function saveToLocal() {
  localStorage.setItem("contacts", JSON.stringify(dataContacts));
}

function displayContacts(list = dataContacts) {
  const tbody = document.getElementById("contactsTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="p-4 text-center text-gray-500 italic">
          No contacts available
        </td>
      </tr>`;
    return;
  }

  list.forEach((contact) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">
        <input type="checkbox" class="selectContact"
          value="${contact.id}"
          onclick="toggleSelection(this)">
      </td>
      <td class="p-2">${contact.fullName}</td>
      <td class="p-2">${contact.email}</td>
      <td class="p-2">${contact.phone}</td>
      <td class="p-2">${contact.location}</td>
    `;
    tbody.appendChild(row);
  });

  updateSelectAllState();
}

function getLastId() {
  if (dataContacts.length === 0) return 1;
  return Math.max(...dataContacts.map((c) => c.id)) + 1;
}

function addContact(fullName, phone, email, location) {
  dataContacts.push({
    id: getLastId(),
    fullName: fullName || "",
    phone: phone || "",
    email: email || "",
    location: location || "",
  });

  saveToLocal();
  displayContacts();
}

function deleteContact() {
  dataContacts = dataContacts.filter(
    (contact) => !selectedIds.includes(contact.id)
  );
  selectedIds = [];

  saveToLocal();
  displayContacts();
  toggleButtons();
}

function updateContact() {
  if (selectedIds.length !== 1) return;

  const contact = dataContacts.find((c) => c.id === selectedIds[0]);

  document.getElementById("name").value = contact.fullName;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("location").value = contact.location;

  document.getElementById("modal").classList.remove("hidden");

  document.getElementById("addContactForm").onsubmit = function (e) {
    e.preventDefault();

    contact.fullName = document.getElementById("name").value || "";
    contact.email = document.getElementById("email").value || "";
    contact.phone = document.getElementById("phone").value || "";
    contact.location = document.getElementById("location").value || "";

    saveToLocal();
    displayContacts();
    closeModal();
  };
}

/* SEARCH */
function searchContacts(keyword) {
  const filtered = dataContacts.filter(
    (contact) =>
      (contact.fullName || "").toLowerCase().includes(keyword.toLowerCase()) ||
      (contact.phone || "").includes(keyword)
  );

  displayContacts(filtered);
}

/*  SELECTION  */
function toggleSelection(checkbox) {
  const id = Number(checkbox.value);

  if (checkbox.checked) {
    selectedIds.push(id);
  } else {
    selectedIds = selectedIds.filter((x) => x !== id);
  }

  updateSelectAllState();
  toggleButtons();
}

function toggleSelectAll(master) {
  const checkboxes = document.querySelectorAll(".selectContact");
  selectedIds = [];

  checkboxes.forEach((cb) => {
    cb.checked = master.checked;
    if (master.checked) selectedIds.push(Number(cb.value));
  });

  toggleButtons();
}

function updateSelectAllState() {
  const checkboxes = document.querySelectorAll(".selectContact");
  const master = document.getElementById("selectAll");

  if (checkboxes.length === 0) {
    master.checked = false;
    master.indeterminate = false;
    return;
  }

  const allChecked = [...checkboxes].every((cb) => cb.checked);
  const someChecked = [...checkboxes].some((cb) => cb.checked);

  master.checked = allChecked;
  master.indeterminate = !allChecked && someChecked;
}

function toggleButtons() {
  document.getElementById("editBtn").disabled = selectedIds.length !== 1;
  document.getElementById("deleteBtn").disabled = selectedIds.length === 0;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("addContactForm").reset();

  document.getElementById("addContactForm").onsubmit = function (e) {
    e.preventDefault();

    addContact(
      document.getElementById("name").value,
      document.getElementById("phone").value,
      document.getElementById("email").value,
      document.getElementById("location").value
    );

    closeModal();
  };
});

document.getElementById("deleteBtn").addEventListener("click", deleteContact);

document.getElementById("editBtn").addEventListener("click", updateContact);

document
  .getElementById("searchInput")
  .addEventListener("input", (e) => searchContacts(e.target.value));

loadFromLocal();
displayContacts();
toggleButtons();
