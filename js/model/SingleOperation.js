// import { Operand } from "./operand.js";

/*export*/ class SingleOperation extends Operand {
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
