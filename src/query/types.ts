export type ComparsionOperator = '='|'!='|'<'|'<='|
                '>'|'>='|'LIKE'|'IN'|
                'NOT IN'|'INCLUDES'|'EXCLUDES';

export type LogicalOperator = 'AND'|'OR'|'NOT';

export type Operator = ComparsionOperator|LogicalOperator

export type Operand = string|number|Date|null;