document.addEventListener("DOMContentLoaded", function() {
    const expenseList = document.getElementById("expenseList");
    const ctx1 = document.getElementById("expenseChart1").getContext("2d");
    const ctx2 = document.getElementById("expenseChart2").getContext("2d");

    function getExpenses() {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    }

    function saveExpenses(expenses) {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function deleteExpense(index) {
        const expenses = getExpenses();
        expenses.splice(index, 1);
        saveExpenses(expenses);
        populateExpenseList();
        initializeCharts();
    }

    function populateExpenseList() {
        const expenses = getExpenses();
        expenseList.innerHTML = "";
        expenses.forEach((expense, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${expense.title}</td>
                <td>${expense.balance !== undefined ? `<span style="color: ${expense.balance >= 0 ? 'lightgreen' : 'red'};">₹ ${expense.balance.toFixed(2)}</span>` : '-'}</td>
                <td>${expense.amount < 0 ? `<span style="color: red;">-₹ ${Math.abs(expense.amount).toFixed(2)}</span>` : `<span style="color: lightgreen;">₹ ${expense.amount.toFixed(2)}</span>`}</td>
                <td>${expense.date}</td>
                <td><button class="delete-btn" data-index="${index}"><i class="fa fa-times-circle"></i></button></td>
            `;
            expenseList.appendChild(tr);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                deleteExpense(index);
            });
        });
    }

    function initializeCharts() {
        const expenses = getExpenses();
        const budget = parseFloat(localStorage.getItem("budget")) || 0;
        const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const remainingBudget = budget - totalExpense;

        const expenseData = expenses.map(expense => expense.amount);
        const expenseLabels = expenses.map(expense => expense.title);
        const colors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
        ];

        const chartData1 = {
            type: 'doughnut',
            data: {
                labels: ['Remaining Budget', ...expenseLabels],
                datasets: [{
                    label: 'Budget vs Expenses',
                    data: [remainingBudget, ...expenseData],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)', // Color for Remaining Budget
                        ...colors.slice(0, expenses.length) // Colors for each expense
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)'
                    ],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true
            }
        };

        const chartData2 = {
            type: 'pie',
            data: {
                labels: ['Remaining Budget', ...expenseLabels],
                datasets: [{
                    label: 'Budget vs Expenses',
                    data: [remainingBudget, ...expenseData],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)', // Color for Remaining Budget
                        ...colors.slice(0, expenses.length) // Colors for each expense
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)'
                    ],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true
            }
        };

        // Initialize first chart
        new Chart(ctx1, chartData1);

        // Initialize second chart
        new Chart(ctx2, chartData2);
    }

    populateExpenseList();
    initializeCharts();
});
