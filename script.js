async function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, pass })
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = "/dashboard.html";
  } else {
    alert("Credenciales incorrectas ❌");
  }
}

async function getPassword() {
  const res = await fetch("/api/password");
  const data = await res.json();

  document.getElementById("result").value = data.password;
}
