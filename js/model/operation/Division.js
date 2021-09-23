// import { DoubleOperation } from "../double-operation.js";

/*export*/ class Division extends DoubleOperation {
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
