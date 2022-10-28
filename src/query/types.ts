export type ComparisonOperator = '='|'!='|'<'|'<='|
                                 '>'|'>='|'LIKE'|'IN'|
                                 'NOT IN'|'INCLUDES'|'EXCLUDES';

export function getComparsionOperators(): string[] {
    return ['=','!=','<','<=',
            '>','>=','LIKE','IN',
            'NOT IN','INCLUDES','EXCLUDES'];
}

export function hasComparisonOperator(value: string) {
    return getComparsionOperators().reduce((acc, operator) => {
        return acc || value.includes(operator);
    }, true);
}

export function isField(value: string): boolean {
    return /^[A-Za-z][A-Za-z0-9_]+[__c]{0,1}$/.test(value);
}

export function getDateLiterals(): Set<string> {
    return new Set(['YESTERDAY','TODAY','TOMORROW',
                    'LAST_WEEK','THIS_WEEK','NEXT_WEEK',
                    'LAST_MONTH','THIS_MONTH','NEXT_MONTH',
                    'LAST_90_DAYS','NEXT_90_DAYS','THIS_QUARTER',
                    'LAST_QUARTER','NEXT_QUARTER','THIS_YEAR',
                    'NEXT_YEAR','THIS_FISCAL_QUARTER','LAST_FISCAL_QUARTER',
                    'NEXT_FISCAL_QUARTER','THIS_FISCAL_YEAR','NEXT_FISCAL_YEAR']);
}

export function getDateNLiterals(): Set<string> {
    return  new Set(['LAST_N_DAYS', 'NEXT_N_DAYS', 'N_DAYS_AGO',
                     'NEXT_N_WEEKS', 'LAST_N_WEEKS', 'N_WEEKS_AGO',
                     'NEXT_N_MONTHS', 'LAST_N_MONTHS', 'N_MONTHS_AGO', 
                     'NEXT_N_QUARTERS', 'LAST_N_QUARTERS', 'N_QUARTERS_AGO',
                     'NEXT_N_YEARS', 'LAST_N_YEARS', 'N_YEARS_AGO',
                     'NEXT_N_FISCAL_QUARTERS', 'LAST_N_FISCAL_QUARTERS', 'N_FISCAL_QUARTERS_AGO']);
}


export function isDateLiteral(value: unknown) {
    if(getDateLiterals().has(value as string)) {
        return true;
    }
    else {        
        const [nLiteral, n] = (value as string).split(':');
        return getDateNLiterals().has(nLiteral) && Number.isInteger(Number.parseFloat(n));
    }
}

export type LogicalOperator = 'AND'|'OR'|'NOT';

export type Operator = ComparisonOperator|LogicalOperator

export type Operand = string|number|Date|null;