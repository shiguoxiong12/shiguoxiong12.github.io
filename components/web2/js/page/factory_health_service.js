/*接口定义*/
var getWorkerHealthServiceList = '/api/getWorkerHealthServiceList';// 獲取服務執行記錄列表
var deleteWorkerHealthServiceRecord = '/api/deleteWorkerHealthServiceRecord';// 刪除服務執行記錄
var editWorkerHealthServiceRecord = '/api/editWorkerHealthServiceRecord';// 添加/编辑一条劳工健康服务执行记录
var getWorkerHealthServiceRecord = '/api/getWorkerHealthServiceRecord';// 獲取一条劳工健康服务执行记录
/*全局变量*/
var pageSize = 1000; //一页显示数据条数
var WHListdata = {};// 劳工健康服务执行记录列表数据

$(function(){
	$('#hc1-menu2').addClass('active').siblings().removeClass('active');
	$("#SPApp").SPAContainer('init');//單頁面跳轉初始化
	$("#SPApp").SPAContainer('servlet',{page:"#block_1"});//執行記錄列表界面
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
 * 功能：頁面初始化
 *********************************/
function pageInit(){
	$('#executedate').dateSelect({
        language: "zh-TW",
        format: 'yyyy年mm月dd日',
        autoclose: true,
    });
	$('#executedate').on("changeDate",function(){
    	$('#executedate').dateSelect("removeError");
    }); 
    $("#starttime,#endtime").timeSelect();
    $("#starttime,#endtime").on("changeTime",function(){    	
    	$("#starttime,#endtime").timeSelect("removeError");
    });
	getWHSList(1);
}
/*******************************************************************************
 * 功能：获取劳工健康服务执行记录列表
 ******************************************************************************/
function getWHSList(pageIndex) {
	$("#records_block_1").customLoader("loading");
	$.ajax({
		type : 'post',
		url : getWorkerHealthServiceList,
		dataType : 'json',
		cache : false,
		async: false,
		data : {
			"did" : doctorCom.doctorId,
			"clubId":getClubId(),
			"pageIndex":pageIndex,
			"pageSize":pageSize
		},
		success : function(data) {
			if (data.status == "true") {
				WHListdata = data
				setWHSList(WHListdata.resultList);
			} else {
				console.error("获取数据失败");
			}
		},
		error : function(errMsg) {
			console.error("获取数据失败");
		}
	});
}
/*******************************************************************************
 * 功能：渲染服务记录列表
 * params:data 服务记录列表數據
 ******************************************************************************/
function setWHSList(data) {
	$("#record_list").html('');
	if(data.length == 0){
		$("#records_block_1").customLoader("nodata");
		$("#add_record_btn").hide();
	}else{
		$("#add_record_btn").show();           		       		
		var html='';
		for(var i =0;i<data.length;i++){
			html+='<div class="report-box">';
			html+='	<img onclick="showWHS('+data[i].recordId+')" class="report-file mb-4" src="/web2/img/file_icon.png">';
			html+='	<p class="mb-3">'+formatDate(parseInt(data[i].time),"yyyy/MM/dd")+'</p>';
			html+='	<div class="report-tool">';
			html+='		<i onclick="showWHS('+data[i].recordId+')" class="iconfont icon-icon-18 icon-btn mr-4"></i>';
			html+='		<i onclick="confrimDel('+data[i].recordId+')" class="iconfont icon-icon-17 icon-btn"></i>';
			html+='	</div>';
			html+='</div>';
		}	
		$("#record_list").html(html);      
    	$("#records_block_1").customLoader("loaded");                          	
	}    
}
/*******************************************************************************
 * 功能：打開服务记录編輯界面 
 * params: recordId 记录id
 ******************************************************************************/
function showWHS(recordId){
	resetRecord();
	if(recordId != null){
		getRecord(recordId);
		$("#savebtn").attr("onclick",'saveRecord("'+recordId+'")');
	}else{
		$("#savebtn").attr("onclick",'saveRecord("add")');
	}
	$("#SPApp").SPAContainer('servlet',{page:"#block_2"});//執行記錄編輯界面
}
/*******************************************************************************
 * 功能：獲取執行記錄詳情
 * params:data 執行紀錄的數據
 ******************************************************************************/
function getRecord(rid){
	$.ajax({
		type : 'post',
		url : getWorkerHealthServiceRecord,
		dataType : 'json',
		cache : false,
		async: false,
		data : {
			"did" : doctorCom.doctorId,
			"clubId":getClubId(),
			"recordId":rid,
		},
		success : function(data) {
			if (data.status == "true") {				
				setRecord(data);
			} else {
				console.error("獲取數據失敗");
			}
		},
		error : function(errMsg) {
			console.error("獲取數據失敗");
		}
	});
}
/*******************************************************************************
 * 功能：設置頁面輸入框顯示
 * params:data 執行紀錄的數據
 ******************************************************************************/
function setRecord(data){
	$("#maleManger").val(data.staff.manger.male);
	$("#femaleManger").val(data.staff.manger.female);			
	$("#maleOperator").val(data.staff.operator.male);
	$("#femaleOperator").val(data.staff.operator.female);								
	$("#normalJobNum").val(data.job.normal.num);								
	$("#specialType").val(data.job.special.content);
	$("#specialJobNum").val(data.job.special.num);				
	$("#workplace").val(data.workplace);
	$("#situation").val(data.situation);
	$("#advise").val(data.advise);
	$("#doctor").val(data.details.staff.doctor.name.toString());
	$("#nurse").val(data.details.staff.nurse.name.toString());
	$("#security").val(data.details.staff.security.name.toString());
	$("#others").val(data.details.staff.others.name.toString());
	$("#department").val(data.details.staff.others.department);
	$("#position").val(data.details.staff.others.position);
	$('#executedate').dateSelect("datepicker","setDate",new Date(parseInt(data.details.starttime)));
	$("#starttime").timeSelect("setTime",parseInt(data.details.starttime));
	$("#endtime").timeSelect("setTime",parseInt(data.details.endtime));
}
/*******************************************************************************
 * 功能：重置編輯頁面
 * params:
 ******************************************************************************/
function resetRecord(){
	$('#executedate').dateSelect("reset");
	$("#starttime").timeSelect("reset");
	$("#endtime").timeSelect("reset");
	$(".form-control").val('');
}
/*******************************************************************************
 * 功能：删除服务记录 
 * params: recordId 记录id
 ******************************************************************************/
function confrimDel(recordId){
	customAlert.confrim({
	   message:"您確定要移除該臨場健康服務執行紀錄麼？",
	   onconfrim: function(){
		   $.ajax({
				type : 'post',
				url : deleteWorkerHealthServiceRecord,
				dataType : 'json',
				cache : false,
				async: false,
				data : {
					"did" : doctorCom.doctorId,
					"clubId":getClubId(),
					"recordId":recordId
				},
				success : function(data) {
					if (data.result.status == "true") {
						toastr["success"]("刪除成功");						
						getWHSList(1);
					} else {
						console.error("获取数据失败");
					}
				},
				error : function(errMsg) {
					console.error("获取数据失败");
				}
			});
	   }
	}); 
	ga('send','event','臨場健康服務','buttonPress','臨場健康服務刪除',1);
}

/*******************************************************************************
 * 功能：儲存一條紀錄
 * params:
 ******************************************************************************/
function saveRecord(rid){	
	var executedate = $('#executedate').find("input").val();
	if(!executedate){
		$('#executedate').find("input").focus();
		$('#executedate').dateSelect("hasError",{message: "請選擇執行日期"});
		return false;
	};
	
	var hasManger = 1;
	var maleManger = $("#maleManger").val();
	var femaleManger = $("#femaleManger").val();
	if(maleManger==''&&femaleManger==''){
		hasManger = 0;
	}
	var hasOperator = 1;
	var maleOperator = $("#maleOperator").val();
	var femaleOperator = $("#femaleOperator").val();
	if(maleOperator==''&&femaleOperator==''){
		hasOperator = 0;
	}
	var hasNormalJob = 1;
	var normalJobNum = $("#normalJobNum").val();
	if(normalJobNum==''){
		hasNormalJob = 0;
	}
	var hasSpecialJob = 1
	var specialType = $("#specialType").val();
	var specialJobNum = $("#specialJobNum").val();
	if(specialJobNum == ''){
		hasSpecialJob = 0;
	}
	var workplace = $("#workplace").val();
	var situation = $("#situation").val();
	var advise = $("#advise").val();
	var doctor = $("#doctor").val();
	var nurse = $("#nurse").val();
	var security = $("#security").val();
	var others = $("#others").val();
	var department = $("#department").val();
	var position = $("#position").val();
	var starttime = $("#starttime").timeSelect("getMs",Date.parse($('#executedate').dateSelect("datepicker","getDate")));
    var endtime = $("#endtime").timeSelect("getMs",Date.parse($('#executedate').dateSelect("datepicker","getDate")));
    if(endtime < starttime){
    	 $("#endtime").find("input").focus();
    	 $("#endtime").timeSelect("hasError",{message:"結束時間不可早於開始時間"});
    	 return false;
    }
	$.ajax({
		type : 'post',
		url : editWorkerHealthServiceRecord,
		dataType : 'json',
		cache : false,
		async: false,
		data : {
			"did" : doctorCom.doctorId,
			"clubId":getClubId(),
			"recordId":rid,	
			"hasManger":hasManger,
			"maleManger":maleManger,
			"femaleManger":femaleManger,
			"hasOperator":hasOperator,
			"maleOperator":maleOperator,
			"femaleOperator":femaleOperator,
			"hasNormalJob":hasNormalJob,
			"normalJobNum":normalJobNum,
			"hasSpecialJob":hasSpecialJob,
			"specialType":specialType,
			"specialJobNum":specialJobNum,
			"workplace":workplace,
			"situation":situation,
			"advise":advise,
			"doctor":doctor,
			"nurse":nurse,
			"security":security,
			"others":others,
			"department":department,
			"position":position,
			"starttime":starttime,
			"endtime":endtime
		},
		success : function(data) {
			if (data.result.status == "true") {
				toastr["success"]("儲存成功");	
				getWHSList(1);
				$("#SPApp").SPAContainer('servlet',{page:"#block_1"});//執行記錄列表界面
			} else {
				console.error("儲存失敗");
			}
		},
		error : function(errMsg) {
			console.error("儲存失敗");
		}
	});
	ga('send','event','臨場健康服務','buttonPress','臨場健康服務新增',1);
}
