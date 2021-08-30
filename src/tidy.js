const {readFileSync,writeFileSync}=require('fs');
const hzk2unicode=require('./hzk.js');
const sanskrit=require('./sanskrit.js');
const content=readFileSync('zhumo-utf8.txt','utf8');

const tidy=s=>{
    s=s.replace(/\r?\n/g,'\n')
    s=s.replace(/ *\n/g,'\n')
    s=s.replace(/<\/b> +/g,'</b>');
    s=s.replace("（S`Suddhodana)","（śuddhodana）");
    
    //markup errors
    s=s.replace('淨三業，歸敬我佛。</b>','淨三業，歸敬我佛。');
    s=s.replace(' <PR>講解至此，','<PR>講解至此，');
    s=s.replace(' <PR>供養','<PR>供養');
    s=s.replace('若無所得，則無攀緣。','若無所得，則無攀緣。</b>');
    s=s.replace('眾生為若此。<b>','眾生為若此。</b>');
    s=s.replace('云何行慈」？','云何行慈」？</b>');
    s=s.replace('痴冥無智者」！','痴冥無智者」！</b>');
    s=s.replace('導眾生的呢」？</b>','導眾生的呢」？');
    s=s.replace('\n厭。\n','\n厭。</b>\n');
    s=s.replace('<b>法供養品第十三<b>','<b>法供養品第十三</b>');
    s=s.replace('做為一種增上緣。</b>','做為一種增上緣。');
    s=s.replace('<@PN n="13１"/>','<@PN n="131"/>');
    s=s.replace('<@PN n=101"/>','<@PN n="101"/>');
    s=s.replace('<@<@SK>PNn="33"/><@/SK>　','<@PN n="33"/>');
    s=s.replace(/\n<PR><b>/g,'\n<b>'); //藥師經云：「第

    s=s.replace('<Z0>「人生佛教」摸象\n','<Z0>「人生佛教」摸象</Z0>');
    s=s.replace('        －－序人生佛教真義－－</Z0>','<PR>－－序人生佛教真義－－');
    s=s.replace('<GLYPH>【表5】','【表5】');

    s=s.replace(/\f/g,'');
    s=s.replace(/<@<@SK>PNn="33"\/><@\/SK>/,'<pb n="33"></pb>');
    s=s.replace(/<@HZK n="565\.7">?逸<@\/HZK>/g,'㝹');

    s=s.replace(/\n    /g,'\n<PR>');
    s=s.replace(/<@SK>([^>]+?)<@\/SK>/g,(m,sk)=>{
        const iast=sanskrit[sk];
        if (!iast) {
            console.log('mapping of @sk not found',sk);
            return '<span class="sk">'+sk+"</span>";
        }
        return iast;
    })
    s=s.replace(/\n*< ?[@＠]?PN ?n?=?"([a-z\d]+)"?\/>\n*/g,(m,m1)=>{
        return '~'+m1+'~\n';
    });

    s=s.replace(/<IMAGE n="([_\d]+?)" ?\/>/g,
        '<img src="images/$1.gif"></img>');

    s=s.replace(/<PR>/g,"<br>");

    s=s.replace(/\[國爪\]/,'爴');
    s=s.replace(/\[臣貴\]/,'(臣貴)');
    s=s.replace(/\[予肖\]/,'矟');
    s=s.replace(/\[目比\]/,'䀝');
    s=s.replace(/\[木丹\]/,'枬');
    s=s.replace(/\[夌\+斿\-方\]/g,'(夌+斿-方)');
    s=s.replace(/<@HZK n="([\d\.]+)"?>?.+?<@\/HZK>/g,(m,hzk)=>{
        const uni=hzk2unicode[hzk];
        if (!uni) {
            console.log('mapping of hzk',hzk,'not found')
            return '<span class="hzk">'+hzk+'</span>';
        }
        return uni;
    })

    s=s.replace(/\n<b>([^<]+?)<\/b>\n/g,'\n<p class="quote">$1</p>\n');
    s=s.replace(/\n<b>([^<]+?)<\/b><\/p>\n/g,'\n<p class="quote">$1</p>\n');
    s=s.replace(/\n<b>([^<]+?)<\/b>~(\d+)~\n/g,'\n<p class="quote">$1~$2~</p>\n');

    s=s.replace(/<Z([\dA-Z]+)>/g,(m,depth)=>{
        return "<h"+(1+parseInt(depth,36))+">";
    })
    s=s.replace(/<\/Z([\dA-Z]+)>\n*/g,(m,depth)=>{
        return "</h"+(1+parseInt(depth,36))+">\n";
    })


    s=s.replace(/<TW>(.+?)<\/TW>/,'<p class="cname">$1</p>')
    s=s.replace(/<EN>(.+?)<\/EN>/,'<p class="ename">$1</p>')
    s=s.replace(/<AUTHOR>(.+?)<\/AUTHOR>/g,'<p class="author">$1</p>')
    s=s.replace(/<COPYRIGHT>(.+?)<\/COPYRIGHT>/g,'<p class="copyright">$1</p>')
    s=s.replace(/<EDITION>(.+?)<\/EDITION>/g,'<p class="edition">$1</p>')
    s=s.replace(/<BK>(.+?)<\/BK>/g,'<title>$1</title>')
    s=s.replace(/(<\/h\d+>)\n([^<~])/g,'$1\n<br>$2');
    return s;
}

writeFileSync('zhumo.txt',tidy(content),'utf8');

