// import { Sum } from "./sum.js";
// import { Subtraction } from "./subtraction.js";
// import { Multiplication } from "./multiplication.js";
// import { Division } from "./division.js";
// import { Square } from "./square.js";
// import { SquareRoot } from "./square-root.js";
// import { Inverse } from "./inverse.js";
// import { Negate } from "./negate.js";

/*export*/ class OperationFactory {
  static get(operator) {
    switch (operator) {
      case "+":
        return new Sum();
      case "-":
        return new Subtraction();
      case "*":
        return new Multiplication();
      case "/":
        return new Division();
      case "s":
        return new Square();
      case "r":
        return new SquareRoot();
      case "i":
        return new Inverse();
      case "n":
        return new Negate();
    }

    throw new Error(`Operation not found: ${JSON.toString(operator)}`);
  }
}
