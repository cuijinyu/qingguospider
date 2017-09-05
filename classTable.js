/**
 * Created by 崔晋瑜 on 2017/9/5.
 */
let request=require("request"),
    http   =require("http"),
    fs     =require("fs"),
superagent =require("superagent"),
    cheerio=require("cheerio");
const charset = require('superagent-charset');
charset(superagent);
let messages=[];
let Cookie="";
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
    return new Promise((resolve,reject)=>{

    })
};

getMain()
    .then(()=>{
        console.log(messages);
    }).then(()=>{

    })