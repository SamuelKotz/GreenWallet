let saldo = 0;
let gastos = [];
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

function registrarSaldo() {
    const saldoInput = document.getElementById('saldo');
    saldo = parseFloat(saldoInput.value);
    saldoInput.value = '';
    alert(`Saldo inicial registrado: R$ ${saldo.toFixed(2)}`);
}

function adicionarGasto() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;

    if (descricao && valor && categoria) {
        gastos.push({ descricao, valor, categoria });
        categorias[categoria] += valor;
        saldo -= valor;

        atualizarExtrato();
        atualizarGrafico();

        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function atualizarExtrato() {
    const extratoTbody = document.querySelector('#extrato tbody');
    extratoTbody.innerHTML = '';

    gastos.forEach(gasto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gasto.descricao}</td>
            <td>R$ ${gasto.valor.toFixed(2)}</td>
            <td>${gasto.categoria}</td>
        `;
        extratoTbody.appendChild(row);
    });

    const saldoRow = document.createElement('tr');
    saldoRow.innerHTML = `
        <td><strong>Saldo Atual</strong></td>
        <td><strong>R$ ${saldo.toFixed(2)}</strong></td>
        <td></td>
    `;
    extratoTbody.appendChild(saldoRow);
}

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

function exportarParaExcel() {
    // Cria um array com os dados dos gastos
    const dados = gastos.map(gasto => ({
        Descrição: gasto.descricao,
        Valor: gasto.valor,
        Categoria: gasto.categoria
    }));

    // Adiciona o saldo atual como uma linha adicional
    dados.push({
        Descrição: "Saldo Atual",
        Valor: saldo,
        Categoria: ""
    });

    // Cria uma planilha com os dados
    const worksheet = XLSX.utils.json_to_sheet(dados);

    // Cria um workbook e adiciona a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

    // Gera o arquivo Excel
    XLSX.writeFile(workbook, "gastos.xlsx");
}