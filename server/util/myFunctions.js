
const _ = require('lodash')

 const lowerCaseTrim = (data)=>{

    if(!data){
        return data
    }

    const trimmedString = data.toString().toLowerCase().trim();

    return trimmedString;
}

module.exports = { lowerCaseTrim };