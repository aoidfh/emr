const local = true;

var T_SUGA_HSPTL;
//var T_SUGA_HSPTL_MNY;
var T_CODE_DTL;
var T_WORK_PLACE;
var T_HSPTL_INFO;
var T_HLDY;
var T_RCPT_ITEM;
var arr치매약제;
var T_DOCTOR;
// var T_DEPT_SPRT;

(async function Init() {
    console.log(`isLocal  ${local}`)
    T_CODE_DTL = await GetData('SELECT * FROM T_CODE_DTL');
    T_WORK_PLACE = await GetData('SELECT * FROM T_WORK_PLACE');
    T_HSPTL_INFO = await GetData('SELECT * FROM T_HSPTL_INFO');
    T_HLDY = await GetData('SELECT * FROM T_HLDY');
    T_RCPT_ITEM = await GetData('SELECT * FROM T_RCPT_ITEM');
    userPos = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '73'`);
    T_DOCTOR = await GetData(`SELECT * FROM T_USER WHERE FG_DUTY = '0'`);
    // T_DEPT_SPRT = await GetData(`SELECT * FROM T_DEPT_SPRT`);

    arr치매약제 = await Get치매약제처방List();
    SaveData();
    console.log('데이터 저장 완료');
    if (document.getElementById('receptionRoom') || document.getElementById('doctorRoom') || document.getElementById('storageRoom')) {        
        await Start();
    }
})();