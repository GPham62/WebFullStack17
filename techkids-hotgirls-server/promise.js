const muaRau = (tien) => {
    return new Promise((resolve, reject) =>{
        if (tien >= 10000){
            resolve("Rau");
        }
        else reject("...");
    });
};

muaRau(10000)
.then((result) =>{
    console.log(result);
    return muaRau(9999);
})
.then((result) =>{
    console.log(result)
})
.catch((err) =>{
    console.log(err);
})
