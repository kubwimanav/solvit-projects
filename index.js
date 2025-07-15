document.addEventListener("DOMContentLoaded", () => {
  const formRegister = document.getElementById("form-data");
  const formLogin = document.getElementById("form-data-login");

  if (formRegister) {
    formRegister.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("passwordid").value.trim();
      const role = document.getElementById("role").value;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.find(users => users.username === username);
      if (exists) {
        alert("Username already there");
        return;
      }
      const id = Date.now();
      const user = { id, username, password, role };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      alert("registration successful");
      formRegister.reset();
    });
  }

  if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("passwordid").value.trim();
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(users => users.username === username && users.password === password);
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("login successfully");
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else if (user.role === "author") {
          window.location.href = "author.html";
        }
      } else {
        alert("Invalid details");
      }
    });
  }
});
