let data;
let current대기환자 = new C대기환자정보();
let isSpecificSymbolPopupOn = new Boolean(false); //특정기호팝업
let isInsuranceHistoryPopupOn = new Boolean(false); //보험이력팝업
//let isInsuranceInfo = new Boolean(false); //보험정보
var isInsuranceInfo = 0; //보험정보
let isSymbolSearchPopupOn = new Boolean(false); //기호검색팝업
let waitingPatientInfoPopupOn = new Boolean(false); //대기환자 - 접수정보팝업
let isNewChart = false; //신규차트
let introducerPopupOn = new Boolean(false); //환자검색

var insuranceType = 0; //보험유형

let waitingPatientTableIdx = -1; //대기환자 선택한 테이블 idx
let waitingPatientChartIdx = 0; //대기환자 선택한 테이블 환자 차트번호
var chartIdx = 0;
var todayDiagnosisCnt = 0; //오늘 진료 받은 횟수
let tempPatientInfo;
let isIntroducerPopupOn = new Boolean(false);
let no_treat;

// document.getElementById('currentDate').value = new Date();

//새 창 띄우기
let openWin;
var temp;

let togglebtns = [[document.getElementById('toggleBtn1').style, document.getElementById('totalMemo').style],
[document.getElementById('toggleBtn2').style, document.getElementById('officeMemo').style],
[document.getElementById('toggleBtn3').style, document.getElementById('receptionMemo').style],
]

//#region gridstack
var options = {
  cellHeight: 111.5, // 셀의 높이 설정 (단위: 픽셀)        
  margin: 2.5,
};

var grid = GridStack.init(options);
//#endregion

function ReceiptStart() {
  console.log('receipt Start')
  //this.담당자ID = MonoChartSettingManager.instance().Setting.EmrUser.ID_USER; 

  //오늘 날짜 구하기
  clock();

  //VitalInfo();
  ToggleBtn(0);

  StartRecipeReservationListCreate();
}

//환자기본정보 - 신규차트
async function NewChart(isReceptionBtn = false) {
  if (!isReceptionBtn) {
    ChartInfoInputRefresh();
  }

  if (isNewChart == false) {
    var chartLength = await GetData('SELECT COUNT(*) AS length FROM T_CHART');
    // console.log(chartLength)
    document.getElementById('chartNum').value = parseInt(chartLength[0].length) + 1;
    document.getElementById('chartNum').readOnly = true;
    document.getElementById('newChartBtn').innerHTML = '신규차트(취소)';
    isNewChart = true;
  }
  else {
    document.getElementById('chartNum').readOnly = false;
    document.getElementById('newChartBtn').innerHTML = '신규차트';
    isNewChart = false;
  }
}

function ChartInfoInputRefresh() {
  // 모든 input 엘리먼트를 가져옵니다.
  var inputs = document.querySelectorAll('input:not([type="date"])');
  var selects = document.querySelectorAll('select');
  // 각 input 엘리먼트의 값을 빈 문자열로 설정하여 초기화합니다.
  inputs.forEach((input) => {
    input.value = '';
  });

  selects.forEach((select) => {
    select.selectedIndex = 0;
  });
}


//현재 시간 구하기
function clock() {
  var today = new Date();
  var hours = ('0' + today.getHours()).slice(-2);
  var minutes = ('0' + today.getMinutes()).slice(-2);

  var timeString = hours + ':' + minutes;
  document.getElementById('currentTime').value = timeString;
}



//테이블 토글 버튼
$(document).ready(function () {

  $('ul.insuranceInfoTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.insuranceInfoTabs li').removeClass('current');
    $('.insuranceInfoTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.waitingPatientTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.waitingPatientTabs li').removeClass('current');
    $('.waitingPatientTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.jaewonPatientTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.jaewonPatientTabs li').removeClass('current');
    $('.jaewonPatientTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.storagePatientTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.storagePatientTabs li').removeClass('current');
    $('.storagePatientTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.receiptTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.receiptTabs li').removeClass('current');
    $('.receiptTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.reservationTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.reservationTabs li').removeClass('current');
    $('.reservationTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })
})

//특정기호 버튼
function SpecificSymbolBtn(isInsuranceInfo) {  
  this.isInsuranceInfo = isInsuranceInfo;
  PopupOn(6, false, 1000, 680);
}

//특정기호 검색 버튼
function SpecificSymbolSearch() {
  var tempList = document.getElementById('specificSymbolList');
  var idx = tempList.rows.length;
  for (let i = 0; i < idx; i++) {
    tempList.deleteRow(tempList.rows.length - 1);
  }

  for (let i = 0; i < symbolSelOptionList.length; i++) {
    for (let j = 0; j < symbolSelOptionList[i].length; j++) {
      if (symbolSelOptionList[i][j].includes(document.getElementById('specificSymbolInput').value)) {
        var html = '';
        html += '<tr id="symbolSelOptionList' + (i + 1) + '">';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + symbolSelOptionList[i][0] + '</td>';
        html += '<td>' + symbolSelOptionList[i][1] + '</td>';
        html += '<td>' + symbolSelOptionList[i][2] + '</td>';
        html += '<td><button name = "symbolSelOptionList' + (i + 1) + '" style="width:100%;" onclick="SpecificSymbolListBtn(' + (i + 1) + ');">선택</button></td>';
        html += '</tr>';
        $("#specificSymbolList").append(html);
        break;
      }
    }
  }
}

//특정기호 지우기 버튼
function SpecificSymbolClear() {
  var tempList = document.getElementById('specificSymbolList');
  var idx = tempList.rows.length;
  for (let i = 0; i < idx; i++) {
    tempList.deleteRow(tempList.rows.length - 1);
  }

  for (let i = 0; i < symbolSelOptionList.length; i++) {
    var html = '';
    html += '<tr id="symbolSelOptionList' + (i + 1) + '">';
    html += '<td>' + (i + 1) + '</td>';
    html += '<td>' + symbolSelOptionList[i][0] + '</td>';
    html += '<td>' + symbolSelOptionList[i][1] + '</td>';
    html += '<td>' + symbolSelOptionList[i][2] + '</td>';
    html += '<td><button name = "symbolSelOptionList' + (i + 1) + '" style="width:100%;" onclick="SpecificSymbolListBtn(' + (i + 1) + ',' + isInsuranceInfo + ');">선택</button></td>';
    html += '</tr>';
    $("#specificSymbolList").append(html);
  }

  document.getElementById('specificSymbolInput').value = '';
}

// //특정기호 버튼
// function SpecificSymbolListBtn(value) {
//   isSpecificSymbolPopupOn = !isSpecificSymbolPopupOn;
//   document.getElementById('specificSymbolPopup').style.display = 'none';
//   //  console.log(value);
//   //  console.log(insuranceType);
//   //  console.log(document.getElementById('specificSymbol' + insuranceType).value);
//   if (insuranceType != 1 && insuranceType != 2) {
//     insuranceType = 1;
//   }

//   if (this.isInsuranceInfo == 0) {
//     //보험정보 - 특정기호
//     console.log('specificSymbol' + (insuranceType));
//     document.getElementById('specificSymbol' + (insuranceType)).value = value;
//   }

//   else if (this.isInsuranceInfo == 1) {
//     //환자접수 정보 - 특정기호
//     document.getElementById('specificSymbol').value = value;
//     //환자접수 정보 - 산정특례본인부담률
//     //var select = document.getElementById('deductibleRate');
//     //select.selectedIndex = value - 1;
//   }
//   else {
//     //환자접수 정보 - 특정기호
//     document.getElementById('waitingPatientInfoSpecificSymbol').value = value;
//     //환자접수 정보 - 산정특례본인부담률
//     //var select = document.getElementById('deductibleRate');
//     //select.selectedIndex = value - 1;
//   }

// }

//보험이력 팝업 버튼
function InsuranceHistoryBtn() {
  if (tempPatientInfo == null) {
    alert("환자를 먼저 불러와주세요.")
    return;
  }

  temp = tempPatientInfo;
  PopupOn(5, false, 1200, 745);
}

//환자보험이력 테이블 리스트 버튼 - 환자보험이력 세부내역
function PatientInsuranceHistoryTableBtn(target) {
  ComnTbClick(target, 3);
}

function InsuranceType(value) {
  var id;
  switch (value) {
    case 3:
      if (document.getElementById("insuranceType2").selectedIndex == 3) {
        document.getElementById("insuranceInfo2").style.display = 'none';
        document.getElementById("insuranceInfo3").style.display = 'block';
        document.getElementById("insuranceType3").selectedIndex = 3;
        insuranceType = 3;
      }
      else {
        document.getElementById("insuranceInfo2").style.display = 'none';
        document.getElementById("insuranceInfo1").style.display = 'block';
        document.getElementById("insuranceType1").selectedIndex = document.getElementById("insuranceType2").selectedIndex;
        insuranceType = 1;
      }
      id = document.getElementById('insuranceType2');
      break;

    case 4:
      if (document.getElementById("insuranceType3").selectedIndex == 2) {
        document.getElementById("insuranceInfo3").style.display = 'none';
        document.getElementById("insuranceInfo2").style.display = 'block';
        document.getElementById("insuranceType2").selectedIndex = 2;
        insuranceType = 2;
      }

      else {
        document.getElementById("insuranceInfo3").style.display = 'none';
        document.getElementById("insuranceInfo1").style.display = 'block';
        document.getElementById("insuranceType1").selectedIndex = document.getElementById("insuranceType3").selectedIndex;
        insuranceType = 1;
      }
      id = document.getElementById('insuranceType3');
      break;

    default:
      if (document.getElementById("insuranceType1").selectedIndex == 2) {
        document.getElementById("insuranceInfo1").style.display = 'none';
        document.getElementById("insuranceInfo2").style.display = 'block';
        document.getElementById("insuranceType2").selectedIndex = 2;
        insuranceType = 2;
      }
      else if (document.getElementById("insuranceType1").selectedIndex == 3) {
        document.getElementById("insuranceInfo1").style.display = 'none';
        document.getElementById("insuranceInfo3").style.display = 'block';
        document.getElementById("insuranceType3").selectedIndex = 3;
        insuranceType = 3;
      }

      id = document.getElementById('insuranceType1');
      break;
  }

  ChangeBeforeInsuranceTypeSelect(id);
}

//환자기본정보 - 차트저장
function SaveChart() {
  let errMsg = "";

  if (document.getElementById('chartNum').value === "") {
    alert("챠트번호를 입력해주세요.");
    return;
  }

  if (document.getElementById('patientName').value === "") {
    alert("환자이름을 입력해주세요.");
    return;
  }

  if (document.getElementById('juminNumF').value === '' || document.getElementById('juminNumB').value === '') {
    alert("주민번호를 입력해주세요.");
    return;
  }

  // if (document.getElementById('patientName').value === "") {
  // alert("환자 보험정보의 보험유형을 선택해주세요.");
  //return;  

  let cd_chart = document.getElementById('chartNum').value;
  let s중복챠트번호 = '';

  if (SaveOrUpdate환자기본정보(cd_chart, s중복챠트번호)) {

    console.log('SaveOrUpdate환자기본정보 true');
    alert('환자정보가 저장되었습니다.');
    return;
    //수진자 자격조회
    if (_list수진자자격정보 != null && _list수진자자격정보.length > 0) {
      const cd_calc_spcl = _lue특정기호.EditValue === null ? "" : _lue특정기호.EditValue.toString();
      const no_srus_rug = _txt산정특례중증등록번호.EditValue === null ? "" : _txt산정특례중증등록번호.EditValue.toString();

      if (txt피보험자.style.display !== "none" && _list수진자자격정보[0].sedaejuNm.length > 20) {
        _list수진자자격정보[0].sedaejuNm = txt피보험자.value;
      }

      Common접수Util.instance().Save수진자자격정보(_db, cd_chart, _Selected산정특례대상자, _list수진자자격정보, cd_calc_spcl, no_srus_rug, _병원정보);
      _Selected산정특례대상자 = null;
      _list수진자자격정보 = [];

    } else {
      const 보험자격취득일 = dte보험자격취득일.value.replace(/-/g, "");

      if (보험자격취득일 === "" && confirm("보험자격취득일을 입력하지 않으면 보험정보는 저장되지 않습니다. 계속 진행하시겠습니까?") === false) {
        return;
      }

      Save챠트저장(cd_chart, 보험자격취득일);
    }

    if (_lue특정기호.EditValue.toString() === "V810" || _lue특정기호.EditValue.toString() === "V811") {
      alert("환자정보가 저장되었습니다. \r\n \r\n *특정기호(V810, V811)에 해당하는 환자는 사전승인 신청후 \r\n 청구특정내역(MT052)에 승인번호를 넣어주세요. \r\n \r\n*요양기관 정보마당 -> 산정특례 -> 중증치매 산정승인신청");

    } else {
      alert("환자정보가 저장되었습니다.");
    }

    if (_bIsNewPatient) {
      예약관리Open(txt챠트번호.Text, false);
    }
  }
  else {
    console.log('SaveOrUpdate환자기본정보 false');
  }
}

//email 선택
function EmailSelect() {
  var select = document.getElementById('emailSelect');
  //console.log(select.options[select.selectedIndex].text);
  if (select.selectedIndex == 0) {
    document.getElementById('eMailB').value = '';
  }
  else {
    document.getElementById('eMailB').value = select.options[select.selectedIndex].text;
  }
}

//외래접수
function OutpatientReceptionBtn() {
  console.log('접수 시작');
  // if (_current대기환자 == null)
  //   errMsg = "접수 대상 환자를 불러온 후 진행해 주세요.";

  // if (dte접수일자.EditValue == null)
  //   errMsg = "접수일자를 선택해 주세요.";

  // if (txt주민번호.EditValue == null)
  //   errMsg = "주민등록번호를 입력해 주세요.";

  // if (string.IsNullOrEmpty(cbo접수주치의.Text))
  //   errMsg = "주치의를 선택하세요.";

  // if (string.IsNullOrEmpty(cbo접수보험유형.Text))
  //   errMsg = "보험유형을 선택해주세요.";

  // if (string.IsNullOrEmpty(cbo진료실.Text) || cbo진료실.EditValue == null)
  //   errMsg = "진료실을 선택해주세요.";

  // if (cbo접수의료급여본인부담코드.EditValue != null && (string)cbo접수의료급여본인부담코드.EditValue == 본인부담여부Constant.B005_선택의료급여기관에서_의뢰된_자_1종2종 && string.IsNullOrEmpty(cbo의뢰기관기호.Text))
  // errMsg = "의뢰기관기호를 선택해 주세요.";

  // if (!string.IsNullOrEmpty(errMsg)) {
  //   frmSBError.ShowError("접수 불가", errMsg);
  //   return;
  // }

  if (document.getElementById('chartNum').value === "") {
    alert("챠트번호를 입력해주세요.");
    return;
  }

  if (document.getElementById('patientName').value === "") {
    alert("환자이름을 입력해주세요.");
    return;
  }

  if (document.getElementById('juminNumF').value === '' || document.getElementById('juminNumB').value === '') {
    alert("주민번호를 입력해주세요.");
    return;
  }

  let cd_chart = document.getElementById('chartNum').value;

  (async () => {
    try {
      await SaveOrUpdate환자기본정보(cd_chart);

      let ci = await Get최근보험정보(cd_chart);

      if (ci === undefined || ci.length == 0) {
        if (confirm("보험정보에 저장된 보험이 존재하지 않습니다. \r 보험종별을 '일반'으로 접수하시겠습니까?") == true) {
          let n_ci = Create_T_CHART_INS(cd_chart);
          Set_CreatePostData('T_CHART_INS', n_ci);

          document.getElementById('insuranceType1').selectedIndex = GetSelectOptionIndex('insuranceType1', n_ci.FG_ISRC);
          ChangeBeforeInsuranceTypeSelect(document.getElementById('insuranceType1'));
          document.getElementById('insuranceClassification1').selectedIndex = GetSelectOptionIndex('insuranceClassification1', n_ci.FG_ISRC_KIND);
        }
      }

      try {
        let ds_accept = fmtTodayDay.replace(/-/g, "");
        let cd_dept_sprt = document.getElementById('insuredPerson1').value;

        data = await GetData(`SELECT * FROM T_DEPT_SPRT WHERE CD_DEPT_SPRT = ${cd_dept_sprt}`);
        let ds = data[0];

        data = await GetData(`SELECT * FROM T_ACCEPT WHERE DS_TREAT = ${ds_accept} AND CD_CHART = ${cd_chart} AND TY_TREAT_STAT != ${진료상태Enum.TY00취소}`);
        let chk_ac = data[0];

        if (chk_ac != undefined) {
          if (confirm("당일 접수한 내역이 있습니다.\n계속 접수 진행 하시겠습니까?") == false) {
            return;
          }
        }

        let ac = await Create_T_ACCEPT(cd_chart);
        response = await Set_CreatePostData('T_ACCEPT', ac);

        SaveMemo(document.getElementById('chartNum').value, ac, 환자메모구분Constant.환자메모구분00_전체메모, document.getElementById('totalMemo').value, HyphenReplace(document.getElementById('currentDate').value));
        SaveMemo(document.getElementById('chartNum').value, ac, 환자메모구분Constant.환자메모구분02_진료실메모, document.getElementById('officeMemo').value, HyphenReplace(document.getElementById('currentDate').value));
        SaveMemo(document.getElementById('chartNum').value, ac, 환자메모구분Constant.환자메모구분01_접수메모, document.getElementById('receptionMemo').value, HyphenReplace(document.getElementById('currentDate').value));

        if (response) {
          StartWaitingPatientTableListCreate();
        }
      } catch (error) { }

    } catch (error) {
      console.error(error);
    }
  })();
}

//대기환자 테이블 버튼
async function WaitingPatientTableBtn(target) {
  ComnTbClick(target, 2);
  var json = GetJson(target);

  document.getElementById('receiptCencel').setAttribute("no_treat", json.NO_TREAT);
  document.getElementById('receiptCencel').setAttribute("no_accept", json.NO_ACCEPT);
  no_treat = json.NO_TREAT;
}

//대기환자 - 접수취소
async function WaitingPatientTableDelete() {
  try {
    var chartNum = document.getElementById('receiptCencel').getAttribute('cd_chart');
    var chartName = document.getElementById('receiptCencel').getAttribute('nm_chart');
    var no_treat = document.getElementById('receiptCencel').getAttribute('no_treat');
    var no_accept = document.getElementById('receiptCencel').getAttribute('no_accept');

    if (chartNum == null) {
      alert('환자정보가 없습니다');
      return;
    }

    if (confirm(chartName + '(' + chartNum + ')' + '님 접수취소 하시겠습니까?') == true) {
      var acc = await GetData(`SELECT * FROM T_TREAT WHERE NO_ACCEPT = '${no_accept}'`);
      for (let i = 0; i < acc.length; i++) {
        if (acc[i].FG_UPDT != 처방수정구분Enum.FG01삭제) {
          alert('처방내역이 있으므로[접수취소]를 진행 할 수 없습니다.\n처방내역 삭제 후 접수 취소를 다시 진행하여 주십시오.');
          return;
        }
      }

      acc = {
        CD_CHART: chartNum,
        NO_ACCEPT: no_accept,
        NO_TREAT: no_treat
      }
      await Set_DeletePostData('T_ACCEPT', acc);
      RefreshTables();
    }
  } catch (error) {
    console.log(error);
  }
}

function InsuranceTypeSelectedIndex(insuranceType, id) {
  switch (insuranceType) {
    case 'satin':
      insuranceType = 0;
      break;
    case '공단':
      insuranceType = 0;
      break;
    case 'salary':
      insuranceType = 1;
      break;
    case '급여':
      insuranceType = 1;
      break;
    case 'jabo':
      insuranceType = 2;
      break;
    case '자보':
      insuranceType = 2;
      break;
    case 'interspersed':
      insuranceType = 3;
      break;
    case '산재':
      insuranceType = 3;
      break;
    case 'veterans':
      insuranceType = 4;
      break;
    case '보훈':
      insuranceType = 4;
      break;
    case 'nomal':
      insuranceType = 5;
      break;
    case '일반':
      insuranceType = 5;
  }

  document.getElementById(id).selectedIndex = insuranceType;
}

//내원정보
function VisitInfo(idx) {
  var name = "";
  name = 'outpatientReception' + idx;
  var patientInfo = JSON.parse(localStorage.getItem(name));
  var html = '';

  var table = document.getElementById('visitInfoList');
  for (let i = 0; i < table.rows.length; i) {
    table.deleteRow(table.rows.length - 1);
  }

  //console.log(patientInfo);

  if (patientInfo != null) {
    for (let i = 0; i < patientInfo.diagnosisList.length; i++) {
      html = '';
      html += '<tr>';
      html += '<td></td>';
      html += '<td id="진료일자">' + patientInfo.diagnosisList[i].접수날짜 + '</td>';
      html += '<td id="접수시간">' + patientInfo.diagnosisList[i].접수시간 + '</td>';
      html += '<td id="초재진">' + patientInfo.diagnosisList[i].진료구분1 + '</td>';
      html += '<td id="보험구분">' + patientInfo.diagnosisList[i].보험구분 + '</td>';
      html += '<td id="구분">' + patientInfo.diagnosisList[i].진료상태 + '</td>';
      html += '<td id="진료실코드">' + patientInfo.diagnosisList[i].진료실 + '</td>';
      html += '<td id="주치의">' + patientInfo.diagnosisList[i].주치의 + '</td></td>';
      html += '<td id="전달사항">' + patientInfo.diagnosisList[i].전달사항 + '</td>';
      html += '</tr>';
      $("#visitInfoList").append(html);
    }
  }
}

//바이탈 정보 테이블 생성
function VitalInfo(idx) {
  var name = "";
  name = 'vitalInfo' + idx;
  var patientInfo = JSON.parse(localStorage.getItem(name));
  var html = '';

  var table = document.getElementById('vitalInfoList');
  for (let i = 0; i < table.rows.length; i) {
    table.deleteRow(table.rows.length - 1);
  }
  // console.log(patientInfo);

  var input = '<input type="text" style="width: 50px; border:none; background-color: white;"></input>';

  html = '';
  html += '<tr>';
  html += '<td></td>';
  html += '<td id="기록일자"><input type="date" style="width: 100px; border:none; background-color: white;"></td>';
  html += '<td id="시간"><input type="time" style="width: 100px; border:none; background-color: white;"></td>';
  html += '<td id="혈압H">' + input + '</td>';
  html += '<td id="혈압L">' + input + '</td>';
  html += '<td id="체온">' + input + '</td>';
  html += '<td id="맥박">' + input + '</td>';
  html += '<td id="호흡">' + input + '</td></td>';
  html += '<td id="BST">' + input + '</td>';
  html += '<td id="체중">' + input + '</td>';
  html += '<td id="수정자">' + input + '</td>';
  html += '<td><button style="border:none; background-color: white;">저장</button></td>';
  html += '</tr>';
  var initTable = html;

  if (idx != null) {
    if (patientInfo != null) {
      html = '';
      html += '<tr>';
      html += '<td></td>';
      html += '<td id="기록일자">' + +'</td>';
      html += '<td id="시간">' + +'</td>';
      html += '<td id="혈압H">' + +'</td>';
      html += '<td id="혈압L">' + +'</td>';
      html += '<td id="체온">' + +'</td>';
      html += '<td id="맥박">' + +'</td>';
      html += '<td id="호흡">' + +'</td></td>';
      html += '<td id="BST">' + +'</td>';
      html += '<td id="체중">' + +'</td>';
      html += '<td id="수정자">' + +'</td>';
      html += '<td><button style="border:none; background-color: white;">삭제</button></td>';
      html += '</tr>';
      $("#vitalInfoList").append(html);
      $("#vitalInfoList").append(initTable);
    }
    else {
      $("#vitalInfoList").append(initTable);
    }
  }
  else {
    $("#vitalInfoList").append(initTable);
  }
}



function ChangeInsuranceTypeSelect() {
  $("#insuranceClassification").empty();
  var langSelect = document.getElementById("insuranceTypeSelect");
  var select = document.getElementById('insuranceClassification');
  var selectedIndex = langSelect.selectedIndex + 1;
  var tempOptionText;
  var tempOptionValue;

  if (selectedIndex == '6') {
    selectedIndex = '99';
  }

  for (let i = 0; i < insuranceClassificationList.length; i++) {
    if (selectedIndex == insuranceClassificationList[i].FG_CODE_DTL) {
      tempOptionText = insuranceClassificationList[i].CD_CODE_DTL + ':' + insuranceClassificationList[i].NM_CODE_DTL;
      tempOptionValue = insuranceClassificationList[i].CD_CODE_DTL;
      AddOption(select, tempOptionText, tempOptionValue);
    }
  }
}

function ChangeBeforeInsuranceTypeSelect(id) {
  var langSelect = id;
  var select = document.getElementById('insuranceClassification');
  var selectedIndex = langSelect.selectedIndex + 1;
  var tempOptionText;
  var tempOptionValue;

  if (isNaN(selectedIndex)) {
    selectedIndex = '1';
  } else if (selectedIndex == '6') {
    selectedIndex = '99';
  }

  switch (selectedIndex) {
    case 3:
      $("#insuranceClassification2").empty();
      select = document.getElementById('insuranceClassification2');
      break;
    case 4:
      $("#classificationOfIndustrialAccidents3").empty();
      select = document.getElementById('classificationOfIndustrialAccidents3');
      break;
    default:
      $("#insuranceClassification1").empty();
      select = document.getElementById('insuranceClassification1');
      break;
  }

  for (let i = 0; i < insuranceClassificationList.length; i++) {
    if (selectedIndex == insuranceClassificationList[i].FG_CODE_DTL) {
      tempOptionText = insuranceClassificationList[i].CD_CODE_DTL + ':' + insuranceClassificationList[i].NM_CODE_DTL;
      tempOptionValue = insuranceClassificationList[i].CD_CODE_DTL;
      AddOption(select, tempOptionText, tempOptionValue);
    }
  }
}

function ChangeDeductibleRate() {
  document.getElementById('deductibleRate').value = document.getElementById('specificSymbol').value;
}

function AddOption(selectElement, value, EditValue) {
  var option = document.createElement("option");
  option.value = value;
  option.text = value;
  option.setAttribute("EditValue", EditValue);
  selectElement.appendChild(option);
}

function moveToNextInput(currentInput, nextInputId) {
  var maxLength = parseInt(currentInput.getAttribute('maxlength'), 10);
  var currentLength = currentInput.value.length;

  if (currentLength === maxLength) {
    var nextInput = document.getElementById(nextInputId);

    if (nextInput) {
      nextInput.focus();
    }
  }
}

function JuminBInput(el, maxlength) {
  if (el.value.length > maxlength) {
    el.value
      = el.value.substr(0, maxlength);
  }

  document.getElementById('age').value = AgeCalculation(0, el.value);
}

function FilterNumber() {
  const inputElement = document.getElementById('phoneNumber');
  let inputValue = inputElement.value;

  // 숫자와 하이픈(-)만 남기고 모두 제거
  inputValue = inputValue.replace(/[^\d-]/g, '');

  inputElement.value = inputValue;
  AddHyphen(); // 하이픈 추가 함수 호출
}

function AddHyphen() {
  var inputElement = document.getElementById('phoneNumber');
  let inputValue = inputElement.value.replace(/-/g, ''); // 기존의 하이픈 제거

  if (inputValue.length >= 3) {
    inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3); // 3자리 다음에 하이픈 추가
  }

  inputElement.value = inputValue;
}

document.addEventListener('keydown', function (event) {
  var isBackspacePressed = event.keyCode === 8;
  if (isBackspacePressed) {
    if (event.target.id == 'phoneNumber') {
      var inputElement = document.getElementById('phoneNumber');
      let inputValue = inputElement.value;
      if (inputValue.length == 4) {
        inputValue = inputElement.value.replace(/-/g, '');
        inputElement.value = inputValue;
      }
    }
  }
});

function InsuranceCompanyInput(value) {
  for (let i = 0; i < iCompOpList.length; i++) {
    if (iCompOpList[i][0].includes(value)) {
      document.getElementById('jaboCompanyName2').value = iCompOpList[i][1];
      return;
    }
    else {
      document.getElementById('jaboCompanyName2').value = '';
    }
  }
}

function ToggleBtn(value) {
  for (let i = 0; i < togglebtns.length; i++) {
    if (value == i) {
      togglebtns[i][0].backgroundColor = 'rgb(211, 227, 243)';
      togglebtns[i][1].display = 'block';
    }
    else {
      togglebtns[i][0].backgroundColor = 'rgb(255, 255, 255)';
      togglebtns[i][1].display = 'none';
    }
  }
}

async function SaveOrUpdate환자기본정보(s챠트번호, s중복챠트번호) {
  var bRet = true;
  var bIsNew = false;

  (async () => {
    try {
      var data = await GetData(`SELECT * FROM T_CHART WHERE CD_CHART = ${s챠트번호}`);
      console.log(data);
      var chart;

      if (data.length > 0) {
        chart = data[0];
      }
      else {
        bIsNew = true;

        chart = new T_CHART();
        chart.DT_VIST_FRST = fmtTodayDay;
        chart.DT_VIST_LST = fmtTodayDay;
      }

      chart.CD_CHART = document.getElementById('chartNum').value;
      chart.NM_CHART = document.getElementById('patientName').value;
      chart.NO_JUMIN_ENC = document.getElementById('juminNumF').value + document.getElementById('juminNumB').value;
      // let strNoJumin = document.getElementById('juminNumF').value + document.getElementById('juminNumB').value;

      // if (strNoJumin.trim() !== "") {
      //   // strNoJumin를 암호화하고 바이트 배열로 받아온다는 가정하에 진행합니다.
      //   const baEnc = await EncryptNoJumin(strNoJumin);

      //   chart.NO_JUMIN_ENC = baEnc;
      //   fichart.DS_BIRTH = GetBirthDayByNoJumin(strNoJumin);
      //   chart.TY_SEX = GetSexByNoJumin(strNoJumin);
      // } else {
      //   chart.NO_JUMIN_ENC = null;
      // }

      chart.NO_TEL = document.getElementById('homeNumberF').value + document.getElementById('homeNumberB').value;
      chart.NO_MOBILE = document.getElementById('phoneNumber').value;
      chart.TY_MOBILE = 0;
      chart.DC_EMAIL = `${document.getElementById('eMailF').value}@${document.getElementById('eMailB').value}`;
      chart.CD_ZIP = document.getElementById('zipcode').value;
      chart.DC_ADDR = document.getElementById('address').value;
      chart.DC_ADDR_DTL = document.getElementById('detailedAddress').value;
      //chart.DC_ADDR1 = '';
      //chart.DC_ADDR2 = '';
      //chart.DC_ADDR3 = '';
      chart.BL_PRVT_AGREE = document.getElementById('chk개인정보동의').checked;
      chart.BL_INCM_EXCPT = false;
      chart.BL_CRM_REG = false;
      chart.BL_ACTL_EXPNC_ISRC = false;

      if (document.getElementById('chkBrainMap').checked == true) {
        if (!chart.DC_CHART_CHARTR) {
          chart.DC_CHART_CHARTR = "Brain Map";
        } else if (!chart.DC_CHART_CHARTR.includes("Brain Map")) {
          chart.DC_CHART_CHARTR += "/Brain Map";
        }
      }
      else {
        if (chart.DC_CHART_CHARTR) {
          const index = chart.DC_CHART_CHARTR.indexOf("/Brain Map");
          if (index === -1) {
            chart.DC_CHART_CHARTR = chart.DC_CHART_CHARTR.replace("Brain Map", "");
          } else {
            chart.DC_CHART_CHARTR = chart.DC_CHART_CHARTR.replace("/Brain Map", "");
          }
        }
      }

      //.ID_UPDT = this.담당자ID;
      chart.DT_UPDT = fmtTodaySec;
      //chart.CD_DSCNT = cbo수납할인.value.toString();
      //chart.TY_NTNL = parseInt(cbo외국인여부.value);

      if (bIsNew) {
        chart.BL_PSBL_PRGNT = false;    //임신가능여부
        //chart.ID_RGST = this.담당자ID;
        chart.DT_RGST = fmtTodaySec;

        await Set_CreatePostData('T_CHART', chart);

        bRet = true;

        if (isNewChart) {
          NewChart(true);
        }
      }
      else {
        chart.BL_PRIGN = 0;
        chart.BL_PSBL_PRGNT = 0;
        chart.DT_UPDT = fmtTodaySec;
        chart.DT_VIST_LST = fmtTodaySec;
        await Set_UpdatePostData('T_CHART', chart);
      }
    } catch (error) {
      console.log(error);
      bRet = false;
    }

    return bRet;
  })();
}



async function Create_T_ACCEPT(cd_chart) {
  try {
    let ac = new T_ACCEPT();

    let ty_accept = '00'; //입원이 없어서 고정

    let iNo_treat = 1;
    let sNo_treat = '';
    let ds_accept = HyphenReplace(document.getElementById('currentDate').value);

    // 최종 - 진료번호 얻기(NO_TREAT)    
    prev_ac = await GetData(`SELECT * FROM T_ACCEPT WHERE CD_CHART = ${cd_chart} AND DS_TREAT = ${ds_accept} ORDER BY NO_TREAT DESC LIMIT 1`);

    if (prev_ac.length > 0) {
      iNo_treat = prev_ac[0].NO_TREAT + 1;
    }

    sNo_treat = iNo_treat.toString().padStart(2, '0');
    let no_accept = `${ty_accept}${cd_chart.padStart(10, '0')}${ds_accept}${sNo_treat}`;

    ac.NO_ACCEPT = no_accept.replace(/[-\s]/g, "");
    ac.TY_ACCEPT = parseInt(ty_accept);
    ac.CD_CHART = cd_chart;
    ac.NO_TREAT = iNo_treat;
    ac.DC_AGE_PTNT = document.getElementById('age').value;
    ac.DS_TREAT = ds_accept.replace(/[-\s]/g, "");

    var jumin = document.getElementById('juminNumF').value + document.getElementById('juminNumB').value;
    let iAge = GetAgeByNoJumin(jumin);
    
    let cd_dept_sprt = GetSelcetEditValue('doctorOffice');
    let T_DEPT_SPRT = await GetData('SELECT * FROM T_DEPT_SPRT');
    let ds = T_DEPT_SPRT.find(t => t.CD_DEPT_SPRT === cd_dept_sprt);
    ac.CD_DEPT_SPRT = ds.CD_DEPT_SPRT;
    ac.CD_TREAT_SBJT = ds.CD_TREAT_SBJT;    

    ac.ID_DOCT = T_DOCTOR[document.getElementById('doctor').selectedIndex].ID_USER;
    ac.TY_FRST_TREAT = document.getElementById('division1').selectedIndex;
    ac.TY_NGHT_HLDY = document.getElementById('division2').selectedIndex;
    ac.TY_CHCKUP = document.getElementById('division3').selectedIndex;

    let en나이구분 = Get나이구분(iAge);

    ac.TY_AGE = parseInt(en나이구분);

    ac.FG_ISRC = GetEditvalue('insuranceTypeSelect');
    ac.FG_ISRC_KIND = GetEditvalue('insuranceClassification') === undefined ? '0' : GetEditvalue('insuranceClassification');
    ac.TY_FIXED_AMT_RATE = 정액정율Enum.정액정율0정액;
    ac.TY_CALC_SPCL = parseInt(document.getElementById('deductibleRate').value);    
    ac.CD_SPCF_SMBL = GetEditvalue('specificSymbol') === undefined ? '' : GetEditvalue('specificSymbol');
    ac.TY_INJRY_UNTRL = ac.TY_FRST_TREAT === parseInt(초재진구분Enum.TY05시설내처방) ? J촉탁의진료 : ''; // 초재진구분이 시설내처방이면 상해외인 "J"
    //ac.ID_RGST = this.담당자ID; 수정해야함

    let dt = FmtTodaySec(new Date(document.getElementById('currentDate').value));

    ac.DT_RGST = dt;

    ac.TY_TREAT_STAT = 진료상태Enum.TY01접수;
    ac.TY_RCPT_STAT = 수납상태구분Enum.TY00미수납;
    ac.TY_ISRC_CHRG = 보험청구여부Enum.보험청구여부1청구;
    ac.BL_MDCL_RGST = false;
    ac.BL_SLCT_TREAT = Boolean(parseInt(선택의료신청Enum.선택의료신청0안함));
    //ac.BL_MXM_EXCD = _병원정보.본인부담상한제사용 === parseInt(CommonYesOrNoEnum.Yes);
    ac.TY_SELF_CHRG = GetEditvalue('code') !== undefined ? GetEditvalue('code') : '';
    ac.NO_ASK_ORG = GetEditvalue('sign') !== undefined ? GetEditvalue('sign') : '';
    ac.BL_PRGNT = false;
    //ac.ID_UPDT = this.담당자ID;
    ac.DT_UPDT = dt;
    ac.BL_PRMTR = false;
    ac.FG_RCPT_END = parseInt(영수증마감Enum.TY00마감X);
    ac.CD_DSCNT = GetEditvalue('discount') !== null ? GetEditvalue('discount').toString() : `${parseInt(할인코드042Enum.할인코드0할인없음)}`;
    // ac.CD_DSCNT = `${parseInt(할인코드042Enum.할인코드0할인없음)}`;

    ac.DC_TRANS_MEMO = document.getElementById('officeMemo').value;
    if (ac.FG_ISRC === parseInt(보험구분002Enum.보험구분2의료급여)) {
      // frmSBInfo.ShowInfomation("진료의뢰서 확인", "1차 의료기관에서 발행한 진료의뢰서를 확인하세요.");
      alert("진료의뢰서 확인 \n 1차 의료기관에서 발행한 진료의뢰서를 확인하세요.");
    }

    ac.DT_TREAT_TIME = fmtTodayDay + ' 00:00:00';
    ac.DT_TREAT_START = dt;
    return ac;
  } catch (error) {
    console.log(error);
  }
}

function Create_T_CHART_INS(cd_chart) {
  let n_ci = new T_CHART_INS();
  n_ci.CD_CHART = cd_chart;
  n_ci.DS_APLY = fmtTodayDay.replace(/-/g, "");
  n_ci.DT_UPDT = fmtTodaySec;
  n_ci.FG_ISRC = 보험구분002Enum.보험구분99일반;
  n_ci.FG_ISRC_KIND = 보험종별구분_공통99본인;
  //n_ci.ID_UPDT = this.담당자ID;

  return n_ci;
}

async function Refresh환자메모(cd_chart) {
  document.getElementById('totalMemo').value = await Get환자메모(cd_chart, 환자메모구분Constant.환자메모구분00_전체메모);
  document.getElementById('officeMemo').value = await Get환자메모(cd_chart, 환자메모구분Constant.환자메모구분02_진료실메모);
  document.getElementById('receptionMemo').value = await Get환자메모(cd_chart, 환자메모구분Constant.환자메모구분01_접수메모);
}

async function Get환자메모(cd_chart, fg_memo) {
  let mm;
  // if (fg_memo === 환자메모구분Constant.환자메모구분02_진료실메모) {
  //   // 진료실메모는 ACCEPT의 DC_TRANS_MEMO(전달사항) 표시
  //   var ac = await GetData(`SELECT * FROM T_ACCEPT WHERE CD_CHART = ${cd_chart} AND DC_TRANS_MEMO != '' AND NO_TREAT = ${no_treat} ORDER BY DS_TREAT DESC LIMIT 1`);
  //   if (ac.length > 0) {
  //     mm = {
  //       CD_CHART: cd_chart,
  //       TY_CHART_MEMO: fg_memo,
  //       DC_CHART_MEMO: ac[0].DC_TRANS_MEMO,
  //       DC_CHART_MEMO_EXT: "",
  //       DS_CHART_MEMO: ac[0].DS_TREAT,
  //       DT_RGST: null,
  //       DT_UPDT: null,
  //       //IMG_NOTEFILE: ac.IMG_NOTEFILE
  //     };
  //   }
  // } else {
  //   if (no_treat == undefined) {
  //     mm = await GetData(`SELECT * FROM T_CHART_MEMO WHERE TY_CHART_MEMO = '${fg_memo}' AND CD_CHART = '${cd_chart}' ORDER BY DS_CHART_MEMO DESC LIMIT 1`);
  //     console.log(mm);
  //     mm = mm[mm.length - 1];
  //   }
  //   else {
  //     mm = await GetData(`SELECT * FROM T_CHART_MEMO WHERE TY_CHART_MEMO = '${fg_memo}' AND CD_CHART = '${cd_chart}' AND NO_TREAT = ${no_treat} ORDER BY DS_CHART_MEMO DESC LIMIT 1`);
  //     console.log(mm);
  //     mm = mm[0];
  //   }
  // }
  
  if (no_treat == undefined) {
    mm = await GetData(`SELECT * FROM T_CHART_MEMO WHERE TY_CHART_MEMO = '${fg_memo}' AND CD_CHART = '${cd_chart}' ORDER BY DS_CHART_MEMO DESC LIMIT 1`);    
    mm = mm[mm.length - 1];
  }
  else {
    mm = await GetData(`SELECT * FROM T_CHART_MEMO WHERE TY_CHART_MEMO = '${fg_memo}' AND CD_CHART = '${cd_chart}' AND NO_TREAT = ${no_treat} ORDER BY DS_CHART_MEMO DESC LIMIT 1`);    
    mm = mm[0];
  }

  if (mm === null || mm === undefined) {
    mm = {
      CD_CHART: cd_chart,
      TY_CHART_MEMO: fg_memo,
      DC_CHART_MEMO: "",
      DC_CHART_MEMO_EXT: "",
      DS_CHART_MEMO: "",
      DT_RGST: null,
      DT_UPDT: null,
      IMG_NOTEFILE: null
    };
  }

  return mm.DC_CHART_MEMO;
}



function GetEditvalue(id) {
  var value = document.getElementById(id).options[document.getElementById(id).selectedIndex].getAttribute('editvalue');

  return value;
}

//#region 옮겨야 하는 함수
// 아래와 같이 암호화 함수를 가정하고 사용합니다.
async function EncryptNoJumin(strNoJumin) {
  // 암호화 라이브러리를 사용하여 주민등록번호를 암호화하고 바이트 배열을 반환
  // 예시: CryptoJS를 사용하는 경우
  const encryptedData = CryptoJS.AES.encrypt(strNoJumin, MonoSystemConstant.EncryptKey);
  return new Uint8Array(Buffer.from(encryptedData.toString(), 'base64'));
}

function GetAgeDouble(birthDay, ds기준일자 = "", dt기준일자 = new Date()) {
  let birthday = birthDay;

  if (ds기준일자 !== "") {
    dt기준일자 = new Date(ds기준일자);
  }

  if (isNaN(dt기준일자.getTime())) {
    dt기준일자 = new Date(); // 기준일자 미존재하거나 날짜형식으로 변환 실패 시 현재일자 기준으로 구함
  }

  let dAge = 0.0;

  try {
    let dtBirthDay = new Date(birthDay);

    if (isNaN(dtBirthDay.getTime())) {
      // 생년월일 날짜 형식으로 변환 실패 시 앞 2자리 연도 + 1월 1일로 계산
      dtBirthDay = new Date(birthday.substring(0, 4) + "-01-01");
    }

    dAge = dt기준일자.getFullYear() - dtBirthDay.getFullYear();

    if (
      dt기준일자.getMonth() < dtBirthDay.getMonth() ||
      (dt기준일자.getMonth() === dtBirthDay.getMonth() && dt기준일자.getDate() < dtBirthDay.getDate())
    ) {
      dAge--;
    }
  } catch (ex) {
    console.error(`[${GetAgeDouble.name}]: ${ex.message}(${birthday})`);
    dAge = -1;
  }

  return dAge;
}

//#endregion
