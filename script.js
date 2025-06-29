function addToGallery() {
  const fileInput = document.getElementById("fileInput");
  const caption = document.getElementById("captionInput").value;
  const file = fileInput.files[0];

  if (!file) {
    alert("Please choose a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pecupload");

  fetch("https://api.cloudinary.com/v1_1/pecclass2025/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const url = data.secure_url;
      const container = document.getElementById("galleryContainer");

      const item = document.createElement("div");
      item.className = "gallery-item";

      if (file.type.startsWith("video")) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        item.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = url;
        item.appendChild(img);
      }

      const text = document.createElement("p");
      text.textContent = caption || "No caption";
      item.appendChild(text);

      const actions = document.createElement("div");
      actions.className = "actions";

      const like = document.createElement("span");
      like.className = "like-button";
      like.textContent = "❤️ Like";
      like.onclick = () => {
        const current = parseInt(like.getAttribute("data-likes") || "0") + 1;
        like.setAttribute("data-likes", current);
        like.textContent = `❤️ ${current} Like${current > 1 ? "s" : ""}`;
      };

      const comment = document.createElement("span");
      comment.className = "comment-button";
      comment.textContent = "💬 Comment";
      comment.onclick = () => {
        const commentText = prompt("Type your comment:");
        if (commentText) {
          const reply = document.createElement("p");
          reply.textContent = `💬 ${commentText}`;
          reply.style.marginLeft = "1rem";
          item.appendChild(reply);
        }
      };

      actions.appendChild(like);
      actions.appendChild(comment);
      item.appendChild(actions);
      container.prepend(item);
    })
    .catch(err => {
      alert("Upload failed. Please try again.");
      console.error(err);
    });

  fileInput.value = "";
  document.getElementById("captionInput").value = "";
    }
