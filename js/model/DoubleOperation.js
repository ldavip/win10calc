// import { Operand } from "./operand.js";

/*export*/ class DoubleOperation extends Operand {
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
