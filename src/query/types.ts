export type CompOperator = '='|'!='|'<'|'<='|
                '>'|'>='|'LIKE'|'IN'|
                'NOT IN'|'INCLUDES'|'EXCLUDES';

export type LogicalOperator = 'AND'|'OR'|'NOT';

export type Operator = CompOperator|LogicalOperator

export type Operand = string|number|Date|null;