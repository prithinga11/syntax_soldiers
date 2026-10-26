# MoneyMood – Your Future, Your Money

### Code Canvas – Talent Hunt 2K26
**Theme:** MoneyMatters – Make Money Make Sense  
**Team Name:** Syntax Soldiers

---

##  Team Members

- Mohamed Jaasir MA
- Prithinga SP

---

##  Project Description

MoneyMood is an interactive personal finance dashboard designed to help users understand their spending habits, track savings, manage financial goals, and visualize their financial future.

It makes money management simple and engaging through expense tracking, interactive charts, savings goals, and a Future Me simulator.

---

##  Problem Statement

Many people struggle to understand where their money goes and how their daily spending affects their future savings.

MoneyMood helps users manage their finances by tracking income and expenses, monitoring savings goals, and exploring how small financial changes can impact their future.

---

##  Features

###  Dashboard
- Displays income, expenses, savings, and remaining balance.
- Provides a financial summary.
- Displays recent transactions.
- Visualizes spending categories.

### Expense Tracker
- Add expenses with name, amount, and category.
- Track expenses across different categories.
- Validate expense amounts.
- View recent transactions.

###  Spending Visualization
- Interactive doughnut chart using Chart.js.
- Displays spending distribution by category.
- Helps users understand their spending patterns.

###  Future Me Simulator
- Adjust income and expenses using interactive sliders.
- Simulate future savings.
- Compare financial outcomes for 3, 6, and 12 months.
- Explore the impact of additional savings.

###  Savings Goals
- Create savings goals.
- Track goal progress.
- Add money to existing goals.
- Display saved amount and completion status.

### Local Storage
- Stores financial data in the browser.
- Maintains data after refreshing the page.

###  Responsive Design
- Responsive interface for different screen sizes.
- Simple and user-friendly dashboard.

---

##  Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, layouts, animations, and responsive design |
| JavaScript | Financial calculations, simulator, expense tracking, and interactions |
| Chart.js | Financial data visualization |
| Lucide Icons | Interface icons |
| Google Fonts | Typography |
| LocalStorage | Browser-based data persistence |

---

##  AI Tools Used

**AI Tool:** Claude

AI assistance was used during the development process for code generation, implementation guidance, UI improvements, and debugging support.

### Important Prompts Used

1. "Create a personal finance dashboard called MoneyMood with income, expenses, savings, and remaining balance."
2. "Build a Future Me simulator that allows users to change income and expenses and calculate future savings."
3. "Create a savings goals section with progress tracking and the ability to add money."
4. "Improve the UI with a responsive design, pastel colors, interactive charts, and a clean dashboard layout."

### AI-Generated Code Modified

The generated code was reviewed and customized during development.

Modifications included:
- Updated category colors to match the MoneyMood pastel theme.
- Customized the dashboard layout and styling.
- Adjusted interface elements.
- Integrated project features and functionality.

---

##  UI Customization

### Initial Version

```js
Food:      '#7c3aed',
Shopping:   '#a78bfa',
Transport:  '#c4b5fd',
Bills:      '#4c1d95'
```

### Updated Version

```js
Food:      '#ff9ebc',
Shopping:   '#b9a7ff',
Transport:  '#7fd6ff',
Bills:      '#ffb98a'
```

The category colors were updated to match the MoneyMood pastel theme and improve visual consistency.

---

## Financial Calculation

### Remaining Balance

```text
Remaining Balance = Income − Expenses − Savings
```

### Savings Projection

```text
Future Savings = Monthly Savings × Number of Months
```

### Additional Savings Comparison

```text
Current 12-Month Savings = Monthly Savings × 12

New 12-Month Savings =
(Monthly Savings + Additional Savings) × 12

Additional Savings Gain =
New 12-Month Savings − Current 12-Month Savings
```

### Example

Assume:

```text
Monthly Savings = ₹5,000
Additional Savings = ₹1,000
```

**Current 12-Month Savings**

```text
₹5,000 × 12 = ₹60,000
```

**New 12-Month Savings**

```text
(₹5,000 + ₹1,000) × 12 = ₹72,000
```

**Additional Savings Gain**

```text
₹72,000 − ₹60,000 = ₹12,000
```

This comparison helps users understand how increasing monthly savings can affect their future financial position.

---

## Project Structure

```text
Syntax-Soldiers/
│
├── index.html
│   └── Website structure and interface
│
├── style.css
│   └── Styling, layouts, animations,
│       and responsive design
│
├── script.js
│   └── Financial calculations, simulator,
│       expense tracking, charts, and LocalStorage
│
└── README.md
    └── Project documentation
```

---

##  How Future Me Works

The Future Me simulator allows users to explore how their financial decisions affect their future savings.

### 1. Monthly Financial Inputs

Users can adjust:
- Monthly income
- Shopping expenses
- Other expenses
- Monthly savings
- Additional savings

### 2. Monthly Savings Calculation

```text
Monthly Savings = Income − Expenses
```

The simulator calculates the amount available for savings based on the user's financial inputs.

### 3. Future Savings Projection

```text
Future Savings = Monthly Savings × Number of Months
```

The simulator displays projected savings for:
- 3 months
- 6 months
- 12 months

### 4. Additional Savings Comparison

Users can increase their monthly savings and compare their current financial projection with the new projection.

This helps users understand how small changes in spending and saving habits can make a difference over time.

### 5. Interactive Updates

The simulator updates its calculations when users adjust their financial inputs, allowing them to explore different financial scenarios.

---

##  How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/prithinga11/syntax_soldiers.git
   ```

2. Open the project folder.

3. Open `index.html` in your browser.

No backend installation is required.

---

##  Live Demo

🔗 [MoneyMood – Live Website](https://prithinga11.github.io/syntax_soldiers/)

🔗 [GitHub Repository](https://github.com/prithinga11/syntax_soldiers)

---

##  Future Enhancements

- User authentication.
- Monthly spending reports.
- Budget recommendations.
- Export financial reports.
- Advanced financial planning features.

---

## Hackathon

**Event:** Code Canvas – Talent Hunt 2K26  
**Theme:** MoneyMatters – Make Money Make Sense  
**Team:** Syntax Soldiers

---

 **Syntax Soldiers**
