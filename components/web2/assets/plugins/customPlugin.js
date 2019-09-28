/*********************************************************
 * 功能：为String 增加一個獲取顯示寬度的方法
 * 使用方法： str.viewWidth()
 ************************************************************/
String.prototype.viewWidth = function(){ 
	var span = $("<span></span>");
	span.css("visibility","hidden");
	span.text(this); 
	$("body").append(span);
	var width = span.outerWidth();
	span.remove();
	return width;
} 
/*********************************************************
 * 功能：为jquery $.ajax加入前置登录校验
 * 使用方法：
 ************************************************************/
;(function($){  
    //首先备份下jquery的ajax方法  
    var _ajax=$.ajax;  
       
    //重写jquery的ajax方法  
    $.ajax=function(opt){  
        //备份opt中error和success方法  
        var fn = {  
            error:function(XMLHttpRequest, textStatus, errorThrown){},  
            success:function(data, textStatus){}  
        }  
        if(opt.error){  
            fn.error=opt.error;  
        }  
        if(opt.success){  
            fn.success=opt.success;  
        }  
           
        //扩展增强处理  
        var var_opt = $.extend(opt,{  
            beforeSend:function(XHR){
                //提交前回调方法             	
                var did = $('.user-box img').attr('uid');
				if(!did){
					if(confirm('請您先登入！')){
						location.href = '/login';
					}
				}
            }
        });  
        return _ajax(opt);  
    };  
})(jQuery); 

/*********************************************************
 * 功能：可多选的下拉选择输入
 * 作者: chendy
 * 使用方法：使用jquery選擇需要的select元素，調用selectAndInput()方法
 *         如：$(".element").multipleSelect("init");
 ************************************************************/
;(function($) {
    var methods = {
        init: function(customs) {       	        	
            return this.each(function() {
                var $this = $(this); 
                $this.addClass("hidden");
                // 使用extend方法从customs和defaults对象中构造出一个配置項放在this.settings便於其他方法引用
                this.settings = $.extend({}, $.fn.multipleSelect.defaults, customs);                            
                var settings = this.settings;                
                //console.log(JSON.stringify(settings));                           
                var rem = parseInt($("body").css("font-size")); //獲取根元素font-size               
                var options = [];
                $this.find("option").each(function(){
                	var obj = {value:$(this).val(),text:$(this).text()};    
                	options.push(obj);
                }); 
               
                if($this.next(".default-select").length > 0){
                	console.log("select inited");                	
                }else{
                	 var html ='';
                     html+='<div class="default-select">';
                     html+='	<i class="iconfont icon-icon-2 select-arrow"></i>';
                     if(settings.rounded){
                    	 html+='	<input type="text" readonly="readonly"  class="form-control form-control-select form-control-select-rounded" placeholder="'+settings.placeholder+'">';		        
                     }else{
                    	 html+='	<input type="text" readonly="readonly" class="form-control form-control-select" placeholder="'+settings.placeholder+'">';		                    
                     }                         							
                     html+='	<div class="default-select-options multiple-select">';
                     html+='		<ul>';                       
                     html+='		</ul>';
                     html+='	</div>';
                     html+='</div>';
                     var $selectDom = $(html);   
                     $this.val('');//設置默認值為空
                     $this.parent().append($selectDom); 
                     $this.multipleSelect("setOptions");//設置選項
                     
                     //當寬度設置為自適應時，根據placeholder初始化寬度               
                     if(settings.width=="auto"){               	 
                    	 var width = settings.placeholder.viewWidth()+(3*rem);                   	
                    	 $selectDom.css("width",width);
                     }   
                     //設置下拉選項高度，超出高度滾動，需配合slimScroll插件使用 
                     if(settings.height && options.length>6){                    	                    	                    	
                    	 $selectDom.find(".default-select-options ul").css("height",settings.height);
                    	 $selectDom.find(".default-select-options ul").slimScroll({
                    		height: settings.height,
                       		color: '#c1c1c1',
                       		wheelStep: 10,
                       		size: '5px', //滑塊宽度
                      	 });
                     }              
                                               
                    $selectDom.find(".form-control-select").bind("click",function(e){                    
                    	$this.multipleSelect("toggle");
             			e.stopPropagation();
             		});	
                    $selectDom.find(".select-arrow").bind("click",function(e){                   	
                    	$this.multipleSelect("toggle");
             			e.stopPropagation();
             		});	
                    
                }             
            });
        },
        //設置篩選項下拉选择
        setOptions: function() {    
            return  this.each(function() {            	
            	 var $this = $(this);  
            	 var index = guid();
            	 var $selectDom = $this.next();
            	 var rem = parseInt($("body").css("font-size")); //獲取根元素font-size
            	 var settings = this.settings;    
            	 var options = [];
                 $this.find("option").each(function(){
                 	var obj = {value:$(this).val(),text:$(this).text()};    
                 	options.push(obj);
                 }); 
                 var html ='';
                 for(var i in options){      
                	 html+='<li><div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary">';
                	 html+='  <input type="checkbox" name="select'+index+'" class="custom-control-input" id="select_'+index+'_'+i+'" value="'+options[i].value+'">';
                	 html+='   <label class="custom-control-label" for="select_'+index+'_'+i+'">'+options[i].text+'</label>';
                	 html+='</div></li>';                	              	                     	                	
                 }      
                 $selectDom.find("ul").html(html);  
                 //增加全选选项
                 if(settings.allSelect){
                	 var $allSelect = $('<div class="custom-control  custom-control-lg custom-checkbox custom-checkbox-square custom-control-primary all-select"><input type="checkbox" class="custom-control-input" id="all_select_'+index+'" value="all"><label class="custom-control-label" for="all_select_'+index+'">'+settings.allSelect+'</label></div>');
                     $allSelect.find('input').on('click',function(){
                    	 if($(this).is(':checked')){
                    		 $selectDom.find(".form-control-select").val(settings.allSelect);
                    		 if(settings.width=="auto"){ //當寬度設置為自適應時，根據選中值調整寬度                   			   
                    			   var width = settings.allSelect.viewWidth()+(3*rem);
                            	   $selectDom.css("width",width);            			  
                              }
                    	 }else{
                    		 $selectDom.find(".form-control-select").val('');
                    	 }
                		 $selectDom.find("ul input").prop("checked",false);
                     });
                     $selectDom.find(".default-select-options").prepend($allSelect);
                 }                
                 //點擊選項
                 $selectDom.find("ul input").bind("click",function(e){                       
                 	var value = [];
                 	var name = [];
                 	var text = $selectDom.find(".form-control-select").val();
                 	$selectDom.find("ul input[type='checkbox']:checked").each(function(){
                 		value.push($(this).val());
                 		name.push($(this).next().text());
                 	});
          			if(settings.width=="auto" && settings.viewMaxWidth){
          				$selectDom.find(".form-control-select").attr("title",name.join("、"));
          				$selectDom.find(".form-control-select").val(TPGlobal.strLong2short(name.join("、"),settings.viewMaxWidth));           			
          			}else{
          				$selectDom.find(".form-control-select").val(name.join("、"));
          			}   
          			//选项发生变动时发布change事件
          			if(text != $selectDom.find(".form-control-select").val()){
          				text = $selectDom.find(".form-control-select").val();
          				$this.trigger("change"); 
              			$this.multipleSelect("validate");             			
          			}           			               			
          			if(settings.width=="auto"){ //當寬度設置為自適應時，根據選中值調整寬度
          			   var strlength='';
          			   text.length>settings.placeholder.length?strlength=text:strlength=settings.placeholder;
          			   var width = strlength.viewWidth()+(3*rem);
                  	   $selectDom.css("width",width);            			  
                    }
          			//取消全选选项
          			if(settings.allSelect){
          				$selectDom.find('.all-select input').prop("checked",false);
          			}          			
          			e.stopPropagation();
          		});
            });
        },
        //显示/關閉下拉选择
        toggle: function() {  
        	//取消document所有绑定事件
	       	 $(document).off("click",".default-select"); 
	       	 //设置除点击组件以外页面任意位置，关闭时间选择下拉框事件，并且优先执行此事件
	       	 document.addEventListener("click",function(e){    
	       		 var _con = $('.default-select '); 
	       		 if(!_con.is(e.target) && _con.has(e.target).length === 0){      
	       			 $(".default-select").removeClass("open");
	       		 }    			
	   		 },true);
          	
            return  this.each(function() {
                var $this = $(this); 
                $(".default-select").not($(this).next()).removeClass("open");              
                $this.next(".default-select").toggleClass("open");               
            });
        },
        //显示下拉选择
        show: function() {  
        	//取消document所有绑定事件
	       	 $(document).off("click",".default-select"); 
	       	 //设置除点击组件以外页面任意位置，关闭时间选择下拉框事件，并且优先执行此事件
	       	 document.addEventListener("click",function(e){    
	       		 var _con = $('.default-select '); 
	       		 if(!_con.is(e.target) && _con.has(e.target).length === 0){      
	       			 $(".default-select").removeClass("open");
	       		 }    			
	   		 },true);
        	
            return  this.each(function() {
                var $this = $(this); 
                $(".default-select").not($(this).next()).removeClass("open");              
                $this.next(".default-select").addClass("open");               
            });
        },
        //隱藏下拉选择
        hide: function() {               	
            return  this.each(function() {
                var $this = $(this);            
                $this.next(".default-select").removeClass("open");               
            });
        },
        //設置选项值值
        setValue: function(value) {               	
            return  this.each(function() {
            	var $this = $(this);        
            	var settings = this.settings;   
                var $selectDom = $this.next();  
                var rem = parseInt($("body").css("font-size")); //獲取根元素font-size 
                var text = [];
                $selectDom.find('input').prop("checked",false);
                
             	if(value instanceof Array){//设置选中多个值
             		for(var i in value){
             			$selectDom.find('[value="'+value[i]+'"]').prop("checked",true);
             			text.push($selectDom.find('[value="'+value[i]+'"]').next().text());
             		}
             	}else{//设置选中单个值
             		$selectDom.find('[value="'+value+'"]').prop("checked",true);
             		text.push($selectDom.find('[value="'+value+'"]').next().text());
             	}       
             	//设置最大字符宽度显示
             	if(settings.width=="auto" && settings.viewMaxWidth){
      				$selectDom.find(".form-control-select").attr("title",text.join("、"));
      				$selectDom.find(".form-control-select").val(TPGlobal.strLong2short(text.join("、"),settings.viewMaxWidth));           			
      			}else{
      				$selectDom.find(".form-control-select").val(text.join("、"));
      			}    
             	text = $selectDom.find(".form-control-select").val();
      			if(settings.width=="auto"){ //當寬度設置為自適應時，根據選中值調整寬度
      			   var strlength='';
      			   text.length>settings.placeholder.length?strlength=text:strlength=settings.placeholder;
      			   var width = strlength.viewWidth()+(3*rem);
              	   $selectDom.css("width",width);            			  
                 }
            });
        },
        //獲取value
        getValue: function(options) {    
        	var $this =  this.eq(0);
        	var $selectDom = $this.next();
        	var values = [];
        	$selectDom.find("input[type='checkbox']:checked").each(function(){
        		values.push($(this).val());
         	});
        	return values.join(",");     
        },
        //獲取text
        getText: function() {  
        	var $this =  this.eq(0);
        	var $selectDom = $this.next();
        	var texts = [];
        	$selectDom.find("input[type='checkbox']:checked").each(function(){
        		texts.push($(this).next().text());
         	});
        	return texts.join(",");    
        },
        //隱藏下拉选择
        hide: function() {               	
            return  this.each(function() {
                var $this = $(this);            
                $this.next(".default-select").removeClass("open");               
            });
        },
        destory: function() {    	//摧毀自定義select
        	return this.each(function() {
        		var $this = $(this); 
        		$this.next(".default-select").remove();
        	});
        },
        reset: function() {    	//重置select
        	return this.each(function() {        
        		var $this = $(this);        		
        		var $selectDom = $this.next();
        		$selectDom.find("input[type='checkbox']").prop('checked',false);
        		$selectDom.find(".form-control-select").val("");      		
        		$selectDom.removeClass("hasError");
        		$selectDom.find(".input-tip").html('');
        	});        
        },
        validate: function() {  
        	flag = true;
        	this.each(function() {
                var $this = $(this);   
                var settings = this.settings;
                var dom = $this.next();   
                //增加輸入錯誤提示
                if(dom.find(".input-tip").length==0){
                	if(settings.placement == "right-bottom"){
                    	dom.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                    }else{
                    	dom.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                    }
                }       
               
                //必填校驗               
                if(settings.required){                	
                	if(dom.find(".form-control-select").val().trim().length==0){           		
                		if(settings.required.message){            		
                    		dom.find(".input-tip").html('*'+settings.required.message);
                    		toastr["warning"](settings.required.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		$this.focus();
                		flag = false;
                	}
                }               
                if(!flag){
            		dom.addClass("hasError");
            	}else{
            		dom.removeClass("hasError");
            		dom.find(".input-tip").html('');
            	}
            });       
        	return flag;
        }
    };
    $.fn.multipleSelect = function() {
		  var method = arguments[0];
	      if (methods[method]) {
	          method = methods[method];
	          arguments = Array.prototype.slice.call(arguments, 1);
	      } else if (typeof(method) == 'object' || !method) {
	          method = methods.init;
	      } else {
	          $.error('Method ' + method + ' does not exist on jQuery.multipleSelect');
	          return this;
	      }
	      return  method.apply(this, arguments);
    };
    // 创建一个默认设置
    $.fn.multipleSelect.defaults = {
		 rounded: true, //左右兩端是否需要完全圓角
         placeholder: "請选择",
         width: "100%", //可修改為"auto" 根據內容自適應寬度	
         height: "",//可設置下拉選項高度
         viewMaxWidth: null, //选中值字符串呈现最大宽度px,经width为atuo时有效
         required: false, //是否必填
         placement: "right",//驗證提示位置
         allSelect: false //是否有全选选项
    };  
    // 全局方法
    var TPGlobal = {    	
    	strLong2short:function(str,width){
    		var strlen = str.length;
    		while(str.viewWidth() > parseInt(width)){
    			str = str.substring(0,str.length-1);
    		} 
    		if(str.length != strlen){
    			return str+'...';
    		}else{
    			return str;	
    		}    		
    	}    	
    };
    $.fn.multipleSelect.TPGlobal = TPGlobal;
})(jQuery);


/*********************************************************
 * 功能：可输入的下拉选择的插件
 * 作者: chendy
 * 使用方法：使用jquery選擇需要的select元素，調用selectAndInput()方法
 *         如：$(".element").selectAndInput("init");
 ************************************************************/
;(function($) {
    var methods = {
        init: function(customs) {       	        	
            return this.each(function() {
                var $this = $(this); 
                $this.addClass("hidden");
                // 使用extend方法从customs和defaults对象中构造出一个配置項放在this.settings便於其他方法引用
                this.settings = $.extend({}, $.fn.selectAndInput.defaults, customs);                            
                var settings = this.settings;                
                //console.log(JSON.stringify(settings));                           
                var rem = parseInt($("body").css("font-size")); //獲取根元素font-size               
                var options = [];
                $this.find("option").each(function(){
                	var obj = {value:$(this).val(),text:$(this).text()};    
                	options.push(obj);
                }); 
               
                if($this.next(".default-select").length > 0){
                	console.log("select inited");                	
                }else{
                	 var html ='';
                     html+='<div class="default-select">';
                     html+='	<i class="iconfont icon-icon-2 select-arrow"></i>';
                     if(settings.rounded){
                    	 html+='	<input type="text" class="form-control form-control-select form-control-select-rounded" placeholder="'+settings.placeholder+'">';		        
                     }else{
                    	 html+='	<input type="text" class="form-control form-control-select" placeholder="'+settings.placeholder+'">';		                    
                     }                         							
                     html+='	<div class="default-select-options">';
                     html+='		<ul>';                       
                     html+='		</ul>';
                     html+='	</div>';
                     html+='</div>';
                     var $selectDom = $(html);   
                     $this.val('');//設置默認值為空
                     $this.parent().append($selectDom); 
                     $this.selectAndInput("setOptions");//設置選項
                     
                     //當寬度設置為自適應時，根據placeholder初始化寬度               
                     if(settings.width=="auto"){               	 
                    	 var width = settings.placeholder.viewWidth()+(3*rem);                   	
                    	 $selectDom.css("width",width);
                     }   
                     //設置下拉選項高度，超出高度滾動，需配合slimScroll插件使用 
                     if(settings.height && options.length>6){                    	                    	                    	
                    	 $selectDom.find(".default-select-options ul").css("height",settings.height);
                    	 $selectDom.find(".default-select-options ul").slimScroll({
                    		height: settings.height,
                       		color: '#c1c1c1',
                       		wheelStep: 10,
                       		size: '5px', //滑塊宽度
                      	 });
                     }              
                                         
                    //初始化交互事件                    
                    $selectDom.find(".form-control-select").on("keyup",function(e){
                    	var optionlis = $selectDom.find(".default-select-options li");
                    	var str = $(this).val();
                    	$this.selectAndInput("setValue",str);                    	
                    	e.stopPropagation();
                    });
                    $selectDom.find(".form-control-select").bind("click",function(e){                    
                    	$this.selectAndInput("toggle");
             			e.stopPropagation();
             		});	
                    $selectDom.find(".select-arrow").bind("click",function(e){                   	
                    	$this.selectAndInput("toggle");
             			e.stopPropagation();
             		});	
                    
                }             
            });
        },
        //設置篩選項下拉选择
        setOptions: function() {    
            return  this.each(function() {            	
            	 var $this = $(this);  
            	 var index = guid();
            	 var $selectDom = $this.next();
            	 var rem = parseInt($("body").css("font-size")); //獲取根元素font-size
            	 var settings = this.settings;    
            	 var options = [];
                 $this.find("option").each(function(){
                 	var obj = {value:$(this).val(),text:$(this).text()};    
                 	options.push(obj);
                 }); 
                 var html ='';
                 for(var i in options){    
                 	if(settings.candelete){
                 		html+='<li><label class="with-btn"><input type="radio" name="select'+index+'" value="'+options[i].value+'"><span>'+options[i].text+'</span></label><i data-index="'+i+'" class="iconfont icon-icon-17 tool-btn"></i></li>'; 
                 	}else{
                 		html+='<li><label><input type="radio" name="select'+index+'" value="'+options[i].value+'"><span>'+options[i].text+'</span></label></li>'; 
                 	}                   	                     	                	
                  }      
                 $selectDom.find("ul").html(html);
                 //點擊刪除選項
                 if(settings.candelete && typeof settings.ondelete === 'function'){   
                 	$selectDom.find(".icon-icon-17").on("click",function(e){                		
                 		var data = options[$(this).attr("data-index")];
                 		$this.find("option").eq($(this).attr("data-index")).remove();
                 		$this.selectAndInput("setOptions");//設置選項
                 		settings.ondelete(data);
                 		e.stopPropagation();                       
                 	});                        	
                 }
                 //點擊選項
                 $selectDom.find(".default-select-options input").bind("click",function(e){                       
                 	$selectDom.find(".default-select-options li").removeClass("active");   
                  	$(this).parent().parent().addClass("active");           
          			var value =  $selectDom.find("input[type='radio']:checked").val();
          			var name = $selectDom.find("input[type='radio']:checked").next().text();               
          			if(!value){
          				name = '';    			
                  	}              			
          			$selectDom.find(".form-control-select").val(name);
          			$selectDom.removeClass("open");  
          			if($this.val() != value){
          				$this.val(value);
              			$this.change(); 
              			$this.selectAndInput("validate");
              			
          			}            			               			
          			if(settings.width=="auto"){ //當寬度設置為自適應時，根據選中值調整寬度
          			   var strlength='';
          			   name.length>settings.placeholder.length?strlength=name:strlength=settings.placeholder;
          			   var width = strlength.viewWidth()+(3*rem);
                  	   $selectDom.css("width",width);            			  
                     }
          			e.stopPropagation();
          		});
            });
        },
        //显示/關閉下拉选择
        toggle: function() {  
        	//取消document所有绑定事件
        	$(document).off();
        	//设置点击页面任意位置，关闭select选择下拉框事件，并且最后执行此事件
        	document.addEventListener("click",function(){
    			$(".default-select").removeClass("open");   			
    		},false);
        	
            return  this.each(function() {
                var $this = $(this); 
                $(".default-select").not($(this).next()).removeClass("open");              
                $this.next(".default-select").toggleClass("open");               
            });
        },
        //显示下拉选择
        show: function() {  
        	//取消document所有绑定事件
        	$(document).off("click",".default-select"); 
        	//设置点击页面任意位置，关闭select选择下拉框事件，并且最后执行此事件
        	document.addEventListener("click",function(){
    			$(".default-select").removeClass("open");   			
    		},false);
        	
            return  this.each(function() {
                var $this = $(this); 
                $(".default-select").not($(this).next()).removeClass("open");              
                $this.next(".default-select").addClass("open");               
            });
        },
        //隱藏下拉选择
        hide: function() {               	
            return  this.each(function() {
                var $this = $(this);            
                $this.next(".default-select").removeClass("open");               
            });
        },
        //設置輸入值
        setValue: function(value) {               	
            return  this.each(function() {
                var $this = $(this);                     
                var $selectDom = $this.next();
                var optionlis = $selectDom.find(".default-select-options li");            	
            	var maybe = 0; //聯想到都輸入選項個數
            	var selectIndex = -1; //是否有完全匹配的輸入內容的選項
            	var options = []; //選項
                $this.find("option").each(function(){
                 	var obj = {value:$(this).val(),text:$(this).text()};    
                 	options.push(obj);
                }); 
            	//模糊搜索顯示聯想到的輸入選項
            	for(var j=0;j<options.length;j++){   
            		//console.log(options[j].text+"  "+str+" "+options[j].text.indexOf(str));
            		if(options[j].text.indexOf(value) == -1){                  			
            			optionlis.eq(j).hide();
            		}else{
            			optionlis.eq(j).show();
            			maybe++;
            		}
            		if(value == options[j].text){
            			selectIndex = j;                   		
            		}
            	}
            	//判斷是否有聯想可能選項
            	if(maybe>0){
            		$this.selectAndInput("show");                    		
            	}else{
            		$this.selectAndInput("hide");
            		
            	}
            	//判斷是否有完全匹配項
            	if(selectIndex != -1){ //有完全匹配項
            		optionlis.removeClass("active");
        			optionlis.eq(selectIndex).addClass("active");
        			optionlis.eq(selectIndex).find('input').eq(0).prop("checked",true);
        			$this.val(options[selectIndex].value);               			
            	}else{//沒有完全匹配項
            		optionlis.removeClass("active");
            		$this.val('');
            	}    
            	$selectDom.find(".form-control-select").val(value);
            });
        },
        //判斷是否為新的值
        newValue: function(options) {         	   	
        	var $this = this.eq(0);
        	var text = $this.selectAndInput("getText");
        	var settings = this[0].settings;     
            if(!$this.val() && text){            	
            	return true;
            }else{           	           	
                return false;
            }       
        },
        //獲取value
        getValue: function(options) {    
        	var temp= [];
        	if(this.length>1){
        		this.each(function() {
            		var $this = $(this);
            		temp.push($this.val());
            	});
        		return temp.join(",");
        	}else{
        		return this.eq(0).val();
        	}     
        },
        //獲取text
        getText: function() {  
        	var temp = [];
        	if(this.length>1){
        		this.each(function() {
            		var $this = $(this);
            		var $selectDom = $this.next();
            		temp.push($selectDom.find(".form-control-select").val().trim());
            	});
        		return temp.join(",");
        	}else{
        		return this.eq(0).next().find(".form-control-select").val().trim();
        	}     
        },
        //隱藏下拉选择
        hide: function() {               	
            return  this.each(function() {
                var $this = $(this);            
                $this.next(".default-select").removeClass("open");               
            });
        },
        destory: function() {    	//摧毀自定義select
        	return this.each(function() {
        		var $this = $(this); 
        		$this.next(".default-select").remove();
        	});
        },
        reset: function() {    	//重置select
        	return this.each(function() {        
        		var $this = $(this);        		
        		var $selectDom = $this.next();
        		$selectDom.find("input[type='radio']").prop('checked',false);
        		$selectDom.find(".form-control-select").val(""); 
        		$this.selectAndInput("setValue","");
        		$this.val("");          		
        		$selectDom.removeClass("hasError");
        		$selectDom.find(".input-tip").html('');
        	});        
        },
        validate: function() {  
        	flag = true;
        	this.each(function() {
                var $this = $(this);   
                var settings = this.settings;
                var dom = $this.next();   
                //增加輸入錯誤提示
                if(dom.find(".input-tip").length==0){
                	if(settings.placement == "right-bottom"){
                    	dom.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                    }else{
                    	dom.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                    }
                }       
               
                //必填校驗               
                if(settings.required){                	
                	if(dom.find(".form-control-select").val().trim().length==0){           		
                		if(settings.required.message){            		
                    		dom.find(".input-tip").html('*'+settings.required.message);
                    		toastr["warning"](settings.required.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		$this.focus();
                		flag = false;
                	}
                }               
                if(!flag){
            		dom.addClass("hasError");
            	}else{
            		dom.removeClass("hasError");
            		dom.find(".input-tip").html('');
            	}
            });       
        	return flag;
        }
    };
    $.fn.selectAndInput = function() {
		  var method = arguments[0];
	      if (methods[method]) {
	          method = methods[method];
	          arguments = Array.prototype.slice.call(arguments, 1);
	      } else if (typeof(method) == 'object' || !method) {
	          method = methods.init;
	      } else {
	          $.error('Method ' + method + ' does not exist on jQuery.selectAndInput');
	          return this;
	      }
	      return  method.apply(this, arguments);
    };
    // 创建一个默认设置
    $.fn.selectAndInput.defaults = {
		 rounded: true, //左右兩端是否需要完全圓角
         placeholder: "請輸入",
         width: "100%", //可修改為"auto" 根據內容自適應寬度	
         height: "",//可設置下拉選項高度
         required: false, //是否必填
         placement: "right",//驗證提示位置
         candelete: false, //選項是否帶刪除按鈕
         ondelete: null //點擊刪除按鈕觸發
    };  
})(jQuery);


/*********************************************************
 * 功能：select美化插件
 * 作者: chendy
 * 使用方法：使用jquery選擇需要美化的select元素，調用customSelect()方法
 *         如：$(".web2-select").customSlect("init");
 ************************************************************/
;(function($) {
    var methods = {
		init: function(customs) {       	        	
            return this.each(function() {
                var $this = $(this);             
                // 使用extend方法从customs和defaults对象中构造出一个配置項放在this.settings便於其他方法引用
                this.settings = $.extend({}, $.fn.customSelect.defaults, customs);                                                       
                if($this.next(".default-select").length > 0){
                	console.log("select inited");                	
                }else{
                	$this.customSelect("build");
                }             
            });
        },
        //创建下拉选择组件
        build: function() {       	        	
            return this.each(function() {
                var $this = $(this); 
                $this.addClass("hidden");                                      
                var settings = this.settings;                                                         
                var rem = parseInt($("body").css("font-size")); //獲取根元素font-size
                var index = guid();
                var options = [];
                $this.find("option").each(function(){
                	var obj = {value:$(this).val(),text:$(this).text()};    
                	options.push(obj);
                }); 
                             
            	 var html ='';
                 html+='<div class="default-select">';
                 html+='<span class="select-arrow">'+settings.templates.arrow+'</span>';
                 //html+='	<i class="iconfont icon-icon-2 select-arrow"></i>';
                 if(settings.rounded){
                	 html+='	<input type="text" readonly="readonly" class="form-control form-control-select form-control-select-rounded" placeholder="'+settings.placeholder+'">';		        
                 }else{
                	 html+='	<input type="text" readonly="readonly" class="form-control form-control-select" placeholder="'+settings.placeholder+'">';		                    
                 }                         							
                 html+='	<div class="default-select-options">';
                 html+='		<ul>';                    
                 for(var i in options){
                 	 if(options[i].value == $this.val()){
                 		 html+='<li class="active"><label><input type="radio" checked="checked" name="select'+index+'" value="'+options[i].value+'"><span>'+options[i].text+'</span></label></li>';
                 	 }else{
                 		 html+='<li><label><input type="radio" name="select'+index+'" value="'+options[i].value+'"><span>'+options[i].text+'</span></label></li>'; 
                 	 }               	
                 }              
                 html+='		</ul>';
                 html+='	</div>';
                 html+='</div>';
                 var $selectDom = $(html);                    
                 if(settings.width=="auto"){ //當寬度設置為自適應時，根據placeholder初始化寬度                   	 
                	 var width = settings.placeholder.viewWidth()+(3*rem);
                	 $selectDom.css("width",width);
                 }
                 if(settings.height && options.length>6){ //設置下拉選項高度，超出高度滾動，需配合slimScroll插件使用
                	 $selectDom.find(".default-select-options ul").css("height",settings.height);
                	 $selectDom.find(".default-select-options ul").slimScroll({
                		height: settings.height,
                   		color: '#c1c1c1',
                   		wheelStep: 10,
                   		size: '5px', //滑塊宽度
                  	 });
                 }                    
                 $this.parent().append($selectDom);   
                 //如果有默认值，则显示默认值
                 if($selectDom.find("input[type='radio']:checked").val()){
                	 var selectedText = $selectDom.find("input[type='radio']:checked").next().text();
                	 $selectDom.find(".form-control-select").val(selectedText); 
                	 if(settings.width=="auto"){
                		 var width = selectedText.viewWidth()+(3*rem);
                    	 $selectDom.css("width",width);
                	 }                	
                 }                    
                 //初始化交互事件
                 $selectDom.find(".form-control-select").bind("click",function(e){                    
                	$this.customSelect("show");
         			e.stopPropagation();
         		});	
                $selectDom.find(".select-arrow").bind("click",function(e){                   	
                	$this.customSelect("show");
         			e.stopPropagation();
         		});	
                $selectDom.find(".default-select-options input").bind("click",function(e){                                 	
                	$selectDom.find(".default-select-options li").removeClass("active");   
                 	$(this).parent().parent().addClass("active");           
         			var value =  $selectDom.find("input[type='radio']:checked").val();
         			var name = $selectDom.find("input[type='radio']:checked").next().text();               
         			if(!value){
         				name = '';    			
                 	}              			
         			$selectDom.find(".form-control-select").val(name);
         			$selectDom.removeClass("open");  
         			if($this.val() != value){
         				$this.val(value);
             			$this.change(); 
             			$this.customSelect("validate");
         			}            			               			
         			if(settings.width=="auto"){ //當寬度設置為自適應時，根據選中值調整寬度
         			   var strlength='';
         			   name.length>settings.placeholder.length?strlength=name:strlength=settings.placeholder;
         			   var width = strlength.viewWidth()+(3*rem);
                 	   $selectDom.css("width",width);            			  
                    }
         			e.stopPropagation();
         		});                         
            });
        },
        //显示下拉选择
        show: function() {  
        	//取消document所有绑定事件
        	$(document).off("click",".default-select"); 
        	//设置点击页面任意位置，关闭select选择下拉框事件，并且最后执行此事件
        	document.addEventListener("click",function(){
    			$(".default-select").removeClass("open");
    		},false);
        	
            return  this.each(function() {
                var $this = $(this); 
                $(".default-select").not($(this).next()).removeClass("open");              
                $this.next(".default-select").toggleClass("open");               
            });
        },
        val: function(value) {    	//定義一個val()方法，取值和賦值
        	var temp = [];   
        	if(typeof value == "undefined"){
        		if(this.length>1){
            		this.each(function() {
                		var $this = $(this);
                		temp.push($this.val());
                	});
            		return temp.join(",");
            	}else{
            		return this.eq(0).val();
            	}     
        	}else{
        		return this.each(function() {
            		var $this = $(this);             		   
            		$this.next().find('.default-select-options input[value="'+value+'"]').eq(0).prop("checked",true);
                	$this.next().find('.default-select-options input[value="'+value+'"]').eq(0).click();           		         		
            	});
        	}      	 	          
        },
        destory: function() {    	//摧毀自定義select
        	return this.each(function() {
        		var $this = $(this); 
        		$this.next(".default-select").remove();
        	});
        },
        //禁用 true/false
        disabled: function(flag){
        	return this.each(function() {
        		var $this = $(this); 
        		var $selectDom = $this.next();
        		if(flag){
        			$selectDom.find(".select-arrow").off("click").addClass("disabled");
        			$selectDom.find(".form-control-select").val("").prop("disabled",true).prop("readonly",true);
            		$selectDom.find(".default-select-options").remove();
        		}else{
        			$this.customSelect("reBuild");
        		}        		
        	});       
        },
        reBuild: function(customs) {     
            return this.each(function() {
                var $this = $(this);             
                $this.next(".default-select").remove();       
                $this.customSelect("build");             
            });
        },
        reset: function() {    	//重置select
        	return this.each(function() {        
        		var $this = $(this); 
        		var $selectDom = $this.next();
        		var text = $selectDom.find("input[type='radio']").eq(0).text();
        		var value = $selectDom.find("input[type='radio']").eq(0).val();
        		$this.val(value); 
        		$selectDom.find(".form-control-select").val(text);
        		$selectDom.find("input[type='radio']").eq(0).prop('checked',true);
        		$selectDom.find("input[type='radio']").eq(0).click();    
        		$selectDom.removeClass("hasError");
        		$selectDom.find(".input-tip").html('');
        	});        
        },
        validate: function() {  
        	flag = true;
        	this.each(function() {
                var $this = $(this);   
                var settings = this.settings;
                var dom = $this.next();   
                //增加輸入錯誤提示
                if(dom.find(".input-tip").length==0){
                	if(settings.placement == "right-bottom"){
                    	dom.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                    }else{
                    	dom.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                    }
                }       
               
                //必填校驗               
                if(settings.required){                	
                	if($this.val().trim().length==0){           		
                		if(settings.required.message){            		
                    		dom.find(".input-tip").html('*'+settings.required.message);
                    		toastr["warning"](settings.required.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		$this.focus();
                		flag = false;
                	}
                }         
                
                //自定義校驗器
                var validator = settings.validator;
        		if(validator){    			
        			if(typeof validator === 'function'){
        				flag = validator($this);
                    }         	
        		}
                
                if(!flag){
            		dom.addClass("hasError");
            	}else{
            		dom.removeClass("hasError");
            		dom.find(".input-tip").html('');
            	}
            });       
        	return flag;
        }
    };
    $.fn.customSelect = function() {
		  var method = arguments[0];
	      if (methods[method]) {
	          method = methods[method];
	          arguments = Array.prototype.slice.call(arguments, 1);
	      } else if (typeof(method) == 'object' || !method) {
	          method = methods.init;
	      } else {
	          $.error('Method ' + method + ' does not exist on jQuery.customSelect');
	          return this;
	      }
	      return  method.apply(this, arguments);
    };
    // 创建一个默认设置
    $.fn.customSelect.defaults = {
		 rounded: true, //左右兩端是否需要完全圓角
         placeholder: "請選擇",
         width: "100%", //可修改為"auto" 根據內容自適應寬度	
         height: "",//可設置下拉選項高度
         required: false, //是否必填
         placement: "right", //驗證提示位置
         validator: false, //自定義校驗
         templates:{
        	 arrow: '<i class="iconfont icon-icon-2"></i>'
         }
    };  
})(jQuery);

/*********************************************************
 * 功能：時分選擇組件
 * 作者: chendy
 * 使用方法：使用jquery初始化一个时分选择器，需跟配套的组件html代码使用
 *         如：$***.timeSelect();
 ************************************************************/
;(function($) {
    var methods = {
        init: function(options) {        
            return this.each(function() {
                var $this = $(this);
                // 使用extend方法从customs和defaults对象中构造出一个配置項放在this.settings便於其他方法引用
                this.settings = $.extend({}, $.fn.timeSelect.defaults, options);                            
                var settings = this.settings; 
                this.viewDate = new Date(TPGlobal.getDatetime(0));
                this.dateTime = null; 
                //set startTime
                if(settings.startTime){               	 
               	  $this.timeSelect("setStartTime",settings.startTime);
                }
               //set endTime
                if(settings.endTime){               	 
               	  $this.timeSelect("setEndTime",settings.endTime);
                }
                $this.on("click",function(e){   
                	$this.find("input").focus();                	      		
                	$this.timeSelect("show");              	
         			e.stopPropagation();
         		});	
            });
        },
        //显示下拉选择
        show: function() {
        	 //取消document所有绑定事件
        	 $(document).off("click",".time-options"); 
        	 //设置除点击组件以外页面任意位置，关闭时间选择下拉框事件，并且优先执行此事件
        	 document.addEventListener("click",function(e){    
        		 var _con = $('.time-options '); 
        		 if(!_con.is(e.target) && _con.has(e.target).length === 0){      
        			 $(".time-options").remove();
        		 }    			
    		 },true);
        	 
        	 return this.each(function() {         		
        		var picker = this;
        		picker.panel = $(TPGlobal.templet);//每次呈现重新创建picker
                var $this = $(this);   
                var settings = picker.settings;
                var rem = parseInt($("body").css("font-size")); //獲取根元素font-size
                var offset = $this.offset();
                var top = offset.top + (2.6*rem);
                var left = offset.left;              
                var $dom = this.panel;       
         
                $this.timeSelect("fillDates"); 
                $this.timeSelect("fillTimes");     
                //set startTime
                if(settings.startTime){               	 
               	  $this.timeSelect("setStartTime",settings.startTime);
                }
               //set endTime
                if(settings.endTime){               	 
               	  $this.timeSelect("setEndTime",settings.endTime);
                }
                $dom.css({"top":top,"left":left}); 
                $("body").append($dom); 
                
                //滾動至選定值位置
                var hourContainer =  $dom.find(".option-list").eq(0);
                var minuteContainer =  $dom.find(".option-list").eq(1);
                var hourActive = hourContainer.find('.active').eq(0);
                var minuteActive = minuteContainer.find('.active').eq(0);
                var hourbar = $dom.find('.hour-list .slimScrollBar').eq(0);
                var minutebar =  $dom.find('.minute-list .slimScrollBar').eq(0);
                if(hourActive.length && minuteActive.length){
                	TPGlobal.scrollbar(hourContainer,hourActive,hourbar);
                	TPGlobal.scrollbar(minuteContainer,minuteActive,minutebar);
                }               
            });                  
        },
        //填充日期切换面板
        fillDates: function(){
        	 return this.each(function() { 
        		 var picker = this;
                 var $this = $(this);
                 var settings = picker.settings;
         		 var $dom = picker.panel;
         		 var dateTime = picker.dateTime; if(dateTime){picker.viewDate = dateTime;}  
         		 var viewDate = picker.viewDate;         		 
         		 
         		 $dom.find(".prev").html(settings.icons.leftArrow);
                 $dom.find(".next").html(settings.icons.rightArrow);
                 $dom.find(".view-date").html(TPGlobal.formatDate(viewDate,settings.dateFormat));
                 $dom.find(".view-date").attr("data-date",TPGlobal._zero_time(viewDate).getTime());
                 if(settings.showDate){
                 	$dom.addClass("with-date");
                 }else{
                 	$dom.find(".date-options-header").hide();
                 }            
                 //click on prev day
                 $dom.find(".prev").off().on("click",function(){
                 	var date = $dom.find(".view-date").attr("data-date");
                 	date = TPGlobal.getDatetime(1,parseInt(date));                    	
                 	$this.timeSelect("setDate",date);
                 	$this.timeSelect("show");
                 });
                 //click on next day
                 $dom.find(".next").off().on("click",function(){
                 	var date = $dom.find(".view-date").attr("data-date");
                 	date = TPGlobal.getDatetime(-1,parseInt(date));                    	
                 	$this.timeSelect("setDate",date);
                 	$this.timeSelect("show");
                 });               
        	 });
        },
        //填充时分选择面板
        fillTimes: function(unreload){
        	 return this.each(function() { 
        		var picker = this;
                var $this = $(this);
                var settings = picker.settings;
        		var $dom = picker.panel;
        		var dateTime = picker.dateTime; if(dateTime){picker.viewDate = dateTime;}  
        		var viewDate = picker.viewDate;
        		if(!unreload){
        			var hoursList = '';
                 	var minutesList = '';
                     for(var i=0;i<60;i++){               	
                     	if(i<10){
                     		hoursList+='<li data-hour="'+i+'">0'+i+'</li>';
                     		minutesList+='<li data-minute="'+i+'">0'+i+'</li>';
                     	}else if(i<24){
                     		hoursList+='<li data-hour="'+i+'">'+i+'</li>';
                     		minutesList+='<li data-minute="'+i+'">'+i+'</li>';
                     	}else{
                     		minutesList+='<li data-minute="'+i+'">'+i+'</li>';
                     	}             	
                     } 
                     $dom.find(".option-list").eq(0).html(hoursList);
                     $dom.find(".option-list").eq(1).html(minutesList); 
                     $dom.find(".option-list").slimScroll({
                  		height: '100%',
                  		color: '#c1c1c1',
                  		wheelStep: 10,
                  		size: '4px',
                  		distance: '2px'
                 	 }); 
        		 }else{
        			 $dom.find('[data-hour]').removeClass("active");
                  	 $dom.find('[data-minute]').removeClass("active");
        		 }    		                                             
                 var hour = 0;
                 var minute = 0;
                 if(dateTime){
                 	hour = dateTime.getHours();
                 	minute = dateTime.getMinutes();                 	
                 	$dom.find('[data-hour="'+hour+'"]').addClass("active");
                 	$dom.find('[data-minute="'+minute+'"]').addClass("active");
                 } 
                 //click on hour
                 $dom.find(".hour-list li").off().on("click",function(e){
                	if($(this).hasClass("disabled")){return;}
                 	var hour = $(this).attr("data-hour");
                 	$this.timeSelect("setHour",hour);                    	                	
                 	$(this).siblings().removeClass("active");
                 	$(this).addClass("active");                  
                 	 //set startTime
                    if(settings.startTime){               	 
                   	    $this.timeSelect("setStartTime",settings.startTime);
                    }
                   //set endTime
                    if(settings.endTime){               	 
                   	    $this.timeSelect("setEndTime",settings.endTime);
                    }
                 	/*if(settings.autoclose){
		         		$this.timeSelect("hide");
		         	} */
                 	e.stopPropagation();
                 });
                 //click on minute
                 $dom.find(".minute-list li").off().on("click",function(e){  
                	if($(this).hasClass("disabled")){return;}
                 	var minute = $(this).attr("data-minute");
                 	$this.timeSelect("setMinute",minute);   
                 	
                 	$(this).siblings().removeClass("active");
                 	$(this).addClass("active");                	             
                 	
                 	if(settings.autoclose){
                 		$this.timeSelect("hide");
                 	} 
                 	e.stopPropagation();               	
                 });  
        	 });
        },
        //设置开始时间
        setStartTime: function(time){
        	 if(!time){return this}
        	 return this.each(function() {
        		 var picker = this; 
        		 if(!(time instanceof Date)) {time = new Date(time);} 
        		 picker.settings.startTime = time;        		 
         		 var $dom = picker.panel;         		
         		 if($dom){ 			 
	         		 var timestamp = $dom.find(".view-date").attr("data-date");           		  
	         		 if(time.getTime() < parseInt(timestamp)){
	         			$dom.find(".prev").css("visibility","visible");
	         		 }else{	         			
	         			if(time.getTime() > picker.viewDate.getTime()){  
	         				if(picker.dateTime){$(picker).timeSelect("setTime",time)};         				
	             			$(picker).timeSelect("fillTimes",true); 
	         			}         
	         			$dom.find(".prev").css("visibility","hidden");
	         			var hour = time.getHours(); 
	         			var minute = time.getMinutes();	 	         			
	         			$dom.find('[data-hour]:lt('+hour+')').addClass("disabled");
	         			$dom.find('[data-minute]').removeClass("disabled");
	         			if(hour >= picker.viewDate.getHours()){
	         				$dom.find('[data-minute]:lt('+minute+')').addClass("disabled");
	         			}
	         			if(picker.settings.disabledMode == 'hide'){
	         				$dom.find('[data-hour]:lt('+hour+')').hide();
		         			$dom.find('[data-minute]').show();
		         			if(hour >= picker.viewDate.getHours()){
		         				$dom.find('[data-minute]:lt('+minute+')').hide();
		         			}
	         			}
	         		 }
         		 }
         		if(time.getTime() > picker.viewDate.getTime()){
         			picker.viewDate = time;
         		}
        	 });
        },
        //设置结束时间
        setEndTime: function(time){
        	 if(!time){return this}
        	 return this.each(function() { 
        		 var picker = this;
        		 if(!(time instanceof Date)) {time = new Date(time);}  
        		 picker.settings.endTime = time;        		 
                 var settings = picker.settings;
         		 var $dom = picker.panel;
         		 if($dom){
         			var timestamp = $dom.find(".view-date").attr("data-date");         		 
            		 timestamp = TPGlobal.getDatetime(-1,parseInt(timestamp));
            		 if(time.getTime() >= timestamp){
            			$dom.find(".next").css("visibility","visible");
            		 }else{
            			if(time.getTime() < picker.viewDate.getTime()){
            				if(picker.dateTime){$(picker).timeSelect("setTime",time)};            				            			
            				$(picker).timeSelect("fillTimes",true);
            			}     				
            			$dom.find(".next").css("visibility","hidden");
            			var hour = time.getHours(); 
            			var minute = time.getMinutes();
            			$dom.find('[data-hour]:gt('+hour+')').addClass("disabled");             			
            			if(!(settings.startTime && (TPGlobal._zero_time(settings.startTime).getTime() == TPGlobal._zero_time(settings.endTime).getTime()))){            				     
            				$dom.find('[data-minute]').removeClass("disabled");
            			}    			
            			if(hour <= picker.viewDate.getHours()){
            				$dom.find('[data-minute]:gt('+minute+')').addClass("disabled");
            			}  
            			if(picker.settings.disabledMode == 'hide'){
            				$dom.find('[data-hour]:gt('+hour+')').hide();  
                			if(!(settings.startTime && (TPGlobal._zero_time(settings.startTime).getTime() == TPGlobal._zero_time(settings.endTime).getTime()))){            				
                				$dom.find('[data-minute]').show();
                			}    			
                			if(hour <= picker.viewDate.getHours()){
                				$dom.find('[data-minute]:gt('+minute+')').hide();
                			}  
            			}
            		 } 
         		 }  
         		 if(settings.startTime && (settings.startTime.getTime() > picker.viewDate.getTime())){
         			picker.viewDate = time;return;
         		 }
         		 if(time.getTime() < picker.viewDate.getTime()){
         			picker.viewDate = time;
         		 }
        	 });
        },
        //隐藏下拉选择
        hide: function() {        	          
		    $(".time-options").remove();
            return this;
        },
        //重置
        reset: function() {        	          		   
        	return this.each(function(){
        		this.viewDate = new Date(TPGlobal.getDatetime(0));
                this.dateTime = null;
        		$this = $(this);
        		$this.find("input").val('');
        		$this.removeClass("hasError");
        		$this.find("input-tip").remove();
        	});
        },
        //设置时间
        setTime: function(time) {  
        	if(!time){return this}
        	return this.each(function(){
        		var picker = this;
        		var viewDate = picker.viewDate;
        		var settings = this.settings;
        		if(!(time instanceof Date)) {
        			time = new Date(time);
    			}
        		picker.viewDate = time;
        		picker.dateTime = time;
        		
        		if(settings.showDate){
            		$(picker).find("input").val(TPGlobal.formatDate(picker.dateTime,settings.dateFormat+" HH:mm")).focus();
            	}else{
            		$(picker).find("input").val(TPGlobal.formatDate(picker.dateTime,"HH:mm")).focus();
            	}

        		if(viewDate.getTime()!=time.getTime()){
        			$(picker).trigger("changeTime");//發布一個changeTime事件
        		}     		              		        		
        	});
        },
        //获得时间戳
        getTime: function() {   
        	var picker = this.get(0);
        	if(picker.dateTime){
        		return new Date(picker.dateTime).getTime();
        	}else{
        		return '';
        	}       	
        },
        //获取指定日期时间戳
        getMs: function(option) { 
        	var picker = this.get(0);       	
        	$(picker).timeSelect("setDate",option);
        	var ms = $(picker).timeSelect("getTime");    
        	return ms;
        },
        //设置日期
        setDate: function(option) {   
        	if(!option){return this}
        	return this.each(function(){
        		var picker = this;
        		var settings = this.settings;
        		var viewDate = picker.viewDate;
        	       		        		
        		var date;
            	if(option && !(option instanceof Date)) {
                	date = new Date(option);
        		}else{    			
        			date = option;
        		}   
            	
            	date.setHours(viewDate.getHours()); 
            	date.setMinutes(viewDate.getMinutes()); 
            	date.setSeconds(0); 
            	date.setMilliseconds(0); 
            	
            	$(picker).timeSelect("setTime",date);
      		        	      		
        	  	return this;
        	});              	        	   
        },
        //设置小时
        setHour: function(hour) {   
        	if(!hour){return this}
        	return this.each(function(){
        		var picker = this;
        		var $dom = picker.panel;
        		var viewDate = picker.viewDate;       	       		        		
        		var timestamp = $dom.find(".view-date").attr("data-date");
             	var date = new Date(parseInt(timestamp));
             	date.setHours(hour); 
             	date.setMinutes(viewDate.getMinutes()); 
             	            	
            	$(picker).timeSelect("setTime",date);
      		        	      		
        	  	return this;
        	});  
        },
    	//设置分钟
        setMinute: function(minute) {   
        	if(!minute){return this}
        	return this.each(function(){
        		var picker = this;
        		var $dom = picker.panel;
        		var viewDate = picker.viewDate;       	       		        		
        		var timestamp = $dom.find(".view-date").attr("data-date");                	
             	var date = new Date(parseInt(timestamp));
             	date.setHours(viewDate.getHours()); 
             	date.setMinutes(minute); 
             	
            	$(picker).timeSelect("setTime",date);    		        	      		
        	  	return this;
        	}); 
        },
        //设置错误提示
        hasError: function(options) {        	          		   
        	return this.each(function(){
        		  var $this = $(this);        		
                  // 创建一个默认设置对象
                  var defaults = {
                	   message: "",
                	   placement: "right-bottom"
                  };          
                  // 使用extend方法从options和defaults对象中构造出一个settings对象
                  var settings = $.extend({}, defaults, options);
                  //增加輸入錯誤提示                
                  if(settings.message){               	 
                	  if(settings.placement == "right-bottom"){
                		  $this.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                      }else{
                    	  $this.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                      }
                	  $this.find(".input-tip").html('*'+settings.message);
                	  toastr["warning"](settings.message);
                  }
                  $this.addClass("hasError");
        	});
        },
        //移除错误提示
        removeError: function() {        	          		   
        	return this.each(function(){
        		  var $this = $(this);
    			  $this.removeClass("hasError");
    			  $this.find("input-tip").remove();        		              
        	});
        }
    };
    
    //創建插件
    $.fn.timeSelect = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.timeSelect');
            return this;
        }
        return  method.apply(this, arguments);
    };
    //默认配置
    $.fn.timeSelect.defaults = {
    	autoclose: true,  //是否自動關閉 
    	showDate: false,
    	startTime: false,
    	endTime: false,
    	dateFormat: "yyyy/MM/dd",
    	disabledMode: "disabled",//禁用選項呈現模式，disabled/hide：禁用/隱藏
    	icons:{
    		leftArrow:'&#xe61d;',
    		rightArrow:'&#xe61b;'
    	}
    };
    // 全局方法
    var TPGlobal = {
    	templet: '<div class="time-options iconfont"><div class="date-options-header"><div class="prev">&#xe61d;</div><div class="view-date">--/--/--</div><div class="next">&#xe61b;</div></div><div class="time-options-header"><div>時</div><div>分</div></div><div class="time-options-body"><div class="hour-list"><ul class="option-list"></ul></div><div class="minute-list"><ul class="option-list"></ul></div></div></div>',  		  
    	getDatetime:function(n,date){
    		if(!(date instanceof Date) && date) {
				date = new Date(date);
			}else{
				date = new Date();
			}
    		var now=new Date(date.setHours(0, 0, 0, 0));
    		now.setDate(now.getDate()-n);	
    		var year=now.getFullYear();
    		var month=now.getMonth()+1;
    		var date=now.getDate();
    		return now.getTime();
    	},
    	_zero_time: function(date){
         	return date && new Date(date.getFullYear(), date.getMonth(), date.getDate());
        },
    	formatDate:function(date, format) {  		
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
		},
		scrollbar: function(container, scrollTo, bar) {           
            var delta = parseInt(scrollTo.position().top);
            var maxTop = container.outerHeight() - bar.outerHeight();                   
            var offsetTop = delta / container[0].scrollHeight * container.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({top: offsetTop + "px"});
            container.scrollTop(delta);      
        }
    };
    $.fn.timeSelect.TPGlobal = TPGlobal;
})(jQuery);

/*********************************************************
 * 功能：日期选择组件
 * 作者: chendy
 * 使用方法：使用jquery初始化一个日期选择器素，需跟配套的组件html代码使用
 *         如：$***.dateSelect();
 * 说明：该组件是基于bootstrap-datepicker插件改造而来，页面需先引入
 *      原插件后使用，初始化可配置参数可参考原插件的配置项，原插件方法可通过
 *      $****.dateSelect("datepicker","methodName")继续使用。新增方法则使用
 *      $****.dateSelect("methodName")使用
 ************************************************************/
;(function($) {
    var methods = {
    	//初始化
        init: function(options) {       	
            return this.each(function() {
                var $this = $(this);
                // 创建一个默认设置对象
                var defaults = {}; 
                // 使用extend方法从options和defaults对象中构造出一个配置項放在this.settings便於其他方法引用
                this.settings = $.extend({}, defaults, options);                            
                var settings = this.settings; 
                $this.find("input").datepicker(settings);                
                $this.on("click",function(e){
                	$this.find("input").focus();
                	$this.find("input").datepicker('show');	
            		e.stopPropagation();
             	});	              
            });
        },
        //调用原插件方法
        datepicker: function(method,options) {         	
        	if(options){
        		return this.each(function() {
                    var $this = $(this);                        
                    $this.find("input").datepicker(method,options);                                                           
                });
        	}else{
        		return this.find("input").datepicker(method);
        	}        	
        },
        //重置
        reset: function() {        	          		   
        	return this.each(function(){
        		$this = $(this);
        		$this.find("input").val('');
        		$this.removeClass("hasError");
        		$this.find("input-tip").remove();
        	});
        },        
        getMs: function() {  
        	return Date.parse(this.find("input").datepicker("getDate"));        	
        },
        //设置错误提示
        hasError: function(options) {        	          		   
        	return this.each(function(){
        		  var $this = $(this);        		
                  // 创建一个默认设置对象
                  var defaults = {
                	   message: "",
                	   placement: "right-bottom"
                  };          
                  // 使用extend方法从options和defaults对象中构造出一个settings对象
                  var settings = $.extend({}, defaults, options);
                  //增加輸入錯誤提示                
                  if(settings.message){               	 
                	  if(settings.placement == "right-bottom"){
                		  $this.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                      }else{
                    	  $this.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                      }
                	  $this.find(".input-tip").html('*'+settings.message);
                	  toastr["warning"](settings.message);
                  }
                  $this.addClass("hasError");
        	});
        },
        //移除错误提示
        removeError: function() {        	          		   
        	return this.each(function(){
        		  var $this = $(this);
    			  $this.removeClass("hasError");
    			  $this.find("input-tip").remove();        		              
        	});
        }
    };
    $.fn.dateSelect = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.dateSelect');
            return this;
        }
        return  method.apply(this, arguments);
    }
})(jQuery);

/*********************************************************
 * 功能：搜索输入框插件
 * 作者: chendy
 * 使用方法：使用jquery選擇需要变成搜索框的的input元素，調用searchInput()方法
 *         如：$("#search-club-user").searchInput("init");
 ************************************************************/
;(function($) {
    var methods = {
        init: function(options) {       	
            return this.each(function() {
                var $this = $(this);
                // 创建一个默认设置对象
                var defaults = {
                 onclear:  function() {},
                 onsearch: function() {},
                 onenter: function() {}
                }          
                // 使用extend方法从options和defaults对象中构造出一个settings对象
                var settings = $.extend({}, defaults, options);
                
                $this.wrap('<div class="search-input-group"></div>');
                var searchDom = $this.parent();
                searchDom.append('<div class="search-input-append"><span class="iconfont icon-icon-46"></span></div><div class="search-input-remove">×</div>');
                $this.removeClass("invisible");
                $this.keyup(function(){
                	if($this.val().length>0){
                		searchDom.addClass("active");
                	}else{
                		searchDom.removeClass("active");
                	}
                });  
                $this.keydown(function(e) {  
                    if (e.keyCode == 13) {  
                    	settings.onenter.call();
                    }  
                });                 
                searchDom.find(".search-input-remove").bind("click",function(){
                	$this.val('');
                	searchDom.removeClass("active");
                	settings.onclear.call();
                });
                searchDom.find(".search-input-append").bind("click",function(){              
                	settings.onsearch.call();
                });
            });
        }       
    };
    $.fn.searchInput = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.searchInput');
            return this;
        }
        return  method.apply(this, arguments);
    }
})(jQuery);

/*********************************************************
 * 功能：自定義输入框檢驗插件
 * 作者: chendy
 * 使用方法：
 ************************************************************/
;(function($) {
    var methods = {
        init: function(options) {                   	
            return this.each(function() {
                var $this = $(this);                  
                // 使用extend方法从options和defaults对象中构造出一个配置項放在this.options便於其他方法引用
                this.options = $.extend({}, $.fn.customValidator.defaults, options);              
                var settings = this.options;
                $this.wrap('<div class="validate-input"></div>');
                var dom = $this.parent(); 
                //增加輸入框剩餘輸入字數顯示
                if(settings.maxlength){
                	dom.append('<span class="word-num word-num-right">'+settings.maxlength.num+'</span>');                 
                }    
                //增加輸入錯誤提示
                if(settings.placement == "right-bottom"){
                	dom.append('<span class="input-tip input-tip-right-bottom"></span>');//在右下方提示
                }else{
                	dom.append('<span class="input-tip input-tip-right"></span>');//在右側提示
                }
                
                //增加校驗
            	$this.keyup(function(){
            		var flag = true;
            		var callback = false;
            		//输入字数校验  
            		if(settings.maxlength){
            			var num = settings.maxlength.num - $this.val().trim().length;
                    	dom.find(".word-num").html(num>0?num:0);                    	
                    	if(num<0){flag = false;} 
                    	if(num<0 && settings.maxlength.message){
                    		dom.find(".input-tip").html('*'+settings.maxlength.message);
                    	}	
                    	if(num<0 && settings.maxlength.callback){
                    		var callback = settings.maxlength.callback;                    		
                    	}
            		} 
            		//必填校验  
            		if(settings.required){                    	
	            		var num = $this.val().trim().length;
	                	if(num==0){flag = false;} 
	                	if(num==0 && settings.required.message){
	                		dom.find(".input-tip").html('*'+settings.required.message);
	                	}	                                 	
                    }
            		
            		flag ? dom.removeClass("hasError") : dom.addClass("hasError");
            		if(typeof callback === 'function'){
            			callback($this);
                    }
            	});
                                                                                      
            });
        },
        validate: function() {  
        	flag = true;
        	this.each(function() {
                var $this = $(this);   
                var settings = this.options;
                var dom = $this.parent();
                //輸入字數校驗
                if(settings.maxlength){
                	var num = settings.maxlength.num - $this.val().trim().length;
                	dom.find(".word-num").html(num>0?num:0);
                	if(num<0){                		
                		if(settings.maxlength.message){            		
                    		dom.find(".input-tip").html('*'+settings.maxlength.message);
                    		toastr["warning"](settings.maxlength.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		flag = false;
                	}               	
                }
                //必填校驗               
                if(settings.required){
                	if($this.val().trim().length==0){           		
                		if(settings.required.message){            		
                    		dom.find(".input-tip").html('*'+settings.required.message);
                    		toastr["warning"](settings.required.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}                		
                		flag = false;
                	}
                }
                //自定義校驗器
                var validator = settings.validator;
        		if(validator){        			    			
        			if(typeof validator === 'function'){
        				flag = validator($this);
                    }         	
        		}
                
                if(!flag){
            		dom.addClass("hasError");
            		$this.focus();
            	}else{
            		dom.removeClass("hasError");
            		dom.find(".input-tip").html('');
            	}
            });       
        	return flag;
        },
        //重置
        reset : function(){       	
    		return this.each(function(){
    			var $this = $(this);  
    			var dom = $this.parent();
    			$this.val('');
    			dom.removeClass("hasError");
        		dom.find(".input-tip").html('');
    		});       	        	
        },
    };
        
    $.fn.customValidator = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.customValidator');
            return this;
        }
        return  method.apply(this, arguments);
    };
    // 创建一个默认设置
    $.fn.customValidator.defaults = {
    	required: false,
	    maxlength: false,
	    placement: "right",
	    validator: false //自定義校驗
    };  
})(jQuery);

/*********************************************************
 * 功能：多行输入框檢驗插件
 * 作者: chendy
 * 使用方法：
 ************************************************************/
;(function($) {
    var methods = {
    	//初始化
        init: function(options) {                   	
        	return this.each(function() {
                var $this = $(this); 
                // 使用extend方法从options和defaults对象中构造出一个配置項放在this.options便於其他方法引用
                this.options = $.extend({}, $.fn.multilineInput.defaults, options);              
                var settings = this.options;
                $this.addClass("multiline-input-content").attr("contenteditable","true");
                $this.wrap('<div class="multiline-input"></div>');
                var dom = $this.parent(); 
                $this.focus(function(){
                	dom.addClass("active");
                	if(typeof settings.onfocus === 'function'){
                		settings.onfocus.call($this);
                    }
                });
                $this.blur(function(){
                	dom.removeClass("active");
                	if(typeof settings.onblur === 'function'){
                		settings.onblur.call($this);
                    }
                });
                //自定义最大显示行数
                if(settings.rows){
                	var rem = parseInt($("body").css("font-size"));               
                	var rows = parseInt(settings.rows);               	
                	var maxheigth = ((rows*1.5+0.75)*rem + 2)+"px";
                	var maxheigthInner = ((rows*1.5)*rem + 2)+"px";
                	dom.css("max-height",maxheigth);
                	$this.css("max-height",maxheigthInner);
                	if(settings.fixed){
                		dom.css("min-height",maxheigth);
                    	$this.css("min-height",maxheigthInner);
                	}
                }else{
                	dom.addClass("multiline-default");
                }                            
                $(this).slimScroll({
             		height: '100%',
             		color: '#c1c1c1',
             		wheelStep: 10,
             		alwaysVisible: false            		
            	 });
                //增加輸入框剩餘輸入字數顯示
                if(settings.maxlength){
                	$this.addClass("has-word-num");
                	dom.append('<span class="word-num word-num-right-bottom">'+settings.maxlength.num+'</span>'); 
                }
                //增加輸入錯誤提示
                if(settings.placement == "right-bottom"){
                	dom.append('<span class="input-tip input-tip-right-bottom"></span>'); //在右下方提示
                }else{
                	dom.append('<span class="input-tip input-tip-right"></span>'); //在右側提示
                }
                //增加默認placeholder
            	if(settings.placeholder){          	
            		$this.on("keydown keyup",function(){
                		//控制placeholder呈現
                    	if(settings.placeholder){
                    		if($this.text().length>0){
                    			dom.find('.input-placeholder').remove();
                    		}else{
                    			if(dom.find('.input-placeholder').length==0){
                    				var placeholder = $('<span class="input-placeholder">'+settings.placeholder+'</span>');
                            		placeholder.click(function(){$this.focus()});
                            		dom.append(placeholder);
                    			}
                    		}             		
                    	}
                	});
            		$this.keydown();
            	}	
            	//增加輸入校驗
                $this.keyup(function(){   
                	var flag = true;                 	
                	//输入字数校验
                	if(settings.maxlength){
                		var num = settings.maxlength.num - $this.text().trim().length;
                    	dom.find(".word-num").html(num>0?num:0);                    	
                    	if(num<0){flag = false;} 
                    	if(num<0 && settings.maxlength.message){
                    		dom.find(".input-tip").html('*'+settings.maxlength.message);
                    	}	    
                    	if(num<0 && settings.maxlength.callback){
                    		var callback = settings.maxlength.callback;
                    		if(typeof callback === 'function'){
                    			callback($this);
                            }
                    	}
                    } 
                	//必填校验  
            		if(settings.required){                    	
	            		var num = $this.text().trim().length;
	                	if(num==0){flag = false;} 
	                	if(num==0 && settings.required.message){
	                		dom.find(".input-tip").html('*'+settings.required.message);
	                	}	                                 	
                    }
            		flag ? dom.removeClass("hasError") : dom.addClass("hasError");
            	});                               
        	});
        },
        //校验输入值
        validate: function() {  
        	flag = true;
        	this.each(function() {
                var $this = $(this);   
                var settings = this.options;
                var dom = $this.parent().parent();
                //輸入字數校驗
                if(settings.maxlength){
                	var num = settings.maxlength.num - $this.text().trim().length;
                	dom.find(".word-num").html(num>0?num:0);
                	if(num<0){                		
                		if(settings.maxlength.message){            		
                    		dom.find(".input-tip").html('*'+settings.maxlength.message);
                    		toastr["warning"](settings.maxlength.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		$this.focus();
                		flag = false;
                	}               	
                }
                //必填校驗               
                if(settings.required){
                	if($this.text().trim().length==0){           		
                		if(settings.required.message){            		
                    		dom.find(".input-tip").html('*'+settings.required.message);
                    		toastr["warning"](settings.required.message);
                    	}else{
                    		dom.find(".input-tip").html('');
                    	}
                		$this.focus();
                		flag = false;
                	}
                }
                if(!flag){
            		dom.addClass("hasError");
            	}else{
            		dom.removeClass("hasError");
            		dom.find(".input-tip").html('');
            	}
            });       
        	return flag;
        },
        //获取输入框值/给输入框赋值
        val : function(value){
        	if(typeof value == "undefined"){
        		var str = '';
            	this.each(function(){
            		str+=$(this).text().trim();
            	});
            	return str;
        	}else{
        		return this.each(function(){
        			var $this = $(this);  
        			$this.html(value);
        			$this.keyup();
        			moveEnd($this);
        		});
        	}        	
        },
        //获取输入的html文本
        html : function(){
        	var html = '';
        	this.each(function(){
        		html+=$(this).html();
        	});
        	return html;
        },
        //重置
        reset : function(){       	
    		return this.each(function(){
    			var $this = $(this);  
    			var dom = $this.parent().parent();
    			$this.html('');
    			dom.removeClass("hasError");
        		dom.find(".input-tip").html('');
    		});       	        	
        }
    };
    
    $.fn.multilineInput = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.multilineInput');
            return this;
        }
        return  method.apply(this, arguments);
    };
    
    // 创建一个默认设置
    $.fn.multilineInput.defaults = {
    	rows: 4, //最大顯示行數
    	fixed: false,  //是否固定最大顯示行數顯示
    	required: false, //必填校驗
	    maxlength: false, //最大輸入字數	  
	    onfocus: false, //獲取焦點觸發事件
	    onblur: false, // 失去焦點觸發事件
	    placement: "right", //錯誤提示顯示位置
	    placeholder: false //輸入框placeholder
    };  
})(jQuery);

/*********************************************************
 * 功能：公共分頁插件
 * 作者: chendy
 * 使用方法：使用jquery選擇需要变成分頁的div元素，調用customPagenav()方法
 *         如：$("#pagination_bar").customPagenav("init");
 *         當頁數發生變化時，需調用：
 *         $("#pagination_bar").customPagenav('changePage',{
    		   funcName: 'customMethodName', //自定義頁數變化需調用的方法
    		   pageIndex: 1, //頁數
    		   pageSize: 6, //一頁顯示多少條
    		   total: 100 //一共多少條數據
    	   });
 ************************************************************/
;(function($) {
    var methods = {
        init: function(options) {       	
            return this.each(function() {
                var $this = $(this);
                // 创建一个默认设置对象
                var defaults = {
                	pageTotal:  true, //是否展示 共**頁 
                	pageJump: true,  //是否展示 跳至**頁          
                	algin: 'right' //分頁位置，left/center/right
                }          
                // 使用extend方法从options和defaults对象中构造出一个settings对象
                var settings = $.extend({}, defaults, options);                
                $this.addClass('page-navigation');
                var html='<div class="page-total">共 <span class="text-dark page-conut">1</span> 頁</div><div class="page-jump">跳至<input class="form-control page-jump-input" value="1" />頁 <button class="btn btn-rounded btn-outline-default page-jump-btn">Go</button></div><div class="page-nav"><ul class="pagination"><li class="disabled"> <a class="page-nav-link previous" href="javascript:void(0)"></a></li><li class="active"><a class="page-nav-link" href="javascript:void(0)">1</a></li><li><a class="page-nav-link next" href="javascript:void(0)"></a></li></ul>';
                $this.append(html); 
                if(!settings.pageTotal){ $this.find(".page-total").hide(); };
                if(!settings.pageJump){ $this.find(".page-jump").hide(); }
                if(settings.algin=='left'){
                	$this.addClass("justify-content-start")
                }else if(settings.algin=='center'){
                	$this.addClass("justify-content-center")
                }else{}
            });
        },
        changePage: function(options) {       	
            return this.each(function() {
                var $this = $(this);
                // 创建一个默认设置对象
                var defaults = {
                	funcName:  'void', //當前頁改變時要執行的方法名
                	pageIndex: 1,  //是否展示 跳至**頁         
                	pageSize: 6, //一頁顯示多少條
                	total: 0 //總記錄數
                }          
                // 使用extend方法从options和defaults对象中构造出一个settings对象
                var settings = $.extend({}, defaults, options); 
                
                if(parseInt(settings.total) > 0){
                	$this.show();
                }else{
                	$this.hide();
                }
                
                var pageCount = Math.floor((parseInt(settings.total) + settings.pageSize - 1) / settings.pageSize);        
        		var beginPageIndex = 1,endPageIndex = 5;
        		if (parseInt(pageCount) <= 5) {
        			beginPageIndex = 1;
        			endPageIndex = parseInt(pageCount);
        		} else {
        			beginPageIndex = parseInt(settings.pageIndex) - 2;
        			endPageIndex = parseInt(settings.pageIndex) + 2;
        			if (beginPageIndex < 1) {
        				beginPageIndex = 1;
        				endPageIndex = 5;
        			}
        			if (endPageIndex > parseInt(pageCount)) {
        				endPageIndex = parseInt(pageCount);
        				beginPageIndex = parseInt(pageCount) - 5 + 1;
        			}           		
                }
        		var html = '';
        		if (parseInt(settings.pageIndex) <= 1) {
        			html += '<li class="disabled"><a class="page-nav-link previous" href="javascript:void(0)"></a></li>'; 				                                         
        		} else {
        			html += '<li><a class="page-nav-link previous" href="javascript:'+settings.funcName+'('+(parseInt(settings.pageIndex)-1)+')"></a></li>';
        		}
        		if(beginPageIndex > 1){
        			html +='<li><a class="page-nav-link" href="javascript:'+settings.funcName+'(1)">1</a></li>';    
        			if((beginPageIndex-1)>1){        		
        				html +='<li><a class="page-nav-link ellipsis" href="javascript:void(0)">...</a></li>';         				
        			}       			
        		}     
        		for (var i = beginPageIndex; i <= endPageIndex; i++) {
        			if (i == settings.pageIndex) {
        				html +='<li class="active"><a class="page-nav-link" href="javascript:'+settings.funcName+'('+i+')">'+i+'</a></li>';    
        			} else {
        				html +='<li><a class="page-nav-link" href="javascript:'+settings.funcName+'('+i+')">'+i+'</a></li>';    
        			}
        		}
        		if(endPageIndex < pageCount){
        			if((pageCount-endPageIndex)>1){        		
        				html +='<li><a class="page-nav-link ellipsis" href="javascript:void(0)">...</a></li>';         				
        			}
        			html +='<li><a class="page-nav-link" href="javascript:'+settings.funcName+'('+pageCount+')">'+pageCount+'</a></li>';    
        		}       		
        		if (parseInt(settings.pageIndex) >= pageCount) {
        			html += '<li class="disabled"><a class="page-nav-link next" href="javascript:void(0)"></a></li>'; 
        		} else {
        			html += '<li><a class="page-nav-link next" href="javascript:'+settings.funcName+'('+(parseInt(settings.pageIndex)+1)+')"></a></li>'; 
        		}
        		$this.find(".page-conut").html(pageCount);
        		$this.find(".pagination").html(html);
        		$this.find(".page-jump-input").val(settings.pageIndex);
        		$this.find(".page-jump-btn").off();
        		$this.find(".page-jump-btn").on("click",function(){
                	var jumpPage = $this.find(".page-jump-input").val();
                	if(parseInt(jumpPage)>pageCount || parseInt(jumpPage)<1){
                		toastr["warning"]("超出頁數範圍"); 
                	}else{             		
                		eval(settings.funcName+'('+jumpPage+');');
                	}            	
                });
            });
        },
        //獲取當前頁序
        curPage: function(options) {   
        	return this.eq(0).find(".page-jump-input").val();       
        }
    };
    $.fn.customPagenav = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.customPagenav');
            return this;
        }
        return  method.apply(this, arguments);
    }
})(jQuery);

/*********************************************************
 * 功能：異步加載容器插件
 * 作者: chendy
 * 使用方法：需配合頁面block-loader容器使用，可控制容器切換為loading,loaded,
 *         no-data三種狀態如：$("#divId").customLoader("loading");
 ************************************************************/
;(function($) {
    var methods = {
        loading: function(callback) {       	
            return this.each(function() {
                var $this = $(this)              
                $this.removeClass('loaded no-data');
                $this.addClass('loading');                   
                if(typeof callback === 'function'){
                	callback();
                }
            });
        },   
        nodata: function(callback) {       	
            return this.each(function() {
                var $this = $(this)              
                $this.removeClass('loaded loading');
                $this.addClass('no-data');                   
                if(typeof callback === 'function'){
                	callback();
                }
            });
        },
        loaded: function(callback) {       	
            return this.each(function() {
                var $this = $(this)              
                $this.removeClass('loading no-data');
                $this.addClass('loaded');                   
                if(typeof callback === 'function'){
                	callback();
                }
            });
        }
    };
    $.fn.customLoader = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.loading;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.customLoader');
            return this;
        }
        return  method.apply(this, arguments);
    }
})(jQuery);

/*********************************************************
 * 功能：將某個div變成 單頁面應用跳轉方式 的容器,使容器中的頁面div可以用
 *     瀏覽器的“前進/後退”鍵切換
 * 作者: chendy
 * 使用方法：可用 init 方法將任意div初始化為單頁面應用跳轉方式的容器，
 *        跳轉：$("#容器Id").SPAContainer('servlet',{page:"#pageId"})
 ************************************************************/
;(function($) {
    var methods = {
        init: function() { 
        	window.onpopstate = function(event){
        		if(history.state){
        			var page = history.state.page;
        			$(page).siblings().addClass("hidden");
        			$(page).removeClass("hidden");
        		}else{
        			window.history.go(-1);
        		}
        	}       	
            return;
        },   
        servlet: function(options) {        //可以後退的跳轉
            var defaults = {page: "#"}                     
            var settings = $.extend({}, defaults, options);
            var page = '';
            if(history.state){
               page = history.state.page;           	
            }
            if(settings.page != page){
           	   history.pushState({page:settings.page},null,settings.page);
            }   
        	$(settings.page).siblings().addClass("hidden");
        	$(settings.page).removeClass("hidden");
            return;
        },
        normal: function(options) {        //不能後退的跳轉
            var defaults = {page: "#"}                     
            var settings = $.extend({}, defaults, options);               
        	$(settings.page).siblings().addClass("hidden");
        	$(settings.page).removeClass("hidden");
            return;
        },
        goback: function(options) {        //後退
        	window.history.go(-1);
            return;
        }
    };
    $.fn.SPAContainer = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.SPAContainer');
            return this;
        }
        return  method.apply(this, arguments);
    }
})(jQuery);

/*********************************************************
 * 功能：自定義confrim和alert彈窗，可自定義點擊確定和取消按鈕的文案及回調
 * 作者: chendy
 * 使用方法：customAlert.alert(),customAlert.confrim()
 ************************************************************/
;(function(){
    //定义一些默认参数
    var default_options={
        message: "確認該操作嗎？",//彈窗內容
        cancle: "取消", //取消按鈕的文案
        confrim: "確定", //確定按鈕的文案
        oncancle: function() {},
        onconfrim: function() {},
        templet: '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" style="width: 450px;" role="document"><div class="modal-content"><div class="block block-rounded mb-0"><div class="block-header"><h3 class="block-title">操作提示</h3><div class="block-options"><span class="btn-close" data-dismiss="modal" aria-label="Close">×</span></div></div><div class="block-content"><div class="text-center font-size-h5 text-dark pt-4 pb-4 tip-message">確認該操作嗎？</div><div class="block-footer text-center" style="border:none;"><button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-rounded btn-rounded-lg btn-outline-primary cancle-btn mr-6">取消</button><button type="button" data-dismiss="modal" class="btn btn-rounded btn-rounded-lg btn-primary confrim-btn">確定</button></div></div></div></div></div></div>'
    }
    
    //定义一些api
    var _plugin_api = {      
        confrim:function(options){
        	var settings = $.extend({}, default_options, options);
        	if(typeof(options) == "string"){settings.message = options};
        	var modal = $(settings.templet);
        	modal.find(".tip-message").html(settings.message);
        	modal.find(".cancle-btn").html(settings.cancle);
        	modal.find(".confrim-btn").html(settings.confrim);
        	modal.find(".cancle-btn").bind("click",function(){
        		settings.oncancle.call();
        	});        	
        	modal.find(".confrim-btn").bind("click",function(){
        		settings.onconfrim.call();
        	});
        	modal.appendTo("body");
        	modal.modal("show");
            return this;//返回当前方法
        },
        alert:function(options){
        	var settings = $.extend({}, default_options, options);        
        	if(typeof(options) == "string"){settings.message = options};
        	var modal = $(settings.templet);
        	modal.find(".tip-message").html(settings.message);
        	modal.find(".cancle-btn").html(settings.cancle);
        	modal.find(".confrim-btn").html(settings.confrim);
        	modal.find(".cancle-btn").hide();
        	modal.find(".confrim-btn").bind("click",function(){
        		settings.onconfrim.call();
        	});
        	modal.appendTo("body");
        	modal.modal("show");
            return this;//返回当前方法
        }
    }
    //这里确定了插件的名称
    this.customAlert = _plugin_api;
})();


/*********************************************************
 * 功能：loading遮罩層
 * 作者: chendy
 * 使用方法：customLoading.show(),customLoading.hide()
 ************************************************************/
;(function(){
    //定义一些默认参数
    var default_options={
        tip: "正在處理...",
        callback: function() {},
        templet: '<div id="loading_lock" class="loading-lock" style="display: none;"><div class="loading"><i style="font-size: 4rem;" class="fa fa-spin fa-spinner"></i><br/><br/><span class="loading-tip">正在處理...</span></div></div>'
    }
    
    //定义一些api
    var _plugin_api = {      
        show:function(options){       	
        	var settings = $.extend({}, default_options, options);
        	if(typeof(options) == "string"){settings.message = options};
        	if(typeof options === 'function'){settings.callback = options};
        	var layer = $(settings.templet);
        	layer.find(".loading-tip").html(settings.tip);            	  
        	layer.appendTo("body");
        	layer.fadeIn("fast","linear",function(){
        		settings.callback.call(); 
        	});       	  
            return this;//返回当前方法
        },
        hide:function(){ 
        	$("#loading_lock").remove();
            return this;//返回当前方法
        }
    }
    //这里确定了插件的名称
    this.customLoading = _plugin_api;
})();
/*********************************************************
 * 功能：移动可编辑div光标至末尾
 * param: obj jquery 对象
 ************************************************************/
function moveEnd(obj){ 
	obj = obj[0];
    obj.focus(); 
    var len = obj.innerText.length; 
    if (document.selection) { 
        var sel = document.selection.createRange(); 
        sel.moveStart('character',len); 
        sel.collapse(); 
        sel.select(); 
    }else{                                                 /* IE11 特殊处理 */
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(obj);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    } 
}
/*********************************************************
 * 功能：生成全局唯一的uuid,可指定長度和基數
 * 作者: chendy
 * 使用方法：guid()
 ************************************************************/
//Generate four random hex digits. 
function S4() { 
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}; 
// Generate a pseudo-GUID by concatenating random hexadecimal. 
function guid() { 
   return (S4()+S4()); 
}; 