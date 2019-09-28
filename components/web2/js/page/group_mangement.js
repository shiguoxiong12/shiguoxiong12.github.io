/*接口定义*/
var getGroupList = '/api/getGroupList'; //获取分组信息列表
var searchClubMember = '/api/searchClubMember'; //搜索社群內成員
var screenClubMember = '/api/screenClubMember'; //根據項目篩選社群內用戶
var editGroupInfo = '/api/editGroupInfo'; //添加/编辑社群的分组信息
var deleteGroup = '/api/delGroupInfo'; //删除社群的分组信息
var getUserByConditions = '/doctor/getUserByConditions';//根據條件篩選分組成員
var getGroupSites = '/doctor/getGroupSites';//获取分组站别设定
var setGroupSites = '/doctor/setGroupSites';//保存分组站别设定

/*全局变量*/
var grouplist = []; //分组列表數據
var allMember={};//所有会员
var punit = '', sunit = ''; //单位设定：血压，血糖
var pageSize = 10; //一页显示数据条数
var conditions = []; //量測項篩選條件
var range = '0'; //篩選范围(0：最近一笔，1：近30天均值)
var addMemberIds = [];//要填加分组成员
var delMemberIds =[];//要删除分组成员

$(function(){
	$('#hc1-menu1').addClass('active').siblings().removeClass('active');
	$("#SPApp").SPAContainer('init');//單頁面跳轉初始化
	$("#SPApp").SPAContainer('servlet',{page:"#block_1"});//轉到分組列表界面
	pageInit();
	toastrInit();
	unitInit();
	PDCAitemInit();
	getGroupListData(true);
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
	//美化div滾動條
	$(".div-scroll").slimScroll({
 		height: '100%',
 		color: '#c1c1c1',
 		wheelStep: 10
	 });
	//初始化分頁導航
    $("#pagination_bar").customPagenav('init');
    
    //輸入校驗初始化
    $("#group_name_edit").customValidator({
    	required:{message:"請填寫分組名稱"},
    	maxlength:{message: "",num:20}
	});
    //分組顯示設定初始化
    $('input[name="show_setting"]').click(function(){
		if($(this).val()=='0'){
			$('input[name="see_setting"]').attr('disabled','true');
			$('input[name="see_setting"]').prop("checked",false);
		}else{
			$('input[name="see_setting"]').removeAttr('disabled');
			$('input[name="see_setting"][value="1"]').prop("checked",true); 
		}
	});
    //會員搜索初始化
    $("#group_select").change(function(e){
    	getConditonSearch();
    });
    $("#member_search").searchInput("init",{ 
		onclear: function(){
			getConditonSearch();
		},
		onsearch: function(){
			getConditonSearch();
		},
		onenter:function(){
			getConditonSearch();
		}
	});
   //增加一個篩選條件
	$("#add_one_condition").click(function(e){  
    	if($(".condition-block.hidden").length==1){
    		$(this).hide();
    	}
    	$(".condition-block.hidden").eq(0).removeClass("hidden");
    	e.stopPropagation();
    });
	//刪除篩選條件
    $(".condition-block .icon-icon-17").click(function(e){
    	$(this).parent().addClass('hidden');
    	var index = $(this).attr("data-index");
    	$("#condition_item"+index).customSelect('reset');
		$("#condition_item_min"+index).val('');
		$("#condition_item_max"+index).val('');
		$("#condition_unit"+index).html('--');
		$("#add_one_condition").show();
		e.stopPropagation();
    });
    //設置滾動加載
    scrollLoding('user_choices');
    //站別設定頁面初始化
    sitesSettingInit();
}
/**********************************
 *  功能：获取用户设定的血压血糖单位
 *  param：
 *********************************/
function unitInit(){
	$.ajax({
		type:'get',
		url:'/api/getUnitSetting',
		async:false,
		data:{
			"did" : doctorCom.doctorId,
			"clubId": getClubId()
		},
		dataType:'json',
		success:function(data){
			if(data.status=="true"){
				punit = data.punit=='0'?'mmHg':'kPa';
				sunit = data.sunit=='0'?'mg/dL':'mmol/L'				
			}
		}
	});
}
/**********************************
 * 功能：初始化PDCA項目選項并美化下拉選擇框
 *********************************/
function PDCAitemInit(){
	var items = PDCAType;
	for (var i = 0; i < items.length; i++) {
		if(items[i][1] !="null"){			
			$(".pdca-select").append('<option value="' + items[i][0] + '">' + items[i][1]+ '</option>');
		}	
	}
	$(".pdca-select").customSelect("init");
	for(var i=1;i<4;i++){
		$("#condition_item"+i).change(function() {			
			if($(this).val()){
				var itemIndex = parseInt($(this).val()) - 100;					
				$("#condition_unit"+$(this).attr("data-index")).html(unitChange(itemIndex));												
			}else{
				$("#condition_unit"+$(this).attr("data-index")).html('');	
			}													
		});
	}	
	$(".condition-value").keyup(function (){
		$(this).val($(this).val().replace(/[^\d.]/g,''));
	});
}
/**********************************
 * 功能：滚动加载所有会员
 * params: elemId 需进行滚动加载的元素Id
 *********************************/
function scrollLoding(elemId){
	var divscroll = document.getElementById(elemId);
    function divScroll() {
        var wholeHeight = divscroll.scrollHeight;
        var scrollTop = divscroll.scrollTop;
        var divHeight = divscroll.clientHeight;
        if(scrollTop + divHeight >= wholeHeight){          	
        	$("#"+elemId).find(".user-checkbox.hidden:lt(15)").removeClass("hidden");
        }
        if(scrollTop == 0){
        	//console.log('滚动到头部了！');
        }
    }
    divscroll.onscroll = divScroll;
}
/**************************************
 * 功能：部分數據需要根據設定轉換單位
 * params: itemindex  PDCAType下标
 ***************************************/
function unitChange(itemIndex){
	if(PDCAType[itemIndex][2]=="1"&&PDCAType[itemIndex][0]!="120"){
		return punit;
	}else if(PDCAType[itemIndex][2]=="2"){
		return sunit;
	}else{
		return PDCAType[itemIndex][3];
	}
}

/**********************************
 * 功能：獲取分组信息
 * params: flag 是否為初次加載
 *********************************/
var role = 0; //用戶角色0：系統管理員，社群健康管理員，1：組內健康管理員
function getGroupListData(flag){
	$("#group_list").customLoader("loading");
	$.ajax({
        type:'post',
        url:getGroupList,
        dataType:'json',
        cache: false,
        data:{
        	"did" : doctorCom.doctorId,
        	"clubId": getClubId()
        },
        success:function(data){
            if(data.status == "true"){            
            	grouplist = data.grouplist;
            	if(flag){ //初次加載
        			createallMemberList();  
                	preloadUserChioces();
        		}else{
        			grouplist.unshift(allMember);
        		} 
            	//初始化分组select
            	$("#group_select").empty();
            	$("#group_select").append('<option value="">所有分組</option>');
            	for (var i = 1; i < grouplist.length; i++) {               			
            		$("#group_select").append('<option value="' +grouplist[i].groupId + '">' + grouplist[i].groupName + '</option>');                			
            	}
            	$("#group_select").customSelect('destory');
            	$("#group_select").customSelect({placeholder:"所有分組",width:"auto",height:"200"});            
            	if(grouplist[grouplist.length-1].groupId!="0"){
            		role = 1;
            	}
            	if(grouplist.length<=(2-role)){
            		$("#group_list").customLoader("nodata");
            		$("#add_group_btn").hide();
            	}else{
            		$("#add_group_btn").show();           		       		
                	fillGroupList($("#pagination_bar").customPagenav("curPage"));       
                	$("#group_list").customLoader("loaded");                          	
            	}           	
            }else{
            	console.error("获取数据失败，请稍后尝试");
            }            
        },
        error:function(errMsg){         
            console.error("加载数据失败")
        }
    }); 
}
/**********************************
 * 组装一个所有人的分组并加入到分组信息中
 * params:
 *********************************/
function createallMemberList(){
	allMember.groupId = 'all';
	allMember.groupName = '所有分組';
	var datalist = new Array();
	for(var i=0;i<grouplist.length;i++){ 
		var memberlist = grouplist[i].memberlist;
		for(var j=0;j<memberlist.length;j++){
			if(findElem(datalist,'id',memberlist[j].id) < 0){
				datalist.push(memberlist[j]);
			}			
		}
	}
	allMember.memberlist = datalist;	
	grouplist.unshift(allMember);
}
/*******************************************************************************
 * 功能：按属性值查找对象在数组中的下标
 * params:  arrayToSearch 要查找的数组
 * 			attr 要查找的属性
 * 			val  要查找的值
 ******************************************************************************/
function findElem(arrayToSearch,attr,val){
    for (var i=0;i<arrayToSearch.length;i++){
        if(arrayToSearch[i][attr]==val){
            return i;
        }
    }
    return -1;
}
/*******************************************************************************
 * 功能：填充分組列表數據
 * params:  
 ******************************************************************************/
function fillGroupList(pageIndex){
	role = parseInt(role);
	var data = grouplist;
	var html = '';
	$('#group_table tbody').find('tr:not(.template)').remove();
	//最後一頁沒數據則返回上一頁
	if(((pageIndex-1)*pageSize+1 > data.length-2+role) && pageIndex != 1){
		fillGroupList(pageIndex-1);
		return false;
	}
	for(var i=1;i<pageSize+1;i++){
		var index = i+(pageIndex-1)*pageSize;
		if(index<data.length-1+role){
			var $tr=$('#group_table').find('.template').clone().removeClass('template');
			$tr.find('td').eq(0).html(strLong2short(data[index].groupName,8));
			$tr.find('td').eq(1).html(data[index].memberlist.length);
			$tr.find('.edit-btn').attr('onclick','toEditGroupView('+index+')');
			$tr.find('.del-btn').attr('onclick','delGroup('+data[index].groupId+')');
			$tr.find('.sites-btn').attr('onclick','toSitesSetting('+index+')');
			$("#group_table tbody").append($tr);			
		}		
	}
	$("#group_num").html(data.length-2+role);
	$("#pagination_bar").customPagenav('changePage',{
	   funcName: 'fillGroupList',
	   pageIndex: pageIndex,
	   pageSize: pageSize,
	   total: grouplist.length-2+role
    });
}
/*******************************************************************************
 * 功能：顯示分組詳情(廢棄：改为直接去编辑页面)
 * params:  
 ******************************************************************************/
function showGroupDetail(index){
	$(".setting-item-show").hide();
	$("#SPApp").SPAContainer('servlet',{page:"#block_2"});//轉到分組詳情界面
	var data = grouplist[index];
	var isShow = data.isShow;
	var canSee = data.canSee;
	$("#to_edit_group").attr("onclick",'toEditGroupView('+index+')');
	$("#group_name_show").val(data.groupName);
	$("#show_"+isShow).show();
	$("#see_"+canSee).show();
	var html = '';
	var memberlist = data.memberlist;
	$("#group_member_num").html(memberlist.length);
	for(var i in memberlist){
		html+='<div class="selected-user">';
		html+='	<img class="user-avatar" src="'+memberlist[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'">';
		html+='	<span class="user-name" title="'+memberlist[i].name+'">'+memberlist[i].name+'</span>';                    	 					
		html+='</div>';	
	}
	$("#member-box").html(html);
}
/**********************************************
 * 功能：删除分组信息
 * params:groupId  分组ID
 **********************************************/
function delGroup(groupId){
	customAlert.confrim({
		message: "確定要刪除該分組嗎？",
        onconfrim: function() {
        	$.ajax({
                type:'post',
                url:deleteGroup,
                dataType:'json',
                cache: false,
                data:{    
                    "did" : doctorCom.doctorId,
                    "clubId": getClubId(),
        			"groupId":groupId
                },
                success:function(data){
                	if(data.result.status=="true"){   
                	 getGroupListData();                	 
                 	 toastr["success"]("分組刪除成功");      	 
                   }else{
                   	toastr["error"](data.result.message);
                   }
                },
                error:function(errMsg){        
                    console.error("刪除失敗");	         
                }
            });
        }
	})
}

/********************************************** 
 * 功能：预先加載所有成員已選成員中,先隐藏,提升页面打开速度
 * 	    便於後續用隱藏/顯示 來表示刪除和增加
 * params:
 **********************************************/
function preloadUserChioces(){
	var data = allMember.memberlist;
	var selected=''
	for(var i=0;i<data.length;i++){			
		selected+='<div data-user="'+data[i].id+'" id="userSelected-'+data[i].id+'" class="user-checkbox hidden">';  			                  	 							           	                   									                  	 					     	  
		selected+='	<img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'"> ';          	  
		selected+='	<span>'+strLong2short(data[i].name,12)+'</span> ';
		selected+='	<i onclick="delUser('+data[i].id+')" class="fa-pull-right	iconfont icon-icon-17"></i> ';	                  	 							
		selected+='</div>';
	}
	$("#user_selected").html(selected);
}
/********************************************** 
 * 功能：添加/删除分组成员
 * params:
 **********************************************/
function toggleUser(obj){
	var userId = $(obj).val();
	if($(obj).is(':checked')) {
		addUser(userId);
	}else{
		delUser(userId);
	}
}
/********************************************** 
 * 功能：增加分组成员
 * params:
 **********************************************/
function addUser(userId){
	$("#userSelected-"+userId).removeClass("hidden");
	$("#selectUser-"+userId).prop("checked",true);
	$("#userChoice-"+userId).addClass("selected");
	$("#user_choices").find(".user-checkbox.hidden:lt(1)").removeClass("hidden");
	$("#choices_num").html(parseInt($("#choices_num").html())-1);
	$("#selected_num").html(parseInt($("#selected_num").html())+1);
    if(jQuery.inArray(userId,delMemberIds) == -1){
		addMemberIds.push(userId);
	}else{
		delMemberIds.splice(jQuery.inArray(userId,delMemberIds), 1);
	}
}/********************************************** 
 * 功能：删除分组成员
 * params:
 **********************************************/
function delUser(userId){
	$("#userSelected-"+userId).addClass("hidden");
	if($("#selectUser-"+userId).length>0){
		$("#selectUser-"+userId).prop("checked",false);
		$("#userChoice-"+userId).removeClass("selected");
		$("#choices_num").html(parseInt($("#choices_num").html())+1);
	}
	$("#selected_num").html(parseInt($("#selected_num").html())-1);
	if(jQuery.inArray(userId,addMemberIds) == -1){
		delMemberIds.push(userId);
	}else{
		addMemberIds.splice(jQuery.inArray(userId,addMemberIds), 1);
	}
}
/*******************************************************************************
 * 功能：增加全部待選會員
 * params: 
 ******************************************************************************/
function addAllUser(){
	customLoading.show(function(){
		$("#user_choices").find("input:not(:checked)").each(function(){
			addUser($(this).val());
		});
		customLoading.hide();
	});
}
/*******************************************************************************
 * 功能：刪除全部已選待選會員
 * params: 
 ******************************************************************************/
function removeAllUser(){
	customLoading.show(function(){
		$("#user_selected").find(".user-checkbox:not(.hidden)").each(function(){
			delUser($(this).attr("data-user"));
			customLoading.hide();
		});
	});
}
/*******************************************************************************
 * 功能：打開編輯分組界面
 * params: index 分組下標  
 ******************************************************************************/
function toEditGroupView(index){
	var data = grouplist[index];
	groupEditViewReset();
	$("#group_edit_title").html("查看及編輯分組");
	$("#saveGroup").attr("onclick",'saveGroup('+data.groupId+')');
	$("#group_name_edit").val(data.groupName);
	var memberlist = data.memberlist;
	$("#choices_num").html(allMember.memberlist.length-memberlist.length);
	$("#selected_num").html(memberlist.length);
	for(var i in memberlist){
		$("#selectUser-"+memberlist[i].id).prop("checked",true);
		$("#userChoice-"+memberlist[i].id).addClass("selected");
		$("#userSelected-"+memberlist[i].id).removeClass("hidden");
	}
	resetAllUser();
	if(data.reviewed){
		$('input[name="review_setting"][value="'+data.reviewed+'"]').prop("checked",true);
	}	
	$('input[name="show_setting"][value="'+data.isShow+'"]').prop("checked",true);
	$('input[name="see_setting"][value="'+data.canSee+'"]').prop("checked",true);
	if(data.canSee == ""){
		$('input[name="see_setting"][value="1"]').prop("checked",true); 
	}
	if(data.isShow == "0"){
		$('input[name="show_setting"][value="0"]').click(); 
	}else{
		$('input[name="see_setting"]').removeAttr('disabled');
	}
	$("#SPApp").SPAContainer('servlet',{page:"#block_3"});//轉到編輯分組界面
}
/*******************************************************************************
 * 功能：打開新增分組界面
 * params:  
 ******************************************************************************/
function toAddGroupView(){
	groupEditViewReset();
	resetAllUser();
	$("#group_edit_title").html("新增分組");
	$("#saveGroup").attr("onclick",'saveGroup("add")');
	$("#SPApp").SPAContainer('servlet',{page:"#block_3"});//轉到新增分組界面
}
/*******************************************************************************
 * 功能：重置新增/编辑分组页面为初始状态
 * params:  
 ******************************************************************************/
function groupEditViewReset(){
	$("#group_name_edit").customValidator('reset');
	resetConditions();//重置筛选条件
	$("#member_search").val('');
	$("#group_select").customSelect("reset");
	$('input[name="show_setting"]').eq(0).prop("checked",true);
	$('input[name="see_setting"]').eq(1).prop("checked",true);
	$("#choices_num").html(allMember.memberlist.length);
	$("#selected_num").html('0');
	$("#user_selected").find(".user-checkbox").addClass("hidden");//清除已选会员
	//重置需要添加和刪除的用戶Ids
	addMemberIds.splice(0,addMemberIds.length);
	delMemberIds.splice(0,delMemberIds.length);
}
/*******************************************************************************
 * 功能：打開篩選條件編輯modal
 * params:  
 ******************************************************************************/
function showConditionModal(){
	$(".condition-value").removeClass("hasError");
	$(".condition-tip div").removeClass("hasError");			
	for(var c=0;c<3;c++){
		var index = parseInt(c)+1;
		if(c<conditions.length){			
			$("#condition_item"+index).customSelect('val',conditions[c].type);
			$("#condition_item_min"+index).val(conditions[c].min);
			$("#condition_item_max"+index).val(conditions[c].max);
			$("#condition_unit"+index).html(conditions[c].unitText);
			$(".condition-block").eq(index).removeClass('hidden');
		}else{
			$("#condition_item"+index).customSelect('reset');
			$("#condition_item_min"+index).val('');
			$("#condition_item_max"+index).val('');
			$("#condition_unit"+index).html('--');
			if(c!=0){
				$(".condition-block").eq(index).addClass('hidden');
			}		
		}	
	}
	if(conditions.length<3){
		$("#add_one_condition").show();
	}else{
		$("#add_one_condition").hide();
	}
	$("#conditions_modal").modal('show');
}
/*******************************************************************************
 * 功能：重置篩選條件
 * params:  
 ******************************************************************************/
function resetConditions(){
	conditions = [];
	showCondition();
}
/********************************************** 
 * 功能：根據自訂篩選條件篩選
 * params:
 **********************************************/
function conditionSearch(){
	if(setConditions()){
		showCondition();
		getConditonSearch();
		$("#conditions_modal").modal('hide');
	}else{
		console.log("有錯誤:"+JSON.stringify(conditions));
	}
} 
/********************************************** 
 * 功能：顯示設置好的的篩選條件
 * params:
 **********************************************/
function showCondition(){
	var html = '';	
	for(var c in conditions){
		var itemIndex = parseInt(conditions[c].type - 100);
		html += '<div class="condition-box mb-3">';                  	 				              	 					
		html += '	<span class="condition-content">';
		if(conditions[c].min && conditions[c].max){	
			html += PDCAType[itemIndex][1]+'：'+conditions[c].min+'-'+conditions[c].max+' '+conditions[c].unitText+'</span>';
		}else if(conditions[c].min && !conditions[c].max){
			html += PDCAType[itemIndex][1]+'：≥ '+conditions[c].min+' '+conditions[c].unitText+'</span>';
		}else{
			html += PDCAType[itemIndex][1]+'：≤ '+conditions[c].max+' '+conditions[c].unitText+'</span>';
		}
		html += '	<span class="close" onclick="delcondition(' + c + ')">×</span> ';                   	 					                   	 				
		html += '</div>';				
	}
	$(".condition-box").remove();
	$(html).insertAfter("#show_condition");	
}
/********************************************** 
 * 功能：删除設置的篩選條件
 * params: index 条件序号
 **********************************************/
function delcondition(index){
	conditions.splice(index, 1);
	showCondition();
	getConditonSearch();
}
/*******************************************************************************
 * 功能：設置篩選條件
 * params:  
 ******************************************************************************/
function setConditions(){
	 var temp = []; 
	 for(var i=1;i<4;i++){
		var PDCAType = $("#condition_item"+i).val();
		var PDCAName = $("#condition_item"+i).find("option:selected").text();
		var itemMin = $("#condition_item_min"+i).val();
		var itemMax = $("#condition_item_max"+i).val();
		if(PDCAType || itemMin || itemMax){
			if(!PDCAType){
				toastr["warning"]('請選擇篩第'+chinanum(i)+'個量測項目');
				$("#condition_item"+i).parent().addClass("hasError");
				return false;
			}
			if(!itemMin && !itemMax){
				toastr["warning"](PDCAName+" 的最小值和最大值請至少填寫一項");
				$("#condition_item_min"+i).addClass("hasError");
				$("#condition_item_max"+i).addClass("hasError");
				$("#condition_tip"+i).addClass("hasError");				
				return false;
			}
			if(itemMin && itemMax){
				if(parseFloat(itemMin) > parseFloat(itemMax)){
					toastr["warning"](PDCAName+" 的最大值應不小於最小值");
					$("#condition_item_max"+i).addClass("hasError");
					return false;
				}				
			}
			var itemIndex = parseInt(PDCAType) - 100;
			var unitText = unitChange(itemIndex);
			var itemUnit = conditionUnit(itemIndex);			
			
			var condition = {};
			condition.type = PDCAType;
			condition.min = itemMin;
			condition.max = itemMax;
			condition.unit = itemUnit;
			condition.unitText = unitText;		
			temp.push(condition);
		}
	}
	$(".condition-block").find(".hasError").removeClass("hasError");
	if(temp.length>0){
		conditions = temp;
		range =  $('input[name="data_range"]:checked').val();
		$("#add-list-condition").modal('hide');	
		return true;
	}else{
		toastr["warning"]("請至少填寫一個篩選項目");
		return false;
	}	
}

/**************************************
 * 功能：判斷當前項目需使用老單位還是新單位進行篩選
 * params: itemindex  PDCAType下标
 ***************************************/
function conditionUnit(itemIndex){
	if(PDCAType[itemIndex][2]=="1"){
		return punit=='mmHg'?'0':'1';
	}else if(PDCAType[itemIndex][2]=="2"){
		return sunit=='mg/dL'?'0':'1';
	}else{
		return '0';
	}
}
/**************************************
 * 功能：根据筛选条件搜索用户
 * params:   
 ***************************************/
function getConditonSearch(){
	var groupId = $("#group_select").val();
	var keyword = $("#member_search").val();
	if(conditions.length==0){
    	range = '';
    }
	if(!groupId && !keyword && conditions.length==0){
		 resetAllUser(); //沒有條件直接重置為所有會員
	}else{
		$("#choice_box").customLoader("loading",function(){
			$.ajax({
		        type:'post',
		        url:getUserByConditions,
		        dataType:'json',
		        cache: false,	     
		        data:{         
		            "did" : doctorCom.doctorId,
					"clubId": getClubId(),
					"groupId": groupId==''?"all":groupId,
					"keyword":keyword,
					"conditions": JSON.stringify(conditions),
					"range": range
		        },
		        success:function(data){
		            if(data['status'] == "true"){
		            	fillConditionSearch(data.dataList);
		            }else if(data['status'] == "false"){
		            	console.error(data['message']);		    
		            }
		        },
		        error:function(errMsg){         
		            console.error("加载数据失败")	          
		            var memberlist = grouplist[$("#group_select ").get(0).selectedIndex].memberlist;
		            fillConditionSearch(memberlist);
		        }
		    });
		});
	}
}
/**************************************
 * 功能：將待選框重置為所有會員
 * params:   
 ***************************************/
function resetAllUser(){
	var data = allMember.memberlist;
	$("#choice_box").customLoader("loading",function(){
		setTimeout(function(){ fillConditionSearch(data); }, 1000);
	});
}
/**************************************
 * 功能：填充篩選結果
 * params:   
 ***************************************/
function fillConditionSearch(data){
	if(data.length==0){
		$("#choice_box").customLoader("nodata");
		$("#choices_num").html('0');
		$("#user_choices").html('');
	}else{
		var choices='';
		for(var i=0,j=0;i<data.length;i++){		
			if($("#userSelected-"+data[i].id).hasClass("hidden")){
				//提升页面打开速度，待选会员先显示前15个，后续先隐藏待滚动加载
				if(j<15){
					choices+='<div id="userChoice-'+data[i].id+'" class="user-checkbox">';  
					j++;
				}else{
					choices+='<div id="userChoice-'+data[i].id+'" class="user-checkbox hidden">';  
				}				
			}else{
				choices+='<div id="userChoice-'+data[i].id+'" class="user-checkbox selected">';  
			}					
			choices+='	<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary"> ';       
			if($("#userSelected-"+data[i].id).hasClass("hidden")){
				choices+='<input type="checkbox" id="selectUser-'+data[i].id+'" onclick="toggleUser(this)" class="custom-control-input" value="'+data[i].id+'">';             
			}else{
				choices+='<input type="checkbox" checked id="selectUser-'+data[i].id+'" onclick="toggleUser(this)" class="custom-control-input" value="'+data[i].id+'">';             
			}	
			choices+='		<label class="custom-control-label" for="selectUser-'+data[i].id+'"> ';         	  
			choices+='			<img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'"> ';          	  
			if(data[i].name){
				choices+='			<span>'+strLong2short(data[i].name,12)+'</span>'; 
			}else{
				choices+='			<span>'+strLong2short(data[i].nickName,12)+'</span>';     
			}        
			choices+='		</label> ';       
			choices+='	</div> ';	
			choices+='</div>';	
		}
		$("#user_choices").html(choices);
		$("#choices_num").html($("#user_choices").find("input:not(:checked)").length);
		$("#choice_box").customLoader("loaded");
	}
}
/********************************************** 
 * 功能：儲存编辑好的分组
 * params:groupId 分组id
 **********************************************/
function saveGroup(groupId){
	if(!$("#group_name_edit").customValidator('validate')){return false;}
	var groupName = $("#group_name_edit").val();
	var isShow = $('input[name="show_setting"]:checked').val();
	var canSee;
	if(isShow == "0"){
		 canSee = "9";
	}else{
		 canSee = $('input[name="see_setting"]:checked').val(); 
	}
	var reviewed = '0';
	if($('input[name="review_setting"]').length>0){
		$('input[name="review_setting"]:checked').val();
	}	
	$.ajax({
         type:'post',
         url:editGroupInfo,
         dataType:'json',
         cache: false,
         data:{      
             "did" : doctorCom.doctorId,
			 "clubId": getClubId(),
			 "groupId":groupId,
			 "groupName":groupName,
			 "addMemberIds":addMemberIds.toString(),
			 "delMemberIds":delMemberIds.toString(),
			 "isShow":isShow,
			 "canSee":canSee,
			 "reviewed": reviewed
         },
         success:function(data){
            if(data.result.status=="true"){              
            	if(groupId=="add"){
            		customAlert.confrim({
            			message: "新增分組成功",
            			cancle: "返回列表",
            			confrim: "繼續新增",
            			oncancle: function(){
            				$("#SPApp").SPAContainer('goback');//轉到分組列表界面
            			},
            	        onconfrim: function() {
            	        	groupEditViewReset();
            	        	resetAllUser();
            	        	returnTop();
            	        }
            		});               		
            	}else{
            		customAlert.confrim({
            			message: "分組儲存成功",
            			cancle: "返回列表",
            			confrim: "繼續編輯",
            			oncancle: function(){
            				$("#SPApp").SPAContainer('goback');//轉到分組列表界面
            			},
            	        onconfrim: function() {
            	        	$("#saveGroup").attr("onclick",'saveGroup('+groupId+')');
            	        }
            		});     
            	}
            	getGroupListData();            	        	
            }else{
            	if(data.result.code="1213"){
            		toastr["error"]('分組名稱重複');	
            	}           	
            }
            customLoading.hide();
         },
         error:function(errMsg){                
             console.error("加载数据失败");
             customLoading.hide();
         }
     });
}
/****************************站別設定start******************************/
var sitesSetting = [];
var sitesSettingDB = [];
/*******************************
 * 功能：站別設定頁面初始化
 * params:  
 ******************************/
function sitesSettingInit(){
	//新增站點列只能輸正整數
    $("#sites_num").on("keyup keydown blur keypress",function(){
    	if(this.value.length == 1) {
    		this.value = this.value.replace(/[^1-9]/g, '')
        } else {
        	this.value = this.value.replace(/\D/g, '')
        }
    });
    //新增站點列
    $("#add_site_row").on("click",function(){
    	var rows = parseInt($("#sites_num").val());
    	if(rows){
    		if(rows>50){
    			toastr["warning"]('每次至多可新增50個站別');
    			return false;
    		}else{
    			for(var i=1;i<rows+1;i++){
            		var index = $('#sites_table tbody').find('tr:not(.template)').length + 1;
            		var site = {"index":index, "name":''};
                	addSiteRow(site);
                	sitesSetting.push(site);
            	}
    		}   		
    	}else{
    		toastr["warning"]('請輸入新增列數');
    	} 
    	syncSitesViewData();
    });
    //刪除站點列
    $("#del_site_row").on("click",function(){
    	var rows = parseInt($("#sites_num").val().trim());
    	if(rows){   
    		if(rows>50){
    			toastr["warning"]('每次至多可刪除50個站別');
    			return false;
    		}else{
    	   	    delSiteRow(rows);
    		}
    	}else{
    		toastr["warning"]('請輸入刪除列數');
    	} 
    	syncSitesViewData();
    });
    //保存站點設定
    $("#save_sites_btn").on("click",function(){
    	syncSitesViewData();
    	var tip = [];
    	$('.site-row').each(function(){
    		var index = $(this).find("td").eq(0).html();
    		var name = $(this).find(".sites-input").eq(0).val();
    		if(findSiteRepeat(sitesSetting,name,index)!=-1){
    			tip.push('站别'+index+'命名重複');    			   			
    		}
    	});
    	if(tip.length>0){
    		toastr["warning"](tip.join("<br>"));
    		return false;
    	}   	
    	saveGroupSites($("#save_sites_btn").data("groupId"));
    });
}
/**************************
 * 功能：存儲編輯好的站點
 * params:  
 ***************************/
function saveGroupSites(groupId){
	customLoading.show(function(){
		$.ajax({
	        type:'post',
	        url:setGroupSites,
	        dataType:'json',
	        cache: false,
	        data:{      
	             "did" : doctorCom.doctorId,
				 "clubId": getClubId(),
				 "groupId":groupId,
				 "sites":JSON.stringify(sitesSetting)	 
	        },
	        success:function(data){
	           if(data.status=="true"){      
	        	  sitesSettingDB = sitesSetting;
	        	  $("#save_sites_btn").prop("disabled",true);
	        	  customAlert.confrim({
	       			message: "分組站別設定成功",
	       			cancle: "返回列表",
	       			confrim: "繼續編輯",
	       			oncancle: function(){
	       				$("#SPApp").SPAContainer('goback');//轉到分組列表界面
	       			},
	       	        onconfrim: function() {
	       	        	returnTop();
	       	        }
	       		});     
	           }
	           customLoading.hide();
	        },
	        error:function(errMsg){                
	            console.error("操作失敗");
	            customLoading.hide();
	        }
	    });
	});
}
/***************************
 * 功能：同步站点viewdata
 * params:   
 ***************************/
function syncSitesViewData(){
	var sites = [];
	$('.site-row').each(function(){
		var index = $(this).find("td").eq(0).html();
		var name = $(this).find(".sites-input").eq(0).val().trim();
		sites.push({"index":index,"name":name});
	});   	
	sitesSetting = sites;
	if(Compare({"data":sitesSetting},{"data":sitesSettingDB})){
		$("#save_sites_btn").prop("disabled",true);
	}else{
		$("#save_sites_btn").prop("disabled",false);
	}
}
/**************************************
 * 功能：查询是否存在重复站点
 * params:  sites 站点数组
 * 			name 要查找的站点名称
 * 			index  要查找的站序
 **************************************/
function findSiteRepeat(sites,name,index){
    for (var i=0;i<sites.length;i++){
        if(name && sites[i]['name']==name && sites[i]['index']!=index){
            return i;
        }
    }
    return -1;
}
/***************************
 * 功能：打開分組站別設定界面
 * params: index 分組下標  
 ***************************/
function toSitesSetting(index){
	$("#SPApp").SPAContainer('servlet',{page:"#block_4"});//轉到分組站別設定
	var data = grouplist[index];
	$("#sites_title").html(data.groupName+"-站別設定");
	$("#sites_num").val('');
	getGroupSitesSetting(data.groupId);
	$("#save_sites_btn").data("groupId",data.groupId);
	$("#save_sites_btn").prop("disabled",true);
}
/**************************
 * 功能：獲取站別設定
 * params:  
 ***************************/
function getGroupSitesSetting(groupId){
	$('#sites_table tbody').find('tr:not(.template)').remove();
	customLoading.show(function(){
		$.ajax({
	        type:'post',
	        url:getGroupSites,
	        dataType:'json',
	        cache: false,
	        data:{      
	             "did" : doctorCom.doctorId,
				 "clubId": getClubId(),
				 "groupId":groupId,
				 "hasEmpty":'1'	 
	        },
	        success:function(data){
	           if(data.status=="true"){              
	      	     if(data.dataList.length!=0){
	      	    	sitesSetting = data.dataList;	
	      	    	sitesSettingDB = data.dataList.concat();
	      	     }else{
	      	    	//初始化站別設定數據
	      	    	sitesSetting=[];
	      	        for(var i=1;i<101;i++){
		      	       	var index;
		      	       	if(i<10){
		      	       		index = "00"+i;
		      	       	}else if(i>=10&&i<100){
		      	       		index = "0"+i;
		      	       	}else{
		      	       		index = i;
		      	       	}
		      	       	var site = {"index":index, "name":""};
		      	       	sitesSetting.push(site);
	      	        }
	      	     } 	
	      	     for(var i in sitesSetting){
	     	  		addSiteRow(sitesSetting[i]);
	     	  	 }
	           }
	           customLoading.hide();
	        },
	        error:function(errMsg){                
	            console.error("加载数据失败");
	        }
	    });
	});	
}
/*************************
 * 功能：添加一行站別設定
 * params:  data 站點數據
 *************************/
function addSiteRow(data){
	var $tr=$('#sites_table').find('.template').clone().removeClass('template');
	$tr.addClass("site-row");
	$tr.find('td').eq(0).html(data.index);
	$tr.find('.sites-input').attr("data-index",data.index);
	$tr.find('.sites-input').addClass("max-length");
	if(data.name){$tr.find('.sites-input').val(data.name);}
	$('#sites_table tbody').append($tr);
	$tr.find('.sites-input').customValidator({
    	maxlength:{
    		message: "",
    		num:40,
    		callback: function($obj){
    			$obj.val($obj.val().substring(0,40));
    		}
    	} 
	});
	$tr.find('.sites-input').on("blur", function(){
		var index = $(this).attr("data-index");
		var name = $(this).val().trim();
		syncSitesViewData();
		if(findSiteRepeat(sitesSetting,name,index)!=-1){
			toastr["warning"]("站別命名重複");
			$("#save_sites_btn").prop("disabled",true);
			setTimeout(function(){
				$("#save_sites_btn").prop("disabled",false);
				clearTimeout();
			}, 5000);
		}
	});
}
/***************************
 * 功能：刪除N行站點設定
 * params: rows 刪除數量 
 ***************************/
function delSiteRow(rows){
	var total = $('#sites_table tbody').find('tr:not(.template)').length;
	if((total-rows)>=100){
		for(var i=0;i<rows;i++){
			$('#sites_table tbody').find('tr:last').remove();
			sitesSetting.pop();
		 }
	}else{
		toastr["warning"]('刪除過多，請至少保留100個站別');
	}
}

/**********************************
 * 功能：取消新增/编辑 轉到編輯分組列表
 * params:
 *********************************/
function cancleEdit(){
	$("#SPApp").SPAContainer('goback');
}
/**********************************
 * 功能：判斷2個json,是否相等
 * params: 
 *********************************/
function Compare(objA, objB) {
    if(!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if(getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return CompareObj(objA, objB, true); //默认为true
}

function CompareObj(objA, objB, flag) {
	if(getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    for(var key in objA) {
        if(!flag) //跳出整个循环
            break;
        if(!objB.hasOwnProperty(key) && key!="viewWidth") {
            flag = false;
            break;
        }
        if(!isArray(objA[key])) { //子级不是数组时,比较属性值
            if(objB[key] != objA[key]) {            	
                flag = false;
                break;
            }
        } else {       	
            if(!isArray(objB[key])) {           
                flag = false;
                break;
            }
            var oA = objA[key],
                oB = objB[key];           
            if(oA.length != oB.length) {            
                flag = false;
                break;
            }
            for(var k in oA) {            	
                if(!flag) //这里跳出循环是为了不让递归继续
                    break;               
                flag = CompareObj(oA[k], oB[k], flag);                         	
            }
        }
    }
    return flag;
}

function isObj(object) {
    return object && typeof(object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}

function isArray(object) {
    return object && typeof(object) == 'object' && object.constructor == Array;
}

function getLength(object) {
    var count = 0;
    for(var i in object) count++;
    return count;
}
/**********************************
 * 功能：阿拉伯數字轉中文數字 
 * params:
 *********************************/
function chinanum(num){  
	num = num+"";
    var china = new Array('零','一','二','三','四','五','六','七','八','九');  
    var arr = new Array();  
    var english = num.split("")  
    for(var i=0;i<english.length;i++){  
        arr[i] = china[english[i]];  
    }  
    return arr.join("")  
}