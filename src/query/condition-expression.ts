import { FieldExpression } from "./field-expression";
import { LogicalOperator } from "./types";

export class ConditionExpression {
    elements?: (ConditionExpression|FieldExpression|LogicalOperator)[];

    static fromString(value: string) {
        return new ConditionExpression();
    }
}