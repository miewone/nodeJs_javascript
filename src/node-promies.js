// @ts-check

const fs = require('fs');

/**
 * @param {string} filenName
 */

function readFileInPromise(filenName)
{
    return new Promise( (resolve,reject) =>{
        fs.readFile(filenName,'utf-8',(err,val) => {
            if(err)
            {
                reject(err)
            }
            resolve(val)
        })
    })
}

readFileInPromise('.gitignore')
    .then( (val) => {
        console.log(val);
    })  