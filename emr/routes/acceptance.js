// let tempPatientInfo;
let tempListIdx;

let specificDetailsPopup = new Boolean(false); //특정내역팝업

titleName = document.getElementById('storageRoom').innerHTML;
let b차액결제 = false;
let _currentAcpDRG차액결제 = null;
let _currentReqOthSbjt = null;
let _currentAcceptin = null;

//#region gridstack
var options = {
  cellHeight: 129.5, // 셀의 높이 설정 (단위: 픽셀)   
  margin: 2.5,
};
//#endregion

var grid = GridStack.init(options);

(async function Start() {
  //buildCalendar();  
  StartWaitingPatientTableListCreate();

  var lue할인코드 = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP ='42'`);
  for (let i = 0; i < lue할인코드.length; i++) {
    selectEl = document.querySelector("#acceptInfo15");
    objOption = document.createElement("option");
    objOption.text = lue할인코드[i].NM_CODE_DTL;
    objOption.value = lue할인코드[i].FG_CODE_DTL;
    objOption.setAttribute("EditValue", lue할인코드[i].CD_CODE_DTL);
    selectEl.options.add(objOption);
    selectEl.selectedIndex = 0;
  }
})();

//테이블
$(document).ready(function () {
  $('ul.patientListTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.patientListTabs li').removeClass('current');
    $('.patientListTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.diagnosisSangbyeongListTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.diagnosisSangbyeongListTabs li').removeClass('current');
    $('.diagnosisSangbyeongListTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.treatmentHistoryListTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.treatmentHistoryListTabs li').removeClass('current');
    $('.treatmentHistoryListTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
    if (tab_id == 'treatmentHistoryListTab-1') {
      document.getElementById('checkDiag').style.display = 'block';
    }
    else {
      document.getElementById('checkDiag').style.display = 'none';
    }
  })
})

//진료내역요약 리스트 만들기
function SummaryOfCareTableCreate(idx) {
  const table = document.getElementById('summaryOfCareList');
  for (let i = 0; i < table.rows.length;) {
    table.deleteRow(-1);
  }

  //console.log(table.rows.length);

  var name = "";

  name = 'outpatientReception' + idx;
  var patientInfo = JSON.parse(localStorage.getItem(name));

  if (patientInfo != null) {
    for (let i = 0; i < patientInfo.diagnosisList.length; i++) {
      var html = '';
      html += '<tr onclick="SummaryOfCareBtn(this);">';
      html += '<td></td>';
      html += '<td id="날짜' + '">' + patientInfo.diagnosisList[i].접수날짜 + '</td>';
      html += '<td id="진료실' + '">' + patientInfo.diagnosisList[i].진료실 + '</td>';
      html += '</tr>';
      $("#summaryOfCareList").append(html);
    }
  }
}

//진료내역요약 테이블 버튼
function SummaryOfCareBtn(target) {
  ComnTbClick(target, 14);
}

//수납정보 생성
function AcceptInfoCreate() {
  document.getElementById('acceptInfo1').value = txt본인부담산정식;
  document.getElementById('acceptInfo2').value = t_ACCEPT.DT_RGST.substring(0, 10);
  document.getElementById('acceptInfo3').value = document.getElementById('acceptInfo3').value;
  document.getElementById('acceptInfo4').checked = chk전액할인;
  document.getElementById('acceptInfo5').value = document.getElementById('acceptInfo5').value;
  document.getElementById('acceptInfo6').value = txt환자본인부담금;
  document.getElementById('acceptInfo7').value = document.getElementById('acceptInfo7').value;
  document.getElementById('acceptInfo10').value = document.getElementById('acceptInfo10').value;
  document.getElementById('acceptInfo11').value = document.getElementById('acceptInfo11').value;
  document.getElementById('acceptInfo13').value = txt상한초과금액;
  document.getElementById('acceptInfo17').value = document.getElementById('acceptInfo17').value;
  document.getElementById('acceptInfo25').value = txt이미수납한금액;
  document.getElementById('acceptInfo23').value = FmtTodayDay(t_ACCEPT.DT_RGST);

  RefreshGrd수납내역();
}

async function ReceptionInfo(acc) {
  document.getElementById('receiptInfo1').innerHTML = acc.DS_TREAT;
  document.getElementById('receiptInfo2').innerHTML = (T_DOCTOR.find(t => t.CD_DEPT_SPRT == acc.CD_DEPT_SPRT) || {}).DC_REMARK;
  document.getElementById('receiptInfo3').innerHTML = (insuranceTypeList.find(t => t.CD_CODE_DTL == acc.FG_ISRC) || {}).NM_CODE_DTL;
  document.getElementById('receiptInfo4').innerHTML = (insuranceClassificationList.find(t => t.CD_CODE_DTL == acc.FG_ISRC_KIND) || {}).NM_CODE_DTL;
  document.getElementById('receiptInfo5').innerHTML = `외래:${(division1.find(t => t.CD_CODE_DTL == acc.TY_FRST_TREAT) || {}).NM_CODE_DTL}`;
  var temp = (symbolSelOptionList.find(t => t.CD_CODE_DTL == acc.CD_SPCF_SMBL) || {}).NM_CODE_DTL;
  document.getElementById('receiptInfo6').innerHTML = temp == undefined ? '' : temp;

  var ci = (await GetData(`SELECT * FROM T_CHART_INS WHERE CD_CHART = ${acc.CD_CHART} AND DS_APLY = ${acc.DS_TREAT} ORDER BY DS_APLY DESC`))[0];
  document.getElementById('receiptInfo7').innerHTML = ci == undefined ? '' : ci.NO_SRUS_REG;

  var hii = (await GetData(`SELECT * FROM T_HSPTL_INFO_INS WHERE DS_APLY <= ${acc.DS_TREAT} ORDER BY DS_APLY DESC`))[0];
  if (acc.FG_ISRC == 보험구분002Enum.보험구분2의료급여 && hii) {
    if (acc.FG_ISRC_KIND == 보험종별구분_급여1_1종) {
      document.getElementById('receiptInfo8').innerHTML = hii.RT_SLFPAY_MC_ISRC1;
    }
    else {
      document.getElementById('receiptInfo8').innerHTML = hii.RT_SLFPAY_MC_ISRC2;
    }
  } else {
    document.getElementById('receiptInfo8').innerHTML = '-';
  }

  document.getElementById('receiptInfo9').innerHTML = '0';

  var memo = (await GetData(`SELECT * FROM T_CHART_MEMO WHERE CD_CHART = ${acc.CD_CHART} AND NO_TREAT = ${acc.NO_TREAT} AND TY_CHART_MEMO = ${환자메모구분Constant.환자메모구분03_수납메모}`))[0];
  document.getElementById('acceptInfo24').value = memo.DC_CHART_MEMO;
}

function CmdReceiptViewer_Click() {
  _진료비명세서._이미납부한금액 = ConvertDecimalFromTextEditValue(txt이미수납한금액);
  _진료비명세서._납부한금액_카드 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo10').value);
  _진료비명세서._납부한금액_현금 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo7').value) - ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo9').value);
  _진료비명세서._납부한금액_계좌이체 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo11').value);
  _진료비명세서._납부한금액_현금영수증 = 0;
  // _진료비명세서.미수금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo21').value);
  _진료비명세서._미수금액 = ConvertDecimalFromTextEditValue(0);
  _진료비명세서._할인금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo17').value);

  if (document.getElementById('acceptInfo8').checked) {
    _진료비명세서._납부한금액_현금영수증 = _진료비명세서._납부한금액_현금;
    _진료비명세서._납부한금액_현금 = 0;
  }

  // T_ACCEPT_CHRG_PREV acp = gv수납내역.GetRow(gv수납내역.FocusedRowHandle) as T_ACCEPT_CHRG_PREV;
  _진료비명세서._영수증기본정보.발급일자 = document.getElementById('acceptInfo23').value;
  _진료비명세서._영수증기본정보.영수증번호 = acp == null ? "" : acp.DS_DLVRY + "-" + PadNumberWithZeros(acp.NO_DLVRY, 5);
  _진료비명세서._영수증기본정보.재발행여부 = "";


  if (DialogResult.OK == frm진료비상세내역.ShowReceipt(_db, _진료비명세서)) {
    Display진료비내역(_진료비명세서);
  }

}

function CmdPrscrptnRePrint_Click() {
  //   //처방전교부(재발행)
  //   if (_진료비명세서.Ac == null && _진료비명세서.Ai == null) {
  //     frmSBError.ShowError("경고", "발행된 처방전이 없습니다.");
  //     return;
  //   }
  //   var id_acceptin = _진료비명세서.Ai != null ? _진료비명세서.Ai.ID_ACCEPTIN : 0;
  //   var ds_prsc_dlvry = _진료비명세서.수납시작일자;
  //   if (string.IsNullOrEmpty(ds_prsc_dlvry)) {
  //     ds_prsc_dlvry = _진료비명세서.En외래입원구분 == 외래입원구분Enum.외래입원구분0외래 ? dte외래접수일자.DateTime.ToString("yyyyMMdd") : dte계산기간시작.DateTime.ToString("yyyyMMdd");
  //   }

  //   var pd = _db.T_PRSC_DLVRY.Where(t => t.NO_ACCEPT == _진료비명세서.Ac.NO_ACCEPT && t.DS_PRSC_DLVRY == ds_prsc_dlvry && t.ID_ACCEPTIN == id_acceptin && t.FG_OUTSIDE == true).FirstOrDefault();
  //   if (pd == null) {
  //     frmSBError.ShowError("경고", "재발행할 처방전이 없습니다.");
  //     return;
  //   }

  //   var _처방전재발행 = 처방전XmlManager.Instance.DeSerialize(pd.DC_XML);

  //   if (frmSBQuestion.ShowQuestion("처방전 재발행", "용도를 선택해 주세요. \n\rYES : 약국용 / NO : 환자보관용") == DialogResult.Yes) {
  //     처방전BL.instance().Print처방전(_처방전재발행, 처방전출력구분Enum.구분1약국보관용, true, 1);
  //   }
  //   else {
  //     처방전BL.instance().Print처방전(_처방전재발행, 처방전출력구분Enum.구분2환자보관용, true, 1);
  //   }

  //   if (!pd.BL_PRINT) {
  //     pd.BL_PRINT = true;
  //     _db.SaveChanges();
  //   }
}

async function CmdReceiptProcess_Click() {
  var bSuccess = false;

  bSuccess = await DoReciptProcess();

  if (!bSuccess) {
    return;
  }

  Save수납메모();
  // this.Refresh초기화();

  RefreshGrd수납내역();
}

async function DoReciptProcess() {
  console.log(_진료비명세서);
  try {
    if (_진료비명세서 == null) {
      alert(`수납처리\n명세서 내역이 없습니다.`);
      return false;
    }

    var d수납할금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo5').value);
    var d총수납금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo19').value);

    if (d총수납금액 > d수납할금액) {
      alert('수납처리\n총 수납금액이 수납할 금액보다 많습니다.');
      return false;
    }
    //수납처리시 수납정보 update
    _진료비명세서._이미납부한금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo25').value);
    _진료비명세서._납부한금액_카드 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo10').value);
    _진료비명세서._납부한금액_현금 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo7').value) - ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo9').value);
    _진료비명세서._납부한금액_계좌이체 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo11').value);
    _진료비명세서._납부한금액_현금영수증 = 0;
    _진료비명세서._미수금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo21').value);
    _진료비명세서._할인금액 = ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo17').value);

    if (document.getElementById('acceptInfo8').checked) {
      _진료비명세서._납부한금액_현금영수증 = _진료비명세서._납부한금액_현금;
      _진료비명세서._납부한금액_현금 = 0;
    }

    var id_acceptin = _진료비명세서._ai != null ? _진료비명세서._ai.ID_ACCEPTIN : 0;

    // 원외 처방전 불러오기
    var ds_prsc_dlvry = _진료비명세서._수납시작일자;
    if (ds_prsc_dlvry != undefined && ds_prsc_dlvry != '') {
      ds_prsc_dlvry = HyphenReplace(document.getElementById('acceptInfo2').value);
    }

    var pd = (await GetData(`SELECT * FROM T_PRSC_DLVRY WHERE NO_ACCEPT = ${_진료비명세서._ac.NO_ACCEPT} AND DS_PRSC_DLVRY = ${ds_prsc_dlvry}
        AND ID_ACCEPTIN = ${id_acceptin} AND FG_OUTSIDE = '1'`))[0];

    var c원외처방전 = null;

    if (pd == undefined) {
      c원외처방전 = await Create원외처방전(pd);
    }
    else {
      var arrayBufferData = new Uint8Array(pd.DC_XML.data).buffer;
      var decodedString = new TextDecoder().decode(arrayBufferData);
      c원외처방전 = JSON.parse(decodedString);
    }

    var str의료급여승인번호 = '';

    if (_진료비명세서._en외래입원구분 == 외래입원구분Enum.외래입원구분0외래) {
      var acp1 = await Get수납내역외래(_진료비명세서._ac.NO_ACCEPT);
      // if (!b차액결제 && acp1) {
      //   alert(`수납처리\n동일한 수납내역이 이미 있습니다.`);
      //   return false;
      // }

      // 의료급여 외래진료는 수납 시 진료확인 처리 한다.
      if (_진료비명세서._ac.FG_ISRC == 보험구분002Enum.보험구분2의료급여 && _진료비명세서._ac.FG_ISRC_KIND != 보험종별구분_공통99본인) {
        // 급여구분이 0(급여)인 진찰료가 존재할 때만 의료급여 진료확인        
        var temp = _진료비명세서._list진료처방.find(t => t[0].항목구분.startsWith(진찰료) && t[0].급여적용 == 급여적용0급여);
        console.log(temp);
        if (temp != null) {
          var mny유지비청구액 = (txt유지비청구액.EditValue == null || txt유지비청구액.EditValue.ToString() == "") ? 0 : txt유지비청구액.EditValue;

          var cd_dx = '';

          if (c원외처방전 == undefined || !c원외처방전.질병분류기호1) {
            var dx = (await GetData(`SELECT * FROM T_TREAT_DX WHERE CD_CHART = ${_진료비명세서._ac.CD_CHART} AND DS_TREAT ${_진료비명세서._ac.DS_TREAT}
             AND NO_TREAT ${_진료비명세서._ac.NO_TREAT} AND NO_TREAT_TY = '0' AND DS_DX = ${_진료비명세서._ac.DS_TREAT} AND BL_DX_MAIN = true`))[0];
            cd_dx = dx == undefined ? "" : dx.CD_DX;
          }
          else {
            cd_dx = c원외처방전.질병분류기호1;
          }

          if (cd_dx != null) {
            alert(`수납처리\n주상병이 존재하지 않아서 의료급여 승인이 불가합니다.\n수납처리를 진행할 수 없습니다.`);
            return false;
          }

          var m4 = _진료비명세서.Process의료급여진료확인(_db, c원외처방전, cd_dx, mny유지비청구액);

          if (m4 == null) {
            if (confirm(`의료급여 진료확인\n의료급여 진료확인을 취소하였습니다.\n무시하시고 수납을 진행하시겠습니까?`) == false) {
              return false;
            }
          }
          else {
            if (!string.IsNullOrEmpty(m4.message)) {
              frmSBError.ShowError("[의료급여 진료확인]", m4.message);

              if (m4.messageCode != "IWS20002")   // IWS20002: 정상승인
              {
                return false;
              }
            }

            if (m4.cfhcCfrNo != null && !string.IsNullOrEmpty(m4.cfhcCfrNo))
              str의료급여승인번호 = m4.cfhcCfrNo;

          }
        }
      }
    }

    //txt승인번호.Text = str의료급여승인번호;
    //이전 수납내역을 집계하여 수납금액을 검증할 필요가 있을 경우 - 추후 수정

    var acp = null;

    if (_currentAcpDRG차액결제 != null) {
      acp = (await GetData(`SELECT * FROM T_ACCEPT_CHRG_PREV WHERE ID_CHRG_PREV = ${_currentAcpDRG차액결제.ID_CHRG_PREV}`))[0];
      acp.NO_TREAT_CNFRM = str의료급여승인번호;
    }
    else {
      acp = new T_ACCEPT_CHRG_PREV();

      acp.CD_CHART = _진료비명세서._ac.CD_CHART;
      acp.NO_ACCEPT = _진료비명세서._ac.NO_ACCEPT;
      acp.NO_TREAT_CNFRM = str의료급여승인번호;
      acp.ID_ACCEPTIN = id_acceptin;
      acp.ID_CHRG_DTL_PRE = _진료비명세서.원무심사명세서ID;
      acp.ID_REQ_OTH_SBJT = _진료비명세서.타과의뢰ID;
      acp.MNY_TOTL = await _진료비명세서.Get요양급여비용총액2(true);//진료비총액
      acp.MNY_CHRG = _진료비명세서.Get청구액();//청구액
      acp.MNY_TOTL_PTNT_PAY = await _진료비명세서.Get환자부담총액(true);//환자부담총액
      acp.MNY_TOTL_GRNT = _진료비명세서.Get요양급여비용총액1();//급여총액
      acp.MNY_TOTL_GRNT_NOT = 원미만절사(_진료비명세서.Get비급여총액());//비급여총액
      acp.MNY_SLCT_GRNT_NOT = 원미만절사(_진료비명세서._obj비급여_선택진료료._합계);//비급여선택
      acp.MNY_ALL_PTNT_PAY = await _진료비명세서.Get전액본인부담금총액(true);//전액본인부담금
      acp.MNY_GRANT_PTNT_PAY = _진료비명세서.Get본인일부부담금();//급여본인부담액(본인일부부담금)
      acp.MNY_MXM_EXCD = _진료비명세서.Get상한초과금();
      acp.MNY_HNDCP = _진료비명세서.Get장애인의료비();
      acp.MNY_TOTL_RDM_PTRT = 0;//보훈진료비총액
      acp.MNY_CHRG_RDM_PTRT = 0;//보훈청구액
      acp.MNY_GRNT = _진료비명세서.Get지원금();
      acp.MNY_RPLCE_PAY = 0;//대불금
      acp.MNY_INCLD_MDCL_CHRG = 원미만절사(_진료비명세서.Get포괄수가진료비());//포괄수가진료비
      acp.MNY_SNR_FIXED_AMT = 원미만절사(_진료비명세서._obj요양급여산정율.mny노인정액65세이상);//노인정액
      acp.MNY_FIXED_AMT = 원미만절사(_진료비명세서._obj요양급여산정율.mny정액수가);//정액수가
      acp.MNY_TOTL_MDCTN_LMT_EXCD = 0;//약제상한차액총액 
      acp.MNY_RDCTN = 0;// 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo17').value));//감면금액
      acp.MNY_BFR_CHLD_BRTH = 0;//산전지원금
      acp.DS_CHRG_TREAT_START = _진료비명세서._수납시작일자;
      acp.DS_CHRG_TREAT_END = _진료비명세서._수납종료일자;

      await Set_CreatePostData('T_ACCEPT_CHRG_PREV', acp);
    }

    _진료비명세서._납부한금액_카드 = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo10').value));
    _진료비명세서._납부한금액_계좌이체 = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo11').value));//통장입금액

    if (chk현금영수증.Checked) {
      _진료비명세서._납부한금액_현금 = 0;//현금수납액
      _진료비명세서._납부한금액_현금영수증 = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo7').value) - ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo9').value));
    }
    else {
      _진료비명세서._납부한금액_현금 = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo7').value) - ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo9').value));//현금수납액
      _진료비명세서._납부한금액_현금영수증 = 0;
    }

    acp.FG_RCPT = FG00수납;
    acp.DS_DLVRY = HyphenReplace(document.getElementById('acceptInfo23').value);//교부일자
    var length = (await GetData(`SELECT * FROM T_ACCEPT_CHRG_PREV WHERE DS_DLVRY = ${acp.DS_DLVRY}`)).length;
    acp.NO_DLVRY = length;

    _진료비명세서._영수증기본정보.발급일자 = FmtTegDate(acp.DS_DLVRY);
    _진료비명세서._영수증기본정보.영수증번호 = acp == null ? "" : acp.DS_DLVRY + "-" + PadNumberWithZeros(acp.NO_DLVRY, 5);

    acp.MNY_TOTL_RCPT = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo19').value));//총수납금액
    acp.MNY_CARD_RCPT = 원미만절사(_진료비명세서._납부한금액_카드);//카드수납액
    acp.MNY_ACNT_INPUT = 원미만절사(_진료비명세서._납부한금액_계좌이체);//통장입금액
    acp.MNY_CASH_RCPT = 원미만절사(_진료비명세서._납부한금액_현금);//현금수납액
    acp.MNY_CASH_APRVL = 원미만절사(_진료비명세서._납부한금액_현금영수증);//현금승인액
    acp.CD_DSCNT = GetSelcetEditValue('acceptInfo15');//할인코드
    acp.MNY_DSCNT = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo17').value));//할인금액
    acp.MNY_MISU = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo21').value));//미수금액
    acp.MNY_RCPT_PRE = 원미만절사(_진료비명세서._이미납부한금액);
    // acp.MNY_HLTH_MNTNC = 원미만절사(ConvertDecimalFromTextEditValue(txt유지비청구액));//건강생활유지비

    acp.ID_RCPT = this.담당자ID;//수납자
    acp.DT_RCPT = fmtTodaySec;//수납시간
    acp.DC_RCPT_MEMO = document.getElementById('acceptInfo24').value;//수납메모
    acp.FG_RCPT_END = 영수증마감Enum.TY00마감X;//마감여부
    acp.MNY_RCPT_EXPCT = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo5').value));//수납예정금액
    acp.MNY_RCPT_ASSGN = 원미만절사(ConvertDecimalFromTextEditValue(document.getElementById('acceptInfo3').value));
    acp.XML_RCPT = '';
    acp.XML_RCPT_BYTE = JSON.stringify(_진료비명세서);
    acp.ID_CHRG_PREV_PRNT = acp.ID_CHRG_PREV;   //영수증ID는 DB에 Add된 후 발생하므로 SaveChanges 후에 다시 할당해준 후 저장
    await Set_UpdatePostData('T_ACCEPT_CHRG_PREV', acp);

    if (acp.ID_CHRG_DTL_PRE > 0) {
      var dtl = (await GetData(`SELECT * FROM T_CHRG_DTL_PRE WHERE ID_CHRG_DTL_PRE = ${acp.ID_CHRG_DTL_PRE}`))[0];
      dtl.FG_DTL_STAT = 원무심사상태Enum.FG04수납완료;
      Set_UpdatePostData('T_CHRG_DTL_PRE', dtl);
    }

    var tmp병원정보 = await Temp병원정보('병원유형');
    if (tmp병원정보.수납_카드단말기연동 != 0) {
      var mny카드 = acp.MNY_CARD_RCPT;
      var mny현금영수증 = acp.MNY_CASH_APRVL;

      var bSuccess = false;

      if (mny카드 > 0) {
        bSuccess = SendRcptRqstCard(tmp병원정보.수납_카드단말기연동, acp.NO_ACCEPT, acp.ID_CHRG_PREV, mny카드, false, false);
        if (!bSuccess) {
          _db.T_ACCEPT_CHRG_PREV.Remove(acp);
          _db.SaveChanges();
          return false;
        }
      }

      if (mny현금영수증 > 0) {
        bSuccess = SendRcptRqstCard(tmp병원정보.수납_카드단말기연동, acp.NO_ACCEPT, acp.ID_CHRG_PREV, mny현금영수증, true, false);
        if (!bSuccess) {
          _db.T_ACCEPT_CHRG_PREV.Remove(acp);
          _db.SaveChanges();
          return false;
        }
      }
    }

    RefreshGrd수납내역();

    await Update수납상태(수납상태구분Enum.TY01수납, _currentReqOthSbjt);

    // 원외 처방전 출력하기
    // if (pd != null) {
    //   if (pd.BL_PRINT) {
    //     alert('알림\n해당 수납에 존재하는 처방전이 이미 출력되었으므로 새로 발행되지 않습니다.');
    //   }
    //   else {
    //     var arrayBufferData = new Uint8Array(pd.DC_XML.data).buffer;
    //     // ArrayBuffer를 문자열로 디코딩
    //     var decodedString = new TextDecoder().decode(arrayBufferData);
    //     var _처방전 = JSON.parse(decodedString);

    //     Print처방전(_처방전, 처방전출력구분Enum.구분1약국보관용, false, i처방전출력매수);

    //     pd.BL_PRINT = true;
    //     _db.SaveChanges();
    //   }
    // }

    // if (document.getElementById('acceptInfo20').checked == false) {
    //   // 진료비 영수증 출력하기
    //   Print영수증_양방(_진료비명세서, false);
    // }

    alert('수납처리\n수납처리 되었습니다.');
    return true;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

async function RefreshGrd수납내역() {
  var cd_chart = t_ACCEPT == null ? _currentAcceptin.CD_CHART : t_ACCEPT.CD_CHART;
  var no_accept = t_ACCEPT == null ? _currentAcceptin.NO_ACCEPT : t_ACCEPT.NO_ACCEPT;

  var query = await GetData(`SELECT * FROM T_ACCEPT_CHRG_PREV WHERE CD_CHART = ${cd_chart} AND NO_ACCEPT = ${no_accept}`);

  if (_currentAcceptin != null) {
    query = query.Where(t => t.ID_ACCEPTIN == _currentAcceptin.ID_ACCEPTIN);
  }

  RefreshTable('specificDetailsList');

  for (let i = 0; i < query.length; i++) {
    html = '';
    html += `<tr ${SetJson(query[i])}>`;
    html += `<td>${i + 1}</td> `;
    html += CreateTableTd(query[i].FG_RCPT, false);
    html += CreateTableTd(query[i].DS_DLVRY, false);
    html += CreateTableTd(query[i].NO_DLVRY, false);
    html += CreateTableTd(query[i].MNY_TOTL, false);
    html += CreateTableTd(query[i].MNY_CHRG, false);
    html += CreateTableTd(query[i].MNY_TOTL_PTNT_PAY, false);
    html += CreateTableTd(query[i].MNY_TOTL_GRNT, false);
    html += CreateTableTd(query[i].MNY_TOTL_GRNT_NOT, false);
    html += CreateTableTd(query[i].MNY_SLCT_GRNT_NOT, false);
    html += CreateTableTd(query[i].MNY_ALL_PTNT_PAY, false);
    html += CreateTableTd(query[i].MNY_MXM_EXCD, false);
    html += CreateTableTd(query[i].MNY_GRNT, false);
    html += CreateTableTd(query[i].MNY_RPLCE_PAY, false);
    html += CreateTableTd(query[i].MNY_SNR_FIXED_AMT, false);
    html += CreateTableTd(query[i].MNY_FIXED_AMT, false);
    html += CreateTableTd(query[i].MNY_TOTL_RCPT, false);
    html += CreateTableTd(query[i].MNY_CARD_RCPT, false);
    html += CreateTableTd(query[i].MNY_CASH_RCPT, false);
    html += CreateTableTd(query[i].CD_DSCNT, false);
    html += CreateTableTd(query[i].MNY_RDCTN, false);
    html += CreateTableTd(query[i].MNY_MISU, false);
    html += CreateTableTd(query[i].ID_RCPT == undefined ? '' : query[i].ID_RCPT, false);
    html += CreateTableTd(FmtTodayDay(query[i].DT_RCPT), false);
    html += CreateTableTd(query[i].NO_TREAT_CNFRM, false);
    html += CreateTableTd(query[i].MNY_HLTH_MNTNC, false);
    html += '</tr>';
    $("#specificDetailsList").append(html);
  }
};

function Save수납메모() {
  if (document.getElementById('acceptInfo24').value != '') {
    SaveMemo(t_ACCEPT.CD_CHART, t_ACCEPT, 환자메모구분Constant.환자메모구분03_수납메모, document.getElementById('acceptInfo24').value, t_ACCEPT.DS_TREAT);
  }
}

async function Create원외처방전(pd) {
  var ac = t_ACCEPT;

  if (ac == null) {
    return null;
  }

  var ds_prscrptn = ac.DS_TREAT;

  var obj처방전 = await CreateC처방전(null, ac, ds_prscrptn, ac.ID_DOCT, true, 0);

  if (obj처방전 != null) {
    pd = CreatTPrscDlvry(obj처방전, true, DUR점검상태Enum.상태0무_취소);
    _db.T_PRSC_DLVRY.Add(pd);
    _db.SaveChanges();

    // ---------------------- DUR 점검 (수정, 조제취소 등) ----------------------
    var is테스트전송 = false;
    var is조제점검 = false;
    var is수정점검 = false;
    var sErrMsg = '';
    var nResult = 0;

    switch (pd.FG_DUR_STAT) {
      case DUR점검상태Enum.상태0무_취소:      // 처방점검 진행
        break;
      case DUR점검상태Enum.상태1처방점검:     // 수정점검 진행
        is수정점검 = true;
        break;
      case DUR점검상태Enum.상태2조제점검:     // 조제점검 취소 후 수정점검 진행                
        alert('DUR 점검 불가\n이미 원내약국에서 조제된 처방내역입니다.\n원내약국에서 조제 취소 후 수정 점검이 가능합니다.');
        return obj처방전;
      default:
        break;
    }

    nResult = DurCheckProcess(_진료비명세서._ac, obj처방전, ds_prscrptn, is조제점검, is수정점검, is테스트전송, sErrMsg);

    switch (nResult) {
      case 0:     //점검 성공(아직 사유전송하지 않음)
      case 16023: //표준팝업창에서 사유 전송 완료(IHIRADUR COM모듈에서 직접 사유 전송함)
      case 16025: //표준팝업창에서 사유전송을 취소(IHIRADUR COM모듈에서 사유전송을 하지 않고 취소함)

        var arrIdTreat = obj처방전.List진료처방약품.Union(obj처방전.List진료처방주사).Select(t => t.진료처방ID).ToArray();

        var lstTr = _db.T_TREAT.Where(t => arrIdTreat.Contains(t.ID_TREAT)).ToList();

        if (is조제점검) {
          pd.FG_DUR_STAT = DUR점검상태Enum.상태2조제점검;
        }
        else {
          pd.FG_DUR_STAT = DUR점검상태Enum.상태1처방점검;

          for (tr of lstTr) {
            tr.BL_DUR_CHCKUP = true;
          }
        }

        _db.SaveChanges();

        break;
      default:    //에러        
        alert(`DUR 점검 오류\n${sErrMsg}`);
        return obj처방전;
    }
  }

  return obj처방전;
}

async function Get수납내역외래(no_accept) {
  var query = await GetData(`SELECT p.* FROM T_ACCEPT_CHRG_PREV p JOIN T_ACCEPT ac ON p.NO_ACCEPT = ac.NO_ACCEPT 
  WHERE p.NO_ACCEPT = ${no_accept} AND ac.DS_TREAT_TY IS NULL AND ac.TY_RCPT_STAT = ${수납상태구분Enum.TY01수납}`);

  // if (_currentReqOthSbjt != null) {
  //   query = query.find(t => t.ID_REQ_OTH_SBJT == _currentReqOthSbjt.ID_REQ_OTH_SBJT);
  // }

  return query;
}

async function Update수납상태(e수납상태, ros) {
  if (ros != null) {
    var T_REQ_OTH_SBJT = (await GetData(`SELECT * FROM T_REQ_OTH_SBJT WHERE ID_REQ_OTH_SBJT = ${ros.ID_REQ_OTH_SBJT}`))[0];
    T_REQ_OTH_SBJT.TY_RCPT_STAT = e수납상태;
    await Set_UpdatePostData('T_REQ_OTH_SBJT', T_REQ_OTH_SBJT);
  }
  else {    
    var T_ACCEPT = (await GetData(`SELECT * FROM T_ACCEPT WHERE NO_ACCEPT = ${t_ACCEPT.NO_ACCEPT}`))[0];
    console.log(T_ACCEPT);
    T_ACCEPT.TY_RCPT_STAT = e수납상태;
    await Set_UpdatePostData('T_ACCEPT', T_ACCEPT);
  }
}