/*接口定义*/
var getHealthReportList = '/api/getHealthReportList'; //获取健檢報告
var getFactoryList = '/api/getFactoryList'; //獲取工廠/分公司列表數據
var getDepartmentList = '/api/getDepartmentList'; //獲取工廠/分公司部門列表數據
var getMemberCareList = '/api/getMemberCareList'; //獲取員工列表
var getConsultSpecialRecord = '/api/getConsultSpecialRecord'; //獲取員工諮詢紀錄
var addConsultRecord = '/doctor/addConsultRecord'; //添加員工諮詢紀錄
var addSpecialRecord = '/api/addSpecialRecord'; //添加員工特殊事項紀錄
var deleteConsultRecord = '/doctor/deleteConsultRecord'; //刪除員工諮詢紀錄
var deleteSpecialRecord = '/api/deleteSpecialRecord'; //刪除員工特殊事項記錄
var getSpecialItemList = '/api/getSpecialItemList'; //獲取特殊事項項目列表
var addSpecialItem = '/api/addSpecialItem'; //添加特殊事項
var deleteSpecialItem = '/api/deleteSpecialItem'; //刪除特殊事項
/*全局变量*/
var pageSize = 10; //一页显示数据条数
var memberList = []; //员工列表
var memberRecords = []; //員工諮詢紀錄&特殊實現記錄
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
 * 功能：頁面初始化
 *********************************/
function pageInit(){
	//搜索框
	$("#search_member").searchInput("init",{
		onclear: function(){
			getMembers(1);
		},
		onsearch: function(){
			getMembers(1);
		},
		onenter: function(){
			getMembers(1);
		}
	});	
	//初始化分頁導航
    $("#pagination_bar").customPagenav('init');
	//切換報告
	$("#report_select").change(function(){	
		$("#factory_select").customSelect("reset");
		$("#department_select").customSelect("reset");
		getMembers(1);
	   	getFactorys();
	   	getDepartments();
	});  
	$("#factory_select").change(function(){
		$("#department_select").customSelect("reset");	
		getMembers(1);
		getDepartments();		
	});
	$("#department_select").change(function(){
		getMembers(1);
	});
	//多行輸入初始化
	$("#consult_input").multilineInput({
		rows: 8,
		fixed: true, 
		required: {message: "請填寫諮詢事項內容"},
		placement: "right-bottom",
		placeholder: "請填寫您的問詢內容或指導建議"
	});	
	$("#special_input").multilineInput({
		rows: 8,
		fixed: true, 
		required: {message: "請填寫事項描述內容"},
		placement: "right-bottom",
		placeholder: "請填寫您要新增的事項描述"
	});	
	
	//時間輸入框初始化
    $('#special_date').datepicker({
        language: "zh-TW",
        format: 'yyyy年mm月dd日',
        autoclose: true,
        endDate: new Date(getTimeEnd(0))
    }); 
    $("#special_date").next().bind("click",function(e){
		$(this).prev().datepicker('show');	
		e.stopPropagation();
 	});	
	//美化div滾動條
	$(".div-scroll").slimScroll({
 		height: '100%',
 		color: '#c1c1c1',
 		wheelStep: 10
	 });
	
	setSpecialSelect(); //設置特殊事項選擇框
	getReportData(); //獲取報告列表
}

/**********************************
 * 功能：獲取健檢報告列表數據
 * params: 
 *********************************/
function getReportData(){
	$("#memeber_list_block").customLoader("loading",function(){
		$.ajax({
	        type:'post',
	        url:getHealthReportList,
	        dataType:'json',
	        cache: false,	      
	        data:{
	        	"did" : doctorCom.doctorId,
	        	"clubId": getClubId(),
	        	"starttime":946656000000,
	            "endtime":4102416000000,        
	            "pageSize":1000,
	            "pageIndex":1
	        },
	        success:function(data){
	            if(data.status == "true"){            
	            	var reports = data.reportList;           	
	            	//初始化分组select
	            	$("#report_select").empty();
	            	var placeholder = '健檢報告';
	            	if(reports.length==0){
	            		placeholder = "暫無健檢報告";
	            		$("#report_select").append('<option value="">暫無健檢報告</option>');            		
	            	}else{
	            		for (var i in reports) {               			
	                		$("#report_select").append('<option value="' +reports[i].reportId + '">' + reports[i].reportName + '</option>');                			
	                	}
	            	}            	           	            	
	            	$("#report_select").customSelect({placeholder:placeholder,width:"auto",height:300});      
	            	$("#report_select").change();        		
	            }else{
	            	console.error("获取数据失败，请稍后尝试");
	            }            
	        },
	        error:function(errMsg){         
	            console.error("加载数据失败")
	        }
	    }); 
	});
}
/**********************************
 * 功能：獲取並選擇廠別/分公司列表
 * params: 
 *********************************/
function getFactorys(){
	var reportId = $("#report_select").val();
	if(!reportId){return false;}
	$.ajax({
		type:'post',
		url: getFactoryList,
		data:{
			did : doctorCom.doctorId,
        	clubId: getClubId(),
			reportId: reportId
		},
		dataType:'json',
		success:function(data){
			if(data.result.status=='true'){
				var factorys = data.result.factoryList;
				$("#factory_select").empty();           	
        		$("#factory_select").append('<option value="">所有廠區/分公司</option>');          	
        		for (var i in factorys) {               			
            		$("#factory_select").append('<option value="' +factorys[i] + '">' + factorys[i] + '</option>');                			
            	}            	
        		$("#factory_select").customSelect("destory");
            	$("#factory_select").customSelect({placeholder:"所有廠區/分公司",width:"auto",height:300});              	
            	$("#department_select").customSelect("destory");
            	$("#department_select").customSelect({placeholder:"所有部門",width: "auto",height: 300});
			}
		}
	});
}
/**********************************
 * 功能：獲取公司部門數據
 * params: 
 *********************************/
function getDepartments(){
	var reportId = $("#report_select").val();
	var factory = $("#factory_select").val();
	if(!factory){
		factory="all";
		$("#department_select").customSelect("reset");
	}
	if(!reportId){return false;}
	$.ajax({
		type:'post',
		url:getDepartmentList,
		data:{
			did : doctorCom.doctorId,
			clubId:getClubId(),
			reportId:reportId,
			factory:factory
		},
		dataType:'json',
		success:function(data){
			if(data.result.status=='true'){
				var departments = data.result.departmentList;
				$("#department_select").empty();           	
        		$("#department_select").append('<option value="">所有部門</option>');          	
        		for (var i in departments) {               			
            		$("#department_select").append('<option value="' +departments[i] + '">' + departments[i] + '</option>');                			
            	}       
        		$("#department_select").customSelect("destory");           	
            	$("#department_select").customSelect({placeholder:"所有部門",width: "auto",height: 300});			
			}
		}
	});
}
/**********************************
 * 功能：獲取员工列表数据
 * params: 
 *********************************/
function getMembers(pageIndex){
	var keyword = $("#search_member").val();
	var reportId = $("#report_select").val();
	var factory = $("#factory_select").val();
	var department = $("#department_select").val();
	if(!factory){factory="all";}
	if(!department){department="all";}
	if(!reportId){
		$("#no_data_tip").html("請您先前往「健檢報告管理」上傳團體健檢報告。");
		$("#memeber_list_block").customLoader("nodata");
		return false;
	}
	$("#memeber_list_block").customLoader("loading");
	$.ajax({
        type:'post',
        url: getMemberCareList,
        dataType:'json',  
        cache: false,
        data:{           
            did : doctorCom.doctorId,
			clubId: getClubId(),
			search:keyword,
			reportId:reportId,
			factory:factory,
			department:department,
			pageIndex:pageIndex,
			pageSize:pageSize
        },
        success:function(data){
           if(data.status=='true'){       	  
        	   memberList = data.memberList;
        	   if(memberList.length==0){
        		   $("#no_data_tip").html("您可以嘗試點擊「健檢報告」下拉框，篩選想查看的健檢報告。");
        		   $("#memeber_list_block").customLoader("nodata");
        		   return false;
        	   }
        	   fillMemberList();
        	   $("#total_num").html(data.total);
        	   $("#pagination_bar").customPagenav('changePage',{
        		   funcName: 'getMembers',
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
 * 功能：填充员工列表数据
 * params: 
 *********************************/
function fillMemberList(){
	var data = memberList;
	var html = '';
	for(var i in data){
		html+='<tr>';
		html+='<td class="text-center">'+data[i].name+'</td>';
		html+='<td class="text-center">'+(data[i].gender=='0'?'男':'女')+'</td>';	                                    
		html+='<td class="text-center">'+data[i].number+'</td>';
		html+='<td class="text-center">'+data[i].factory+'</td>	';                                  
		html+='<td class="text-center">'+data[i].department+'</td>';
		html+='<td class="text-center"><span onclick="showConsultationRecords('+i+')" class="a-btn">'+data[i].consultNum+'&nbsp;&nbsp;></span></td>';
		html+='<td class="text-center"><span onclick="showSpecialRecords('+i+')" class="a-btn">'+data[i].specialNum+'&nbsp;&nbsp;></span></td>';
		html+='</tr>';    
	}
	$("#memeber_list tbody").html(html);
	$("#memeber_list_block").customLoader("loaded");
}

/**********************************
 * 功能：打開諮詢紀錄頁面
 * params: index 員工的數組下標
 *********************************/
function showConsultationRecords(index){
	$("#SPApp").SPAContainer('servlet',{page:"#block_2"});//轉到諮詢紀錄頁面
	$("#records_block_2").attr("cardId",memberList[index].cardId);
	$("#records_block_2").customLoader("loading",function(){
		memberRecords = memberList[index].consultRecord;
		fillConsultRecords(memberRecords);
	});
}
/**********************************
 * 功能：獲取員工諮詢紀錄
 * params: 
 *********************************/
function getConsultRecords(){
	var reportId = $("#report_select").val();
	var cardId = $("#records_block_2").attr("cardId");
	$("#records_block_2").customLoader("loading",function(){		
		$.ajax({
	        type:'post',
	        url: getConsultSpecialRecord,
	        dataType:'json',  
	        cache: false,
	        data:{           
	            did : doctorCom.doctorId,
				clubId: getClubId(),			
				reportId:reportId,
				cardId:cardId
	        },
	        success:function(data){
	           if(data.status=='true'){       	 
	        	   memberRecords = data.consultRecord;
	        	   fillConsultRecords(memberRecords);        	  
	           }else{
	        	   console.error(data.message); 
	           }          
	        },
	        error:function(errMsg){         
	            console.error("加载数据失败")
	        }
		});
	});
}
/**********************************
 * 功能：填充員工諮詢紀錄列表
 * params: data 諮詢記錄數據
 *********************************/
function fillConsultRecords(data){
	if(data.length==0){
		$("#add_consult_btn").hide();
		$("#records_block_2").customLoader("nodata");
	}else{
		$("#add_consult_btn").show();
		var html = '';
		for(var i in data){
			html+='<tr>';
			html+='<td class="text-center">'+formatDate(parseInt(data[i].consultTime),"yyyy/MM/dd")+'</td>';
			html+='<td class="text-center td-single-row" title="'+data[i].consulter+'">'+data[i].consulter+'</td>';	                                    
			html+='<td class="td-single-row pl-6 pr-6 pointer" onclick="showConsultRecord('+i+')">'+data[i].consultDesc+'</td>';
			html+='<td class="text-center">';                                                                                         
			html+='   <button onclick="delConsultRecord('+data[i].consultId+',this)" type="button" class="icon-btn" title="刪除紀錄">';
			html+='       <span class="iconfont icon-icon-17"></span>';
			html+='   </button>';                                         	                                           
			html+='</td>';
			html+='</tr> ';  
		}		
		$("#records_list_2 tbody").html(html);
		$("#records_block_2").customLoader("loaded");
	}
}
/**********************************
 * 功能：顯示記錄詳情
 * params: index 紀錄下標
 *********************************/
function showConsultRecord(index){
	$("#consult_detail").html(memberRecords[index].consultDesc);
	$("#show_consult_modal").modal("show");
}
/**********************************
 * 功能：刪除諮詢紀錄
 * params: consultId 紀錄id,
 * 		   dom 觸發方法的對象
 *********************************/
function delConsultRecord(consultId,dom){
	var cardId = $("#records_block_2").attr("cardId");
	customAlert.confrim({
	   message: "您確定要刪除該則紀錄嗎？",
	   onconfrim: function(){
		   $.ajax({
               type:'post',
               url: deleteConsultRecord,
               data:{
            	   did : doctorCom.doctorId,
	   			   clubId: getClubId(),	
	   			   cardId: cardId,
                   consultId: consultId
               },
               dataType:'json',
               success:function(data){
                   if(data.status=='true'){
                      $(dom).parent().parent().remove();
                      toastr["success"]("刪除成功");    
                      if($("#records_list_2 tbody").find("tr").length==0){
                    	  $("#add_consult_btn").hide();
                    	  $("#records_block_2").customLoader("nodata");
                      }
                      getMembers($("#pagination_bar").customPagenav("curPage"));
                   }
               }
           });		   
	   }
   }); 
}
/**********************************
 * 功能：打開增加員工諮詢紀錄modal
 * params: 
 *********************************/
function showAddConsultModal(){
	$("#consult_input").multilineInput("reset");
	$("#add_consult_modal").modal("show");
}
/**********************************
 * 功能：新增員工諮詢紀錄
 * params: 
 *********************************/
function addConsult(){
	var cardId = $("#records_block_2").attr("cardId");
	var consultRecord = $("#consult_input").multilineInput("val");
	if($("#consult_input").multilineInput("validate")){
		$.ajax({
	        type:'post',
	        url: addConsultRecord,
	        data:{
	     	    did : doctorCom.doctorId,
				clubId: getClubId(),			
				cardId: cardId,
	            consultTime:Date.parse(new Date()),
	            consultRecord: consultRecord
	        },
	        dataType:'json',
	        success:function(data){
	            if(data.status=='true'){	             
	               toastr["success"]("新增紀錄成功"); 
	               $("#consult_input").multilineInput("reset");
	               $("#add_consult_modal").modal("hide");
	               getConsultRecords();
	               getMembers($("#pagination_bar").customPagenav("curPage"));
	            }
	        }
	    });		   
	}
}

/**********************************
 * 功能：打開特殊事項紀錄頁面
 * params: index 員工的數組下標
 *********************************/
function showSpecialRecords(index){
	$("#SPApp").SPAContainer('servlet',{page:"#block_3"});//轉到特殊事項紀錄頁面
	$("#records_block_3").attr("cardId",memberList[index].cardId);
	$("#records_block_3").customLoader("loading",function(){
		memberRecords = memberList[index].specialRecordList;
		fillSpecialRecords(memberRecords);
	});
}
/**********************************
 * 功能：獲取特殊事項紀錄
 * params: 
 *********************************/
function getSpecialRecords(){
	var reportId = $("#report_select").val();
	var cardId = $("#records_block_3").attr("cardId");
	$("#records_block_3").customLoader("loading",function(){		
		$.ajax({
	        type:'post',
	        url: getConsultSpecialRecord,
	        dataType:'json',  
	        cache: false,
	        data:{           
	            did : doctorCom.doctorId,
				clubId: getClubId(),			
				reportId:reportId,
				cardId:cardId
	        },
	        success:function(data){
	           if(data.status=='true'){       	 
	        	   memberRecords = data.specialRecordList;
	        	   fillSpecialRecords(memberRecords);        	  
	           }else{
	        	   console.error(data.message); 
	           }          
	        },
	        error:function(errMsg){         
	            console.error("加载数据失败")
	        }
		});
	});
}
/**********************************
 * 功能：填充員工特殊事項紀錄列表
 * params: index 員工的數組下標
 *********************************/
function fillSpecialRecords(data){
	if(data.length==0){
		$("#add_special_btn").hide();
		$("#records_block_3").customLoader("nodata");
	}else{
		$("#add_special_btn").show();
		var html = '';
		for(var i in data){
			html+='<tr>';
			html+='<td class="text-center">'+formatDate(parseInt(data[i].recordTime),"yyyy/MM/dd")+'</td>';
			html+='<td class="text-center td-single-row" title="'+data[i].recorder+'">'+data[i].recorder+'</td>';	
			html+='<td class="td-single-row pl-5 pr-5" title="'+data[i].specialItemName+'">'+data[i].specialItemName+'</td>';
			html+='<td class="td-single-row pl-5 pr-5 pointer" onclick="showSpecialRecordDetail('+i+')">'+data[i].recordDesc+'</td>';
			html+='<td class="text-center">';                                                                                         
			html+='   <button onclick="delSpecialRecord('+data[i].recordId+',this)" type="button" class="icon-btn" title="刪除紀錄">';
			html+='       <span class="iconfont icon-icon-17"></span>';
			html+='   </button>';                                         	                                           
			html+='</td>';
			html+='</tr> ';  
		}		
		$("#records_list_3 tbody").html(html);
		$("#records_block_3").customLoader("loaded");
	}
}
/**********************************
 * 功能：顯示特殊事項記錄描述
 * params: index 員工的數組下標
 *********************************/
function showSpecialRecordDetail(index){
	$("#special_detail").html(memberRecords[index].recordDesc);
	$("#show_special_modal").modal("show");
}
/**********************************
 * 功能：刪除特殊事項紀錄
 * params: recordId 紀錄id,
 * 		   dom 觸發方法的對象
 *********************************/
function delSpecialRecord(recordId,dom){
	var cardId = $("#records_block_3").attr("cardId");
	customAlert.confrim({
	   message: "您確定要刪除該則紀錄嗎？",
	   onconfrim: function(){
		   $.ajax({
               type:'post',
               url: deleteSpecialRecord,
               data:{
            	   did : doctorCom.doctorId,
	   			   clubId: getClubId(),	
	   			   cardId: cardId,
	   			   recordId: recordId
               },
               dataType:'json',
               success:function(data){
                   if(data.status=='true'){
                      $(dom).parent().parent().remove();
                      toastr["success"]("刪除成功");    
                      if($("#records_list_3 tbody").find("tr").length==0){
                    	  $("#add_special_btn").hide();
                    	  $("#records_block_3").customLoader("nodata");
                      }
                      getMembers($("#pagination_bar").customPagenav("curPage"));
                   }
               }
           });		   
	   }
   }); 
}

/**********************************
 * 功能：打開增加特殊事項紀錄modal
 * params: 
 *********************************/
function showAddSpecialModal(){
	$("#special_item_select").selectAndInput("reset");
	$("#special_input").multilineInput("reset");
	$("#special_date").val(formatDate(new Date(),"yyyy年MM月dd日"));
	$("#special_date").datepicker('setDate',new Date(getTimeStart(0)));
	$("#add_special_modal").modal("show");
}

/**********************************
 * 功能：新增特殊事項紀錄
 * params: 
 *********************************/
function addSpecial(){
	var cardId = $("#records_block_3").attr("cardId");
	var specialItemName = $("#special_item_select").selectAndInput("getText");
	var recordDesc = $("#special_input").multilineInput("val");
	if(!$("#special_item_select").selectAndInput("validate")){return false;}
	if(!$("#special_input").multilineInput("validate")){return false;}
	if($("#special_item_select").selectAndInput("newValue")){addNewSpecialItem(specialItemName);}
	$.ajax({
        type:'post',
        url: addSpecialRecord,
        data:{
     	    did : doctorCom.doctorId,
			clubId: getClubId(),			
			cardId: cardId,
			specialItemName: specialItemName,
			recordTime:Date.parse($("#special_date").datepicker('getDate')),
			recordDesc: recordDesc
        },
        dataType:'json',
        success:function(data){
            if(data.status=='true'){	             
               toastr["success"]("新增紀錄成功"); 
               $("#special_input").multilineInput("reset");
               $("#add_special_modal").modal("hide");
               getSpecialRecords();
               getMembers($("#pagination_bar").customPagenav("curPage"));
            }
        }
    });		   
}

/**********************************
 * 功能：設置特殊事項選擇
 * params: 
 *********************************/
function setSpecialSelect(){
	$.ajax({
		type:'post',
		url: getSpecialItemList,
		data:{
			did : doctorCom.doctorId,
			clubId: getClubId(),
		},
		dataType:'json',
		success:function(data){
			if(data.status=='true'){
				var items = data.specialItemList;
				$("#special_item_select").empty();           	        		      	
        		for (var i in items) {               			
            		$("#special_item_select").append('<option value="' +items[i].specialItemId + '">' + items[i].specialItemName + '</option>');                			
            	}   
        		$("#special_item_select").selectAndInput("destory");
            	$("#special_item_select").selectAndInput({
            		placeholder:"請輸入項目名稱",
            		height:300,
            		required: {message:"請輸入項目名稱"},
            	    placement: "right-bottom",
            	    candelete: true,
               	    ondelete: function(data){
               	    	 delOneSpecialItem(data.value);	               		 
	               	}
            	});              					           
			}
		}
	});
}
/**********************************
 * 功能：添加一個新的特殊事項選項
 * params: 
 *********************************/
function addNewSpecialItem(specialItemName){
	$.ajax({
		type:'post',
		url: addSpecialItem,
		data:{
			did: doctorCom.doctorId,
			clubId: getClubId(),
			specialItemName: specialItemName
		},
		dataType:'json',
		success:function(data){
			if(data.status=='true'){
				setSpecialSelect();
			}
		}
	});
}
/**********************************
 * 功能：刪除一個特殊事項選項
 * params: 
 *********************************/
function delOneSpecialItem(specialItemId){
	$.ajax({
		type:'post',
		url: deleteSpecialItem,
		data:{
			did: doctorCom.doctorId,
			clubId: getClubId(),
			specialItemId: specialItemId
		},
		dataType:'json',
		success:function(data){
			if(data.status=='true'){
				console.log("刪除特殊事項成功");
			}
		}
	});
}