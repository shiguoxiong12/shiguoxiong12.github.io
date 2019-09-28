var planInfo={
    status :"true",
    id:"13123",             //计划ID
    title:"三高服務套餐",   //计划名称
    state : "3",	 		//（注：“0”：待送审，“1”：审核中，“2”：待上架，“3”：已上架，”5”：已下架）
    phases: 3,  					//包含多少个阶段
    duration: 90,					//累计时长 （天）
    joinNum: 566, 				    //套餐累計加入人数
    executeNum : 123,      		    //套餐执行人数
    completeNum: 17,                //套餐累計完成人數
    open: "1",             			//是否开放 （注：“0“：否，“1”：是）
    member: "1",               	    //是否允许非会员（注：“0“：否，“1”：是）
    putonTime : '',   			    //上架时间（没有则返回空串）
    putoffTime:	  1481501288000,	//下架时间（没有则返回空串）
    phaseList:[                     //阶段信息（注：按阶段执行顺序排列）
        {
            id:"234",               //阶段id
            title:"每天测血压",     //阶段标题
            duration: 30			//时长 （天）
        },
        {
            id:"213",               //阶段id
            title:"每天万步走",    //阶段标题
            duration: 30			//时长 （天）
        },
        {
            id:"145",               //阶段id
            title:"三餐健康吃",    //阶段标题
            duration: 30			//时长 （天）
        }
    ]
};

var userInfoList={
    status :"true",
    total : 123,   		 //全部人數
    tobegin: 30,         //待開始人數
    onGoing: 30,         //進行中人數
    complete: 5,         //已完成人數
    pause: 3,            //暫停人數
    currentPage : 3,	 //当前页数
    pageSize: 10,		 //一页显示多少条
    pageCount : 13, 	//总页数
    datalist:[
        {
            id:"32434",  //用戶id
            name:"用戶姓名",  //用戶姓名
            sex: "0",     //用戶性別（"0":女，"1":男）
            age:"32",     //年齡
            state:"1",     //執行狀態（"0"：待開始,"1"：進行中,"2"：已完成,"3"：暫停中）
            abnormal: 5,   //未達標數據項數目
            standard_rate: "0.56", //達標率
            process_rate:"0.67",  //進度
            execute_rate:"0.70",  //執行率
        },
        {
            id:"32434",  //用戶id
            name:"用戶姓名",  //用戶姓名
            sex: "0",     //用戶性別（"0":女，"1":男）
            age:"32",     //年齡
            state:"1",     //執行狀態（"0"：待開始,"1"：進行中,"2"：已完成,"3"：暫停中）
            abnormal: 5,   //未達標數據項數目
            standard_rate: "0.56", //達標率
            process_rate:"0.67",  //進度
            execute_rate:"0.70",  //執行率
        }
    ]
};

var userChart={
    status :"true",
    standard_rate:[        //返回计划创建时报表设定的各项目达标率，没有达标项目返回空数组
        {
            item:"收缩压",    //量测项目名称
            unit:"mmHg",      //量测单位
            data:[78.1,88.8,90.1,78.1,88.8,90.1,78.1,88.8,90.1]  //达标率（按执行顺序返回天/阶段的达标率）
        },
        {
            item:"舒张压",    //量测项目名称
            unit:"mmHg",      //量测单位
            data:[78.1,88.8,90.1,78.1,88.8,90.1,78.1,88.8,90.1]  //达标率（按执行顺序返回天/阶段的达标率）
        },
        {
            item:"心率",    //量测项目名称
            unit:"次/分",      //量测单位
            data:[78.1,88.8,90.1,78.1,88.8,90.1,78.1,88.8,90.1]  //达标率（按执行顺序返回天/阶段的达标率）
        }
    ],
    process_rate:[30,15,0],   //完成度（按执行顺序返回各阶段完成天数）
    execute_rate:[75.5,85.2,66.9]    //执行率（按执行顺序返回天/阶段的达标率）
};