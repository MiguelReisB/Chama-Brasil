const cardContainer = document.querySelector(".cards-container");
const inputBusca = document.querySelector("input[type='text']");
const botaoBusca = document.querySelector("#botao-busca");
let dados = [];


window.addEventListener('DOMContentLoaded', async () => {
    await carregarDados();
    renderizarCards(dados);
    
    botaoBusca.addEventListener('click', iniciarBusca);
    
    inputBusca.addEventListener('keyup', (event) => {
        iniciarBusca();
    });
});

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function iniciarBusca(){
    const termoBusca = removerAcentos(inputBusca.value.toLowerCase().trim());
    if (!termoBusca) {
        renderizarCards(dados); 
        return;
    }
    
    const resultados = dados.filter(dado => {
        const nomeNormalizado = removerAcentos(dado.nome.toLowerCase());
        const descricaoNormalizada = removerAcentos(dado.descricao.toLowerCase());
        
        return nomeNormalizado.includes(termoBusca) || 
               descricaoNormalizada.includes(termoBusca) ||
               dado.numero.includes(termoBusca);
    });
    renderizarCards(resultados);
}

function renderizarCards(dados){
    cardContainer.innerHTML = ""; 

    if (dados.length === 0) {
        cardContainer.innerHTML = `<div class="no-results-card"><h2>NENHUM RESULTADO ENCONTRADO, TENTE UTILIZAR OUTRO TERMO OU NÚMERO.</h2></div>`;
        return;
    }

    for (let dado of dados){
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome} (${dado.numero})</h2>
        <p>${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article);
    }
}