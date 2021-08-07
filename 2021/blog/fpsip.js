$(function() {
if ( /*getCookie('msg') !=*/ 1) {
var t = document.createElement("a");
t.href = document.referrer;
var msgTitle = t.hostname;
var name = t.hostname.split(".")[1];
if ("" !== document.referrer) {
	switch (name) {
		case 'bing':
			msgTitle = '必应搜索';
			break;
		case 'baidu':
			msgTitle = '百度搜索';
			break;
		case 'so':
			msgTitle = '360搜索';
			break;
		case 'google':
			msgTitle = '谷歌搜索';
			break;
		case 'sm':
			msgTitle = '神马搜索';
			break;
		case 'sogou':
			msgTitle = '搜狗搜索';
			break;
		default:
			msgTitle = t.hostname;
	};
};
var time = (new Date).getHours();
var msg = '';
23 < time || time <= 5 ? msg = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？" : 5 < time && time <= 7 ? msg =
	"早上好！一日之计在于晨，美好的一天就要开始了！" : 7 < time && time <= 11 ? msg = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！" : 11 <
	time && time <= 14 ? msg = "中午了，工作了一个上午，现在是午餐时间！" : 14 < time && time <= 17 ? msg =
	"午后很容易犯困呢，今天的运动目标完成了吗？" : 17 < time && time <= 19 ? msg = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~" : 19 <
	time && time <= 21 ? msg = "晚上好，今天过得怎么样？" : 21 < time && time <= 23 && (msg =
		"已经这么晚了呀，早点休息吧，晚安~");
$.ajax({
	type: "get",
	url: "https://api.gmit.vip/Api/UserInfo/",
	async: true,
	success: function(data) {
		window.info = data;
		function Cookie(key,value){
		    this.key=key;
		    if(value!=null)
		    {
			this.value=escape(value);
		    }
		    this.expiresTime=null;
		    this.domain=null;
		    this.path="/";
		    this.secure=null;
		}
		Cookie.prototype.setValue=function(value){this.value=escape(value);}
		Cookie.prototype.getValue=function(){return (this.value);}
		Cookie.prototype.setExpiresTime=function(time){this.expiresTime=time;}
		Cookie.prototype.getExpiresTime=function(){return this.expiresTime;}
		Cookie.prototype.setDomain=function(domain){this.domain=domain;}
		Cookie.prototype.getDomain=function(){return this.domain;}
		Cookie.prototype.setPath=function(path){this.path=path;}
		Cookie.prototype.getPath=function(){return this.path;}
		Cookie.prototype.Write=function(v){
		    if(v!=null){
			this.setValue(v);
		    }
		    var ck=this.key+"="+this.value;
		    if(this.expiresTime!=null){
			try {
			    ck+=";expires="+this.expiresTime.toUTCString();;
			}
			catch(err){
			    alert("expiresTime参数错误");
			}
		    }
		    if(this.domain!=null){
			ck+=";domain="+this.domain;
		    }
		    if(this.path!=null){
			ck+=";path="+this.path;
		    }
		    if(this.secure!=null){
			ck+=";secure";
		    }
		    document.cookie=ck;
		}
		Cookie.prototype.Read=function(){
		    try{
			var cks=document.cookie.split("; ");
			var i=0;
			for(i=0;i <cks.length;i++){
			    var ck=cks[i];
			    var fields=ck.split("=");
			    if(fields[0]==this.key){
				this.value=fields[1];
				return (this.value);
			    }
			}
			return null;
		    }
		    catch(err){
			alert("cookie读取错误");
			return null;
		    }
		}



		var ck=new Cookie("HasLoaded");  
		if(ck.Read()==null){
		    layer.msg("Hi~ 来自" + data.data.location + '~<br/>通过 ' + msgTitle +
			' 进来的朋友！<br/>使用 ' + data.data.os + "<br/>" + data.data.browser +
			' 访问本站！' + '<br/>' + msg);
		    ck.Write("true");  
		}
		else{
		}
		var showFPS = (function() {
			var requestAnimationFrame = window.requestAnimationFrame || window
				.webkitRequestAnimationFrame || window
				.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame || function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			var e, pe, pid, fps, last, offset, step, appendFps;
			fps = 0;
			last = Date.now();
			step = function() {
				offset = Date.now() - last;
				fps += 1;
				if (offset >= 1000) {
					last += offset;
					appendFps(fps);
					fps = 0;
				};
				requestAnimationFrame(step);
			};
			appendFps = function(fps) {
				var settings = {
					timeout: 5000,
					logError: true
				};
				$('#fps').html('<span style="float:left;">' + fps +
					'FPS</span><br/><span style="float:left">' + window
					.info.data.os +
					'</span><br/><span style="float:left;margin-top:1px;">' +
					window.info.data.browser +
					'</span><br/><span style="float:left;margin-top:1px;">' +
					window.info.data.location +
					'</span><br/><span style="float:left;margin-top:1px;"></span>'
					);
			};
			step();
		})();
	}
});
};
});
