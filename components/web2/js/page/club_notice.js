/*接口定义*/
var editClubNotice='/api/editClubNotice';//新增/編輯社群公告  
var getHistoryClubNotice='/api/getHistoryClubNotice';//获取歷史公告列表
var deleteClubNotice='/doctor/deleteClubNotice';//删除公告
/*全局变量*/
var pageSize = 6;// 一頁顯示多少則紀錄
var historyList=[];//歷史公告列表

$(function(){
	$("#SPApp").SPAContainer('init');//單頁面跳轉初始化
	$("#SPApp").SPAContainer('servlet',{page:"#block_1"});//轉到員工列表界面
	pageInit();
	toastrInit();
});
/**********************************
 * 提示框初始化
 *********************************/
function toastrInit() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}
/**********************************
 * 頁面初始化
 *********************************/
function pageInit(){
	$("#notice_input").multilineInput({
		 required: {message: "請輸入公告内容"},
		 maxlength: {num: 150,message: "超出輸入字数"},
		 placement: "right-bottom", //錯誤提示顯示位置
		 rows:10,
		 fixed: true,  //固定顯示最大行數 
		 placeholder: "請輸入公告內容"
	 });
	//初始化分頁導航
    $("#pagination_bar").customPagenav('init');
}
/********************************************** 
 * 功能：發布一則公告
 * params:
 **********************************************/
function addNewNotice(){
	var content = $("#notice_input").multilineInput('val');
	var showSync;
	if($("#addShowSync").is(':checked')){
		showSync='1';
	}else{
		showSync='0';
	}
	if($("#notice_input").multilineInput("validate")){
		$.ajax({
	        type:'post',
	        url: editClubNotice,
	        dataType:'json',
	        cache: false,
	        data:{
	            "did" : doctorCom.doctorId,             
				"clubId": getClubId(),		
				"noticeId": 'add',
				"content":content,
				"showSync":showSync
	        },
	        success:function(data){
	            if(data.status == "true"){                  
	            	toastr["success"]("發布公告成功");   	            	
	            }else{
	            	console.error("發布公告失敗")              
	            }
	        },
	        error:function(errMsg){                
	        	console.error("發布公告失敗")   
	        }
	    });
	}
}
/********************************************** 
 * 功能：取消发布
 * params:
 **********************************************/
function cancleNotice(){
	 $("#notice_input").multilineInput('reset');
	 $("#addShowSync").prop("checked",false);
}
/**********************************
 *  功能：打開查看歷史公告頁面
 *  param：
 *********************************/
function showHistory(){
	getHistoryNotcie(1);
	$("#SPApp").SPAContainer('servlet',{page:"#block_2"});
}
/**********************************
 * 功能：獲取歷史公告列表數據
 * params:	pageIndex 頁序
 *********************************/
function getHistoryNotcie(pageIndex){
	$("#records_block_2").customLoader("loading",function(){
		$.ajax({
	        type:'post',
	        url:getHistoryClubNotice,
	        dataType:'json',
	        cache: false,
	        data:{
	             "did" : doctorCom.doctorId,             
				 "clubId": getClubId(),		
				 "pageIndex":pageIndex,
				 "pageSize": pageSize
	        },
	        success:function(data){
	            if(data.status == "true"){  
	            	if(data.total==0){
	            		$("#records_block_2").customLoader("nodata");
	            	}else{
	            		historyList = data;
		            	setHistoryNotice(pageIndex);
		            	$("#pagination_bar").customPagenav('changePage',{
		         		   funcName: 'getHistoryNotcie',
		         		   pageIndex: pageIndex,
		         		   pageSize: pageSize,
		         		   total: parseInt(data.total)
		         	   });
	            	}	            	
	            }else{
	           	 console.error("獲取數據失敗")                  
	            }
	        },
	        error:function(errMsg){                
	            console.error("獲取數據失敗")
	        }
	    });
	});
}
/**********************************
 * 功能：渲染歷史公告列表
 * params:	pageIndex 頁序
 *********************************/
function setHistoryNotice(pageIndex){
	var html='';
	var dataList = historyList.dataList;
	//頁面沒有數據時返回上一頁
	if(dataList.length==0){
		getHistoryNotcie(parseInt(pageIndex-1));
		return false;
	}
	for(var i in dataList){
		html+='<div class="notcie-record">';           					 		
		html+='	<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary">';
		html+='    <input type="checkbox" class="custom-control-input notice-checkbox" id="notice_'+dataList[i].id+'" value="'+dataList[i].id+'">';	
		html+='    <label class="custom-control-label" for="notice_'+dataList[i].id+'"></label>';	                                  
		html+='</div>';
		html+='	<div class="ml-3 w-100">';
		html+='		<div class="notice-time">發布於&nbsp;&nbsp;'+formatDate(parseInt(dataList[i].pubdate),'yyyy/MM/d   HH:mm')+'</div>';
		html+='		<div onclick="showNoticeDetail('+i+')" class="notice-time-content">'+dataList[i].content+'</div>';
		html+='	</div>';
		html+='</div>';
	}
	$("#total_num").html(historyList.total);
	$("#history_record").html(html);
	$("#records_block_2").customLoader("loaded")
}
function showNoticeDetail(index){
	$("#notice_detail").html(historyList.dataList[index].content);
	$("#notice_detail_modal").modal("show");
}
/**********************************
 * 功能：移除選中的公告
 * params:	
 *********************************/
function delCheckedNotice(){
	var temp = []
	$(".notice-checkbox:checked").each(function(){
		temp.push($(this).val());
	});
	if(temp.length==0){
		toastr["warning"]("請至少選擇一則公告");
	}else{
		customAlert.confrim({
		   message:"確定要移除這"+temp.length+"則社群公告嗎？",
		   onconfrim: function(){
			   delNotices(temp.join(","));
		   }
	   }); 
	}
}
/**********************************
 * 功能：移除所有的公告
 * params:	
 *********************************/
function delAllNotice(){
	customAlert.confrim({
	   message:"確定要移除全部社群公告嗎？",
	   onconfrim: function(){
		   delNotices("all");
	   }
   }); 
}
/**********************************
 * 功能：渲染歷史公告列表
 * params:	ids 要刪除的報告Id
 *********************************/
function delNotices(ids){
	$.ajax({
        type:'post',
        url:deleteClubNotice,
        dataType:'json',
        cache: false,
        data:{
             "did" : doctorCom.doctorId,             
			 "clubId": getClubId(),		
			 "noticeIds":ids
        },
        success:function(data){
            if(data.status == "true"){    
            	toastr["success"]("移除成功");
            	getHistoryNotcie($("#pagination_bar").customPagenav("curPage"));     	
            }else{
           	 console.error("獲取數據失敗")                  
            }
        },
        error:function(errMsg){                
            console.error("獲取數據失敗")
        }
    });
}