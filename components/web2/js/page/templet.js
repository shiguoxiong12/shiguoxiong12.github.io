$(function(){
	toastrInit();
	showIcon();//显示icon
	//滚动条美化
    $(".div-scroll").slimScroll({
 		height: '100%',
 		color: '#c1c1c1',
 		wheelStep: 10
	 });   
	
	/**************搜索框插件******************************/
	$("#search-club-user").searchInput("init",{
		onclear: function(){
			alert('点击X清除后执行');
		},
		onsearch: function(){
			alert('搜索内容：'+$("#search-club-user").val());
		},
		onenter: function(){
			alert('按回车后执行');
		}
	});	
	
	/*************************select 插件****************************/
	//默認圓角 
	$("#web2-select-rounded").customSelect();
	//方形 
	$("#web2-select").customSelect("init",{rounded:false});
	//自定義設置
	$("#web2-select-custom").customSelect({
		rounded: false,  //方角false/圆角 true
		placeholder: "自定義默認值",//默認顯示字符
        width: "auto", //根據內容自適應寬度,默认100%
        height: 200,  //下拉高度
        required: {message:"請選擇一個項目"},//必填校验，默认false
        placement: "right-bottom" //驗證提示位置，默认right
	});
	//重置
	$("#select_reset").click(function(){			
		$(".web2-select").customSelect("reset");				
	});
	//獲取值
	$("#select_confrim").click(function(){			
		alert("第一個select值:"+$(".web2-select").eq(0).val()+"    第二個select值:"+$(".web2-select").eq(1).val()+"    第三个個select值:"+$(".web2-select").eq(2).val());				
	});
	$("#select_set_val").click(function(){
		$(".web2-select").customSelect("val","2");
	});
	$("#select_validate").click(function(){
		$(".web2-select").customSelect("validate");
	});
	
	/************************ 日期选择器 组件 **********************************/
	//日期輸入框初始化
    $('.date-select-example').dateSelect({
        language: "zh-TW",
        format: 'yyyy年mm月dd日',
        autoclose: true,
        offset:{top:0,left:0} //设置弹出日期框位置偏移量
    }); 
   //日期輸入框初始化
    $('.datetime-select-example').dateSelect({
        language: "zh-TW",
        format: 'yyyy/mm/dd',
        autoclose: true,
        showTimes: true, //是否开启时分选择
        offset:{top:0,left:0} //设置弹出日期框位置偏移量
    });
    $('.datetime-select-example').on("changeDate",function(e){
    	console.log("触发changeDate事件"+e.date);
    });
    $('.datetime-select-example').on("changeHour",function(e){
    	console.log("触发changeHour事件"+e.date);
    });
    $('.datetime-select-example').on("changeMinute",function(e){
    	console.log("触发changeMinute事件"+e.date);
    });
	//显示选择器
    $("#date_select_show").click(function(){
    	$('.date-select-example').eq(0).dateSelect("datepicker","show");
    });
	//设置日期
    $("#date_select_set").click(function(){
    	$('.date-select-example').dateSelect("datepicker","setDate",new Date());
    	//$('.datetime-select-example').find("input").datepicker("setDate",new Date());
    	$('.datetime-select-example').dateSelect("datepicker","setDate",new Date());
    });
    //重置
    $("#date_select_reset").click(function(){
    	$(".date-select-example").dateSelect("reset");
    });
    //设置错误提示 
    $("#date_select_hasError").click(function(){ 
    	$(".date-select-example").eq(0).dateSelect("hasError");
    	$(".date-select-example").eq(1).dateSelect("hasError",{
    		message: "错误提示",
    		placement: "right-bottom" //提示位置： right/right-bottom(默认)
    	});
    });
    //移除错误提示
    $("#date_select_cancleError").click(function(){
    	$(".date-select-example").dateSelect("removeError");
    });
    //獲取時間戳值
    $("#date_select_getMs").click(function(){
    	var str = "第一組："+$(".date-select-example").eq(0).dateSelect("getMs")+" - "+$(".date-select-example").eq(1).dateSelect("getMs")+"\n";
    	str+="第二組："+$(".datetime-select-example").eq(0).dateSelect("getMs")+" - "+$(".datetime-select-example").eq(1).dateSelect("getMs")+"\n"
    	console.log(formatDate($(".datetime-select-example").eq(0).dateSelect("getMs"),"yyyy-MM-dd HH:mm"));
    	alert(str);    	
    });
    
	/************************时间选择器 组件 **********************************/
    //時間輸入框初始化
    $("#time_select_example1").timeSelect(); //默認
    $("#time_select_example2").timeSelect({ //自定義配置 
    	autoclose: false, //是否自動關閉 
    });
    $("#time_select_example3").timeSelect({
    	showDate: true,   
    	startTime: 1560798600000, //配置開始時間
    	endTime: 1561053700000, //配置結束時間
    	//autoclose: false, //是否自動關閉 
    	//disabledMode: 'hide' //禁用選項風格
    }); //默認
    //重置
    $("#time_select_reset").click(function(){
    	$("#time_select_example1,#time_select_example2,#time_select_example3").timeSelect("reset");
    });
    //显示时间选择器
    $("#time_select_show").click(function(e){    	
    	$("#time_select_example3").timeSelect("show");
    });
    //隐藏时间选择器
    $("#time_select_hide").click(function(){
    	$("#time_select_example3").timeSelect("hide");
    });
    //获取时间字符串 
    $("#time_select_getTime").click(function(){
    	//获取时间字符串 
    	var str = "第一个时间选择："+$("#time_select_example1").timeSelect("getTime");
    	str+= " 第二个时间选择："+$("#time_select_example2").timeSelect("getTime");
    	str+= " 第三个时间选择："+$("#time_select_example3").timeSelect("getTime");
    	alert(str);
    });
    //获取时间戳，默认为当前日期的时间戳 
    $("#time_select_setTime").click(function(){
    	$("#time_select_example1").timeSelect("setTime",1530378425000);	
    	$("#time_select_example2").timeSelect("setTime",1530364490000);
    	$("#time_select_example3").timeSelect("setTime",1530374608000);	
    	console.log(formatDate($("#time_select_example1").timeSelect("getTime"),"yyyy-MM-dd HH:mm"));
    	console.log(formatDate($("#time_select_example2").timeSelect("getTime"),"yyyy-MM-dd HH:mm"));
    	console.log(formatDate($("#time_select_example3").timeSelect("getTime"),"yyyy-MM-dd HH:mm"));
    });
    //获取时间戳，可传入一个date 对象 或者可以 new Date(日期参数) 的参数 来设置时间戳的日期
    $("#time_select_setDate").click(function(){ 
    	//$("#time_select_example3").timeSelect("setDate",1530374400000);//指定日期的时间戳    	
    	$("#time_select_example3").timeSelect("setDate",new Date().setFullYear(2019,2,8));//指定日期的时间戳   	
    	console.log(formatDate($("#time_select_example3").timeSelect("getTime"),"yyyy-MM-dd HH:mm"));   	
    });
    $("#time_select_setBetween").click(function(){
    	//$("#time_select_example3").timeSelect("setStartTime",1546272000000);
    	//$("#time_select_example3").timeSelect("setEndTime",1546358400000);
    	   	
    	$("#time_select_example3").timeSelect("setStartTime",1560911674000);
    	$("#time_select_example3").timeSelect("setEndTime",1560922734000);
    });
    //设置错误提示 
    $("#time_select_hasError").click(function(){ 
    	$("#time_select_example1").timeSelect("hasError");
    	$("#time_select_example2").timeSelect("hasError",{
    		message: "错误提示",
    		placement: "right" //提示位置： right/right-bottom(默认)
    	});
    });
    //取消错误提示 
    $("#time_select_cancleError").click(function(){
    	$("#time_select_example1,#time_select_example2").timeSelect("removeError");
    });
   //綁定change事件
    $("#time_select_change").on("click",function(){
    	$("#time_select_example1,#time_select_example2,#time_select_example3").on("changeTime",function(){
        	alert("時間change");
        });
    	alert("完成綁定，請重新選擇一個時間時間試試");
    });
    /***********************分頁組件初始化******************************/
     //直接使用默認配置初始化
    $("#pagination_bar").customPagenav(); 
    //使用自定義配置初始化 
    $("#pagination_bar_center").customPagenav('init',{
    	pageTotal:  false, //是否展示 共**頁 
       	pageJump: false,  //是否展示 跳至**頁          
       	algin: 'center' //分頁位置，left/center/right,默認right
    });
    $("#pagination_bar_left").customPagenav('init',{
    	pageTotal:  true, //是否展示 共**頁 
       	pageJump: true,  //是否展示 跳至**頁          
       	algin: 'left' //分頁位置，left/center/right,默認right
    });
    
    changePage(1); //此方法為你自定義切換頁數時需調用的方法，
    			   //在分页变化后需使用customPagenav('changePage',options),更新分頁組
    			   
   /********************異步加載容器组件 *******************************/
   $("#box_loader_example").find(".btn").eq(0).click(function(){ //無數據
	   $("#box_loader_example").customLoader("nodata");
	   setTimeout(function(){ 
		   $("#box_loader_example").customLoader("loaded");
	   }, 3000);
   });
   $("#box_loader_example").find(".btn").eq(1).click(function(){
	   $("#box_loader_example").customLoader("loading");
	   setTimeout(function(){ 
		   $("#box_loader_example").customLoader("loaded");
	   }, 3000);
   });
   $("#block_loader_example").find(".btn").eq(1).click(function(){ //無數據
	   $("#block_loader_example").customLoader("nodata",function(){
		   alert("無數據 回調函數");
		   setTimeout(function(){ 
			   $("#block_loader_example").customLoader("loaded");
		   }, 3000);
	   });
   });
   $("#block_loader_example").find(".btn").eq(2).click(function(){
	   $("#block_loader_example").customLoader("loading");
	   setTimeout(function(){ 
		   $("#block_loader_example").customLoader("loaded",function(){
			   alert("加載完成 回調函數");
		   });
	   }, 3000);
   });
   
   /**********************自定義彈窗***********************/
   $("#default_alert").click(function(){
	   customAlert.alert("一個提示信息彈窗"); 
   });
   $("#default_confrim").click(function(){
	   customAlert.confrim("一個確認彈窗"); 
   });
   $("#alert_example_1").click(function(){
	   customAlert.alert({
		   message:"自定義按鈕文案",
		   confrim: "這是確定按鈕"
	   }); 
   });
    $("#confrim_example_1").click(function(){
	   customAlert.confrim({
		   message:"自定義按鈕文案",
		   cancle: "這是取消按鈕",
		   confrim: "這是確定按鈕"
	   }); 
   });
   $("#alert_example_2").click(function(){
 	   customAlert.alert({
 		   message:"自定義點擊按鈕執行",
 		   onconfrim: function(){
 			   alert("您點擊了確定按鈕");
 		   }
 	   }); 
    })
    $("#confrim_example_2").click(function(){
 	   customAlert.confrim({
 		   message:"自定義點擊按鈕執行",
 		   oncancle:function(){
 			  alert("您點擊了取消按鈕");
 		   },
 		  onconfrim: function(){
			   alert("您點擊了確定按鈕");
		   }
 	   }); 
    })
    
    /****************輸入框帶校驗 组件**********************/
    //初始化，设置需要的校验的
    $("#input_validate_example1").customValidator({
    	required:{message:""},//必填校验
    	maxlength:{message: "",num:8} //最大输入校验
	});
    //初始化，设置需要的校验提示内容 
    $("#input_validate_example2").customValidator({
   		//required:{message:"不能為空"},
   		maxlength:{message: "超出輸入字數",num:8},
   	    //placement: "right-bottom"  //設置提示信息顯示位置 ，默認 right
   		validator:function($obj){  //自定義一個校驗器只能輸入6-8位數字
    		var reg = /^\d{6,8}$/; 
    		console.log($obj.val());
    		if(!reg.test($obj.val())){
    			toastr['warning']("請填寫6-8位數字");
    		}
    		return reg.test($obj.val());
    	}
	});
    //js方式触发校验 
    $("#validate_btn").click(function(){
    	$("#input_validate_example1,#input_validate_example2").customValidator("validate");
    });
    //重置
    $("#reset_btn").click(function(){
    	$("#input_validate_example1,#input_validate_example2").customValidator("reset");
    });
    
    /********************* 多行输入框组件 *******************************/
    //默认初始化 
    $("#multiline_input_example1").multilineInput();
    //初始化，设置必填校验，最大输入字数校验，最大显示行数 6
	$("#multiline_input_example2").multilineInput({
		 required: {message: "请输入内容"},
		 maxlength: {num: 500,message: "超出输入字数"},
		 rows:6,
		 //fixed: true,  //固定顯示最大行數 
		 //placeholder: "請輸入內容"
	 });
     //初始化，设置获取焦点和失去焦点触发执行方法
	 $("#multiline_input_example3").multilineInput({
		 onfocus: function(){	 //獲得焦點觸發 		
			$(this).multilineInput("val","哈哈~表现的机会到啦");
		 },
		 onblur: function(){    //失去焦點觸發
			 $(this).multilineInput("val","阿欧~失去焦点了");
		 }
	 });
     //初始化，设置固定显示4行 和 placeholder 内容
	 $("#multiline_input_example4").multilineInput({		 
		 rows: 4,
		 fixed: true,  //固定顯示最大行數 
		 placeholder: "請輸入內容"
	 });
     //用js方式 给输入框赋值 
	 $("#multiline_val").click(function(){
		 $("#multiline_input_example2").multilineInput('val',"js赋值");
	 })
	 //用js 触发校验，需先初始化设置 required,maxlength等校验 
	 $("#multiline_btn").click(function(){
		 $("#multiline_input_example2").multilineInput("validate");
	 });
     //获取输入的文本 
	 $("#multiline_text").click(function(){
		 alert("输入的值是："+$("#multiline_input_example2").multilineInput('val'));
	 });
     //获取输入的 html 
	 $("#multiline_html").click(function(){
		 alert("输入的html是："+$("#multiline_input_example2").multilineInput('html'));
	 });
     // 重置输入框 
	 $("#multiline_reset").click(function(){
		 $("#multiline_input_example2").multilineInput("reset");
	 });
     
     /************************** 可输入下拉select插件 ****************************/
     //默认
     $("#input_select_example1").selectAndInput();
     //回調設置
     $("#input_select_example2").selectAndInput({
    	 candelete: true,
    	 ondelete: function(data){
    		 alert("执行回调，删除选项："+JSON.stringify(data));
    	 }
     });
     //自定义呈現配置：圆角，默认显示内容，宽度自适应 等
     $("#input_select_example3").selectAndInput({
    	 rounded: false, //左右兩端是否需要完全圓角
         placeholder: "請填写项目名称", //placeholder内容
         width: "auto", //寬度设置：100%（默认）/auto
         height: 180, //下拉選項高度
         required: {message:"請選擇一個項目"},//必填检验和提示
         placement: "right-bottom", //提示信息显示位置: right(默认)/right-bottom     
     });
     
     //重置
     $("#select_input_reset").click(function(){
    	 $("#input_select_example1,#input_select_example2,#input_select_example3").selectAndInput("reset");
     });
     //js獲取值
     $("#select_input_get").click(function(){
    	var str = "第1個選項值："+$("#input_select_example1").selectAndInput("getValue"); 
    	str += "   第1個選項文本："+$("#input_select_example1").selectAndInput("getText")+"\n"; 
    	str += "第2個選項值："+$("#input_select_example2").selectAndInput("getValue"); 
     	str += "   第2個選項文本："+$("#input_select_example2").selectAndInput("getText")+"\n"; 
     	str += "第3個選項值："+$("#input_select_example3").selectAndInput("getValue"); 
     	str += "   第3個選項文本："+$("#input_select_example3").selectAndInput("getText")+"\n"; 
    	alert(str);
     });
     //js驗證是否為一個新的值 
     $("#select_input_new").click(function(){
    	var str="";
    	if($("#input_select_example1").selectAndInput("newValue")){
    		 str+="第1個選項為新值，文本為："+$("#input_select_example1").selectAndInput("getText")+"\n";
     	}else{
     		str+="第1個選項已存在，值為："+$("#input_select_example1").selectAndInput("getValue")+"\n";
     	}	
    	if($("#input_select_example2").selectAndInput("newValue")){
    		 str+="第2個選項為新值，文本為："+$("#input_select_example2").selectAndInput("getText")+"\n";
     	}else{
     		str+="第2個選項已存在，值為："+$("#input_select_example2").selectAndInput("getValue")+"\n";
     	}
    	if($("#input_select_example3").selectAndInput("newValue")){
   		 str+="第3個選項為新值，文本為："+$("#input_select_example3").selectAndInput("getText")+"\n";
    	}else{
    		str+="第3個選項已存在，值為："+$("#input_select_example3").selectAndInput("getValue")+"\n";
    	}
    	alert(str);
     });
     $("#select_input_set").click(function(){
    	 $("#input_select_example1,#input_select_example2,#input_select_example3").selectAndInput("setValue","量測項目");
     });
     $("#select_input_validate").click(function(){
    	 $("#input_select_example3").selectAndInput("validate"); 
     });
     
     /************************** 多选下拉select插件 ****************************/
     //默认
     $("#multiple_select_example1").multipleSelect();
     //自定义
     $("#multiple_select_example2").multipleSelect({
    	 rounded: true, //左右兩端是否需要完全圓角
         placeholder: "請选择",
         width: "auto", //寬度设置：100%（默认）/auto
         height: "",//可設置下拉選項高度
    	 viewMaxWidth: 200,
    	 required: {message:"請選擇一個項目"},//必填检验和提示
    	 allSelect: "所有选项" //增加一个全选选项，值为"all"
     });
     
     //重置
     $("#multiple_select_reset").click(function(){
    	 $("#multiple_select_example1,#multiple_select_example2").multipleSelect("reset");
     });
     //设置选项值
     $("#multiple_select_get").click(function(){
    	 var str="";
    	 str+="第一个选项值："+$("#multiple_select_example1").multipleSelect("getValue")+"，";
    	 str+="第一个选项文本："+$("#multiple_select_example1").multipleSelect("getText")+"\n";
    	 str+="第二个选项值："+$("#multiple_select_example2").multipleSelect("getValue")+"，";
    	 str+="第二个选项文本："+$("#multiple_select_example2").multipleSelect("getText")+"\n";
    	 alert(str);
     });
     //设置选项值
     $("#multiple_select_set").click(function(){
    	 $("#multiple_select_example1").multipleSelect("setValue","1");
    	 $("#multiple_select_example2").multipleSelect("setValue",["1","2"]);
     });
     $("#multiple_select_validate").click(function(){
    	 $("#multiple_select_example2").multipleSelect("validate"); 
     });
});

//换页 
function changePage(pageIndex){
	/*
		你自己待代碼
	*/
	//分頁 器更換頁數 
	$("#pagination_bar,#pagination_bar_center,#pagination_bar_left").customPagenav('changePage',{  //變更頁數
		   funcName: 'changePage', //自定義頁數變化需調用的方法
		   pageIndex: pageIndex, //頁數
		   pageSize: 6, //一頁顯示多少條
		   total: 100  //一共多少條數據
	});
}
//展示图标
function showIcon(){
	var arrIcon = [
     	{
     		"unicode":"&#xe641;",
     		"clsName":"icon-icon-46"
     	},
     	{
     		"unicode":"&#xe640;",
     		"clsName":"icon-icon-45"
     	},
     	{
     		"unicode":"&#xe63f;",
     		"clsName":"icon-icon-44"
     	},
     	{
     		"unicode":"&#xe63d;",
     		"clsName":"icon-icon-42"
     	},
     	{
     		"unicode":"&#xe63c;",
     		"clsName":"icon-icon-41"
     	},
     	{
     		"unicode":"&#xe63b;",
     		"clsName":"icon-icon-40"
     	},
     	{
     		"unicode":"&#xe63a;",
     		"clsName":"icon-icon-39"
     	},
     	{
     		"unicode":"&#xe639;",
     		"clsName":"icon-icon-38"
     	},
     	{
     		"unicode":"&#xe638;",
     		"clsName":"icon-icon-37"
     	},
     	{
     		"unicode":"&#xe637;",
     		"clsName":"icon-icon-36"
     	},
         {
             "unicode":"&#xe642;",
             "clsName":"icon-icon-35"
         },
     	{
     		"unicode":"&#xe635;",
     		"clsName":"icon-icon-34"
     	},
     	{
     		"unicode":"&#xe634;",
     		"clsName":"icon-icon-33"
     	},
     	{
     		"unicode":"&#xe633;",
     		"clsName":"icon-icon-32"
     	},
     	{
     		"unicode":"&#xe632;",
     		"clsName":"icon-icon-31"
     	},
     	{
     		"unicode":"&#xe631;",
     		"clsName":"icon-icon-30"
     	},
          {
             "unicode":"&#xe643;",
             "clsName":"icon-icon-29"
         },
     	{
     		"unicode":"&#xe62f;",
     		"clsName":"icon-icon-28"
     	},
     	{
     		"unicode":"&#xe62e;",
     		"clsName":"icon-icon-27"
     	},
     	{
     		"unicode":"&#xe62d;",
     		"clsName":"icon-icon-26"
     	},
     	{
     		"unicode":"&#xe62c;",
     		"clsName":"icon-icon-25"
     	},
     	{
     		"unicode":"&#xe62b;",
     		"clsName":"icon-icon-24"
     	},
     	{
     		"unicode":"&#xe62a;",
     		"clsName":"icon-icon-23"
     	},
     	{
     		"unicode":"&#xe629;",
     		"clsName":"icon-icon-22"
     	},
     	{
     		"unicode":"&#xe628;",
     		"clsName":"icon-icon-21"
     	},
     	{
     		"unicode":"&#xe627;",
     		"clsName":"icon-icon-20"
     	},
     	{
     		"unicode":"&#xe626;",
     		"clsName":"icon-icon-19"
     	},
     	{
     		"unicode":"&#xe625;",
     		"clsName":"icon-icon-18"
     	},
     	{
     		"unicode":"&#xe624;",
     		"clsName":"icon-icon-17"
     	},
     	{
     		"unicode":"&#xe623;",
     		"clsName":"icon-icon-16"
     	},
     	{
     		"unicode":"&#xe622;",
     		"clsName":"icon-icon-15"
     	},
     	{
     		"unicode":"&#xe621;",
     		"clsName":"icon-icon-14"
     	},
     	{
     		"unicode":"&#xe620;",
     		"clsName":"icon-icon-13"
     	},
     	{
     		"unicode":"&#xe61f;",
     		"clsName":"icon-icon-12"
     	},
     	{
     		"unicode":"&#xe61e;",
     		"clsName":"icon-icon-11"
     	},
     	{
     		"unicode":"&#xe61d;",
     		"clsName":"icon-icon-10"
     	},
     	{
     		"unicode":"&#xe61c;",
     		"clsName":"icon-icon-9"
     	},
     	{
     		"unicode":"&#xe61b;",
     		"clsName":"icon-icon-8"
     	},
     	{
     		"unicode":"&#xe61a;",
     		"clsName":"icon-icon-7"
     	},
     	{
     		"unicode":"&#xe619;",
     		"clsName":"icon-icon-6"
     	},
     	{
     		"unicode":"&#xe618;",
     		"clsName":"icon-icon-5"
     	},
     	{
     		"unicode":"&#xe617;",
     		"clsName":"icon-icon-4"
     	},
     	{
     		"unicode":"&#xe616;",
     		"clsName":"icon-icon-3"
     	},
     	{
     		"unicode":"&#xe615;",
     		"clsName":"icon-icon-2"
     	},
     	{
     		"unicode":"&#xe614;",
     		"clsName":"icon-icon-1"
     	},
     	{
     		"unicode":"&#xe613;",
     		"clsName":"icon-icon-"
     	}
     ]	
     for(var i=0;i<arrIcon.length;i++){
     	var $li = $("#icons li.hidden").clone().removeClass("hidden");
     	$li.find("span").html(arrIcon[i].unicode)
     	$li.find("xmp.unicode").text(arrIcon[i].unicode)
     	$li.find("xmp.clsname").text(arrIcon[i].clsName)
     	$li.find("input.unicode").val(arrIcon[i].unicode)
     	$li.find("input.clsname").val(arrIcon[i].clsName)
     	$li.appendTo($("#icons"));
    }	
	$(document).on("mouseenter","#icons li",function(){
		$(this).find(".cover").removeClass("hidden")
	})
	$(document).on("mouseleave","#icons li",function(){
		$(this).find(".cover").addClass("hidden")
		
	})
	$(document).on("click","#icons .cover",function(){
		if($("#checkChange li").eq(0).hasClass("active")){
			$(this).siblings("input.unicode").select();
			document.execCommand("Copy","false",null)
		}else{
			$(this).siblings("input.clsname").select();
			document.execCommand("Copy","false",null)
		}
		document.execCommand("Copy","false",null)
	})
	$("#checkChange li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		if($(this).index()==0){
			$("#icons .unicode").removeClass("hidden").siblings(".clsname").addClass("hidden");
		}else{
			$("#icons .unicode").addClass("hidden").siblings(".clsname").removeClass("hidden");
		}
	})
}

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
