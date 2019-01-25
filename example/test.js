/**
 * 主框架公共js
 */
define(['autoIframe'],function(){
    'use strict';
    window.MainFrame = {
        menuList : [],
        $frame : $('#mainFrame'),
        baseUrl : location.protocol + '//' + location.hostname + (location.port?':' + location.port:''),
        /**
         *获取当前菜单id,name,主要是暴露给责任田调用
         */
        getCurMenu:function(){
            var $curLink = $('.active > a[data-url]');
            return {id:$curLink.data('menuId'),name:$curLink.html()};
        },
        /**
         *重置菜单,当菜单过多的时候自动出现"更多"选项
         */
        resetMenu:function(mWidth,$menu){
            var $more = $menu.children('.more'),
                moreWidth = $more.width(),
                $moreUL = $more.children('ul'),
                $moreLI,
                $liList = $menu.children('li:visible');

            $liList.each(function(){
                var $this = $(this),liWidth = $this.data('width')||$this.width();
                mWidth -= (liWidth + 10);
                $this.data('width',liWidth);
                //剩余宽度不足以放下该菜单
                if(mWidth<0){
                    //当前菜单是"更多"的话,需要将前一菜单放到"更多"中
                    if($this.is('.more')){
                        $moreUL.prepend($this.prev());
                        return false;
                    }
                    $moreUL.append($this);
                }
            });

            $moreLI = $('>li',$moreUL);
            if(mWidth>0&&$moreLI.length>0){
                $moreLI.each(function(index){
                    var $this = $(this);
                    mWidth -= ($this.data('width')||$this.width());
                    //如果more菜单下只剩余一个菜单,则尝试将该菜单提出来,再计算可不可以放得下
                    if($moreUL.children('li').length==1){
                        mWidth += moreWidth;
                    }
                    //剩余宽度足以放下当前菜单
                    if(mWidth>0){
                        //如果当前菜单是3级菜单,将3级菜单升级为2级菜单,只有下拉菜单时才会存在3级菜单的情况
                        if($this.hasClass('dropdown-submenu'))$this.removeClass('dropdown-submenu').addClass('dropdown');
                        $more.before($this);
                    }
                });
            }

            //当前菜单是否在"更多"中,如果在,激活"更多"菜单
            if($moreUL.children('li').length==0){
                $more.hide();
                return;
            }
            //当前菜单在更多菜单下,则激活更多菜单选中效果,否则移除效果
            if($moreUL.children('li.active').length==0){
                $more.removeClass('active');
            }else{
                $more.addClass('active');
            }
            //如果当前菜单是2级菜单,将2级菜单降级为3级菜单,只有下拉菜单时才会存在3级菜单的情况
            $more.find('.dropdown').removeClass('dropdown').addClass('dropdown-submenu');
            $more.show();
        },
        /**
         *当前激活菜单本地缓存,当f5刷新时需要通过该方法获取当前的菜单id
         */
        setCurMenuId:function(menuId,url){
            var hashMenuInfo = this.getHashMenuInfo();
            var param = this.getParam(window.location.href);
            if(hashMenuInfo){
                menuId = menuId||hashMenuInfo.menuId;
                url = url||hashMenuInfo.url||'';
            }
            menuId = menuId||'';
            url = url||'';
            //if(param.menuId && param.url)
            //	window.location.href = '?appCode=' + param.appCode +'#menuId=' + param.menuId + '&url=' + decodeURIComponent(param.url);
            window.location.hash = 'menuId=' + menuId + '&url=' + url;
        },
        replaceVersion:function(url){
            if(!url){
                return "";
            }
            var result = url;
            var index = url.indexOf("tSession=");
            if(index>-1){
                result = url.substring(0,index-1);
            }
            return result;
        },
        /**
         *匹配url中配置的openType新建页面弹出菜单
         */
        setCurOpen:function(url){
            if(url){
                var exp = /(openType=(\w+))/i;
                var hash = url.match(exp);
                if(hash){
                    var openType = hash[2];
                }

                switch(openType){
                    case '1':
                        if(this.open == 'start'){
                            var menuId = MainFrame.getCurMenuId(url);
                            var a = window.location.href;
                            var splt = a.split('#');
                            var URL = splt[0] + '#menuId=' + menuId + '&url=' + url;
                            window.open(URL);
                            this.open = 'end';
                        }
                        break;

                    case '2':
                        if(this.open == 'start'){
                            var URL;
                            if(window.location.origin){
                                URL = window.location.origin + url ;
                            }
                            else{
                                URL = url ;
                            }
                            window.open(URL);
                            this.open = 'end';
                        }
                        break;

                    case '3':
                        if(this.open == 'start'){
                            window.location.href = url;
                            //window.location.reload();
                            this.open = 'end';
                        }
                        break;

                    default:;
                };
            }
        },
        //是否打开页面
        setCurOpenType:function(openType){
            this.open = openType;
        },
        /**
         * 根据url获取与该url匹配的菜单id,
         * 匹配规则为:完全相等的>相似的,相似的长度越长,匹配度越高
         * @param {Object} url 需要匹配的url
         */
        getCurMenuId:function(url){
            if(!url){
                return '';
            }
            var curUrl = url,
                hashMenu = this.getHashMenuInfo(),
                hashMenuId = hashMenu?hashMenu.menuId:'',
                hashUrl = hashMenuId?$('#' + hashMenuId).data('url'):'',
                hashUrl = Workbench.formatUrl(hashUrl),
                menuList = this.menuList,i,j,
                menu,secondMenu,menuUrl;
            try{
                //子系统如果为gbk编码,解码会报错
                curUrl = decodeURIComponent(url);
            }catch(e){}
            curUrl = this.replaceVersion(curUrl);
            hashUrl = this.replaceVersion(hashUrl);
            if(hashUrl&&curUrl.indexOf(hashUrl)!=-1){
                return hashMenuId;
            }

            for (i = 0; i < menuList.length; i++) {
                menu = menuList[i];
                menuUrl = this.replaceVersion(Workbench.formatUrl(menu.url));
                if(curUrl == menuUrl){
                    return menu.id;
                }
                if (menu.secondMenus && menu.secondMenus.length > 0) {
                    for (j = 0; j < menu.secondMenus.length; j++) {
                        secondMenu = menu.secondMenus[j];
                        menuUrl = this.replaceVersion(Workbench.formatUrl(secondMenu.url));
                        //验证菜单合法性
                        if(!menuUrl||menuUrl.indexOf('/')==-1||menuUrl==webPath){
                            continue;
                        }
                        if(curUrl == menuUrl){
                            return secondMenu.id;
                        }
                    }
                }
            }

            //如果存在匹配,则激活匹配的菜单,否则激活刷新之前的菜单
            return hashMenuId;
        },
        /**
         * iframe加载完后回调,匹配菜单
         * @param {Object} callback 回调函数
         */
        matchMenu:function(callback){
            var _self = this;
            this.$frame.load(function() {
                var url = _self.$frame[0].contentWindow.location.href.replace(MainFrame.baseUrl, ''),
                    menuId = MainFrame.getCurMenuId(url);
                //缓存当前菜单id
                MainFrame.setCurMenuId(menuId,url);
                callback(menuId,url);
            });
        },
        /**
         * 获取url中的参数
         * @param {Object} url url
         */
        getParam:function(url) {
            if (url.indexOf('?') > -1) {
                // 如果url带有?
                var index = url.indexOf('?');
                url = url.substring(index + 1, url.length);
                var reg = /(^|&).+?=.+?(?=&|$)/gi
                var array = url.match(reg);
                var index2 = 0;
                var name = '';
                var value = '';
                var param = {};
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i][0] == '&') {
                        array[i] = array[i].substring(1, array[i].length);
                    }
                    index2 = array[i].indexOf('=');
                    name = array[i].substr(0, index2);
                    value = array[i].substring(index2 + 1, array[i].length);
                    param[name] = value;
                }
                return(param);
            }
        },
        /**
         * 设置iframe自动高度
         * @param {Object} getHeight 返回高度
         */
        autoHeight:function(getHeight){
            this.$frame.autoFrameHeight('', getHeight);
        },
        /**
         * 激活菜单设置效果,主要是f5刷新时不能通过事件去定位与设置效果,所以需要该方法
         * @param {Object} $menu 菜单jQuery对象,对应a链接
         */
        activeMenu:function($menu){
            $menu.parents('li').addClass('active').siblings().removeClass('active').find('li').removeClass('active');
        },
        /**
         *格式化hash中的菜单信息
         */
        getHashMenuInfo:function(){
            var hash = window.location.hash?window.location.hash.replace('#', ''):'',
                exp,result,menuInfo=null;
            if(hash){
                exp = /(menuId=(.+)&)?url=(.*)/i;
                result = hash.match(exp);
                if(result&&result.length>2){
                    menuInfo = {};
                    menuInfo.menuId = result[2];

                    if(result.length>3){
                        menuInfo.url = result[3];
                    }
                    if( menuInfo.url!=null && (menuInfo.menuId ==null || typeof menuInfo.menuId == "undefined")  ){
                        if(menuInfo.menuId ==null || typeof menuInfo.menuId == "undefined"){
                            console.log('111111');
                            //(menuInfo.menuId ==null || typeof menuInfo.menuId == "undefined") &&
                            /**/var _self1 = this;
                            var vMenuList = _self1.menuList;
                            for(var obj in vMenuList){
                                if(menuInfo.url.indexOf(vMenuList[obj].url) > -1){
                                    menuInfo.menuId = vMenuList[obj].id;
                                    break;
                                }
                            }}
                    }
                }
            }else{
                var param = this.getParam(window.location.href);
                if(param.menuId || param.url){
                    menuInfo = {};
                    if(param.menuId)
                        menuInfo.menuId = param.menuId;
                    if(param.url)
                        menuInfo.url = decodeURIComponent(param.url);
                }

            }
            return menuInfo;
        },
        /**
         * 初始化方法
         * @param {Object} menuList菜单json数据
         * @param {Object} $iframeiframe对象
         */
        init:function(options){
            this.menuList = options.menuList||[];
            if(options.$frame){
                this.$frame = options.$frame;
            }
            if(options.activeMenu){
                this.matchMenu(options.activeMenu);
            }
            if(options.getHeight){
                this.autoHeight(options.getHeight);
            }
        }
    };
    window.getCurMenu = MainFrame.getCurMenu;
    return MainFrame;
});