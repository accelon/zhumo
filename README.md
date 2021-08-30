# zhumo
竺摩法師全集

## porting from Accelon 1
    //zhumo.db from accelon1
    db_dump -f zhumo.dump.txt  zhumo.db

    //convert berkeley db dump to big5 text file
    node bdb2txt

    //save zhumo-big5.txt to utf8 format and save as
    // zhumo-utf8.txt

    node tidy.js //output zhumo.txt, add to github

## convert br to p and split into smaller html

   node tohtml.js
