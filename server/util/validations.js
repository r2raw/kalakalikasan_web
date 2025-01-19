const isEmptyData = (data)=>{

    if(data == null || data == '' || data == undefined){
        return true;
    }
    return false;
}

module.exports = { isEmptyData };