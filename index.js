/**
 * Created by 崔晋瑜 on 2017/7/30.
 */
//所有依赖
const http  =  require("http"),
        fs  =  require("fs"),
  readline  =  require("readline"),
       url  =  require("url"),
EventEmitter=  require("events"),
   request  =  require("request"),
    spider  =  require("./spider"),
    crypto  =  require("crypto");


var rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});
function md5(text){
    return crypto.createHash('md5').update(text).digest('hex');
}
var checkNumber='';
var spiderListener  =  new EventEmitter();
var spiderForSXU=new spider();
function start(){
    spiderForSXU.init("http://bkjw.sxu.edu.cn/");
    spiderListener.emit("getWeb");
}

spiderListener.on("getWeb",function(){
    spiderForSXU.getWeb(function(){
        spiderListener.emit("getViewState");
    });
});
spiderListener.on("getCheck",function(){
    //spiderForSXU.setCookie(spiderForSXU.theCookie.split(";")[0]);
    console.log(`this is the spider's cookie :${spiderForSXU.getCookie()}`);
    spiderForSXU.getPic('http://bkjw.sxu.edu.cn/sys/ValidateCode.aspx','checkNum',
        {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Cookie':`${ spiderForSXU.getCookie()}`,
        'Host': 'bkjw.sxu.edu.cn',
        'Pragma': 'no-cache',
        'Referer': 'http://bkjw.sxu.edu.cn/_data/login.aspx',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    );
    console.log("get CheckNumber has been done");
    rl.on("line",function(check){
        checkNumber=check;
        rl.close();
    });
    rl.on("close",function(){
        console.log("Ok!");
        checkNumber=spiderForSXU.secret({
            type:'check',
            id:'',
            pwd:'',
            schoolNumber:'10108',
            checkNumber:checkNumber
        });
        console.log("您的验证码md5后是："+checkNumber);
        spiderListener.emit("login");
    });
});
spiderListener.on("getViewState",function () {
   spiderForSXU.getViewState(spiderForSXU.getCookie(),function(){
       console.log(spiderForSXU.getAttr("viewstate"));
       spiderListener.emit("getCheck");
   });
});
spiderListener.on("login",function(){
    console.log(`there is the login function`);
    spiderForSXU.login('http://bkjw.sxu.edu.cn/_data/login.aspx',{
        '__VIEWSTATE':`${spiderForSXU.getAttr('viewstate')}`,
        'pcInfo':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36undefined5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36 SN:NULL',
        'typeName':'学生',
        'dsdsdsdsdxcxdfgfg':'11368DE59D1911081FA5FA38BC1A83',
        'fgfggfdgtyuuyyuuckjg':`${checkNumber.toUpperCase()}`,
        'Sel_Type':'STU',
        'txt_asmcdefsddsd':'201601001073',
        'txt_pewerwedsdfsdff':'',
        'txt_sdertfgsadscxcadsads':'',
    },{
        hostname:'bkjw.sxu.edu.cn',
        port:80,
        path:'/_data/login.aspx',
        method:'POST',
        headers:{
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive',
            'Content-Type':'application/x-www-form-urlencoded',
            'Cookie':`${spiderForSXU.getCookie()}`,
            'Host':'bkjw.sxu.edu.cn',
            'Origin':'http://bkjw.sxu.edu.cn',
            'Pragma':'no-cache',
            'Referer':'http://bkjw.sxu.edu.cn/_data/login.aspx',
            'Upgrade-Insecure-Requests':'1',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            }
        }
    ,()=>{
        spiderListener.emit("getRealScore");
    })
});

spiderListener.on("getRealScore",function(){
    spiderForSXU.getRealScore();
    console.log("成功获取到你的原始成绩");
});

start();
