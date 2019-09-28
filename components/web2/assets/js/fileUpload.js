

$(function() {
	$('#hc1-menu5').addClass('active').siblings().removeClass('active');
	$('#hc1-menu5').find('ul li').eq(1).addClass('active').siblings().removeClass('active');
	uploadFileInit();
	//選擇健检报告
	var regext = /\.xls$|\.xlsx$/gi;
	function checkfile() {
		//var browsertype = userBrowser();
		var filePath = $('#uploadfile').val();
		regext.lastIndex=0;
		if(regext.test(filePath)){
			$('#uploadfile').next('input').attr("value", filePath);
		}else {
			$('#uploadfile').val('');
			alert("您輸入的excell格式不正确。");
		}
	}
	$(document).on('change','#uploadfile', function(){
		checkfile();
	});
});

/**********************************
 * 上傳健檢報告初始化
 * params:
 *********************************/
var filecount;
function uploadFileInit(){
    var option= {
        language: 'zh-TW',
        showPreview: false,
        showCaption: true,
        initialCaption: "請選擇文檔，當前支持格式為xls、xlsx",
        uploadAsync: false,
        showUpload:true,
        showRemove:true,
        mainClass:"text-muted",
        browseClass: "btn btn-custom",
        uploadUrl:'http://hc1-test.lifit.com.cn/BI/excelController/uploadExcelFile.do', 
       /* allowedFileExtensions : ['xls', 'xlsx','jpg'],*/
        overwriteInitial: false,
        fileActionSettings:{
            showUpload:false
        },
        uploadExtraData:{
        	 //did:$('.user-box img').attr('uid'),
		     //clubId: getClubId()
        }
    }
    //設置上傳組件參數
    $("#upload_files").fileinput(option);
    //上傳完成時觸發
    $("#upload_files").on("filebatchuploadsuccess", function (event, data, previewId, index) {
    	var response = data.response;
        if(response.status=='true'){
			var textTmp = '';						
			textTmp = '成功導入了'+response.passNum+'條健檢數據。<br/>';
			if(response.failNum!="0"){
				textTmp +='<br/>警告：文檔中有'+response.failNum+'處錯誤內容，分別是：<br/>';
			}	
			textTmp='成功導入文檔'
			var errorinfo = response.errorinfo;
			var errorFile=[];
			for(var j in errorinfo){							
				if(errorinfo[j].errmsg){
					errorFile.push( errorinfo[j].fileName+"："+errorinfo[j].errmsg);				
				}else{
					if(errorinfo[j].errorList.length!=0){
						textTmp += errorinfo[j].fileName+"："
						$.each(errorinfo[j].errorList, function(i, v){					
							if(i==(errorinfo[j].errorList.length-1)){
								textTmp += '第'+v.split(',')[0]+'行，第'+v.split(',')[1]+'列。';			
							}else {
								textTmp += '第'+v.split(',')[0]+'行，第'+v.split(',')[1]+'列；';
							}
						});
						textTmp += "<br/>";
					}				
				}													
			}					
			if(errorFile.length!=0){		
				textTmp+='<br/>警告：以下文檔因其它問題無法導入：<br/>';
				textTmp+=errorFile.join("<br/>")
			}
			$('#warning-modal .modal-body p').html(textTmp);
			$('#warning-modal').modal('show');			
			$('#upload_show').val('');	
			
			//add ga
			ga('send','event','檔案上傳','buttonPress','數據檔案上傳',1);
		}else{
			$('#warning-modal .modal-body p').text(response.message);
			$('#warning-modal').modal('show');
			$('#upload_show').val('');		
		}
		
    });    
    //選擇好上傳文件時觸發
    $("#upload_files").on('filebatchselected', function(event, files) {
        var regext = /\.(?:xls|xlsx)$/i;
        var errorfile=[];
        regext.lastIndex=0;
        for(var i=0,flag=true,len=files.length;i<len;flag ? i++ : i){
            if(files[i]&&!regext.test(files[i].name)){
                console.error(files[i].name);
                errorfile.push(files[i].name);
                files.splice(i,1);
                flag = false;
            } else {
                flag = true;
            }
        }
        $('#upload_files').fileinput('clearStack');
        for(var m in files){
            $('#upload_files').fileinput('addToStack',files[m]);
        }
        if(errorfile.length!=0){
            alert(errorfile.join("\n")+"\n文件格式不正確，當前支持格式為xls,xlsx");
        }
        if(files.length==1){
            $("#upload_show").val(files[0].name);
        }else if(files.length>1){
            $("#upload_show").val("已選中"+files.length+"個文檔");
        }
    });
    $("#upload_files_btn").click(function(){
        var filesCount = $("#upload_files").fileinput('getFilesCount');
        if(filesCount==0){
            alert("請選擇要上傳的文檔");
            return false;
        }
        $("#upload_files").fileinput('upload');
    });
}

