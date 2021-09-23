const COMMA = ".";
const NEGATIVE = "-";

var _expression = "";
var _display = "0";
var _operation;
var _operationsHistory = [];

var _inserting = true;
var _shouldClearDisplay = false;
var _shouldClearOperation = false;

var _expressionOutput;
var _numberOutput;
var _historyOutput;

class CalculatorService {
  constructor(expressionOutput, numberOutput, historyOutput) {
    _expressionOutput = expressionOutput;
    _numberOutput = numberOutput;
    _historyOutput = historyOutput;
    updateDisplay();
  }

  clearAll() {
    _expression = " ";
    _inserting = true;
    _shouldClearDisplay = false;
    _shouldClearOperation = false;
    _operation = undefined;
    clearEntry();

    updateDisplay();
  }

  clearEntry() {
    resetDisplay();
    _operation = undefined;

    updateDisplay();
  }

  eraseLastInput() {
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

  inputNumber(value) {
    _inserting = true;
    if (_shouldClearDisplay) {
      resetDisplay();
    }
    if (_shouldClearOperation) {
      resetOperation();
    }

    if (isNumberLimitExceeded()) {
      return;
    }

    if (isDisplayOnlyZero()) {
      _display = value;
    } else {
      appendValue(value);
    }

    updateDisplay();
  }

  inputComma() {
    if (hasComma() || isNumberLimitExceeded()) {
      return;
    }

    appendValue(COMMA);

    updateDisplay();
  }

  changeSign() {
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

  doOperation(operator) {
    let operand;
    if (_operation instanceof SingleOperation) {
      if (!_operation.registered) {
        operand = _operation;
      }
      _operation = undefined;
    }

    if (!operand) {
      operand = getNewOperand();
    }

    const newOperation = OperationFactory.get(operator);

    if (_operation) {
      if (!_operation.evaluated) {
        if (newOperation instanceof SingleOperation) {
          _operation.addOperand(newOperation);
        } else if (_operation instanceof DoubleOperation) {
          _operation.addOperand(operand);
          registerOperation(_operation);
          newOperation.addOperand(new Number(_operation.result));
          _operation = newOperation;
        }
      } else {
        newOperation.addOperand(new Number(_operation.result));
        _operation = newOperation;
      }
    } else {
      newOperation.addOperand(operand);
      _operation = newOperation;
    }

    if (_operation.isValid && !_operation.evaluated) {
      executeOperation();
    }

    updateDisplay();
    _shouldClearDisplay = true;
    _shouldClearOperation = false;
    _inserting = false;
  }

  evaluateOperation() {
    let operand = getNewOperand();
    if (_operation) {
      if (!_operation.evaluated || _operation instanceof DoubleOperation) {
        _operation.addOperand(operand);
      }
    } else {
      _operation = operand;
    }
    executeOperation(true);
    _shouldClearDisplay = true;
    _shouldClearOperation = true;
    _inserting = false;
    updateDisplay();
  }
}

function removeLastInput() {
  _display = _display.substring(0, _display.length - 1);
}

function hasOnlyOneValue() {
  if (_display.length === 2) {
    return _display.startsWith(NEGATIVE);
  }
  return _display.length === 1;
}

function updateDisplay() {
  let expression = "";
  if (_operation) {
    expression = _operation.expression;
  }
  _expressionOutput.innerHTML = expression;
  _numberOutput.innerHTML = _display;
  updateHistory();
}

function updateHistory() {
  _historyOutput.innerHTML = "";
  clearHistoryNodes();
  for (let historyItem of _operationsHistory) {
    let item = document.createElement("div");
    item.className = "history-item";
    item.onclick = (evt) => {
      selectOperation(historyItem);
    };

    let exp = document.createElement("div");
    exp.className = "expression-display";
    exp.innerHTML = historyItem.expression;

    let result = document.createElement("div");
    result.className = "number-display";
    result.innerHTML = historyItem.result;

    item.appendChild(exp);
    item.appendChild(result);

    _historyOutput.prepend(item);
  }
}

function selectOperation(op) {
  _operation = clone(op);
  setDisplayNumber(op.result);
  _shouldClearOperation = false;
  updateDisplay();
}

function clearHistoryNodes() {
  while (_historyOutput.firstChild) {
    _historyOutput.removeChild(_historyOutput.lastChild);
  }
}

function resetDisplay() {
  _shouldClearDisplay = false;
  _display = "0";
}

function resetOperation() {
  _operation = undefined;
  _shouldClearOperation = false;
}

function isDisplayOnlyZero() {
  return _display === "0";
}

function isNumberLimitExceeded() {
  return getNumbersOnly().length >= 15;
}

function getNumbersOnly() {
  return _display.replace(COMMA, "").replace(NEGATIVE, "");
}

function appendValue(value) {
  _display += value;
}

function hasComma() {
  return _display.indexOf(COMMA) !== -1;
}

function isDisplayZero() {
  if (isDisplayOnlyZero()) {
    return true;
  }

  const onlyNumbers = _display.replace(COMMA, "").replace(NEGATIVE, "");
  const numberSet = [...new Set(onlyNumbers.split(""))];

  return numberSet.length === 1 && numberSet[0] === "0";
}

function isDisplayNegative() {
  return _display.startsWith("-");
}

function setDisplayPositive() {
  removeFirstInput();
}

function setDisplayNegative() {
  _display = NEGATIVE + _display;
}

function removeFirstInput() {
  _display = _display.substring(1);
}

function setOperation(operator) {
  _operation = OperationFactory.get(operator);
}

function getNewOperand() {
  const displayNumber = getDisplayNumber();
  return new Number(displayNumber);
}

function getDisplayNumber() {
  return +_display;
}

function executeOperation(shouldRegister = false) {
  const result = _operation.result;
  _operation.evaluated = true;
  setDisplayNumber(result);
  _shouldClearDisplay = true;

  if (shouldRegister) {
    registerOperation(_operation);
  }
}

function setDisplayNumber(result) {
  if (result) {
    _display = result.toString();
  } else {
    resetDisplay();
  }
}

function registerOperation(operation) {
  operation.registered = true;
  _operationsHistory.push(clone(operation));
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = new obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
