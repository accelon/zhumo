var {inflateSync} =require('zlib');
var {readFileSync,writeFileSync,appendFileSync} = require('fs');

const outfn='zhumo-big5.txt';

writeFileSync(outfn,'');

/*
berkeley db_dump utils
db_dump -f zhumo.dump.txt  zhumo.db
*/
const lines=readFileSync('./zhumo.dump.txt','utf8').split(/\r?\n/);
for (let i=0;i<lines.length-1;i++) {
    let line=lines[i];
    if (line[0]!==' ') continue;
    
    const arr=new Uint8Array((line.length-1 )/2);
    line=line.substr(1);
    for (let i=0;i<line.length/2;i++) {
        arr[i]= parseInt(line.substr(i*2,2),16);
    }

    var data = inflateSync(arr);

    appendFileSync(outfn,data);
}