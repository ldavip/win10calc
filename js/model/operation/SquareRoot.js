// import { SingleOperation } from "../single-operation.js";

/*export*/ class SquareRoot extends SingleOperation {
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
