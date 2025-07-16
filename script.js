import { db } from "../firebase/firebase-config.js";
import { collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const feed = document.getElementById("feed");

function createPost() {
  const link = document.getElementById("imageLink").value;
  const text = document.getElementById("postText").value;

  if (!link && !text) return;

  addDoc(collection(db, "posts"), {
    link: link,
    text: text,
    likes: 0,
    timestamp: Date.now()
  });

  document.getElementById("imageLink").value = "";
  document.getElementById("postText").value = "";
}

function renderPosts() {
  onSnapshot(collection(db, "posts"), (snapshot) => {
    feed.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <p>${post.text}</p>
        ${post.link.includes("mp4") ? `<video src="${post.link}" controls></video>` : `<img src="${post.link}" alt="post">`}
        <button class="like" onclick="likePost('${docSnap.id}', ${post.likes})">❤️ ${post.likes}</button>
      `;
      feed.prepend(postEl);
    });
  });
}

window.likePost = async (id, currentLikes) => {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, { likes: currentLikes + 1 });
};

renderPosts();
