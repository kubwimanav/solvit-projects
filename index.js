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

// this code deals with the author

document.addEventListener("DOMContentLoaded", () => {
  const author = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!author || author.role !== "author") {
    alert("Only authors allowed"); window.location.href = "login.html"; return;
  }

  const form = document.getElementById("postForm");
  const overlay = document.getElementById("popupOverlay");
  const postsBox = document.getElementById("blogPosts");
  const emptyState = document.getElementById("emptyState");
  const title = document.getElementById("postTitle");
  const content = document.getElementById("postContent");
  const image = document.getElementById("postImage");
  const preview = document.getElementById("imagePreview");
  const submitBtn = document.getElementById("submitText");
  let editId = null;

  window.toggleForm = () => {
    overlay.classList.add("active");
    submitBtn.textContent = "Publish Post";
    form.reset(); preview.innerHTML = ""; editId = null;
  };

  window.closePopup = () => {
    overlay.classList.remove("active");
    form.reset(); preview.innerHTML = ""; editId = null;
  };

  image.addEventListener("input", () => {
    preview.innerHTML = image.value ? `<img src="${image.value}" alt="">` : "";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!title.value || !content.value) return alert("Title and content required");
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    if (editId) {
      posts = posts.map(p => p.id === editId ? { ...p, title: title.value, content: content.value, image: image.value, updatedAt: new Date().toLocaleString() } : p);
    } else {
      posts.push({
        id: Date.now(),
        title: title.value,
        content: content.value,
        image: image.value,
        author: author.username,
        createdAt: new Date().toLocaleString()
      });
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    closePopup(); render();
  });

  window.editPost = id => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.id === id);
    if (!post) return;
    title.value = post.title;
    content.value = post.content;
    image.value = post.image;
    preview.innerHTML = post.image ? `<img src="${post.image}" alt="">` : "";
    submitBtn.textContent = "Update Post";
    editId = id; overlay.classList.add("active");
  };

  window.deletePost = id => {
    if (!confirm("Delete this post?")) return;
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts)); render();
  };

  function render() {
    const posts = (JSON.parse(localStorage.getItem("posts")) || []).filter(p => p.author === author.username).reverse();
    postsBox.innerHTML = "";
    if (posts.length === 0) return emptyState.style.display = "block";
    emptyState.style.display = "none";

    posts.forEach(p => {
      postsBox.innerHTML += `
        <div class="blog-post">
          <img src="${p.image || 'https://via.placeholder.com/600x250'}">
          <div class="blog-content">
            <h3>${p.title}</h3>
            <p>${p.content}</p>
            <small>By ${p.author} on ${p.createdAt}${p.updatedAt ? ' (edited)' : ''}</small>
            <div>
              <button onclick="editPost(${p.id})">Edit</button>
              <button onclick="deletePost(${p.id})">Delete</button>
            </div>
          </div>
        </div>`;
    });
  }

  render();
});
