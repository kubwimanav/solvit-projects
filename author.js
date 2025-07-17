document.addEventListener("DOMContentLoaded", () => {
  const blogForm = document.getElementById("blog-form");
  const postList = document.getElementById("post-list");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || loggedInUser.role !== "author") {
    alert("Access denied. Authors only.");
    window.location.href = "login.html";
    return;
  }

  renderPosts();

  blogForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("titles").value.trim();
    const content = document.getElementById("contentid").value.trim();
    const image = document.getElementById("imageIdUrl").value.trim();

    if (!title || !content || !image) {
      alert("All fields are required.");
      return;
    }

    const post = {
      id: Date.now(),
      title,
      content,
      image,
      author: loggedInUser.username,
      createdAt: new Date().toISOString(),
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    blogForm.reset();
    renderPosts();
  });

  function renderPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    postList.innerHTML = "";

    posts.forEach((post) => {
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>By <strong>${post.author}</strong> on ${new Date(post.createdAt).toLocaleString()}</small>
        <img src="${post.image}" alt="blog image" />
        ${
          post.author === loggedInUser.username
            ? `<div class="actions">
                <button onclick="editPost(${post.id})" class="edit">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
              </div>`
            : ""
        }
      `;
      postList.appendChild(postEl);
    });
  }
  // delete post 
  window.deletePost = function (id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts = posts.filter((post) => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  };

  window.editPost = function (id) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find((p) => p.id === id);

    if (!post || post.author !== loggedInUser.username) return;

    document.getElementById("titles").value = post.title;
    document.getElementById("contentid").value = post.content;
    document.getElementById("imageIdUrl").value = post.image;

    // Remove old post
    const updatedPosts = posts.filter((p) => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };
});
