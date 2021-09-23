// import { SingleOperation } from "./single-operation.js";

/*export*/ class Number extends SingleOperation {
  constructor(number) {
    super(number);
  }

  get expression() {
    return `${this.singleOperand}${this.registered ? " = " : ""}`;
  }
}
