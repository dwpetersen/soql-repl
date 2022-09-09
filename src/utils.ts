function hasProperties(value: unknown, props: string[]) {
    if(typeof value !== 'object') {
        return false;
    }
    let hasProp = true;
    props.forEach(prop => {
        hasProp = hasProp && Object.prototype.hasOwnProperty.call(value, prop)
    })
    return hasProp;
}

export const type = {
    hasProperties
}
