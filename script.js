let saldo = 0;
let gastos = [];
let parcelasFuturas = []; // Lista de parcelas futuras
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

// Tela de Carregamento
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden'); // Esconde a tela de carregamento após 3 segundos
        }, 5000);
    }
    verificarParcelasDoMes(); // Verifica se há parcelas para o mês atual
});

// Função para mostrar o formulário correspondente
function mostrarFormulario(tipo) {
    esconderFormularios(); // Esconde todos os formulários primeiro
    if (tipo === 'avista') {
        document.getElementById('form-avista').classList.remove('hidden');
    } else if (tipo === 'parcelado') {
        document.getElementById('form-parcelado').classList.remove('hidden');
    }
}

// Função para esconder todos os formulários
function esconderFormularios() {
    document.getElementById('form-avista').classList.add('hidden');
    document.getElementById('form-parcelado').classList.add('hidden');
}

// Função para adicionar gasto à vista
function adicionarGastoAvista() {
    const descricao = document.getElementById('descricao-avista').value;
    const valor = parseFloat(document.getElementById('valor-avista').value);
    const categoria = document.getElementById('categoria-avista').value;

    if (descricao && valor && categoria) {
        const gasto = {
            descricao: descricao,
            valor: valor,
            categoria: categoria,
            data: new Date().toISOString().split('T')[0] // Data atual
        };

        gastos.push(gasto);
        categorias[categoria] += valor;
        saldo -= valor;

        atualizarExtrato();
        atualizarGrafico();
        esconderFormularios();

        // Limpa os campos do formulário
        document.getElementById('descricao-avista').value = '';
        document.getElementById('valor-avista').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para adicionar gasto parcelado
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
                data: dataParcela.toISOString().split('T')[0] // Formato YYYY-MM-DD
            };

            if (dataParcela.getMonth() === new Date().getMonth() && dataParcela.getFullYear() === new Date().getFullYear()) {
                // Se a parcela for do mês atual, adiciona ao extrato
                gastos.push(gasto);
                categorias[categoria] += valorParcela;
                saldo -= valorParcela;
            } else {
                // Caso contrário, adiciona à lista de parcelas futuras
                parcelasFuturas.push(gasto);
            }
        }

        atualizarExtrato();
        atualizarGrafico();
        esconderFormularios();

        // Limpa os campos do formulário
        document.getElementById('descricao-parcelado').value = '';
        document.getElementById('valor-total').value = '';
        document.getElementById('parcelas').value = '';
        document.getElementById('data-primeira-parcela').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para verificar parcelas do mês atual
function verificarParcelasDoMes() {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    parcelasFuturas = parcelasFuturas.filter(parcela => {
        const dataParcela = new Date(parcela.data);

        if (dataParcela.getMonth() === mesAtual && dataParcela.getFullYear() === anoAtual) {
            // Se a parcela for do mês atual, adiciona ao extrato
            gastos.push(parcela);
            categorias[parcela.categoria] += parcela.valor;
            saldo -= parcela.valor;
            return false; // Remove da lista de parcelas futuras
        }
        return true; // Mantém na lista de parcelas futuras
    });

    atualizarExtrato();
    atualizarGrafico();
}

// Função para atualizar o extrato
function atualizarExtrato() {
    const extratoTbody = document.querySelector('#extrato tbody');
    extratoTbody.innerHTML = '';

    gastos.forEach(gasto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gasto.descricao}</td>
            <td>R$ ${gasto.valor.toFixed(2)}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.data || ''}</td> <!-- Exibe a data, se existir -->
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

// Função para atualizar o gráfico
function atualizarGrafico() {
    if (graficoPizza) {
        graficoPizza.destroy();
    }

    graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#C9CBCF', '#4D5360',
                    '#F7464A'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Função para exportar para Excel
function exportarParaExcel() {
    // Cria um array com os dados dos gastos
    const dados = gastos.map(gasto => ({
        Descrição: gasto.descricao,
        Valor: gasto.valor,
        Categoria: gasto.categoria,
        Data: gasto.data || ''
    }));

    // Adiciona o saldo atual como uma linha adicional
    dados.push({
        Descrição: "Saldo Atual",
        Valor: saldo,
        Categoria: "",
        Data: ""
    });

    // Cria uma planilha com os dados
    const worksheet = XLSX.utils.json_to_sheet(dados);

    // Cria um workbook e adiciona a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

    // Gera o arquivo Excel
    XLSX.writeFile(workbook, "gastos.xlsx");
}

// Função para registrar o saldo inicial
function registrarSaldo() {
    const saldoInput = document.getElementById('saldo');
    saldo = parseFloat(saldoInput.value);
    saldoInput.value = '';
    alert(`Saldo inicial registrado: R$ ${saldo.toFixed(2)}`);
}

// Função para enviar mensagem ao pressionar "Enter"
document.getElementById('chat-message').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) { // Envia a mensagem ao pressionar "Enter" sem o Shift
        event.preventDefault(); // Impede a quebra de linha no textarea
        enviarMensagem();
    }
});

// Função para enviar mensagem
function enviarMensagem() {
    const chatInput = document.getElementById('chat-message');
    const mensagem = chatInput.value.trim();

    if (mensagem) {
        // Adiciona a mensagem do usuário ao chat
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${mensagem}</p>
            </div>
        `;
        document.querySelector('.chat-messages').appendChild(userMessage);

        // Resposta automática "testes I.A"
        const responseMessage = document.createElement('div');
        responseMessage.classList.add('response-message');
        responseMessage.innerHTML = `
            <div class="avatar">
                <img src="https://storage.googleapis.com/a1aa/image/ACZHW3la297cCJRhNQXJ5Mcb9kUH2v5CtIvioKCK7mreIiEKA.jpg" alt="Avatar of the responder" width="40" height="40">
            </div>
            <div class="message-content">
                <p class="message-text">testes I.A</p>
                <div class="message-actions">
                    <i class="fas fa-copy"></i>
                    <i class="fas fa-sync-alt"></i>
                    <i class="fas fa-thumbs-up"></i>
                    <i class="fas fa-thumbs-down"></i>
                </div>
            </div>
        `;
        document.querySelector('.chat-messages').appendChild(responseMessage);

        // Limpa o campo de mensagem
        chatInput.value = '';

        // Rola a área de mensagens para a última mensagem
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}