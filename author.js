document.addEventListener("DOMContentLoaded", () => {
    const createBlogs = document.getElementById("blog-form");

    if (createBlogs) {
        createBlogs.addEventListener("submit", (event) => {
            event.preventDefault();

            const titles = document.getElementById("titles").value.trim();
            const contentid = document.getElementById("contentid").value.trim();
            const imageId = document.getElementById("imageIdUrl").value.trim();

 

            const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
            const blog = { titles, contentid, imageId };
            blogs.push(blog);

            localStorage.setItem("blogs", JSON.stringify(blogs));
            alert("Blog created successfully!");
            createBlogs.reset();
        });
    }
});