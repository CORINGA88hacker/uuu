
const dbRef = window.firebaseRef(window.db);

// Mostrar mangás
window.firebaseGet(window.firebaseChild(dbRef, 'mangas')).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    for (const key in data) {
      const manga = data[key];
      const totalCapitulos = manga.capitulos ? Object.keys(manga.capitulos).length : 0;

      const card = \`
        <div class="manga-card">
          <img src="\${manga.capa}" alt="\${manga.titulo}" />
          <p><strong>\${manga.titulo}</strong></p>
          <p>Capítulos: \${totalCapitulos}</p>
          \${totalCapitulos > 0 ? `<button onclick="verCapitulos('\${key}')">Ver Capítulos</button>` : ''}
        </div>
      \`;

      if (manga.tipo === "novidade") {
        document.getElementById("novidades-list").innerHTML += card;
      } else if (manga.tipo === "destaque") {
        document.getElementById("destaques-list").innerHTML += card;
      } else if (manga.tipo === "popular") {
        document.getElementById("populares-list").innerHTML += card;
      }

      if (manga.slide === true) {
        document.getElementById("slider").innerHTML += \`
          <div class="slider-item">
            <img src="\${manga.capa}" alt="\${manga.titulo}" style="width:100%; border-radius:10px"/>
          </div>
        \`;
      }
    }
  }
});

// Exibir capítulos (simples)
window.verCapitulos = async function (mangaId) {
  const capRef = window.firebaseChild(window.firebaseRef(window.db), \`mangas/\${mangaId}/capitulos\`);
  const snapshot = await window.firebaseGet(capRef);

  if (snapshot.exists()) {
    const capitulos = snapshot.val();
    let lista = "Capítulos disponíveis:\n\n";
    for (const num in capitulos) {
      lista += \`Capítulo \${num}: \${capitulos[num]}\n\`;
    }
    alert(lista);
  } else {
    alert("Nenhum capítulo encontrado.");
  }
};

// Adicionar novo mangá
window.adicionarManga = function () {
  const titulo = document.getElementById("titulo").value.trim();
  const capa = document.getElementById("capa").value.trim();
  const tipo = document.getElementById("tipo").value;
  const capitulosRaw = document.getElementById("capitulos").value.trim();
  const slide = document.getElementById("slide").checked;

  if (!titulo || !capa) return alert("Preencha todos os campos obrigatórios!");

  const capitulos = {};
  capitulosRaw.split(",").forEach(cap => {
    const [num, link] = cap.split("|");
    if (num && link) capitulos[num.trim()] = link.trim();
  });

  const id = titulo.toLowerCase().replace(/\s+/g, "_");
  const manga = { titulo, capa, tipo, slide, capitulos };

  window.firebaseSet(window.firebaseRef(window.db, "mangas/" + id), manga)
    .then(() => {
      alert("Mangá adicionado com sucesso!");
      location.reload();
    })
    .catch(err => {
      alert("Erro ao publicar: " + err.message);
    });
};

// Login
window.fazerLogin = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  window.signInWithEmailAndPassword(window.auth, email, senha)
    .then(() => alert("Logado com sucesso!"))
    .catch(err => alert("Erro ao logar: " + err.message));
};

// Logout
window.fazerLogout = function () {
  window.signOut(window.auth).then(() => {
    alert("Deslogado.");
  });
};

// Exibir painel somente se logado
window.onAuthStateChanged(window.auth, (user) => {
  document.getElementById("admin").style.display = user ? "block" : "none";
  document.getElementById("login").style.display = user ? "none" : "block";
});
