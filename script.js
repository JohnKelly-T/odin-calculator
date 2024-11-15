const OPERATORS = "+-×÷";

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
            } else if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            } else {
                expression.textContent = expression.textContent.slice(0, -1);
            }
            
            break;
        case "%":
            // TODO
            break;
        case "plus":
            if (isLastCharOperator()) {
                expression.textContent = expression.textContent.slice(0, -2);
            } 

            expression.textContent += " +";
            break;
        case "minus":
            if (expression.textContent.slice(-1) === "+") {
                expression.textContent = expression.textContent.slice(0, -2);
            } 
            
            if (isOutputEmpty()) {
                expression.textContent = "-";
            } else {
                expression.textContent += " -";
            }

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

function parseExpression(expression) {
    // split components of expression
    let arrExpression = expression.split(" ");

    let firstNum = Number(arrExpression[0]);
    let secondNum = Number(arrExpression[2]);
    let operator = arrExpression[1];

    if (!secondNum) {
        return firstNum;
    }

    return operate(firstNum, secondNum, operator);
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