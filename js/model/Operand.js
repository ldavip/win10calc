/*export*/ class Operand {
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
