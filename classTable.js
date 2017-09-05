/**
 * Created by 崔晋瑜 on 2017/9/5.
 */
    let request=require("request"),
        http   =require("http"),
        fs     =require("fs"),
      readline =require("readline"),
    superagent =require("superagent"),
        cheerio=require("cheerio");
    let rl=readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    const charset = require('superagent-charset');
    charset(superagent);
    let messages=[];
    let Cookie="";
    let checkNumber="";
    let j = request.jar();
    request=request.defaults({jar:j});
    let getMain=()=>{
        return new Promise((resolve,reject)=>{
            {
                superagent.get("http://bkjw.sxu.edu.cn/ZNPK/KBFB_ClassSel.aspx")
                    .charset('gbk')
                    .end(
                        (err,res)=>{
                            Cookie = res.header['set-cookie'][0].split(";")[0];
                            console.log(Cookie);
                            let $=cheerio.load(res.text);
                            let classes=$("#theXZBJ option");
                            console.log(res.text);
                            for(let i=0;i<513;i++){
                                messages.push(
                                    {
                                        value:$(classes[i]).val(),
                                        name:$(classes[i]).text()
                                    }
                                )
                            }
                            resolve();
                        }
                    )
            }
        })
    };


    let getClassTable=(Class,name)=>{
        let oldClass=Class;
        Class=Class.slice(2);
        return new Promise((resolve,reject)=>{
            let req=http.request({
                     hostname:'bkjw.sxu.edu.cn',
                     port:'80',
                     path:'/ZNPK/KBFB_ClassSel_rpt.aspx',
                     method:'POST',
                     headers:{'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                     'Accept-Encoding':'gzip, deflate',
                     'Accept-Language':'zh-CN,zh;q=0.8',
                     'Cache-Control':'no-cache',
                     'Connection':'keep-alive',
                     'Content-Length':'63',
                     'Content-Type':'application/x-www-form-urlencoded',
                     'Cookie':Cookie,
                     'Host':'bkjw.sxu.edu.cn',
                     'Origin':'http://bkjw.sxu.edu.cn',
                     'Pragma':'no-cache',
                     'Referer':'http://bkjw.sxu.edu.cn/ZNPK/KBFB_ClassSel.aspx',
                     'Upgrade-Insecure-Requests':'1',
                     'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'}
            })
          req.write({
              Sel_XNXQ:'20170',
              txtxzbj:'',
              Sel_XZBJ:oldClass,
              type:'1',
              txt_yzm:checkNumber
          })
        })
    };

    let getCheck=()=>{
        return new Promise((resolve,reject)=>{
            let req=http.request({
                hostname:'bkjw.sxu.edu.cn',
                port:'80',
                path:'/sys/ValidateCode.aspx',
                method:'GET',
                headers:{
                    'Accept':'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Encoding':'gzip, deflate',
                    'Accept-Language':'zh-CN,zh;q=0.8',
                    'Cache-Control':'no-cache',
                    'Connection':'keep-alive',
                    'Cookie':`${Cookie}`,
                    'Host':'bkjw.sxu.edu.cn',
                    'Pragma':'no-cache',
                    'Referer':'http://bkjw.sxu.edu.cn/xscj/Stu_MyScore_rpt.aspx',
                    'User-Agent':' Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
                }
            },(res)=>{
                var imageData='';
                console.log(`状态码: ${res.statusCode}`);
                res.setEncoding("binary");
                res.on("data",(chunk)=>{
                    //console.log(chunk.toString());
                    imageData+=chunk;
                });
                res.on("end",()=>{
                    fs.writeFile('checkNumber.png',imageData,"binary",(err)=>{
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
            resolve();
        })
    }

    let login=()=>{
        return new Promise((reslove,reject)=>{
            rl.question("请输入验证码",(data)=>{
                checkNumber=data;
                rl.close();
            })
            rl.on("close",()=>{
                console.log("begin to login");
                resolve();
            })
        })
    }
async function asyncSpider() {
    await getMain();
    console.log(messages);
    let cookie=request.cookie(Cookie);
    j.setCookie(cookie);
    await getCheck();
    await login();
    for(let i=0;i<513;i++){
        try{
            await getClassTable(messages[i].value,messages[i].name);
        }
        catch (err){
            console.log(err);
        }
    }
    console.log("anything has been done");
}

asyncSpider();