const COMMA = ".";
const NEGATIVE = "-";

var expression = "";
var display = "0";
var operation;
var operations = [];
var inserting = true;

var shouldClearDisplay = false;
var shouldClearOperation = false;

var expressionOutput;
var numberOutput;

var historyOutput;

window.onload = function () {
  expressionOutput = document.getElementById("expression");
  numberOutput = document.getElementById("number");
  historyOutput = document.getElementById("history");
  updateDisplay();
};

// ---

function clearAll() {
  expression = " ";
  shouldClearDisplay = false;
  operation = undefined;
  storedNumber = undefined;
  clearEntry();

  updateDisplay();
}

// ---

function clearEntry() {
  resetDisplay();
  operation = undefined;

  updateDisplay();
}

// ---

function eraseLastInput() {
  if (isDisplayOnlyZero()) {
    return;
  }

  if (hasOnlyOneValue()) {
    resetDisplay();
  } else {
    removeLastInput();
  }

  updateDisplay();
}

function removeLastInput() {
  display = display.substring(0, display.length - 1);
}

function hasOnlyOneValue() {
  if (display.length === 2) {
    return display.startsWith(NEGATIVE);
  }
  return display.length === 1;
}

function updateDisplay() {
  let expression = "";
  if (operation) {
    expression = operation.expression;
  }
  expressionOutput.innerHTML = expression;
  numberOutput.innerHTML = display;
  updateHistory();
}

function updateHistory() {
  historyOutput.innerHTML = "";
  clearHistoryNodes();
  for (let operation of operations) {
    let item = document.createElement("div");
    item.className = "history-item";
    item.onclick = (evt) => {
      console.log(`clicked: ${operation.expression}`);
    };

    let exp = document.createElement("div");
    exp.className = "expression-display";
    exp.innerHTML = operation.expression;

    let result = document.createElement("div");
    result.className = "number-display";
    result.innerHTML = operation.result;

    item.appendChild(exp);
    item.appendChild(result);

    historyOutput.prepend(item);
  }
}

function clearHistoryNodes() {
  while (historyOutput.firstChild) {
    historyOutput.removeChild(historyOutput.lastChild);
  }
}

// ---

function inputNumber(value) {
  inserting = true;
  if (shouldClearDisplay) {
    resetDisplay();
  }
  if (shouldClearOperation) {
    resetOperation();
  }

  if (isNumberLimitExceeded()) {
    return;
  }

  if (isDisplayOnlyZero()) {
    display = value;
  } else {
    appendValue(value);
  }

  updateDisplay();
}

function resetDisplay() {
  shouldClearDisplay = false;
  display = "0";
}

function resetOperation() {
  operation = undefined;
  shouldClearOperation = false;
}

function isDisplayOnlyZero() {
  return display === "0";
}

function isNumberLimitExceeded() {
  return getNumbersOnly().length >= 15;
}

function getNumbersOnly() {
  return display.replace(COMMA, "").replace(NEGATIVE, "");
}

function appendValue(value) {
  display += value;
}

// ---

function inputComma() {
  if (hasComma() || isNumberLimitExceeded()) {
    return;
  }

  appendValue(COMMA);

  updateDisplay();
}

function hasComma() {
  return display.indexOf(COMMA) !== -1;
}

// ---

function changeSign() {
  if (isDisplayZero()) {
    return;
  }

  if (isDisplayNegative()) {
    setDisplayPositive();
  } else {
    setDisplayNegative();
  }

  updateDisplay();
}

function isDisplayZero() {
  if (isDisplayOnlyZero()) {
    return true;
  }

  const onlyNumbers = display.replace(COMMA, "").replace(NEGATIVE, "");
  const numberSet = [...new Set(onlyNumbers.split(""))];

  return numberSet.length === 1 && numberSet[0] === "0";
}

function isDisplayNegative() {
  return display.startsWith("-");
}

function setDisplayPositive() {
  removeFirstInput();
}

function setDisplayNegative() {
  display = NEGATIVE + display;
}

function removeFirstInput() {
  display = display.substring(1);
}

// ---

function doOperation(operator) {
  let operand;
  if (operation instanceof SingleOperation) {
    if (!operation.registered) {
      operand = operation;
    }
    operation = undefined;
  }

  if (!operand) {
    operand = getNewOperand();
  }

  const newOperation = OperationFactory.get(operator);

  if (operation) {
    if (newOperation instanceof SingleOperation) {
      operation.addOperand(newOperation);
    } else if (operation instanceof DoubleOperation) {
      operation.addOperand(operand);
      registerOperation(operation);
      newOperation.addOperand(new Number(operation.result));
      operation = newOperation;
    } else {
      newOperation.addOperand(operation);
      operation = newOperation;
    }
  } else {
    newOperation.addOperand(operand);
    operation = newOperation;
  }

  if (operation.isValid && !operation.evaluated) {
    executeOperation();
  }

  updateDisplay();
  shouldClearDisplay = true;
  inserting = false;
}

function setOperation(operator) {
  operation = OperationFactory.get(operator);
}

function getNewOperand() {
  const displayNumber = getDisplayNumber();
  return new Number(displayNumber);
}

function getDisplayNumber() {
  return +display;
}

function executeOperation(shouldRegister = false) {
  const result = operation.result;
  operation.evaluated = true;
  setDisplayNumber(result);
  shouldClearDisplay = true;

  if (shouldRegister) {
    registerOperation(operation);
  }
}

function setDisplayNumber(result) {
  if (result) {
    display = result.toString();
  } else {
    resetDisplay();
  }
}

function registerOperation(operation) {
  operation.registered = true;
  operations.push(clone(operation));
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = new obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function evaluateOperation() {
  let operand = getNewOperand();
  if (operation) {
    if (!operation.evaluated || operation instanceof DoubleOperation) {
      operation.addOperand(operand);
    }
  } else {
    operation = operand;
  }
  executeOperation(true);
  shouldClearDisplay = true;
  shouldClearOperation = true;
  inserting = false;
  updateDisplay();
}

// ---

class Operand {
  constructor() {
    this.registered = false;
    this.evaluated = false;
  }

  addOperand(operand) {
    throw new Error("Not implemented yet!");
  }

  get isValid() {
    throw new Error("Not implemented yet!");
  }

  get result() {
    throw new Error("Not implemented yet!");
  }

  get expression() {
    throw new Error("Not implemented yet!");
  }
}

class SingleOperation extends Operand {
  constructor(singleOperand) {
    super();
    this.singleOperand = singleOperand;
  }

  addOperand(operand) {
    this.singleOperand = operand;
  }

  get isValid() {
    return !!this.singleOperand;
  }

  get result() {
    return this.singleOperand;
  }

  get expression() {
    return `${this.singleOperand.expression}${this.registered ? " = " : ""}`;
  }
}

class Number extends SingleOperation {
  constructor(number) {
    super(number);
  }

  get expression() {
    return `${this.singleOperand}${this.registered ? " = " : ""}`;
  }
}

class Square extends SingleOperation {
  constructor(singleOperand) {
    super(singleOperand);
  }

  get result() {
    return Math.pow(this.singleOperand.result, 2);
  }

  get expression() {
    return `sqr(${this.singleOperand.expression})${
      this.registered ? " = " : ""
    }`;
  }
}

class SquareRoot extends SingleOperation {
  constructor(singleOperand) {
    super(singleOperand);
  }

  get result() {
    return Math.sqrt(this.singleOperand.result);
  }

  get expression() {
    return `√(${this.singleOperand.expression})${this.registered ? " = " : ""}`;
  }
}

class Invertion extends SingleOperation {
  constructor(singleOperand) {
    super(singleOperand);
  }

  get result() {
    return 1.0 / this.singleOperand.result;
  }

  get expression() {
    return `1/(${this.singleOperand.expression})${
      this.registered ? " = " : ""
    }`;
  }
}

class Negate extends SingleOperation {
  constructor(singleOperand) {
    super(singleOperand);
  }

  get result() {
    return -this.singleOperand.result;
  }

  get expression() {
    return `negate(${this.singleOperand.expression})${
      this.registered ? " = " : ""
    }`;
  }
}

class DoubleOperation extends Operand {
  constructor(firstOperand, secondOperand) {
    super();
    this.firstOperand = firstOperand;
    this.secondOperand = secondOperand;
  }

  clearOperands() {
    this.firstOperand = undefined;
    this.secondOperand = undefined;
  }

  addOperand(operand) {
    if (!this.firstOperand) {
      this.firstOperand = operand;
    } else if (this.secondOperand) {
      this.firstOperand = operand;
    } else {
      this.secondOperand = operand;
    }
  }

  get isValid() {
    return !!this.firstOperand && !!this.secondOperand;
  }

  get result() {
    if (!this.firstOperand) {
      throw new Error(`Cannot evaluate ${this.name}!`);
    }

    if (!this.secondOperand) {
      this.secondOperand = this.firstOperand;
    }

    return this.evaluate(this.firstOperand.result, this.secondOperand.result);
  }

  evaluate(firstNumber, secondNumber) {
    throw new Error("Not implemented yet!");
  }

  get expression() {
    let exp = "";

    if (this.firstOperand) {
      exp += `${this.__getExpression(this.firstOperand)} ${this.symbol} `;
    }
    if (this.secondOperand) {
      exp += `${this.__getExpression(this.secondOperand)}`;
    }

    return exp + (this.registered ? " = " : "");
  }

  __getExpression(operand) {
    if (operand instanceof DoubleOperation) {
      return `${operand.result}`;
    }
    return operand.expression;
  }

  get symbol() {
    throw new Error("Not implemented yet!");
  }
}

class Sum extends DoubleOperation {
  constructor(firstOperand, secondOperand) {
    super(firstOperand, secondOperand);
  }

  evaluate(firstNumber, secondNumber) {
    return firstNumber + secondNumber;
  }

  get symbol() {
    return "+";
  }
}

class Subtraction extends DoubleOperation {
  constructor(firstOperand, secondOperand) {
    super(firstOperand, secondOperand);
  }

  evaluate(firstNumber, secondNumber) {
    return firstNumber - secondNumber;
  }

  get symbol() {
    return "-";
  }
}

class Multiplication extends DoubleOperation {
  constructor(firstOperand, secondOperand) {
    super(firstOperand, secondOperand);
  }

  evaluate(firstNumber, secondNumber) {
    return firstNumber * secondNumber;
  }

  get symbol() {
    return "x";
  }
}

class Division extends DoubleOperation {
  constructor(firstOperand, secondOperand) {
    super(firstOperand, secondOperand);
  }

  evaluate(firstNumber, secondNumber) {
    return firstNumber / secondNumber;
  }

  get symbol() {
    return "÷";
  }
}

class OperationFactory {
  static get(operator) {
    switch (operator) {
      case "+":
        return new Sum();
      case "-":
        return new Subtraction();
      case "*":
        return new Multiplication();
      case "/":
        return new Division();
      case "s":
        return new Square();
      case "r":
        return new SquareRoot();
      case "i":
        return new Invertion();
      case "n":
        return new Negate();
    }

    throw new Error(`Operation not found: ${operator}`);
  }
}
