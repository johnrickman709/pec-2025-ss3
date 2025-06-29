// Upload and add to gallery
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
  formData.append("upload_preset", "pecupload"); // your upload preset
  formData.append("tags", "pec2025"); // tags used to load later

  fetch("https://api.cloudinary.com/v1_1/pecclass2025/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      displayMedia(data.secure_url, file.type, caption);
    })
    .catch(err => {
      alert("Upload failed. Please try again.");
      console.error(err);
    });

  fileInput.value = "";
  document.getElementById("captionInput").value = "";
}

// Show uploaded image or video
function displayMedia(url, type, caption = "No caption") {
  const container = document.getElementById("galleryContainer");

  const item = document.createElement("div");
  item.className = "gallery-item";

  if (type.startsWith("video")) {
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
  text.textContent = caption;
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
}

// Load all tagged media from Cloudinary
function loadPreviousUploads() {
  fetch("https://res.cloudinary.com/pecclass2025/image/list/pecupload.json")
    .then(res => res.json())
    .then(data => {
      const reversed = data.resources.reverse();
      reversed.forEach(file => {
        const url = file.secure_url;
        const type = file.resource_type === "video" ? "video/mp4" : "image/jpeg";
        displayMedia(url, type);
      });
    })
    .catch(err => {
      console.error("Could not load previous uploads", err);
    });
}

// Load past uploads on page load
window.onload = loadPreviousUploads;
