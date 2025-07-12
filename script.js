
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
  } else {
    console.log("Nenhum mangá encontrado.");
  }
}).catch((error) => {
  console.error(error);
});

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
