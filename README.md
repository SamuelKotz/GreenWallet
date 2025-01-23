
# GreenWallet


O GreenWallet é uma aplicação web desenvolvida para ajudar usuários a gerenciar suas finanças de forma simples e eficiente. O aplicativo permite que o usuário registre seu saldo inicial, adicione gastos à vista ou parcelados, e visualize um gráfico de pizza que mostra a distribuição dos gastos por categoria. Além disso, todos os gastos podem ser exportados para um arquivo Excel, facilitando a análise e o planejamento financeiro.


Este projeto foi criado com o objetivo de proporcionar uma ferramenta prática para o controle financeiro pessoal, incentivando a organização e a conscientização sobre os gastos.

## Funcionalidades

1. Registro de Saldo Inicial:
- O usuário pode registrar seu saldo inicial (ex: salário ou dinheiro disponível).

2. Adição de Gastos:
- Gastos à Vista: O usuário pode adicionar gastos únicos, informando a descrição, o valor e a categoria.

- Gastos Parcelados: O usuário pode adicionar gastos parcelados, informando o valor total, o número de parcelas e a data da primeira parcela. Apenas a parcela do mês atual é exibida no extrato.
  
- O usuário pode separar os seus gastos por categoria. As categorias disponíveis são:

  Alimentação

  Lazer

  Despesa Fixa

  Pessoal

  Assinaturas

  Casa

  Educação

  Saúde
  
  Serviços
  

3. Extrato de Gastos:
- Todos os gastos do mês atual são exibidos em uma tabela, mostrando a descrição, o valor, a categoria e a data.

4. Gráfico de Pizza:
- Um gráfico de pizza é gerado automaticamente, mostrando a distribuição dos gastos por categoria.

5. Exportação para Excel:
- Os gastos podem ser exportados para um arquivo Excel, permitindo análise externa ou backup.




## Tecnologias Utilizadas

**HTML**: Estruturação da página web.

**CSS**: Estilização e design da interface.

**JavaScript**: Lógica do backend e manipulação dinâmica dos dados.

**Chart.js**: Biblioteca para geração do gráfico de pizza.

**SheetJS (xlsx)**: Biblioteca para exportação dos dados para Excel.



## Como Usar

1. Registre o Saldo Inicial:

- Insira o valor do seu saldo inicial no campo indicado e clique em "Registrar Saldo".

2. Adicione Gastos:

- Clique em "Adicionar Gasto à Vista" ou "Adicionar Gasto Parcelado" para exibir o formulário correspondente.

- Preencha os campos e clique em "Adicionar Gasto".

3. Visualize o Extrato:

- Todos os gastos do mês atual serão exibidos na tabela de extrato, com o saldo atualizado.


4. Acompanhe o Gráfico:

- O gráfico de pizza será atualizado automaticamente, mostrando a distribuição dos gastos por categoria.

5. Exporte os Dados:

- Clique em "Baixar Relatório em Excel" para exportar os dados.





## Como executar o projeto

1. Clone o repositório
```bash
git clone https://github.com/SamuelKotz/GreenWallet.git
```
2. Abra o arquivo index.html no seu navegador (pode utilizar a extensão Live Server para VSCode)

## Atualizações recentes

- Gastos Parcelados:
  Agora, apenas a parcela do mês atual é exibida no extrato.
   As parcelas futuras são armazenadas e adicionadas automaticamente ao extrato quando o mês mudar.

- Foco no Controle Mensal:
  O aplicativo foi ajustado para ser um controle de gastos mensal, exibindo apenas os gastos do mês atual.

