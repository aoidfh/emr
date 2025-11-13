//#region 삭제되야할 클레스
const 처방등록구분Enum = {
    FG00처방코드: 0,
    FG01자동코드: 1,
    FG02자동변경: 2,
    FG03자동연결: 3,
    FG04픽업처방: 4,
    FG06필요처방: 6,
    FG07처방메모: 7
};
class T_DEPT_SPRT {
    constructor() {
        this.CD_DEPT_SPRT = "";
        this.CD_DEPT_GRP = "";
        this.NM_DEPT_SPRT = "";
        this.BL_USE = false;
        this.DC_REMARK = "";
        this.ID_UPDT = "";
        this.DT_UPDT = null; // JavaScript에서는 일반적으로 null로 표현됩니다.
        this.ID_USER_MSTR = "";
        this.CD_TREAT_SBJT = "";
        this.BL_AUTH_LOCK_CHART_APP = false;
        this.NO_ORDER = 0;
        this.NM_ALIAS = "";
    }
}

class T_USER {
    constructor() {
        this.ID_USER = '';
        this.PW_USER_ENC = null;
        this.NM_USER = '';
        this.NM_USER_ENG = '';
        this.CD_DEPT_SPRT = '';
        this.FG_DUTY = 0;
        this.FG_PSITN = 0;
        this.FG_AUTH = 0;
        this.FG_WORK_TYPE = 0;
        this.DS_WORK_JOIN = '';
        this.DS_WORK_LEAVE = '';
        this.NO_LCNSE = '';
        this.NO_LCNSE_SPCL = '';
        this.DS_BIRTH = '';
        this.BL_BIRTH_LUNAR = false;
        this.NO_ZIP = '';
        this.DC_ADDR = '';
        this.DC_ADDR_DTL = '';
        this.NO_TEL = '';
        this.NO_MOBILE = '';
        this.EMAIL_USER = '';
        this.DC_REMARK = '';
        this.DT_LAST_LOGON = null;
        this.DT_LAST_LOGOUT = null;
        this.IP_PC = '';
        this.NO_BIZ_ENC = null;
        this.IMG_SIGN = null;
        this.NO_TEL_HSPTL = '';
        this.BL_ONCALL = false;
        this.BL_VSTN_DOCT = false;
        this.DS_PW_CHANGE = '';
        this.ID_RGST = '';
        this.DT_RGST = fmtTodaySec;
        this.ID_UPDT = '';
        this.DT_UPDT = fmtTodaySec;
        this.BL_CHUNA = false;
    }
}


class T_HSPTL_INFO_INS {
    constructor() {
        this.DS_APLY = '';                      //적용일자
        this.TS_TREAT_WKD_START = '';           //진료시간평일시작
        this.TS_TREAT_WKD_END = '';             //진료시간평일마감
        this.TS_TREAT_WKE_START = '';           //진료시간주말시작
        this.TS_TREAT_WKE_END = '';             //진료시간주말마감
        this.RT_ADTN_NHIS_ISRC = 0;             //보험종별가산율
        this.RT_ADTN_MC_ISRC = 0;               //급여종별가산율
        this.RT_ADTN_MOTR_ISRC = 0;             //자보종별가산율
        this.RT_ADTN_IAI_ISRC = 0;              //산재
        this.RT_ADTN_INJRY_DUTY = 0;            //공상
        this.MNY_FIXED_AMT_STNDRD = 0;          //보험정액기준금액
        this.MNY_FIXED_AMT_STNDRD_PRSCRPTN = 0; //보험정액기준금액_처방전
        this.MNY_FIXED_AMT = 0;                 //보험정액요금
        this.MNY_FIXED_AMT_PRSCRPTN = 0;        //보험정액요금_처방전
        this.MNY_FIXED_AMT_OLDMN = 0;           //보험정액요금노인
        this.MNY_FIXED_AMT_OLDMN_PRSCRPTN = 0;  //보험정액요금노인_처방전
        this.DC_STNDRD_AGE_OLDMN = 0;           //보험노인기준나이
        this.RT_SLFPAY_OUTPTNT = 0;             //보험외래본인부담율
        this.RT_SLFPAY_INPTNT = 0;              //보험입원본인부담율
        this.MNY_SLFPAY_MC_ISRC1 = 0;           //급여1종본인부담금
        this.MNY_SLFPAY_MC_ISRC2 = 0;           //급여2종본인부담금
        this.MNY_SLFPAY_MC_ISRC2_PRSCRPTN = 0;  //급여2종본인부담금_처방전
        this.MNY_SLFPAY_MC_ISRC2_DSPERSN = 0;   //급여2종장애기금부담액
        this.RT_SLFPAY_MC_ISRC1 = 0;            //급여1종본인부담율
        this.RT_SLFPAY_MC_ISRC2 = 0;            //급여2종본인부담율
        this.RT_SLFPAY_NPG = 0;                 //차상위본인부담율
        this.RT_SLFPAY_ADTN_DIET = 0;           //가산식대본인부담율
        this.RT_ADTN_CT_NHIS_ISRC = 0;          //보험CT가산율
        this.RT_ADTN_CT_MC_ISRC = 0;            //급여CT가산율
        this.RT_ADTN_CT_MOTR_ISRC = 0;          //자보CT가산율
        this.RT_ADTN_CT_IAI_ISRC = 0;           //산재CT가산율
        this.TY_PSYC_GRAD = 0;                  //정신과_등급
        this.CD_PSYC_INPTNT = '';               //정신과_입원수가코드
        this.CD_PSYC_SLEP_OUT = '';             //정신과_외박수가코드
        this.CD_PSYC_DAY_WARD = '';             //정신과_낮병둥수가코드
        this.TS_OPEN_MON = '';                  //월
        this.TS_OPEN_TUE = '';                  //화
        this.TS_OPEN_WED = '';                  //수
        this.TS_OPEN_THU = '';                  //목
        this.TS_OPEN_FRI = '';                  //금
        this.TS_OPEN_SAT = '';                  //토
        this.MNY_SLFPAY_UPL = 0;                //본인부담상한액
        this.MNY_UNIT = 0;                      //상대가치점수별단가
    }
}
class T_HSPTL_INFO {
    constructor() {
        this.ID_HSPTL_INFO = 0;
        this.NM_HSPTL_INFO = '';
        this.VL_HSPTL_INFO = '';
        this.FG_HSPTL_INFO = '';
        this.DC_HSPTL_INFO = '';
    }
}
class T_APPNTMNT {
    letructor() {
        this.ID_APPNTMNT = 0;
        this.CD_CHART = '';
        this.NM_CHART = '';
        this.TY_APPNTMNT = '';
        this.DT_START = new Date();
        this.DT_END = new Date();
        this.DC_APPNTMNT = '';
        this.TY_STAT = '';
        this.CD_DEPT_SPRT = '';
        this.NO_TEL = '';
        this.NO_MOBILE = '';
        this.BL_DEL = false;
        this.NO_DEPT = 0;
    }
}
class T_TREAT {
    letructor() {
        this.ID_TREAT = 0;
        this.ID_ACCEPTIN = 0;
        this.TY_ACCEPT = 0;
        this.FG_PRSCRPTN = 0;
        this.NO_ACCEPT = "";
        this.DS_TREAT = "";
        this.CD_CHART = "";
        this.NO_TREAT = 0;
        this.NO_TREAT_TY = 0;
        this.DS_PRSCRPTN = "";
        this.NO_PRSCRPTN_ORDER = 0;
        this.CD_PRSCRPTN = "";
        this.CD_CHRG = "";
        this.NM_PRSCRPTN = "";
        this.AMT_DOSAGE_1TH = 0;
        this.CNT_DOSAGE = 0;
        this.CNT_DOSAGE_DAYS = 0;
        this.CD_USAGE = "";
        this.FG_OUTSIDE = false;
        this.FG_EXCPTN = "";
        this.TY_PAY_APLY = "";
        this.MNY_UNPRC = 0;
        this.MNY_UNPRC_ISRC = 0;
        this.MNY_UNPRC_CMMN = 0;
        this.MNY_USE_PRMTN = 0;
        this.DS_APLY = "";
        this.FG_ITEM = "";
        this.FG_CHRG_CODE = 0;
        this.FG_ACTN = 0;
        this.CD_PRMRY_INGRDNT = "";
        this.CD_SPCL = "";
        this.SGN_DOCTOR = "";
        this.DT_SGN_DOCTOR = null;
        this.CD_DEPT_SPRT = "";
        this.FG_SPRT_STAT = 0;
        this.ID_CNFM = "";
        this.DT_CNFM = null;
        this.CD_NGHT_ADD = "";
        this.FG_CNSGN = "";
        this.ID_ANSTS_DOCT = "";
        this.FG_TREAT_REG = 0;
        this.FG_UPDT = 0;
        this.FG_RCPT = 0;
        this.FG_AGGRGT = 0;
        this.ID_RGST = "";
        this.DT_RGST = null;
        this.ID_UPDT = "";
        this.DT_UPDT = null;
        this.BL_DUR_CHCKUP = false;
        this.FG_PICKUP_STAT = 0;
        this.ID_TREAT_PICKUP = 0;
        this.ID_TREAT_DC = 0;
        this.FG_DC_STAT = 0;
        this.NO_DC = 0;
        this.BL_POUDER = false;
        this.BL_PORTABLE = false;
        this.DC_TREAT_MEMO = "";
        this.TY_EMGNCY_TRANS = 0;
        this.ID_MIXER = 0;
        this.TY_EMGNCY_TREAT = 0;
        this.TY_SRGRY_TREAT = false;
        this.DC_DEPT_MEMO = "";
        this.CD_CNNCT = "";
        this.DS_PRN_DSPLY = "";
        this.BL_RCPT = false;
        this.ID_CNSLT = 0;
        this.ID_CNSGN_ORG = 0;
        this.FG_EXAM = 0;
    }
}
//#endregion

class OutpatientReception {
    letructor(차트번호, 환자이름, 나이, 접수날짜, 접수시간, 진료실, 진료상태, 전달사항, 주치의, 진료구분1, 진료구분2,
        진료구분3, 수납할인, 보험유형, 보험구분, 특정기호, 산정특례본인부담률, 의약분업예외구분, 의료급여본인부담구분코드,
        선택의료기관예외사유, 의료기관기호, 오늘진료받은횟수, 진료실메모1, 진료실메모2, 진료실메모3, 진료실메모4, 진료실메모5, 진료실메모6, 개인정보동의, 본인부담산정식, 수납할금액
    ) {
        this.차트번호 = 차트번호;
        this.환자이름 = 환자이름;
        this.나이 = 나이;
        this.접수날짜 = 접수날짜;
        this.접수시간 = 접수시간;
        this.진료실 = 진료실;
        this.진료상태 = 진료상태;
        this.전달사항 = 전달사항;
        this.주치의 = 주치의;
        this.진료구분1 = 진료구분1;
        this.진료구분2 = 진료구분2;
        this.진료구분3 = 진료구분3;
        this.수납할인 = 수납할인;
        this.보험유형 = 보험유형;
        this.보험구분 = 보험구분;
        this.특정기호 = 특정기호;
        this.산정특례본인부담률 = 산정특례본인부담률;
        this.의약분업예외구분 = 의약분업예외구분;
        this.의료급여본인부담구분코드 = 의료급여본인부담구분코드;
        this.선택의료기관예외사유 = 선택의료기관예외사유;
        this.의료기관기호 = 의료기관기호;
        this.오늘진료받은횟수 = 오늘진료받은횟수;
        this.진료실메모1 = 진료실메모1;
        this.진료실메모2 = 진료실메모2;
        this.진료실메모3 = 진료실메모3;
        this.진료실메모4 = 진료실메모4;
        this.진료실메모5 = 진료실메모5;
        this.진료실메모6 = 진료실메모6;
        this.개인정보동의 = 개인정보동의;
        this.본인부담산정식 = 본인부담산정식;
        this.수납할금액 = 수납할금액;
    }
}

popupList = [
    document.getElementById('patientInquiryPopup'),
    document.getElementById('waitingPatientInfoPopup'),
    document.getElementById('memoPopup'),
    document.getElementById('introducerPopup'),
    document.getElementById('insuranceTypePopup'),
    document.getElementById('insuranceHistoryPopup'),
    document.getElementById('specificSymbolPopup'),
    document.getElementById('dementiaResultPopup'),
    document.getElementById('symbolSearchPopup'),
    document.getElementById('menuPatientInquiryPopup'),
    document.getElementById('medicalBenefitCheckPopup'), //10
    document.getElementById('monthReceiptPopup'),
    document.getElementById('yearReceiptPopup'),
    document.getElementById('deadlineMgrPopup'),
    document.getElementById('prescriptionPopup'),
    document.getElementById('businessPopup'),
    document.getElementById('patientTypePopup'),
    document.getElementById('scanPopup'),
    document.getElementById('yearCalculatePopup'),
    document.getElementById('pageType1Popup'),
    document.getElementById('pageType2Popup'),//20
    document.getElementById('diagnosisMoneyCheckPopup'),
    document.getElementById('chartCheckPopup'),
    document.getElementById('storageInstructionsPopup'),
    document.getElementById('recipeCodeSearchPopup'),
    document.getElementById('recipeReservationPopup'),
    document.getElementById('diseaseCodePopup'),
    document.getElementById('settingPopup'),
    document.getElementById('hospitalMGRPopup'),
    document.getElementById('basicInfoPopup'),
    document.getElementById('printPopup'),
]

const managerPassword = 'limfactory0613!';

let query = [];
//환자조회
var temp;
var idx;
var tempfilteredData;
var insuranceClassificationList;

//환자검색
let introducerPopupOn = new Boolean(false);

//메모
var memoIdx;

//보험이력리스트
let tempPatientInfo;
let testInsuranceHistoryList;

//특정기호
let isInsuranceInfo;
let insuranceType;

//selectOpitonList
var popSymbolSelOptionList;//특정기호리스트
var popTeductibleRateOpList;//산정특례본인부담률
var popICompOpList;//보험회사리스트
var popExceptionOpList1;//의약분업예외구분
var popCodeOpList;//의료급여본인부담구분코드
var popExceptionOpList2;//선택의료기관예외사유
var popSignOpList;//의료기관기호

//메뉴환자조회
var todayDiagnosisCnt = 0;

//수납지시
let diagnosisType;
let money;
let curMoney;
let myFormula;

let condeInput;
let isCode;
let recipeCodeList;
let recipeCheckboxs = [document.getElementById('recipeCode'),
document.getElementById('recipeName')];

let diseaseCheckboxs = [document.getElementById('diseaseCode'),
document.getElementById('diseaseName')];

let popBeforeAccept;
let t_chart;

let nowMonth = new Date();
let openTime;
let closeTime;
let settingTime;
let targetDay;

let codeScroll = document.getElementById("recipeCodeSearch");
let recipeTarget;

let tempInsurance = [];

let hospitalMGRBtns = [document.getElementById('hospitalMGRBtn-1'),
document.getElementById('hospitalMGRBtn-2'),
document.getElementById('hospitalMGRBtn-3')];

let insuranceTableLists = [document.getElementById('InsuranceList'),
document.getElementById('InsuranceList1'),
document.getElementById('InsuranceList2'),
document.getElementById('InsuranceList3'),
document.getElementById('InsuranceList4'),
document.getElementById('InsuranceList5'),
document.getElementById('InsuranceList6'),
document.getElementById('InsuranceList7'),
document.getElementById('InsuranceList8'),
document.getElementById('InsuranceList9')];

let radiologyBtns = [document.getElementById('radiologyBtn1'),
document.getElementById('radiologyBtn2'),
document.getElementById('radiologyBtn3'),
document.getElementById('radiologyBtn4'),
document.getElementById('radiologyBtn5'),
document.getElementById('radiologyBtn6'),
]

let insuranceInputList = [];
var insuranceIDIdx = 1;
var insuranceDelDay = 0;
let userDept;
let userPosition;
let user;
let department;
let isNew사용자 = false;
let isNew부서 = false;
let fakePassword = "qlqjsrkWk#!##";
let authorityBtns;
let authorityCheckboxes;
let t_USER_AUTH;

var searchResult;
var offset = 0;
var limitCnt = 100;
var limit = limitCnt;
var scrollCnt = 1;
var loadCnt = 0;

let t_HSPTL_INFO_INS;

var basicInfoRoom = false;

(function Start() {
    SetDay();
    var title = '';

    try {
        popIdx = window.opener.popupIdx;
    } catch (error) { }

    //popIdx = 24;
    console.log(popIdx);

    for (let i = 0; i < popupList.length; i++) {
        popupList[i].style.display = 'none';
    }

    popupList[popIdx].style.display = 'block';

    switch (popIdx) {
        case 0:  //환자조회
            title = '환자조회';
            tempfilteredData = window.opener.chartList;
            document.getElementById('inputPatientInfo').value = window.opener.inputStr == undefined ? "" : window.opener.inputStr;
            insuranceClassificationList = window.opener.insuranceClassificationList;

            if (document.getElementById('inputPatientInfo').value != '') {
                PatientTableListCreate(tempfilteredData);
            }
            break;
        case 1:  //접수정보
            title = '접수정보';

            popSymbolSelOptionList = window.opener.popSymbolSelOptionList;//특정기호리스트
            popTeductibleRateOpList = window.opener.popTeductibleRateOpList;//산정특례본인부담률
            popICompOpList = window.opener.popICompOpList; //보험회사리스트
            popExceptionOpList1 = window.opener.popExceptionOpList1; //의약분업예외구분
            popCodeOpList = window.opener.popCodeOpList; //의료급여본인부담구분코드
            popExceptionOpList2 = window.opener.popExceptionOpList2; //선택의료기관예외사유
            popSignOpList = window.opener.popSignOpList; //의료기관기호

            selectOptionCreate();

            todayDiagnosisCnt = window.opener.todayDiagnosisCnt;

            //값 뿌리기
            var name = 'outpatientReception' + window.opener.chartIdx;
            var patientInfo = JSON.parse(localStorage.getItem(name));

            try {
                for (let i = 0; i < patientInfo.diagnosisList.length; i++) {
                    if (patientInfo.diagnosisList[i].접수날짜 == new Date().toISOString().substring(0, 10)) {
                        if (patientInfo.diagnosisList[i].오늘진료받은횟수 == todayDiagnosisCnt) {
                            document.getElementById('waitingPatientInfoName').innerHTML = patientInfo.diagnosisList[i].환자이름 + "(" + patientInfo.diagnosisList[0].차트번호 + ")";
                            document.getElementById('waitingPatientInfoDate').value = patientInfo.diagnosisList[i].접수날짜;
                            document.getElementById('waitingPatientInfoDoctorOffice').value = patientInfo.diagnosisList[i].진료실;
                            document.getElementById('waitingPatientInfoDoctor').value = patientInfo.diagnosisList[i].주치의;
                            document.getElementById('waitingPatientInfoDivision1').value = patientInfo.diagnosisList[i].진료구분1;
                            document.getElementById('waitingPatientInfoDivision2').value = patientInfo.diagnosisList[i].진료구분2;
                            document.getElementById('waitingPatientInfoDivision3').value = patientInfo.diagnosisList[i].진료구분3;
                            document.getElementById('waitingPatientInfoDiscount').value = patientInfo.diagnosisList[i].수납할인;
                            document.getElementById('waitingPatientInfoCategory').value = patientInfo.diagnosisList[i].보험유형;
                            document.getElementById('waitingPatientInfoInsuranceClassification').value = patientInfo.diagnosisList[i].보험구분;
                            document.getElementById('waitingPatientInfoSpecificSymbol').value = patientInfo.diagnosisList[i].특정기호;
                            document.getElementById('waitingPatientInfoBurdenRate').value = patientInfo.diagnosisList[i].산정특례본인부담률;
                            document.getElementById('waitingPatientInfoClassificationOfExceptions').value = patientInfo.diagnosisList[i].의약분업예외구분;
                            document.getElementById('waitingPatientInfoCode').value = patientInfo.diagnosisList[i].의료급여본인부담구분코드;
                            document.getElementById('waitingPatientInfoReasonForException').value = patientInfo.diagnosisList[i].선택의료기관예외사유;
                            document.getElementById('waitingPatientInfoSign').value = patientInfo.diagnosisList[i].의료기관기호;
                            document.getElementById('currentTimePopup').value = patientInfo.diagnosisList[i].접수시간;
                            break;
                        }
                    }
                }
            } catch (error) {
                PopupClose();
            }
            break;
        case 2:  //메모
            title = '메모';

            memoIdx = window.opener.memoIdx;
            var id;
            switch (memoIdx) {
                case 0:
                    id = "totalMemo";
                    break;
                case 1:
                    id = "officeMemo";
                    break;
                case 2:
                    id = "receptionMemo";
                    break;
                case 3:
                    id = "storageMemo";
                    break;
                case 4:
                    id = "previousAdmissionMemo";
                    break;
            }

            document.getElementById('memoGroupbox2').value = window.opener.document.getElementById(id).value;
            break;
        case 3:  //소개정보
            title = '소개정보';
            document.getElementById('introducerChartNum').value = window.opener.document.getElementById('chartNum').value;
            document.getElementById('introducerPatientName').value = window.opener.document.getElementById('patientName').value;
            break;
        case 4:  //보험유형변경
            title = '보험유형변경';
            break;
        case 5:  //보험이력
            title = '보험이력';

            tempPatientInfo = window.opener.temp;
            insuranceType = window.opener.insuranceType;
            console.log(insuranceType);
            document.getElementById('insuranceHistoryPopup').style.display = 'block';
            document.getElementById('insuranceHistoryChartNum').value = tempPatientInfo.차트번호;
            document.getElementById('insuranceHistoryPatientName').value = tempPatientInfo.환자이름;
            document.getElementById('insuranceHistoryJuminNumber').value = tempPatientInfo.주민번호앞 + tempPatientInfo.주민번호뒤;
            var juminF = tempPatientInfo.주민번호뒤.substring(0, 1);
            document.getElementById('insuranceHistoryAge').value = AgeCalculation(tempPatientInfo.주민번호앞, juminF);

            var tempList = document.getElementById('insuranceHistoryList');
            var idx = tempList.rows.length;
            for (let i = 0; i < idx; i++) {
                tempList.deleteRow(tempList.rows.length - 1);
            }

            for (let i = 0; i < 4; i++) {
                var html = '';
                html += '<tr id="testInsuranceHistoryList' + (i + 1) + '" onclick="PatientInsuranceHistoryTableBtn(this);">';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + testInsuranceHistoryList[i][0] + '</td>';
                html += '<td>' + testInsuranceHistoryList[i][1] + '</td>';
                html += '<td>' + testInsuranceHistoryList[i][2] + '</td>';
                html += '<td>' + testInsuranceHistoryList[i][3] + '</td>';
                html += '<td>' + testInsuranceHistoryList[i][4] + '</td>';
                html += '<td><button style="width:100%;" onclick="InsuranceHistoryListBtn(' + i + ');">선택</button></td>';
                html += '</tr>';

                $("#insuranceHistoryList").append(html);
            }

            document.getElementById('insuranceHistoryEffectiveDate').value = tempPatientInfo.보험자격취득일;
            document.getElementById('insuranceHistoryInsuranceClassification').value = tempPatientInfo.보험유형;
            document.getElementById('insuranceHistoryEffectiveDate').value = testInsuranceHistoryList[0][0];

            if (tempPatientInfo.피보험자 != "") {
                document.getElementById('insuranceHistoryInsuredPerson').value = tempPatientInfo.피보험자;
                document.getElementById('insuranceHistoryJeungNumber').value = tempPatientInfo.증번호;
                document.getElementById('insuranceHistoryCombinationSymbol').value = tempPatientInfo.조합기호;
                document.getElementById('insuranceHistoryCombinationName').value = tempPatientInfo.조합명칭;
            }
            break;
        case 6:  //특정기호
            title = '특정기호';

            isInsuranceInfo = window.opener.isInsuranceInfo;
            insuranceType = window.opener.insuranceType;

            popSymbolSelOptionList = window.opener.symbolSelOptionList;
            popTeductibleRateOpList = window.opener.burdenrateList;

            RefreshTable('specificSymbolList');

            for (let i = 0; i < popSymbolSelOptionList.length; i++) {
                var html = '';
                html += '<tr onclick="SpecificSymbolListBtn(' + popSymbolSelOptionList[i].CD_CODE_DTL + ', this);">';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + popSymbolSelOptionList[i].CD_CODE_DTL + '</td>';
                html += '<td>' + popSymbolSelOptionList[i].NM_CODE_DTL + '</td>';
                var value = popTeductibleRateOpList.find(t => t.CD_CODE_DTL == popSymbolSelOptionList[i].FG_CODE_DTL);
                html += '<td>' + value.NM_CODE_DTL + '</td>';
                html += '</tr>';
                $("#specificSymbolList").append(html);
            }
            break;
        case 7:  //치매검사결과
            title = 치매검사결과;
            break;
        case 8:  //기호검색
            title = '기호검색';
            insuranceType = window.opener.insuranceType;
            popICompOpList = window.opener.popICompOpList;
            for (let i = 0; i < popICompOpList.length; i++) {
                var html = '';
                html += '<tr onclick="InsuranceCompanyList(' + i + ', this);">';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + popICompOpList[i][0] + '</td>';
                html += '<td>' + popICompOpList[i][1] + '</td>';
                html += '</tr>';
                $("#insuranceCompanyList").append(html);
            }
            break;
        case 9:  //메뉴환자조회
            title = '환자검색';
            break;
        case 10: //의료급여 승인내역 조회
            title = '의료급여 승인내역 조회';
            break;
        case 11: //월별 수납현황
            title = '월별 수납현황';
            break;
        case 12: //월별 수납현황
            title = '월별 수납현황';
            break;
        case 13: //마감관리
            title = '마감관리';
            break;
        case 14: //처방전 발급대장
            title = '처방전 발급대장';
            break;
        case 15: //보험(사업장)기호관리
            title = '보험(사업장)기호관리';
            break;
        case 16: //환자유형관리
            title = '환자유형관리';
            break;
        case 17: //스캔
            title = '스캔';
            break;
        case 18: //연말정산 자료생성
            title = '연말정산 자료생성';
            break;
        case 19: //메뉴페이지타입1
            idx = window.opener.pageIdx;
            switch (idx) {
                case 0:
                    title = '진단서';
                    break;
                case 1:
                    title = '진단서(영문)';
                    break;
                case 2:
                    title = '소견서';
                    break;
                case 3:
                    title = '의사소견서';
                    break;
                case 4:
                    title = '진료확인서';
                    break;
                case 5:
                    title = '진료확인서(영문)';
                    break;
                case 6:
                    title = '통원확인서';
                    break;
                case 7:
                    title = '치료확인서';
                    break;
                case 8:
                    title = '의료급여의뢰서';
                    break;
                case 9:
                    title = '의료급여의뢰서(선택)';
                    break;
                case 10:
                    title = '진료의뢰서';
                    break;
                case 11:
                    title = '진료회신서';
                    break;
                case 12:
                    title = '장해진단서';
                    break;
                case 13:
                    title = '장애진단서';
                    break;
                case 14:
                    title = '후유장해진단서';
                    break;
                case 15:
                    title = '병무용진단서';
                    break;
                case 16:
                    title = '상해진단서';
                    break;
                case 17:
                    title = '근로능력평가용진단서';
                    break;
                case 18:
                    title = '장애인증명서';
                    break;
                case 19:
                    title = '요양급여의뢰서';
                    break;
                case 20:
                    title = '여양급여회송서';
                    break;
                case 21:
                    title = '건강진단서(보건증)';
                    break;
                case 22:
                    title = '진료의무기록사본표지출력';
                    break;
                case 23:
                    title = '보장구검수확인서';
                    break;
                case 24:
                    title = '당뇨병환자 소모성 재료 처방전(공단)';
                    break;
                case 25:
                    title = '협진기록지';
                    break;
                case 26:
                    title = '전과기록지';
                    break;
                case 27:
                    title = '전동기록지';
                    break;
                case 28:
                    title = 'Operative Record';
                    break;
                case 29:
                    title = '영상판독기록지';
                    break;
            }
            break;
        case 20: //메뉴페이지타입2
            console.log(window.opener.pageIdx);
            idx = window.opener.pageIdx;
            switch (idx) {
                case 0:
                    title = '초기영양평가결과보고지';
                    break;
                case 1:
                    title = '영양상담의뢰지';
                    break;
                case 2:
                    title = '영양상담기록지';
                    break;
                case 3:
                    title = '시술 및 검사 동의서';
                    break;
                case 4:
                    title = '개인정보 수집 및 활용 동의서';
                    break;
            }
            break;
        case 21: //진료비납입확인서
            title = '진료비납입확인서';

            var chart = window.opener.t_CHART;
            if (chart != undefined) {
                Refresh진료납입확인서(chart);
            }
            break;
        case 22: //차트기록조회
            title = '차트기록조회';
            break;
        case 23: //수납지시
            document.getElementById('acceptTextarea').value = window.opener.txt본인부담산정식;
            document.getElementById('acceptInput1').value = window.opener.txt수납지시금액;
            document.getElementById('acceptInput2').checked = window.opener.chk전액할인;
            document.getElementById('acceptInput3').value = window.opener.txt수납할금액;
            document.getElementById('acceptInput4').value = window.opener.txt할인금액;
            document.getElementById('acceptInput5').value = window.opener.txt환자본인부담금;
            document.getElementById('acceptInput6').value = window.opener.txt이미수납한금액;
            break;
        case 24: //처방코드검색
            title = '처방코드검색';
            document.getElementById('popup').innerHTML = title;
            try {
                condeInput = window.opener.codeInput;
                isCode = window.opener.isCode;
                isAdd = window.opener.isAdd;
                recipeCodeList = window.opener.recipeCodeList;
                popBeforeAccept = window.opener.beforeAccept;
                console.log(popBeforeAccept);
                searchResult = window.opener.searchResult;
            } catch (error) { }

            if (isCode) {
                document.getElementById('recipeCode').checked = true;
            }
            else {
                document.getElementById('recipeName').checked = true;
            }

            document.getElementById('recipeCodeInput').value = condeInput;
            limit = limitCnt;
            RecipeCodeSearch(condeInput);
            break;
        case 25: //진료접수예약
            title = '예약';
            document.getElementById('popup').innerHTML = title;
            t_chart = window.opener.t_CHART;
            InitReservationInfo(t_chart);
            break;
        case 26: //상병코드검색
            title = '상병코드검색';
            document.getElementById('popup').innerHTML = title;
            condeInput = window.opener.diseaseCodeInput;
            popBeforeAccept = window.opener.beforeAccept;
            console.log(popBeforeAccept);
            isCode = window.opener.isCode;

            if (isCode) {
                document.getElementById('diseaseCode').checked = true;
            }
            else {
                document.getElementById('diseaseName').checked = true;
            }

            document.getElementById('diseaseCodeInput').value = condeInput;
            DiseaseCodeSearch(condeInput);
            break;
        case 27: //환경설정
            title = '환경설정';
            var officeIdx = window.opener.officeIdx;

            var idarry;

            switch (officeIdx) {
                case 1:
                    idarry = localStorage.getItem('checkOnFavorites1');
                    break;
                case 2:
                    idarry = localStorage.getItem('checkOnFavorites2');
                    break;
                case 3:
                    idarry = localStorage.getItem('checkOnFavorites3');
                    break;
            }

            var id = JSON.parse(idarry);
            if (id !== null) {
                for (let i = 0; i < id.length; i++) {
                    var checkbox = document.getElementById(id[i]);
                    checkbox.checked = true;
                }
            }

            CreateNoteType();

            break;
        case 28: //병원관리
            title = '병원관리';
            HospitalMGRInit();
            hospitalMGRBtnOnOff(0);
            InsuranceTableInit();
            DeptInit();
            SelectDisabled(document.getElementById('posInput3'), true);
            document.getElementById('posInput8').checked = true;
            AuthoritySettingInit();
            break;
        case 29: //기초정보
            title = '기초정보';
            basicInfoRoom = true;
            Init기초정보();
            break;
        case 30: //출력
            title = '출력';
            Print(window.opener.printList);
            // document.getElementById('print') = tdList;
            break;
    }

    document.getElementById('popup').innerHTML = title;
})();

// #region 환자조회
//환자기본정보 - 환자조회 리스트 만들기
async function PatientTableListCreate(filteredData) {
    RefreshTable('patientInfoList');

    if (filteredData == undefined || filteredData == '') {
        alert("환자 정보가 없습니다.");
        return;
    }

    try {
        for (let i = 0; i < filteredData.length; i++) {
            var acc = await GetData(`SELECT *
            FROM T_ACCEPT
            WHERE CD_CHART = '${filteredData[i].CD_CHART}' AND TY_TREAT_STAT != '${진료상태Enum.TY00취소}'
            ORDER BY DS_TREAT DESC LIMIT 1`);

            var html = '';
            html += '<tr onclick="TableClick(this);">';
            html += `<td>${i + 1}</td>`;
            html += '<td>' + filteredData[i].CD_CHART + '</td>';
            html += '<td>' + filteredData[i].NM_CHART + '</td>';

            jumin = ConvertInt(filteredData[i].NO_JUMIN_ENC.data);
            juminF = jumin.toString().slice(0, 6);
            juminB = jumin.toString().slice(6, 7);
            html += '<td>' + juminF + '-' + juminB + '</td>';

            html += '<td>' + FmtTodayDay(acc.length == 0 ? undefined : acc[0].DT_RGST) + '</td>';
            html += `<td>${await GetManager(acc.length == 0 ? undefined : acc[0].ID_DOCT)}</td>`;
            html += `<td></td>`;
            html += `<td>${GetInsurance(acc.length == 0 ? undefined : acc[0])}</td>`;
            html += '</tr>';

            $("#patientInfoList").append(html);;
        }
    }
    catch (error) {
        console.log(error);
    }
}
// #endregion
// #region 접수정보
//대기환자 - 접수정보 변경 저장
function WaitingPatientInfoChangeSave() {
    var name = "";
    name = 'outpatientReception' + window.opener.chartIdx;
    var patientInfo = JSON.parse(localStorage.getItem(name));

    var doctorOfficeIdx = document.getElementById('waitingPatientInfoDoctorOffice').selectedIndex;

    for (let i = 0; i < patientInfo.diagnosisList.length; i++) {
        if (patientInfo.diagnosisList[i].접수날짜 == new Date().toISOString().substring(0, 10)) {
            if (patientInfo.diagnosisList[i].오늘진료받은횟수 == todayDiagnosisCnt) {
                var outpatientReception = new OutpatientReception(
                    patientInfo.diagnosisList[i].차트번호,
                    patientInfo.diagnosisList[i].환자이름,
                    patientInfo.diagnosisList[i].나이,
                    document.getElementById('waitingPatientInfoDate').value,
                    document.getElementById('currentTimePopup').value,
                    (doctorOfficeIdx + 1) + '진료실',
                    '접수',
                    '',
                    document.getElementById('waitingPatientInfoDoctor').value,
                    document.getElementById('waitingPatientInfoDivision1').value,
                    document.getElementById('waitingPatientInfoDivision2').value,
                    document.getElementById('waitingPatientInfoDivision3').value,
                    '할인',
                    document.getElementById('waitingPatientInfoCategory').value,
                    document.getElementById('waitingPatientInfoInsuranceClassification').value,
                    document.getElementById('waitingPatientInfoSpecificSymbol').value,
                    document.getElementById('waitingPatientInfoBurdenRate').value,
                    document.getElementById('waitingPatientInfoClassificationOfExceptions').value,
                    document.getElementById('waitingPatientInfoCode').value,
                    document.getElementById('waitingPatientInfoReasonForException').value,
                    document.getElementById('waitingPatientInfoSign').value,
                    patientInfo.diagnosisList[i].오늘진료받은횟수
                )

                patientInfo.diagnosisList[i] = outpatientReception;
                var temp = patientInfo;

                localStorage.removeItem(name);
                name = 'outpatientReception' + window.opener.chartIdx;
                localStorage.setItem(name, JSON.stringify(temp));

                console.log(JSON.parse(localStorage.getItem(name)));
                break;
            }
        }
    }

    window.close();
}

//각종 select option list 만들기
function selectOptionCreate() {
    var selectEl;
    var objOption;

    //특정기호
    for (let i = 0; i < popSymbolSelOptionList.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoSpecificSymbol");
        objOption = document.createElement("option");
        objOption.text = popSymbolSelOptionList[i][1];
        objOption.value = popSymbolSelOptionList[i][3];
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    //산정특례본인부담률
    for (let i = 0; i < popTeductibleRateOpList.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoBurdenRate");
        objOption = document.createElement("option");
        objOption.text = popTeductibleRateOpList[i][0];
        objOption.value = popTeductibleRateOpList[i][1];
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    for (let i = 0; i < popExceptionOpList1.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoClassificationOfExceptions");
        objOption = document.createElement("option");
        objOption.text = popExceptionOpList1[i];
        objOption.value = popExceptionOpList1[i];
        selectEl.options.add(objOption);
    }

    for (let i = 0; i < popCodeOpList.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoCode");
        objOption = document.createElement("option");
        objOption.text = popCodeOpList[i];
        objOption.value = popCodeOpList[i];
        selectEl.options.add(objOption);
    }

    for (let i = 0; i < popExceptionOpList2.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoReasonForException");
        objOption = document.createElement("option");
        objOption.text = popExceptionOpList2[i];
        objOption.value = popExceptionOpList2[i];
        selectEl.options.add(objOption);
    }

    for (let i = 0; i < popSignOpList.length; i++) {
        selectEl = document.querySelector("#waitingPatientInfoSign");
        objOption = document.createElement("option");
        objOption.text = popSignOpList[i];
        objOption.value = popSignOpList[i];
        selectEl.options.add(objOption);
    }
}

function ChangeDeductibleRate() {
    console.log(document.getElementById('waitingPatientInfoSpecificSymbol').value);
    console.log(document.getElementById('waitingPatientInfoBurdenRate').value);
    document.getElementById('waitingPatientInfoBurdenRate').value = document.getElementById('waitingPatientInfoSpecificSymbol').value;
}

//특정기호 버튼
function SpecificSymbolBtn(isInsuranceInfo) {
    this.isInsuranceInfo = isInsuranceInfo;
    PopupOn(6, false, 700, 680);
}
// #endregion
// #region 메모
//환자기본정보 - 메모 저장
function MemoSave() {
    var id;
    var date;
    switch (memoIdx) {
        case 0:
            id = "totalMemo";
            date = "totalMemoDate";
            break;
        case 1:
            id = "officeMemo";
            date = "officeMemoDate";
            break;
        case 2:
            id = "receptionMemo";
            date = "receptionMemoDate";
            break;
        case 3:
            id = "storageMemo";
            date = "storageMemoDate";
            break;
        case 4:
            id = "previousAdmissionMemo";
            date = "previousAdmissionMemoDate";
            break;
    }

    window.opener.document.getElementById(id).value = document.getElementById('memoGroupbox2').value;
    window.opener.document.getElementById(date).value = new Date().toISOString().substring(5, 10);

    window.close();
}

// #endregion
// #region 소개자

//환자기본정보 - 소개자 저장
function IntroducerSave() {
    var name = document.getElementById('introducerName');
    if (name.value == '') {
        window.opener.document.getElementById('introducerBtn').value = "소개자";

    }
    else {
        window.opener.document.getElementById('introducerBtn').value = "소개자(" + document.getElementById('introducerName').value + ")";
    }

    window.close();
}
// #endregion
// #region 보험이력
//나이/성별 계산
function AgeCalculation(juminNumF, juminNumB) {
    var ssn1, ssn2;
    var nByear, nTyear;
    var today;

    try {
        if (juminNumF == 0) {
            ssn1 = document.getElementById('juminNumF').value;
        }
        else {
            ssn1 = juminNumF;
        }

        ssn2 = juminNumB;

        if (ssn1 < 6 || ssn2.length > 1 && ssn2.length < 7) {
            return;
        }

        today = new Date();
        nTyear = today.getFullYear();

        if (parseInt(ssn2.substring(0, 1), 10) < 3) {
            nByear = 1900 + parseInt(ssn1.substring(0, 2), 10);

        } else {
            nByear = 2000 + parseInt(ssn1.substring(0, 2), 10);

        }
        nAge = nTyear - nByear;

        nSex = parseInt(ssn2.substring(0, 1), 10);

        if (nSex % 2 == 1)
            Sex = "M";
        else
            Sex = "F";

        return Sex + nAge;
    } catch (error) { }
}

//보험이력 리스트 버튼
function InsuranceHistoryListBtn(idx) {
    if (insuranceType != 1 && insuranceType != 2) {
        insuranceType = 1;
    }

    window.opener.document.getElementById('dateOfAcquisitionOfInsuranceQualification' + (insuranceType)).value = testInsuranceHistoryList[idx][0];
    window.close();
}
// #endregion
// #region 특정기호
//특정기호 버튼
function SpecificSymbolListBtn(value, target) {
    ComnTbClick(target, 4, value);
}
// #endregion
// #region 기호검색
//보험회사 리스트 버튼
function InsuranceCompanyList(idx, target) {
    ComnTbClick(target, 6, idx);
}
// #endregion
// #region 메뉴환자조회
//환자기본정보 - 환자조회 검색버튼
function MenuPatientSearchBtn() {
    $("#menuPatientInfoList").empty();

    var temp = document.getElementById('menuInputPatientInfo').value;
    var selectOption = document.getElementById('menuPatientInquirySelect').selectedIndex;
    var idx = 1;
    for (let i = 0; i < localStorage.length; i++) {
        var name = 'patientInfo' + (i + 1);
        var patientInfo = JSON.parse(localStorage.getItem(name));

        if (patientInfo != null) {
            switch (selectOption) {
                case 0:
                    if (patientInfo.차트번호.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 1:
                    if (patientInfo.환자이름.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 2:
                    if (patientInfo.주민번호앞.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 3:
                    if (patientInfo.전화번호.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 4:
                    if (patientInfo.휴대전화.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 5:
                    if (patientInfo.이메일.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 6:
                    if (patientInfo.우편번호앞.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 7:
                    if (patientInfo.우편번호뒤.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 8:
                    if (patientInfo.상세주소.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 9:
                    if (patientInfo.피보험자.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 10:
                    if (patientInfo.최초내원일.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
                case 11:
                    if (patientInfo.최종내원일.includes(temp)) {
                        idx = MenuPatientTableListCreate(idx, patientInfo);
                    }
                    break;
            }

        }
    }
}

//환자기본정보 - 환자조회 리스트 만들기
function MenuPatientTableListCreate(idx, patientInfo) {
    var html = '';

    html += '<tr onclick="MenuPatientInquiryClick(this);">';
    html += '<td>' + idx + '</td>';
    html += '<td>' + patientInfo.차트번호 + '</td>';
    html += '<td>' + patientInfo.환자이름 + '</td>';
    html += '<td>' + patientInfo.주민번호앞 + '-' + patientInfo.주민번호뒤 + '</td>';
    html += '<td>' + patientInfo.집전화번호 + '</td>';
    html += '<td>' + patientInfo.휴대전화 + '</td>';
    html += '<td>' + patientInfo.eMailF + '@' + patientInfo.eMailB + '</td>';
    html += '<td>' + patientInfo.우편번호앞 + '</td>';
    html += '<td>' + patientInfo.우편번호뒤 + '</td>';
    html += '<td>' + patientInfo.상세주소 + '</td>';
    html += '<td>' + patientInfo.피보험자 + '</td>';
    html += '<td>' + patientInfo.보험구분 + '</td>';
    html += '<td>' + patientInfo.최초내원일 + '</td>';
    html += '<td>' + patientInfo.최종내원일 + '</td>';
    html += '</tr>';

    $("#menuPatientInfoList").append(html);

    idx += 1;
    return idx;
}

function MenuPatientInquiryClick(target) {
    ComnTbClick(target, 7);
}

// #endregion
// #region 차트기록조회
function ChartCheckTableBtn(target) {
    ComnTbClick(target, 12);
}
//#endregion
// #region 수납지시
function CompleteBtn() {
    // console.log(myFormula);
    window.opener.CompleteOfTreatment();
    PopupClose(false);
}
//#endregion
// #region 처방코드검색
async function RecipeCodeSearch(value) {
    if (condeInput != value) {
        loadCnt = 0;
    }

    if (loadCnt == 0) {
        $("#recipeCodeList").empty();
    }

    for (let i = 0; i < searchResult.length; i++) {
        var 항목구분 = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_DTL = '${searchResult[i].항목구분}' LIMIT 1`);

        let html = `
        <tr ${SetJson(searchResult[i])} onclick="RecipeCodeClick(this);">
            <td FG_ACTN =${searchResult[i].행위구분} FG_EXCPTN =${searchResult[i].예외구분} >${i + 1 + offset}</td>
            <td>${searchResult[i].처방코드}</td>
            <td>${searchResult[i].한글명칭}</td>
            <td FG_ITEM =${항목구분[0].CD_CODE_DTL}>${Get항목구분(항목구분[0].NM_CODE_DTL)}</td>
            <td>${searchResult[i].코드구분}</td>
            <td><input type="checkbox"${searchResult[i].원외구분 == true ? 'checked' : ''}></td>
            <td>${Get급여적용(searchResult[i].급여적용)}</td>
            <td>${searchResult[i].특정코드}</td>
            <td>${searchResult[i].단가적용일자}</td>
            <td>${searchResult[i].단가보험단가}</td>
        </tr>`;

        $("#recipeCodeList").append(html);

        if (searchResult.length == 1) {
            RecipeCodeClick($("#recipeCodeList tr:first-child")[0], true);
        }
    }

    loadCnt++;
}

async function RecipeCodeClick(target, isOne) {
    var td = await ComnTbClick(target);
    if (isOne == true || event.detail === 2) {
        var json = GetJson(target);
        var obj = {
            처방코드: td[1].innerHTML,
            청구코드: td[1].innerHTML,
            챠트번호: popBeforeAccept == undefined ? '' : popBeforeAccept.CD_CHART,
            투여량1회: 1.0,
            투여일수: 1,
            투여횟수: 1,
            //야간가산: HHmm,
            접수번호: popBeforeAccept == undefined ? '' : popBeforeAccept.NO_ACCEPT,
            진료번호: popBeforeAccept == undefined ? '' : popBeforeAccept.NO_TREAT,
            //유형번호: no_treat_ty,
            급여적용: td[6].innerHTML,
            항목구분: td[3].getAttribute('FG_ITEM'),
            코드구분: td[4].innerHTML,
            진료일자: '2023-09-22',
            행위구분: td[0].getAttribute('FG_ACTN'),
            예외구분: td[0].getAttribute('FG_EXCPTN'),
            //처방일자: ds_prscrptn,
            적용일자: td[8].innerHTML,
            표시명칭: td[2].innerHTML,
            등록구분: 처방등록구분Enum.FG01자동코드,
            b요양급여포함: true,
            입원료상세구분: 0,
            단가: td[9].innerHTML,
            의사사인: '',
            용법코드: json.용법코드,
            집계구분: json.집계구분,
            검사구분SumBits: json.검사구분SumBits,
            단가검진단가: json.단가검진단가,
            단가급여적용: json.단가급여적용,
            단가보험단가: json.단가보험단가,
            단가사용장려비: json.단가사용장려비,
            단가산재급여: json.단가산재급여,
            단가산재단가: json.단가산재단가,
            단가상대가치점수: json.단가상대가치점수,
            단가일반단가: json.단가일반단가,
            단가자보급여: json.단가자보급여,
            단가자보단가: json.단가자보단가,
            단가적용일자: json.단가적용일자,
            영문명칭: json.영문명칭,
            용법코드들: json.용법코드들,
            원외구분: json.원외구분,
            위탁구분: json.위탁구분,
            위탁기관ID: json.위탁기관ID,
            지원코드: json.지원코드,
            처방알림: json.처방알림,
            코드단가적용: json.코드단가적용,
            특정코드: json.특정코드,
            한글명칭: json.한글명칭
        };

        if (isAdd) {
            let list = await GetData(`SELECT * FROM T_TREAT WHERE CD_CHART = ${obj.챠트번호}
            AND DS_TREAT = '${popBeforeAccept.DS_TREAT}'`); //현재 저장된 리스트

            // if (strObj처방코드 !== _병원정보.진료처방_처방메모코드 &&
            //   strObj처방코드 !== "-Self-") {
            let lst중복 = [];

            if (list !== undefined) {
                lst중복 = list.filter(t => t.CD_PRSCRPTN === obj.처방코드);
            }

            if (lst중복.length > 0) {
                if (confirm("이미 처방된 처방코드입니다.\n무시하시고 추가하시겠습니까?\n\n")) {
                } else {
                    PopupClose(false);
                    return;
                }
            }

            window.opener.Insert처방(obj);
        }
        else {
            window.opener.Insert처방묶음(obj);
        }

        PopupClose(false);
    }

    recipeTarget = target;
}

function RecipeCodeBtnOK() {
    RecipeCodeClick(recipeTarget, true);
}

codeScroll.addEventListener("scroll", function () {
    let currentScrollPosition = codeScroll.scrollTop;
    let scrollHeight = codeScroll.scrollHeight - codeScroll.clientHeight;
    if (currentScrollPosition === scrollHeight) {
        if (loadCnt === scrollCnt) {
            scrollCnt++;
            offset += limitCnt;
            // RecipeCodeSearch(condeInput);
            Get_PrescriptionCode(condeInput, isCode, limit, offset);
        }
    }
});
//#endregion
//#region 환자접수예약
// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {
    let firstDate;
    let lastDate;
    today = new Date();

    firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
    lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날


    let tbody_Calendar;

    tbody_Calendar = document.getElementById('Calendar');
    document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
    document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신

    while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가

    for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
        let nowColumn = nowRow.insertCell();        // 열 추가
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

        let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
        nowColumn.innerText = leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력

        if (nowDay.getDay() == 0) {                 // 일요일인 경우 글자색 빨강으로
            nowColumn.style.color = "#DC143C";
        }
        if (nowDay.getDay() == 6) {                 // 토요일인 경우 글자색 파랑으로 하고
            nowColumn.style.color = "#0000CD";
            nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
        }

        nowColumn.style.height = "30px";

        if (nowDay.getDate() < today.getDate()) {                       // 지난날인 경우
            nowColumn.className = "pastDay";
            nowColumn.onclick = function () { choiceDate(this); }
            //nowColumn.id = 'day' + nowColumn.innerHTML;
        }
        else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우
            nowColumn.className = "today";
            nowColumn.onclick = function () { choiceDate(this); }
            nowColumn.id = 'today';
            nowColumn.style.backgroundColor = calendarColor2;
        }
        else {                                      // 미래인 경우
            nowColumn.className = "futureDay";
            nowColumn.onclick = function () { choiceDate(this); }
            //nowColumn.id = 'day' + nowColumn.innerHTML;
        }
    }

}

// 날짜 선택
function choiceDate(nowColumn, day) {
    //console.log(nowColumn);
    if (document.getElementsByClassName("choiceDay")[0]) {// 기존에 선택한 날짜가 있으면
        if (document.getElementsByClassName("choiceDay")[0].className == 'selectDay') {
            document.getElementsByClassName("choiceDay")[0].style.backgroundColor = 'rgb(211,227,243)';
        }
        else if (document.getElementsByClassName("choiceDay")[0].className == 'selectDay choiceDay') {
            document.getElementsByClassName("choiceDay")[0].style.backgroundColor = 'rgb(211,227,243)';
        }
        else {
            document.getElementsByClassName("choiceDay")[0].style.backgroundColor = "#FFFFF";
        }

        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }

    if (nowColumn.classList[0] == 'selectDay') {
        nowColumn.style.backgroundColor = "rgb(197, 220, 235)";
    }

    nowColumn.classList.add("choiceDay");           // 선택된 날짜에 "choiceDay" class 추가
    CreateRecipeReservationTable(nowColumn.innerHTML);
}

// 이전달 버튼 클릭
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소

    try {
        buildCalendar(tempPatientInfo, nowMonth); // 달력 다시 생성
    } catch (error) {
        buildCalendar(0, nowMonth);
    }

    //buildCalendar(tempPatientInfo);
}
// 다음달 버튼 클릭
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
    try {
        buildCalendar(tempPatientInfo, nowMonth); // 달력 다시 생성
    } catch (error) {
        buildCalendar(0, nowMonth);
    }
}

async function CreateRecipeReservationTable(fDay) {
    $("#ReservationWidthcolumn").empty();
    $("#recipeReservationList").empty();
    targetDay = fDay;

    //가로
    doctorIdx = 3;
    html = '<th class="border-style" style="width: 50px; font-size: 12px;">시간</th>';
    for (let i = 0; i < doctorIdx; i++) {
        html += '<th class="border-style" style="width: 100px; font-size: 12px;">' + [i + 1] + '진료실' + '</th>';
    }
    $("#ReservationWidthcolumn").append(html);

    //세로
    openTime = timeStrToMinutes('09:00');
    closeTime = timeStrToMinutes('19:00');
    settingTime = 30;

    // 두 시간의 차이 계산 (음수 값일 수 있음)
    let curTime = closeTime - openTime;

    // 음수 값 처리: 24시간을 더해주면 됨
    if (curTime < 0) {
        curTime += 24 * 60;
    }

    let tableidx = curTime / settingTime;
    let tempTime;

    for (let i = 0; i < tableidx; i++) {
        tempTime = openTime + settingTime * i;
        hours = SetTime(tempTime, true);
        min = SetTime(tempTime, false);
        html = '';
        html += '<tr style="height: 50px;">';
        html += '<td>' + `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}` + '</td>';
        result = FmtDay(fDay, hours, min);

        query = await GetData(`SELECT * FROM T_APPNTMNT WHERE DT_START = '${result}'`);

        for (let j = 0; j < doctorIdx; j++) {
            info = query.find(t => t.NO_DEPT == j);
            if (info !== undefined) {

                html += '<td style="height: 50px;"><input type="text" cd_chart="' + info.CD_CHART + '" dt_start="' + FmtUTCTime(info.DT_START) + '"  targetDate="' + tempTime + '" doctorIdx ="' + j + '" class="recipeReservationBtn" onclick="ReservationBtn(this, ' + fDay + ');" value ="' + info.NM_CHART + '(' + info.CD_CHART + ')' + '" readOnly></td>';
            }
            else {
                html += '<td style="height: 50px;"><input type="text" targetDate="' + tempTime + '" doctorIdx ="' + j + '" class="recipeReservationBtn" onclick="ReservationBtn(this, ' + fDay + ');"readOnly></td>';
            }
        }
        html += '</tr>';
        $("#recipeReservationList").append(html);
    }
}

function timeStrToMinutes(timeStr) {
    let [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

async function ReservationBtn(target, fDay) {
    try {
        if (target.value !== '') {
            ReservationCencelBtn(target);
            return;
        }

        chartNum = document.getElementById('reservationChartNum').value;
        chartName = document.getElementById('reservationPatientName').value;

        if (chartNum == '' && chartName == '') {
            alert('환자 정보가 없습니다.');
            return;
        }

        memo = prompt(chartName + '(' + chartNum + ')' + '님 예약하시겠습니까? \n\n예약메모 입력', ''); //취소 누르면 memo에 null이 들어옴
        if (memo == null) {
            return;
        }

        let t_APPNTMNT = new T_APPNTMNT;

        let time = target.getAttribute('targetDate');
        console.log(time);
        let startDay = FmtDay(fDay, SetTime(time, true), SetTime(time, false));

        time = parseInt(time) + parseInt(settingTime);
        let endDay = FmtDay(fDay, SetTime(time, true), SetTime(time, false));

        t_APPNTMNT.CD_CHART = chartNum;
        t_APPNTMNT.NM_CHART = chartName;
        t_APPNTMNT.TY_APPNTMNT = 1;
        t_APPNTMNT.DT_START = startDay;
        t_APPNTMNT.DT_END = endDay;
        t_APPNTMNT.DC_APPNTMNT = memo;
        t_APPNTMNT.TY_STAT = 1;
        t_APPNTMNT.CD_DEPT_SPRT = '00';
        t_APPNTMNT.NO_MOBILE = document.getElementById('reservationPhoneNumber').value;
        t_APPNTMNT.BL_DEL = false;
        t_APPNTMNT.NO_DEPT = target.getAttribute('doctorIdx');

        await Set_CreatePostData('T_APPNTMNT', t_APPNTMNT);

        CreateRecipeReservationTable(targetDay);
        window.opener.StartRecipeReservationListCreate();
    } catch (error) {
        console.log(error);
    }

}

async function ReservationCencelBtn(target) {
    if (confirm(target.value + '님이 예약되어 있습니다. 취소하시겠습니까?') == true) {    //확인       
        console.log(target.getAttribute('dt_start'));
        var obj = {
            CD_CHART: target.getAttribute('cd_chart'),
            DT_START: FmtDate(new Date(target.getAttribute('dt_start'))),
            NO_DEPT: target.getAttribute('doctorIdx'),
        }
        console.log(obj);
        await Set_DeletePostData('T_APPNTMNT', obj);
        CreateRecipeReservationTable(targetDay);
        window.opener.StartRecipeReservationListCreate();
    }
}

function FmtDay(d, h, m) {
    h = parseInt(h);
    year = document.getElementById('calYear').innerHTML;
    Month = document.getElementById('calMonth').innerHTML;
    day = d;
    hours = String(h).padStart(2, '0');

    min = String(m).padStart(2, '0');
    Sec = '00';
    result = `${year}-${Month}-${day} ${hours}:${min}:${Sec}.000`;

    return result;
}

function InitReservationInfo(t_chart) {
    buildCalendar();
    CreateRecipeReservationTable(document.getElementById('today').innerHTML);

    if (t_chart == undefined) {
        return;
    }
    document.getElementById('reservationChartNum').value = t_chart.CD_CHART;
    document.getElementById('reservationPatientName').value = t_chart.NM_CHART;
    //  document.getElementById('engName').value = filteredData.영문이름;

    jumin = ConvertInt(t_chart.NO_JUMIN_ENC.data);
    juminF = jumin.toString().slice(0, 6);
    juminB = jumin.toString().slice(6, jumin.length);
    document.getElementById('reservationJuminNumF').value = juminF + '-' + juminB;
    document.getElementById('reservationAge').value = AgeCalculation(juminF, juminB);
    document.getElementById('reservationPhoneNumber').value = t_chart.NO_MOBILE;
    document.getElementById('reservationDetailedAddress').value = t_chart.DC_ADDR + '  ' + t_chart.DC_ADDR_DTL;
}

function SetTime(tempTime, isHours) {
    var result;
    if (isHours) {
        result = Math.floor(tempTime / 60);
    }
    else {
        result = tempTime % 60;
    }

    return result;
}

function ReservationSearch(obj) {
    InitReservationInfo(obj[0]);
}
//#endregion
//#region 상병코드검색
async function DiseaseCodeSearch(searchString) {
    var day = fmtTodayDay.replace(/-/g, "");

    filteredData = await GetData(`SELECT
    ID_DX_INFO AS 상병정보ID,
    CD_DX AS 상병코드,
    CD_DX_USER AS 사용자코드,
    NM_DX_HAN AS 한글명칭,
    NM_DX_DSPLY AS 표시명칭,
    NM_DX_ENG AS 영문명칭,
    CD_SPCL_SMBL AS 특정기호,
    BL_INCMPLT AS 불완전코드,
    FG_SEX AS 성별구분,
    CD_LGL_INFCTS_DSS AS 법정감염병,
    FG_DX AS 상병구분,
    DS_DEL AS 삭제일자,
    BL_DEL AS 삭제구분,
    BL_DX_MAIN_USE AS 주상병사용구분,
    AGE_MAX_LIMIT AS 상한연령,
    AGE_MIN_LIMIT AS 하한연령,
    TY_DX_CHUNA AS 추나상병구분
FROM
    T_DX_INFO
WHERE
    (${diseaseCheckboxs[0].checked} AND UPPER(REPLACE(CD_DX, ' ', '')) LIKE UPPER('%${searchString}%'))
    OR
    (${diseaseCheckboxs[1].checked} AND UPPER(REPLACE(NM_DX_HAN, ' ', '')) LIKE UPPER('%${searchString}%'))
    AND BL_INCMPLT = 0
    AND (BL_DEL = 0 OR '${day}' < DS_DEL)
`);

    for (let i = 0; i < filteredData.length; i++) {
        let html = `
        <tr ID_DX_INFO = ${filteredData[i].상병정보ID} CD_DX_USER = ${filteredData[i].사용자코드} NM_DX_DSPLY = ${filteredData[i].표시명칭}
        CD_LGL_INFCTS_DSS = ${filteredData[i].법정감염병} FG_DX = ${filteredData[i].상병구분} DS_DEL = ${filteredData[i].삭제일자}
        BL_DEL = ${filteredData[i].삭제구분} AGE_MAX_LIMIT = ${filteredData[i].상한연령} AGE_MIN_LIMIT = ${filteredData[i].하한연령}
        TY_DX_CHUNA = ${filteredData[i].추나상병구분} onclick="DiseaseCodeClick(this);">
            <td>${i + 1}</td>
            <td>${filteredData[i].상병코드}</td>
            <td>${filteredData[i].한글명칭}</td>
            <td>${filteredData[i].영문명칭}</td>
            <td>${filteredData[i].특정기호}</td>
            <td><input id="불완전코드" type="checkbox" ${filteredData[i].불완전코드 === 1 ? 'checked' : ''}></td>
             <td><input id="주상병사용구분" type="checkbox" ${filteredData[i].주상병사용구분 === 1 ? 'checked' : ''}></td>
            <td>${filteredData[i].성별구분 === 0 ? '없음' : filteredData[i].성별구분}</td>
            <td>${filteredData[i].상한연령}</td>
            <td>${filteredData[i].하한연령}</td>
            <td>${filteredData[i].법정감염병}</td>
            <td>${filteredData[i].상병구분}</td>
        </tr>`;

        $("#diseaseCodeList1").append(html);
    }
}

async function DiseaseCodeClick(target) {
    var td = await ComnTbClick(target);
    if (event.detail === 2) {
        let obj = {
            상병정보ID: target.getAttribute('id_dx_info'),
            상병코드: td[1].innerHTML,
            사용자코드: target.getAttribute('cd_dx_user'),
            한글명칭: td[2].innerHTML,
            표시명칭: target.getAttribute('nm_dx_dsply'),
            영문명칭: td[3].innerHTML,
            특정기호: td[4].innerHTML,
            불완전코드: td[5].querySelector('input[type="checkbox"]').checked,
            성별구분: td[7].innerHTML,
            법정감염병: target.getAttribute('cd_lgl_infcts_dss'),
            상병구분: target.getAttribute('fg_dx'),
            삭제일자: target.getAttribute('ds_del'),
            삭제구분: target.getAttribute('bl_del'),
            주상병사용구분: td[6].querySelector('input[type="checkbox"]').checked,
            상한연령: target.getAttribute('age_max_limit'),
            하한연령: target.getAttribute('age_min_limit'),
            추나상병구분: target.getAttribute('ty_dx_chuna')
        };

        if (obj.성별구분 !== '없음') {
            let b성별구분 = obj.성별구분;
            console.log(b성별구분);

            if ((b성별구분 === 상병성별구분Enum.상병성별구분Enum1남자 && _성별구분 !== "M") ||
                (b성별구분 === 상병성별구분Enum.상병성별구분Enum2여자 && _성별구분 !== "F")) {
                let str마스터성별 = ["모두", "남자", "여자"][b성별구분];


                frmSBError.ShowError("입력 불가", `성별구분에 의해 입력할 수 없습니다.\n\n입력가능성별: ${str마스터성별}`);
                return;
            }
        }

        let list = window.opener.treatDXList; //현재 저장된 리스트

        if (list != undefined) {
            if (list.find(t => t.상병코드 === obj.상병코드) !== undefined) {
                alert("입력 불가이미 입력된 상병입니다.");
                return;
            }
        }

        if (basicInfoRoom == false) {
            if (popBeforeAccept == undefined) {
                window.opener.Create상병Table(obj);
            }
            else {
                window.opener.Insert상병(obj, popBeforeAccept);
            }
        }
        else {
            window.opener.Create상병Table(obj);
        }
        PopupClose(false); // 팝업 닫기
    }
}
//#endregion
//#region 환경설정
async function SettingCompleteBtn() {
    // 모든 input 요소 중에서 type이 "checkbox"이고 체크가 되어 있는 요소들을 선택
    var checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    var favoritesList = [];

    // checkedCheckboxes를 순회하면서 작업 수행
    checkedCheckboxes.forEach(function (checkbox) {
        favoritesList.push(checkbox.id);
    });

    window.opener.SetFavorites(favoritesList);

    var noteType = document.querySelectorAll('#progressNote input');
    for (let i = 0; i < noteType.length; i++) {
        if (noteType[i].checked) {
            console.log(noteType[i]);
            try {
                var t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE`);
                var unCheck = t_NOTE_TYPE.filter(t => t.BL_USE == 1);
                var Check = t_NOTE_TYPE.filter(t => t.NO_NOTE == noteType[i].value);

                if (unCheck[0].NO_NOTE != Check[0].NO_NOTE) {
                    unCheck[0].BL_USE = 0;
                    Check[0].BL_USE = 1;
                    await Set_UpdatePostData('T_NOTE_TYPE', unCheck[0]);
                    await Set_UpdatePostData('T_NOTE_TYPE', Check[0]);
                }
            }
            catch (error) {
                var t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE`);
                var Check = t_NOTE_TYPE.filter(t => t.NO_NOTE == noteType[i].value);
                Check[0].BL_USE = 1;
                await Set_UpdatePostData('T_NOTE_TYPE', Check[0]);
            }

            window.opener.LoadNoteType(noteType[i].value);
            break;
        }
    }

    // var noteType = document.querySelectorAll('#progressNote2 input');
    // for (let i = 0; i < noteType.length; i++) {
    //     if (noteType[i].checked) {
    //         try {
    //             var t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE`);
    //             var unCheck = t_NOTE_TYPE.filter(t => t.BL_USE == 1 && t.FG_NOTE == 1);
    //             var Check = t_NOTE_TYPE.filter(t => t.NO_NOTE == noteType[i].value && t.FG_NOTE == 1);

    //             if (unCheck[0].NO_NOTE != Check[0].NO_NOTE) {
    //                 unCheck[0].BL_USE = 0;
    //                 Check[0].BL_USE = 1;
    //                 await Set_UpdatePostData('T_NOTE_TYPE', unCheck[0]);
    //                 await Set_UpdatePostData('T_NOTE_TYPE', Check[0]);
    //             }
    //         } catch (error) {
    //             var t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE`);
    //             var Check = t_NOTE_TYPE.filter(t => t.NO_NOTE == noteType[i].value);
    //             Check[0].BL_USE = 1;
    //             console.log(Check);
    //             await Set_UpdatePostData('T_NOTE_TYPE', Check[0]);
    //         }

    //         window.opener.LoadNoteType(noteType[i].value);
    //         break;
    //     }
    // }

    PopupClose(false);
}

async function CreateNoteType() {
    var note = await GetData(`SELECT * FROM T_NOTE_TYPE`);
    for (let i = 0; i < note.length; i++) {
        var html = '';
        html += '<span style="display: inline-block; margin-left : 5px;">';
        html += '<label class="CmRadio">';
        if (note[i].BL_USE == 1) {
            html += `<input type="radio" name="noteType" value="${note[i].NO_NOTE}" checked>`;
        }
        else {
            html += `<input type="radio" name="noteType" value="${note[i].NO_NOTE}">`;
        }
        html += note[i].NOTE_NAME;
        html += ' <span class="CmCheckIcon"></span>';
        html += '</label>';
        html += '<span>';

        $("#progressNote").append(html);
    }
}
//#endregion
//#region 병원관리
//#region 병원관리(토글)
function hospitalMGRBtnOnOff(idx) {
    for (let i = 0; i < hospitalMGRBtns.length; i++) {
        if (i == idx) {
            hospitalMGRBtns[i].style.display = 'block';
        }
        else {
            hospitalMGRBtns[i].style.display = 'none';
        }
    }
}
//#endregion
//#region 병원관리(병원정보)
async function HospitalMGRInit() {
    var list = await GetData(`SELECT * FROM T_HSPTL_INFO WHERE FG_HSPTL_INFO = 'A'`);

    for (let i = 0; i < list.length; i++) {
        html = '';
        html += `<tr ${SetJson(list[i])}>`;
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + list[i].NM_HSPTL_INFO + '</td>';
        if (list[i].VL_HSPTL_INFO == '0') {
            html += '<td><input type="checkbox"></td>'
        }
        else if (list[i].VL_HSPTL_INFO == '1') {
            html += '<td><input type="checkbox" checked></td>'
        }
        else {
            html += '<td><input type="text" style="width: 98%; height: 38px; background-color: white;" value=' + list[i].VL_HSPTL_INFO + '></td>'
        }
        html += '</tr>';
        $("#hospitalInfoList").append(html);
    }

    var list = await GetData(`SELECT * FROM T_HSPTL_INFO WHERE FG_HSPTL_INFO = 'U'`);

    for (let i = 0; i < list.length; i++) {
        html = '';
        html += `<tr ${SetJson(list[i])}>`;
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + list[i].NM_HSPTL_INFO + '</td>';
        if (list[i].VL_HSPTL_INFO == '0') {
            html += '<td><input type="checkbox"></td>'
        }
        else if (list[i].VL_HSPTL_INFO == '1') {
            html += '<td><input type="checkbox" checked></td>'
        }
        else {
            //html += '<td>' + list[i].VL_HSPTL_INFO + '</td>'
            html += '<td><input type="text" style="width: 98%; height: 38px; background-color: white;" value=' + list[i].VL_HSPTL_INFO + '></td>'
        }
        html += '<td>' + list[i].DC_HSPTL_INFO + '</td>'
        html += '</tr>';
        $("#hospitalSettingList").append(html);
    }
}

async function SaveHospitalInfo() {
    var tables = ['hospitalInfoList', 'hospitalSettingList'];
    var infoList = [];
    for (const tableName of tables) {
        var table = document.getElementById(tableName);
        var tbody = table.parentNode;
        var trs = tbody.getElementsByTagName('tr');

        for (let i = 1; i < trs.length; i++) {
            var td = trs[i].getElementsByTagName('td');
            var inputElement = td[2].getElementsByTagName('input')[0];
            var value;

            var json = GetJson(trs[i]);
            if (inputElement && inputElement.type === 'checkbox') {
                value = inputElement.checked == false ? 0 : 1;
            }
            else {
                value = inputElement.value;
            }

            if (json.VL_HSPTL_INFO != value) {
                var info = new t_HSPTL_INFO();
                info.VL_HSPTL_INFO = inputElement.type === 'text' ? inputElement.value : (inputElement.checked ? '1' : '0');
                info.FG_HSPTL_INFO = (tableName === 'hospitalInfoList') ? 'A' : 'U';
                info.NM_HSPTL_INFO = td[1].innerHTML;

                Set_UpdatePostData('T_HSPTL_INFO', info);
            }
        }
    }

    alert('저장완료');
}
//#endregion
//#region 병원관리(보험기준)
async function InsuranceTableInit() {
    t_HSPTL_INFO_INS = await GetData(`SELECT * FROM T_HSPTL_INFO_INS`);

    t_HSPTL_INFO_INS.reverse();
    insuranceIDIdx = 1;
    if (t_HSPTL_INFO_INS.length == 0) {
        InsuranceTableAdd();
    }
    else {
        InsuranceTableLoad(t_HSPTL_INFO_INS);
    }
}

function InsuranceTableLoad(list) {
    console.log('InsuranceTableLoad');

    var elementsWithTheName = document.querySelectorAll('[name="insuranceElement"]');
    for (let i = 0; i < elementsWithTheName.length; i++) {
        elementsWithTheName[i].remove();
    }


    var result = [];
    for (let i = 0; i < list.length; i++) {
        var target = [];

        target.push(list[i].DS_APLY === null ? '' : list[i].DS_APLY); //적용일자
        target.push(list[i].TS_TREAT_WKD_START === null ? '' : list[i].TS_TREAT_WKD_START); //진료시간평일시작
        target.push(list[i].TS_TREAT_WKD_END === null ? '' : list[i].TS_TREAT_WKD_END); //진료시간평일마감
        target.push(list[i].TS_TREAT_WKE_START === null ? '' : list[i].TS_TREAT_WKE_START); //진료시간주말시작
        target.push(list[i].TS_TREAT_WKE_END === null ? '' : list[i].TS_TREAT_WKE_END); //진료시간주말마감
        target.push(list[i].RT_ADTN_NHIS_ISRC === null ? '' : list[i].RT_ADTN_NHIS_ISRC); //보험종별가산율
        target.push(list[i].RT_ADTN_MC_ISRC === null ? '' : list[i].RT_ADTN_MC_ISRC); //급여종별가산율
        target.push(list[i].RT_ADTN_MOTR_ISRC === null ? '' : list[i].RT_ADTN_MOTR_ISRC); //자보종별가산율
        target.push(list[i].RT_ADTN_IAI_ISRC === null ? '' : list[i].RT_ADTN_IAI_ISRC); //산재
        target.push(list[i].RT_ADTN_INJRY_DUTY === null ? '' : list[i].RT_ADTN_INJRY_DUTY);//10 //공상
        target.push(list[i].MNY_FIXED_AMT_STNDRD === null ? '' : list[i].MNY_FIXED_AMT_STNDRD); //보험정액기준금액
        target.push(list[i].MNY_FIXED_AMT === null ? '' : list[i].MNY_FIXED_AMT); //보험정액요금
        target.push(list[i].MNY_FIXED_AMT_OLDMN === null ? '' : list[i].MNY_FIXED_AMT_OLDMN); //보험정액요금노인
        target.push(list[i].MNY_FIXED_AMT_STNDRD_PRSCRPTN === null ? '' : list[i].MNY_FIXED_AMT_STNDRD_PRSCRPTN); //보험정액기준금액_처방전
        target.push(list[i].MNY_FIXED_AMT_PRSCRPTN === null ? '' : list[i].MNY_FIXED_AMT_PRSCRPTN); //보험정액요금_처방전
        target.push(list[i].MNY_FIXED_AMT_OLDMN_PRSCRPTN === null ? '' : list[i].MNY_FIXED_AMT_OLDMN_PRSCRPTN); //보험정액요금노인_처방전
        target.push(list[i].MNY_SLFPAY_MC_ISRC1 === null ? '' : list[i].MNY_SLFPAY_MC_ISRC1); //20 //급여1종본인부담금
        target.push(list[i].MNY_SLFPAY_MC_ISRC2 === null ? '' : list[i].MNY_SLFPAY_MC_ISRC2); //급여2종본인부담금
        target.push(list[i].MNY_SLFPAY_MC_ISRC2_PRSCRPTN === null ? '' : list[i].MNY_SLFPAY_MC_ISRC2_PRSCRPTN); //급여2종본인부담금_처방전
        target.push(list[i].MNY_SLFPAY_MC_ISRC2_DSPERSN === null ? '' : list[i].MNY_SLFPAY_MC_ISRC2_DSPERSN); //급여2종장애기금부담액
        target.push(list[i].RT_SLFPAY_OUTPTNT === null ? '' : list[i].RT_SLFPAY_OUTPTNT); //보험외래본인부담율
        target.push(list[i].RT_SLFPAY_INPTNT === null ? '' : list[i].RT_SLFPAY_INPTNT); //보험입원본인부담율
        target.push(list[i].RT_SLFPAY_MC_ISRC1 === null ? '' : list[i].RT_SLFPAY_MC_ISRC1); //급여1종본인부담율
        target.push(list[i].RT_SLFPAY_MC_ISRC2 === null ? '' : list[i].RT_SLFPAY_MC_ISRC2); //급여2종본인부담율
        target.push(list[i].RT_SLFPAY_NPG === null ? '' : list[i].RT_SLFPAY_NPG); //차상위본인부담율
        target.push(list[i].RT_SLFPAY_ADTN_DIET === null ? '' : list[i].RT_SLFPAY_ADTN_DIET); //가산식대본인부담율
        target.push(list[i].RT_ADTN_CT_NHIS_ISRC === null ? '' : list[i].RT_ADTN_CT_NHIS_ISRC); //보험CT가산율
        target.push(list[i].RT_ADTN_CT_MC_ISRC === null ? '' : list[i].RT_ADTN_CT_MC_ISRC); //급여CT가산율
        target.push(list[i].RT_ADTN_CT_MOTR_ISRC === null ? '' : list[i].RT_ADTN_CT_MOTR_ISRC); //자보CT가산율
        target.push(list[i].RT_ADTN_CT_IAI_ISRC === null ? '' : list[i].RT_ADTN_CT_IAI_ISRC);       //30 //산재CT가산율
        target.push(list[i].TS_OPEN_MON === null ? '' : list[i].TS_OPEN_MON); //월
        target.push(list[i].TS_OPEN_TUE === null ? '' : list[i].TS_OPEN_TUE); //화
        target.push(list[i].TS_OPEN_WED === null ? '' : list[i].TS_OPEN_WED); //수
        target.push(list[i].TS_OPEN_THU === null ? '' : list[i].TS_OPEN_THU); //목
        target.push(list[i].TS_OPEN_FRI === null ? '' : list[i].TS_OPEN_FRI);   //40 //금
        target.push(list[i].TS_OPEN_SAT === null ? '' : list[i].TS_OPEN_SAT); //토
        target.push(list[i].DC_STNDRD_AGE_OLDMN === null ? '' : list[i].DC_STNDRD_AGE_OLDMN); //보험노인기준나이
        target.push(list[i].MNY_UNIT === null ? '' : list[i].MNY_UNIT);      //상대가치점수별단가
        target.push(list[i].TY_PSYC_GRAD === null ? '' : list[i].TY_PSYC_GRAD); //정신과_등급
        target.push(list[i].CD_PSYC_INPTNT === null ? '' : list[i].CD_PSYC_INPTNT); //정신과_입원수가코드
        target.push(list[i].CD_PSYC_SLEP_OUT === null ? '' : list[i].CD_PSYC_SLEP_OUT); //정신과_외박수가코드
        target.push(list[i].CD_PSYC_DAY_WARD === null ? '' : list[i].CD_PSYC_DAY_WARD); //정신과_낮병둥수가코드
        //target.push(list[i].CD_PSYC_DAY_WARD === null ? '' : list[i].CD_PSYC_DAY_WARD); //본인부담상한액

        result.push(target);

        tempInsurance = list;
    }

    var idx = 0;

    for (let z = 0; z < result.length; z++) {
        for (let i = 0; i < insuranceTableLists.length; i++) {
            var tbody = insuranceTableLists[i].parentNode;
            var trs = tbody.getElementsByTagName('tr');
            var element;
            for (var j = 0; j < trs.length; j++) {
                html = '';
                if (i == 7) {
                    element = document.createElement('input');
                    element.type = 'text';
                    element.id = 'insuranceInputList' + insuranceIDIdx;
                    element.style.width = '90%';
                    element.style.backgroundColor = 'white';
                    element.setAttribute("value", result[z][idx]);
                    html += '<th name="insuranceElement" style="width: 50px;" onclick="InsuranceTableClick(\'' + result[z][0] + '\', ' + z + ')">';
                    html += element.outerHTML;
                    html += '</th>';

                    element = document.createElement('input');
                    element.type = 'text';
                    element.id = 'insuranceInputList' + (insuranceIDIdx + 1);
                    element.style.width = '90%';
                    element.style.backgroundColor = 'white';
                    element.setAttribute("value", result[z][idx + 1]);
                    html += '<th name="insuranceElement" style="width: 50px;" onclick="InsuranceTableClick(\'' + result[z][0] + '\', ' + z + ')">';
                    html += element.outerHTML;
                    html += '</th>';

                    element = document.createElement('input');
                    element.type = 'text';
                    element.id = 'insuranceInputList' + (insuranceIDIdx + 2);
                    element.style.width = '90%';
                    element.style.backgroundColor = 'white';
                    element.setAttribute("value", result[z][idx + 2]);
                    html += '<th name="insuranceElement" style="width: 50px;" onclick="InsuranceTableClick(\'' + result[z][0] + '\', ' + z + ')">';
                    html += element.outerHTML;
                    html += '</th>';

                    idx += 2
                    insuranceIDIdx += 2;
                }
                else {
                    element = document.createElement('input');
                    element.type = 'text';
                    element.id = 'insuranceInputList' + insuranceIDIdx;
                    element.style.width = '95%';


                    element.setAttribute("value", result[z][idx]);
                    if (i == 0 && z == 0) //첫 번째 선택
                    {
                        element.style.backgroundColor = 'rgb(211,227,243)';
                        insuranceDelDay = result[z][0];
                        html += '<th name="insuranceElement" style="width: 156px;" onclick="InsuranceTableClick(\'' + result[z][0] + '\', ' + z + ')">';
                    }
                    else {
                        element.style.backgroundColor = 'white';
                        html += '<th name="insuranceElement" style="width: 156px;" onclick="InsuranceTableClick(\'' + result[z][0] + '\', ' + z + ')">';
                    }

                    html += element.outerHTML;
                    html += '</td>';
                }

                $(trs[j]).append(html);

                idx++;
                insuranceIDIdx++;
                if (idx == result[z].length) {
                    idx = 0;
                }
            }
        }
    }
}
async function InsuranceTableClick(value, idx) {
    insuranceDelDay = value;
    length = (insuranceIDIdx / 42) - 1;

    for (let i = 0; i <= length; i++) {
        var idIdx = (42 * i) + 1;
        if (idx == i) {
            document.getElementById('insuranceInputList' + idIdx).style.backgroundColor = 'rgb(211,227,243)';
        }
        else {
            idIdx
            document.getElementById('insuranceInputList' + idIdx).style.backgroundColor = 'white';
        }
    }
}

async function InsuranceTableAdd() {
    console.log('InsuranceTableAdd');
    var info = t_HSPTL_INFO_INS.find(t => t.DS_APLY === document.getElementById('InsuranceDate').value);
    if (info !== undefined) {
        alert('기준일자 ' + info.DS_APLY + '에 대한 보험종보가 이미 존재합니다.');
        return;
    }

    if (tempInsurance.length === 0) {
        tempInsurance.push(new T_HSPTL_INFO_INS());
    }


    tempInsurance[0].DS_APLY = document.getElementById('InsuranceDate').value;
    await Set_CreatePostData('T_HSPTL_INFO_INS', tempInsurance[0]);

    if (tempInsurance.length !== 0) {
        alert('추가완료');
    }

    InsuranceTableInit();
}

async function InsuranceTableSave() {
    idx = (insuranceIDIdx / 42) - 1;

    for (let i = 0; i < idx; i++) {
        result = new T_HSPTL_INFO_INS();
        j = i * 42;
        console.log('insuranceInputList' + (1 + j));
        console.log(document.getElementById('insuranceInputList' + (1 + j)).value);
        result.DS_APLY = document.getElementById('insuranceInputList' + (1 + j)).value;
        result.TS_TREAT_WKD_START = document.getElementById('insuranceInputList' + (2 + j)).value;
        result.TS_TREAT_WKD_END = document.getElementById('insuranceInputList' + (3 + j)).value;
        result.TS_TREAT_WKE_START = document.getElementById('insuranceInputList' + (4 + j)).value;
        result.TS_TREAT_WKE_END = document.getElementById('insuranceInputList' + (5 + j)).value;
        result.RT_ADTN_NHIS_ISRC = document.getElementById('insuranceInputList' + (6 + j)).value;
        result.RT_ADTN_MC_ISRC = document.getElementById('insuranceInputList' + (7 + j)).value;
        result.RT_ADTN_MOTR_ISRC = document.getElementById('insuranceInputList' + (8 + j)).value;
        result.RT_ADTN_IAI_ISRC = document.getElementById('insuranceInputList' + (9 + j)).value;
        result.RT_ADTN_INJRY_DUTY = document.getElementById('insuranceInputList' + (10 + j)).value;
        result.MNY_FIXED_AMT_STNDRD = document.getElementById('insuranceInputList' + (11 + j)).value;
        result.MNY_FIXED_AMT = document.getElementById('insuranceInputList' + (12 + j)).value;
        result.MNY_FIXED_AMT_OLDMN = document.getElementById('insuranceInputList' + (13 + j)).value;
        result.MNY_FIXED_AMT_STNDRD_PRSCRPTN = document.getElementById('insuranceInputList' + (14 + j)).value;
        result.MNY_FIXED_AMT_PRSCRPTN = document.getElementById('insuranceInputList' + (15 + j)).value;
        result.MNY_FIXED_AMT_OLDMN_PRSCRPTN = document.getElementById('insuranceInputList' + (16 + j)).value;
        result.MNY_SLFPAY_MC_ISRC1 = document.getElementById('insuranceInputList' + (17 + j)).value;
        result.MNY_SLFPAY_MC_ISRC2 = document.getElementById('insuranceInputList' + (18 + j)).value;
        result.MNY_SLFPAY_MC_ISRC2_PRSCRPTN = document.getElementById('insuranceInputList' + (19 + j)).value;
        result.MNY_SLFPAY_MC_ISRC2_DSPERSN = document.getElementById('insuranceInputList' + (20 + j)).value;
        result.RT_SLFPAY_OUTPTNT = document.getElementById('insuranceInputList' + (21 + j)).value;
        result.RT_SLFPAY_INPTNT = document.getElementById('insuranceInputList' + (22 + j)).value;
        result.RT_SLFPAY_MC_ISRC1 = document.getElementById('insuranceInputList' + (23 + j)).value;
        result.RT_SLFPAY_MC_ISRC2 = document.getElementById('insuranceInputList' + (24 + j)).value;
        result.RT_SLFPAY_NPG = document.getElementById('insuranceInputList' + (25 + j)).value;
        result.RT_SLFPAY_ADTN_DIET = document.getElementById('insuranceInputList' + (26 + j)).value;
        result.RT_ADTN_CT_NHIS_ISRC = document.getElementById('insuranceInputList' + (27 + j)).value;
        result.RT_ADTN_CT_MC_ISRC = document.getElementById('insuranceInputList' + (28 + j)).value;
        result.RT_ADTN_CT_MOTR_ISRC = document.getElementById('insuranceInputList' + (29 + j)).value;
        result.RT_ADTN_CT_IAI_ISRC = document.getElementById('insuranceInputList' + (30 + j)).value;
        result.TS_OPEN_MON = document.getElementById('insuranceInputList' + (31 + j)).value;
        result.TS_OPEN_TUE = document.getElementById('insuranceInputList' + (32 + j)).value;
        result.TS_OPEN_WED = document.getElementById('insuranceInputList' + (33 + j)).value;
        result.TS_OPEN_THU = document.getElementById('insuranceInputList' + (34 + j)).value;
        result.TS_OPEN_FRI = document.getElementById('insuranceInputList' + (35 + j)).value;
        result.TS_OPEN_SAT = document.getElementById('insuranceInputList' + (36 + j)).value;
        result.DC_STNDRD_AGE_OLDMN = document.getElementById('insuranceInputList' + (37 + j)).value;
        result.MNY_UNIT = document.getElementById('insuranceInputList' + (38 + j)).value;
        result.TY_PSYC_GRAD = document.getElementById('insuranceInputList' + (39 + j)).value;
        result.CD_PSYC_INPTNT = document.getElementById('insuranceInputList' + (40 + j)).value;
        result.CD_PSYC_SLEP_OUT = document.getElementById('insuranceInputList' + (41 + j)).value;

        result.CD_PSYC_DAY_WARD = document.getElementById('insuranceInputList' + (42 + j)).value;

        await Set_UpdatePostData('T_HSPTL_INFO_INS', result);
    }

    alert('저장완료');
    InsuranceTableInit();
}

async function InsuranceTableDelete() {
    if (confirm("삭제 시 복구가 불가능 합니다.\n\n기준일자 [" + insuranceDelDay + "] 삭제 하시겠습니까?") == true) {
        await PostData(`DELETE FROM T_HSPTL_INFO_INS WHERE DS_APLY = '${insuranceDelDay}'`);
        insuranceDelDay = 0;
        alert('삭제완료');
        InsuranceTableInit();
    }
}
//#endregion
//#region 병원관리(사용자/부서 설정)
async function DeptInit() {
    userPosition = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '73'`);
    for (let i = 0; i < userPosition.length; i++) {
        selectEl = document.querySelector("#userPosition");
        objOption = document.createElement("option");
        objOption.text = userPosition[i].NM_CODE_DTL;
        objOption.value = userPosition[i].CD_CODE_GRP;
        //objOption.setAttribute("EditValue", data[i].CD_CODE_DTL);
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    for (let i = 0; i < userPosition.length; i++) {
        selectEl = document.querySelector("#userInput8");
        objOption = document.createElement("option");
        objOption.text = userPosition[i].NM_CODE_DTL;
        objOption.value = userPosition[i].CD_CODE_DTL;
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    userPosition = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '202'`);
    for (let i = 0; i < userPosition.length; i++) {
        selectEl = document.querySelector("#posInput2");
        objOption = document.createElement("option");
        objOption.text = userPosition[i].NM_CODE_DTL;
        objOption.value = userPosition[i].CD_CODE_DTL;
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    Refresh사용자리스트();
    Refresh부서리스트();
}

//#region 병원관리(사용자/부서 설정 - 사용자정보)
function New사용자정보() {
    Init사용자정보();
    alert('내용 작성 후, [저장]버튼을 클릭하면\n신규 사용자가 추가 됩니다.');
}

function Init사용자정보() {
    isNew사용자 = true;

    var userInput = document.getElementById('userInput');
    var inputElements = userInput.querySelectorAll('input[type="text"]');

    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = '';
    }

    inputElements = userInput.querySelectorAll('input[type="password"]');
    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = '';
    }

    var selectElements = userInput.querySelectorAll('select');
    for (var i = 0; i < selectElements.length; i++) {
        selectElements[i].selectedIndex = 0;
    }

    var inputDate = document.getElementById('userInput9');
    inputDate.value = fmtTodayDay;
}

async function Refresh사용자리스트() {
    var day = fmtTodayDay.replace(/-/g, "");
    user = await GetData('SELECT * FROM T_USER');

    $('#posInput7').children().remove();
    for (let i = 0; i < user.length; i++) {
        if (user[i].DS_WORK_LEAVE >= day) {
            selectEl = document.querySelector("#posInput7");
            objOption = document.createElement("option");
            objOption.text = user[i].NM_USER;
            objOption.value = user[i].ID_USER;
            selectEl.options.add(objOption);
            selectEl.selectedIndex = 0;
        }
    }

    if (document.getElementById('userDept').value !== "-1") {
        user = user.filter(t => t.CD_DEPT_SPRT === document.getElementById('userDept').value);
    }

    if (document.getElementById('userPosition').value !== "-1") {
        user = user.filter(t => t.FG_DUTY === document.getElementById('userPosition').value);
    }

    // if (cbo사용자리스트_퇴사자.value !== "0") {
    //   var _퇴사자구분 = parseInt(cbo사용자리스트_퇴사자.value);
    //   var str기준일자 = "99999999";

    //   switch (_퇴사자구분) {
    //     case 1: // 퇴사자 제외
    //       u = u.filter(t => t.DS_WORK_LEAVE >= str기준일자);
    //       break;
    //     case 2: // 퇴사자만 검색
    //       u = u.filter(t => t.DS_WORK_LEAVE < str기준일자);
    //       break;
    //   }
    // }

    // grd사용자리스트.DataSource = u;

    // if (beforeHandle >= 0) {
    //     gv사용자리스트.FocusedRowHandle = beforeHandle;
    // }

    userPos = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '73'`);

    $("#userList").empty();
    for (let i = 0; i < user.length; i++) {
        html = '';
        html += '<tr onclick="Get사용자정보Btn(this, ' + i + ')">';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + user[i].ID_USER + '</td>';
        html += '<td>' + user[i].NM_USER + '</td>';
        lst1 = userDept.filter(t => t.CD_DEPT_SPRT === user[i].CD_DEPT_SPRT);
        html += '<td>' + lst1[0].NM_DEPT_SPRT + '</td>';
        lst2 = userPos.filter(t => t.CD_CODE_DTL == user[i].FG_DUTY);
        html += '<td>' + lst2[0].NM_CODE_DTL + '</td>';
        $("#userList").append(html);
    }

    t_USER_AUTH = await GetData('select * from T_USER_AUTH');
    for (let i = 0; i < authorityCheckboxes.length; i++) {
        authorityCheckboxes[i].checked = false;
    }
}

async function Save사용자정보() {
    var str사용자ID = document.getElementById('userInput1').value.trim();
    var str사용자성명 = document.getElementById('userInput3').value.trim();
    var str사용자비번 = document.getElementById('userInput2').value.trim();

    if (str사용자ID === "") {
        alert("저장 실패, 사용자ID를 입력하세요.");
        return;
    }

    if (str사용자성명 === "") {
        alert("저장 실패, 사용자 이름을 입력하세요.");
        return;
    }

    //if (isNew사용자 && (str사용자비번 === "" || str사용자비번 === fakePassword)) {
    if (isNew사용자 && str사용자비번 === "") {
        alert("저장 실패, 사용자 비밀번호를 입력하세요.");
        return;
    }

    var t_user = user.find(t => t.ID_USER === str사용자ID);

    if (t_user !== undefined) {
        if (isNew사용자) {
            alert("저장 실패, 중복되는 ID입니다.\n다른 ID를 입력해 주세요.");
            return;
        } else {
            if (confirm("변경 내용을 되돌릴 수 없습니다.\n변경하시겠습니까?") == false) {
                return;
            }
        }
    } else {
        t_user = new T_USER();

        //t_user.ID_RGST = this.담당자ID;
        t_user.ID_RGST = 'admin';  //로그인 된 정보의 아이디를 넣어줘야함(수정 필요)
    }

    t_user.DT_RGST = fmtTodaySec;
    //t_user.ID_UPDT = this.담당자ID;
    t_user.ID_UPDT = 'admin'; //로그인 된 정보의 아이디를 넣어줘야함(수정 필요)
    t_user.DT_UPDT = fmtTodaySec;
    t_user.ID_USER = str사용자ID;
    if (document.getElementById('userInput2').value !== fakePassword) {
        t_user.PW_USER_ENC = document.getElementById('userInput2').value;
        t_user.DS_PW_CHANGE = fmtTodayDay.replace(/-/g, "");
    }

    t_user.NM_USER = str사용자성명;
    t_user.NM_USER_ENG = document.getElementById('userInput4').value;
    //t_user.NO_BIZ_ENC = _db.PC_EncryptNoJumin(MonoSystemConstant.EncryptKey, document.getElementById('txt사용자정보_주민번호').value.replace(/-/g, ""));
    t_user.NO_BIZ_ENC = document.getElementById('userInput5').value.replace(/-/g, "");
    var selectOption = document.getElementById('userInput7');
    var value = selectOption.options[selectOption.selectedIndex].value;
    t_user.CD_DEPT_SPRT = value;
    t_user.FG_DUTY = document.getElementById('userInput8').selectedIndex;
    t_user.FG_PSITN = document.getElementById('userInput21').selectedIndex;
    // t_user.FG_AUTH = chk사용자정보_관리자권한.checked ? 1 : 0;
    t_user.FG_AUTH = 0;
    t_user.FG_WORK_TYPE = document.getElementById('userInput22').selectedIndex;
    t_user.DS_WORK_JOIN = document.getElementById('userInput9').value === '' ? "99999999" : document.getElementById('userInput9').value.replace(/-/g, "");
    t_user.DS_WORK_LEAVE = document.getElementById('userInput10').value === '' ? "99999999" : document.getElementById('userInput10').value.replace(/-/g, "");
    t_user.NO_LCNSE = document.getElementById('userInput11').value;
    t_user.NO_LCNSE_SPCL = document.getElementById('userInput12').value;
    t_user.DS_BIRTH = document.getElementById('userInput6').value === '' ? "99999999" : document.getElementById('userInput6').replace(/-/g, "");
    t_user.BL_BIRTH_LUNAR = document.getElementById('userInput23').checked;
    t_user.NO_ZIP = document.getElementById('userInput13').value;
    t_user.DC_ADDR = document.getElementById('userInput14').value;
    t_user.DC_ADDR_DTL = document.getElementById('userInput15').value;
    t_user.NO_TEL = document.getElementById('userInput16').value;
    t_user.NO_MOBILE = document.getElementById('userInput17').value;
    t_user.EMAIL_USER = document.getElementById('userInput19').value;
    t_user.DC_REMARK = document.getElementById('userInput20').value;
    t_user.BL_ONCALL = document.getElementById('userInput24').checked;
    t_user.BL_VSTN_DOCT = document.getElementById('userInput25').checked;
    t_user.BL_CHUNA = document.getElementById('userInput26').checked;
    t_user.NO_TEL_HSPTL = document.getElementById('userInput18').value;

    // if (img_사용자정보_서명.Image !== null) {
    //     var canvas = document.createElement('canvas');
    //     canvas.width = img_사용자정보_서명.Image.width;
    //     canvas.height = img_사용자정보_서명.Image.height;
    //     var ctx = canvas.getContext('2d');
    //     ctx.drawImage(img_사용자정보_서명.Image, 0, 0);

    //     var imgData = canvas.toDataURL();

    //     t_user.IMG_SIGN = imgData;
    // } else {
    //     t_user.IMG_SIGN = null;
    // }

    //t_USER_AUTH = await GetData('select * from T_USER_AUTH');

    let newAuthList = [];
    for (let i = 0; i < authorityBtns.length; i++) {
        var auth = t_USER_AUTH.find(item => item.ID_USER_AUTH_MSTR === authorityBtns[i].value && t.ID_USER === str사용자ID);
        var newAuth;
        if (!auth || auth.BL_AUTH !== authorityCheckboxes[i].checked) {
            newAuth = {
                ID_USER_AUTH_MSTR: authorityBtns[i].value === '' ? '9999' : authorityBtns[i].value,
                ID_USER: str사용자ID,
                BL_FAV: auth ? auth.BL_FAV : false,
                NO_FAV_ORDER: auth ? auth.NO_FAV_ORDER : 0,
                BL_AUTH: authorityCheckboxes[i].checked,
                //ID_RGST: this.담당자ID,
                ID_RGST: 'admin',
                DT_RGST: fmtTodaySec
            };

            //즐겨찾기 설정 복사 후 이전 레코드의 즐겨찾기 설정은 초기화(게시판 즐겨찾기 중복 표시 방지)
            if (auth) {
                newAuth.BL_FAV = auth.BL_FAV;
                newAuth.NO_FAV_ORDER = auth.NO_FAV_ORDER;

                auth.BL_FAV = false;
                auth.NO_FAV_ORDER = 0;
            }
        }

        newAuthList.push(newAuth);
    }

    if (isNew사용자) {
        await Set_CreatePostData('T_USER', t_user);
        await Set_CreateArryPostData('T_USER_AUTH', newAuthList);
        // frmSBInfo.ShowInfomation("[사용자 추가]", "사용자 정보가 추가되었습니다.");
        alert('사용자 정보가 추가되었습니다.');
        isNew사용자 = false;
    } else {
        await Set_UpdatePostData('T_USER', t_user);
        await Set_UpdatePostData('T_USER_AUTH', newAuthList);
        // frmSBInfo.ShowInfomation("[수정 완료]", "사용자 정보 수정이 완료되었습니다.");
        alert('사용자 정보 수정이 완료되었습니다.');
    }

    Refresh사용자리스트();
}

function Get사용자정보Btn(target, idx) {
    isNew사용자 = false;
    for (let i = 0; i < authorityCheckboxes.length; i++) {
        authorityCheckboxes[i].checked = false;
    }

    ComnTbClick(target, 9, idx);
}

async function Delete사용자정보() {
    u = user.filter(t => t.ID_USER === document.getElementById('userInput1').value);

    if (u.length !== 0) {
        if (confirm(`삭제\n사용자정보 : ${u[0].ID_USER} (${u[0].NM_USER})\r\n삭제하시겠습니까?`) == false) {
            return;
        }

        ManagerPopupOn(u[0].ID_USER, 0);
    }
}

async function RefreshTreeList사용자권한(value) {
    let id_user = value;

    let userAuth = await GetData(`SELECT * FROM T_USER_AUTH WHERE ID_USER = '${id_user_value}'`);
    console.log(userAuth);
}

//#endregion
//#region 병원관리(사용자/부서 설정 - 부서정보)
function New부서정보() {
    Init부서정보();
    alert('내용 작성 후, [저장]버튼을 클릭하면\n신규 부서가 추가 됩니다.');
    SelectDisabled(document.getElementById('posInput3'), false);
    Cbo부서설정_구분_EditValueChanged(document.getElementById('posInput3').value);
    ChangeChargeValue();
}

function Init부서정보() {
    isNew부서 = true;
    var posInput = document.getElementById('posInput');

    var inputElements = posInput.querySelectorAll('input[type="text"]');
    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = '';
    }

    var selectElements = posInput.querySelectorAll('select');
    for (var i = 0; i < selectElements.length; i++) {
        selectElements[i].selectedIndex = 0;
    }
}

async function Refresh부서리스트() {
    userDept = await GetData('SELECT * FROM T_DEPT_SPRT');
    for (let i = 0; i < userDept.length; i++) {
        selectEl = document.querySelector("#userDept");
        objOption = document.createElement("option");
        objOption.text = userDept[i].NM_DEPT_SPRT;
        objOption.value = userDept[i].CD_DEPT_SPRT;
        //objOption.setAttribute("EditValue", data[i].CD_CODE_DTL);
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    for (let i = 0; i < userDept.length; i++) {
        selectEl = document.querySelector("#userInput7");
        objOption = document.createElement("option");
        objOption.text = userDept[i].NM_DEPT_SPRT;
        objOption.value = userDept[i].CD_DEPT_SPRT;
        //objOption.setAttribute("EditValue", data[i].CD_CODE_DTL);
        selectEl.options.add(objOption);
        selectEl.selectedIndex = 0;
    }

    if (document.getElementById('posAllCheck').checked) {
        department = await userDept;
    }
    else {
        department = await userDept.filter(t => t.BL_USE === 1);
    }

    $("#positionList").empty();

    for (let i = 0; i < department.length; i++) {
        html = '';
        html += '<tr onclick="Get부서정보(this, ' + i + ')">';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + department[i].NO_ORDER + '</td>';
        select = document.getElementById('posInput3');
        for (let j = 0; j < select.options.length; j++) {
            if (select.options[j].value === department[i].CD_DEPT_GRP) {
                html += '<td>' + select.options[j].text + '</td>';
                break;
            }
        }
        html += '<td>' + department[i].NM_DEPT_SPRT + '</td>';
        html += '<td>' + department[i].ID_USER_MSTR + '</td>';
        document.getElementById('posInput2').value = department[i].CD_TREAT_SBJT;
        select = document.getElementById('posInput2');
        idx = Number(department[i].CD_TREAT_SBJT);
        html += '<td>' + select[idx].text + '</td>';
        if (department[i].BL_USE === 1) {
            html += '<td><input type="checkbox" checked></td>';
        }
        else {
            html += '<td><input type="checkbox"></td>';
        }
        html += '<td>' + department[i].DC_REMARK + '</td>';

        $("#positionList").append(html);
    }
}

async function Save부서정보() {
    // if (!cbo부서설정_구분) {
    //     alert('저장실패, 부서 구분을 선택해 주세요.');
    //     return;
    // }

    var value = document.getElementById('posInput1').value;
    if (value.length !== 4) {
        alert('저장실패\n지원코드를 확인하세요.\n(4자리숫자)');
        return;
    }

    if (document.getElementById('posInput4').value === '') {
        alert('저장실패\n지원명칭을 입력하세요.');
        return;
    }

    // if (cbo부서설정_구분 === 지원구분Constant.진료실00 && !cbo부서설정_담당자) {
    //     alert('저장실패\n진료실 담당 의사를 선택해 주세요.');
    //     return;
    // }

    var dept = userDept.find(t => t.CD_DEPT_SPRT === document.getElementById('posInput1').value);

    if (dept !== undefined) {
        if (isNew부서) {
            alert('저장 실패\n지원코드가 중복됩니다.')
            return;
        } else {
            if (confirm("변경 내용을 되돌릴 수 없습니다.\n변경하시겠습니까?") == false) {
                return;
            }
        }
    } else {
        dept = new T_DEPT_SPRT();
    }

    dept.NO_ORDER = document.getElementById('posInput6').value === "" ? 0 : document.getElementById('posInput6').value;
    dept.CD_DEPT_SPRT = document.getElementById('posInput1').value;
    dept.CD_DEPT_GRP = document.getElementById('posInput3').value;
    dept.NM_ALIAS = document.getElementById('posInput5').value;
    dept.NM_DEPT_SPRT = document.getElementById('posInput4').value;
    dept.BL_USE = document.getElementById('posInput8').checked;
    dept.DC_REMARK = document.getElementById('posInput9').value;
    //dept.ID_UPDT = MonoChart.Common.CommonUtils.MonoChartSettingManager.instance().Setting.EmrUser.ID_USER;
    dept.ID_UPDT = 'admin';
    dept.DT_UPDT = fmtTodaySec;
    dept.ID_USER_MSTR = document.getElementById('posInput5').value;
    dept.CD_TREAT_SBJT = document.getElementById('posInput2').value;
    //dept.BL_AUTH_LOCK_CHART_APP = chk부서설정_평가표잠금권한.checked;


    if (isNew부서) {
        await Set_CreatePostData('T_DEPT_SPRT', dept)
        alert('부서 추가\n부서 정보가 추가되었습니다.');
        isNew부서 = false;
    } else {
        await Set_UpdatePostData('T_DEPT_SPRT', dept)
        alert('수정 완료\n부서 정보 수정이 완료되었습니다.');
    }

    Refresh부서리스트();
}

async function Get부서정보(target, idx) {
    SelectDisabled(document.getElementById('posInput3'), true);
    ComnTbClick(target, 10, idx);
}

async function Delete부서정보() {
    cdDeptSprt = userDept.filter(t => t.CD_DEPT_SPRT === document.getElementById('posInput1').value);

    if (cdDeptSprt.length !== 0) {
        if (confirm(`삭제\n부서정보 : ${cdDeptSprt[0].NM_DEPT_SPRT} (${cdDeptSprt[0].CD_DEPT_SPRT})\r\n삭제하시겠습니까?`) == false) {
            return;
        }

        ManagerPopupOn(cdDeptSprt[0].CD_DEPT_SPRT, 1);
    }
}

function ChangeChargeValue() {
    document.getElementById('posInput5').value = document.getElementById('posInput7').value;
}

async function Cbo부서설정_구분_EditValueChanged(value) {
    if (isNew부서) {
        var ID_DEPT_IN_GROUP = await GetNewID_DEPT_SPRT(value);

        if (parseInt(ID_DEPT_IN_GROUP) >= 99) {
            alert('오 류\n그룹 내 생성할 수 있는 최대 부서 개수를 초과하였습니다.\n관리자에게 문의하세요.')
            Init부서정보();
            return;
        }

        document.getElementById('posInput1').value = value + ID_DEPT_IN_GROUP.toString().padStart(2, '0');
    }
}

async function GetNewID_DEPT_SPRT(value) {
    var maxCd = await userDept
        .filter(function (t) { return t.CD_DEPT_GRP === value })
        .sort(function (a, b) { return b.CD_DEPT_SPRT - a.CD_DEPT_SPRT; })
        .find(function (t) { return true; });

    var idDeptSprt = maxCd ? parseInt(maxCd.CD_DEPT_SPRT.slice(-2)) : 0;
    return (idDeptSprt + 1).toString();
}

function SelectDisabled(select, disabled) {
    select.disabled = disabled;

    if (select.disabled) {
        document.getElementById('posInput3').style.backgroundColor = 'rgb(211,227,243)';
        document.getElementById('posInput3').style.color = 'rgb(67, 75, 82);';
    }
    else {
        document.getElementById('posInput3').style.backgroundColor = 'rgb(245,248,251)';
    }

}
//#endregion
//#endregion
//#endregion
//#region 기초정보
function RadiologyBtnOnOff(idx) {
    for (let i = 0; i < radiologyBtns.length; i++) {
        radiologyBtns[i].style.backgroundColor = 'rgb(211, 227, 243)';
    }

    radiologyBtns[idx].style.backgroundColor = 'rgb(255, 255, 255)';
}
//#endregion
//#region 관리자비밀번호
async function ManagerPopupOn(value, idx) {
    let passwordPrompt = document.getElementById("passwordPrompt");
    passwordPrompt.style.display = "block";

    while (passwordPrompt.style.display !== 'none') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    ManagerPassAlert(value, idx);
}

function OnClickManagerPassBtn(bool) {
    password = '';
    if (bool) {
        let passwordPrompt = document.getElementById("passwordPrompt");
        passwordPrompt.style.display = "block";
    }

    passwordPrompt.style.display = "none";
}

async function ManagerPassAlert(value, idx) {
    const passwordInput = document.getElementById("managerPassInput");
    password = passwordInput.value;

    if (password === '') {
        alert('경고\n관리자 비밀번호를 입력하세요.');
    }
    else if (password !== managerPassword) {
        alert('경고\n관리자 비밀번호를 다시 확인해주세요.');
    }
    else {
        switch (idx) {
            case 0: //병원관리(사용자/부서 설정 - 사용자정보)
                await PostData(`DELETE FROM T_USER WHERE ID_USER = '${u[0].ID_USER}'`);
                Refresh사용자리스트();
                break;
            case 1: //병원관리(사용자/부서 설정 - 부서정보)
                await PostData(`DELETE FROM T_DEPT_SPRT WHERE CD_DEPT_SPRT = '${value}'`);
                Refresh부서리스트();
                break;
            case 2:
                break;
        }

        alert("확인\n삭제되었습니다.")
    }

    passwordInput.value = '';
    return;
}
//#endregion
// #region 공통
async function TableClick(filteredData, onlyOne = false) {
    if (onlyOne) {
        window.opener.PatientInquiryBtn(filteredData);
        PopupClose(false);
    }
    else {
        var td = await ComnTbClick(filteredData);
        if (event.detail === 2) {
            var lst = tempfilteredData.filter(t => t.CD_CHART == td[1].innerHTML);
            window.opener.PatientInquiryBtn(lst[0]);
            PopupClose(false);
        }
    }
}

$('#waitingPatientInfoDoctorOffice').change(RefreshTables);

function RefreshTables() {
    try {
        document.getElementById('waitingPatientInfoDoctor').selectedIndex = document.getElementById('waitingPatientInfoDoctorOffice').selectedIndex;
    } catch (error) { }
}

function PopupClose(isAlert = true) {
    popupList[popIdx].style.display = 'none';
    if (isAlert != false) {
        alert("환자 정보가 없습니다.");
    }
    window.close();
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}

// function ConvertInt(dataArray) {
//     // 배열을 Uint8Array로 변환
//     let uint8Array = new Uint8Array(dataArray);

//     // Uint8Array를 문자열로 변환
//     let text = String.fromCharCode.apply(null, uint8Array);

//     // 문자열을 10진수로 변환
//     let decimalValue = parseInt(text);

//     return decimalValue;
// }

//기간 날짜 구하기
function SetDay() {
    var threeMonthsAgo = new Date(); // 세 달 전 날짜를 새로운 Date 객체로 생성
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // 세 달 전으로 설정
    var threeMonthsAgoString = threeMonthsAgo.toISOString().substring(0, 10); // yyyy-MM-dd 형식으로 문자열로 변환

    for (let i = 0; i < document.getElementsByName("today").length; i++) {
        document.getElementsByName('today')[i].value = fmtTodayDay;
    }

    for (let i = 0; i < document.getElementsByName("threeMonthsAgo").length; i++) {
        document.getElementsByName('threeMonthsAgo')[i].value = threeMonthsAgoString;
    }
}

function FmtTegDate(day) {
    result = day.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    return result;
}

//날짜 시간까지..
function FmtTegDateTime(day) {
    temp = day.substring(0, 19);

    return temp.replace('T', ' ');
}

function Kakaopost() {
    new daum.Postcode({
        oncomplete: function (data) {
            console.log(data);
            document.querySelector("#userInput13").value = data.zonecode;
            document.querySelector("#userInput14").value = data.address;
        }
    }).open();
}
// #endregion
// #region 공통 테이블 토글 버튼
$(document).ready(function () {
    $('ul.deadlineMgrTabs li').click(function () {  //마감관리 탭
        var tab_id = $(this).attr('data-tab');

        $('ul.deadlineMgrTabs li').removeClass('current');
        $('.deadlineMgrTab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })

    $('ul.hospitalMGRTabs li').click(function () {  //병원정보 탭
        var tab_id = $(this).attr('data-tab');
        $('ul.hospitalMGRTabs li').removeClass('current');
        $('.hospitalMGRTab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');

        if (tab_id == 'hospitalMGRTab-1') {
            hospitalMGRBtnOnOff(0);
        }
        else if (tab_id == 'hospitalMGRTab-2') {
            hospitalMGRBtnOnOff(1);
        }
        else {
            hospitalMGRBtnOnOff(2);
        }
    })
    $('ul.basicInfoTabs li').click(async function () { //기초정보탭
        var tab_id = $(this).attr('data-tab');
        $('ul.basicInfoTabs li').removeClass('current');
        $('.basicInfoTab-content').removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
        if (tab_id == 'basicInfoTab-3') {
            RefreshDX_기준(true);
            RefreshDX_단축(true);
            var filteredData = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = 10 AND BL_USE_DTL = 1 ORDER BY CD_CODE_DTL`);
            filteredData.sort((a, b) => a.CD_CODE_DTL - b.CD_CODE_DTL);
            for (let i = 0; i < filteredData.length; i++) {
                selectEl = document.querySelector("#dxInput6");
                objOption = document.createElement("option");
                objOption.text = TableSubstring(`${filteredData[i].CD_CODE_DTL} : ${filteredData[i].NM_CODE_DTL}`, 50);
                objOption.title = `${filteredData[i].CD_CODE_DTL} : ${filteredData[i].NM_CODE_DTL}`;
                objOption.value = filteredData[i].CD_CODE_DTL;
                selectEl.options.add(objOption);
                selectEl.selectedIndex = 0;
            }
        }
        else if (tab_id == 'basicInfoTab-4') {
            UsageInit();
        }
        else if (tab_id == 'basicInfoTab-6') {
            BundleInit();
        }
        else if (tab_id == 'basicInfoTab-7') {
            HsptlAddInit();
        }
        else if (tab_id == 'basicInfoTab-8') {
            ConsignmentCompanyInit();
        }
        else if (tab_id == 'basicInfoTab-9') {
            SpecifiInit();
            ptntTypeInit();
        }
    })

    $('ul.slipCodeTabs li').click(function () {  //슬립코드 탭
        var tab_id = $(this).attr('data-tab');
        $('ul.slipCodeTabs li').removeClass('current');
        $('.slipCodeTab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })
})

//처방코드 체크박스
recipeCheckboxs.forEach((checkbox, idx) => {
    checkbox.addEventListener('change', () => {
        RecipeCheckbox(idx);
    });
});

function RecipeCheckbox(selectedIdx) {
    recipeCheckboxs.forEach((checkbox, idx) => {
        checkbox.checked = (idx === selectedIdx);
    });
}

var accordionButtons = document.querySelectorAll('.accordion');

accordionButtons.forEach(function (button) {
    var checkbox = button.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    button.addEventListener('click', function () {
        var buttonId = this.id;
        var panel = document.querySelector(`.panel#${buttonId}`);

        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
});

//권한설정
async function AuthoritySettingInit() {
    t_USER_AUTH_MSTR = await GetData('SELECT * FROM T_USER_AUTH_MSTR');

    var container = document.getElementById("accordionContainer1");
    authorityBtns = container.querySelectorAll("button");
    authorityCheckboxes = container.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < authorityBtns.length; i++) {
        var buttonContent = authorityBtns[i].innerHTML;
        var strippedContent = buttonContent.replace(/<input.*?>/, '');
        // 값 찾기
        var value = t_USER_AUTH_MSTR.find(item => item.NM_AUTH === strippedContent.trim());

        if (value) {
            authorityBtns[i].value = value.ID_USER_AUTH_MSTR;
        }
        else {
            return;
        }
    }
}

//#endregion
//#region 출력
function Print(t_treat) {
    for (let i = 0; i < t_treat.length; i++) {
        var html = '';
        html += `<tr style="border: none;">`;
        html += `<td>${t_treat[i].처방번호}</td>`;
        html += `<td>${t_treat[i].처방코드}</td>`;
        html += `<td>${t_treat[i].표시명칭}</td>`;
        html += `<td>${t_treat[i].투여량1회}</td>`;
        html += `<td>${t_treat[i].투여횟수}</td>`;
        html += `<td>${t_treat[i].투여일수}</td>`;
        html += `<td></td>`;
        html += `<td><input type="checkbox"${t_treat[i].원외구분 == undefined || t_treat[i].원외구분 == 0 ? '' : 'checked'} readonly></td>`;
        html += `<td><input type="checkbox"${t_treat[i].파우더 == undefined || t_treat[i].파우더 == 0 ? '' : 'checked'} readonly></td>`;
        html += `<td>${t_treat[i].믹스구분}</td>`;
        html += `<td>${t_treat[i].예외구분}</td>`;
        html += `<td>${t_treat[i].메모}</td>`;
        html += `<td>${t_treat[i].집계구분}</td>`;
        html += `<td>${t_treat[i].급여적용}</td>`;
        html += `<td>${t_treat[i].단가}</td>`;
        html += `<td>${t_treat[i].의사사인}</td>`;
        $("#print").append(html);
    }

    window.print();
}
//#endregion
//#region 진료비납입확인서
async function Refresh진료납입확인서(chart) {
    document.getElementById('lue납입차트번호').value = chart.CD_CHART;
    document.getElementById('lue납입성명').value = chart.NM_CHART;
    document.getElementById('lue납입주민').value = GetJumin(chart.NO_JUMIN_ENC.data);

    var 조회시작일자 = document.getElementById('dt납입조회시작일자').value;
    var 조회종료일자 = document.getElementById('dt납입조회종료일자').value;

    var query = await GetData(`SELECT 
    1 AS 선택,
    0 AS 순서,
    '' AS 진료_조제일자,
    ac.DS_CHRG_TREAT_START AS 진료시작일자,
    ac.DS_CHRG_TREAT_END AS 진료종료일자,
    ac.ID_ACCEPTIN AS 구분,
    '' AS 외래입원구분,
    ac.MNY_TOTL + ac.MNY_TOTL_GRNT_NOT AS 진료비내역_총진료비,
    ac.MNY_CHRG AS 진료비내역_보험자부담,
    0 AS 환자부담액_급여,
    ac.MNY_GRANT_PTNT_PAY AS 환자부담액_급여_일부,
    ac.MNY_ALL_PTNT_PAY AS 환자부담액_급여_전액,
    ac.MNY_TOTL_GRNT_NOT AS 환자부담액_비급여,
    ac.MNY_CASH_RCPT AS 현금수납액,
    ac.MNY_ACNT_INPUT AS 계좌이체,
    0 AS 소득공제_현금,
    ac.MNY_CARD_RCPT AS 소득공제_카드
FROM 
    T_ACCEPT_CHRG_PREV ac
WHERE 
    ac.CD_CHART = ${chart.CD_CHART}
    AND (
        (ac.ID_ACCEPTIN <= 0 
            AND ac.DS_CHRG_TREAT_START >= ${조회시작일자}
            AND ac.DS_CHRG_TREAT_START <= ${조회종료일자})
        OR 
        (ac.ID_ACCEPTIN > 0 
            AND ac.DS_DLVRY >= ${조회시작일자} 
            AND ac.DS_DLVRY <= ${조회종료일자})
    )
ORDER BY 
    ac.DS_CHRG_TREAT_START`);

    RefreshTable('grd납입확인서');
    for (let i = 0; i < query.length; i++) {
        html = '';
        html += `<tr ${SetJson(query[i])}>`;
        html += `<td>${i + 1}</td> `;
        html += CreateTableCheckbox(true);
        html += CreateTableTd(query[i].DS_DLVRY, false);
        html += CreateTableTd('외래', false);
        html += CreateTableTd(query[i].진료비내역_총진료비, false);
        html += CreateTableTd(query[i].진료비내역_보험자부담, false);
        html += CreateTableTd(query[i].환자부담액_급여_일부, false);
        html += CreateTableTd(query[i].환자부담액_비급여, false);
        html += CreateTableTd(query[i].현금수납액, false);
        html += CreateTableTd(query[i].소득공제_카드, false);
        html += '</tr>';
        $("#grd납입확인서").append(html);
    }
}
//#endregion

async function Get_T_CHART(value) {
    t_chart = await PatientSearchBtn(value, true);

    switch (window.opener.popupIdx) {
        case 21:
            Refresh진료납입확인서(t_chart);
            return;
    }
}