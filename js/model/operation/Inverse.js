// import { SingleOperation } from "../single-operation.js";

/*export*/ class Inverse extends SingleOperation {
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
