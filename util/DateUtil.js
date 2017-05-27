/**
 * Created by ling xue on 15-9-1.
 */
const getDateFormat = (date ,format) => {
    var o = {
        "M+" : date.getMonth()+1,                 //鏈堜唤
        "d+" : date.getDate(),                    //鏃�
        "h+" : date.getHours(),                   //灏忔椂
        "m+" : date.getMinutes(),                 //鍒�
        "s+" : date.getSeconds(),                 //绉�
        "q+" : Math.floor((date.getMonth()+3)/3), //瀛ｅ害
        "S"  : date.getMilliseconds()             //姣
    };
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return format;
}

module.exports = { getDateFormat}