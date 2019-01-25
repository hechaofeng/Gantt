/*
jQuery.ganttView v.0.8.8
Copyright (c) 2010 JC Grubbs - jc.grubbs@devmynd.com
MIT License Applies
*/

(function (jQuery) {

    jQuery.fn.ganttView = function () {

        var args = Array.prototype.slice.call(arguments);

        if (args.length == 1 && typeof(args[0]) == "object") {
            ganttBuild.call(this, args[0]);
        }else if (args.length == 2 && typeof(args[0]) == "string") {
            handleMethod.call(this, args[0], args[1]);
        }else{
            throw "数据格式不正确！"
        };
        setTimeout(function(){
            //左边 滑动
            function leftScroll(){
                var scTop = jQuery(this).scrollTop();
                jQuery('.ganttview-grid-container-wrap').unbind('scroll').scrollTop(scTop);
                jQuery('.ganttview-vtheader-fixed-top').css('top',scTop);
                var top_h =+jQuery('.ganttview-vtheader-fixed-bottom').attr('table-height')+scTop -10 +"px";
                jQuery('.ganttview-vtheader-fixed-bottom').css('top',top_h );
            }
            jQuery('.ganttview-table-container').scroll(leftScroll);

            //右边 滑动
            function rightScroll(){
                var scrolltop =  jQuery(this).scrollTop();
                var scrollLeft = jQuery(this).scrollLeft();
                jQuery('.ganttview-table-container').unbind('scroll').scrollTop(scrolltop);
                jQuery('.ganttview-vtheader-fixed-top').css('top',scrolltop);
                var top_h =+jQuery('.ganttview-vtheader-fixed-bottom').attr('table-height')+scrolltop -10 +"px";
                jQuery('.ganttview-vtheader-fixed-bottom').css('top',top_h);
                jQuery('.ganttview-hzheader').css('left',-scrollLeft);
            }
            jQuery('.ganttview-grid-container-wrap').scroll(rightScroll);

            //左边
            /* jQuery('.ganttview-table-container').mousemove(function(){

             });*/

            jQuery('.ganttview-table-container').mouseleave(function(){
                jQuery('.ganttview-table-container').unbind('scroll',leftScroll);
            });
            jQuery('.ganttview').on('mousemove','.ganttview-table-container',function(){
                jQuery('.ganttview-table-container').scroll(leftScroll);
            });
            //右边
            jQuery('.ganttview-grid-container-wrap').mousemove(function(){
                jQuery('.ganttview-grid-container-wrap').scroll(rightScroll);
            });
            jQuery('.ganttview-grid-container-wrap').mouseleave(function(){
                jQuery('.ganttview-grid-container-wrap').unbind('scroll',rightScroll);
            });
            setTimeout(function(){
                jQuery('.ganttview-table-container').bind('scroll',leftScroll);
                jQuery('.ganttview-grid-container-wrap').bind('scroll',rightScroll);
            },700);
        },10)
    };

    function ganttBuild(options) {

        var els = this;
        var defaults = {
            showWeekends: true,
            fixTop:false,
            bodyHeight:320,
            tilteName:"甘特图",
            titleNameSize:14,
            titleHeight:40,
            blockTitle:"停电时长 ",
            dateModel:true,
            minGap:15*60*1000,//和dateModel 一起使用，最小间隔，如果dateModel为true那么 表示数据的起始值为时间， minGap必须为以“毫秒为单位的值”；dateModel为false表示非时间数据，那么此值即为最小间隔；
            headerData:(function(){
                return [];
            })(),
            headerSumData:[],
            times:1,
            cellWidth: 40,
            blockHeight:20,
            blockBgColor:"#e4c846",
            headerHeight: 34,
            headerSumHeight: 24,
            animate:false,//动画
            ghost:false,//视觉反馈
            gridcellHeight: 32,
            blockTextColor:"#aaa",
            slideWidth:"100%",
            slideMinWidth:300,
            behavior: {
                clickable: false,
                draggable: false,
                resizable: false,
                contextMenuable:false
            },
            leftGridItemsShowWord:[],
            leftGridSeriesShowWord:[],
            gridCss:{},
            ganttviewSlideContainerCss:{},
            onContextmenuText:"我是右键",
            gridItemCss:{},//左边表格Item数据部分的css
            gridSeriesCss:{},//左边表格Series数据部分的css
            ganttTitleCss:{"text-align":"left",'padding-left':"10px"},//右边gantt图的部分 标题的css
            gridTitleNameCss:{},//左边表格的部分 题头的css
            ganttDaysCss:{},//右边gantt图的部分 时间段部分的css
            ganttGridCellsCss:{},//右边gantt图的部分 背景格子部分的css，
            vtheaderText:"我是左边表格的头部文字，现在隐藏了",//左侧 表格的部分 第一列的 值; 默认{}
            gridevtheaderCss:{height:"30px",color:"#fff","text-align":"left",lineHeight:"30px",display:"none"},//左侧 表格的部分 第一列的css
            grideLeftBottomCss:{
                backgroundColor:"#fff",
                fontSize:"12px"
            },
            overText:"数据超出",
            grideRightTopCss:{
                backgroundColor:"#eaeaea",
                fontSize:"12px"
            },
            vtHeaderLBValue:"表格数据",
            vtHeaderRTValue:"甘特图",
            vtheaderText:"",
            disabledColor:"#d0d0d0",
        };
        defaults.times = defaults.headerData.length;
        if(options.headerData && options.headerData.length){
            options.times = options.headerData.length;
            defaults.headerData = [];
        };
        var opts = jQuery.extend(true, defaults, options);

        if (opts.data) {
            startBuild();
        } else if (opts.dataUrl) {
            jQuery.getJSON(opts.dataUrl, function (data) {
                opts.data = data;
                startBuild();
            });
        }else{
            throw "甘特图无数据"
        }

        function startBuild() {

            els.each(function () {
                var container = jQuery(this).css({'position':'relative',"overflow":"hidden"});
                var div = jQuery("<div>", { "class": "ganttview" }).css("padding-right",opts.slideWidth);
                new ganttChart(div, opts).render();
                container.append(div);

                new ganttBehavior(container, opts).apply();
                setTimeout(function(){
                    $('.ganttview-table-container').css({'min-height':$('.ganttview-slide-container').height()});
                    if(opts.fixTop){
                        $('.ganttview-table-container').css({'height':$('.ganttview-slide-container').height(),position:"relative",overflow:"auto"});
                    }
                },60)
            });
        }
    }

    function handleMethod(method, value) {
        if (method == "setSlideWidth") {
            var div = $("div.ganttview", this);
            div.each(function () {
                var vtWidth = $("div.ganttview-vtheader", div).outerWidth();
                $(div).width(vtWidth + value + 1);
                $("div.ganttview-slide-container", this).width(value);
            });
        }
    }
    /*生成表格*/
    var ganttChart = function(div, opts) {

        function render() {
            addVtHeader(div, opts.data, opts.cellHeight,opts);

            var slideDiv = jQuery("<div>", {
                "class": "ganttview-slide-container",
                "css": {
                    "width": opts.slideWidth,
                    "min-width": opts.slideMinWidth
                }
            }).css(opts.ganttviewSlideContainerCss);
            if(opts.fixTop){
                slideDiv.css('overflow','hidden')
            }
            addmyHzHeader(slideDiv, opts);
            var con = addGrid(slideDiv, opts);
            addBlockContainers(slideDiv, opts,con);
            addBlocks(slideDiv, opts,con);
            div.append(slideDiv);
            applyLastClass(div.parent());
        }
        function returnText(text){
            if(	/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/.test(text)){
                console.log("是标签");
                return $(text).text();
            }else{
                return text;
            };
        };
        //左边的表格
        function addVtHeader(div, data, cellHeight,opts) {
            var titleHeight = opts.bodyHeight + opts.headerSumHeight+opts.headerHeight + opts.titleHeight;
            var tableContainer =jQuery("<div>", { "class": "ganttview-table-container" });
            var tableDiv = jQuery("<table>", { "class": "ganttview-vtheader ganttview-vtheader-show" }).css(opts.gridCss);
            var headerDiv = jQuery("<table>", { "class": "ganttview-vtheader ganttview-vtheader-fixed-top" }).css({position: "absolute",zIndex: 99});
            var headerSumHeight =0;
            if(opts.headerSumHeight && opts.headerSumData  && opts.headerSumData.length){
                headerSumHeight = opts.headerSumHeight;
            }
            var vtheader = jQuery("<div>", { "class": "ganttview-vtheader-top" }).css(opts.gridevtheaderCss).append((opts.vtheaderText||""));

            tableDiv.append(vtheader);
            var totalShowWordLength = 0;
            var headerTitle = [];
            var leftHeaderTitle_hidden=  jQuery("<tr>", { "class": "ganttview-left-header-title-hidden" });
            var leftHeaderTitle=  jQuery("<tr>", { "class": "ganttview-left-header-title" });

            headerDiv.append(leftHeaderTitle_hidden);
            tableDiv.append(leftHeaderTitle);
            var totalShowWordLength = (opts.leftGridItemsShowWord.length ||0) +(opts.leftGridSeriesShowWord.length ||0)
            var kk = 0;
            var leftGridTitleTd ="";
            var leftGridTitleTd_hidden ="";
            var tdH =opts.headerSumHeight+opts.headerHeight+opts.titleHeight+"px";
            for(var y1 =0;y1<opts.leftGridItemsShowWord.length; y1++){
                var width = 100/totalShowWordLength;
                kk++;
                if(opts.leftGridItemsShowWord[y1] && opts.leftGridItemsShowWord[y1]['width']){
                    width = opts.leftGridItemsShowWord[y1]['width'];
                };
                var h = tdH;
                if(opts.fixTop){
                    h = 0
                };
                leftGridTitleTd+= "<td class='ganttview-left-header-title-div' col-num-item='"+kk+"' style='height:"+h+";line-height: "+h+"px;width:"+(width)+"'>"+opts.leftGridItemsShowWord[y1]['text']+"</td>";
                leftGridTitleTd_hidden+= "<td class='ganttview-left-header-title-div' col-num-item='"+kk+"' style='height:"+tdH+";line-height: "+tdH+";width:"+(width)+"'>"+opts.leftGridItemsShowWord[y1]['text']+"</td>";

            };
            for(var y2 =0;y2<opts.leftGridSeriesShowWord.length; y2++){
                var width = 100/totalShowWordLength;
                kk++;
                if(opts.leftGridSeriesShowWord[y1] && opts.leftGridSeriesShowWord[y1]['width']){
                    width = opts.leftGridSeriesShowWord[y1]['width'];
                };
                var h = tdH;
                if(opts.fixTop){
                    h = 0
                };
                leftGridTitleTd +="<td class='ganttview-left-header-title-div' col-num-item='"+kk+"' style='height:"+h+";line-height: "+h+"px;width:"+(width)+"'>"+opts.leftGridSeriesShowWord[y2]['text']+"</td>"
                leftGridTitleTd_hidden +="<td class='ganttview-left-header-title-div' col-num-item='"+kk+"' style='height:"+tdH+";line-height: "+tdH+";width:"+(width)+"'>"+opts.leftGridSeriesShowWord[y2]['text']+"</td>"

            };
            leftHeaderTitle_hidden.append(leftGridTitleTd_hidden);
            leftHeaderTitle.append(leftGridTitleTd);

            for (var i = 0; i < data.length; i++) {
                var itemDiv = jQuery("<tr>", { "class": "ganttview-vtheader-item" }).attr({'title':data[i].title,id:data[i].id});
                if(i==0){
                    itemDiv.addClass('ganttview-vtheader-item-first')
                };

                var flag = 0;//列数；
                for(var h=0;h<opts.leftGridItemsShowWord.length;h++){
                    flag ++;
                    var showText = opts.leftGridItemsShowWord[h]['showWord'];
                    var width = opts.leftGridItemsShowWord[h]['width'] ||"";
                    //遍历每一条数据需要显示的字段(非series部分)
                    var addclass='';
                    if(flag==1){
                        addclass = "ganttview-vtheader-item-name-first";
                    }
                    var v = data[i][showText] ||" ";
                    var height = data[i].series.length*opts.gridcellHeight -1;
                    itemDiv.append(jQuery("<td>", {"class": "ganttview-vtheader-item-name "+addclass}).append(v).css({'line-height':height+"px",height:height+"px","width":(100/totalShowWordLength)+"%"}).attr({'title':returnText(v),'col-num-item':flag}));
                };
                for(var m=0;m<opts.leftGridSeriesShowWord.length;m++){
                    //遍历series需要显示的字段
                    flag ++;
                    var showText = opts.leftGridSeriesShowWord[m]['showWord'];
                    var width = opts.leftGridSeriesShowWord[m]['width'] ||"";
                    var seriesDiv = jQuery("<td>", { "class": "ganttview-vtheader-series" }).attr('col-num-series',flag).css('width',(100/totalShowWordLength)+"%");
                    for (var j = 0; j < data[i].series.length; j++) {
                        var series_name_value = data[i].series[j][showText] ||"";
                        var series_name = jQuery("<div>", { "class": "ganttview-vtheader-series-name" }).css({"height":(opts.gridcellHeight)+ "px","line-height":opts.gridcellHeight+ "px"}).append(series_name_value).attr({'title':returnText(series_name_value)});
                        seriesDiv.append(series_name);
                    }
                    itemDiv.append(seriesDiv);
                    tableDiv.append(itemDiv);
                }


            };
            if(opts.fixTop){
                //如果是 固定头部
                tableContainer.append(headerDiv);

                tableDiv.css({'marginTop':opts.headerSumHeight+opts.headerHeight+opts.titleHeight})
            };

            tableContainer.append(tableDiv);
            div.append(tableContainer);
            setTimeout(function(){
                if(opts.gridSeriesCss){
                    $('.ganttview-vtheader-series-name').css(opts.gridSeriesCss);
                };
                if(opts.gridItemCss){
                    $('.ganttview-vtheader-item-name ').css(opts.gridItemCss);
                };
                if(opts.gridTitleNameCss){
                    $('.ganttview-left-header-title-div').css((opts.gridTitleNameCss ||{}))
                }
            },20);
        }

        //甘特图的上面 月份和日期的部分
        function addmyHzHeader(div, opts) {
            //dates, cellWidth,headerHeight,tilteName
            var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
            if(opts.fixTop){
                headerDiv.css({position:"absolute"})
            }
            var titleDiv = jQuery("<div>", { "class": "ganttview-hzheader-title" }).html(opts.tilteName).css({'height':opts.titleHeight+'px',lineHeight:opts.titleHeight+'px',"font-size":opts.titleNameSize+'px'});
            var quartersDiv = jQuery("<div>", { "class": "ganttview-hzheader-quarters" });
            var times =opts.times;

            for(var i =0;i<opts.headerData.length;i++) {
                quartersDiv.append(jQuery("<div>", {class: "ganttview-hzheader-day"}).css({width:opts.cellWidth+"px",height:opts.headerHeight+"px",lineHeight:opts.headerHeight+"px"}).html(opts.headerData[i]));
            }
            titleDiv.css("width", times*(opts.cellWidth) + "px");
            quartersDiv.css("width", times*(opts.cellWidth) + "px");
            if(opts.titleHeight){
                headerDiv.append(titleDiv);
            };
            if(opts.headerSumData && opts.headerSumData.length){
                var hoursDiv = jQuery("<div>", { "class": "ganttview-hzheader-hours" });
                for(var i =0;i<opts.headerSumData.length;i++) {
                    hoursDiv.append(jQuery("<div>", {class: "ganttview-hzheader-hour"}).css({width:times*(opts.cellWidth)/opts.headerSumData.length+"px",height:"100%",lineHeight:opts.headerSumHeight+"px"}).html(opts.headerSumData[i]));
                };
                hoursDiv.css({"width":times*(opts.cellWidth) + "px",height:opts.headerSumHeight});
                headerDiv.append(hoursDiv)
            };
            headerDiv.append(quartersDiv);
            div.append(headerDiv);
            setTimeout(function(){
                if(opts.ganttTitleCss){
                    $('.ganttview-hzheader-title').css(opts.ganttTitleCss);
                };
                if(opts.ganttDaysCss){
                    $('.ganttview-hzheader-day ').css(opts.ganttDaysCss);
                }
            },20);
        }

        //甘特图 功能的部分（背景的格子）
        function addGrid(div,opts) {
            var opts=opts ||{data:[]}
            //function addGrid(div, data, dates, cellWidth, showWeekends) {
            var gridDiv = jQuery("<div>", { "class": "ganttview-grid" });
            var rowDiv = jQuery("<div>", { "class": "ganttview-grid-row" });
            var abc = jQuery("<div>", { "class": "ganttview-grid-container-wrap" });
            var titleH = opts.headerSumHeight+opts.headerHeight+opts.titleHeight;

            var gridDivContainer = jQuery("<div>", { "class": "ganttview-grid-container" }).css({'overflow':'auto',marginTop:"-1px"});

            if(opts.fixTop){
                gridDivContainer.css({})
            }

            for (var i=1;i<= opts.times;i++) {
                var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell" }).css({'height':opts.gridcellHeight+"px",width:opts.cellWidth+"px"});
                /*if ((i % 6)==0 && opts.showWeekends) {//周末
                    cellDiv.addClass("ganttview-weekend");
                }*/
                rowDiv.append(cellDiv);
            }
            var w = opts.times * opts.cellWidth;
            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");
            gridDivContainer.css("width", w + "px");
            for (var i = 0; i < opts.data.length; i++) {
                for (var j = 0; j < opts.data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone());
                }
            };

            gridDivContainer.append(gridDiv);
            if(opts.fixTop){
                abc.append(gridDivContainer);
                abc.css({"margin-top":titleH,height:opts.bodyHeight,overflow:'auto'});
                div.append(abc);
            }else{
                div.append(gridDivContainer);
            };

            setTimeout(function(){
                if(opts.ganttGridCellsCss){
                    $('.ganttview-grid-row-cell').css(opts.ganttGridCellsCss);
                }
            },20);
            return gridDivContainer;
        }
        //甘特图 功能的部分（滑块的容器）
        function addBlockContainers(div, opts,con) {
            var  data= opts.data;
            var w = opts.times * opts.cellWidth;
            var blocksDiv = jQuery("<div>", { "class": "ganttview-blocks" }).css("width", w + "px");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    blocksDiv.append(jQuery("<div>", { "class": "ganttview-block-container" }).css('height',opts.gridcellHeight+"px"));
                }
            }
            con.append(blocksDiv);
            //div.append(con);
        }
        //甘特图 功能的部分（滑块）
        function addBlocks(div,opts) {
            //data, cellWidth, start
            var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
            var rowIdx = 0;
            var min_offsetQuarters=opts.headerData.length;
            for (var i = 0; i < opts.data.length; i++) {
                for (var j = 0; j < opts.data[i].series.length; j++) {
                    var series = opts.data[i].series[j];
                    var s ,e,size,offsetQuarters,blockTitle,isOverTime=false;
                    if(opts.dateModel){
                        //起止数据为时间
                        if(series.start<1000 ||series.end <1000){
                            throw "请确定起止数据是否为时间!";
                        }
                        s = new Date(series.start);
                        e = new Date(series.end);
                        if(s.getTime() > new Date().getTime()){
                            //throw "起始时间数据过大:"+JSON.stringify(series);
                        }
                        if(e.getTime() < 0){
                            throw "结束时间数据过小:"+JSON.stringify(series);
                        }
                        if(s.getTime() > e.getTime()){
                            throw "起始时间大于结束时间："+JSON.stringify(series);
                        }

                        var end_offsetQuarters = ganttDateUtils.quartersBetween(zeroTimeOfThisDay(s), e ,opts) ;
                        offsetQuarters = ganttDateUtils.quartersBetween(zeroTimeOfThisDay(s),s,opts);

                        if(offsetQuarters<min_offsetQuarters){
                            min_offsetQuarters = offsetQuarters;
                        }
                        size = end_offsetQuarters-offsetQuarters;
                        blockTitle = (series.name||"") + " "+series.start.toTimeString().split(' ')[0]+" 至 "+series.end.toTimeString().split(' ')[0] +"，"+opts.blockTitle+" "+ parseInt(size/4) + "小时"+(size%4)/4*60+"分钟";

                    }else{
                        //起止数据为非时间
                        s = series.start;
                        e = series.end;
                        if(opts.minGap > 0){
                            //递增
                            if(s>e){
                                throw "开始数据大于结束的数据:"+JSON.stringify(series)
                            };
                            if(s < opts.headerData[0] || e >opts.headerData[opts.headerData.length-1]){
                                throw "开始数据或者结束的数据不在允许范围内:"+JSON.stringify(series)
                            }
                        }else if(opts.minGap <0){
                            //递减
                            if(s < e){
                                throw "开始数据小于结束的数据:"+JSON.stringify(series)
                            };
                            if(s > opts.headerData[0] || e <opts.headerData[opts.headerData.length-1]){
                                throw "开始数据或者结束的数据不在允许范围内:"+JSON.stringify(series)
                            }
                        }else{
                            throw "minGap不能设置为0！"
                        }
                        size = (e-s)/opts.minGap;
                        offsetQuarters = (s-opts.headerData[0])/opts.minGap;
                        if(offsetQuarters<min_offsetQuarters){
                            min_offsetQuarters = offsetQuarters;
                        }
                        //block.attr('name')+" 从 "+block.data("block-data").start+" 至 "+block.data("block-data").end +"，总计" + numberOfQuarters;
                        blockTitle = series.name + ", 从 "+series.start+" 至 "+series.end+ "，总计"+Math.abs(e - s);
                    };

                    if(opts.blockHeight > opts.gridcellHeight-4){
                        opts.blockHeight = opts.gridcellHeight-4;
                    };

                    var block = jQuery("<div>", {
                        "class": "ganttview-block",
                        "name":series.name,
                        "title": blockTitle,
                        "css": {
                            "width": ((size *opts.cellWidth) - 6 -2)>0? ((size *opts.cellWidth) - 6 -2): (opts.cellWidth-8) + "px",
                            "background-color":opts.blockBgColor,
                            color:opts.blockTextColor,
                            "margin-left": ((offsetQuarters * opts.cellWidth) + 2) + "px",
                            height:opts.blockHeight+"px",
                            marginTop:(opts.gridcellHeight-opts.blockHeight-2)/2+"px"
                        }
                    }).unbind("mousedown").bind("contextmenu", function (e) {
                        if(!opts.behavior.contextMenuable){
                            return false;
                        };
                        //给滑块绑定右键事件
                        $("#blockRightMenu").remove();
                        $(this).attr('isRightMenuCLick','1');
                        $('body').append('<span id="blockRightMenu" style="padding:2px 10px;display:inline-block;border:1px solid #333;min-width: 60px;background-color: #ea6a6a;color:#fff;cursor:pointer;border-radius: 2px;position: absolute;top:'+(e.pageY+6)+'px; left:'+(e.pageX+10)+'px;z-index: 1001;">'+opts.onContextmenuText+'</span>')
                        if(opts.contextmenuCss){
                            setTimeout(function(){
                                $('#blockRightMenu').css(opts.contextmenuCss);
                            },0);
                        }
                        e.preventDefault();
                        return false;
                    });
                    if(series.contextMenuable=="false" ||series.contextMenuable ==false){
                        block.unbind("contextmenu");
                    }
                    if(size==0){
                        size = "无"
                    }


                    if(series.clickable==false){
                        block.attr('my-clickable',false);
                        block.css("background-color", opts.disabledColor);
                    };

                    if(series.draggable==false){
                        block.attr('my-draggable',false);
                        block.css("background-color", opts.disabledColor);
                    };
                    if(series.resizable==false){
                        block.attr('my-resizable',false);
                        block.css("background-color", opts.disabledColor);
                    };
                    if (series.BgColor) {
                        //控制滑块的背景色
                        block.css("background-color", series.BgColor);
                    };
                    if (series.color) {
                        //控制滑块的字体色
                        block.css("color", series.color);
                    };

                    if(opts.setBlockText){
                        var block_text = opts.setBlockText(size) || "";
                        block.append(jQuery("<div>", { "class": "ganttview-block-text" }).html(block_text).attr('title',block_text));
                    }else{
                        block.append(jQuery("<div>", { "class": "ganttview-block-text" }).html(size).attr('title',size));
                    };
                    if(end_offsetQuarters > opts.headerData.length){
                        block.append("<span class='overflow-text' style='float:right;color:"+opts.blockTextColor+";font-size: 12px;' title='"+opts.overText+"'>"+opts.overText+" <span style='font-size: 14px;'>→ </span> <span>");
                    }
                    jQuery(rows[rowIdx]).append(block);
                    addBlockData(block, opts.data[i], series);
                    if(opts.blockTitleCallback){
                        blockTitle = opts.blockTitleCallback(block.data("block-data"))||blockTitle;
                        block.attr('title',blockTitle);
                    }
                    rowIdx = rowIdx + 1;
                }
            };
            if(min_offsetQuarters){
                //起始显示位置
                setTimeout(function(){
                    $('.ganttview-grid-container-wrap').animate({
                        scrollLeft:min_offsetQuarters*opts.cellWidth -1
                    })
                },300);
            }
            $(window).click(function(e){
                var e = e || window.event;
                var tar =e.target;
                if($(tar).attr('id')=="blockRightMenu" ){
                    if(opts.behavior.onContextmenu){
                        var data = $('.ganttview-block[isRightMenuCLick=1]').data("block-data");
                        data.method ="onContextmenuClick";
                        opts.behavior.onContextmenu(data,$('.ganttview-block[isRightMenuCLick=1]'));
                        $('.ganttview-block[isRightMenuCLick=1]').removeAttr('isRightMenuCLick');
                    };
                };
                $("#blockRightMenu").remove();
                e.preventDefault();
                return false;
            });
        }
        function zeroTimeOfThisDay(d){
            var myDate = d.clone();
            myDate.setHours(0);
            myDate.setMinutes(0);
            myDate.setSeconds(0);
            myDate.setMilliseconds(0);
            return myDate;
        }
        function addBlockData(block, data, series) {
            // This allows custom attributes to be added to the series data objects
            // and makes them available to the 'data' argument of click, resize, and drag handlers
            var blockData = { id: data.id, name: data.name };
            jQuery.extend(blockData, series);
            block.data("block-data", blockData);
            block.data("block-data").blockName  = block.data("block-data").blockName  || block.attr('name');
            block.data("block-data").blockQuarters = block.data("block-data").blockQuarters || block.find('.ganttview-block-text').html();
            block.data("block-data").blockTime  = block.data("block-data").blockTime  ||(block.attr('title')?block.attr('title').split("停电时长 ")[1]:"");
            block.data("block-data").blockTitle = block.data("block-data").blockTitle || block.attr('title');
        }

        function applyLastClass(div) {
            jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
        }

        return {
            render: render
        };
    }
    /*点击，拖拽，伸缩的事件*/
    var ganttBehavior = function (div, opts) {

        function apply() {

            if (opts.behavior.clickable) {
                bindBlockClick(div, opts.behavior.onClick,opts);
            }

            if (opts.behavior.resizable) {
                bindBlockResize(div, opts.cellWidth, opts.behavior.onResize,opts);
            }

            if (opts.behavior.draggable) {
                bindBlockDrag(div, opts.cellWidth, opts.behavior.onDrag,opts);
            }
        }

        function bindBlockClick(div, callback,opts) {
            jQuery("div.ganttview-block", div).on("click", function () {
                var data = jQuery(this).data("block-data");
                data.method="click";
                if (callback && $(this).attr('my-clickable')!="false") {
                    callback(data,jQuery(this));
                }else if( $(this).attr('my-clickable')=="false"){
                    /*   data.clickable=false;
                       callback(data);*/
                }
            });
        }

        function bindBlockResize(div, cellWidth, callback,opts) {
            //jQuery de _mouseStart方法
            jQuery("div.ganttview-block[my-resizable!=false]", div).resizable({
                grid: cellWidth,
                handles: "e,w",
                ghost:opts.ghost,
                maxWidth: cellWidth*(opts.times)*2,
                minWidth: 0,
                animate: opts.animate,
                stop: function () {
                    var block = jQuery(this);
                    updateDataAndPosition(div, block, cellWidth,opts);
                    var data = jQuery(this).data("block-data");
                    data.method="resize";
                    if (callback) { callback(data,block); }
                }
            });
        }

        function bindBlockDrag(div, cellWidth, callback,opts) {
            jQuery("div.ganttview-block[my-draggable!=false]", div).draggable({
                axis: "x",
                grid: [cellWidth, cellWidth],
                animate: opts.animate,
                ghost:opts.ghost,
                stop: function () {
                    var block = jQuery(this);
                    updateDataAndPosition(div, block, cellWidth,opts);
                    var data = jQuery(this).data("block-data");
                    data.method="drag";
                    if (callback) { callback(data,block); }
                }
            });
        }
        function zeroTimeOfThisDay(d){
            var myDate = d.clone();
            myDate.setHours(0);
            myDate.setMinutes(0);
            myDate.setSeconds(0);
            myDate.setMilliseconds(0);
            return myDate;
        }
        function updateDataAndPosition(div, block, cellWidth,opts) {
            var container = jQuery("div.ganttview-grid-container-wrap", div);

            var scroll = container.scrollLeft();
            var offset = block.offset().left - container.offset().left - 1 + scroll;
            if(offset<=0){
                offset = 0;
                block.css("margin-left",0).css('left',0);
            };

            if(opts.dateModel){
                //时间模式
                // Set new start date
                var quartersFromStart = Math.round(offset / cellWidth);
                var newStart = zeroTimeOfThisDay(block.data("block-data").start);
                block.data("block-data").start = new Date(newStart.getTime()+quartersFromStart*opts.minGap);

                // Set new end date
                var width = block.outerWidth();
                var numberOfQuarters = Math.round(width / cellWidth);
                block.data("block-data").end = new Date(newStart.getTime()+(numberOfQuarters+quartersFromStart)*opts.minGap);

                if(opts.setBlockText){
                    var callbackText = opts.setBlockText(numberOfQuarters);
                    jQuery("div.ganttview-block-text", block).text(callbackText);
                }else{
                    jQuery("div.ganttview-block-text", block).text(numberOfQuarters);
                }
                //设置 title
                var title = (block.attr('name')||"")+" "+block.data("block-data").start.toTimeString().split(' ')[0]+" 至 "+block.data("block-data").end.toTimeString().split(' ')[0] +"，停电时长 "+Math.floor(numberOfQuarters*opts.minGap/(60*60*1000))+"小时"+numberOfQuarters*opts.minGap/(1*60*1000)%60+"分钟";
                if(opts.blockTitleCallback){
                    title = opts.blockTitleCallback(block.data("block-data"))||title;
                }
                block.attr('title',title);
                block.data("block-data").blockName=block.attr('name')||"";
                block.data("block-data").blockTitle=title;
                block.data("block-data").blockQuarters=numberOfQuarters;
                block.data("block-data").blockTime=Math.floor(numberOfQuarters*opts.minGap/(60*60*1000))+"小时"+numberOfQuarters*opts.minGap/(1*60*1000)%60+"分钟";
                // Remove top and left properties to avoid incorrect block positioning,
                // set position to relative to keep blocks relative to scrollbar when scrolling

            }else{//非时间模式
                // Set new start date
                var quartersFromStart = Math.round(offset / cellWidth);
                block.data("block-data").start = opts.headerData[0]+quartersFromStart*opts.minGap;

                // Set new end date
                var width = block.outerWidth();
                var numberOfQuarters = Math.round(width / cellWidth);
                block.data("block-data").end = opts.headerData[0]+(numberOfQuarters+quartersFromStart)*opts.minGap;
                if(opts.setBlockText){
                    var callbackText = opts.setBlockText(numberOfQuarters);
                    jQuery("div.ganttview-block-text", block).text(callbackText);
                }else{
                    jQuery("div.ganttview-block-text", block).text(numberOfQuarters);
                }
                //设置 title
                var title = (block.attr('name')||"")+" 从 "+block.data("block-data").start+" 至 "+block.data("block-data").end +"，总计" + numberOfQuarters;
                block.attr('title',title);
                block.data("block-data").blockName=block.attr('name') || "";
                block.data("block-data").blockTitle=title;
                block.data("block-data").blockQuarters=numberOfQuarters;

            }
            if(+block.css('width').replace('px','')+offset > opts.cellWidth*(opts.times) - 6){
                //右边超出
                if(!$(block).find('.overflow-text').length){
                    block.css('width',opts.cellWidth*(opts.times) - 6 -offset).append("<span class='overflow-text' style='float:right;color:"+opts.blockTextColor+";font-size: 12px;'>"+opts.overText+" <span style='font-size: 14px;'>→ </span> <span>");
                };
                block.css('width',opts.cellWidth*(opts.times) - 6 -offset);
            }else{
                $(block).find('.overflow-text').remove()
            };
            //修改了 6-26
            block.css("top", "").css("left", "")
                .css("position", "relative").css("margin-left", offset + "px");

        }

        return {
            apply: apply
        };
    }
//* 数据 数组的解析 ArrayUtils*/
    //* 数据 时间的解析 类ganttDateUtils*/
    var ganttDateUtils = {
        endTimeOfThisDay:function (d){
            var myDate = d.clone();
            myDate.setHours(23);
            myDate.setMinutes(59);
            myDate.setSeconds(59);
            myDate.setMilliseconds(999);
            return new Date(myDate.getTime());
        },
        quartersBetween: function (start, end,opts) {
            if (!start || !end) { throw "quartersBetween(start, end) 缺少起止时间!"; }
            start = new Date(start);
            end = new Date(end);
            /*if(end.getTime() > this.endTimeOfThisDay(start).getTime()){
                end =this.endTimeOfThisDay(start);
			};*/
            if (start.getFullYear() <= 1901 ) { throw "数据的时间数据不正确！"; }
            if(opts.minGap>0){
                return Math.floor((end.getTime()-start.getTime())/opts.minGap);
            }else{
                throw "opts.minGap设置有问题！"
            }

        }
    };

})(jQuery);