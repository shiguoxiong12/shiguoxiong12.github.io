/*接口定义*/
var getGroupList = '/api/getGroupList'; //获取分组信息列表
var searchClubMember = '/api/searchClubMember'; //搜索社群內成員
var screenClubMember = '/api/screenClubMember'; //根據項目篩選社群內用戶
var sendGroupMessage = '/api/sendGroupMessage'; //群發信息
var getHistoryMsg = '/doctor/getHistoryMsg'; //获取历史群发信息记录
var checkMsgDetail = '/doctor/checkMsgDetail'; //查看歷史群發消息的詳情
/*全局变量*/
var grouplist = []; //分组列表數據
var allMember={};//所有会员
var punit = '', sunit = ''; //单位设定：血压，血糖
var historyData = []; //群發歷史記錄數據
var pageSize = 6; //一页显示数据条数

$(function(){
	/*One.loader('show');*/	
	$('#hc1-menu1').addClass('active').siblings().removeClass('active');
	tab1PageInit();
	tab2PageInit();
	toastrInit();
	unitInit();
	PDCAitemInit();
	wangEidtorInit();
	getGroupListData();//獲取分組列表數據
	getHistoryData(1);
	$(".div-scroll").slimScroll({
 		height: '100%',
 		color: '#c1c1c1',
 		wheelStep: 10
	 });
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
 * 功能：群發信息tab初始化
 *********************************/
function tab1PageInit(){
	//搜索會員輸入框初始化
	$("#search-club-user").searchInput("init",{ 
		onclear: function(){
			removeKeyWordSearch();
		},
		onsearch: function(){
			searchUserByKeyword();
		},
		onenter:function(){
			searchUserByKeyword();
		}
	});
	//控制自定篩選條件打開關閉
	$("#condition_controll, #left-sub-block .close").click(function(){
		removeKeyWordSearch();
		$("#left-sub-block").toggle();
		$("#search-condition").show();
		$("#condition-search-result").hide();
	});
	//增加一個篩選條件
	$("#add_one_condition").click(function(e){  
    	if($(".condition-box.hidden").length==1){
    		$(this).hide();
    	}
    	$(".condition-box.hidden").eq(0).removeClass("hidden");
    	e.stopPropagation();
    });
	//刪除篩選條件
    $(".condition-box .icon-icon-17").click(function(e){
    	$(this).parent().parent().addClass('hidden');
    	var index = $(this).attr("data-index");
    	$("#condition_item"+index).customSelect('reset');
		$("#condition_symbol"+index).customSelect('reset');
		$("#condition_value"+index).val('');
		$("#condition-unit"+index).val('');
		$("#add_one_condition").show();
		e.stopPropagation();
    })
    //自訂條件篩選
	$("#condition-search").click(function(){	
		conditionSearch();			
	});
    //自訂篩選結果 返回 自訂條件
    $("#return-condition").click(function(){
		$("#search-condition").toggle();
		$("#condition-search-result").toggle();
	});
    //新增全部篩選用戶
    $("#addAll-conditionUser").click(function(){
    	$("#condition-user-list input").each(function(){
    		syncAddUser($(this).val());
    	})
    });
    //移除全部用戶
    $("#remove_allUser").click(function(){
    	customLoading.show(function(){
			$(".selected-user:not(:hidden)").each(function(){	    		
	    		$(".user-"+$(this).attr("data-user")).prop("checked",false);
	    		$("#selectUser-"+$(this).attr("data-user")).addClass("hidden");	    		
	    	});
			syncSelectedNum();
			customLoading.hide();
		});
    });
}
/**********************************
 * 功能：群發歷史記錄tab初始化
 *********************************/
function tab2PageInit(){
	 //群發信息歷史記錄搜索框初始化
    $("#history_search").searchInput("init",{ 
		onclear: function(){
			getHistoryData(1);
		},
		onsearch: function(){
			getHistoryData(1);
		},
		onenter:function(){
			getHistoryData(1);
		}
	});
    //起訖時間輸入框初始化
    $('.datepicker').datepicker({
        language: "zh-TW",
        format: 'yyyy年mm月dd日',
        autoclose: true
    }); 
    $(".datepicker").next().bind("click",function(e){
		$(this).prev().datepicker('show');	
		e.stopPropagation();
 	});	
    $("#start_time").datepicker('setDate',new Date(getTimeStart(29)));
    $("#end_time").datepicker('setDate',new Date());
    $("#start_time,#end_time").datepicker().on('changeDate',function(e){
    	$("#start_time,#end_time").datepicker('hide');
    	getHistoryData(1);
    });
    //初始化分頁導航
    $("#pagination_bar").customPagenav('init');
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
			$(".pdca-item").append('<option value="' + items[i][0] + '">' + items[i][1]+ '</option>');
		}	
	}
	$(".web2-select").customSelect("init",{rounded:false});
	for(var i=1;i<4;i++){
		$("#condition_item"+i).change(function() {	
			if($(this).val()){
				var itemIndex = parseInt($(this).val()) - 100;			
				$("#condition-unit"+$(this).attr("data-index")).val(unitChange(itemIndex));												
			}else{
				$("#condition-unit"+$(this).attr("data-index")).val('');	
			}													
		});
	}	
	$(".condition-value").keyup(function (){
		$(this).val($(this).val().replace(/[^\d.]/g,''));
	});
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
 * params:
 *********************************/
function getGroupListData(){
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
            	createallMemberList();    
            	fillGroupList();
            	preloadSelectedUser();
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
	allMember.groupName = '所有成員';
	var dtatlist = new Array();
	for(var i=0;i<grouplist.length;i++){ 
		var memberlist = grouplist[i].memberlist;
		for(var j=0;j<memberlist.length;j++){
			if(findElem(dtatlist,'id',memberlist[j].id) < 0){
				dtatlist.push(memberlist[j]);
			}			
		}
	}
	allMember.memberlist = dtatlist;	
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
function fillGroupList(){
	var data = grouplist;
	var html = '<ul class="nav-main">';
	for(var i in data){
		html+='<li class="nav-main-item">';
		html+='  <a class="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">';				                               
		html+='      <span class="nav-main-link-name">'+strLong2short(data[i].groupName,8)+'</span>';
		html+='       <span class="nav-main-link-badge">'+data[i].memberlist.length+'</span>';
		html+='</a>';
		html+='   <ul class="nav-main-submenu">';		
		html+='      <div class="add-all">';
		html+='       	<button type="button" onclick="addGroupAllUser('+i+')" class="btn btn-rounded btn-outline-default"><i class="iconfont icon-icon-19 fa-btn"></i>&nbsp;新增全部</button>';
		html+='      </div>';	
		html += fillGroupUserList(i);                          					                               	                              				                             	                            
		html+='  </ul>';				                         
		html+='</li>';       			                        		
	}
	html+='</ul>'; 
	$("#group-list").html(html);
}
/*******************************************************************************
 * 功能：填充分組會員列表
 * params:  index 當前分組的下標
 ******************************************************************************/
function fillGroupUserList(index){
	var data = grouplist[index].memberlist;
	html = '';
	for(var i in data){
		html+='<li class="nav-main-item">';
		html+=' 	<div class="user-checckbox">';
		html+='  		<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary">';
		html+='             <input type="checkbox" onclick="toggleUser(this)" id="group'+index+'-'+data[i].id+'" class="custom-control-input user-'+data[i].id+'" value="'+data[i].id+'">';
		html+='             <label class="custom-control-label" for="group'+index+'-'+data[i].id+'">';
		html+='          	  <img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'" >';
		html+='           	  <span>'+strLong2short(data[i].name,8)+'</span>';
		html+='             </label>';
		html+='        </div>';
		html+=' 	</div>	';			                              
		html+='</li>';	           
	}
	return html;
}
/********************************************** 
 * 功能：新增分組全部人員到已選
 * params:
 **********************************************/
function addGroupAllUser(index){
	customLoading.show(function(){
		var data = grouplist[index].memberlist;
		for(var i in data){
			$(".user-"+data[i].id).prop("checked",true);
			$("#selectUser-"+data[i].id).removeClass("hidden");
		}
		syncSelectedNum();
		customLoading.hide();
	});
}
/********************************************** 
 * 功能：提前預加載所有成員至已選成員中，先隱藏。
 * 	    便於後續通過控制顯示/隱藏，表示已選擇用戶，
 * 		減少dom操作提升交互速度
 * params:
 **********************************************/
function preloadSelectedUser(){
	var data = allMember.memberlist;
	var html='';
	for(var i in data){
		html+='<div id="selectUser-'+data[i].id+'" data-user="'+data[i].id+'" class="selected-user hidden">';
		html+='	<img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'">';
		html+='	<span class="user-name" title="'+data[i].name+'">'+data[i].name+'</span>';
		html+='	<span class="close" onclick="syncRemoveUser('+data[i].id+')">×</span>';
		html+='</div>	';
	}
	$("#selected-box").html(html);
}
/********************************************** 
 * 功能：通過關鍵詞搜索社群里的成员
 * params:
 **********************************************/
function searchUserByKeyword(){
	 var keyword = $("#search-club-user").val().trim();
	 if(keyword){
		 $("#search-result").removeClass("no-user");
		 $("#search-result").addClass("loading");
		 $.ajax({
	         type:'post',
	         url:searchClubMember,
	         dataType:'json',
	         cache: true,
	         data:{      
	             "did" : doctorCom.doctorId,
				 "clubId": getClubId(),
				 "searchContent":keyword
	         },
	         success:function(data){
	            if(data.result.status=="true"){
	            	var searchMemberlist = data.result.memberlist;
	            	fillKeywordSearch(searchMemberlist); 
	            	$("#search-result").removeClass("loading");
	            	if(searchMemberlist.length==0){
	            		$("#search-result").addClass("no-user");
	            	}else{
	            		$("#search-result").removeClass("no-user");
	            	}
	            }else{
	            	console.error(data.result.message);
	            }
	         },
	         error:function(errMsg){                
	             console.error("加载数据失败")
	         }
	     }); 
	 }else{
		 $("#search-result").removeClass("loading");
		 $("#search-result").removeClass("no-user");
		 $("#search-user-list").html('');
	 }
}
/********************************************** 
 * 功能：填充關鍵詞搜索社群里的成员結果列表
 * params:
 **********************************************/
function fillKeywordSearch(data){
	html = '';
	for(var i in data){
	html+=' 	<div class="user-checckbox">';
	html+='  		<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary">';
	html+='             <input type="checkbox" onclick="toggleUser(this)" id="keyword'+data[i].id+'" class="custom-control-input user-'+data[i].id+'" value="'+data[i].id+'">';
	html+='             <label class="custom-control-label" for="keyword'+data[i].id+'">';
	html+='          	  <img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'" >';
	html+='           	  <span>'+strLong2short(data[i].name,8)+'</span>';
	html+='             </label>';
	html+='        </div>';
	html+=' 	</div>	';			                                        
	}
	$("#search-user-list").html(html);
	syncSelectedUser();
}
/********************************************** 
 * 功能：清除關鍵詞搜索用戶結果
 * params:
 **********************************************/
function removeKeyWordSearch(){
	 $("#search-club-user").val('');
	 $("#search-result").removeClass();
	 $("#search-user-list").html('');
}
/********************************************** 
 * 功能：獲取自訂篩選條件
 * params:
 **********************************************/
function getConditions(){
	var conditions = []; //自订的筛选条件
	for(var i=1;i<4;i++){
		var type = $("#condition_item"+i).val();
		var sign = $("#condition_symbol"+i).val();
		var value = $("#condition_value"+i).val();
		var unit = $("#condition-unit"+i).val();
		if(type || sign || value){
			if(!type){
				toastr["warning"]("請選擇項目"+chinanum(i)+"的量測項目");				
				return false;
			}
			if(!sign){
				toastr["warning"]("請選擇項目"+chinanum(i)+"的條件");				
				return false;
			}
			if(!value){
				toastr["warning"]("請輸入項目"+chinanum(i)+"的數值");				
				return false;
			}
			var itemIndex = parseInt(type) - 100;
			var condition = {};
			condition.index = 0;
			condition.type = type;
			condition.sign = sign;
			condition.value = value;
			condition.unit = conditionUnit(itemIndex);
			conditions.push(condition);
		}
	}
	if(conditions.length>0){
		return conditions; 
	}else{
		toastr["warning"]("請至少填寫一個篩選項目");
		return false;
	}
}
/********************************************** 
 * 功能：根據自訂篩選條件篩選
 * params:
 **********************************************/
function conditionSearch(){
	var conditions = getConditions();
	if(conditions){
		$("#condition-search-result").removeClass("no-user");
		$("#condition-search-result").addClass("loading");
		$("#search-condition").toggle();
		$("#condition-search-result").toggle();
		$.ajax({
            type:'post',
            url: screenClubMember,
            dataType:'json',
            cache: true,
            data:{      
                "did" : doctorCom.doctorId,
    			"clubId": getClubId(),
    			"searchContent": '',
    			"conditionGroup":JSON.stringify(conditions)   			
            },
            success:function(data){
               if(data.result.status=="true"){
            	   var searchMemberlist = data.result.memberlist;
            	   fillConditionSearch(searchMemberlist);
            	   $("#condition-search-result").removeClass("loading");
	            	if(searchMemberlist.length==0){
	            		$("#condition-search-result").addClass("no-user");
	            	}else{
	            		$("#condition-search-result").removeClass("no-user");
	            	}
               }else{
               	console.error(data.message);
               }
            },
            error:function(errMsg){                
                console.error("加载数据失败")
            }
        });
	}else{
		console.error("沒有篩選條件");
	}	
}
/********************************************** 
 * 功能：填充關鍵詞搜索社群里的成员結果列表
 * params:
 **********************************************/
function fillConditionSearch(data){
	html = '';
	for(var i in data){
	html+=' 	<div class="user-checckbox">';
	html+='  		<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary">';
	html+='             <input type="checkbox" onclick="toggleUser(this)" id="condition'+data[i].id+'" class="custom-control-input user-'+data[i].id+'" value="'+data[i].id+'">';
	html+='             <label class="custom-control-label" for="condition'+data[i].id+'">';
	html+='          	  <img class="user-avatar" src="'+data[i].avatar+'" onerror="javascript:this.src=\'/images/user-default.png\'" >';
	html+='           	  <span>'+strLong2short(data[i].name,8)+'</span>';
	html+='             </label>';
	html+='        </div>';
	html+=' 	</div>	';			                                        
	}
	$("#condition-user-list").html(html);
	syncSelectedUser();
}

function toggleUser(obj){
	if($(obj).is(':checked')) {
		syncAddUser($(obj).val());
	}else{
		syncRemoveUser($(obj).val());
	}
}
/*********************************************************
 * 功能：同步選中/增加 "分組列表"，"關鍵詞搜索"，"條件篩選"和"已選會員"中的會員
 * params: userId 用戶Id
 *******************************************************/
function syncAddUser(userId){
	$(".user-"+userId).prop("checked",true);
	$("#selectUser-"+userId).removeClass("hidden");
	syncSelectedNum();
}
/*********************************************************
 * 功能：同步取消/移除"分組列表"，"關鍵詞搜索"，"條件篩選"和"已選會員"中的會員
 * params: userId 用戶Id
 *******************************************************/
function syncRemoveUser(userId){
	$(".user-"+userId).prop("checked",false);
	$("#selectUser-"+userId).addClass("hidden");
	syncSelectedNum();
}
/*********************************************************
 * 功能：同步選中的用戶數量
 * params: userId 用戶Id
 *******************************************************/
function syncSelectedNum(){
	var num = $(".selected-user:not(:hidden)").length;
	$("#selected_num").html(num);
	if(num==0){
		$("#selected-box").prev().show();
	}else{
		$("#selected-box").prev().hide();
	}
}
/*********************************************************
 * 功能：同步"已選成員" 到 "分組列表"，"關鍵詞搜索"，"條件篩選" 列表選中
 * params: 
 *******************************************************/
function syncSelectedUser(){
	$(".selected-user:not(:hidden)").each(function(){
		syncAddUser($(this).attr("data-user"));
	});
}

/**********************************
 * 圖文編輯器初始化
 * params:
 *********************************/
function wangEidtorInit(){
	 var E = window.wangEditor;
     var editor = new E('#message_toolbar','#message_content');
	 editor.customConfig.menus = [
		'head',  // 标题
		'bold',  // 粗体
		'italic',  // 斜体
		'underline',  // 下划线
		'strikeThrough',  // 删除线
		'foreColor',  // 文字颜色
		'backColor',  // 背景颜色
		'link',  // 插入链接
		'list',  // 列表
		'justify',  // 对齐方式
		'quote',  // 引用
		//'emoticon',  // 表情
		'image',  // 插入图片
		'table',  // 表格
		//'video',  // 插入视频
		//'code',  // 插入代码
		//'undo',  // 撤销
		//'redo'  // 重复
	 ];
	 editor.customConfig.lang = {       
        '设置': '設置',
        '标题': '標題',     
        '链接': '連接',
        '图片': '圖片',
        '上传': '上傳',
        '创建': '創建',
        '颜色': '顏色',
        '方式': '對齊'
        // 还可自定添加更多
     };
	 editor.customConfig.onfocus = function () {	     
	        $("#message_block").addClass("active");
	 };
	 editor.customConfig.onblur = function () {	     
	        $("#message_block").removeClass("active");
	 };
	 editor.customConfig.zIndex = 100
	 editor.customConfig.uploadImgMaxSize= 400 * 1024;
	 editor.customConfig.uploadImgMaxLength = 4;
	 editor.customConfig.uploadImgParams={
			 did : doctorCom.doctorId,
	         clubId: getClubId()
	 };
	 editor.customConfig.showLinkImg = false;
	 editor.customConfig.uploadFileName = 'upLoadPic';
     editor.customConfig.uploadImgServer = '/api/uploadMessagePic';
     editor.customConfig.uploadImgHooks = {   		
	   		 customInsert:function(insertImg,result,editor){
	   			 var imglist = result.dataList;
	   			 for(var i in imglist){
	   				insertImg(imglist[i]);
	   			 }
	   		 }
     };
     editor.create();
     //預覽
     $("#phone_prev_btn").click(function(){
     	$("#prev_title").html($("#message_title").val());
     	$("#prev_content").html(editor.txt.html());
     	$("#prev_modal").modal('show');
     });
     //發送訊息
     $("#send_message_btn").click(function(){
     	massGroupTetetext(editor);
     });
}
/**********************************
 * 功能：群發訊息
 * params: editor 编辑器对象
 *********************************/
function massGroupTetetext(editor){
	var title = $("#message_title").val().trim();
	var content = editor.txt.html();
	if(title.length==0){
		 toastr["warning"]("請填寫標題");
 		return false; 
	}
	if(!editor.txt.text() && editor.txt.html().indexOf("img")<0){   		
		toastr["warning"]("請您先輸入文字或上傳圖片，謝謝。");
		return false;
	 }
	if(editor.txt.text().length > 2000){
 		toastr["warning"]("正文請不要超過2000字");
 		return false;
 	 }   		
	var sendIds= [];
	$(".selected-user:not(:hidden)").each(function(){
		sendIds.push($(this).attr("data-user"));
	});
	if(sendIds.length==0){
		toastr["warning"]("請至少選定一個成員"); 
		return false;
	}
	$("#send_message_btn").prop("disabled",true).html("送出中...");
	customLoading.show(function(){
		$.ajax({
	        type:'post',
	        url:sendGroupMessage,
	        dataType:'json',
	        cache: true,
	        data:{      
	            "did" : doctorCom.doctorId,
				 "clubId": getClubId(),
				 "userIds":sendIds.toString(),
				 "title":title,
				 "content":content			
	        },
	        success:function(data){
	           if(data.result.status=="true"){        	   
	           	  toastr["success"]("訊息發送成功"); 	           
	           	  $("#send_message_btn").prop("disabled",false).html("送出訊息");
	           	  //更新历史记录
	           	  setTimeout(function(){ getHistoryData($(".page-jump-input").eq(0).val()); }, 3000);
	           	  //重置
	           	  $("#message_title").val('');
	           	  editor.txt.clear();
		          $(".selected-user:not(:hidden)").each(function(){	    		
			    	  $(".user-"+$(this).attr("data-user")).prop("checked",false);
			    	  $("#selectUser-"+$(this).attr("data-user")).addClass("hidden");	    		
			      });
				  syncSelectedNum();				  
	           }else{
	           	  console.error(data.result.message);
	           }
	           customLoading.hide();
	        },
	        error:function(errMsg){                
	            console.error("加载数据失败")
	        }
	    });
	})	
}

/**********************************
 * 功能：獲取群發訊息歷史記錄
 * params: pageIndex 頁數
 *********************************/
function getHistoryData(pageIndex){
	var keyword = $("#history_search").val().trim();
	var startDate = $("#start_time").datepicker('getDate');
	var endDate =  $("#end_time").datepicker('getDate');	

	if(endDate < startDate){
		toastr["warning"]("起始時間不能晚於結束時間"); 
		return false;
	}
	$("#tab_2").removeClass("no-data");
	$("#tab_2").addClass("loading");
	$.ajax({
        type:'post',
        url:getHistoryMsg,
        dataType:'json',  
        cache: false,
        data:{           
            "did" : doctorCom.doctorId,
			"clubId": getClubId(),
			"name" : keyword,
            "startTime" : new Date(startDate).getTime(),	 
            "endTime" : new Date(endDate).getTime(),
            "pageIndex" : pageIndex,
            "pageSize" : pageSize,
        },
        success:function(data){
           if(data.status=='true'){
        	   $("#tab_2").removeClass("loading");
        	   historyData = data.messageList;
        	   fillHistoryList();
        	   $("#pagination_bar").customPagenav('changePage',{
        		   funcName: 'getHistoryData',
        		   pageIndex: pageIndex,
        		   pageSize: pageSize,
        		   total: parseInt(data.total)
        	   });
           }
        },
        error:function(errMsg){         
            console.error("加载数据失败")
        }
	});
}
/**********************************
 * 功能：渲染歷史記錄數據列表
 * params:
 *********************************/
function fillHistoryList(){
	var data = historyData;
	var html = '';
	for(var i in data){
		html+='<div class="history-record" onclick="showMsgDetail('+i+')">';
		html+='	<div class="record-left">';
		html+='		<img class="user-avatar" src="'+data[i].avator+'" onerror="javascript:this.src=\'/images/user-default.png\'">';
		html+='		<div class="record-main">';
		html+='			<div class="record-title"><span class="sender-name">'+data[i].nickName+'</span><span>'+strLong2short(data[i].title,40)+'</span><span class="send-time">'+formatDate(parseInt(data[i].time),"yyyy/MM/dd HH:mm")+'</span></div>';
		html+='			<div class="record-content">'+strLong2short($('<div>'+data[i].content+'</div>').text(),30)+'</div>';
		html+='		</div>';
		html+='	</div>';
		html+='	<div class="record-right">已讀人數：'+data[i].read+'/'+data[i].total+'</div>';
		html+='</div>';
	}
	$("#history_record_list").html(html);
	if(data.length==0){
		$("#tab_2").addClass("no-data");
	}else{
		$("#tab_2").removeClass("no-data");
	}
}
/**********************************
 * 功能：呈現消息詳情
 * params: index
 *********************************/
function showMsgDetail(index){
	var msg = historyData[index];
	$("#msg_sender").html(msg.nickName);
	$("#msg_sender_avatar").attr("src",msg.avator);
	$("#getHistoryMsg").html(msg.nickName);
	$("#msg_time").html(formatDate(parseInt(msg.time),"yyyy/MM/dd HH:mm"));
	$("#msg_title").html(msg.title);
	$("#msg_title").attr("title",msg.title);
	$("#msg_content").html(msg.content);
	getMsgUser(msg.id);
	$("#msg_detail_modal").modal('show');
}
/**********************************
 * 功能：切換查看接收人
 * params: state 1：已讀 / 0：未讀 / all:全部
 * 		   tab tab的序號
 *********************************/
function showMsgUser(state,tab){
	$("#msg_nav").find(".nav-link").removeClass("active");
	$("#msg_nav").find(".nav-link").eq(tab).addClass("active");
	if(state=='1'){
		$(".read-state1").show();
		$(".read-state0").hide();
	}else if(state=='0'){
		$(".read-state1").hide();
		$(".read-state0").show();
	}else{
		$(".read-state1").show();
		$(".read-state0").show();
	}
}
/**********************************
 * 功能：獲取訊息接收人
 * params: msgId 訊息Id
 *********************************/
function getMsgUser(msgId){
	$.ajax({
        type:'post',
        url:checkMsgDetail,
        dataType:'json',  
        cache: false,
        data:{           
            "did" : doctorCom.doctorId,
			"clubId": getClubId(),
			"msgId" : msgId          
        },
        success:function(data){
           if(data.status=='true'){
        	   var msgList = data.dataList;
        	   var html = '';
        	   for(var i in msgList){        		   
        		   html+='<div class="col-4 read-state'+msgList[i].readState+'">';
        		   html+='	<div class="msg-user-box">	';		                                		                                		                                            
        		   html+='     	<img class="user-avatar" src="'+msgList[i].avator+'" onerror="javascript:this.src=\'/images/user-default.png\'">';
        		   if(msgList[i].realName){
        			   html+='   <span class="user-name" title="'+msgList[i].realName+'">'+msgList[i].realName+'</span>  ';     
        		   }else{
        			   html+='   <span class="user-name" title="'+msgList[i].nickName+'">'+msgList[i].nickName+'</span>  ';
        		   }       		  
        		   html+='    </div>';
        		   html+='</div>';	
        	   }
        	   $("#msg_use_list").html(html);
        	   $("#msg_total").html(msgList.length);
        	   $("#msg_read").html($(".read-state1").length);
        	   $("#msg_unread").html($(".read-state0").length);
           }
        },
        error:function(errMsg){         
            console.error("加载数据失败")
        }
	});
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