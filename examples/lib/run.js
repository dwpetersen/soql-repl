const runner = async (func) => {
    return await func();
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

const run = (func) => {
    runner(func).then(handleThen).catch(handleCatch);
}

module.exports= {
    run
}
