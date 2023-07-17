//判断两个对象是否相等
export function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
     if (aProps.length != bProps.length) {
          return false;
     }
     for (var i = 0; i < aProps.length; i++) {
       var propName = aProps[i]

       var propA = a[propName]
       var propB = b[propName]
      // 2020-11-18更新，这里忽略了值为undefined的情况
     // 故先判断两边都有相同键名
      if(!b.hasOwnProperty(propName)) return false
       if ((propA instanceof Object)) {
         if (this.isObjectValueEqual(propA, propB)) {
             // return true     这里不能return ,后面的对象还没判断
           } else {
             return false
           }
       } else if (propA !== propB) {
         return false
       } else { }
     }
   return true
}


/**
 * 根据时间戳 获得自定义时间格式
 * var date = jutils.formatDate(new Date(1634002035*1000),"YYYY-MM-DD HH:ii:ss"); 2021-10-12 09:27:15
 * var date = jutils.formatDate(new Date(1634002035*1000),"YYYY-MM-DD 周W");  2021-10-12 周二
 * var date = jutils.formatDate(new Date(1634002035*1000),"HH:ii:ss"); 09:27:15
 */
export function formatDate(date,formatstr){
  var arrweek=["日","一","二","三","四","五","六"];
  var str=formatstr.replace(/yyyy|YYYY/,date.getFullYear()).replace(/yy|YY/,
  $addZero(date.getFullYear() % 100,2)).replace(/mm|MM/,$addZero(date.getMonth() + 1,
  2)).replace(/m|M/g,date.getMonth() + 1).replace(/dd|DD/,$addZero(date.getDate(),2)).replace(/d|D/g,
  date.getDate()).replace(/hh|HH/,$addZero(date.getHours(),2)).replace(/h|H/g,
  date.getHours()).replace(/ii|II/,$addZero(date.getMinutes(),2)).replace(/i|I/g,
  date.getMinutes()).replace(/ss|SS/,$addZero(date.getSeconds(),2)).replace(/s|S/g,
  date.getSeconds()).replace(/w|g/,$addZero(date.getDay(),2)).replace(/W/g,arrweek[date.getDay()]);
  return str;
}
function $addZero(v,size){
  for(var i=0,len=size-(v+"").length;i<len;i++){
    v="0"+v;
  }
  return v+""
}