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
    Class=Class.slice(2);
    return new Promise((resolve,reject)=>{
        request({url:``, jar: j},()=>{

        })
    })
};

let getCheck=()=>{
    return new Promise((resolve,reject)=>{
        request({url:"http://bkjw.sxu.edu.cn/sys/ValidateCode.aspx",jar:j},(err,res,body)=>{
            fs.writeFile('checkNumber.png',body,"binary",(err)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
            });
            rl.question("请输入验证码",(data)=>{
                checkNumber=data;
            });
            rl.on("close",()=>{
                console.log("验证码输入成功");
                resolve();
            })
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