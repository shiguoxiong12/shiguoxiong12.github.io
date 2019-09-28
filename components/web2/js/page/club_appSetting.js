/*接口定义*/
var getClubGroups = '/api/getClubGroups';// 獲取社群分組列表
var getClubFnSetting = '/api/getClubFnSetting';// 獲取社群分組APP顯示設定
var saveClubFnSetting = '/api/saveClubFnSetting';// 儲存社群分組APP顯示設定
/*全局变量*/
var historyList=[];//歷史公告列表

$(function(){
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
	$(".div-scroll").slimScroll({
 		height: '100%',
 		color: '#c1c1c1',
 		wheelStep: 10
	 });
	
	getClubGroupList();
}
/**********************************
 * 功能：獲取社群分組列表數據
 *********************************/
var groupList=[];
function getClubGroupList(){
	$.ajax({
		type:'post',
		url: getClubGroups,
		data:{
			"did" : doctorCom.doctorId,
        	"clubId": getClubId()
		},
		dataType:'json',
		success:function(data){
			if(data.status=="true"){
				groupList = data.dataList;
				createAllMemberGroup();
				fillGroupList();
			}
		},
		error : function(errMsg) {		
			
		}
	});
}
/**********************************
 * 组装一个所有人的分组并加入到分组數據中
 * params:
 *********************************/
function createAllMemberGroup(){
	var allMember={};
	allMember.groupId = 'all';
	allMember.groupName = '所有分組';
	groupList.unshift(allMember);
}
/**********************************
 * 功能：初始化分組列表
 * param: 
 *********************************/
function fillGroupList(){
	var dataList = groupList;
	var html='';
	for(var i=0;i<dataList.length-1;i++){		
		html+='<li data-index="'+i+'">'+strLong2short(dataList[i].groupName,12)+'</li>';
	}
	$("#group_list ul").html(html);
	$("#group_list li").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		getGroupSetting($(this).attr('data-index'));
	});
	$("#group_list li:first").click();
}

/**********************************
 * 功能：獲取社群分組APP功能顯示設定
 * param: index 分組下標
 *********************************/
var appSetting = [];//分組app設定
function getGroupSetting(index){
	var groupId = groupList[parseInt(index)].groupId;
	$.ajax({
		type:'post',
		url: getClubFnSetting,
		data:{
			"did" : doctorCom.doctorId,
        	"clubId": getClubId(),
        	"role": sessionStorage.getItem('role'),
        	"groupId": groupId
		},
		dataType:'json',
		success:function(data){
			if(data.status=="true"){
				appSetting = data.dataList;
				fillGroupAppSetting(index);
			}
		}
	});
}
/**********************************
 * 功能：初始化社群分組APP功能顯示設定
 * param: index 分組下標
 *********************************/
function fillGroupAppSetting(index){
	var dataList = appSetting;
	var html='';
	for(var i in dataList){
		 html+='<tr>';
		 html+='   <td class="text-center" scope="row"><div class="fun-name">'+dataList[i].name+'</div></td>';
		 html+='    <td class="text-center">';
		 html+='  	<div class="custom-control custom-switch">';
		 if(dataList[i].open=='1'){
			 html+='<input type="checkbox" class="custom-control-input" name="auth" data-index="'+i+'" id="checkbox'+i+'" checked>';
		 }else{
			 html+='<input type="checkbox" class="custom-control-input" name="auth" data-index="'+i+'" id="checkbox'+i+'">';
		 }		 
		 html+='          <label class="custom-control-label" for="checkbox'+i+'">&nbsp;</label>';
		 html+='      </div>';
		 html+='   </td>	 ';                                                                            
		 html+='</tr> '; 	 				   
	}
	$("#fun_list").html(html);
	$("input[name='auth']").click(function(){
		var dataIndex = parseInt($(this).attr('data-index'));
		if($(this).is(':checked')){
			appSetting[dataIndex].open='1';
		}else{
			appSetting[dataIndex].open='0';
		}
	});
	$("#cancleSettingBtn").attr("onclick","getGroupSetting("+index+")");
	$("#saveSettingBtn").attr("onclick","saveAppSetting("+index+")");
}

/**********************************
 * 功能：儲存社群分組APP功能顯示設定
 * param: index 分組下標
 *********************************/
function saveAppSetting(index){
	var groupSetting=[];
	for(var i in appSetting){
		var obj = {};
		obj.code = appSetting[i].code;
		obj.open = appSetting[i].open;
		groupSetting.push(obj);
	}
	$.ajax({
		type:'post',
		url: saveClubFnSetting,
		data:{
			"did" : doctorCom.doctorId,
        	"clubId": getClubId(),
        	"role": sessionStorage.getItem('role'),
        	"groupId": groupList[parseInt(index)].groupId,
        	"setting": JSON.stringify(groupSetting)   	
		},
		dataType:'json',
		success:function(data){
			if(data.status=="true"){
				toastr["success"]("儲存成功");
			}
		}
	});
	ga('send','event','APP客製服務設定','buttonPress','APP客製服務設定',1);
}