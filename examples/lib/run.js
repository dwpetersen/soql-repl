const runner = async (func, ...args) => {
    return await func(...args);
}


const handleThen = (data) => {
    console.log(data);
}

const handleCatch = (err) => {
    if (err.response) {
        console.error(err.response.data);
    }
    else {
        console.error(err);
    }  
}

const run = (func, ...args) => {
    runner(func, ...args).then(handleThen).catch(handleCatch);
}

module.exports= {
    run
}
