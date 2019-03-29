$(function(){
//总开始符号	

//----------------------------加载文本页----------------------------

//获取url中的domain参数
function getUrlParam(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");   
	var r = window.location.search.substr(1).match(reg);   
	if (r != null) return decodeURI(r[2]); return null;   
}

var platformiframeurl = getUrlParam('callParentIframeUrl');
var platformiframeurlstr,platformiframeurlstrtext = '';
var backtohtml;

if(platformiframeurl){
	platformiframeurlstr = "callParentIframeUrl="+platformiframeurl;
	platformiframeurlstrtext = "callParentIframeUrl="+platformiframeurl+'&';
	backtohtml ='<a href="index.html?'+ platformiframeurlstr +'" class="backlist">&lt; 返回目录</a>';
	
	var backtodiv = $(".backto");
	
	if(backtodiv.length){
		getbacktodiv();
	}

	function getbacktodiv(){
		$(".backto").html(backtohtml);	
	}
	
}

var StrPath = location.href;
var StrHttp = StrPath.indexOf("http");  //网络环境
var localfile = window.location.href.substr(0, 7) == 'file://';  //本地环境

$(document).attr("title",CourseName);
$(".coursename").html(CourseName);
$(".videobox").html("视频加载中，请稍后...")

/*兼容ipad iframe不滚动*/
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	$(".videobox").addClass("ios");
};



//----------------------------数据加载----------------------------

//加载栏目
var learnbtn = "学习";
var courselist = $(".courselist");
$.each(arrMenuName,function(i){
	
	var learnvideo_pc = '<a href="javascript:void(0);" class="hidden-xs learnvideo_pc">'+learnbtn+'</a>';
	var learnvideo_mobile = '<a href="#coursenamebox" class="visible-xs learnvideo_mobile">'+learnbtn+'</a>';
	
	var learntext_pc = '<a href="javascript:void(0);" class="hidden-xs learntext_pc">'+learnbtn+'</a>';
	var learntext_mobile;
	
	var learnvideo = learnvideo_pc + learnvideo_mobile;
	var learntext;

	function getLearntext(level1,level2,level1name,level1namezm,level2name,level1style,level2style){
		var hrefpath;

		hrefpath = platformiframeurlstrtext + 'level1='+level1+'' + '&level2='+level2+'' + '&level1name='+level1name+'' + '&level1namezm='+level1namezm+'' + '&level2name='+level2name+'' + '&level1style='+level1style+'' + '&level2style='+level2style+'';
		
		learntext_mobile = '<a href="mobiletext.html?'+hrefpath+'" class="visible-xs learntext_mobile">'+learnbtn+'</a>';
		learntext = learntext_pc + learntext_mobile;
	}	
	
	var aMenuName = arrMenuName[i].split("-")[0] //一级栏目名称
	var aMenuNamezm = arrMenuName[i].split("-")[1] //一级栏目字母
	var aMenuStyle = arrMenuStyle[i]  //一级栏目类型
	
	var arrddName = eval("arrddName"+(i+1)); //二级栏目名称
	var arrddStyle = eval("arrddStyle"+(i+1)); //二级栏目类型
	
	if(arrddName){
		courselist.append("<div class='courseli'><p><span>"+aMenuName+"</span><i class='open'></i></p><dl></dl></div>")
		$.each(arrddName,function(j){
			//二级栏目名称有，但二级栏目类型没有，则取一级栏目类型
			if(arrddStyle){ 
				//二级栏目类型有
				if(arrddStyle[j]=="video"){
					loadvideo2();
				}else{
					loadtext2(arrddStyle[j]);
				}
			}else{
				//二级栏目类型无
				if(aMenuStyle=="video"){
					loadvideo2();
				}else{
					loadtext2(aMenuStyle);
				}
			}
			
			function loadvideo2(){
				courselist.find("dl").eq(i).append("<dd><span title="+arrddName[j]+" level1="+i+" level2="+j+" level1namezm="+aMenuNamezm+">"+arrddName[j]+"</span>"+ learnvideo +"</dd>")
			}
			function loadtext2(style){
				getLearntext(i,j,aMenuName,aMenuNamezm,arrddName[j],aMenuStyle,style)

				courselist.find("dl").eq(i).append("<dd><span title="+arrddName[j]+" level1="+i+" level2="+j+" level1name="+aMenuName+" level1namezm="+aMenuNamezm+" level2name="+arrddName[j]+" level1style="+aMenuStyle+" level2style="+style+">"+arrddName[j]+"</span>"+ learntext +"</dd>")		
			}
		});
	}else {
		//二级栏目名称无
		if(aMenuStyle=="video"){
			loadvideo1();
		}else{
			loadtext1();
		}

		function loadvideo1(){
			courselist.append("<div class='courseli'><p><span level1="+i+" level1namezm="+aMenuNamezm+">"+aMenuName+"</span>"+ learnvideo +"</p><dl></dl></div>")
		}
		function loadtext1(){
			getLearntext(i,'',aMenuName,aMenuNamezm,aMenuStyle,'','');
			courselist.append("<div class='courseli'><p><span level1="+i+" level1name="+aMenuName+" level1namezm="+aMenuNamezm+"  level1style="+aMenuStyle+">"+aMenuName+"</span>"+ learntext +"</p><dl></dl></div>")	
		}
	}
});

//----------------------------初始化----------------------------

//展开下拉
var alldl = $(".courseli dl");
var allopnen = $(".open");
clearallopen();
alldl.parent().eq(0).find(".open").removeClass("openon").addClass("closeon");

//清楚所有样式
function clearlearnclass(){
	$(".courseli a").removeClass("active");
}

function clearallopen(){
	alldl.hide();
	allopnen.removeClass("closeon").addClass("openon");
}

//显示第一个video并展开所属二级
var videofirst_pc = $(".learnvideo_pc").eq(0).siblings("span");
var videofirst_mobile = $(".learnvideo_mobile").eq(0).siblings("span");

videofirst_pc.parent().parent().show();
videofirst_mobile.parent().parent().show();

findvideofirst(videofirst_pc);
findvideofirst(videofirst_mobile);
function findvideofirst(videofirst){
	var level1idnex = videofirst.attr("level1");
	var level2idnex= videofirst.attr("level2");
	var level1namezm =  videofirst.attr("level1namezm");
	
	if(level1idnex){
		videofirst_pc.siblings("a").addClass("active");
		videofirst_mobile.siblings("a").addClass("active");
		playvideo(level1idnex,level2idnex,level1namezm);

	}else{
		var novideo = '<div class="novideo">该课程没有视频！</div>'
		$(".videobox").html(novideo);		
	}
}

//展开二级栏目
$(".open").on("click",function(){
	//电脑展开隐藏，手机仅展开不隐藏
	function clearallopenRedirect() {
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
	
		}else{
			clearallopen();
		}
	}
	clearallopenRedirect();
	$(this).removeClass("openon").addClass("closeon").parent("p").siblings("dl").show();
});

//点击视频
$(".learnvideo_pc,.learnvideo_mobile").on("click",function(){
	level1idnex =  $(this).siblings().attr("level1");
	level2idnex =  $(this).siblings().attr("level2");
	level1namezm =  $(this).siblings().attr("level1namezm");
	
	clearlearnclass();
	$(this).addClass("active");

	playvideo(level1idnex,level2idnex,level1namezm);
	
});

//点击文本
$(".learntext_pc,.learntext_mobile").on("click",function(){
	level1idnex =  $(this).siblings().attr("level1");
	level2idnex =  $(this).siblings().attr("level2");
	level1name =  $(this).siblings().attr("level1name");
	level1namezm =  $(this).siblings().attr("level1namezm");
	level2name =  $(this).siblings().attr("level2name");
	level1style =  $(this).siblings().attr("level1style");
	level2style =  $(this).siblings().attr("level2style");
	
	var thisclass = $(this).attr("class");

	if(thisclass.indexOf("learntext_pc")>=0){
		clearlearnclass();
		$(this).addClass("active");
	}
	
	clearvideojs();
	playtext(thisclass,level1idnex,level2idnex,level1name,level1namezm,level2name,level1style,level2style);
});


//视频播放
function playvideo(level1idnex,level2idnex,level1namezm){
	var vstr;
	
	//----------获取cc播放器地址 开始
	//http路径
	var arrVid = eval("arrVid" + (parseInt(level1idnex) + 1));
	var myVid;
	if(parseInt(level2idnex) + 1){
		myVid = arrVid[parseInt(level2idnex)];
	}else{
		myVid = arrVid[0];
	}
	//----------获取cc播放器地址 结束

	//----------获取本地播放器地址 开始
	//local路径
	var localpath;
	if(parseInt(level2idnex) + 1){
		localpath = "video/" + CourseCode + level1namezm + (parseInt(level2idnex) + 1) + ".mp4";
	}else{
		localpath = "video/" + CourseCode + level1namezm + ".mp4";
	}
	
	//h5video配置
	var tiptext ="您的浏览器不支持H5标签video，请升级您的浏览器。";
	var yyvideoPoster = ""; //播放前图片
	var setAutoplay = 1;  //自动播放：1开启 0不开启
	var setLoop = 0;  //循环播放：1开启 0不开启
	var setPreload = 1;  //视频在页面加载时进行加载并预备播放：1开启 0不开启
	var yyvideoPoster,yyvideoLoop,yyvideoPreload,yyvideoset;
	(setAutoplay == 1)?(yyvideoAutoplay = "autoplay"):(yyvideoAutoplay = "");
	(setLoop == 1)?(yyvideoLoop = "loop"):(yyvideoLoop = "");
	(setPreload == 1)?(yyvideoPreload = "preload"):(yyvideoPreload = "");
	yyvideoset = yyvideoAutoplay + " " + yyvideoLoop + " " + yyvideoPreload;

	//flash播放器	
	var tiptext ="您的浏览器不支持H5标签video，请升级您的浏览器。";
	var imgpath = "images/beforevideo";
	var mstr_w = $(".videobox").width();
	var mstr_h = $(".videobox").height();
	var mstr = "<EMBED width="+mstr_w+" height="+mstr_h+" id=objF type=application/x-shockwave-flash src=player.swf flashvars='file="+localpath+"&amp;type=http&amp;image="+imgpath+".jpg&amp;repeat=list&amp;bufferlength=1&amp;volume=100&amp;autostart=0&amp;controlbar=bottom&amp;displayclick=play&amp;logo.position=top-left' allowfullscreen='true' allowscriptaccess='always' bgcolor='#000000' wmode='transparent'></EMBED>";
	tiptext = mstr;

	//取消全屏
	var  nofullscreen = 'x-webkit-airplay="allow" x5-playsinline="" webkit-playsinline="" playsinline="true"';
	//----------获取本地播放器地址 结束
	
	

	//播放器选择
	if(!localfile && StrHttp>=0){
		try{ 
			if(typeof(eval(ccplayer))=="function"){
				ccplayer();
			}
		}catch(e){
			localvideoplayer();	
		} 
	}else{
		localvideoplayer();
	}
	
	//cc播放器
	function ccplayer(){
		cstr='<div class="video_cc"><script src="https://p.bokecc.com/player?vid='+myVid+'&siteid=039C1380CF417F50&autoStart=true&width=100%&height=100%&playerid=3E79747550AACD79&playertype=1" type="text/javascript"></script></div>'
		$(".videobox").html(cstr);	
	}

	//本地播放器		
	function localvideoplayer(){

		//自动选择 pc video.js 手机 h5video
		function videoplayerRedirect() {
			if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
				h5video();
			}else{
				videojsplayer();
			}
		}
		videoplayerRedirect();
		
		//手动选择
		//videojsplayer();
		//h5video();

		//h5video
		function h5video(){
			vstr = '<video id="yyvideo" width="100%" height="100%" controls controlsList="nodownload" poster="'+yyvideoPoster+'" ' + yyvideoset + nofullscreen +'><source src="'+localpath+'" type="video/mp4">'+tiptext+'</video>'
			$(".videobox").html(vstr);		
		}

		//video.js
		function videojsplayer(){
			clearvideojs();
			vstr = '<video id="my-video" controls controlsList="nodownload" class="video-js vjs-big-play-centered" width='+mstr_w+' height='+mstr_h+' data-setup="{}" '+nofullscreen+'><source src="'+localpath+'" type="video/mp4">'+tiptext+'</video>';
			$(".videobox").html(vstr);
			
			try{ 
				if(typeof(eval(videojsReset))=="function" && $("#my-video").length>0){
					videojsReset();
				}
			}catch(e){
				if(typeof(eval(h5video))=="function"){
					h5video();	
				}
			} 
			
			//配置
			function videojsReset(){
				var player = videojs('my-video',{
					controls: true,
					autoplay: "auto",
					preload: "auto",
					loop: false,
					muted: false,
					aspectRatio:"16:9",
					poster:"", 
					bigPlayButton : false,
					nativeControlsForTouch: false,
					textTrackDisplay : false,  
					controlBar: {
						remainingTimeDisplay: false, 
						captionsButton : false,
						chaptersButton: false,
						subtitlesButton:false,
						liveDisplay:false,
						playbackRateMenuButton:false
					}
				}, function () {
					//视频加载后的回调函数
				})		
				
				//语言
				videojs.addLanguage("zh-CN",{
				 "Replay": "重新播放",
				 "Play Video": "播放",
				 "Play": "播放",
				 "Pause": "暂停",		
				 "Fullscreen": "全屏",
				 "Non-Fullscreen": "退出全屏",
				 "Mute": "静音",
				 "Unmute": "取消静音"
				});
			}
		}
	}
}


//本地播放器video.js销毁
function clearvideojs(){
	try{ 
		if(typeof(eval(clearvideojsfun))=="function" && $("#my-video").length>0){
			clearvideojsfun();
		}
	}catch(e){

	}

	function clearvideojsfun(){
		var player = videojs('my-video');
		player.dispose();	
	}
}


//文本显示
function playtext(thisclass,level1idnex,level2idnex,level1name,level1namezm,level2name,level1style,level2style){
	//文档名称
	var htmlname;
	if(parseInt(level2idnex)+1){
		htmlname = level1namezm + (parseInt(level2idnex)+1);
	}else{
		htmlname = level1namezm;
	}
	
	//判断页面显示还是文档下载
	if(level2name){
		if(level2style=="down"){
			playdown();
		}else{
		 	playhtml();	
		}
	}else{
		if(level1style=="down"){
			playdown();
		}else{
			playhtml();	
		}	
	}
	
	//页面显示
	function playhtml(){
		var textpath;
		if(level1namezm=="ppt" || level1namezm.indexOf("ppt")>=0){
			textpath = htmlname + "/index.html"
		}else{
			
			textpath = htmlname +".html";
		}

		var iframe_h='';
		var videobox_h = $(".videobox").height();
		if(videobox_h){
			iframe_h = 'height="'+ videobox_h +'"';
		}
		
		var iframestr = '<iframe id="mainiframe" width="100%" '+ iframe_h +' src="html/'+textpath+'" frameborder="0" scrolling="auto"></iframe>';
		textbox_videobox(iframestr);
	}
	
	//文档下载
	function playdown(){
		var downpath = "html/"+htmlname+".zip"
		var iframestr = '<div class="downbox"><a href="'+downpath+'"><img src=images/down.png /><br />点击下载</a></div>'
		textbox_videobox(iframestr);			
	}

	//textbox or videobox
	function textbox_videobox(iframestr){
		if(thisclass.indexOf("learntext_pc")>=0){
			$(".videobox").html(iframestr);
		}else{
			$(".textbox").html(iframestr);

			//iframe自适应
			var ifm = document.getElementById("mainiframe");
			if(ifm){
				function changeFrameHeight() {
					ifm.height = document.documentElement.clientHeight;
				}
				window.onresize = function() {
					changeFrameHeight();
				}
				$(function() {
					changeFrameHeight();
				});
			}
		}
	}
	
	//调用计时器
	jsqplay(true);
}

function cleardownbtnRedirect() {
	if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		
	}else{
		//pc
		$(".textbox").addClass("textboxoverflow"); //手机端去掉滚动条
		//$(".videobox").addClass("pconly"); //电脑去掉下载按钮
		cleardownbtn();
	}
}
cleardownbtnRedirect();

//去掉chorme的下载按钮
function cleardownbtn(){
	var agent = navigator.userAgent.toLowerCase();
	function getBrowserInfo(){
		var regStr_chrome = /chrome\/[\d.]+/gi ;
		if(agent.indexOf("chrome") > 0){
			return agent.match(regStr_chrome) ;
		}
	}
	var browser = getBrowserInfo() ;
	var verinfo = (browser+"").replace(/[^0-9.]/ig,""); 
	var verinfo_first = verinfo.split(".")[0] 

	if(verinfo_first<59 && agent.indexOf("se") == -1){
		$(".videobox").addClass("pconly"); 
	}
}

var level1,level2,level1name,level1namezm,level2name,level1style,level2style;

level1 = getUrlParam('level1');
level2 = getUrlParam('level2');
level1name = getUrlParam('level1name');
level1namezm = getUrlParam('level1namezm');
level2name = getUrlParam('level2name');
level1style = getUrlParam('level1style');
level2style = getUrlParam('level2style');

if(level1){
	var dstr = level1name;
	$(".dqwz").html(dstr);
	playtext('',level1,level2,level1name,level1namezm,level2name,level1style,level2style);
}


//计时器功能 -- 平台url已传参,添加iframe嵌套父级页面,用于跨主域访问
if(platformiframeurl){
	//向body创建div
	var yy_div=document.createElement("div");
	document.body.appendChild(yy_div);
	yy_div.id="yy_iframe";
	//添加iframe
	document.getElementById("yy_iframe").innerHTML='<iframe name="iframeJsq" id="iframeJsq" style="display:none;" src="'+ platformiframeurl +'"></iframe>'
}


//总结束符号
});


//---------------计时器功能begin---------------
function getSWF( swfID ) {
if (window.document[ swfID ]) {
	return window.document[ swfID ];
} else if (navigator.appName.indexOf("Microsoft") == -1) {
	if (document.embeds && document.embeds[ swfID ]) {
	return document.embeds[ swfID ];
	}
} else {
	return document.getElementById( swfID );
	}
}

var videovid;
var objectid;

//播放器界面元素初始化时
function on_cc_player_init( vid, objectID ){
	videovid=vid;
	objectid=objectID;
	var ccplayer = getSWF( objectID );
	var config = {};
	ccplayer.setConfig(config);
}

//开始播放
function on_spark_player_start(){
	jsqplay(true);
}

//暂停播放
function on_spark_player_pause(){
	jsqplay(false);
}

//恢复播放
function on_spark_player_resume(){
	jsqplay(true);
}

//结束播放
function on_spark_player_stop(){
	jsqplay(false);
}

//设置页面加载完成后是否开始计时
var videoifplay=true;

//计时器回调函数
function jsqplay(videoifplay){
	changeVideoFlag(videoifplay)
}

//与平台交互的函数
function changeVideoFlag(videoifplay) {
	var ifr = document.getElementById('iframeJsq');
	if(ifr){
		//iframe嵌套添加成功
		var targetOrigin = '*';
		if(typeof(videoifplay)=="undefined"){
			//未设置videoifplay跳过不处理
		}else{
			//设置videoifplay执行
			var func = {name:"callParentFun",value:videoifplay};
			var str
			if(typeof(JSON)=="undefined"){
				//当浏览器不支持JSON时,如IE7,则使用此方法将JSON对象转化为字符串
				str = "'name':"+"'"+func.name+"','value':"+func.value
				str = "{" + str +"}";
			}else{
				//当浏览器支持JSON时,则使用此方法将JSON对象转化为字符串
				str = JSON.stringify(func);
			}
			ifr.contentWindow.postMessage(str, targetOrigin);
		}
	}
}
//---------------计时器功能end---------------






