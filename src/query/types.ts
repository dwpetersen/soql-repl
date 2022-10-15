export type ComparisonOperator = '='|'!='|'<'|'<='|
                                 '>'|'>='|'LIKE'|'IN'|
                                 'NOT IN'|'INCLUDES'|'EXCLUDES';


export function isDateLiteral(value: unknown) {
    const options = new Set(['YESTERDAY','TODAY','TOMORROW',
                             'LAST_WEEK','THIS_WEEK','NEXT_WEEK',
                             'LAST_MONTH','THIS_MONTH','NEXT_MONTH',
                             'LAST_90_DAYS','NEXT_90_DAYS','THIS_QUARTER',
                             'LAST_QUARTER','NEXT_QUARTER','THIS_YEAR',
                             'NEXT_YEAR','THIS_FISCAL_QUARTER','LAST_FISCAL_QUARTER',
                             'NEXT_FISCAL_QUARTER','THIS_FISCAL_YEAR','NEXT_FISCAL_YEAR']);
    return options.has(value as string);
}

export type LogicalOperator = 'AND'|'OR'|'NOT';

export type Operator = ComparisonOperator|LogicalOperator

export type Operand = string|number|Date|null;