
function goRegister() {
  window.location.href = "/register.html";
}

async function register() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user, pass })
  });

  const data = await res.json();

  if (data.success) {
    alert("Cuenta creada 🔥");
    window.location.href = "/";
  } else {
    alert(data.msg);
  }
}

async function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user, pass })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("user", user);
    window.location.href = "/dashboard.html";
  } else {
    alert("Error ❌");
  }
}

async function saveNote() {
  const text = document.getElementById("note").value;
  const user = localStorage.getItem("user");

  await fetch("/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user, text })
  });

  loadNotes();
}

async function loadNotes() {
  const user = localStorage.getItem("user");

  const res = await fetch("/notes/" + user);
  const data = await res.json();

  document.getElementById("notes").innerHTML =
    data.notes.map(n => `<p>${n}</p>`).join("");
}

if (window.location.pathname === "/dashboard.html") {
  loadNotes();
}
