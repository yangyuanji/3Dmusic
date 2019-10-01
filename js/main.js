
class Music{
  constructor(ele){
    this.ele = ele;
    this.rf = document.getElementById("rightBg");
    this.box = document.getElementById("box");
    this.text = document.getElementById("search");
    this.bfBox = document.getElementById("bfBox");
    this.url = "https://api.apiopen.top/searchMusic";
    this.infoBox = document.getElementById("infoBox");
    this.displayPage = document.getElementById("display");
    this.disPageClose = document.querySelector("#display .close span");
    this.searchBtn = document.getElementById("searchSpan");
    this.leftBg=document.getElementsByClassName("leftBg")[0];
    this.leftmarquee=document.getElementsByTagName("marquee")[0];
    this.leftp=document.querySelector("leftBg p")
    console.log(this.leftmarquee)
    //this.addEvent();
  }
  init() {
    this.addEvent();  //
  }
  // 绑定事件函数
  addEvent(){
    var that = this;
    // 鼠标在body上移动,将坐标转换成旋转角度,形成视差
    document.onmousemove = function (eve){
      var e = eve || window.event;
      that.x = (e.clientX-that.ele.offsetWidth/2)*0.01;
      that.y = -(e.clientY-that.ele.offsetTop/2)*0.01;;
      that.display();
    }
    //搜索框发生改变,生成搜索内容
    document.onkeydown=function (e) {  //键盘按下事件
      if(e.keyCode==13){
        that.searchBtn.onclick();
      }
    }
    this.searchBtn.onclick = function(){
      var str = "";
      that.url = "https://api.apiopen.top/searchMusic";
      str = "?name="+that.text.value;
      console.log(that.text.value)
      that.url += str;
      that.load();

    }
    var bf=document.querySelector("#infoBox")  //鼠标进入事件
    bf.onmouseover=function () {          //盒子移动变透明
      document.querySelector("#bfBox").style.opacity=0.6;
      document.querySelector("#bfBox").style.marginLeft=0+"px";
    }

  }
  // ajax请求数据
  load(){
    var that = this;
    ajax(
      "get",
      this.url,
      function(res){
        that.res = JSON.parse(res);
        console.log(that.res.result);
        that.display2();
      }
    )
  }
  //形成视差
  display(){
    this.box.style.transform = "rotateY(" + this.x + "deg) rotateX(" + this.y + "deg)";
  }
  //生成搜索内容
  //请求完成,获得数据,将数据展示到搜索页面上
  display2(){
    this.displayPage.style.display = "block"
    var str = "";
    // 如果搜索为空,显示搜索内容为空
    //否则,展示搜索内容
    if(this.res.result.length == 0){
      str = "<h3>搜索内容为空</h3>"
    }else{
      for(var i=0;i<this.res.result.length;i++){
        str=str+`<div><p>${this.res.result[i].title}=>${this.res.result[i].author}<span>听这首</span></p></div>`

      }
    }

    this.infoBox.innerHTML = str;
    //this.change();
    var that = this;
    this.span = document.querySelectorAll("#infoBox span");
    console.log(this.span);

    // 遍历所有的歌曲span,找到点击所在的索引,保存到num中
    //同时:如果选中了歌曲,就关闭搜索展示页面
    for(var i=0;i<this.span.length;i++){
      this.span[i].index = i;
      this.span[i].onclick = function (){
        this.num = that.span[this.index].index
        that.reMove();
        that.display3(this.num);
        that.box.style.backgroundImage="url("+that.res.result[this.num].pic+")"   //背景图改变
        that.leftBg.style.backgroundImage="url("+that.res.result[this.num].pic+")"

        // console.log(this.num);
      }
    }
    this.disClose();   //关闭界面

  }

  //点击选中的歌曲,改变播放器页面的信息
  /*  change(){
      var that = this;
      this.span = document.querySelectorAll("#infoBox p span");
      console.log(this.span);

      // 遍历所有的歌曲span,找到点击所在的索引,保存到num中
      //同时:如果选中了歌曲,就关闭搜索展示页面
      for(var i=0;i<this.span.length;i++){
        this.span[i].index = i;
        this.span[i].onclick = function (){
          this.num = that.span[this.index].index
          that.reMove();
          that.display3(this.num);
          // console.log(this.num);
        }
      }

    }*/

  // 关闭按钮方法  ===> 点击关闭按钮(disPageClose) 执行关闭搜索页面
  disClose(){
    var that = this;
    this.disPageClose.onclick = function(){
      that.reMove();
    }
  }

  getRandomColor() {  //随机颜色函数
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  //移除方法  ====> 执行该函数,清空搜索界面所有内容,并隐藏
  reMove(){
    this.displayPage.style.display = "none";
    this.infoBox.innerHTML = "";
    document.querySelector("#bfBox").style.opacity=1;  //并且恢复之前2的状态
    document.querySelector("#bfBox").style.marginLeft=150+"px";
  }


  //播放器音乐信息展示方法  ===> 将ajax请求到的数据,写入到播放内容区(bfBox)
  display3(num){

    var html = "";
    var htmlcurrent="";
    for(var i=0;i<this.res.result.length;i++){
      html= `<div class="imgBox">
                        <img src="${this.res.result[num].pic}" alt="">
                    </div>
                    <div class="info">
                        <p>${this.res.result[num].title}</p>
                        <p>${this.res.result[num].author}</p>
                        <audio src="${this.res.result[num].url}" controls autoplay></audio>
                    </div>`
      htmlcurrent=`<div id="mask"></div>
                      <marquee behavior="scroll" direction="left" style="color:${this.getRandomColor()} ">${this.res.result[num].title}</marquee>
                      <p class="p1"style="color:${this.getRandomColor()} ">3D <br>OF</p>
                      <p class="p2"style="color:${this.getRandomColor()} ">MUSIC</p>`


      console.log(htmlcurrent)
    }

    this.bfBox.innerHTML = html;
    this.leftBg.innerHTML=htmlcurrent;

  }


}


//ajax封装函数
function ajax(method,url,done) {
  method.toUpperCase();//转换为大写
  var xhr=new XMLHttpRequest();
  //转化为key=value格式
  if (typeof params=='object'){
    var tempArr=[];
    for (var key in params){
      var value=params[key];
      tempArr.push(key+'='+value);
    }
    params=tempArr.join('&') //params变为'key1=value1&key2=value2'
  }
  if (method=='GET'){
    url=url+'?'+params;
  }
  xhr.open(method,url);
  var data=null;
  if (method=='POST'){
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    data=params;
  }
  //params=params||null;

  xhr.send(data);


  xhr.onreadystatechange=function () {
    if (xhr.readyState!=4) return;
    done(xhr.responseText);   //调用
  }

}
/*

    function ajax( { type, url,success,params, error, data, timeout }) {

      type = type || "get";
      data = data || {};
      timeout = timeout || 2000;
     /!* var str = "";
      for (var i in data) {
        str += `${i}=${data[i]}&`;
      }*!/
      if (type == "get") {
        /!*var d = new Date();
        url = url + "?" + str + "__qft=" + d.getTime();*!/
        url=url+'?'+params;
      }
      var xhr = new XMLHttpRequest();
      xhr.open(type, url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          success && success(xhr.responseText);
          error = null;
        } else if (xhr.readyState == 4 && xhr.status != 200) {
          error && error(xhr.status);
          success = null;
          error = null;
        }
      }

      setTimeout(() => {
        error && error("timeout");
        success = null;
      }, timeout);

      if (type == "post") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str)
      } else {
        xhr.send()
      }
    }

*/

var body = document.body;
new Music(body).init();


