export type ComparisonOperator = '='|'!='|'<'|'<='|
                '>'|'>='|'LIKE'|'IN'|
                'NOT IN'|'INCLUDES'|'EXCLUDES';

export type LogicalOperator = 'AND'|'OR'|'NOT';

export type Operator = ComparisonOperator|LogicalOperator

export type Operand = string|number|Date|null;