var text="";//当前输入的文字内容
var code="";
var texts = new Array();  //记录当前所有操作
var html="";
var obj=document.getElementById('pwd');
var plugin=document.getElementById("plugin").getElementsByTagName("param");
var maskChar=""; //密码替换后的内容
var doing=false;
window.onload=function(){
	//初始密码框
	init();
	//禁止上下左右回车键
	document.onkeydown=disabledKeyCode; 
	//禁止复制
	document.onpaste=disabledPasteAndDrop; 
	//ondrop禁止拖拽  
	document.ondrop=disabledPasteAndDrop;
}

//初始化方法
function init(){
	maxLength=getPluginParam("maxLength");  //最大输入长度
	minLength=getPluginParam("minLength");  //最小输入长度
	maskChar=getPluginParam("maskChar");
	obj.style.width=getPluginParam("width")+"px";
	obj.style.height=getPluginParam("height")+"px";
	obj.style.lineHeight=getPluginParam("height")+"px";
	obj.style.backgroundColor =getPluginParam("backColor");
	obj.style.color=getPluginParam("textColor");
	obj.style.borderColor=getPluginParam("borderColor");
	obj.style.fontFamily=getPluginParam("textFont");
	obj.style.fontSize=getPluginParam("textSize")+"px";
	obj.style.marginLeft=getPluginParam("leftMargins")+"px";
	obj.setAttribute('placeholder',getPluginParam("promptText"));
	
	
	var sty=document.createElement('style');
	sty.innerText='.input:empty:before{color:'+getPluginParam("promptTextColor")+'}';
	document.body.appendChild(sty);
}

//处理键盘事件 禁止后移动光标事件
function disabledKeyCode(e){     
  var e = event || window.event || arguments.callee.caller.arguments[0];
  //上下左右移动键
  if((e && e.keyCode==37) || (e && e.keyCode==38) || (e && e.keyCode==39) || (e && e.keyCode==40)){ 
    //禁用
    return false;
  }     
   if(e && e.keyCode==13){ // enter 键
    var pwdLength=obj.innerText.length;  //当前文本长度
	//最多输入字符 超过后 输入框不显示
	if(pwdLength<minLength){
		alert("您输入的内容不能少于"+minLength+"位")
	}
     return false;
  }
   if(e && e.keyCode==9){ // tab 键
   		console.log("Tab");
   		return false;
	}
 
}
//禁止复制和拖拽
function disabledPasteAndDrop(){
	return false;
}
//onkeypress 获取输入内容 和keyCode
function onkeypressHtml(evt){
	evt = (evt) ? evt : ((window.event) ? window.event : ""); 
	code = evt.keyCode?evt.keyCode:evt.which;//兼容IE和Firefox获得keyBoardEvent对象的键值 
    text = String.fromCharCode(code); 
    var pos=getCursorPosition(obj);//保存原始光标位置 
	var operation=pos+","+text+","+code;  //pos:光标位置 text:输入值 code:键盘keyCode
    //超过最大值不在输入，不记录数组
    if(obj.innerText.length<maxLength){
    	texts.push(operation)
    	console.log(texts) 
    	return false;
    }
}
//输入的内容替换成*
function onkeyupHtml(evt){
	var pos=getCursorPosition(obj);//保存原始光标位置 
	evt = (evt) ? evt : ((window.event) ? window.event : ""); 
	code = evt.keyCode?evt.keyCode:evt.which;//兼容IE和Firefox获得keyBoardEvent对象的键值 
	var mhtml="";  //替换后显示文本内容
	var pwdLength=obj.innerText.length;  //当前文本长度
	var innerText=obj.innerText.substring( pwdLength-1,pwdLength); //当前输入文本信息
	/*//只能排除一部分 列如@符号不区分中英文  onkeypress事件不识别中文键盘下的特殊字符
	if(checkChinese(innerText)==false){
		alert("密码不能中文包含特殊字符");
		obj.innerHTML=obj.innerHTML.replace(innerText,"");
		//中文键盘情况下输入^为"……" 但是innerText值为“…”所以替换两次
		if(innerText=="…"){
			obj.innerHTML=obj.innerHTML.replace(innerText,"");
		}
		setPosIndex();
		return false;
	}*/
	//删除键操作
	if(code==8){
		/*if(obj.innerHTML!=""){
			var operation=pos+",backspace,"+code;  //pos:光标位置 text:输入值 code:键盘keyCode
			texts.push(operation)
		}*/
		//删除数组的数据
		if(texts.length>0){
			texts.splice(pos,texts[pos].length);
		}
		console.log(texts) 
	}	
	
	//最多输入字符 超过后 输入框不显示
	if(pwdLength>maxLength){
		obj.innerHTML=obj.innerHTML.substring( 0,maxLength);
		setPosIndex();//设置光标 
		alert("您输入的内容不能超过"+maxLength+"位")
		return false;
	}
	//Safari浏览器最后一行删除时，会自动加出一个br。加此判断
	if(obj.innerHTML!="<br>"){
		if(obj.innerHTML==""){
			texts.splice(0,texts.length);//清空数组 
		}
		for (var i=0;i<pwdLength;i++){
			mhtml=mhtml+maskChar;
		}
	}else{
		texts.splice(0,texts.length);//清空数组 
	}
	obj.innerHTML=mhtml;
	setPosIndex();//设置光标 
}
//设置当前input光标位置 把光标移动到最后
function setPosIndex(){
	pwdLength=obj.innerText.length;
	setCaretPosition(obj,pwdLength);//设置光标 
}
/*获取光标位置*/
function getCursorPosition(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {//谷歌、火狐
    sel = win.getSelection();
    if (sel.rangeCount > 0) {//选中的区域
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();//克隆一个选中区域
      preCaretRange.selectNodeContents(element);//设置选中区域的节点内容为当前节点
      preCaretRange.setEnd(range.endContainer, range.endOffset);  //重置选中区域的结束位置
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {//IE
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}
/**
 * 设置光标位置
 * @param {Object} element
 * @param {Object} pos
 */
 function setCaretPosition(element, pos) {
  var range, selection;
  if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
    range = document.createRange();//创建一个选中区域
    range.selectNodeContents(element);//选中节点的内容
    if(element.innerHTML.length > 0) {
      range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
    }
    range.collapse(true);       //设置选中区域为一个点
    selection = window.getSelection();//获取当前选中区域
    selection.removeAllRanges();//移出所有的选中范围
    selection.addRange(range);//添加新建的范围
  }
  else if (document.selection)//IE 8 and lower
  {
    range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
    range.moveToElementText(element);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    range.select();//Select the range (make it the visible selection
  }
}
 /**
  * 根据key值获取自定义属性值
  * @param {Object} key
  */
 function getPluginParam(key){
 	for(var i=0;i<plugin.length;i++){
 		if(plugin[i].name==key){
 			return plugin[i].value;
 		}
 	}
 }
 /**
 * 检验不能输入类容
 * @param {Object} obj_val
 */
function checkChinese(obj_val){
    regCn = /[·！￥…（——）：；“”‘《》？、【】]/im;
	if(regCn.test(obj_val)) {
	    return false;
	}
}