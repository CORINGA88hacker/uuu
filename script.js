function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      alert(`Bem-vindo, ${result.user.displayName}`);
    })
    .catch(error => {
      console.error("Erro no login:", error);
      alert("Erro no login, veja o console.");
    });
}

document.getElementById("formFilme").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const ano = parseInt(document.getElementById("ano").value);
  const categoria = document.getElementById("categoria").value.trim().toLowerCase();
  const temporada = document.getElementById("temporada").value.trim();
  const link = document.getElementById("link").value.trim();
  const capaFile = document.getElementById("capa").files[0];

  if (!titulo || !ano || !categoria || !link || !capaFile) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const ref = storage.ref(`capas/${capaFile.name}`);
    await ref.put(capaFile);
    const urlCapa = await ref.getDownloadURL();

    await db.collection("filmes").add({
      titulo,
      ano,
      categoria,
      temporada: categoria === "serie" ? temporada : null,
      link,
      capa: urlCapa
    });

    alert("Filme/Série adicionada com sucesso!");
    e.target.reset();
    carregarFilmes();

  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar o filme/série. Veja o console.");
  }
});

async function carregarFilmes() {
  const snap = await db.collection("filmes").orderBy("ano", "desc").get();
  const filmes = snap.docs.map(doc => doc.data());

  const lancamentos = filmes.filter(f => f.categoria === "lancamento");
  const destaques = filmes.filter(f => f.categoria === "destaque");
  const series = filmes.filter(f => f.categoria === "serie");
  const filmesSimples = filmes.filter(f => f.categoria === "filme");

  gerarCards(lancamentos, "lancamentos");
  gerarCards(destaques, "destaques");
  gerarCards(series, "series");
  gerarCards(filmesSimples, "filmes");
}

function gerarCards(lista, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  lista.forEach(filme => {
    const temporadaInfo = filme.categoria === "serie" && filme.temporada ? `<p>Temporada: ${filme.temporada}</p>` : "";

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${filme.capa}" alt="${filme.titulo}" />
      <div class="card-info">
        <h3>${filme.titulo}</h3>
        <span>${filme.ano}</span>
        ${temporadaInfo}
        <a href="${filme.link}" target="_blank" rel="noopener noreferrer" class="btn-assistir">▶ Assistir</a>
      </div>
    `;

    container.appendChild(div);
  });
}

carregarFilmes();
