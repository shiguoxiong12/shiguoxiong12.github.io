/***********************************************
功能：获取URL中的参数（调用该函数不需要考虑编码的问题）
参数：
url：URL
param：参数名
返回：参数值
***********************************************/
function Com_GetUrlParameter(url, param){
   var re = new RegExp();
   re.compile("[\\?&]"+param+"=([^&]*)", "i");
   var arr = re.exec(url);
   if(arr==null)
       return null;
   else
       return decodeURIComponent(arr[1]);
}
/***********************************************
功能：设置URL参数，若参数不存在则添加一个，否则覆盖原有参数
参数：
url：URL
param：参数名
value：参数值
返回：URL
***********************************************/
function Com_SetUrlParameter(url, param, value){
   var re = new RegExp();
   re.compile("([\\?&]"+param+"=)[^&]*", "i");
   if(value==null){
       if(re.test(url)){
           url = url.replace(re, "");
       }
   }else{
       value = encodeURIComponent(value);
       if(re.test(url)){
           url = url.replace(re, "$1"+value);
       }else{
           url += (url.indexOf("?")==-1?"?":"&") + param + "=" + value;
       }
   }
   if(url.charAt(url.length-1)=="?")
       url = url.substring(0, url.length-1);
   return url;
}

