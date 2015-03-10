function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    var millisecond = now.getMilliseconds();
    if (month.toString().length == 1) {
        var month = '0'+month;
    }
    if (day.toString().length == 1) {
        var day = '0'+day;
    }   
    if (hour.toString().length == 1) {
        var hour = '0'+hour;    
    }
    if (minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if (second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second+"."+millisecond;   
    return dateTime;
}
log = function (type,data) {
    data.tipo = type;
    data.tiempo = getDateTime();
    console.log(data);
};
exports.error = function (data) {
    log("ERROR", data);
};
exports.info = function (data) {
    log("INFO", data);
};
exports.getTime = function () {
    return getDateTime();
}
