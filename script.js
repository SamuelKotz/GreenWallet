let saldo = 0;
let gastos = [];

function registrarSaldo() {
    const saldoInput = document.getElementById('saldo');
    saldo = parseFloat(saldoInput.value);
    saldoInput.value = '';
    alert(`Saldo inicial registrado: R$ ${saldo.toFixed(2)}`);
}

function adicionarGasto() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (descricao && valor) {
        gastos.push({ descricao, valor });
        saldo -= valor;

        atualizarExtrato();
        salvarCSV();

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
        `;
        extratoTbody.appendChild(row);
    });

    const saldoRow = document.createElement('tr');
    saldoRow.innerHTML = `
        <td><strong>Saldo Atual</strong></td>
        <td><strong>R$ ${saldo.toFixed(2)}</strong></td>
    `;
    extratoTbody.appendChild(saldoRow);
}

function salvarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Descrição,Valor\n";

    gastos.forEach(gasto => {
        csvContent += `${gasto.descricao},${gasto.valor.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gastos.csv");
    document.body.appendChild(link);
    link.click();
}