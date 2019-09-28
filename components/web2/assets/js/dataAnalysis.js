 var getFormList="http://hc1-test.lifit.com.cn/BI/getFormList.do"                        // 获取对应用户下的报表
 var getIndicatorCardList="http://hc1-test.lifit.com.cn/BI/getIndicatorCardList.do"     // 获取报表的指标卡
 var getPythonData="http://hc1-test.lifit.com.cn/pythonController/getPythonData.do"    // 获取图表
 // var
	// getPythonData="http://10.162.253.140:8080/pythonController/getPythonData.do"
	// //測試地址
 var addForm="http://hc1-test.lifit.com.cn/BI/addForm.do"	
 var getUserDefinedForm="http://hc1-test.lifit.com.cn/BI/getUserDefinedForm.do"  //獲取報表
 var getUserDefinedFormInfo="http://hc1-test.lifit.com.cn/BI/getUserDefinedFormInfo.do" //獲取自定報表信息
 var deleteUserDefinedForm="http://hc1-test.lifit.com.cn/BI/deleteUserDefinedForm.do"
 var customisedReport=[];
 var indicatorCards=[];  // 所有的指标卡
 var echartsIndex=0;
 var clickEchart;
 var paramesData;
 var commonOption;
 var customTime=false;
 var mySwiper=null,mySwiper2=null;
 var currentIndex=0;
 var cardList=[];
 var isInit=false;
 var statementsList=[];//储存加载的所有指标卡
 var formId=0,formName="";
 var chartIcon={
		 'bar':'&#xe63c;',
		 'line':'&#xe63b;',
		 'pie':'&#xe634;'
 }
 var getSystemIndicatorCard="http://hc1-test.lifit.com.cn/BI/getSystemIndicatorCardList.do"
	 var formId,comType;
	 $(function(){
		 FormList(); 
		 searchSystemIndicatorCard();
		 getUserDefinedReport();
		 $('#chang .nav-main-item').eq(0).addClass('open');
		 setTimeout(function(){
			 $("#chang .nav-main-submenu .nav-main-item").eq(0).trigger('click');
		 },1000)
		 $("#chang .nav-main-submenu .nav-main-item").click(function(event){
			$(this).closest('#chang').find('.nav-main-item').removeClass('active');
     	    //$(this).addClass("active").siblings().removeClass('active');
	        $(this).parent(".nav-main-submenu").find('.nav-main-item').removeClass('active')
			$(this).addClass('active');
			$(".report-title").text($(this).text());
			formId=$(this).attr("data-id");
			comType=$(this).attr("data-type");
			var clubId=$(this).attr("data-useid");
			formName=$(this).find("span").text();
			$('#tab-content-wraper').empty("")
			getIndicator(formId,clubId,comType);
			Tabs() 
			Tabs2() 
		 })	
		
 })
 function tran(string,isback){
		 var arr=[];
		 if(isback){
			 $("."+string).css({"left":"0%","z-index":-1})
			 return false;
		 }
		 $(".manage-steps").each(function(i,o){
				 arr.push({index:i,z:$(o).css("z-index")})
		 })
		 if(arr.length==0){
			 $("."+string).css({"left":"0%","z-index":1})
			 return false
		 }
		 
		 arr=arr.sort(function(a,b){
			 return b.z-a.z
		 })
		 $('.'+string+' input').val("");
		 var max=Number(arr[0].z)>500 ? Number(arr[0].z)+1  : 900;
		 $('.'+string).css({"left":"100%","z-index":max})
		
	  
 }
function runNext(){
//	if($("#build-report-user").val()==""){
//		return false;
//	}
	$("#select-list .select .select_box").empty();
	$("#select-list .unselect .select_box .select_box_item").addClass("animated").removeClass("unselectDom");
	$("#select-list .unselect li").removeClass('open');
	tran('select-report',false)
}
  /** ***获取用户对应的报表******** */
  function FormList(){
	    //$("#page-loader").removeClass("hidden");
    	$.ajax({
            type:'get',
            url:getFormList,
            dataType:'json',
            cache: false,
            async: false,
            data:{
    			"userId":'151092', // $('.user-img').attr('uid'),
    			"clubId":6     // getClubId()
            },
            success:function(data){
                if(data['status'] == "true"){
                	 statementsList=data.datalist
                	 formatter(data.datalist)
                	 $("#page-loader").removeClass("show");
                }else{
                    console.error("获取数据失败");
                }
            },
            error:function(errMsg){
                    console.error("获取数据失败");
            }
        });
    }
   /*********
   * 前端实现报表假模糊搜索功能
   * **************/
  
    function fuzzySearch(){
    	var filterList=[];
    	var filterValue=$.trim($("#search-club-user").val());
    	$("#chang .nav-main-submenu .nav-main-item").each(function(index,item){
    		$(item).parent('.secondLevel').parent('.firstLevel').removeClass("hidden");
    		if($(item).find('.textLevel').text().indexOf(filterValue)>-1){
    			$(item).removeClass("hidden");
    		}else{
    			$(item).addClass("hidden");
    			if($(item).parent('.secondLevel').height()==0){
    				$(item).parent('.secondLevel').parent('.firstLevel').addClass("hidden");
    			}else{
    				$(item).parent('.secondLevel').parent('.firstLevel').removeClass("hidden");
    			}
    		}
    		if($("#chang").height()==0){$(".chang_show").removeClass("hidden")}else{$(".chang_show").addClass("hidden")}
    	})
    }
    
    
    /***************************
	 * 获取自定报表
	 ****************************/
  function getUserDefinedReport(){ 
	  $.ajax({
        type:'GET',
        url:getUserDefinedForm,
        dataType:'json',
        cache: false,
      // processData: false,
      // async: false,
        data:{
        	"userId":151092,
        	"userDefinedName":"",
        	"page":1,
        	"limit":10,
        	"clubId":6
        },
        success:function(data){
            if(data.status=="true"){ 
            	var html=""
       	       for(var a=0;a<data.datalist.length;a++){
       	    	         html+='<li class="nav-main-item " style="margin-top: 6px;">';
        		         html+='<a class="nav-main-link nav-main-link-submenu"  href="#" style="display:block">';				                               
        			     html+='<span class="nav-main-link-name"></span>';
        				 html+='<span class="nav-main-link-badge1">'+data.datalist[a].formName+'</span>';
        				 html+='<span class="iconfont editpen" formId='+data.datalist[a].formId+' formName='+data.datalist[a].formName+' onclick="editField(this)">&#xe625;</span></a>';	                         
		                 html+='</li>';
		      }
       	      $("#build-report").html(html)
            }
        },
	    error:function(){
	      	 
	        }
	   })
	  
  }
  /******
   * 獲取自定報表信息
   * ********/
  function getFormInfo(formId){
	  $.ajax({
	        type:'get',
	        url:getUserDefinedFormInfo,
	        dataType:'json',
	        cache: false,
	        async: false,
	        data:{
	      	  "formId":formId,
	      	  "clubId":getClubId()
	        },
	        success:function(data){
	        	definedFormInfo=data.data;
	        	var html="<li class='nav-main-item open '>";
	        	html+="<a class='nav-main-link nav-main-link-submenu' data-toggle='submenu' aria-haspopup='true' aria-expanded='true' href='#' style='display:block'><input type='text' id='form-name' style='margin-left:30px' value='"+data.data.formName+"'/><i class='iconfont editpen' style='color:black' data-formId="+data.data.formId+" onclick='deleteReport(this)'>&#xe624;</i></a>";
	        	html+="<ul class='nav-main-submenu  select_box' style='background-color:#ffffff'>";
	        	for(var b=0;b<data.data.indicatorCards.length;b++){
	        		html+="<li  class='nav-main-item active select_box_item animated slideInUp' data-type='企業'>  <span class='iconfont' style='margin-right: 10px;'>&#xe620;</span><a class='nav-main-link' href='#'><span class='nav-main-link-badge1 text-overflow'>"+data.data.indicatorCards[b].cardName+"</span></a></li>";
	        	}		
	        	html+="</li>"
	        	html+="</ul>"
	            html+="</li>"	
	        	    $(".editbox").html(html);
	        	    var ul='';
	        		$("#edit .select  .nav-main-item").each(function(index,item){
			           	 $("#edit .unselect .select_box .nav-main-submenu .nav-main-item").each(function(index,item2){
			         		if($(item).find("a>.nav-main-link-badge1").text()==$(item2).find("a>.nav-main-link-badge1").text()){
			         			$(item2).removeClass("animated").addClass("unselectDom");
			         		}
			         })
			     })
			     $("#edit").select({
            	         edit:false
                 })
	        },
	        error:function(errMsg){
	              console.error(errMsg);
	          	
	        }
	   })
  }
  /*******
   * 编辑报表
   * **********/
  function editReport(){
//	  var startTime=$("#start").datepicker("getDate");
//	  var endTime=$("#end").datepicker("getDate");
//	  if(startTime!=null){startTime=startTime.getTime();}
//	  if(endTime!=null){endTime=endTime.getTime();}
	 // if(startTime==null||endTime==null){
	      var formName=$("#form-name").val();
    	  var startTime=new Date($.GetPreMonthDay($.getNowFormatDate(),6)).getTime();
 		  var endTime=new Date($.getNowFormatDate()).getTime();
	 // }
 		 var total=[];
 		 $("#edit .select .select_box .nav-main-link-badge1").each(function(i,o){
 			 for(var a=0;a<indicatorCards.length;a++){
 				 if($(o).text()==indicatorCards[a].cardName){
 					total.push(indicatorCards[a])
 				 }
 			 }
 		 })
 		 if(!formName){toastr.warning("請先输入报表名称"); return false}
 		 if(total.length==0){toastr.warning("請先添加指标卡"); return false}
	  for(var a=0;a<total.length;a++){
		  total[a].startTime=startTime;
		  total[a].endTime=endTime;
		  if(total[a].maxresult==undefined){
		    	total[a].maxresult=total[a].maxResult;
		   }
		  total[a].filters.split(";").length==2 ? total[a].filters=total[a].filters.split(";")[0].split("==")[0]+":"+total[a].filters.split(";")[0].split("==")[1] : total[a].filters=""
      }
	  $.ajax({
	        type:'post',
	        url:'http://hc1-test.lifit.com.cn/BI/editCommonForm.do',
	        dataType:'json',
	        cache: false,
	    //  async: false,
	        data:{
	          "formId":definedFormInfo.formId,
		   	  "formName":formName,
		  	  "categoryId":147,
		  	  "unifyTime":true,
		  	  "start":startTime,
		  	  "end":endTime,
		  	//  "flag":flag,
		  	  "clubId":6,
		  	  "userId":151092,
		  	  "indicatorCards":JSON.stringify(total)
	      },
	     success:function(data){
	  	   if(data.status=="true"){
	  		    toastr.success("報表編輯成功");
	  		    FormList();
	  		    getUserDefinedReport();
	  		    tran('edit-report',true);
         }else{
	  		 toastr.warning(data.message);
	  	   }
	     },
	     error:function(){}
	    })
  }
 /** *****构造数据格式************ */
 function formatter(datalist){
	        if(datalist.length==0){
	        	document.getElementById("chang").innerHTML="<div style='text-align:center;margin-top:60px;'>暂无指标卡....</div>";
	        	return false;
	        }
	        var zi=[]
			var mm={};
			for(var a=0;a<datalist.length;a++){
				    if(datalist[a].name==""){
				    	zi.push(datalist[a]);
				    	continue;
				    }  
				    if(!mm.hasOwnProperty(datalist[a].name)){
					     mm[datalist[a].name]=[];
				    }
				    	mm[datalist[a].name].push(datalist[a]);
				    
            }
			if(zi.length==0){$("#builder-btn").addClass("hidden")};
			mm["自定报表"]=zi;
			var html="";
            for(var p in mm){
            	html+='<li class="nav-main-item firstLevel">';
            		html+='<a class="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="true" href="#" style="display:block">';				                               
            			html+='<span class="nav-main-link-name"></span>';
            				html+='<span class="nav-main-link-badge1">'+p+'</span>';
            					html+=' </a>';
            						html+=' <ul class="nav-main-submenu secondLevel">  ';  
            						  for(var k=0;k<mm[p].length;k++){
            							  html+='<li class="nav-main-item" data-type="'+mm[p][k].type+'" data-useId="'+mm[p][k].userId+'" data-id="'+mm[p][k].formId+'">';
            							  html+='<a class="nav-main-link" href="#">	';		                             
            							  html+=' <span class="textLevel">'+mm[p][k].formName+'</span>';
            							  html+=' </a>';		                              
            							  html+='</li>';	
            						  }                       					                               	                              		                               			                             	                            
			                          html+='</ul>';			                         
			                    	  html+='</li>';
			  }
             
			  document.getElementById("chang").innerHTML=html;
}
 function editField(dom){
	var formid=dom.getAttribute("formid");
	var formname=dom.getAttribute("formname");
	tran("edit-report",false)
	getFormInfo(formid)
 }
 /** ***获取用户对应的报表的指标卡******** */
 function getIndicator(formId,clubId,type){
	$("#loading_lock").removeClass("hidden");
 	$.ajax({
         type:'get',
         url:getIndicatorCardList,
         dataType:'json',
         cache: false,
         async: false,
         data:{
             "formId":formId,
 			 "userId":clubId,
 			 "type":type,
 			 "clubId":6
         },
         success:function(data){
        	 cardList=data.datalist;
        	 var cardName=[];
        	 var html="";
        	 var html2="";
             if(data['status'] == "true"){
            	 if(data.datalist.length>1){$(".control-panel").removeClass("hidden")}
            	 if(comType=="1"){
           		    for(var a=0;a<data.datalist.length;a++){
           		        cardName.push(data.datalist[a].cardName)
           		        data.datalist[a].filterList[0].value.length>0 ?  data.datalist[a].filters=data.datalist[a].filterList[0].filterName+'=='+data.datalist[a].filterList[0].value[0].id+";clubid=="+getClubId() : data.datalist[a].filters="clubid=="+getClubId();
               	        data.datalist[a].condition!="" ? data.datalist[a].condition="Continuous_measurement_months=="+data.datalist[a].condition.split(';')[0] : data.datalist[a].condition="";
               	        data.datalist[a].startTime=GetPreMonthDay(getNowFormatDate(),6);
                        data.datalist[a].endTime=getNowFormatDate(); 
		             }
		           		 if(!customTime){
		               	  $("#StartTime").datepicker("setDate",GetPreMonthDay(getNowFormatDate(),6));
		                  $("#EndTime").datepicker("setDate",getNowFormatDate());
		               	  reportStartTime=GetPreMonthDay(getNowFormatDate(),6);
		               	  reportendTime=getNowFormatDate();
		               	 
		   			     
		   			   }else{
		               	     $("#StartTime").datepicker("setDate",reportStartTime);
		                     $("#EndTime").datepicker("setDate",reportendTime);
		                      data.datalist[a].startTime=reportStartTime;
		             		  data.datalist[a].endTime=reportendTime; 
		               	  
		                 }
           	     }else{
           	    	 for(var a=0;a<data.datalist.length;a++){
           	    		 cardName.push(data.datalist[a].cardName);
        		    	 data.datalist[a].filterList[0].value.length>0 ? data.datalist[a].filters=data.datalist[a].filters.split(':')[0]+"=="+data.datalist[a].filters.split(':')[1]+';clubid=='+getClubId() : data.datalist[a].filters="clubid=="+getClubId();
        		    	 if(!customTime){
                        	  $("#StartTime").datepicker("setDate",data.datalist[0].startTime.substring(0,10));
                              $("#EndTime").datepicker("setDate",data.datalist[0].endTime.substring(0,10));
                        	  reportStartTime=data.datalist[0].startTime.substring(0,10);
                        	  reportendTime=data.datalist[0].endTime.substring(0,10); 
        		    	 }else{
        		    		  $("#StartTime").datepicker("setDate",reportStartTime);
                              $("#EndTime").datepicker("setDate",reportendTime);
                              data1.datalist[a].startTime=reportStartTime;
                     		  data1.datalist[a].endTime=reportendTime; 
                           }
              	      }
           	     }
            	 customisedReport=data.datalist;
            	 cardName.forEach(function(e,index){
            		  if(index==0){
            			 html+="<li class='active' ><span title='"+e+"' onclick='goEcharts("+index+",this)' style='display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 92%;'>"+e+"</span>  <span style='display:inline-block;    vertical-align: top;'><i class='iconfont text-purple' style='vertical-align: top;'>&#xe631;<span class='caret-hover hidden'></span></i></span></li>"
            		     html2+="<li class='active' ><span style='display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 92%;'>"+e+"</span>  <span style='display:inline-block;vertical-align: top;'><i class='iconfont text-purple' style='vertical-align: top;'>&#xe631;<span class='caret-hover hidden'></span></i></span></li>"
            		  }else{
            			 html+="<li ><span title='"+e+"' onclick='goEcharts("+index+",this)' style='display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 92%;'>"+e+"</span>  <span style='display:inline-block;vertical-align: top;'><i class='iconfont text-purple' style='vertical-align: top;'>&#xe631;<span class='caret-hover hidden'></span></i></span></li>"
            		     html2+="<li ><span style='display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 92%;'>"+e+"</span>  <span style='display:inline-block;vertical-align: top;'><i class='iconfont text-purple' style='vertical-align: top;'>&#xe631;<span class='caret-hover hidden'></span></i></span></li>"
            		  }
            	   })
            	   $("#tab-content-header-Menu li").remove();
            	   $("#tab-content-header-Menu").append(html);
            	   $("#tab-content-header-Menu2 li").remove();
            	   $("#tab-content-header-Menu2").append(html2);
                   $('.text-purple').on("mouseover",function(event){
                	    if($(this).find(".explain").length==0){
                	    	var currentIndex=$(event.currentTarget).parents('li').index();
                			var explain=cardList[currentIndex].explain;
                			$(this).append($("<div class='explain'>"+explain+"</div>"));
                			$(this).find('.caret-hover').removeClass("hidden");
                	    }else{
                	    	$(this).find(".explain").removeClass("hidden");
                	    	$(this).find('.caret-hover').removeClass("hidden");
                	    }
            	   }).on('mouseleave',function(){
            		   $(this).find(".explain").addClass("hidden");
            		   $(this).find('.caret-hover').addClass("hidden");	
                   })
                  paramesData=data;
            	  getChartData(paramesData);
            	  return false;
             }
         },
         error:function(errMsg){
             console.error("获取数据失败");
         }
     });
 }
 
 /** ****初始化 Tab******* */
 function initTab(){
	 $("#tab-content").tabSilder({
			tabChange:function(index){
				//console.log(index)
				$(this).siblings().removeClass("active")
				var scrollLeft=$("#tab-content-header")[0].scrollLeft;
				//$("#tab-content-wraper .tab").addClass("hide");
				//$($("#tab-content-wraper .tab")[index]).removeClass("hide")
				$(this).addClass("active")
				var tabTitleWidth=$(".tab-title").width();
				if(index==0||index==1||index==2){
					if(scrollLeft==0){
						return false;
					}
				}
				if(index==3&&scrollLeft!=0){index=0;}
				$("#tab-content-header").scrollLeft(index*tabTitleWidth);
			},
			controlIcon:function(direction){
				var scrollLeft=$("#tab-content-header")[0].scrollLeft;
				var tabTitleWidth=$(".tab-title").width()
			    switch(direction){
			        case "left":
			        	if(scrollLeft==0){
			        		// return;
			        	}else{
			        		 scrollLeft=scrollLeft-tabTitleWidth<=0 ? 0 : scrollLeft-tabTitleWidth;
			        	}
			        	break;
			        case "right":
			        		 scrollLeft=scrollLeft+tabTitleWidth
			        	 break;
			     }
			    $("#tab-content-header").scrollLeft(scrollLeft);
			}
		})
 }
 /** ************获取图表数据*************** */
 function getChartData(data){
	//debugger;
	$("#loading_lock").removeClass("hidden")
 	$.ajax({
         type:'post',
         url:getPythonData,
         dataType:'json',
         cache:false,
         async:true,
         data:{
         	arr:JSON.stringify(data)
         },
         success:function(data1){
     		for(var i=0;i<data1.data.length;i++){
         		data1.data[i].key=data.datalist[i]          
            }
            // echartArray=data1
     		drawingEChart(data1);
         	$("#loading_lock").addClass("hidden")
         	
         },
         error:function(errMsg){
             console.error(errMsg);
         	
         }
     });
 }
 /*********获取更改单个指标卡信息****************/
 function getSingleChartData(data){
	 	$.ajax({
	         type:'post',
	         url:getPythonData,
	         dataType:'json',
	         cache:false,
	         async:true,
	         data:{
	         	arr:JSON.stringify(data)
	         },
	         success:function(data1){
	     		for(var i=0;i<data1.data.length;i++){
	         		data1.data[i].key=data.datalist[i]          
	            }
	            // echartArray=data1
//	     		drawingEChart(data1);
	     		console.log(data1)
	     		commonOption.series=structure(setData(data1.data[0])).serise; 
	     		clickEchart.setOption(commonOption);
	     		$("#myModal").modal('hide')
	         	console.log(data1)
	         },
	         error:function(errMsg){
	             console.error(errMsg);
	         	
	         }
	     });
	 }
 
 /***************************************************************************
	 * Echarts 生成指标卡
	 **************************************************************************/
 /** ******根据获取的参数循环获取所有图表数据* */
 function drawingEChart(echartArray){
	  commonOption={
				index:0,
				data:{},
				color:['#7091ec','#fb6767','#ffc13b','#b09ecb','#e988aa','#37cf7f','#FF00BF','#088A08','#298A08'],
				// totalData:structure(setData(echartArray.data[a])).totalData,
			    grid:{
				    left:"15%",
					top:"20%",
					right:"10%",
					bottom:"10%",
				    borderWidth:1,
				    containLabel: true  
			    },
                backgroundColor:'#eeeeee',            // 背景色
                tooltip: {
                	trigger:"axis",
                	trisetDataer: 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'line', // 默认为直线，可选为：'line' | 'shadow'
						lineStyle:{
							width:0
						},
                    },
                    hideDelay:0, 
                    confine:true,
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
//                    position:function (point, params, dom, rect, size) {
//                     	console.log(params)
//                    	console.log(point)
//                    	var canvasWidth=$("#tab-content-wraper .tab").width()*0.8;
//                    
//                    	var a=$("#tab-content-wraper .tab").width()*0.07;
//                    	var point2=Math.floor(((point[0]-a)/canvasWidth)/(1/params.length))
//                    	
//                         var max=100-(params[1].data.value+50)+"%";
//                    	
//                    	
//                    	 return [canvasWidth*(point2+1)/params.length-$(dom).width()/1.2, (100-getMax(params)-25)+"%"];
//                        
//                    },
                    position:function(p){   //其中p为当前鼠标的位置
	                        return [p[0] + 10, p[1] - 10];
	                 },
                    backgroundColor:"#ffffff",
                    formatter:function(parmes){
                    	
                    	var res=parmes[0].name+'<br/>'
	                    	for(var a=0;a<parmes.length;a++){
	                    		parmes[a].data.unit==undefined ? res+=parmes[a].marker+parmes[a].seriesName+' : '+parmes[a].data.value+'<br/>' : res+=parmes[a].marker+parmes[a].seriesName+' : '+parmes[a].data.value+parmes[a].data.unit+'   人數 : '+parmes[a].data.total+'<br/>'
	                    	}
                    	  //  var box="<div class='tipBox' style=''>"+res+"</div>"
	                    	return res;
                    },
                    textStyle:{
                    	color:"black"
                    }
                   },
                   legend:{
                  	 show:false,
                  	 top:'12%',
                  	 right:'3px',
                  	 orient:'horizontal',
                  	 textStyle:{
                  		fontSize:12,
                  		color:'#6B6B6B'
                  	 },
                  	 formatter:function (name){
                  		return "<div>"+name+"</div>"
                     },
                     data:[],
                      // data:!isStack ?
						// structure(setData(echartArray.data[a])).lenged :
						// structure(setData(echartArray.data[a])).lenged.reverse()
                    },
                    xAxis:{
                           axisLine: {show: false},
                           axisTick: {show: true},     // 去掉x轴刻度线
                           axisLabel:{
                        	    interval:0,
								textStyle:{
									fontSize:12,
									color:'#6b6b6b'
							 },
							 // rotate: isTilt,
                        	 show:true,
                        	 formatter:function(value, index){
                        		 if(value.length>8){
                        			 return "";
                        		 }else{
                        			 return value;
                        		 } 
                        	  }
                           },
                    	   data:[],
                       },
                   yAxis:
                	   {
                      	   type: 'value',  
                           axisLabel: {  
                                 show: true,  
                                 interval: 'auto',  
                               
								 textStyle:{
									fontSize:13,
									color:'#6b6b6b'
								}
                               },  
                           show: true,
                           name:'',
                           // name:structure(setData(echartArray.data[a])).yName.split("").join('\n')
							// ,
                         // nameLocation:'middle',
                           nameRotate:360,
                           nameGap:'40',
                           nameTextStyle:{
                    		   fontSize:13,
                    		   color:'#6B6B6B'
                    	   },
                           axisLine: {show: true},    // 去掉y轴
                           axisTick: {show: false} ,   // 去掉y轴刻度线
                          
                       },
	               graphic:[],
                   series: []
       }
	    $('#tab-content-wraper .swiper-slide').remove()
	    $('#tab-content-wraper2 .swiper-slide').remove()
 	   for(var i=0;i<echartArray.data.length;i++){
            commonOption.index=i;
 		    commonOption.data=echartArray.data[i].key;
 		    commonOption.legend.data=structure(setData(echartArray.data[i])).lenged;
 		    commonOption.xAxis.data=structure(setData(echartArray.data[i])).xData;
 		    commonOption.series=structure(setData(echartArray.data[i])).serise; 
 		    commonOption.yAxis.name=structure(setData(echartArray.data[i])).yName;
 		    var lengName=structure(setData(echartArray.data[i])).lenged;
		    var html="";
		    for(var j=0;j<lengName.length;j++){
			      html+="<div style='margin-left:20px;' class='custom-control custom-checkbox custom-control-primary mb-1'><input type='checkbox' class='custom-control-input' id='checkbox"+i+j+"'checked='checked' onclick='toggerLengend(this)'/><label class='custom-control-label' for='checkbox"+i+j+"'><div class='block-color' style='background-color:"+commonOption.color[j]+"'></div>"+lengName[j]+"</label></div>" 
		    	 //html+="<div style='margin-left:20px;' class=''><input type='checkbox' class='' id='checkbox"+i+j+"'checked='checked' onclick='toggerLengend(this)'/><label class='' for='checkbox"+i+j+"'><div class='block-color' style='background-color:"+commonOption.color[j]+"'></div>"+lengName[j]+"</label></div>" 
		    }
		    // <div role="tabpanel" class="tab-pane active show" id="home">1</div>
		      $('#tab-content-wraper').append(
		             $("<div id='home"+i+"' class='echart_wraper tab swiper-slide' style='width:100%;height:100%;background-color:#eeeeee;position:relative;'><div class='Switch' style='text-align: right;position: relative;top: 20px;right: 20px;'><button type='button' class='btn btn-rounded btn-outline-default mb-4' data-toggle='modal' data-target='#myModal' onclick='btnControl(this)' style='background-color:#ffffff;position: absolute;right: 0px;z-index: 2000;border:1px solid #ccc;'><i class='iconfont'>&#xe618;</i>&nbsp;指标设定</button></div><div class='bottomIcon flex-row' style='width:90%'><div style='display: flex;justify-content: space-around;'>"+html+"</div></div><div  style='width:80%;height:80%' data-index="+i+" id='chart"+i+"' class='echartsWraper'></div></div>")
		    		 //$("<div id='home"+i+"' class='echart_wraper tab swiper-slide' style='width:100%;height:100%;position:relative;'>"+i+"</div>")  
		      )
              $('#tab-content-wraper2').append(
		      $("<div id='homea"+i+"' class='echart_wraper tab swiper-slide' style='width:100%;height:100%;background-color:#eeeeee;position:relative;'><div class='Switch' style='text-align: right;position: relative;top: 20px;right: 20px;'><button type='button' class='btn btn-rounded btn-outline-default mb-4' data-toggle='modal' data-target='#myModal' onclick='btnControl(this)' style='background-color:#ffffff;position: absolute;right: 0px;z-index: 2000;border:1px solid #ccc;'><i class='iconfont'>&#xe618;</i>&nbsp;指标设定</button></div><div class='bottomIcon flex-row' style='width:90%'><div style='display: flex;justify-content: space-around'>"+html+"</div></div><div  style='width:80%;height:80%' data-index="+i+" id='chart2"+i+"'></div></div>"))
              echarts.init(document.getElementById('chart'+i)).setOption(commonOption,true) 
		      echarts.init(document.getElementById('chart2'+i)).setOption(commonOption,true) 
 		        //$("#tab-content-wraper .tab:not(':first')").addClass('hide')
 	          }
              mySwiper = new Swiper('.myswiper1',{
		    		 mousewheel:false,
		    		 effect:'fade',
		    		 on:{
		    			    slideChange: function(){
		    			      
		    			    },
		    			  },
		    		// autoplay:true,
		 	     }) 
//	       
//	    	 
	    	 mySwiper2 = new Swiper('.myswiper2',{
	    		     effect:'fade',
	 	     })  
	    	 
   }
 /*******
  * btn controller
  * ********/
 function btnControl(target){
	 clickEchart=echarts.getInstanceById($(target).parent(".Switch").siblings(".echartsWraper").attr("_echarts_instance_"));
	 createTab(clickEchart.getOption())
 }
 /*********生成右侧选项功能卡**************/
 function createTab(data){
      var dimenHtml="";
	  var metrHtml="";
	  var typeHtml="";
	  var filterHtml='';
	  for(var i=0;i<data.data.metricsList.length;i++){
		       metrHtml+="<div class='indicators-item'>"
		       metrHtml+="<div class='custom-control custom-checkbox custom-control-primary mb-1'>"
			   for(var p in data.data.metricsList[i]){
				   metrHtml+="<input type='checkbox' class='custom-control-input' name='check' id='checkbox"+i+"' data-index='"+data.data.metricsList[i][p]+"' value='"+p+"' />";
				   metrHtml+="<label class='custom-control-label' for='checkbox"+i+"'>"+p+"</label>";
			   }
		       metrHtml+="</div>"
		       metrHtml+="</div>"
	   }
       document.getElementById("metricsList").innerHTML=metrHtml;
       setSelect("check");
       for(var j=0;j<data.data.dimensionsList.length;j++){
    	          dimenHtml+="<div class='dimension-item'>"
    	          dimenHtml+="<div class='custom-control custom-radio custom-control-inline custom-control-primary'>"  
    		    for(var p in data.data.dimensionsList[j]){
    			  dimenHtml+="<input class='custom-control-input' id='item"+j+"' type='radio' name='item' value='"+p+"' data-index='"+data.data.dimensionsList[j][p]+"'>";
    	          dimenHtml+="<label class='custom-control-label' for='item"+j+"'>"+p+"</label>";
    		    }
    	          dimenHtml+="</div>"
    	          dimenHtml+="</div>"
	   }
       document.getElementById("dimensionsList").innerHTML=dimenHtml;
       setSelect("item");
       $("input[name='type']").each(function(){
		  if($(this).val()==data.series[0].type){
			   $(this).prop("checked",true);
		  }
	   })
	   if(data.data.condition){
		   var len=data.data.condition.split(';');
		   var filterHtml
		   for(var i=0;i<len.length;i++){
			   filterHtml+='<option style="width:100px;overflow: hidden;text-overflow: elipsis;white-space: nowrap;" value="'+len[0]+'">'+len[0]+'</option>';
		   } 
		   document.querySelector('#selectDate2').innerHTML=filterHtml;
	   }else{
		   $("#stateChange2").addClass('hidden');
	   }
	   if(data.data.filterList[0].value.length==0){
		   $("#stateChange1").addClass('hidden');
	   }else{
		   $("#stateChange1").removeClass('hidden');
		   $("#filterName").text(data.data.filterList[0].filterName)
		   for(var i=0;i<data.data.filterList[0].value.length;i++){
			   filterHtml+='<option style="width:100px;overflow: hidden;text-overflow: elipsis;white-space: nowrap;" value="'+data.data.filterList[0].filterName+'=='+data.data.filterList[0].value[i].id+';'+'clubid=='+getClubId()+'">'+data.data.filterList[0].value[i].name+'</option>';
		   } 
	   }
       document.querySelector('#selectDate1').innerHTML=filterHtml;
       $("#selectDate1 option[value='"+data.data.filters+"']").attr("selected",true);
       for(var i=0;i<data.data.typeList.length;i++){
		   typeHtml+="<div class='dimension-item'>";
		   typeHtml+="<div class='custom-control custom-radio custom-control-inline custom-control-primary'>"
		  
		   for(var p in data.data.typeList[i]){
			   typeHtml+="<input class='custom-control-input' id='item1"+i+"' type='radio' name='type2'  date-type='"+translateE(p)+"' value='"+p+"' data-index="+data.data.typeList[i][p]+">";
			   typeHtml+="<label class='custom-control-label' for='item1"+i+"'><i class='iconfont'>"+chartIcon[translateE(p)]+"</i>&nbsp;"+p+"</label>";
			  // typeHtml+="<div class='icon' style='margin-top:15px;'>";
			  // typeHtml+="<img src='/assets/images/"+translateE(p)+".png' width='80px'/>";
		   }
		   typeHtml+="</div>";
		   typeHtml+="</div>";
		   typeHtml+="</div>";
	  }
       console.log(data.data.filterList)
      document.querySelector('#chartType').innerHTML=typeHtml;
      setSelect('type2');
      if(data.data.type.indexOf(':')==-1){
    	  $("input[name='type2']").each(function(){
  			if($(this).val()==data.data.type){
  				$(this).prop("checked",true)
  			}
  		})
	  }
	  $("#subName").text(data.data.cardName);
 }
 /*********根据后台值动态选择***/
 function setSelect(name){
	$("input[name='"+name+"']").each(function(){
		if($(this).attr("data-index")=="true"){
			$(this).prop("checked",true)
		}
	})
 }
 /**********
  * toggerLengend
  * ************/
 function toggerLengend(event){
    var myEcharts=echarts.getInstanceById($(event).parents('.bottomIcon').next().attr("_echarts_instance_"));
    var lengendName=$(event).next().text();
    if($(event).prop('checked')){
		myEcharts.dispatchAction({
		    type: 'legendSelect',
		    // 图例名称
		    name: lengendName
		})
	}else{
	    myEcharts.dispatchAction({
		    type: 'legendUnSelect',
		    // 图例名称
		    name: lengendName
		})
	}
 }
 /** *****重造数据************* */
 function setData(data){
 	 var m={
 		data1:data.body,
 		type:data.head.chart_type.indexOf(':')==-1 ? data.head.chart_type : translateType(data.head.chart_type),
 		unit:data.head.unit,
 		yName:data.head.axis_y,
 		xName:data.head.axis_x,
 		startTime:data.head.startTime,
 		endTime:data.head.endTime,
 		key:data.key,
 		erro_code:data.head.err_code
 	 }; 
		 return m;
  }
 function structure(data){
		var array=[];
		var leap=true;
		var obj={
	        lenged:[],
	        xData:[],
			serise:[],
			totalData:[],
			key:data.key,
			erro_code:data.erro_code,
			unit:data.unit,
			yName:data.yName,
			xName1:data.xName,
			startTime:data.startTime,
			endTime:data.endTime
		}
		totalArray=[]
		for(var a=0;a<data.data1.length;a++){
			obj.totalData[a]=[];
			for(var p in data.data1[a]){
				obj.lenged.push(p)
		    }
			for(var xData in data.data1[a]){
 			for(var o in data.data1[a][xData]){
 				for(var p=0;p<data.data1[a][xData][o].length;p++){
 					if($.inArray(data.data1[a][xData][o][p][0],obj.xData)<0){
 						obj.xData.push(data.data1[a][xData][o][p][0])
 					}
 				}
 		    }
 		}
			obj.serise.push({
				name:obj.lenged[a],
                type:data.type,
               // stack:'',
				symbol:'circle',
				symbolSize:5,
				// barGap:'0%',
				barMaxWidth:20,
			    itemStyle:{
			      barBorderRadius:20
			    },
				data:[]
			})
			  for(var p in data.data1[a]){
				   for(var m in data.data1[a][p]){
						for(var n=0;n<data.data1[a][p][m].length;n++){
							var array=[]
				   			if(data.data1[a][p][m][n][1] instanceof Array){
				   			   // data.data1[a][p][m][n][1][2]==undefined ? obj.serise[a].stack='' : obj.serise[a].stack=data.data1[a][p][m][n][1][2].stack;
				   			    var showType='insideTop'
				   			    if(obj.serise[a].type=='bar'){
				   			    	showType='insideTop';
				   				}else{
				   					showType='top';
				   				}
				   			    if(data.data1[a][p][m][n][1][2]!=undefined){obj.serise[a].barWidth='';}else{showType='top';}
				   			    obj.serise[a].data.push({
				   					 value:data.data1[a][p][m][n][1][0],
				   					 total:data.data1[a][p][m][n][1][1],
				   					 unit:obj.unit,
				   					 label:{
				   					     normal:{
			     						     show:false,            // 显示数字
			     						     position:showType,
			     					         formatter:function(parmes){
			     					        	if(showType=='insideTop'&&parmes.value<10){
			     					        		return '';
			     					        	}else{
			     					        		if(showType=='insideTop'&&data.data1.length>4){
			     					        		      return  $.toLocaleString12(Number(parmes.value))+obj.unit+"\n ("+parmes.data.total+")"
			     					        		}else{
			     					        			 return  $.toLocaleString12(Number(parmes.value))+obj.unit+" ("+parmes.data.total+")"
			     					        		}
                                                 }
                                              }
                                          },
				   					 },
                               })
				   			}else{
				   			   // data.data1[a][p][m][n][1][2]==undefined ? obj.serise[a].stack='' : obj.serise[a].stack=data.data1[a][p][m][n][1][2].stack;
				   				obj.serise[a].data.push({
				   					value:data.data1[a][p][m][n][1],
				   				    label:{
			   					      normal:{
		     						     show:false,            // 显示数字
		     						    // position:'insideTop' , //这里可以自己选择位置
		     						     position:'top' ,
		     						     formatter:function(value,index){
		     						    	return $.toLocaleString12(value.data.value)+obj.unit;
		     						     }
		     						     // formatter:"{c}"+obj.unit
                                       },
			   					   },
				   	           })
				   		    }
				        }
				    }
			    }
           }
	    return obj;  
	}
 /** *******获取当前时间******* */
 function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
 // 獲取前6個月日期
 function GetPreMonthDay(date, monthNum) {
      var dateArr = date.split('-');
      var year = dateArr[0]; // 获取当前日期的年份
      var month = dateArr[1]; // 获取当前日期的月份
      var day = dateArr[2]; // 获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); // 获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - monthNum;
      if (month2 <= 0) {
          var absM = Math.abs(month2);
          year2 = parseInt(year2) - Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
          month2 = 12 - (absM % 12);
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
          day2 = days2;
      }
      var t2 = year2 + '-' + month2 + '-' + day2;
      return t2;
  }
 function translateE(name){
 	if(name=='柱狀圖'){
			return 'bar'
		}else if(name=='折線圖'){
			return 'line'
		}else{
		    return 'pie'	
		}
 }
 function translateType(type){
 	var array=type.split(';')
 	for(var a=0;a<array.length;a++){
 		if(array[a].split(':')[1]=="true"){
 			return translateE(array[a].split(':')[0])
 		}
 	}
 }
 /***************************************************************************
	 * 获取指标卡
	 **************************************************************************/
 function searchSystemIndicatorCard(){
	  var cardName=$("#cardName").val()
	  $.ajax({
         type:'get',
         url:getSystemIndicatorCard,
         dataType:'json',
         cache: false,
         data:{
       	    cardName:cardName,
       	    clubId:getClubId
         },
         success:function(data){
      	     if(data.status=="true"){
      	    	indicatorCards=data.datalist;
      	    	setTree(data.datalist);
             }
         },
         error:function(){}
	   })
 }
 /** **改造指标卡数据结构***** */
 function setTree(datalist){
	 if(datalist.length==0){
		  $("#select-list .unselect .select_box").html("<div style='text-align:center;margin-top:30px;'>未搜尋到相關指標卡</div>"); 
	 }else{
		    var mm={}
			for(var a=0;a<datalist.length;a++){
				if(!mm.hasOwnProperty(datalist[a].category)){
					 mm[datalist[a].category]=[];
				}
				mm[datalist[a].category].push(datalist[a]);
			}
			var html="";
			for(var p in mm){
				html+="<li class='nav-main-item'>";
				html+="       <a class='nav-main-link nav-main-link-submenu' data-toggle='submenu' aria-haspopup='true' aria-expanded='true' href='#' style='display:inline-block;'>";
				html+="         <span class='nav-main-link-name'></span>";
				html+="         <span class='nav-main-link-badge1 ' style='margin-left:10px;'>"+p+"</span>";
				html+="       </a>";
				html+="   <ul class='nav-main-submenu'>";
				      for(var a=0;a<mm[p].length;a++){
				    	  html+="<li class='nav-main-item   active select_box_item animated' data-type='"+p+"'>"
				    	  html+="  <span class='iconfont' style='margin-right: 10px;'>&#xe643;</span>";
				    	  html+="   <a class='nav-main-link' href='#'>";	 
				    	  html+="      <span class='nav-main-link-badge1 text-overflow'>"+mm[p][a].cardName+"</span>";
				    	  html+="  </a>";
				    	  html+="</li> "  ;
				      }
				        
				html+="</ul>";
	            html+=" </li>"
			}
			
			 $("#select-list .unselect .select_box").html(html);
             $("#select-list .select .select_box .nav-main-item").each(function(index,item){
            	 $("#select-list .unselect .select_box .nav-main-submenu .nav-main-item").each(function(index,item2){
            		if($(item).find("a>.nav-main-link-badge1").text()==$(item2).find("a>.nav-main-link-badge1").text()){
            			$(item2).removeClass("animated").addClass("unselectDom");
            		}
            	 })
			})
			
			$("#edit .unselect .select_box").html(html);
	  }  
 }
 /******
  * 创建报表
  * ********/
 function createReports(){
	 var formName=$.trim($("#formName").val());
	 toastr.options={
			  positionClass:"toast-top-center",
			  preventDuplicates:true
		  }
	 if(!formName){toastr.warning("請先輸入報表名稱"); return false};
	 var startTime=new Date($.GetPreMonthDay($.getNowFormatDate(),6)).getTime();
	 var endTime=new Date($.getNowFormatDate()).getTime();
	 var cards=[];
	 $("#select-list .select .select_box .nav-main-link-badge1").each(function(i,o){
		 for(var a=0;a<indicatorCards.length;a++){
			 if($(o).text()==indicatorCards[a].cardName){
				 cards.push(indicatorCards[a])
			 }
		 }
	 })
	 if(cards.length==0){toastr.warning("請先添加指标卡"); return false}
	 for(var a=0;a<cards.length;a++){
		 cards[a].maxresult=cards[a].maxResult;
		 cards[a].startTime=startTime;
		 cards[a].endTime=endTime;
		// total[a].filters=total[a].filters.replace("clubid=="+getClubId,'')
		 cards[a].filters.split(";").length==2 ? cards[a].filters=cards[a].filters.split(";")[0].split("==")[0]+":"+cards[a].filters.split(";")[0].split("==")[1] : cards[a].filters=""
	 }
	 $.ajax({
	       type:'post',
	       url:addForm,
	       dataType:'json',
	       cache: false,
	   // async: false,
	      data:{
		   	  "formName":formName,
		  	  "categoryId":407,
		  	  "unifyTime":true,
		  	  "start":startTime,
		  	  "end":endTime,
		  	  "flag":false,
		  	  // "userId":$('.user-img').attr('uid'),
		  	  "userId":151092,
		  	  "clubId":6,
		  	  "indicatorCards":JSON.stringify(cards)
	    },
	   success:function(data){
		   if(data.status=="true"){
			   toastr["success"]("創建報表成功");
			   tran('select-report',true);
			   FormList();
		   }else{
	      	   toastr.warning(data.message)
	       }
	    },
	    error:function(){}
	   })
 }
 
 /************更改指标卡信息*****************/
 function saveChange(){
	 var metrics=[];
	 $.each($('#metricsList input:checkbox'),function(){
         if(this.checked){
        	 metrics.push($(this).val())
          }
     });
	 if(metrics.length==0){
		 toastr.warning("請先選擇指標")
		 return false;
	 }
	 //document.getElementById("loading_lock").style.display="block";
	 var cardId=clickEchart.getOption().data.cardId;
	 var category=clickEchart.getOption().data.category;
	 var dimensions=$("#dimensionsList input[name='radio']:checked").val();              
	 var metrics=metrics.join(';');                  
	 var maxResult=clickEchart.getOption().data.maxResult;
	 var sort=clickEchart.getOption().data.sort;
	 var filters=clickEchart.getOption().data.filters;
	 var cardName=clickEchart.getOption().data.cardName;
	 var type1=$("input[name='type2']:checked").attr('date-type');
	 var typeList=[];
	 var typeList1=[];
	  for(var a=0;a<$("input[name='type2']").length;a++){
		  var b={}
		  typeList.push($($("input[name='type2']")[a]).val()+":"+$($("input[name='type2']")[a]).prop('checked'))
		  b[$("input[name='type2']")[a].value]=$($("input[name='type2']")[a]).prop("checked")
		  typeList1.push(b)
	  }
	 var mesfilter='';
	 var dimen=[];
     var metri=[];
     var dimensionsList=[];
     var metricsList=[];
     for(var a=0;a<$("#dimensionsList input[name='item']").length;a++){
		var b={};
		dimen.push($($("#dimensionsList input[name='item']")[a]).val()+":"+$($("#dimensionsList input[name='item']")[a]).prop('checked'))
		b[$($("#dimensionsList input[name='item']")[a]).val()]=$($("#dimensionsList input[name='item']")[a]).prop('checked')
		dimensionsList.push(b);
	  }
	for(var a=0;a<$("#metricsList input[name='check']").length;a++){
		var b={};
		metri.push($($("#metricsList input[name='check']")[a]).val()+":"+$($("#metricsList input[name='check']")[a]).prop('checked'));
	    b[$($("#metricsList input[name='check']")[a]).val()]=$($("#metricsList input[name='check']")[a]).prop('checked');
	    metricsList.push(b);
	 }
	if($("#selectDate1").val()==null){
		mesfilter='';
	}else{
		$("#selectDate1").val().split(";").length==2 ? mesfilter= $("#selectDate1").val().split(";")[0].split('==')[0]+':'+$("#selectDate1").val().split(";")[0].split('==')[1] : mesfilter='' ;
	}
	if(comType!='1'){
		$.ajax({
            type:'post',
            url:'/BI/updateIndicatorCard.do',
            dataType:'json',
            cache:false,
           // async:false,
            data:{
                  "cardId" :cardId,
    			  "category":category,
    			  "dimensions":dimen.join(';'),
    			  "metrics":metri.join(';'),
    			  "maxResult":maxResult,
    			  "startTime":new Date(reportStartTime).getTime(),
    			  "endTime":new Date(reportendTime).getTime(),
    			  "type":typeList.join(";"),
    			  "sort":sort,
    			  "filters":mesfilter,	 
    			  "cardName":cardName, 
              },
            success:function(data){
                if(data['status'] == "true"){
                	for(var i=0;i<paramesData.datalist.length;i++){
                		if(paramesData.datalist[i].cardId==clickEchart.getOption().data.cardId){
                			//paramesData.datalist[i].typeList=typeList;
                			paramesData.datalist[i].dimensionsList=dimensionsList;
                			paramesData.datalist[i].metricsList=metricsList;
                			paramesData.datalist[i].typeList=typeList1;
                			$("#selectDate1").val()==null ? paramesData.datalist[i].filters=filters : paramesData.datalist[i].filters=$("#selectDate1").val();
                			//paramesData.datalist[i].endTime=end;
                		    //paramesData.datalist[i].type=type1;
                			paramesData.datalist[i].type=typeList.join(";");
                			getSingleChartData(paramesData);
                          }else{ 
                			 continue;
                		 }
                	 }
                }else{
                    console.error("获取数据失败");
                }
            },
            error:function(errMsg){
                console.error("获取数据失败");
            }
        });
	}else{
		for(var i=0;i<paramesData.datalist.length;i++){
    		if(paramesData.datalist[i].cardId==clickEchart.getOption().data.cardId){
    			paramesData.datalist[i].dimensionsList=dimensionsList;
    			paramesData.datalist[i].metricsList=metricsList;
    			paramesData.datalist[i].typeList=typeList1;
      		//	paramesData.datalist[i].filters=$("#selectDate1").val();
    			$("#selectDate1").val()==null ? '' : paramesData.datalist[i].filters=$("#selectDate1").val();
    		    paramesData.datalist[i].type=type1;
    		    getSingleChartData(paramesData);
              }else{ 
    			 continue;
    		 }
    	 }
      }
  }

 /*******
  * currentIndex:當前激活的tab 索引值
  * max:一行顯示多少個tab
  * total:共有多少個的tab 項
  * *********/
 function goEcharts(index,event){
	 $(event).parent('li').siblings().removeClass("active").end().addClass("active");
	 mySwiper.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
 }
 /******
  * Tab 左右切換
  * ******/
 function Tabs(){
	 var total=$("#tab-content-header-Menu li").length;
//	 if(total<=3){
//		 $(".control-panel").addClass("hidden");
//	 }else{
//		 $(".control-panel").removeClass("hidden");
//	 }
	 //$("#tab-content-header-Menu").css
	 //var swiperIndex=index==1 ? mySwiper1 : mySwiper2;
	 //var total=$(e).find('li').length;
	 var tabsWidth=$('.nav-tabs').outerWidth();
	 var smallTabWidth=(tabsWidth-60)/3  //每个tab的宽度
	 var currenLength=0;
     var currentIndex=0;
	 var max=3;
	 $("#echarts1 .nav-tabs li").each(function(index,item){
		 if(index>=3){
			 $(item).addClass("hidden");
			
		 }
		 $(item).css("width",smallTabWidth+"px")
	 })
	 $("#echarts1 .control-panel .left").unbind("click").click(function(event){
		 var currentIndex=$("#echarts1 .nav-tabs li.active").index();
		 var currentIndex=$(this).parent().next().find('li.active').index();
		 if(currentIndex<=0){
			     return false
		 }else{
			  $("#echarts1 .nav-tabs li").removeClass("active");
		      if(currentIndex<=max-1){
					 currentIndex=currentIndex-1;
					 $("#echarts1 .nav-tabs li:eq("+currentIndex+")").addClass("active")
					 mySwiper.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
					 return false;
				 }else{
					 if(!$("#echarts1 .nav-tabs li:eq("+currentIndex+")").prev().hasClass('hidden') && !$(".nav-tabs li:eq("+currentIndex+")").next().hasClass('hidden')){
						 currentIndex=currentIndex-1;
						 $("#echarts1 .nav-tabs li:eq("+currentIndex+")").addClass("active");
						 return false;
					 }
					 if($("#echarts1 .nav-tabs li:eq("+currentIndex+")").prev().hasClass('hidden')){
						 currentIndex=currentIndex-1;
						 $("#echarts1 .nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass('hidden').nextAll().addClass('hidden')
					       $("#echarts1 .nav-tabs li:eq("+currentIndex+")").prev().removeClass('hidden').prev().removeClass('hidden')
						 //$(".nav-tabs li:not('.hidden'):last").addClass('hidden')
					    return false;
					 }
					 currentIndex=currentIndex-1;
					 $("#echarts1 .nav-tabs li:eq("+Math.abs(currentIndex-max+1)+")").removeClass("hidden")
                     $("#echarts1 .nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass('hidden').nextAll().addClass('hidden');
				 }
         }	
		 mySwiper.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
		 event.stopPropagation();
	 })
	 $("#echarts1 .control-panel .right").unbind("click").click(function(){
		 var currentIndex=$(".nav-tabs li.active").index();
		 if(currentIndex==total){
			 return false
		 }else{
			 currentIndex=currentIndex+1;
			 if(currentIndex>=total){
				 return false
			 }
			 $(".nav-tabs li").removeClass("active");
			 if(currentIndex>=max){
				 $(".nav-tabs li:eq("+(currentIndex-max)+")").addClass("hidden").prevAll().addClass("hidden")  
			 }
			 $(".nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass("hidden");
		 }
		 mySwiper.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
	 })
 }
 
 function Tabs2(){
	 var total=$("#tab-content-header-Menu2 li").length;
	 var tabsWidth=$('#echarts2 .nav-tabs').outerWidth();
	 var smallTabWidth=(tabsWidth-60)/3  //每个tab的宽度
	 var currenLength=0;
     var currentIndex=0;
	 var max=3;
	 $("#echarts2 .nav-tabs li").each(function(index,item){
		 if(index>=3){
			 $(item).addClass("hidden");
		 }
		 $(item).css("width",smallTabWidth+"px")
	 })
	 $("#echarts2 .control-panel .left").unbind("click").click(function(event){
		 var currentIndex=$("#echarts2 .nav-tabs li.active").index();
		 if(currentIndex<=0){
			     return false
		 }else{
			  $("#echarts2 .nav-tabs li").removeClass("active");
		      if(currentIndex<=max-1){
					 currentIndex=currentIndex-1;
					 $("#echarts2 .nav-tabs li:eq("+currentIndex+")").addClass("active")
					 mySwiper2.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
					 return false;
				 }else{
					 if(!$("#echarts2 .nav-tabs li:eq("+currentIndex+")").prev().hasClass('hidden') && !$(".nav-tabs li:eq("+currentIndex+")").next().hasClass('hidden')){
						 currentIndex=currentIndex-1;
						 $("#echarts2 .nav-tabs li:eq("+currentIndex+")").addClass("active");
						 return false;
					 }
					 if($("#echarts2 .nav-tabs li:eq("+currentIndex+")").prev().hasClass('hidden')){
						 currentIndex=currentIndex-1;
						 $("#echarts2 .nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass('hidden').nextAll().addClass('hidden')
					       $("#echarts2 .nav-tabs li:eq("+currentIndex+")").prev().removeClass('hidden').prev().removeClass('hidden')
						 //$(".nav-tabs li:not('.hidden'):last").addClass('hidden')
					    mySwiper2.slideTo(currentIndex, 1000, false)
					       return false;
					 }
					 currentIndex=currentIndex-1;
					 $("#echarts2 .nav-tabs li:eq("+Math.abs(currentIndex-max+1)+")").removeClass("hidden")
                     $("#echarts2 .nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass('hidden').nextAll().addClass('hidden');
				 }
         }	
		 mySwiper2.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
		 event.stopPropagation();
	 })
	 $("#echarts2 .control-panel .right").unbind("click").click(function(){
		 var currentIndex=$("#echarts2 .nav-tabs li.active").index();
		 if(currentIndex==total){
			 return false
		 }else{
			 currentIndex=currentIndex+1;
			 if(currentIndex>=total){
				 return false
			 }
			 $("#echarts2 .nav-tabs li").removeClass("active");
			 if(currentIndex>=max){
				 $("#echarts2 .nav-tabs li:eq("+(currentIndex-max)+")").addClass("hidden").prevAll().addClass("hidden")  
			 }
			 $("#echarts2 .nav-tabs li:eq("+currentIndex+")").addClass("active").removeClass("hidden");
		 }
		 mySwiper2.slideTo(currentIndex, 1000, false);//切换到第一个slide，速度为1秒
	 })
 }
 /*****
  * 返回数组中最大的一项
  * *******/
 function getMax(arr){
	 return Math.max.apply(Math,arr.map(function(item){return item.value})); 
 }
 /****************汇出报表***************/
 function exportingReport(){
	 $("#image-block").find(".image-pdf").remove();
	 createPdf()
 }
 /******
  * 
  * 生成 pdf 图片
  * ************/
 function createPdf(){
	  var index=$("#tab-content-header-Menu2 li.active").index();
	  html2canvas(document.getElementById("header-Menu2"),{
		  width:$("#header-Menu2").outerWidth(),
		  height: $("#header-Menu2").outerHeight(),
	  }).then(function(canvas){
		  var contentWidth = canvas.width;
          var contentHeight = canvas.height;
           var pageData = canvas.toDataURL('image/jpeg', 1.0);
            html2canvas(document.getElementById("homea"+index+""),{
            	allowTaint:true,
            	background:"#fff",
     		    height: $("#homea"+index+"").outerHeight(),
     	    }).then(function(canvas2){
     		   var contentWidth = canvas2.width;
               var contentHeight = canvas2.height;
               var pageData2 = canvas2.toDataURL('image/jpeg', 1.0);
               var html="";
               html+="<div class='image-pdf' style='text-align: center;'>";
               html+="<img class='header-pic' src='"+pageData+"'/>";
               html+="<img class='main' src='"+pageData2+"'/>";
               html+="</div>";
               $("#image-block").append(html);
               $("#echarts2 .control-panel .right").trigger('click');
               if($("#tab-content-header-Menu2 li").length==index+1){
            	   setTimeout(function(){
            		   html2canvas(document.getElementById("pdf-page"),{ 
             	    	  width:$("#pdf-page").outerWidth(),
             			  height:$("#pdf-page").outerHeight(),
             		  }).then(function(canvas3){
             			   var contentWidth = canvas3.width;
             	           var contentHeight = canvas3.height;
             	           //一页pdf显示html页面生成的canvas高度;
             	           var pageHeight = contentWidth / 592.28 * 841.89;
             	           //未生成pdf的html页面高度
             	           var leftHeight = contentHeight;
             	           //页面偏移
             	           var position = 0;
             	           //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
             	           var imgWidth = 595.28;
             	           var imgHeight = 592.28/contentWidth * contentHeight;
             			   var pageData3 = canvas3.toDataURL('IMAGE/JPEG', 1.0);
             			   var pdf = new jsPDF('', 'pt', 'a4');
             			    
             			   if (leftHeight < pageHeight) {
                                pdf.addImage(pageData3, 'JPEG', 0, 0, imgWidth, imgHeight );
                            } else {
                                while(leftHeight > 0) {
                                    pdf.addImage(pageData3, 'jpeg', 0, position, imgWidth, imgHeight)
                                    leftHeight -= pageHeight;
                                    position -= 820;
                                    //避免添加空白页
                                    if(leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
             			  // pdf.addImage(pageData3, 'JPEG', 0, 0, imgWidth, imgHeight );
             			   pdf.save("史国雄123400000"+".pdf");   
             		   })
             	        return false
            	   },100)   
               }else{
            	   setTimeout(function(){
            		   createPdf()
            	   },200)  
               }
     	    })
	   })
 }

 /****
  * 删除报表
  *******/
  function deleteReport(obj){
	  var formId=obj.getAttribute('data-formId')
	   //tran('edit-report',true)
	 // return false;
	  //data-formId
	  $.ajax({
	      type:'post',
	      url:deleteUserDefinedForm,
	     // url:'/BI/deleteUserDefinedForm.do',
	      dataType:'json',
	      cache: false,
	    //  async: false,
	      data:{
	    	  "formId":formId
	      },
	      success:function(data){
	      	if(data.status=="true"){
	      		tran('edit-report',true);
	      		toastr.success("成功刪除該報表");
	      		getUserDefinedReport();
	      		FormList();
	      	}
	      },
	      erro:function(err){
	      	
	      }
	 })
  }
  
  /************
   * 选择日期时更改指标卡信息
   ************/
  function searchReport(n){
	  if(n==1){
		  var startTime=$("#StartTime").datepicker("getDate");
	   	  var endTime=$("#EndTime").datepicker("getDate");
	   	  reportStartTime=new Date(startTime).getFullYear() + '-' + (new Date(startTime).getMonth() + 1) + '-' + new Date(startTime).getDate();
	      reportendTime=new Date(endTime).getFullYear() + '-' + (new Date(endTime).getMonth() + 1) + '-' + new Date(endTime).getDate();
	   	  console.log(paramesData)
	      for(var a=0;a<paramesData.datalist.length;a++){
	   		paramesData.datalist[a].startTime=new Date(startTime).getTime();
	   		paramesData.datalist[a].endTime=new Date(endTime).getTime();
	   		paramesData.datalist[a].maxresult=paramesData.datalist[a].maxResult;
	   	  }
	   	 if(comType!='1'){
	    	  var newParmes=$.extend({},paramesData);
	    	  for(var a=0;a<newParmes.datalist.length;a++){
	    		 newParmes.datalist[a].filters.split(";").length==2 ? newParmes.datalist[a].filters=newParmes.datalist[a].filters.split(";")[0].split("==")[0]+":"+newParmes.datalist[a].filters.split(";")[0].split("==")[1] : newParmes.datalist[a].filters="";
	          } 
	    	  $.ajax({
		        type:'post',
		        url:'/BI/editCommonForm.do',
		        dataType:'json',
		        cache: false,
		        //async: true,
		        //"userId":'151092', // $('.user-img').attr('uid'),
				//"clubId":6  
		        data:{
		          "formId":Number(formId),
			   	  "formName":formName,
			  	  "categoryId":147,
			  	  "unifyTime":true,
			  	  "start":new Date(startTime).getTime(),
			  	  "end":new Date(endTime).getTime(),
			  	  //"flag":flag,
			  	  "clubId":6,
			  	  "userId":151092,
			  	  "indicatorCards":JSON.stringify(newParmes.datalist)
		      },
		      success:function(data){
		  	     if(data.status=="true"){
		  		   
	             }else{
		  		   toastr.warning(data.message);
		  	     }
		       },
		      error:function(err){
		    	 console.log(err)
		       }
		    })
	     }
	 	 $("#loading_lock").show();
		 for(var a=0;a<paramesData.datalist.length;a++){
	  		paramesData.datalist[a].startTime=reportStartTime;
	  		paramesData.datalist[a].endTime=reportendTime;
	  		paramesData.datalist[a].maxresult=paramesData.datalist[a].maxResult;
	  		paramesData.datalist[a].filterList[0].value.length!=0 ? paramesData.datalist[a].filters=paramesData.datalist[a].filterList[0].filterName+'=='+paramesData.datalist[a].filterList[0].value[0].id+';'+"clubid=="+getClubId() : paramesData.datalist[a].filters="clubid=="+getClubId();//cardList.datalist[a].filters=+"clubId=="+getClubId();
		 }
	  }else{
		  $("#web2-select-rounded").val()
	  }
	  setTimeout(function(){
	     	getChartData(paramesData);
	  },200)
     
  }
//日期格式转化
  function tranDate(date){
	  var time=new Date(date);
	  return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()	  
  }
  /*******獲取前幾天日期*********/
  function getBeforeDate(n){
	       var n = n;
	       var d = new Date();
	       var year = d.getFullYear();
	       var mon=d.getMonth()+1;
	       var day=d.getDate();
	      if(day <= n){
	               if(mon>1) {
	                  mon=mon-1;
	              }
	             else {
	               year = year-1;
	                mon = 12;
	                }
	              }
	            d.setDate(d.getDate()-n);
	            year = d.getFullYear();
	            mon=d.getMonth()+1;
	            day=d.getDate();
	       s = year+"-"+mon+"-"+day;
	       return s;
	   }