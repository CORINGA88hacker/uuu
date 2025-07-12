
const dbRef = window.firebaseRef(window.db);

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
          \${totalCapitulos > 0 ? `<button onclick="location.href='?detalhes=\${key}'">Ver Capítulos</button>` : ''}
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

  window.firebaseSet(window.firebaseRef(window.db, "mangas/" + id), manga).then(() => {
    alert("Mangá adicionado!");
    location.reload();
  });
};

// Mostrar detalhes se houver parâmetro ?detalhes=
const urlParams = new URLSearchParams(window.location.search);
const mangaId = urlParams.get('detalhes');
if (mangaId) {
  const main = document.body;
  main.innerHTML = '<div class="detalhes-container"><div class="capa-info"><img id="capa-manga" /><h1 id="titulo-manga">Carregando...</h1></div><div class="capitulos"><h2>Capítulos</h2><ul id="lista-capitulos"></ul></div></div>';
  const refManga = window.firebaseChild(window.firebaseRef(window.db), "mangas/" + mangaId);

  window.firebaseGet(refManga).then((snapshot) => {
    if (snapshot.exists()) {
      const manga = snapshot.val();
      document.getElementById("titulo-manga").textContent = manga.titulo;
      document.getElementById("capa-manga").src = manga.capa;

      const lista = document.getElementById("lista-capitulos");
      if (manga.capitulos) {
        const entries = Object.entries(manga.capitulos);
        entries.sort((a, b) => Number(a[0]) - Number(b[0]));
        for (const [num, link] of entries) {
          const li = document.createElement("li");
          li.innerHTML = \`<a href="\${link}" target="_blank">Capítulo \${num}</a>\`;
          lista.appendChild(li);
        }
      } else {
        lista.innerHTML = "<li>Nenhum capítulo disponível.</li>";
      }
    }
  });
}
