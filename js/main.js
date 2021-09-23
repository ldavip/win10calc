var service;

window.onload = function () {
  let expressionOutput = document.getElementById("expression");
  let numberOutput = document.getElementById("number");
  let historyOutput = document.getElementById("history");

  service = new CalculatorService(
    expressionOutput,
    numberOutput,
    historyOutput
  );
};

function clearAll() {
  service.clearAll();
}

function clearEntry() {
  service.clearEntry();
}

function eraseLastInput() {
  service.eraseLastInput();
}

function inputNumber(value) {
  service.inputNumber(value);
}

function inputComma() {
  service.inputComma();
}

function changeSign() {
  service.changeSign();
}

function doOperation(operator) {
  service.doOperation(operator);
}

function evaluateOperation() {
  service.evaluateOperation();
}
