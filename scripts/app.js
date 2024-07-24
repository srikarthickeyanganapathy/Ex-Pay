document.addEventListener("DOMContentLoaded", function() {
    const budgetAmountInput = document.getElementById("budgetAmount");
    const addBudgetButton = document.getElementById("addBudget");
    const expenseTitleInput = document.getElementById("expTitle");
    const expenseDescInput = document.getElementById("expDesc");
    const expenseAmountInput = document.getElementById("expAmount");
    const dateInput = document.getElementById("date");
    const addExpenseButton = document.getElementById("addExpense");
    const expenseList = document.getElementById("expenseList");
    const currentAmountDisplay = document.getElementById("currentAmount");
    const expenseAmountDisplay = document.getElementById("expenseAmount");
    const balanceAmountDisplay = document.getElementById("balance-amount");
    const resetButton = document.getElementById("reset");

    let budget = parseFloat(localStorage.getItem("budget")) || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let currentAmount = budget; // Initialize currentAmount with budget

    function updateUI() {
        let totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        let balance = currentAmount - totalExpense;

        currentAmountDisplay.innerText = `₹ ${currentAmount.toFixed(2)}`;
        expenseAmountDisplay.innerText = `₹ ${totalExpense.toFixed(2)}`;
        balanceAmountDisplay.innerHTML = `₹ ${balance.toFixed(2)}`;

        // Add light green color to balance amount
        balanceAmountDisplay.style.color = balance >= 0 ? 'lightgreen' : 'red';

        populateExpenseList();

        // Alert if balance is negative
        if (balance < 0) {
            alert("Warning: Your total expenses exceed your budget!");
        }
    }

    function populateExpenseList() {
        expenseList.innerHTML = expenses.length ? expenses.map((expense, index) => `
            <tr>
                <td>${expense.title}</td>
                <td>${expense.balance !== undefined ? `<span style="color: ${expense.balance >= 0 ? 'lightgreen' : 'red'};">₹ ${expense.balance.toFixed(2)}</span>` : '-'}</td>
                <td>${expense.amount < 0 ? `<span style="color: red;">-₹ ${Math.abs(expense.amount).toFixed(2)}</span>` : `<span style="color: lightgreen;">₹ ${expense.amount.toFixed(2)}</span>`}</td>
                <td>${expense.date}</td>
                <td><button class="delete-btn" data-index="${index}"><i class="fa fa-times-circle"></i></button></td>
            </tr>
        `).join("") : '<tr><td colspan="5" style="text-align: center;">No expenses to show</td></tr>';

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                deleteExpense(button.getAttribute("data-index"));
            });
        });
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateUI();
    }

    addBudgetButton.addEventListener("click", function(event) {
        event.preventDefault();
        const newBudgetAmount = parseFloat(budgetAmountInput.value);

        // Update budget and current amount
        budget += newBudgetAmount;
        currentAmount = budget;
        localStorage.setItem("budget", budget);
        updateUI();
    });

    addExpenseButton.addEventListener("click", function(event) {
        event.preventDefault();
        const expenseAmount = parseFloat(expenseAmountInput.value);
        const expense = {
            title: expenseTitleInput.value,
            description: expenseDescInput.value,
            amount: expenseAmount,
            date: dateInput.value,
            // Calculate the balance after adding this expense
            balance: currentAmount - (expenses.reduce((acc, exp) => acc + exp.amount, 0) + expenseAmount)
        };

        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateUI();
    });

    function resetFormAndChart() {
        // Reset localStorage data
        localStorage.removeItem("budget");
        localStorage.removeItem("expenses");

        // Reset UI variables
        budget = 0;
        currentAmount = 0;
        expenses = [];

        // Reset form fields
        budgetAmountInput.value = '';
        expenseTitleInput.value = '';
        expenseDescInput.value = '';
        expenseAmountInput.value = '';
        dateInput.value = '';

        // Update the UI
        updateUI();

        // Reset chart data
        if (expenseChart) {
            expenseChart.data.datasets[0].data = [500, 100, 200, 150, 50];  // Initial values
            expenseChart.update();
        }
    }

    resetButton.addEventListener("click", function(event) {
        event.preventDefault();
        resetFormAndChart();
    });

    // Initial UI update
    updateUI();

    // Add style to the table
    const style = document.createElement('style');
    style.innerHTML = `
        .table-container {
            width: 100%;
            overflow-x: auto;
            border-radius: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 1rem;
            min-width: 400px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            background-color: #1a1a1a;
            color: #ffffff;
            border-radius: 20px;
        }
        table thead {
            background-color: #1a1a1a;
            color: #ffffff;
            text-align: left;
            font-weight: bold;
            font-size: 17px;
        }
        table th,
        table td {
            padding: 1rem 1.5rem;
            text-align: left;
        }
        table tbody tr {
            border-bottom: 1px solid #dddddd;
            font-size: 14px;
        }
        table tbody tr:nth-of-type(even) {
            background-color: #2a2a2a;
        }
        table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
        }
        table tbody tr:hover {
            background-color: #333333;
            cursor: pointer;
        }
        table th {
            position: relative;
        }
        .delete-btn {
            background-color: transparent;
            border: none;
            cursor: pointer;
        }
        .delete-btn i {
            color: #ff4d4d;
            font-size: 1.5rem;
        }
    `;
    document.head.appendChild(style);
});

/*gsap*/

let tl = gsap.timeline({default: {duration: 0.2}});
tl 
    .from("nav",{opacity:0, y:10})
    .from(".main-title", {opacity:0, y:10})
    .from('.dashborad-title', {opacity:0, y:8})
    .from(".budgetSection", {opacity:0, y:10})
    .from(".income-expense-cards", {opacity:0, y:10})
    .from(".addExpense", {opacity:0, y:10})
    .from(".expenseList", {opacity:0, y:10})