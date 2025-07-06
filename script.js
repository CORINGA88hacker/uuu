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
    });
}

document.getElementById("formFilme").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const ano = document.getElementById("ano").value;
  const categoria = document.getElementById("categoria").value.toLowerCase();
  const capaFile = document.getElementById("capa").files[0];

  const ref = storage.ref(`capas/${capaFile.name}`);
  await ref.put(capaFile);
  const url = await ref.getDownloadURL();

  await db.collection("filmes").add({ titulo, ano, categoria, capa: url });
  alert("Filme adicionado!");
  location.reload();
});

async function carregarFilmes() {
  const snap = await db.collection("filmes").get();
  const filmes = snap.docs.map(doc => doc.data());

  const lancamentos = filmes.filter(f => f.categoria === "lancamento");
  const destaques = filmes.filter(f => f.categoria === "destaque");

  gerarCards(lancamentos, "lancamentos");
  gerarCards(destaques, "destaques");
}

function gerarCards(lista, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  lista.forEach(filme => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${filme.capa}" alt="${filme.titulo}" />
      <div class="card-info">
        <h3>${filme.titulo}</h3>
        <span>${filme.ano}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

carregarFilmes();
