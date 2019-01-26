//@author hechaofeng/602527818@qq.com
var ganttDateData = [
    {
        id: 1,
        date: "<a onclick='alert()' href='index.html' target='_blank'>星期二</a>",
        name:"第一条数据",
        title:'第一条数据的title',
        value:123,
        series: [
            {  start: new Date(2018,01,01,18,30,01), end: new Date(2018,01,02,08,30,02) ,value:'13亿',dd:"哈哈哈",clickable:false,contextMenuable:false},
            { name: "America", start: new Date(2018,01,02,02,30), end: new Date(2018,01,03,05,45,01),value:'3亿' ,clickable:false,draggable:false,resizable:false}
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    }
];
var ganttDateData2 = [
	{
		id: 1,
        date: "<a onclick='alert()' href='index.html' target='_blank'>星期二</a>",
		name:"第一条数据",
		title:'第一条数据的title',
		value:123,
		series: [
			{  start: new Date(2018,01,01,01,30,01), end: new Date(2018,01,01,06,45,02) ,value:'13亿',dd:"哈哈哈",clickable:false,contextMenuable:false},
			{ name: "America", start: new Date(2018,01,02,02,30), end: new Date(2018,01,03,05,45,01),value:'3亿' ,clickable:false,draggable:false,resizable:false}
		]
	}, 
	{
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
	},
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start: new Date(2018,01,01,05,20,01), end: new Date(2018,01,06,00,45) ,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start: new Date(2018,00,02,02,40), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#111",color:"#fff" },
            { name: "Taiwang2", start: new Date(2018,00,02,02,50), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "#9999",color:"#111" },
            { name: "Taiwang3", start: new Date(2018,00,02,02,30), end: new Date(2018,00,02,03,60),value:'3千万',BgColor: "blue",color:"#fff" },
        ]
    }
];
var ganttNumData = [
    {
        id: 1,
        date: "星期二",
        name:"第一条数据",
        title:'第一条数据的title',
        value:123,
        series: [
            { name: "China", start:1, end: 1,value:'13亿',dd:"哈哈哈"},
            { name: "America", start:2, end: 4,value:'3亿',BgColor: "#111" }
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start:2, end: 4,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start:6, end: 7,value:'3千万',color: "#111" }
        ]
    }
];
var ganttDeNumData = [
    {
        id: 1,
        date: "星期二",
        name:"第一条数据",
        title:'第一条数据的title',
        value:123,
        series: [
            { name: "China", start:12, end: 1,value:'13亿',dd:"哈哈哈"},
            { name: "America", start:4, end: 2,value:'3亿',color: "#111" }
        ]
    },
    {
        id: 2,
        date: "星期三",
        name:"第2条数据",
        title:'第2条数据的title',
        value:123,
        series: [
            { name: "Japan", start:12, end: 4,value:'2亿',dd:"哈哈哈"},
            { name: "Taiwang", start:16, end: 7,value:'3千万',color: "#111" }
        ]
    }
];



