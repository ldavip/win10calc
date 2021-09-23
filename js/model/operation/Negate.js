// import { SingleOperation } from "../single-operation.js";

/*export*/ class Negate extends SingleOperation {
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
