// import { SingleOperation } from "../single-operation.js";

/*export*/ class Square extends SingleOperation {
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
