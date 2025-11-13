let temp대기환자정보리스트;
let t_TREAT;
let t_TREAT_DX;
let t_ACCEPT;
var t_CHART;
let t_TREAT_NOTE;
let checkChartNum = undefined;
let clickPatient = undefined;

let titleName;
let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화
let tempInTreatment;
let InTreatmentPatientInfo;
let tempColumn;
let calendarAccept;
let diagTalbeList = [];
let recipeLstToAdd = [];
var treatList;

var acc = document.getElementsByClassName("accordion");

//산정특례본인부담률
var teductibleRateOpList = [['0:산정특례구분', '0'],
['1:본인부담면제', '1'],
['2:본인부담5%', '2'],
['8:본인부담3%', '8'],
['3:본인부담10%', '3'],
['4:본인부담20%', '4'],
['5:약가본인30%(병원)', '5'],
['6:본인부담40%', '6'],
];

let tempTreatmentHistoryList;
let treatmentHistoryListCnt;
let treatmentHistoryListIdx = -1;

var currentValue;
var dataName;

var beforeAccept = ''; //이전 환자 Accept

let interval;
let intervalTime;

var acceptTextarea; //본인부담산정식
var acceptInput1; //수납지시금액
var acceptInput2; //수납할금액
var acceptInput3; //감면(할인)금액
var acceptInput4; //환자본인부담액
var acceptInput5; //이미수납한금액
var acceptInput6; //유지비잔액
var acceptInput7; //수납메모

async function Start() {
  console.log('common Start');
  BuildCalendar();
  SetDay();
  selectOptionCreate();
  if (document.getElementById('receptionRoom')) {
    ReceiptStart();
  }
  else if (document.getElementById('doctorRoom')) {
    DiagnosisStart();
  }

  // CreateFavoritesBtn();
  FmtTodayDay();

  StartWaitingPatientTableListCreate();
  InitInterval();
}

function SetInterval() {
  interval = setInterval(function () {
    StartWaitingPatientTableListCreate();
  }, intervalTime);
}

async function InitInterval() {
  info = await T_HSPTL_INFO.find(t => t.NM_HSPTL_INFO === '새로고침시간설정');
  intervalTime = info.VL_HSPTL_INFO;

  if (interval !== undefined) {
    clearInterval(interval);
  }

  SetInterval();
}

function TableClear() {
  $("#holdOnTable").empty();
  $("#patientList").empty();
  $("#inTreatmentTable").empty();
  $("#completeTable").empty();
  $("#acceptStayTable").empty();
  $("#acceptCompleteTable").empty();
}

//상단메뉴 - 화면관리
function checkboxOnOff(id) {

  let str = id;
  let replaced_str = str.replace('check', '');
  if (document.getElementById(id).checked == true) {
    document.getElementById(replaced_str).style.display = 'block';
  }
  else {
    document.getElementById(replaced_str).style.display = 'none';
  }
}

//환자기본정보 - 환자조회 팝업
function PatientInquiryPopup(value) {
  PopupOn(0, false, 810, 750, value);
}

//환자기본정보 - 환자조회 리스트 만들기
function PatientTableListCreate(idx, patientInfo) {
  var idIdx = idx + 1;
  var html = '';

  html += '<tr>';
  html += '<td></td>';
  html += '<td id="차트번호' + idIdx + '">' + patientInfo.차트번호 + '</td>';
  html += '<td id="환자이름' + idIdx + '">' + patientInfo.환자이름 + '</td>';
  html += '<td id="주민번호' + idIdx + '">' + patientInfo.주민번호앞 + '-' + patientInfo.주민번호뒤 + '</td>';
  html += '<td id="최종내원일' + idIdx + '">' + patientInfo.최종내원일 + '</td>';
  html += '<td id="주치의' + idIdx + '">' + patientInfo.주치의 + '</td>';
  html += '<td id="병실' + idIdx + '">' + patientInfo.병실 + '</td>';
  html += '<td id="피보험자' + idIdx + '">' + patientInfo.피보험자 + '</td>';
  html += '<td id="보험구분' + idIdx + '">' + patientInfo.보험구분.substr(2, 2) + '</td>';
  patientInfo.선택 = '<button id="tableBtn' + idIdx + '" class= "tableBtn" style="width :100%; height:100%;" onclick="TableClick(id);">선택</button>'
  html += '<td id="선택' + idIdx + '">' + patientInfo.선택 + '</td>';
  html += '</tr>';

  $("#patientInfoList").append(html);
}

async function Get대기환자QueryCommon() {
  let ds진료일자;
  try {
    //console.log('Get대기환자QueryCommon');
    if (document.getElementById('receptionRoom')) {
      ds진료일자 = document.getElementById('waitingPatientDate').value;
    }
    else if (document.getElementById('doctorRoom')) {
      ds진료일자 = document.getElementById('patientListDate').value;
    }
    else if (document.getElementById('storageRoom')) {
      ds진료일자 = document.getElementById('patientListDate').value;
    }

    ds진료일자 = ds진료일자.replace(/-/g, "");

    temp대기환자정보리스트 = await GetData(`SELECT
    a.NO_ACCEPT,  -- 접수번호
    a.CD_CHART,    -- 차트번호
    c.NM_CHART AS NM_CHART,  -- 이름
    a.DC_AGE_PTNT,  -- 나이
    a.FG_ISRC,  -- 보험구분
    a.FG_ISRC_KIND,  -- 보험종별구분  
    a.CD_DEPT_SPRT,  -- 진료실코드
    a.TY_TREAT_STAT,  -- 진료상태    
    CONVERT_TZ(a.DT_RGST, '+00:00', '-09:00') AS DT_RGST,    -- 접수일시
    a.DS_TREAT,  -- 접수일자
    a.TY_RCPT_STAT,  -- 수납상태
    a.DC_TRANS_MEMO,  -- 전달사항
    a.TY_CHCKUP,  -- 검진구분
    a.CD_TREAT_SBJT,  -- 진료과목
    a.TY_FRST_TREAT,  -- 진료
    a.NO_TREAT,
    CONVERT_TZ(a.DT_TREAT_TIME, '+00:00', '-09:00') AS DT_TREAT_TIME,  -- 진료한 시간 (-9시간)
    CONVERT_TZ(a.DT_TREAT_START, '+00:00', '-09:00') AS DT_TREAT_START,  -- 접수 시작시간 (-9시간)
    a.BL_TREAT_NOW  -- 현재 진료중
FROM
    T_ACCEPT AS a
LEFT JOIN
    T_CHART AS c ON a.CD_CHART = c.CD_CHART
WHERE
    a.DS_TREAT = '${ds진료일자}'
ORDER BY
    DT_RGST`);
    // AND
    // a.TY_RCPT_STAT = '${수납상태구분Enum.TY00미수납}'
    return temp대기환자정보리스트;
  } catch (error) {
    console.log(error);
  }
}

async function StartWaitingPatientTableListCreate() {
  beforeAccept = '';
  try {
    console.log('StartWaitingPatientTableListCreate');
    var pInfo = await Get대기환자QueryCommon();

    RefreshTables(false);
 
    for (let i = 0; i < pInfo.length; i++) {
      var html = '';
      if (parseInt(pInfo[i].TY_RCPT_STAT) == 수납상태구분Enum.TY00미수납) {
        html += `<tr ${SetJson(pInfo[i])} onclick="WaitingPatientTableBtn(this);">`;
        html += '<td id="' + pInfo[i].NO_ACCEPT + '"></td>';
        html += '<td>' + TableSubstring(pInfo[i].CD_CHART) + '</td>';
        html += '<td title=' + pInfo[i].NM_CHART + '>' + TableSubstring(pInfo[i].NM_CHART) + '</td>';
        html += '<td>' + TableSubstring(pInfo[i].DC_AGE_PTNT) + '</td>';
        html += `<td>${TableSubstring(SetHoursAndMinutes(pInfo[i].DT_RGST))}</td>`;
        html += `<td>${TableSubstring(Get_TY_FRST_TREAT(pInfo[i].TY_FRST_TREAT))}</td>`;
        html += `<td>${TableSubstring(Get_FG_ISRC_KIND(pInfo[i].FG_ISRC, pInfo[i].FG_ISRC_KIND))}</td>`;
        html += `<td>${TableSubstring(Get_CD_DEPT_SPRT(pInfo[i].CD_DEPT_SPRT))}</td>`;
        html += `<td>${TableSubstring(Get_TY_TREAT_STAT(pInfo[i].TY_TREAT_STAT))}</td>`;
        html += `<td title = '${pInfo[i].DC_TRANS_MEMO}'>${TableSubstring(pInfo[i].DC_TRANS_MEMO)}</td>`;
        html += '</tr>';
      }
      else {
        var T_ACCEPT_CHRG_PREV = (await GetData(`SELECT * FROM T_ACCEPT_CHRG_PREV WHERE NO_ACCEPT = ${pInfo[i].NO_ACCEPT}`))[0];
        html += `<tr ${SetJson(pInfo[i])} onclick="WaitingPatientTableBtn(this);">`;
        html += '<td id="' + pInfo[i].NO_ACCEPT + '"></td>';
        html += '<td>' + TableSubstring(pInfo[i].CD_CHART) + '</td>';
        html += '<td title=' + pInfo[i].NM_CHART + '>' + TableSubstring(pInfo[i].NM_CHART) + '</td>';
        html += '<td>' + TableSubstring(pInfo[i].DC_AGE_PTNT) + '</td>';
        html += `<td>${TableSubstring(Get_FG_ISRC_KIND(pInfo[i].FG_ISRC, pInfo[i].FG_ISRC_KIND))}</td>`;
        html += '<td>' + TableSubstring(FmtTodayDay(T_ACCEPT_CHRG_PREV.DT_RCPT), false) + '</td>';
        html += `<td>${TableSubstring(Get_CD_DEPT_SPRT(pInfo[i].CD_DEPT_SPRT))}</td>`;
        html += `<td>${TableSubstring(T_ACCEPT_CHRG_PREV.MNY_TOTL_RCPT)}</td>`;
        html += `<td>${TableSubstring(T_ACCEPT_CHRG_PREV.MNY_CASH_RCPT)}</td>`;
        html += `<td>${TableSubstring(T_ACCEPT_CHRG_PREV.MNY_CARD_RCPT)}</td>`;
      }
      if (document.getElementById('receptionRoom')) {
        switch (pInfo[i].TY_TREAT_STAT) {
          case 진료상태Enum.TY00취소:
            break;
          case 진료상태Enum.TY01접수:
            $("#patientList").append(html);
            break;
          case 진료상태Enum.TY02예약접수:
            break;
          case 진료상태Enum.TY03진료중:
            $("#patientList").append(html);
            break;
          case 진료상태Enum.TY08보류:
            $("#holdOnTable").append(html);
            break;
          case 진료상태Enum.TY09완료:
            switch (pInfo[i].TY_RCPT_STAT) {
              case 수납상태구분Enum.TY00미수납:
                $("#acceptStayTable").append(html);
                break;
              case 수납상태구분Enum.TY01수납:
                $("#completeTable").append(html);
                break;
            }

            break;
        }
      }
      else if (document.getElementById('doctorRoom')) {
        switch (pInfo[i].TY_TREAT_STAT) {
          case 진료상태Enum.TY00취소:
            break;
          case 진료상태Enum.TY01접수:
            $("#patientList").append(html);
            break;
          case 진료상태Enum.TY02예약접수:
            break;
          case 진료상태Enum.TY03진료중:
            $("#inTreatmentTable").append(html);
            if (pInfo[i].BL_TREAT_NOW == 1 && beforeAccept.NO_ACCEPT != pInfo[i].NO_ACCEPT) {
              await DisPlayDiagInfo(pInfo[i]);
            }
            break;
          case 진료상태Enum.TY08보류:
            $("#holdOnTable").append(html);
            break;
          case 진료상태Enum.TY09완료:
            $("#completeTable").append(html);
            break;
        }
      }
      else if (document.getElementById('storageRoom')) {
        switch (pInfo[i].TY_TREAT_STAT) {
          case 진료상태Enum.TY00취소:
            break;
          case 진료상태Enum.TY01접수:
            $("#patientList").append(html);
            break;
          case 진료상태Enum.TY02예약접수:
            break;
          case 진료상태Enum.TY03진료중:
            $("#inTreatmentTable").append(html);
            break;
          case 진료상태Enum.TY08보류:
            $("#holdOnTable").append(html);
            break;
          case 진료상태Enum.TY09완료:
            $("#completeTable").append(html);
            break;
        }
      }
    }

    if (!document.getElementById('receptionRoom') && $("#inTreatmentTable tr").length == 0) {
      BuildCalendar();
    }

    WaitingPatientTabLengthCheck();
  } catch (error) {
    console.log(error);
  }
}

async function DisPlayDiagInfo(pInfo, date = undefined) {
  try {
    if (t_ACCEPT != undefined && t_ACCEPT.NO_ACCEPT == pInfo.NO_ACCEPT) {
      return;
    }

    t_ACCEPT = pInfo;
    t_TREAT = await Get_T_TREAT(t_ACCEPT, date);
    TreatmentDetailsTableCreate(t_TREAT); //처방내역

    t_TREAT_DX = await Get_T_TREAT_DX(t_ACCEPT, date);
    DiseaseDetailsTableCreate(t_TREAT_DX); //상병내역

    CheckDiagTime(t_ACCEPT);

    if (date == undefined) {
      PatientSearchBtn(t_ACCEPT.CD_CHART);
    }

    if (t_ACCEPT.BL_TREAT_NOW = 현재진료중Enum.TY진료중YES) {
      beforeAccept = t_ACCEPT;
    }
  } catch (error) {
    console.log(error);
  }
}

//예약환자 테이블 생성
async function StartRecipeReservationListCreate() {
  RefreshReservationTable(false);
  // const query = `SELECT * FROM T_APPNTMNT WHERE DATE(DT_START) = '${document.getElementById('reservationDate').value}'`; 
  // chart = await GetData('SELECT * FROM T_CHART');
  // t = chart.filter(item => item.CD_CHART === data[0].CD_CHART);

  // let v = {
  //   이름
  // }

  var value;
  if (document.getElementById('receptionRoom')) {
    value = document.getElementById('reservationDate').value;
  }
  else if (document.getElementById('doctorRoom')) {
    value = document.getElementById('patientListDate').value;
  }

  // 쿼리 실행 및 결과 가져오기
  var results = await GetData(`SELECT a.*, c.* FROM T_APPNTMNT a JOIN T_CHART c ON a.CD_CHART = c.CD_CHART WHERE DATE(a.DT_START) = 
  '${value}' AND a.CD_CHART IN (SELECT CD_CHART FROM T_CHART)`);

  for (let i = 0; i < results.length; i++) {
    var html = '';
    html += `<tr value = '${results[i].CD_CHART}' onclick="RecipeReservationTableBtn(this)">`;
    html += `<td>${i + 1}</td>`;
    html += '<td>' + results[i].CD_CHART + '</td>';
    html += '<td>' + results[i].NM_CHART + '</td>';

    var jumin = ConvertInt(results[i].NO_JUMIN_ENC.data);
    var juminF = jumin.toString().slice(0, 6);
    var juminB = jumin.toString().slice(6, jumin.length);

    html += '<td>' + AgeCalculation(juminF, juminB) + '</td>'; //나이
    var date = new Date(results[i].DT_START);
    html += `<td>${TwoDigitNum(date.getHours() - 9)}:${TwoDigitNum(date.getMinutes())}</td>`;
    html += '<td>' + (results[i].NO_DEPT + 1) + '진료실</td>'; //진료실
    html += `<td title = '${results[i].NO_MOBILE}'>${TableSubstring(results[i].NO_MOBILE)}</td>`; //휴대전화
    html += `<td title = '${results[i].DC_APPNTMNT}'>${TableSubstring(results[i].DC_APPNTMNT)}</td>`; //예약메모      
    html += '</tr>';

    $("#reservationTable").append(html);
  }

  WaitingPatientTabLengthCheck(true);
}


//환자기본정보 - 환자조회 리스트 버튼
async function PatientInquiryBtn(filteredData) {
  t_CHART = filteredData;
  try {
    if (document.getElementById('receptionRoom')) {
      document.getElementById('chartNum').value = filteredData.CD_CHART;
      document.getElementById('patientName').value = filteredData.NM_CHART;
      //  document.getElementById('engName').value = filteredData.영문이름;

      jumin = ConvertInt(filteredData.NO_JUMIN_ENC.data);
      juminF = jumin.toString().slice(0, 6);
      juminB = jumin.toString().slice(6, jumin.length);
      document.getElementById('juminNumF').value = juminF;
      document.getElementById('juminNumB').value = juminB;
      document.getElementById('age').value = AgeCalculation(juminF, juminB);
      document.getElementById('phoneNumber').value = filteredData.NO_MOBILE;

      var email = filteredData.DC_EMAIL.split('@');
      document.getElementById('eMailF').value = email[0] == undefined ? '' : email[0];
      document.getElementById('eMailB').value = email[1] == undefined ? '' : email[1];
      document.getElementById('zipcode').value = filteredData.CD_ZIP;
      document.getElementById('address').value = filteredData.DC_ADDR;
      document.getElementById('detailedAddress').value = filteredData.DC_ADDR_DTL;
      document.getElementById('chk개인정보동의').checked = filteredData.BL_PRVT_AGREE.data[0] == '0' ? false : true;
      document.getElementById('chkBrainMap').checked = filteredData.DC_CHART_CHARTR == '' ? false : true;

      await Refresh환자메모(filteredData.CD_CHART);

      //이전 접수정보
      let t_CHART_INS = await GetData(`SELECT * FROM T_CHART_INS WHERE CD_CHART = '${filteredData.CD_CHART}' ORDER BY DS_APLY DESC`);

      //let t_CHART_INS = T_CHART_INS.filter(item => item.CD_CHART === filteredData.CD_CHART).sort((a, b) => b.CD_CODE_DTL - a.CD_CODE_DTL);
      //console.log(t_CHART_INS);
      //let t_CHART_INS = T_CHART_INS.filter(item => item.CD_CHART === '6949').sort((a, b) => b.DS_APLY - a.DS_APLY); // 테스트    
      try {
        InsuranceType(t_CHART_INS[0].FG_ISRC);
        let t_WORK_PLACE = T_WORK_PLACE.filter(item => item.NO_BIZ_SMBL === t_CHART_INS[0].NO_BIZ_SMBL);
        switch (t_CHART_INS[0].FG_ISRC) {
          case 3:
            document.getElementById('insuredPerson2').value = t_CHART_INS[0].NM_ISRC_USER;
            document.getElementById('dateOfAcquisitionOfInsuranceQualification2').value = FmtTegDate(t_CHART_INS[0].DS_APLY);
            document.getElementById('zabosaSymbol2').value = t_CHART_INS[0].NO_BIZ_SMBL; //자보사기호
            document.getElementById('insuranceType2').selectedIndex = t_CHART_INS[0].FG_ISRC; //보험유형
            document.getElementById('jaboCompanyName2').value = t_WORK_PLACE[0] ? t_WORK_PLACE[0] : ''; //자보사명칭
            document.getElementById('insuranceClassification2').selectedIndex = t_CHART_INS[0].FG_ISRC_KIND; //보험구분
            document.getElementById('accidentNumber2').value = t_CHART_INS[0].NO_ISRC_PLCY; //사고접수번호
            document.getElementById('paymentGuaranteeNumber2').value = t_CHART_INS[0].NO_PAY_WRRNTY; //지급번호
            document.getElementById('jungjeungNumber2').value = FmtTegDate(t_CHART_INS[0].NO_SRUS_REG); //산특/중증등록번호
            document.getElementById('specificSymbol2').selectedIndex = t_CHART_INS[0].CD_CALC_SPCL; //특정기호
            document.getElementById('medicalOutOfPocket2').selectedIndex = t_CHART_INS[0].TY_SELF_CHRG; //의료급여본인부담
            break;
          case 4:
            document.getElementById('industrialAccidentStartAate3').value = t_CHART_INS[0].DS_ACCDNT; //산재시작일
            document.getElementById('industrialAccidentEndAate3').value = t_CHART_INS[0].DS_ISRC_END; //산재종료일
            document.getElementById('combinationSymbol3').value = t_CHART_INS[0].NO_BIZ_SMBL; //조합기호
            document.getElementById('insuranceType3').selectedIndex = t_CHART_INS[0].FG_ISRC; //보험유형
            document.getElementById('combinationName3').value = t_WORK_PLACE[0] ? t_WORK_PLACE[0] : ''; //조합명칭
            document.getElementById('classificationOfIndustrialAccidents3').selectedIndex = t_CHART_INS[0].FG_ISRC_KIND; //산재구분
            document.getElementById('businessNumber3').value = t_CHART_INS[0].NM_ISRC_USER; //사업자번호
            document.getElementById('companyName3').value = t_CHART_INS[0].NM_IAI_CMPY; //업체명
            document.getElementById('classificationOfTreatment3').selectedIndex = t_CHART_INS[0].TY_IAI_TREAT; //진료구분
            document.getElementById('medicalCareApprovalDate3').value = t_CHART_INS[0].DS_APPRVL; //요양승인일
            document.getElementById('dateOfDisaster3').value = t_CHART_INS[0].DS_ACCDNT; //재해발생일
            break;
          default:
            document.getElementById('insuredPerson1').value = t_CHART_INS[0].NM_ISRC_USER;
            document.getElementById('dateOfAcquisitionOfInsuranceQualification1').value = FmtTegDate(t_CHART_INS[0].DS_APLY);
            document.getElementById('combinationSymbol1').value = t_CHART_INS[0].NO_BIZ_SMBL;
            document.getElementById('combinationName1').value = t_WORK_PLACE[0] ? t_WORK_PLACE[0] : '';
            document.getElementById('jeungNumber1').value = t_CHART_INS[0].NO_ISRC_PLCY;
            document.getElementById('insuranceType1').selectedIndex = GetSelectOptionIndex('insuranceType1', t_CHART_INS[0].FG_ISRC);
            ChangeBeforeInsuranceTypeSelect(document.getElementById('insuranceType1'));
            document.getElementById('insuranceClassification1').selectedIndex = GetSelectOptionIndex('insuranceClassification1', t_CHART_INS[0].FG_ISRC_KIND);
            break;
        }
      } catch (error) { }

      //환자접수정보
      patient = await GetData(`SELECT * FROM T_ACCEPT WHERE CD_CHART = '${filteredData.CD_CHART}' 
      AND DATE_FORMAT(DT_RGST, '%Y-%m-%d') = '${document.getElementById('waitingPatientDate').value}'`);

      if (patient.length > 0) {
        document.getElementById('doctorOffice').selectedIndex = parseInt(patient[0].CD_DEPT_SPRT) - 1;  //임시(001식으로 들어와서 일단 -1함 수정해야함)
        document.getElementById('doctor').selectedIndex = document.getElementById('doctorOffice').selectedIndex;
        document.getElementById('currentDate').value = patient[0].DT_RGST.substr(0, 10);

        if (patient[0].FG_ISRC == 99) {
          document.getElementById('insuranceTypeSelect').selectedIndex = document.getElementById('insuranceTypeSelect').options.length - 1;
        }
        else {
          document.getElementById('insuranceTypeSelect').selectedIndex = patient[0].FG_ISRC - 1;
        }

        ChangeInsuranceTypeSelect();
        document.getElementById('insuranceClassification').selectedIndex = GetSelectOptionIndex('insuranceClassification', patient[0].FG_ISRC_KIND);

        document.getElementById('division1').selectedIndex = patient[0].TY_FRST_TREAT;
        document.getElementById('division2').selectedIndex = patient[0].TY_NGHT_HLDY;
        document.getElementById('division3').selectedIndex = patient[0].TY_CHCKUP;

        document.getElementById('specificSymbol').selectedIndex = patient[0].CD_SPCF_SMBL;

        document.getElementById('deductibleRate').selectedIndex = patient[0].TY_CALC_SPCL;

        document.getElementById('code').selectedIndex = patient[0].TY_SELF_CHRG;
        document.getElementById('sign').selectedIndex = patient[0].NO_ASK_ORG;

        document.getElementById('receiptCencel').setAttribute("cd_chart", patient[0].CD_CHART);
        document.getElementById('receiptCencel').setAttribute("nm_chart", filteredData.NM_CHART);
      }
      else {
        lst = await GetData(`SELECT * FROM T_ACCEPT
        WHERE CD_CHART = '${filteredData.CD_CHART}'ORDER BY DS_TREAT DESC LIMIT 1`);
        try {
          var ts = IsMonthsApart(new Date(FmtTegDate(lst[0].DS_TREAT)), new Date(document.getElementById('currentDate').value), 3);
          document.getElementById('division1').selectedIndex = ts == true ? 1 : 2;
        } catch (error) { }
      }
    }
    else {
      var acc = await GetData(`SELECT
      a.NO_ACCEPT,  -- 접수번호
      a.CD_CHART,    -- 차트번호
      c.NM_CHART AS NM_CHART,  -- 이름
      a.DC_AGE_PTNT,  -- 나이
      a.FG_ISRC,  -- 보험구분
      a.FG_ISRC_KIND,  -- 보험종별구분  
      a.CD_DEPT_SPRT,  -- 진료실코드
      a.TY_TREAT_STAT,  -- 진료상태
      a.DT_RGST,  -- 접수일시
      a.DS_TREAT,  -- 접수일자
      a.TY_RCPT_STAT,  -- 수납상태
      a.DC_TRANS_MEMO,  -- 전달사항
      a.TY_CHCKUP,  -- 검진구분
      a.CD_TREAT_SBJT,  -- 진료과목
      a.TY_FRST_TREAT,  -- 진료
      a.DT_TREAT_TIME,  -- 진료한 시간
      a.DT_TREAT_START,  -- 접수 시작시간
      a.BL_TREAT_NOW,  -- 현재 진료중
      a.CD_SPCF_SMBL,
      a.NO_TREAT
      FROM
          T_ACCEPT AS a
      LEFT JOIN
          T_CHART AS c ON a.CD_CHART = c.CD_CHART
      WHERE
          a.CD_CHART = '${filteredData.CD_CHART}'    
      ORDER BY
          a.DS_TREAT DESC LIMIT 1`);

      document.getElementById('chartNum').value = filteredData.CD_CHART;
      document.getElementById('patientName').value = filteredData.NM_CHART;

      jumin = ConvertInt(filteredData.NO_JUMIN_ENC.data);
      juminF = jumin.toString().slice(0, 6);
      juminB = jumin.toString().slice(6, jumin.length);
      document.getElementById('juminNumF').value = juminF + '-' + juminB.substr(0, 1);
      document.getElementById('age').value = AgeCalculation(juminF, juminB);

      var 보험유형 = (insuranceTypeList.find(t => t.CD_CODE_DTL == acc[0].FG_ISRC) || {}).NM_CODE_DTL;
      var 보험구분 = Get_FG_ISRC_KIND(acc[0].FG_ISRC, acc[0].FG_ISRC_KIND);
      document.getElementById('insuranceType').value = `${보험유형}/${보험구분}`;

      document.getElementById('phoneNumber').value = filteredData.NO_MOBILE.substr(0, 4) + filteredData.NO_MOBILE.substr(4, 4) + '-' + filteredData.NO_MOBILE.substr(9, 4);
      document.getElementById('detailedAddress').value = filteredData.DC_ADDR + '   ' + filteredData.DC_ADDR_DTL;

      clickPatient = BuildCalendar(null, null, filteredData.CD_CHART);

      if (document.getElementById('storageRoom')) {
        ReceptionInfo(acc[0]);
      }
      else if (document.getElementById('doctorRoom')) {
        var ac = await temp대기환자정보리스트.find(t => t.NO_ACCEPT === beforeAccept.NO_ACCEPT);
        if (ac !== undefined && ac.BL_TREAT_NOW == 현재진료중Enum.TY진료중YES && ac.DT_TREAT_END == null) {
          ac.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;
          await Set_UpdatePostData('T_ACCEPT', ac);
        }

        await DisPlayDiagInfo(acc[0], FmtTegDate(acc[0].DS_TREAT));
      }
    }

    Get과거진료내역List(filteredData);

    DisplayProgressNote();
  } catch (error) {
    console.error(error);
  }
}

//진료내역 보류
function HoldOnBtn() {
  //진료중 삭제
  var table = document.getElementById('inTreatmentTable');
  for (let i = 0; i < table.rows.length; i) {
    table.deleteRow(table.rows.length - 1);
  }

  //진료내역 삭제
  var table = document.getElementById('treatmentHistoryList');
  for (let i = 0; i < table.rows.length; i) {
    table.deleteRow(table.rows.length - 1);
  }

  //보류 리스트 생성
  var idIdx = 0;
  var html = '';
  for (let i = 0; i < InTreatmentPatientInfo.diagnosisList.length; i++) {
    if (document.getElementById('patientListDate').value == InTreatmentPatientInfo.diagnosisList[i].접수날짜) {
      PatientInfoState(InTreatmentPatientInfo.diagnosisList[i], '보류', InTreatmentPatientInfo.diagnosisList[i].차트번호, i);
      html += `<tr onclick="WaitingPatientTableBtn(this);">`;
      html += '<td></td>';
      html += '<td id="차트번호' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].차트번호 + '</td>';
      html += '<td id="환자이름' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].환자이름 + '</td>';
      html += '<td id="나이' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].나이 + '</td>';
      html += '<td id="나이' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].접수시간 + '</td>';
      html += '<td id="보험구분' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].보험구분 + '</td>';
      html += '<td id="보험유형' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].보험유형 + '</td>';
      html += '<td id="진료실' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].진료실 + '</td>';
      html += '<td id="상태' + idIdx + '">보류</td>';
      html += '<td id="전달사항' + idIdx + '">' + InTreatmentPatientInfo.diagnosisList[i].전달사항 + '</td>';
      html += '</tr>';
      $("#holdOnTable").append(html);
    }
  }

  treatmentHistoryListIdx = -1;
  WaitingPatientTabLengthCheck();
}

//환자리스트 선택 버튼
async function TableClick(id, target) {
  try {
    if (target !== undefined) {
      var tbody = target.parentNode;
      var trs = tbody.getElementsByTagName('tr');
    }

    for (let i = 0; i < temp대기환자정보리스트.length; i++) {
      if (temp대기환자정보리스트[i].CD_CHART == id) {
        filteredData = await GetData(`SELECT * FROM T_CHART WHERE CD_CHART = ${temp대기환자정보리스트[i].CD_CHART}`);
        break;
      }
    }

    if (document.getElementById('receptionRoom')) {
      for (let i = 0; i < temp대기환자정보리스트.length; i++) {
        var td = target.getElementsByTagName('td');

        if (temp대기환자정보리스트[i].NO_ACCEPT == td[0].id) {
          PatientSearchBtn(temp대기환자정보리스트[i].CD_CHART);
        }
      }
    }
    else if (document.getElementById('storageRoom')) {
      for (let i = 0; i < temp대기환자정보리스트.length; i++) {
        var td = target.getElementsByTagName('td');

        if (temp대기환자정보리스트[i].NO_ACCEPT == td[0].id) {
          if (checkChartNum != undefined && checkChartNum == temp대기환자정보리스트[i].CD_CHART) {
            return;
          }

          checkChartNum = temp대기환자정보리스트[i].CD_CHART;

          t_TREAT = await GetData(`SELECT * FROM T_TREAT
                                  WHERE NO_ACCEPT = ${temp대기환자정보리스트[i].NO_ACCEPT}
                                  AND DATE_FORMAT(DT_RGST, '%Y-%m-%d') = '${document.getElementById('patientListDate').value}'`);

          DisPlayDiagInfo(temp대기환자정보리스트[i]);
          // RefreshTables(true);
          break;
        }
      }
    }
    else if (document.getElementById('doctorRoom')) {
      for (let i = 0; i < temp대기환자정보리스트.length; i++) {
        var td = target.getElementsByTagName('td');
        if (temp대기환자정보리스트[i].NO_ACCEPT == td[0].id) {
          if (checkChartNum != undefined && checkChartNum == temp대기환자정보리스트[i].CD_CHART &&
            temp대기환자정보리스트[i].BL_TREAT_NOW == 현재진료중Enum.TY진료중YES) {
            console.log(temp대기환자정보리스트[i]);
            return;
          }

          checkChartNum = temp대기환자정보리스트[i].CD_CHART;
          await DiagEditCheck(false);

          t_TREAT = await GetData(`SELECT * FROM T_TREAT
                                   WHERE NO_ACCEPT = ${temp대기환자정보리스트[i].NO_ACCEPT}
                                   AND DATE_FORMAT(DT_RGST, '%Y-%m-%d') = '${document.getElementById('patientListDate').value}'`);

          //T_TREAT 생성 
          if (t_TREAT === undefined || t_TREAT.length === 0) {
            var lst = await Create진찰료자동코드(temp대기환자정보리스트[i], false, '', filteredData);
            await PostData진료상병(lst, temp대기환자정보리스트[i], 0);
          }

          if (temp대기환자정보리스트[i].BL_TREAT_NOW == 현재진료중Enum.TY진료중NO && temp대기환자정보리스트[i].TY_TREAT_STAT != 진료상태Enum.TY09완료) {
            if (temp대기환자정보리스트[i].TY_TREAT_STAT == 진료상태Enum.TY01접수) {
              temp대기환자정보리스트[i].DT_TREAT_START = new Date();
            }
            temp대기환자정보리스트[i].TY_TREAT_STAT = 진료상태Enum.TY03진료중;
            temp대기환자정보리스트[i].BL_TREAT_NOW = 현재진료중Enum.TY진료중YES;
            await Set_UpdatePostData('T_ACCEPT', temp대기환자정보리스트[i]);

            if (beforeAccept.NO_ACCEPT != '' && beforeAccept.NO_ACCEPT != temp대기환자정보리스트[i]) {
              let ac = await temp대기환자정보리스트.find(t => t.NO_ACCEPT === beforeAccept.NO_ACCEPT);
              if (ac !== undefined && ac.BL_TREAT_NOW == 현재진료중Enum.TY진료중YES && ac.DT_TREAT_END == null) {
                ac.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;
                await Set_UpdatePostData('T_ACCEPT', ac);
              }
            }
          }
          else if (temp대기환자정보리스트[i].BL_TREAT_NOW == 현재진료중Enum.TY진료중NO && temp대기환자정보리스트[i].TY_TREAT_STAT == 진료상태Enum.TY09완료) {
            if (beforeAccept.NO_ACCEPT != '' && beforeAccept.NO_ACCEPT != temp대기환자정보리스트[i]) {
              let ac = await temp대기환자정보리스트.find(t => t.NO_ACCEPT === beforeAccept.NO_ACCEPT);
              if (ac !== undefined && ac.BL_TREAT_NOW == 현재진료중Enum.TY진료중YES && ac.DT_TREAT_END == null) {
                ac.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;
                await Set_UpdatePostData('T_ACCEPT', ac);
              }
            }

            DisPlayDiagInfo(temp대기환자정보리스트[i]);
          }

          RefreshTables(true);
          break;
        }
      }
    }

    // PatientInquiryBtn(filteredData);
  } catch (error) {
    console.log(error);
  }
}

//보험유형/구분
function InsuranceType(valueF, valueB) {
  var afterStr = valueB.split(':');

  switch (valueF) {
    case "satin":
      valueF = "공단";
      break;
    case "salary":
      valueF = "급여";
      break;
    case "jabo":
      valueF = "자보";
      break;
    case "interspersed":
      valueF = "산재";
      break;
    case "veterans":
      valueF = "보훈";
      break;
    case "nomal":
      valueF = "일반";
      break;
  }

  document.getElementById('insuranceType').value = valueF + '/' + afterStr[1];
}

//#region 달력
// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다. 
async function BuildCalendar(patientInfo, month, chartNum = -1) {
  try {
    if (chartNum != -1) {
      calendarAccept = await GetAccept(chartNum);
      if (month != null || month != undefined) {
        nowMonth = month;
      }
      else {
        nowMonth = FmtNewDate(calendarAccept[calendarAccept.length - 1].진료일자);
      }
    }

    firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
    lastDate1 = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

    var nextMonthYear = nowMonth.getFullYear();
    var nextMonth = nowMonth.getMonth() + 2;
    if (nextMonth == 13) {
      nextMonth = 1;
    }
    lastDate2 = new Date(nextMonthYear, nextMonth, 0);

    for (let i = 0; i < 2; i++) {
      let tbody_Calendar;
      if (i == 0) {
        tbody_Calendar = document.getElementById('Calendar1');
        document.getElementById("calYear1").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
        document.getElementById("calMonth1").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신
      }
      else {
        tbody_Calendar = document.getElementById('Calendar2');
        document.getElementById("calYear2").innerText = nextMonthYear + 1;             // 연도 숫자 갱신
        document.getElementById("calMonth2").innerText = leftPad(nextMonth);  // 월 숫자 갱신
      }

      while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
      }
      let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가     
      nowRow.style.border = 'none';

      for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
        let nowColumn = nowRow.insertCell();        // 열 추가
        nowColumn.style.border = 'none';
      }

      var checkLastDay;
      if (i == 0) {
        checkLastDay = lastDate1;
      }
      else {
        checkLastDay = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 2, 0);
      }

      nowDay = firstDate;

      for (let nowDay = firstDate; nowDay <= checkLastDay; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복        
        let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
        nowColumn.innerText = leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력
        nowColumn.style.border = 'none';
        nowColumn.style.fontSize = "11px";

        if (nowDay.getDay() == 0) {                 // 일요일인 경우 글자색 빨강으로
          nowColumn.style.color = "#DC143C";
          nowColumn.style.height = "27.5px";
        }
        if (nowDay.getDay() == 6) {                 // 토요일인 경우 글자색 파랑으로 하고
          nowColumn.style.color = "#0000CD";
          nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가    
          nowRow.style.border = 'none';
          nowColumn.style.height = "27.5px";
        }

        nowColumn.setAttribute("date", GetDate(nowDay).substring(0, 8));

        if (chartNum != -1) {
          var target = calendarAccept.filter(t => t.진료일자 == nowColumn.getAttribute('date'));
          if (target.length > 0) {
            nowColumn.style.backgroundColor = calendarColor1;
          }
        }

        if (nowDay < today) {                       // 지난날인 경우
          nowColumn.className = "pastDay";
          nowColumn.id = 'day' + nowColumn.innerHTML;
        }
        else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우           
          nowColumn.className = "today";
          nowColumn.id = 'day' + nowColumn.innerHTML;
          nowColumn.style.fontWeight = "bold";
          nowColumn.style.fontSize = "12px";
          tempColumn = nowColumn;
        }
        else {                                      // 미래인 경우
          nowColumn.className = "futureDay";
          nowColumn.id = 'day' + nowColumn.innerHTML;
        }
        nowColumn.onclick = function () { ChoiceDate(this); }
      }
    }
  } catch (error) {
    if (!document.getElementById('receptionRoom'))
      console.log(error);
  }
}

// 날짜 선택
async function ChoiceDate(nowColumn) {
  nowColumn.style.backgroundColor = calendarColor3;
  // nowColumn.style.borderColor = calendarColor3;
  // nowColumn.style.borderWidth = "3px";
  // nowColumn.style.borderStyle = "solid";
  // nowColumn.style.width = '1px';

  if (tempColumn != undefined && tempColumn.getAttribute('date') != nowColumn.getAttribute('date')) {
    try {
      var target = calendarAccept.filter(t => t.진료일자 == tempColumn.getAttribute('date'));

      if (tempColumn.getAttribute('date') == FmtNoTegDate(new Date())) {//오늘       
        if (target.length > 0) {
          tempColumn.style.backgroundColor = calendarColor1;
        }
        else {
          tempColumn.style.backgroundColor = calendarColor4;
        }
      } else { //나머지        
        if (target.length > 0) {
          tempColumn.style.backgroundColor = calendarColor1;
        }
        else {
          tempColumn.style.backgroundColor = calendarColor4;
        }
      }
      tempColumn.style.border = 'none';

      DisplayProgressNote(nowColumn.getAttribute('date'));
      Get과거진료내역List(t_CHART, nowColumn.getAttribute('date'));

    } catch (error) {
      if (tempColumn.getAttribute('date') == FmtNoTegDate(new Date())) {//오늘        
        tempColumn.style.backgroundColor = calendarColor4;
        nowColumn.style.borderColor = calendarColor2;
      } else { //나머지
        tempColumn.style.backgroundColor = calendarColor4;
      }

      tempColumn.style.border = 'none';
    }

  }

  tempColumn = nowColumn;
}

// 이전달 버튼 클릭
function prevCalendar() {
  nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소 

  try {
    BuildCalendar(0, nowMonth, document.getElementById('chartNum').value);
  } catch (error) {

  }

  //BuildCalendar(tempPatientInfo);
}
// 다음달 버튼 클릭
function nextCalendar() {
  nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
  try {
    BuildCalendar(0, nowMonth, document.getElementById('chartNum').value);
  } catch (error) {

  }
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}
//#endregion

function PopupOff(id) {
  document.getElementById(id).style.display = 'none';
}

//#region 날짜에 맞게 리로드
$('#patientListDate').change(RefreshTables);
$('#patientListDoctorOffice').change(RefreshTables);
$('#waitingPatientDate').change(RefreshTables);
$('#waitingPatientDoctorOffice').change(RefreshTables);
$('#doctorOffice').change(RefreshTables);
$('#waitingPatientInfoDoctorOffice').change(RefreshTables);
$('#reservationDate').change(RefreshReservationTable);

function RefreshTables(reloadDate = true) {
  try {
    $("#patientList").empty();
  } catch (error) { }
  try {
    $("#inTreatmentTable").empty();
  } catch (error) { }
  try {
    $("#holdOnTable").empty();
  } catch (error) { }
  try {
    $("#completeTable").empty();
  } catch (error) { }
  try {
    $("#acceptStayTable").empty();
  } catch (error) { }
  try {
    $("#acceptCompleteTable").empty();
  } catch (error) { }
  try {
    document.getElementById('doctor').selectedIndex = document.getElementById('doctorOffice').selectedIndex;
  } catch (error) { }
  try {
    document.getElementById('waitingPatientInfoDoctor').selectedIndex = document.getElementById('waitingPatientInfoDoctorOffice').selectedIndex;
  } catch (error) { }

  if (reloadDate) {
    StartWaitingPatientTableListCreate();

    if (interval !== undefined) {
      clearInterval(interval);
    }

    SetInterval();
  }
}

//접수예약테이블 - 접수예약만 따로 refresh 시켜줘야함
function RefreshReservationTable(reloadDate = true) {
  try {
    $("#reservationTable").empty();
  } catch (error) { }

  if (reloadDate) {
    StartRecipeReservationListCreate();
  }
}

function RefreshProgressNote(calendarClick = false) {
  try {
    LoadNoteType();
  } catch (error) { }
  try {
    if (!calendarClick) {
      document.getElementById('firstVisitNote').value = '';
    }
  } catch (error) { }
  try {
    document.getElementById('diagnosisNote2').value = '';
  } catch (error) { }
}

//#endregion

//진료대기 탭 테이블 갯수 체크
function WaitingPatientTabLengthCheck(isReservation = false) {
  if (!isReservation) {
    try {
      if (document.getElementById('patientList').rows.length == 0) {
        if (document.getElementById('receptionRoom')) {
          document.getElementById('patientListStay').innerHTML = '<span class="pointColor">•</span> 진료대기(0)';
        }
        else {
          document.getElementById('patientListStay').innerHTML = '진료대기(0)';
        }

      }
      else {
        if (document.getElementById('receptionRoom')) {
          document.getElementById('patientListStay').innerHTML = '<span class="pointColor">•</span> 진료대기(' + document.getElementById('patientList').rows.length + ')';
        }
        else {
          document.getElementById('patientListStay').innerHTML = '진료대기(' + document.getElementById('patientList').rows.length + ')';
        }

      }
    } catch (error) { }

    try {
      if (document.getElementById('inTreatmentTable').rows.length == 0) {
        document.getElementById('inTreatmentList').innerHTML = '진료중(0)';

        if (document.getElementById('doctorRoom')) {
          ResetDiagTimer();
        }
      }
      else {
        document.getElementById('inTreatmentList').innerHTML = '진료중(' + document.getElementById('inTreatmentTable').rows.length + ')';
      }

    } catch (error) { }

    try {
      if (document.getElementById('holdOnTable').rows.length == 0) {
        document.getElementById('holdOnList').innerHTML = '보류(0)';
      }
      else {
        document.getElementById('holdOnList').innerHTML = '보류(' + document.getElementById('holdOnTable').rows.length + ')';
      }
    } catch (error) { }

    try {
      if (document.getElementById('completeTable').rows.length == 0) {
        document.getElementById('completeList').innerHTML = '완료(0)';
      }
      else {
        document.getElementById('completeList').innerHTML = '완료(' + document.getElementById('completeTable').rows.length + ')';
      }
    } catch (error) { }

    try {
      if (document.getElementById('acceptStayTable').rows.length == 0) {
        document.getElementById('acceptStayList').innerHTML = '수납대기(0)';
      }
      else {
        document.getElementById('acceptStayList').innerHTML = '수납대기(' + document.getElementById('acceptStayTable').rows.length + ')';
      }
    } catch (error) { }

    try {
      if (document.getElementById('completeTable').rows.length == 0) {
        document.getElementById('acceptCompleteList').innerHTML = '수납완료(0)';
      }
      else {
        document.getElementById('acceptCompleteList').innerHTML = '수납완료(' + document.getElementById('completeTable').rows.length + ')';
      }
    } catch (error) { }
  }
  else {
    try {
      if (document.getElementById('reservationTable').rows.length == 0) {
        if (document.getElementById('receptionRoom')) {
          document.getElementById('reservationList').innerHTML = '<span class="pointColor">•</span> 예약(0)';
        }
        else if (document.getElementById('doctorRoom')) {
          document.getElementById('reservationList').innerHTML = '예약(0)';
        }

      }
      else {
        if (document.getElementById('receptionRoom')) {
          document.getElementById('reservationList').innerHTML = '<span class="pointColor">•</span> 예약(' + document.getElementById('reservationTable').rows.length + ')';
        }

        else if (document.getElementById('doctorRoom')) {
          document.getElementById('reservationList').innerHTML = '예약(' + document.getElementById('reservationTable').rows.length + ')';
        }
      }

    } catch (error) { }
  }
}

async function DisplayProgressNote(calendarClickDate = undefined) {
  startDay = HyphenReplace(document.getElementById('diagNoteSDay').value);
  endDay = HyphenReplace(document.getElementById('diagNoteEDay').value);

  var firstNote = await GetData(`SELECT * FROM T_TREAT_NOTE WHERE CD_CHART = '${t_CHART.CD_CHART}' AND FG_NOTE = '0'`);
  var diagNote = await GetData(`SELECT * FROM T_TREAT_NOTE WHERE CD_CHART = '${t_CHART.CD_CHART}'AND DS_PRSCRPTN BETWEEN ${startDay} AND ${endDay} AND FG_NOTE = '1' ORDER BY DS_PRSCRPTN DESC`);

  RefreshProgressNote();

  //초진기록    
  if (firstNote.length > 0) {
    if (document.getElementById('firstVisitNote')) {
      document.getElementById('firstVisitNote').value = `${firstNote[0].DC_NOTE}\n`;
    }
  }
  else {
    if (!document.getElementById('receptionRoom')) {
      LoadNoteType();
    }
  }

  //과거내역
  if (document.getElementById('doctorRoom')) {
    document.getElementById('diagnosisNote1').value = '';
  }

  for (let i = 0; i < diagNote.length; i++) {
    if (document.getElementById('doctorRoom')) {
      if (calendarClickDate != undefined) {
        if (diagNote[i].DS_PRSCRPTN == calendarClickDate) {
          document.getElementById('diagnosisNote1').value = `${diagNote[i].DC_NOTE}\n`;
        }
      }
      else {
        if (diagNote[i].DS_PRSCRPTN == HyphenReplace(document.getElementById('patientListDate').value)) {
          document.getElementById('diagnosisNote1').value = `${diagNote[i].DC_NOTE}\n`;
        }
      }
    }

    if (i == 0) {
      document.getElementById('diagnosisNote2').value += `[초진기록]\n`;
      document.getElementById('diagnosisNote2').value += `[${firstNote[i].DS_PRSCRPTN}]${t_CHART.NM_CHART}\n ${firstNote[0].DC_NOTE}\n`;
      document.getElementById('diagnosisNote2').value += `[진료기록]\n`;
    }

    document.getElementById('diagnosisNote2').value += `[${diagNote[i].DS_PRSCRPTN}]${t_CHART.NM_CHART}\n ${diagNote[i].DC_NOTE}\n`;
  }

  var date = calendarClickDate == undefined ? HyphenReplace(document.getElementById('patientListDate').value) : calendarClickDate;

  if (document.getElementById('doctorRoom')) {
    document.getElementById('totalMemo').value = await Get_Memo(t_CHART.CD_CHART, date, 환자메모구분Constant.환자메모구분00_전체메모);
  }
}

async function SaveProgressNote() {
  try {
    var lst = [];
    var noteList = [];
    var _처방일자 = HyphenReplace(document.getElementById('patientListDate').value);
    try {
      var temp = await GetData(`SELECT * FROM T_TREAT_NOTE  WHERE CD_CHART = '${t_TREAT[0].챠트번호}' AND FG_NOTE = '0'`); //초진      
      noteList.push(temp[0]);
      temp = await GetData(`SELECT * FROM T_TREAT_NOTE  WHERE CD_CHART = '${t_TREAT[0].챠트번호}' AND DS_TREAT = '${_처방일자}'`); //진료기록      
      noteList.push(temp[0]);
    } catch (error) {
      console.log(error);
      return;
    }

    //var _loginUserID = MonoChartSettingManager.instance().Setting.UserID;
    //var _convertToRTF;
    var DC_NOTE;
    for (let i = 0; i < 2; i++) {
      var _currentProgressNote;

      if (noteList.length == 0 || noteList[i] == undefined) {
        _currentProgressNote = new T_TREAT_NOTE();

        //_currentProgressNote.ID_FRST_RGST = _loginUserID;
        _currentProgressNote.DST_FRST_RGST = fmtTodaySec;
        _currentProgressNote.DS_PRSCRPTN = _처방일자;
        _currentProgressNote.DS_TREAT = _처방일자;
        _currentProgressNote.CD_CHART = t_TREAT[0].챠트번호;
        _currentProgressNote.NO_TREAT = t_TREAT[0].진료번호;
        //_currentProgressNote.CD_DEPT_SPRT = _진료과목;
        //_currentProgressNote.ID_DOCT = _담당의사;
      } else {
        DC_NOTE = noteList[i] == undefined ? "" : noteList[i].DC_NOTE;
        _currentProgressNote = noteList[i];
      }

      // _currentProgressNote.ID_UPDT = _loginUserID;
      // _currentProgressNote.DT_UPDT = new Date();

      // if (!_richEdit.Text.trim()) {
      //   _currentProgressNote.BL_DEL = true;
      // }

      //_convertToRTF = SaveRichEditToByteArray(_richEdit);

      //_currentProgressNote.IMG_NOTEFILE = _convertToRTF;


      _currentProgressNote.DC_NOTE = '';
      _currentProgressNote.FG_NOTE = i;
      switch (i) {
        case 0: //초진기록
          if (document.getElementById('firstVisitNote')) {
            _currentProgressNote.DC_NOTE = document.getElementById('firstVisitNote').value;
          }
          break;
        case 1://진료기록
          if (document.getElementById('diagnosisNote1')) {
            _currentProgressNote.DC_NOTE = document.getElementById('diagnosisNote1').value;
          }
          break;
      }

      var myClass = {
        note: undefined,
        isNot: false
      };

      if (noteList[i] == undefined) {
        alramBool[4] = true;
        myClass.note = _currentProgressNote;
        myClass.isNot = true;

        lst.push(myClass);
      }
      else if (noteList[i].FG_NOTE == _currentProgressNote.FG_NOTE && DC_NOTE != _currentProgressNote.DC_NOTE) {
        alramBool[4] = true;
        myClass.note = _currentProgressNote;
        myClass.isNot = false;

        lst.push(myClass);
      }
    }
    return lst;
  } catch (e) {
    console.log(e);
  }
}

//아코디언
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

//수납상태
function StorageState(patientInfo, idx) {
  //console.log(patientInfo);
  var temp;
  var pInfo = patientInfo.diagnosisList[idx];

  temp = pInfo.진료실.substr(0, 1);
  selectIndex = document.getElementById('patientListDoctorOffice').selectedIndex;

  if (pInfo.접수날짜 == document.getElementById('patientListDate').value) {
    if (temp == selectIndex || selectIndex == '0') {
      if (pInfo.진료상태 == '수납대기') {
        html = '';
        html += '<tr id=' + idx + ' onclick="WaitingPatientTableBtn(this);">';
        html += '<td id=' + pInfo.오늘진료받은횟수 + '></td>';
        html += '<td id="차트번호">' + pInfo.차트번호 + '</td>';
        html += '<td id="성명">' + pInfo.환자이름 + '</td>';
        html += '<td id="보험구분">' + pInfo.보험구분 + '</td>';
        html += '<td id="진료실">' + pInfo.진료실 + '</td>';
        html += '<td id="전달사항">' + '</td>';
        // pInfo.diagnosisList[i].선택 = '<button id="tableBtn' + idIdx + '" class= "tableBtn" style="width :100%; height:100%;" onclick="TableClick(id);">선택</button>'
        //html += '<td id="선택' + idIdx + '">' + pInfo.diagnosisList[i].선택 + '</td>';
        html += '</tr>';
        $("#acceptStayTable").append(html);
      }
      else if (pInfo.진료상태 == '수납완료') {
        html = '';
        html += '<tr id=' + idx + ' onclick="WaitingPatientTableBtn(this);">';
        html += '<td id=' + pInfo.오늘진료받은횟수 + '></td>';
        html += '<td id="차트번호">' + pInfo.차트번호 + '</td>';
        html += '<td id="성명">' + pInfo.환자이름 + '</td>';
        html += '<td id="나이">' + pInfo.나이 + '</td>';
        html += '<td id="보험구분">' + pInfo.보험구분 + '</td>';
        html += '<td id="진료실">' + pInfo.진료실 + '</td>';
        html += '<td id="수납시간">' + '' + '</td>';
        html += '<td id="총수납금액">' + '' + '</td>';
        html += '<td id="현금수납금액">' + '' + '</td>';
        html += '<td id="통장입금금액">' + '' + '</td>';
        html += '<td id="카드수납금액">' + '' + '</td>';
        html += '<td id="수납메모">' + '' + '</td>';
        // pInfo.diagnosisList[i].선택 = '<button id="tableBtn' + idIdx + '" class= "tableBtn" style="width :100%; height:100%;" onclick="TableClick(id);">선택</button>'
        //html += '<td id="선택' + idIdx + '">' + pInfo.diagnosisList[i].선택 + '</td>';
        html += '</tr>';
        $("#acceptCompleteTable").append(html);
      }
    }
  }
}

//#region 즐겨찾기
function CreateFavoritesBtn() {
  try {
    var idarry;
    if (document.getElementById('receptionRoom')) {
      idarry = localStorage.getItem('checkOnFavorites1');
    }
    else if (document.getElementById('storageRoom')) {
      idarry = localStorage.getItem('checkOnFavorites2');
    }
    else if (document.getElementById('doctorRoom')) {
      idarry = localStorage.getItem('checkOnFavorites3');
    }

    if (idarry === null) {
      return;
    }

    var id = JSON.parse(idarry);
    var parentDiv;
    var container;

    for (let i = 0; i < id.length; i++) {
      parentDiv = document.getElementById(id[i]);
      container = document.getElementById("favorites");

      var clonedDiv = parentDiv.cloneNode(true);

      // divElement의 onclick 속성을 가져와 span의 onclick으로 설정
      var divOnClick = parentDiv.getAttribute('onclick');
      clonedDiv.setAttribute('onclick', divOnClick);

      // 이미지 엘리먼트 생성
      var imgElement = document.createElement('img');

      // 이미지를 clonedDiv 요소 안에 추가
      clonedDiv.appendChild(imgElement);

      // 텍스트 내용 생성
      var textContent = '';

      // 텍스트를 span 요소로 생성
      var textSpan = document.createElement('span');
      textSpan.textContent = textContent;

      // 텍스트를 clonedDiv 요소 안에 추가      
      clonedDiv.appendChild(textSpan);

      container.appendChild(clonedDiv);
    }

    if (container === undefined) {
      return;
    }

    var allDivs = container.querySelectorAll("div");

    allDivs.forEach(function (divElement) {
      var newSpan = document.createElement("span"); // 새로운 span 요소 생성      

      // divElement의 onclick 속성을 가져와 span의 onclick으로 설정
      var divOnClick = divElement.getAttribute('onclick');
      newSpan.setAttribute('onclick', divOnClick);
      newSpan.style.marginLeft = "10px";
      // 이미지 엘리먼트 생성
      var imgElement = document.createElement('img');
      imgElement.src = '../Image/Public/readingGlassesBtn.png';
      imgElement.style.verticalAlign = 'top';
      imgElement.style.marginTop = '3px';
      newSpan.style.cursor = "pointer";

      // 이미지를 newSpan 요소 안에 추가
      newSpan.appendChild(imgElement);

      // 텍스트 내용 생성
      var textContent = divElement.textContent;

      // 텍스트를 span 요소로 생성
      var textSpan = document.createElement('span');
      textSpan.textContent = textContent;

      // 텍스트를 newSpan 요소 안에 추가
      newSpan.appendChild(textSpan);

      divElement.parentNode.replaceChild(newSpan, divElement); // div를 span으로 교체
    });

  } catch (error) {
    console.log(error);
  }
}
function SetFavorites(favorites) {
  console.log(favorites);
  if (favorites == undefined) {
    var favoritesContainer = document.getElementById("favorites");
    while (favoritesContainer.firstChild) {
      favoritesContainer.removeChild(favoritesContainer.firstChild);
    }
    if (document.getElementById('receptionRoom')) {
      localStorage.removeItem('checkOnFavorites1');
    }
    else if (document.getElementById('storageRoom')) {
      localStorage.removeItem('checkOnFavorites2');
    }
    else if (document.getElementById('doctorRoom')) {
      localStorage.removeItem('checkOnFavorites3');
    }
    return;
  }

  var favoritesContainer = document.getElementById("favorites");
  while (favoritesContainer.firstChild) {
    favoritesContainer.removeChild(favoritesContainer.firstChild);
  }
  if (document.getElementById('receptionRoom')) {
    localStorage.removeItem('checkOnFavorites1');
    localStorage.setItem('checkOnFavorites1', JSON.stringify(favorites));
  }
  else if (document.getElementById('storageRoom')) {
    localStorage.removeItem('checkOnFavorites2');
    localStorage.setItem('checkOnFavorites2', JSON.stringify(favorites));
  }
  else if (document.getElementById('doctorRoom')) {
    localStorage.removeItem('checkOnFavorites3');
    localStorage.setItem('checkOnFavorites3', JSON.stringify(favorites));
  }

  CreateFavoritesBtn();
}
//#endregion

async function TableChangeCheck() {
  var lst = [];
  var trs = document.getElementById('treatmentHistoryListTable').querySelectorAll('tr');
  for (let i = 2; i < trs.length; i++) {
    var isChange = false;
    for (let j = 0; j < diagTalbeList.length; j++) {
      var td = trs[i].getElementsByTagName('td');
      if (td[1].innerHTML == diagTalbeList[j].처방번호) {
        var inputs = trs[i].querySelectorAll('input');
        var selects = trs[i].querySelectorAll('select');

        var BL_POUDER = diagTalbeList[j].파우더 == undefined ? false : diagTalbeList[j].파우더;
        if (diagTalbeList[j].투여량1회 != inputs[0].value || diagTalbeList[j].투여횟수 != inputs[1].value || diagTalbeList[j].투여일수 != inputs[2].value ||
          diagTalbeList[j].메모 != inputs[6].value
        ) {
          // alramBool[2] = true;
          isChange = true;
        }

        if (diagTalbeList[j].원외구분 != inputs[3].checked || BL_POUDER != inputs[4].checked || diagTalbeList[j].믹스구분 != inputs[5].value) {
          isChange = true;
        }

        // if (diagTalbeList[i].용법코드 != selects[0].selectedIndex || diagTalbeList[i].예외구분 != selects[1].selectedIndex || diagTalbeList[i].집계구분 != selects[2].selectedIndex
        if (diagTalbeList[j].예외구분 != selects[1].selectedIndex || diagTalbeList[j].집계구분 != selects[2].selectedIndex
          || diagTalbeList[j].급여적용 != selects[3].selectedIndex || diagTalbeList[j].의사사인 != selects[4].selectedIndex) {
          // alramBool[2] = true;
          isChange = true;
        }

        if (isChange) {
          var rc = new T_TREAT();
          rc.NO_ACCEPT = diagTalbeList[j].접수번호;
          rc.CD_CHART = diagTalbeList[j].챠트번호;
          rc.NO_PRSCRPTN_ORDER = diagTalbeList[j].처방번호;
          rc.AMT_DOSAGE_1TH = inputs[0].value;
          rc.CNT_DOSAGE = inputs[1].value;
          rc.CNT_DOSAGE_DAYS = inputs[2].value;
          //rc.CD_USAGE = selects[0].selectedIndex;
          rc.FG_OUTSIDE = inputs[3].checked;
          rc.BL_POUDER = inputs[4].checked;
          rc.ID_MIXER = inputs[5].value;
          rc.FG_EXCPTN = GetSelcetEditValue(selects[1].id);
          rc.DC_TREAT_MEMO = inputs[6].value;
          rc.CD_SPCL = selects[2].selectedIndex;
          rc.TY_PAY_APLY = selects[3].selectedIndex;
          rc.MNY_UNPRC = diagTalbeList[j].단가;
          rc.SGN_DOCTOR = T_DOCTOR[selects[4].selectedIndex].ID_USER;

          // await Set_UpdatePostData('T_TREAT', rc);          
          lst.push(rc);
          break;
        }
      }
    }
  }

  if (lst.length > 0) {
    alramBool[2] = true;
  }
  return lst;
}

//각종 select option list 만들기
async function selectOptionCreate() {
  var selectEl;
  var objOption;
  var tempOptionText = '';
  var tempOptionValue = '';

  try {
    var doctorSelects = document.querySelectorAll('select[name="doctorOffice"]');
    var doctors = document.querySelectorAll('select[name="doctor"]');

    for (let i = 0; i < T_DOCTOR.length; i++) {
      for (let j = 0; j < doctorSelects.length; j++) {
        selectEl = doctorSelects[j];
        objOption = document.createElement("option");
        objOption.text = `${T_DOCTOR[i].DC_REMARK}(${T_DOCTOR[i].NM_USER})`;
        objOption.value = T_DOCTOR[i].DC_REMARK;
        objOption.setAttribute('EditValue', T_DOCTOR[i].CD_DEPT_SPRT);
        selectEl.add(objOption);
        selectEl.selectedIndex = 0;

        selectEl = doctors[j];
        objOption = document.createElement("option");
        objOption.text = T_DOCTOR[i].NM_USER;
        objOption.value = T_DOCTOR[i].NM_USER;
        selectEl.add(objOption);
        selectEl.selectedIndex = 0;
      }
    }
  } catch (error) { }

  try {
    for (let i = 0; i < division1.length; i++) {
      selectEl = document.querySelector("#division1");
      objOption = document.createElement("option");
      objOption.text = division1[i].NM_CODE_DTL;
      objOption.value = division1[i].FG_CODE_DTL;
      objOption.setAttribute("EditValue", division1[i].CD_CODE_DTL);
      if (document.getElementById('doctorRoom')) {
        selectEl.addEventListener("click", Change진찰료변경);
      }
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;
    }

  } catch (error) {

  }

  try {
    for (let i = 0; i < division2.length; i++) {
      selectEl = document.querySelector("#division2");
      objOption = document.createElement("option");
      objOption.text = division2[i].NM_CODE_DTL;
      objOption.value = division2[i].FG_CODE_DTL;
      objOption.setAttribute("EditValue", division2[i].CD_CODE_DTL);
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;
    }
  } catch (error) {

  }

  try {
    for (let i = 0; i < division3.length; i++) {
      selectEl = document.querySelector("#division3");
      objOption = document.createElement("option");
      objOption.text = division3[i].NM_CODE_DTL;
      objOption.value = division3[i].FG_CODE_DTL;
      objOption.setAttribute("EditValue", division3[i].CD_CODE_DTL);
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;
    }
  } catch (error) { }

  try {
    //#region 특정기호        
    for (let i = 0; i < symbolSelOptionList.length; i++) {
      tempOptionText = symbolSelOptionList[i].CD_CODE_DTL + ':' + symbolSelOptionList[i].NM_CODE_DTL;
      tempOptionValue = symbolSelOptionList[i].FG_CODE_DTL;
      tempOptionEditValue = symbolSelOptionList[i].CD_CODE_DTL;

      selectEl = document.querySelector("#specificSymbol");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;

      selectEl = document.querySelector("#specificSymbol1");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;

      selectEl = document.querySelector("#specificSymbol2");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;

      // selectEl = document.querySelector("#waitingPatientInfoSpecificSymbol");
      // objOption = document.createElement("option");
      // objOption.text = symbolSelOptionList[i][1];
      // objOption.value = selectEl.length + 1;
      // selectEl.options.add(objOption);
      // selectEl.selectedIndex = 0;
      //#endregion      
    }
  } catch (error) { }


  //filteredData = data.filter(item => item.NM_CODE_DTL.includes("공단") && item.BL_USE_DTL === 1);

  try {
    //#region 의료급여본인부담구분코드    
    for (let i = 0; i < codeOpList.length; i++) {
      tempOptionText = codeOpList[i].CD_CODE_DTL + ':' + codeOpList[i].NM_CODE_DTL;
      tempOptionValue = codeOpList[i].FG_CODE_DTL;

      selectEl = document.querySelector("#code");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      selectEl.options.add(objOption);

      // selectEl = document.querySelector("#waitingPatientInfoCode");
      // objOption = document.createElement("option");
      // objOption.text = codeOpList[i];
      // objOption.value = codeOpList[i];
      // selectEl.options.add(objOption);

      selectEl = document.querySelector("#medicalOutOfPocket1");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      selectEl.options.add(objOption);
    }

    //#endregion
  } catch (error) { }

  try {
    //#region 보험유형
    for (let i = 0; i < insuranceTypeList.length; i++) {
      tempOptionText = insuranceTypeList[i].CD_CODE_DTL + ':' + insuranceTypeList[i].NM_CODE_DTL;
      tempOptionValue = insuranceTypeList[i].FG_CODE_DTL;
      tempOptionEditValue = insuranceTypeList[i].CD_CODE_DTL;

      selectEl = document.querySelector("#insuranceType1");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);

      selectEl = document.querySelector("#insuranceType2");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);

      selectEl = document.querySelector("#insuranceType3");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);

      selectEl = document.querySelector("#insuranceTypeSelect");
      objOption = document.createElement("option");
      objOption.text = tempOptionText;
      objOption.value = tempOptionValue;
      objOption.setAttribute("EditValue", tempOptionEditValue);
      selectEl.options.add(objOption);
    }
  } catch (error) { }

  //#endregion

  //#region 의료본인부담코드
  //filteredData = data.filter(item => item.CD_CODE_GRP === 10 && item.BL_USE_DTL === 1);
  //#endregion

  //#region 선택의료기관예외사유
  //filteredData = data.filter(item => item.CD_CODE_GRP === 10 && item.BL_USE_DTL === 1);
  //#endregion

  //#region 의료기관기호
  //filteredData = data.filter(item => item.CD_CODE_GRP === 10 && item.BL_USE_DTL === 1);
  //#endregion

  //산정특례본인부담률
  try {
    for (let i = 0; i < teductibleRateOpList.length; i++) {
      selectEl = document.querySelector("#deductibleRate");
      objOption = document.createElement("option");
      objOption.text = teductibleRateOpList[i][0];
      objOption.value = teductibleRateOpList[i][1];
      selectEl.options.add(objOption);
      selectEl.selectedIndex = 0;
    }
  } catch (error) { }


  try {
    // for (let i = 0; i < exceptionOpList1.length; i++) {
    //   selectEl = document.querySelector("#classificationOfExceptions");
    //   objOption = document.createElement("option");
    //   objOption.text = exceptionOpList1[i];
    //   objOption.value = exceptionOpList1[i];
    //   selectEl.options.add(objOption);

    //   // selectEl = document.querySelector("#waitingPatientInfoClassificationOfExceptions");
    //   // objOption = document.createElement("option");
    //   // objOption.text = exceptionOpList1[i];
    //   // objOption.value = exceptionOpList1[i];
    //   // selectEl.options.add(objOption);
    // }
  } catch (error) { }

  try {
    for (let i = 0; i < exceptionOpList2.length; i++) {
      selectEl = document.querySelector("#reasonForException");
      objOption = document.createElement("option");
      objOption.text = exceptionOpList2[i];
      objOption.value = exceptionOpList2[i];
      selectEl.options.add(objOption);

      // selectEl = document.querySelector("#waitingPatientInfoReasonForException");
      // objOption = document.createElement("option");
      // objOption.text = exceptionOpList2[i];
      // objOption.value = exceptionOpList2[i];
      // selectEl.options.add(objOption);
    }
  } catch (error) { }

  try {
    for (let i = 0; i < signOpList.length; i++) {
      selectEl = document.querySelector("#sign");
      objOption = document.createElement("option");
      objOption.text = signOpList[i];
      objOption.value = signOpList[i];
      //objOption.setAttribute("EditValue", tempOptionName);
      selectEl.options.add(objOption);

      // selectEl = document.querySelector("#waitingPatientInfoSign");
      // objOption = document.createElement("option");
      // objOption.text = signOpList[i];
      // objOption.value = signOpList[i];
      //objOption.setAttribute("EditValue", tempOptionName);
      // selectEl.options.add(objOption);
    }
  } catch (error) { }

  if (document.getElementById('receptionRoom')) {
    ChangeInsuranceTypeSelect();
    ChangeBeforeInsuranceTypeSelect(document.getElementById('insuranceType1'));
  }
}

async function Set_FG_UPDT(value) {
  var td = rightMouseTr.getElementsByTagName('td');

  // console.log(diagTalbeList);
  for (let i = 0; i < diagTalbeList.length; i++) {
    if (diagTalbeList[i].처방번호 == td[1].innerHTML) {
      var rc = new T_TREAT();
      if (diagTalbeList[i].수정구분 != value) {
        rc.NO_ACCEPT = diagTalbeList[i].접수번호;
        rc.CD_CHART = diagTalbeList[i].챠트번호;
        rc.NO_PRSCRPTN_ORDER = diagTalbeList[i].처방번호;
        rc.AMT_DOSAGE_1TH = diagTalbeList[i].투여량1회;
        rc.CNT_DOSAGE = diagTalbeList[i].투여횟수;
        rc.CNT_DOSAGE_DAYS = diagTalbeList[i].투여일수;
        //rc.CD_USAGE = diagTalbeList[i].용법코드;
        rc.BL_POUDER = diagTalbeList[i].파우더;
        rc.ID_MIXER = diagTalbeList[i].믹스구분;
        rc.FG_EXCPTN = diagTalbeList[i].예외구분;
        rc.DC_TREAT_MEMO = diagTalbeList[i].메모;
        rc.CD_SPCL = diagTalbeList[i].집계구분;
        rc.TY_PAY_APLY = diagTalbeList[i].급여적용;
        rc.MNY_UNPRC = diagTalbeList[i].단가;
        rc.SGN_DOCTOR = t_ACCEPT.ID_DOCT;
        rc.FG_UPDT = value;

        await Set_UpdatePostData('T_TREAT', rc);

        t_TREAT = await Get_T_TREAT(t_ACCEPT);

        for (let j = 0; j < recipeLstToAdd.length; j++) {
          if (recipeLstToAdd[j].처방번호 == diagTalbeList[i].처방번호) {
            recipeLstToAdd.splice(j, 1);
            for (let k = j; k < recipeLstToAdd.length; k++) {
              recipeLstToAdd[k].처방번호 -= 1;
            }
            break;
          }
        }
        var lst = t_TREAT;
        for (let j = 0; j < recipeLstToAdd.length; j++) {
          lst.push(recipeLstToAdd[j]);
        }

        TreatmentDetailsTableCreate(lst); //진료내역
      }
      return;
    }
  }
}

//진료대기 리스트 클릭
function WaitingPatientTableBtn(target) {
  ComnTbClick(target, 1);
}

//진료대기 리스트 클릭
function RecipeReservationTableBtn(target) {
  ComnTbClick(target);

  const chartNum = target.getAttribute('value');
  PatientSearchBtn(chartNum);
}