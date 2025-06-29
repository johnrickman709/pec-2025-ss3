function addToGallery() {
  const fileInput = document.getElementById("fileInput");
  const caption = document.getElementById("captionInput").value;
  const file = fileInput.files[0];

  if (!file) {
    alert("Please choose a file first.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const mediaURL = e.target.result;
    const container = document.getElementById("galleryContainer");

    const item = document.createElement("div");
    item.className = "gallery-item";

    // Media element
    if (file.type.startsWith("video")) {
      const video = document.createElement("video");
      video.controls = true;
      video.src = mediaURL;
      item.appendChild(video);
    } else if (file.type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = mediaURL;
      item.appendChild(img);
    }

    // Caption
    const text = document.createElement("p");
    text.textContent = caption || "No caption";
    item.appendChild(text);

    // Like and comment buttons
    const actions = document.createElement("div");
    actions.className = "actions";

    const like = document.createElement("span");
    like.className = "like-button";
    like.textContent = "❤️ Like";
    like.onclick = () => {
      const current = parseInt(like.getAttribute("data-likes") || "0", 10) + 1;
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
  };

  reader.readAsDataURL(file);

  // Reset input
  fileInput.value = "";
  document.getElementById("captionInput").value = "";
}