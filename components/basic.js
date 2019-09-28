if(!String.prototype.trim) {
	String.prototype.trim = function(){ return Trim(this);};
	function LTrim(str)
	{
		var i;
		for(i=0;i<str.length;i++)
		{
			if(str.charAt(i)!=" ")break;
		}
		str=str.substring(i,str.length);
		return str;
	}
	function RTrim(str)
	{
		var i;
		for(i=str.length-1;i>=0;i--)
		{
			if(str.charAt(i)!=" ")break;
		}
		str=str.substring(0,i+1);
		return str;
	}
	function Trim(str)
	{
		return LTrim(RTrim(str));
	}
}

function getCookie(key) {
	if(document.cookie.length > 0) {
		var cookieArray = document.cookie.split(';');
		for(var i in cookieArray) {
			if(cookieArray[i].split('=')[0].trim() == key) {
				if(key=='chat-name0' || key=='chat-name1') {
					return unescape(cookieArray[i].split('=')[1].trim().split(';')[0]);
				}else{
					return cookieArray[i].split('=')[1].trim();
				}	
			}
		}
	}
	return null;
}

function setCookie(key, value, expire) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expire);
	if(key=='chat-name0' || key=='chat-name1') {
		document.cookie = key + '=' + escape(value) + ((expire==null)?'':';expires='+exdate.toGMTString()) + ';path=/';			
	}else{
		document.cookie = key + '=' + value + ((expire==null)?'':';expires='+exdate.toGMTString()) + ';path=/';
	}
}


function delCookie(key){
	var date = new Date();
	date.setTime(date.getTime()-10000);
	document.cookie = key + "=v; expires=" + date.toGMTString() + ";path=/";
}

function getParameter(key) {
	var parameters = location.search.slice(1);
	if(parameters.length > 0) {
		var paArray = parameters.split('&');
		for(var i in paArray) {
			if(decodeURIComponent(paArray[i].split('=')[0]) == key) {
				return decodeURIComponent(paArray[i].slice(paArray[i].indexOf('=') + 1));
			}
		}
	}
	return null;
}

function getCutString(string, length) {
	var cutString = '';
	var len = 0;
	var reg = /[^\x00-\xff]/ig;
	for(var i = 0; i < string.length; i++) {
		if(len < length) {
			if(string.charAt(i).match(reg))
				len += 2;
			else len += 1;
			cutString = cutString + string.charAt(i);
		} else {
			cutString = cutString + '…';
			return cutString;
		}
	}
	return cutString;
}

function getStringLength(string) {
	var len = 0;
	var reg = /[^\x00-\xff]/ig;
	for(var i = 0; i < string.length; i++) {
			if(reg.test(string.charAt(i)))
				len += 2;
			else len += 1;
	}
	return len;
}

function formatDate(date, format) {
	if(!format)format = 'yyyy-MM-dd';
	var addZero = function(number){
		if(number < 10)return '0' + number;
		else return '' + number;
	};
	if(!(date instanceof Date)) {
		date = new Date(date);
	}
	if(format.indexOf('yyyy') >= 0) {
		format = format.replace(/yyyy/g, date.getFullYear());
	}else if(format.indexOf('yy') >= 0) {
		format = format.replace(/yy/g, (date.getFullYear()+'').substr(2,2));
	}
	if(format.indexOf('MM') >= 0) {
		format = format.replace(/MM/g, addZero(date.getMonth()+1));
	}else if(format.indexOf('M') >= 0) {
		format = format.replace(/M/g, date.getMonth()+1);
	}
	if(format.indexOf('dd') >= 0) {
		format = format.replace(/dd/g, addZero(date.getDate()));
	}else if(format.indexOf('d') >= 0) {
		format = format.replace(/d/g, date.getDate());
	}
	if(format.indexOf('HH') >= 0) {
		format = format.replace(/HH/g, addZero(date.getHours()));
	}else if(format.indexOf('H') >= 0) {
		format = format.replace(/H/g, date.getHours());
	}
	if(format.indexOf('mm') >= 0) {
		format = format.replace(/mm/g, addZero(date.getMinutes()));
	}else if(format.indexOf('m') >= 0) {
		format = format.replace(/m/g, date.getMinutes());
	}
	if(format.indexOf('ss') >= 0) {
		format = format.replace(/ss/g, addZero(date.getSeconds()));
	}else if(format.indexOf('s') >= 0) {
		format = format.replace(/s/g, date.getSeconds());
	}
	return format;
}

function toDate(dateString, split) {
	if(!split)split = '-';
	var dateArray = dateString.split(split);
	var date = new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
	return date;
}

//毫秒數返回字符串
function secondsToString(number) {
	var hoursAndMinutes = number / (1000*60);
	var hours = Math.floor(hoursAndMinutes / 60);
	var minutes = Math.floor(hoursAndMinutes % 60);
	if(hours == 0) {
		return minutes + '分鐘';
	}else if(minutes == 0) {
		return hours + '小時';
	}else {
		return hours + '小時' + minutes + '分鐘';
	}
}

window.onload = function() {
	var arrInputs = document.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        var curInput = arrInputs[i];
        if (!curInput.type || curInput.type == "" || curInput.type == "text" || curInput.type == "password")
            HandlePlaceholder(curInput);
    }
};
 
function HandlePlaceholder(oTextbox) {
    if (!("placeholder" in document.createElement("input")) && (oTextbox.getAttribute("placeholder"))) {
		var curPlaceholder = oTextbox.getAttribute("placeholder");
        if (curPlaceholder && curPlaceholder.length > 0) {
            var span = document.createElement('span');
			var style = window.getComputedStyle? window.getComputedStyle(oTextbox, null):oTextbox.currentStyle;
            span.innerHTML = curPlaceholder;
            span.style.color = '#c0c0c0';
            span.className = 'place-holder';
            span.style.position = 'absolute';
			span.style.zIndex = '99';
			span.style.fontSize = style.fontSize;
			if(oTextbox.value.length > 0) {
				span.style.visibility = 'hidden';
			}
			if(oTextbox.offsetParent.nodeName == 'TD') {
				var tmp = oTextbox, left = 0, top = 0;
				while(tmp != document.body) {
					left += tmp.offsetLeft;
					top += tmp.offsetTop;
					tmp = tmp.offsetParent;
				}
				span.style.left = left + parseInt(style.paddingLeft) + 'px';
				span.style.top = top + parseInt(style.paddingTop) + 'px';
				document.body.appendChild(span);
			}else {
				span.style.left = oTextbox.offsetLeft + parseInt(style.paddingLeft) + 'px';
				span.style.top = oTextbox.offsetTop + parseInt(style.paddingTop) + 'px';
				oTextbox.parentNode.insertBefore(span, oTextbox);
			}
            
            oTextbox.onfocus = function(){
                span.style.visibility = 'hidden';
            };
            
            oTextbox.onblur = function(){
                if(this.value === '') {
                    span.style.visibility = 'visible';
                }
            };
            
            span.onclick = function() {
                oTextbox.focus();
            };
            
        }
    }
}

//json字串按時間time進行排序
function compare(value1, value2){
	if(+value1.time < +value2.time) {
		return -1;
	}else if(+value1.time > +value2.time) {
		return 1;
	}else {
		return 0;
	}
}

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

//數據格式化
function formatAvatar(avatar){
	if(avatar=="" || avatar==null){
		return "/images/user-default.png";
	}else{
		return avatar;
	}
}
function formatAvatar2(avatar){
	if(avatar=="" || avatar==null){
		return "/images/doctor_default.png";
	}else{
		return avatar;
	}
}
function formatNA(value){
	if(value==""||value=="-"){
		return "N/A";
	}else{
		return value;
	}
}
function formatTimeNA(time){
	if(time==""){
		return "N/A";
	}else{
		return formatDate(new Date(+time), 'yy/MM/dd');
	}
}
function formatNaN(num){
	if(isNaN(num)){
		return '--';
	}else{
		return toThousands(num);
	}
}
/*******************************************************************************
 * 功能：填充列表分頁欄 
 * params: pageIndex 當前頁
 *         total   總紀錄數 
 *         method  點擊分頁執行的方法名
 ******************************************************************************/
function setPageIndex(pageIndex,total,method,pageSize) {
	var pageCount = Math.floor((parseInt(total) + pageSize - 1) / pageSize);		
	if (pageCount > 0) {
		var beginPageIndex = 1,endPageIndex = 5;
		if (parseInt(pageCount) <= 5) {
			beginPageIndex = 1;
			endPageIndex = parseInt(pageCount);
		} else {
			beginPageIndex = parseInt(pageIndex) - 2;
			endPageIndex = parseInt(pageIndex) + 2;
			if (beginPageIndex < 1) {
				beginPageIndex = 1;
				endPageIndex = 5;
			}
			if (endPageIndex > parseInt(pageCount)) {
				endPageIndex = parseInt(pageCount);
				beginPageIndex = parseInt(pageCount) - 5 + 1;
			}
		}
		$("#pageIndex").html('');
		var html = '';
		if (parseInt(pageIndex) <= 1) {
			html += '<li class="disabled"><a href="javascript:void(0);"><i class="fa fa-angle-left"></i></a></li>';
		} else {
			html += '<li class=""> <a href="javascript:'+method+'('
					+ (parseInt(pageIndex) - 1)
					+ ');"><i class="fa fa-angle-left"></i></a></li>';
		}
		for (var i = beginPageIndex; i <= endPageIndex; i++) {
			if (i == pageIndex) {
				html += '<li class="active"><a href="javascript:'+method+'('
						+ i + ');">' + i + '</a></li>';
			} else {
				html += '<li class=""><a href="javascript:'+method+'('
						+ i + ');">' + i + '</a></li>';
			}
		}
		if (parseInt(pageIndex) >= pageCount) {
			html += '<li class="disabled"> <a href="javascript:void(0);"><i class="fa fa-angle-right"></i></a> </li>';
		} else {
			html += '<li class=""> <a href="javascript:'+method+'('
					+ (parseInt(pageIndex) + 1)
					+ ');"><i class="fa fa-angle-right"></i></a> </li>';
		}
		$("#pageIndex").append(html);
		$("#gopage").val(pageIndex);
		$("#gopage").attr("max",pageCount);
		$("#recordCount").html(total);
		$("#pageCount").html(pageCount);
	} else {
		$("#pageIndex").html('');
		$("#gopage").val(pageIndex);
		$("#gopage").attr("max",1);
		$("#recordCount").html(total);
		$("#pageCount").html(pageCount);
	}
}

/*******************************************************************************
 * 功能：處理頁面出現多层modal冲突
 * params:
 ******************************************************************************/
function multilayerModal(){
	$(".notLastModal").on("hidden.bs.modal",function(){  
		$(document.body).addClass("modal-open");  
		$(".modal-backdrop:last").show();
	});  
	$(".notLastModal").on("show.bs.modal",function(){  
		if(!$(this).hasClass('in')){
			$(".modal-backdrop").hide();
		}
	});  
	$(".notLastModal").on("shown.bs.modal",function(){  
    	var zindex = $(this).css("z-index") - 1;
		$(".modal-backdrop:last").css("z-index",zindex);
	});  
}

//數據呈現千位符
function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}


/*****************************************************
 * 功能：獲取某天凌晨的時間戳
 * params: n 以當天為基準參考數值，
 * 例如：獲取當天零點時間戳則:getTimeStart(0)
 * 	    昨天零點時間戳則:getTimeStart(1)
 * 	   7天前零點時間戳則:getTimeStart(7)
 * return: 返回一個時間戳
 ******************************************************/
function getTimeStart(n){
	var now=new Date(new Date().setHours(0, 0, 0, 0));
	now.setDate(now.getDate()-n);	
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	var date=now.getDate();
	//console.log(year+"年"+(month<10?('0'+month):month)+"月"+(date<10?('0'+date):date)+"日:"+now.getTime());
	return now.getTime();
}
/*****************************************************
 * 功能：獲取某天23:59:59的時間戳
 * params: n 以當天為基準參考數值，
 * 例如：獲取當天23:59:59時間戳則:getTimeEnd(0)
 * 	    昨天23:59:59時間戳則:getTimeEnd(1)
 * 	   7天前23:59:59時間戳則:getTimeEnd(7)
 * return: 返回一個時間戳
 ******************************************************/
function getTimeEnd(n){
	var now=new Date(new Date().setHours(23, 59, 59, 999));
	now.setDate(now.getDate()-n);	
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	var date=now.getDate();
	//console.log(year+"年"+(month<10?('0'+month):month)+"月"+(date<10?('0'+date):date)+"日:"+now.getTime());
	return now.getTime();
}

/**********************************
 * 功能：截取指定长度字符串
 * params:str 原字符串
 * 		  length 要截取的长度
 *********************************/
function strLong2short(str,length){
	if(str.length > length){
		return '<span title="'+str+'">'+str.substring(0,length)+'...</span>';
	}else{
		return str;
	}
}
