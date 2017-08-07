/**
 * Created by 崔晋瑜 on 2017/7/30.
 */
const http  =  require("http"),
      fs    =  require("fs"),
      url   =  require("url"),
  superagent=  require("superagent"),
    cheerio =  require('cheerio'),
    request =  require("request"),
      qs    =  require("querystring"),
    iconv   =  require("iconv-lite"),
    crypto  =  require("crypto");
function md5(text){
    return crypto.createHash('md5').update(text).digest('hex');
}
let spider=function(){
    var that=this;
    var urls="";
    var options={};
    var theCookie="";
    var viewState="";
};
//初始化爬虫类
spider.prototype.init=function(u,o){
        this.urls=u;
        this.option=o;
    };
//登陆一个网页并获取其cookie
spider.prototype.getWeb=function(callback){
        var that=this;
         console.log(this.urls);
        superagent.get(this.urls)
            .end(function(err,res) {
                //console.log(that.urls);
                that.theCookie = res.header['set-cookie'][0].split(";")[0];
                console.log(`
--------------------------
-------------------------
${that.theCookie}
------------------------
------------------------`);
               // var $=cheerio.load(res.text);
                //var inputs=$('input');
               // console.log(res.text);
				setTimeout(()=>{
					callback();
				},500);
            })
    };
//获取viewstate
spider.prototype.getViewState=function(cookie,callback){
    var that=this;
    console.log("开始获取viewstate");
    console.log(`使用的Cookie是${cookie}`);
    var data='';
    var req=http.request({
        hostname:'bkjw.sxu.edu.cn',
        port:80,
        path:'/_data/login.aspx',
        method:'GET',
        headers:{
             'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
             'Accept-Encoding':'gzip, deflate',
             'Accept-Language':'zh-CN,zh;q=0.8',
             'Cache-Control':'no-cache',
             'Connection':'keep-alive',
             'Cookie':`${cookie}`,
             'Host':'bkjw.sxu.edu.cn',
             'Pragma':'no-cache',
             'Referer':'http://bkjw.sxu.edu.cn',
             'Upgrade-Insecure-Requests':'1',
             'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    },(res)=>{
        res.setEncoding('utf-8');
        res.on("data",(chunk)=>{
            data+=chunk;
        });
        res.on("end",()=>{
            console.log("数据接收完毕");
            console.log(data);
            var $=cheerio.load(data);
            that.viewstate=$("input[name='__VIEWSTATE']").val();
            callback();
        });
    });
    req.on("error",(err)=>{
        console.log(err);
    });
    req.end();
    //console.log(data);
};
//登录
spider.prototype.login=function(url,form,opt,callback){
        console.log("开始登陆");
        var param=qs.stringify(form);
        param=iconv.encode(param,"gbk");
        var req=http.request(opt,(res)=>{
            var data='';
           // console.log('STATUS: ' + res.statusCode);
           // console.log('HEADERS: ' + JSON.stringify(res.headers));
            //res.setEncoding('gb2312');
            res.on('data', function (chunk) {
                data+=chunk;
            });
            res.on("end",function () {
                setTimeout(function(){
                    callback()
                    //console.log(iconv.decode(data,"gb2312"));
                },500);
            })
        });
    req.on("error",(err)=>{
        console.log(err);
    });
    req.write(param);
    req.end();
    return new Promise((resolve,reject)=>{
            resolve();
    })
};
//获取图片
spider.prototype.getPic=function(picurl,picname,opt){
    console.log(opt);
    if(opt!=undefined){
        console.log("using options to get check picture");
        var req=http.request({
            hostname:'bkjw.sxu.edu.cn',
            port:'80',
            path:'/sys/ValidateCode.aspx',
            method:'GET',
            headers:opt
        },(res)=>{
            var imageData='';
            console.log(`状态码: ${res.statusCode}`);
            res.setEncoding("binary");
            res.on("data",(chunk)=>{
                //console.log(chunk.toString());
                imageData+=chunk;
            });
            res.on("end",()=>{
                fs.writeFile(picname+'.png',imageData,"binary",(err)=>{
                    if(err){
                        console.log(err);
                    }
                });
                console.log("OK SUCCESSFUL");
            })
        });
        req.on('error',(err)=>{
            console.log(err);
        });
        req.end();
    }else{
        console.log("using normal function to get the check picture");
        request.get(picurl).pipe(fs.createWriteStream(`${picname}.png`));
    }
};
//设置cookie
spider.prototype.setCookie=function(cookie){
    this.theCookie=cookie;
};
//获取原始成绩
spider.prototype.getRealScore=function (year,term,cab) {
    var option=qs.stringify({
        sel_xn:year,
        sel_xq:term,
        SJ:"1",
        btn_search:"¼ìË÷",
        SelXNXQ:"2",
        zfx_flag:"0",
        zxf:"0"
    });
   option=iconv.encode(option,"gbk");
    var req=http.request({
        hostname:'bkjw.sxu.edu.cn',
        port:'80',
        path:'/xscj/Stu_MyScore_rpt.aspx',
        method:'POST',
        headers:{
            'Accept':'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Cache-Control':'no-cache',
            'Content-Type':"application/x-www-form-urlencoded",
            'Connection':'keep-alive',
            'Cookie':`${this.theCookie}`,
            'Host':'bkjw.sxu.edu.cn',
            'Pragma':'no-cache',
            'Referer':'http://bkjw.sxu.edu.cn/xscj/Stu_MyScore_rpt.aspx',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    },(res)=>{
            //console.log(res);
            var $=cheerio.load(res);
          	fs.writeFile("res.txt",res.body,(err)=>{
          		console.log(err);
          	})
    });
    req.on('err',(err)=>{
        console.log(err);
    });
    req.write(option);
    req.end();
    return new Promise((resolve,reject)=>{
        resolve();
    })
    };

//获取课表
spider.prototype.getClass=function () {

};
//获取有效成绩
spider.prototype.getValueScore=function () {
    var req=http.request({
        hostname:'bkjw.sxu.edu.cn',
        port:'80',
        path:'/xscj/Stu_MyScore_Drawimg.aspx?x=1&h=2&w=867&xnxq=20161&xn=2016&xq=1&rpt=1&rad=2&zfx=0',
        method:'GET',
        headers:{
            'Accept':'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive',
            'Cookie':`${this.theCookie}`,
            'Host':'bkjw.sxu.edu.cn',
            'Pragma':'no-cache',
            'Referer':'http://bkjw.sxu.edu.cn/xscj/Stu_MyScore_rpt.aspx',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    },(res)=>{
        var imageData='';
        console.log(res);
        console.log(`状态码: ${res.statusCode}`);
        res.setEncoding("binary");
        res.on("data",(chunk)=>{
           // console.log(chunk.toString());
            imageData+=chunk;
        });
        res.on("end",()=>{
            fs.writeFile('score.png',imageData,"binary",(err)=>{
                if(err){
                    console.log(err);
                }
            });
            console.log("OK SUCCESSFUL");
        })
    });

    req.on('err',(err)=>{
        console.log(err);
    });

    req.end();
    console.log("获取成绩数据成功");
};
//获取spider对象的属性
spider.prototype.getAttr=function(name){
  return this[name];
};
spider.prototype.getCookie=function(){
    return this.theCookie;
};
//获取指定的网页,并返回一个promise对象(传递所获得的返回值)
spider.prototype.getSWeb=function(url,needCookie){
    var data;
    if(needCookie===true) {
        request.get(url)
            .set("Cookie", this.theCookie)
            .end((err, res) => {
                data = res;
                console.log("获取指定网页成功（带Cookie）")
            })
    }else{
        request.get(url)
            .end((err,res)=>{
                data=res;
                console.log("获取指定网页成功（不带Cookie）")
            })
        }
        return new Promise((resolve,reject)=>{
            if(res.status===200){
                resolve(data);
            }
            else
            {
                console.log("获取指定网页出现了问题");
                reject(data);
            }
        })
};
//md5加密
spider.prototype.secret=function(option){
    if(option.type==="password"){
        return md5(option.id + md5(option.pwd).substring(0, 30).toUpperCase() + option.schoolNumber).substring(0, 30).toUpperCase();
    }else if(option.type==="check"){
        return md5(md5(option.checkNumber.toUpperCase()).substring(0, 30).toUpperCase() + option.schoolNumber).substring(0, 30).toUpperCase();
    }
};
module.exports=spider;