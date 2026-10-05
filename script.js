const estado = {
  resultado: null,      // último cálculo { imc, classificacao, pesoIdeal }
  historico: []         // lista de cálculos anteriores
};

function calcularIMC(peso, altura) {
  return peso / (altura * altura);
}

function classificar(imc) {
  if (imc < 18.5) return { texto: "Abaixo do peso", classe: "abaixo" };
  if (imc < 25)   return { texto: "Peso normal", classe: "normal" };
  if (imc < 30)   return { texto: "Sobrepeso", classe: "sobrepeso" };
  if (imc < 35)   return { texto: "Obesidade grau I", classe: "obesidade" };
  if (imc < 40)   return { texto: "Obesidade grau II", classe: "obesidade" };
  return { texto: "Obesidade grau III", classe: "obesidade" };
}

// Faixa de peso correspondente ao IMC considerado saudável (18,5 a 24,9).
function calcularPesoIdeal(altura) {
  const minimo = 18.5 * (altura * altura);
  const maximo = 24.9 * (altura * altura);

  return { minimo, maximo };
}

function mostrarErro(mensagem) {
  const div = document.getElementById("erro");
  div.textContent = mensagem;
  div.style.display = "block";
}

function limparErro() {
  const div = document.getElementById("erro");
  div.textContent = "";
  div.style.display = "none";
}

function renderResultado() {
  const div = document.getElementById("resultado");

  // Só mostra o card se existir um resultado.
  if (estado.resultado === null) {
    div.innerHTML = "";
    return;
  }

  const { imc, classificacao, pesoIdeal } = estado.resultado;

  div.innerHTML = `
    <div class="card ${classificacao.classe}">
      <strong>Seu IMC: ${imc.toFixed(2)}</strong><br>
      Classificação: ${classificacao.texto}<br>
      Faixa de peso ideal para sua altura: ${pesoIdeal.minimo.toFixed(1)} kg a ${pesoIdeal.maximo.toFixed(1)} kg
    </div>
  `;
}

function renderHistorico() {
  const ul = document.getElementById("historico");
  ul.innerHTML = "";

  estado.historico.forEach((item, indice) => {
    const li = document.createElement("li");
    li.innerHTML = `
      IMC ${item.imc.toFixed(2)} — ${item.classificacao.texto}
      <button type="button" onclick="removerHistorico(${indice})" aria-label="Remover este cálculo">✕</button>
    `;
    ul.appendChild(li);
  });
}

function removerHistorico(indice) {
  estado.historico.splice(indice, 1);
  render();
}

function limparHistorico() {
  estado.historico = [];
  estado.resultado = null;
  render();
}

function render() {
  renderResultado();
  renderHistorico();
}

document.getElementById("form-imc").addEventListener("submit", function (e) {
  e.preventDefault(); // evita recarregar a página
  limparErro();

  const pesoCampo = document.getElementById("peso").value.trim();
  const alturaCampo = document.getElementById("altura").value.trim();

  // Validação de campos vazios
  if (pesoCampo === "" || alturaCampo === "") {
    mostrarErro("Preencha o peso e a altura antes de calcular.");
    return;
  }

  const peso = parseFloat(pesoCampo);
  const altura = parseFloat(alturaCampo);

  // Validação de valores numéricos e limites
  if (!Number.isFinite(peso) || peso <= 0) {
    mostrarErro("Digite um peso válido e maior que zero.");
    return;
  }

  if (!Number.isFinite(altura) || altura <= 0 || altura > 2.5) {
    mostrarErro("Digite uma altura válida, maior que zero e de no máximo 2,5 m.");
    return;
  }

  const imc = calcularIMC(peso, altura);
  const classificacao = classificar(imc);
  const pesoIdeal = calcularPesoIdeal(altura);

  // Atualiza o estado
  estado.resultado = { imc, classificacao, pesoIdeal };
  estado.historico = [
    { imc, classificacao, pesoIdeal },
    ...estado.historico
  ];

  render();
});

document.getElementById("limpar-historico").addEventListener("click", limparHistorico);
