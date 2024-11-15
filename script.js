const OPERATORS = "+-×÷";
const PRECEDENCE = {
    '×': 2,
    '÷': 2,
    '+': 1,
    '-': 1
  };

let expression = document.querySelector("#calculation")
let history = document.querySelector("#history");
let buttonsContainer = document.querySelector("#buttons-container");

buttonsContainer.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "clear":
            expression.textContent = "0";
            history.textContent = " ";
            break;
        case "del":
            if (expression.textContent.length === 1) {
                expression.textContent = "0";
            } else if (isLastCharOperator() || expression.textContent.split(" ").at(-1).length === 1) {
                expression.textContent = expression.textContent.slice(0, -2);
            } else {
                expression.textContent = expression.textContent.slice(0, -1);
            }
            
            break;
        case "percent":
            if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            }

            expression.textContent += "%";
            break;
        case "plus":
            if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            } 

            expression.textContent += " +";
            break;
        case "minus":
            if (expression.textContent.slice(-1) === "+" || expression.textContent.slice(-1) === "-") {
                expression.textContent = expression.textContent.slice(0, -2);
            } 
            
            expression.textContent += " -";

            break;
        case "multiply":
            if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            } 

            expression.textContent += " ×";
            break;
        case "divide":
            if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            } 

            expression.textContent += " ÷";
            break;
        case "decimal":
            if (isOutputEmpty() || !isLastCharOperator()) {
                if (!isDecimalInUse()) {
                    expression.textContent += ".";
                }
            } else {
                expression.textContent += " 0.";
            }

            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (isOutputEmpty()) {
                expression.textContent = e.target.id;
            } else if (isLastCharOperator() && !isNegativeSign()) {
                expression.textContent += " " + e.target.id;
            } else if (expression.textContent.slice(-1) === "%") { 
                expression.textContent += " × " + e.target.id;
            } else {
                expression.textContent += e.target.id;
            }

            break;
        case "equal":
            if (isLastCharOperator()) {
                break;
            }

            history.textContent = expression.textContent + " =";
            expression.textContent = parseExpression(expression.textContent);
            break;
    }
})

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    switch(operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "×":
            return multiply(a, b);
        case "÷":
            return divide(a, b);
    }
}

// parse with simplified Shunting yard algorithm without parentheses and powers
function parseExpression(expression) {
    // split components of expression
    let arrExpression = expression.split(" ");

    // convert percentages to decimal notation
    let tokens = arrExpression.map((item) => {
        if (item.slice(-1) === "%") {
            return Number(item.slice(0, 1)) * 0.01;
        } else if (OPERATORS.includes(item)){
            return item;
        } else {
            return Number(item);
        }
    })

    tokens = convertToRPN(tokens);

    let resultStack = [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (typeof(token) === "number") {
            resultStack.push(token);
        } else {
            let num1 = resultStack.pop();
            let num2 = resultStack.pop();

            switch (token) {
                case '+':
                    resultStack.push(num2 + num1);
                    break;
                case '-':
                    resultStack.push(num2 - num1);
                    break;
                case '×':
                    resultStack.push(num2 * num1);
                    break; 
                case '÷':
                    resultStack.push(num2 / num1);
                break;
            }
        }
    }

    return resultStack.pop();
}

// convert expression into postfix notation or Reverse Polish Notation
function convertToRPN(tokens) {
    let outputQueue = [];
    let operatorStack = [];

    for (let i = 0; i < tokens.length; i++) {
        if (typeof(tokens[i]) === "number") {
            outputQueue.push(tokens[i]);
        } else {
            while (operatorStack.length != 0 && PRECEDENCE[tokens[i]] <= PRECEDENCE[operatorStack.slice(-1)]) {
                outputQueue.push(operatorStack.pop());
            }

            operatorStack.push(tokens[i]);
        }
    }

    while (operatorStack.length !== 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

function isLastCharOperator() {
    let strExpression = expression.textContent;
    if (OPERATORS.includes(strExpression.charAt(strExpression.length - 1))) {
        return true;
    } else {
        false;
    }
}

function isOutputEmpty() {
    if (expression.textContent.length === 1 && expression.textContent === "0") {
        return true;
    } else {
        return false;
    }
}

function isNegativeSign() {

    if (expression.textContent.length === 1 && expression.textContent === "-") {
        return true;
    }

    if (OPERATORS.includes(expression.textContent.slice(-3).split(" ")[0])) {
        return true;
    }

    return false;
}

function isDecimalInUse() {
    let arrExpression = expression.textContent.split(" ");

    if (arrExpression[arrExpression.length - 1].includes(".")) {
        return true;
    }

    return false;
}