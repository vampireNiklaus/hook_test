/**
 * Created by Administrator on 2016/5/18 0018.
 */
function  date2string(inTime){
    var now = inTime;
    var year = now.getFullYear();
    var month =(now.getMonth() + 1).toString();
    var day = (now.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year +"-"+ month +"-"+  day;
    return dateTime;
}