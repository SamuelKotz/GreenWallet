// Chave da API do Gemini - Substitua pela sua chave
const API_KEY = "SUA_CHAVE_AQUI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let saldo = 0;
let gastos = [];
let parcelasFuturas = [];
let categorias = {
    "Alimentação": 0,
    "Lazer": 0,
    "Despesa Fixa": 0,
    "Pessoal": 0,
    "Assinaturas": 0,
    "Casa": 0,
    "Educação": 0,
    "Saúde": 0,
    "Serviços": 0
};

const ctx = document.getElementById('graficoPizza').getContext('2d');
let graficoPizza;

// Tela de carregamento
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 5000);
    }
    verificarParcelasDoMes();
});

// Função para mostrar e esconder formulários
function mostrarFormulario(tipo) {
    esconderFormularios();
    document.getElementById(`form-${tipo}`).classList.remove('hidden');
}

function esconderFormularios() {
    document.getElementById('form-avista').classList.add('hidden');
    document.getElementById('form-parcelado').classList.add('hidden');
}

// Adicionar gasto à vista
function adicionarGastoAvista() {
    const descricao = document.getElementById('descricao-avista').value;
    const valor = parseFloat(document.getElementById('valor-avista').value);
    const data = document.getElementById('data-avista').value;
    const categoria = document.getElementById('categoria-avista').value;

    if (descricao && valor && categoria && data) {
        gastos.push({ descricao, valor, categoria, data });
        categorias[categoria] += valor;
        saldo -= valor;

        atualizarExtrato();
        atualizarGrafico();
        esconderFormularios();
        limparCampos(['descricao-avista', 'valor-avista', 'data-avista']);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Adicionar gasto parcelado
function adicionarGastoParcelado() {
    const descricao = document.getElementById('descricao-parcelado').value;
    const valorTotal = parseFloat(document.getElementById('valor-total').value);
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const dataPrimeiraParcela = new Date(document.getElementById('data-primeira-parcela').value);
    const categoria = document.getElementById('categoria-parcelado').value;

    if (descricao && valorTotal && parcelas && dataPrimeiraParcela && categoria) {
        const valorParcela = valorTotal / parcelas;
        for (let i = 0; i < parcelas; i++) {
            const dataParcela = new Date(dataPrimeiraParcela);
            dataParcela.setMonth(dataPrimeiraParcela.getMonth() + i);

            const gasto = {
                descricao: `${descricao} (Parcela ${i + 1}/${parcelas})`,
                valor: valorParcela,
                categoria: categoria,
                data: dataParcela.toISOString().split('T')[0]
            };

            if (dataParcela.getMonth() === new Date().getMonth() && dataParcela.getFullYear() === new Date().getFullYear()) {
                gastos.push(gasto);
                categorias[categoria] += valorParcela;
                saldo -= valorParcela;
            } else {
                parcelasFuturas.push(gasto);
            }
        }

        atualizarExtrato();
        atualizarGrafico();
        esconderFormularios();
        limparCampos(['descricao-parcelado', 'valor-total', 'parcelas', 'data-primeira-parcela']);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Verifica parcelas do mês atual
function verificarParcelasDoMes() {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    parcelasFuturas = parcelasFuturas.filter(parcela => {
        const dataParcela = new Date(parcela.data);
        if (dataParcela.getMonth() === mesAtual && dataParcela.getFullYear() === anoAtual) {
            gastos.push(parcela);
            categorias[parcela.categoria] += parcela.valor;
            saldo -= parcela.valor;
            return false;
        }
        return true;
    });

    atualizarExtrato();
    atualizarGrafico();
}

// Atualizar extrato
function atualizarExtrato() {
    const extratoTbody = document.querySelector('#extrato tbody');
    extratoTbody.innerHTML = '';

    gastos.forEach(gasto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gasto.descricao}</td>
            <td>R$ ${gasto.valor.toFixed(2)}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.data || ''}</td>
        `;
        extratoTbody.appendChild(row);
    });

    const saldoRow = document.createElement('tr');
    saldoRow.innerHTML = `
        <td><strong>Saldo Atual</strong></td>
        <td><strong>R$ ${saldo.toFixed(2)}</strong></td>
        <td></td>
        <td></td>
    `;
    extratoTbody.appendChild(saldoRow);
}

// Atualizar gráfico
function atualizarGrafico() {
    if (graficoPizza) graficoPizza.destroy();

    graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Exportar para Excel
function exportarParaExcel() {
    const dados = gastos.map(gasto => ({
        Descrição: gasto.descricao,
        Valor: gasto.valor,
        Categoria: gasto.categoria,
        Data: gasto.data || ''
    }));

    dados.push({ Descrição: "Saldo Atual", Valor: saldo, Categoria: "", Data: "" });

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

    XLSX.writeFile(workbook, "gastos.xlsx");
}

// Registra saldo inicial
function registrarSaldo() {
    const saldoInput = document.getElementById('saldo');
    saldo = parseFloat(saldoInput.value);
    saldoInput.value = '';
    atualizarExtrato();
}

// --------- INTEGRAÇÃO COM IA (Gemini) ---------
async function enviarMensagemGemini() {
    const chatInput = document.getElementById('chat-message');
    const mensagem = chatInput.value.trim();
    if (!mensagem) return;

    adicionarMensagemAoChat(mensagem, "user");

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    role: "user", 
                    parts: [{ text: `Aja como um especialista financeiro, que ajudara usuários que desejam organizar suas finanças e que querem tirar dúvidas sobre o mercado financeiro e planejamento pessoal de gastos. Seja consideravelmente breve e direto (algo como 100-350 tokens de saída): ${mensagem}` }] 
                }],
                generationConfig: {
                    temperature: 0.7,   // 🔹 Controla a criatividade
                    maxOutputTokens: 500 // 🔹 Corrigido para `maxOutputTokens`
                }
            })
        });

        const data = await resposta.json();
        const respostaIA = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui entender.";

        adicionarMensagemAoChat(respostaIA, "ai");
    } catch (erro) {
        console.error("Erro ao conectar com a API Gemini:", erro);
        adicionarMensagemAoChat("Erro ao conectar com a IA.", "ai");
    }

    chatInput.value = "";
}


function adicionarMensagemAoChat(texto, tipo) {
    const chatMessages = document.getElementById("chat-messages");
    const mensagemDiv = document.createElement("div");
    mensagemDiv.classList.add(tipo === "user" ? "user-message" : "response-message");
    mensagemDiv.innerHTML = `<div class="message-content"><p>${texto}</p></div>`;
    chatMessages.appendChild(mensagemDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
