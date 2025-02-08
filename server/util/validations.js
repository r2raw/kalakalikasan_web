const isEmptyData = (data) => {

    if (data == null || data == '' || data == undefined) {
        return true;
    }
    return false;
}

const isConvertibleToInt = (str) => {
    return /^-?\d+$/.test(str);
};

module.exports = { isEmptyData, isConvertibleToInt };