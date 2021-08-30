const {readFileSync,writeFileSync}=require('fs');
const lines=readFileSync('zhumo.txt','utf8').replace(/\uFEFF/g,'').trim().split(/\r?\n/);

const htmlheader=`<!DOCTYPE html><html><head><link rel='stylesheet' href='zhumo.css'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><body><htll>`
const htmlfooter=`</htll></body></html>`
const emithtml=(fn,arr)=>{
    arr.unshift(htmlheader);
    arr.push(htmlfooter);
    const content=arr.join('\n').replace(/~(\d+)~/g,'<pb n="$1"></pb>');
    // if (fn.indexOf('0.')==0)
    console.log(fn)
    writeFileSync("../"+fn,content,'utf8');
    arr.length=0;
}
const arr=[];
let paragraph='',fnseq=0;

const addParagraph=newparagraph=>{
    if (paragraph) {
        if (paragraph[0]!=='<') paragraph='<p>'+paragraph+'</p>';
        arr.push(paragraph);
    }
    paragraph=newparagraph;
}
lines.forEach(line=>{
    const sub4=line.substr(0,4);
    if (sub4=="<br>") {
        addParagraph(line.substr(4));
    } else if (sub4=='<tit'){
        addParagraph(line);
        const fn=fnseq+'.zhumo.html';
        fnseq++;
        emithtml(fn,arr);
    } else if (sub4[0]=='<') {
        addParagraph(line);      
    } else {
        paragraph+=line;
    }
})
addParagraph('');
emithtml(fnseq+'.zhumo.html',arr);
