const firebaseConfig = {
  apiKey: "AIzaSyBHIc2E4XwRO5FXo4uHlTQVRArOis73MjE",
  authDomain: "projeto-deus-yato-928-sk-default-rtdb.firebaseapp.com",
  databaseURL: "https://projeto-deus-yato-928-sk-default-rtdb.firebaseio.com",
  projectId: "projeto-deus-yato-928-sk-default-rtdb",
  storageBucket: "projeto-deus-yato-928-sk-default-rtdb.appspot.com",
  messagingSenderId: "790408726854",
  appId: "1:790408726854:android:e2f0de7b7d5dba96b0fd47"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// Cadastro e Login
function cadastrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => alert("Cadastrado com sucesso!"))
    .catch(e => alert(e.message));
}

function logar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  auth.signInWithEmailAndPassword(email, senha)
    .then(user => {
      document.getElementById("auth").style.display = "none";
      document.getElementById("painel").style.display = "block";
      document.getElementById("userInfo").innerText = `Logado como: ${user.user.email}`;
      carregarFeed();
    })
    .catch(e => alert(e.message));
}

// Upload de vídeo
function uploadVideo(file) {
  const user = auth.currentUser;
  if (!user) return alert("Faça login");

  const ref = storage.ref("videos/" + file.name);
  ref.put(file).then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      const videoData = {
        url,
        autor: user.email,
        curtidas: 0,
        timestamp: Date.now()
      };
      db.ref("videos").push(videoData);
      alert("Vídeo enviado!");
      carregarFeed();
    });
}

// Mostrar feed
function carregarFeed() {
  db.ref("videos").once("value", snapshot => {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    snapshot.forEach(child => {
      const data = child.val();
      const key = child.key;

      const container = document.createElement("div");
      container.className = "video-container";

      container.innerHTML = `
        <video src="${data.url}" controls></video>
        <div class="info">Autor: ${data.autor}</div>
        <div class="actions">
          <span onclick="curtir('${key}')">❤️ ${data.curtidas || 0}</span>
          <span>💬 Comentários</span>
        </div>
      `;

      feed.appendChild(container);
    });
  });
}

// Curtir vídeo
function curtir(key) {
  const likeRef = db.ref(`videos/${key}/curtidas`);
  likeRef.transaction(curtidas => (curtidas || 0) + 1);
}
