# qingguospider

一个通用的基于nodejs的青果教务系统爬虫

一个基于nodejs的青果教务系统爬虫

以山西大学教务网络管理系统为例

部分功能仍然需要更改以适合大多数青果教务网络管理系统

-----------------------------------------------
## API


导入

<code>
var spider=require("./spider.js");
</code>



实例化一个spider

<code>
var spiderForSXU=new spider();
</code>


登陆一个网页并获取其cookie


<code>
  spiderForSXU.getWeb(callback);
  callback=function(){
    console.log("this is a function");
  };
</code>


获取__viewstate
<code>
  spiderForSXU.getViewState(cookie,callback);
  //cookie为获取到的cookie
  //callback为获取完viewstate后所进行的操作
  //__viewstate属性将保存在spider实例的viewstate属性中，可通过获取属性API调用得到
</code>


登录
<code>
  spiderForSXU.login(url,form,opt,callback);
  //url为登录地址,opt为完整登录所需的报头,form为登录表单,callback为回调
</code>


获取图片(暂仅针对山西大学教务网络管理系统，如需使用暂时请自行更改地址)
<code>
  spiderForSXU.getPic(picurl,picname,opt);
  //picurl为图片网络地址
  //picname为保存图片名
  //当需要cookie或特殊报头时，在opt中提供完整报头
</code>


获取原始成绩
<code>
  spiderForSXU.getRealScore();
</code>


获取有效成绩
<code>
  spiderForSXU.getValueScore();
</code>

获取spider实例的属性
<code>
  spiderForSXU.getAttr([name]);
</code>


获取cookie
<code>
  spiderForSXU.getCookie();
</code>


解析一个指定的网页，并返回promise对象
<code>
  spiderForSXU.getSWeb(url,needCookie);
  //url为要解析的地址
  //needCookie为是否需要cookie值
</code>

使用青果的md5加密数据（密码及验证码，用于登录使用）
<code>
  spiderForSXU.secret(option)
  /*
  *@param Object 
  * like{
  *     type:"password or check",//所需md5码的类型，密码还是验证码
  *      id:"your id",//你的账号
  *      pwd:"your password",//你的密码
  *      checkNumber:"the verification code",//验证码
  *      schoolNumber:"your school number"//你的学校代码
  *  }
  *
  *@param string //返回所得md5码
  *
  */
</code>
