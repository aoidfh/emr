let diagSec = 0;
let diagMin = 0;
let diagHours = 0;

var treatDXList;
let diseaseLstToAdd = [];

let lstToModify = [];
let lstMT043 = [];
let t_NOTE_TYPE;

let alramBool = [false, false, false, false, false, false];

//#region gridstack
var options = {
  cellHeight: 49.5, // 셀의 높이 설정 (단위: 픽셀)   
  margin: 2.5,
};

var grid = GridStack.init(options);
//#endregion

window.DiagnosisStart = async function () {
  LoadNoteType();
  CheckDiagTime();
  await Refresh묶음분류Tree();
  AddOrderRefButton();
  lstMT043 = await GetArrMT043List();
  StartRecipeReservationListCreate();
}

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

  $('ul.promisePrescriptionListTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.promisePrescriptionListTabs li').removeClass('current');
    $('.promisePrescriptionListTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.progressNoteListTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.progressNoteListTabs li').removeClass('current');
    $('.progressNoteListTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

  $('ul.diagNoteTabs li').click(function () {
    var tab_id = $(this).attr('data-tab');

    $('ul.diagNoteTabs li').removeClass('current');
    $('.diagNoteTab-content').removeClass('current');

    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

})

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

//진료내역요약 테이블 버튼
function SummaryOfCareBtn(target) {
  ComnTbClick(target, 13);
}

//#endregion
//진료 완료
async function TreatmentDetailsBtns(name) {
  switch (name) {
    case 'complete':
      await DiagEditCheck(true);
      Refresh수납지시(true);
      break;
    case 'save':
      await DiagEditCheck(true);
      break;
    case 'hold':
      await DiagEditCheck();
      if (t_ACCEPT.TY_TREAT_STAT == 진료상태Enum.TY03진료중) {
        t_ACCEPT.TY_TREAT_STAT = 진료상태Enum.TY08보류;
        t_ACCEPT.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;
        await Set_UpdatePostData('T_ACCEPT', t_ACCEPT);
        RefreshTables(true);
      }
      break;
    case 'cancel':
      if (confirm('취소하면 진료했던 기록은 사라집니다.\n 취소하시겠습니까?') == false) {
        return;
      }
      if (t_ACCEPT.TY_TREAT_STAT == 진료상태Enum.TY03진료중) {
        t_ACCEPT.TY_TREAT_STAT = 진료상태Enum.TY01접수;
        t_ACCEPT.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;
        console.log(t_ACCEPT);
        await Set_UpdatePostData('T_ACCEPT', t_ACCEPT);
        RefreshTables(true);
      }
      break;
  }
}

//수정할 내용이 있는지...체크
async function DiagEditCheck(isSave) {
  try {    
    if (t_ACCEPT.TY_TREAT_STAT == 진료상태Enum.TY03진료중) {
      // await Save처방상병(isSave); //현재는 바로 저장하기 때문에 주석처리
      await SaveDiagTime();
      var tableChangeLst = await TableChangeCheck();
      var noteList = await SaveProgressNote();
      alramBool[5] = await CheckMemo(t_ACCEPT.CD_CHART, t_ACCEPT.DS_TREAT, 환자메모구분Constant.환자메모구분00_전체메모, 'totalMemo');
      var adit = false;
      for (let i = 0; i < alramBool.length; i++) {
        if (alramBool[i]) {
          adit = alramBool[i];
          break;
        }
      }

      let alramStr = '';
      if (adit) {
        for (let i = 0; i < alramBool.length; i++) {
          if (alramBool[i]) {
            switch (i) {
              case 0:
                alramStr += '처방내역 추가, ';
                break;
              case 1:
                alramStr += '상병내역, ';
                break;
              case 2:
                alramStr += '처방내역 수정, ';
                break;
              case 3:
                alramStr += '진료시간, ';
                break;
              case 4:
                alramStr += '진료기록, ';
                break;
              case 5:
                alramStr += '환자메모, ';
                break;
            }
          }
        }

        if (confirm(`수정되지 않은 수정내역이 존재합니다.\n${alramStr.substring(0, alramStr.length - 2)}\n저장 하시겠습니까?`) == false) {
          recipeLstToAdd = [];
          diseaseLstToAdd = [];
        }
        else {
          if (alramBool[0]) {
            PostData진료상병(recipeLstToAdd, t_ACCEPT, 0);
          }

          if (alramBool[1]) {
            PostData진료상병(diseaseLstToAdd, t_ACCEPT, 1);
          }

          if (alramBool[2]) {
            for (let i = 0; i < tableChangeLst.length; i++) {
              Set_UpdatePostData('T_TREAT', tableChangeLst[i]);
            }
          }

          if (alramBool[3]) {
            var date = document.getElementById('checkDiagTime1').value;
            var time = document.getElementById('checkDiagTime5').value;
            var result = `${date} ${time}`;
            var ac = t_ACCEPT;

            ac.DT_TREAT_TIME = result;

            Set_UpdatePostData('T_ACCEPT_DT_TREAT_TIME', ac);
          }

          if (alramBool[4]) {            
            for (let i = 0; i < noteList.length; i++) {
              if (noteList[i].isNot == false) {
                Set_UpdatePostData('T_TREAT_NOTE', noteList[i].note);
              }
              else {
                Set_CreatePostData('T_TREAT_NOTE', noteList[i].note);
              }
            }
          }

          if (alramBool[5]) {
            SaveMemo(t_ACCEPT.CD_CHART, 환자메모구분Constant.환자메모구분00_전체메모, document.getElementById('totalMemo').value, t_ACCEPT.DS_TREAT);
          }
        }
      }

      for (let i = 0; i < alramBool.length; i++) {
        alramBool[i] = false;
      }
    }
  } catch (error) {    
  }
}

//idx 0:처방, 1:상병
async function PostData진료상병(lst, t_ACCEPT, idx, isRefresh = false) {
  try {
    if (idx == 0) {
      for (let i = 0; i < lst.length; i++) {
        await AddTo처방(lst[i], t_ACCEPT);
      }

      recipeLstToAdd = [];
    }
    else if (idx == 1) {
      for (let i = 0; i < lst.length; i++) {
        AddTo상병(lst[i], t_ACCEPT);
      }

      diseaseLstToAdd = [];
    }
  } catch (error) {
    console.log(error);
  }
}

async function CompleteOfTreatment(myFormula, curMoney) {
  var ac = t_ACCEPT;
  ac.TY_TREAT_STAT = 진료상태Enum.TY09완료;
  ac.BL_TREAT_NOW = 현재진료중Enum.TY진료중NO;

  await Set_UpdatePostData('T_ACCEPT', ac);
  // Refresh수납지시();
  RefreshTables(true);
}

async function Save처방상병(isSaveBtn = false) {
  try {
    if (recipeLstToAdd.length <= 0 && diseaseLstToAdd.length <= 0) {
      return;
    }

    if (recipeLstToAdd.length > 0 && recipeLstToAdd[recipeLstToAdd.length - 1].처방번호 >= t_TREAT.length ||
      diseaseLstToAdd.length > 0 && diseaseLstToAdd[diseaseLstToAdd.length - 1].상병번호 > t_TREAT_DX.length) {
      if (!isSaveBtn) {
        if (recipeLstToAdd.length > 0 && recipeLstToAdd[recipeLstToAdd.length - 1].처방번호 > t_TREAT.length) {
          // alramBool[0] = true;
        }

        if (diseaseLstToAdd.length > 0 && diseaseLstToAdd[diseaseLstToAdd.length - 1].상병번호 > t_TREAT_DX.length) {
          alramBool[1] = true;
        }
      }
      else {
        // alramBool[0] = true;
        alramBool[1] = true;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//#region 처방내역
async function AddTo처방(list, t_ACCEPT) {
  console.log('AddTo처방');
  var trs = document.getElementById('treatmentHistoryListTable').querySelectorAll('tr');
  var inputs;
  var selects;
  if (list.처방번호 !== undefined) {
    for (let i = 2; i < trs.length; i++) {
      var td = trs[i].getElementsByTagName('td');
      if (td[1].innerHTML == list.처방번호) {
        inputs = trs[i].querySelectorAll('input');
        selects = trs[i].querySelectorAll('select');
        break;
      }
    }
  }

  try {
    var lst = list;
    var t_treat = new T_TREAT();
    var rc = await t_treat.Eng(lst, inputs, selects);
    
    await Set_CreatePostData('T_TREAT', rc);

    // //!@# [픽업필요여부 입원정보에 저장]
    // //if (rc.픽업상태 == (byte)픽업상태Enum.픽업상태1필요원처방 && rc.수정구분 == (byte)처방수정구분Enum.처방수정구분0등록)
    // //{
    // //    T_ACCEPTIN accin = _db.T_ACCEPTIN.Where(t => t.입원정보ID == rc.입원정보ID).Single();
    // //    accin.픽업필요여부 = true;
    // //}

    // if (진료처방BL.instance().isExist진료처방상세(lst)) {
    //   _db.SaveChanges();  //SaveChanges해야 ID_TREAT 부여됨

    //   var tr_add = new T_TREAT_ADD();

    //   tr_add.ID_TREAT = rc.ID_TREAT;
    //   tr_add.DC_CHRG_JS013 = lst.DC_CHRG_JS013;   //청구특정내역 단순/유도 초음파
    //   tr_add.DC_CHRG_JT005 = lst.DC_CHRG_JT005;   //청구특정내역 분만, 임신부초음파
    //   tr_add.DC_CHRG_JT010 = lst.DC_CHRG_JT010;   //청구특정내역 저함량사유   
    //   tr_add.DC_CHRG_JT012 = lst.DC_CHRG_JT012;   //청구특정내역 중복처방사유
    //   tr_add.DC_CHRG_JT014 = lst.DC_CHRG_JT014;   //청구특정_향정신성약물장기처방사유
    //   tr_add.DC_CHRG_JT015 = lst.DC_CHRG_JT015;   //청구특정_내시경적점막하박리절제술고시개정
    //   tr_add.DC_CHRG_JT017 = lst.DC_CHRG_JT017;   //청구특정내역 내용액제사유
    //   tr_add.DC_CHRG_JT018 = lst.DC_CHRG_JT018;   //청구특정내역 건강검진 실시 당일 진찰료 산정사유
    //   tr_add.DC_CHRG_JT019 = lst.DC_CHRG_JT019;   //청구특정_PRN
    //   tr_add.DC_CHRG_JT023 = lst.DC_CHRG_JT023;   //청구특정_신경인지기능검사세부검사항목코드
    //   tr_add.DC_CHRG_JX999 = lst.DC_CHRG_JX999;   //청구특정_기타내역
    //   tr_add.DC_CHRG_ANE = lst.DC_CHRG_ANE;     //청구특정_초빙마취전문의면허번호
    //   tr_add.DC_CHRG_MT043 = lst.DC_CHRG_MT043;   //청구특정_국가재난의료비지원대상유형

    //   _db.T_TREAT_ADD.Add(tr_add);
    // }

    // //* S -- 물리치료실 전달 오더의 경우 횟수만큼 Treat 생성
    // if (rc.CD_DEPT_SPRT != null && rc.CD_DEPT_SPRT.StartsWith(지원구분Constant.물리치료실06) && rc.CNT_DOSAGE > 1) {
    //   var cnt_dosage = rc.CNT_DOSAGE;

    //   rc.CNT_DOSAGE = 1;

    //   while (cnt_dosage > 1) {
    //     var rc_copy = new T_TREAT();
    //     Utils.CommonUtils.ObjectCopy(rc, rc_copy);

    //     _db.T_TREAT.Add(rc_copy);

    //     if (진료처방BL.instance().isExist진료처방상세(lst)) {
    //       _db.SaveChanges();    //SaveChanges해야 ID_TREAT 부여됨

    //       var tr_add = new T_TREAT_ADD();

    //       tr_add.ID_TREAT = rc.ID_TREAT;
    //       tr_add.DC_CHRG_JS013 = lst.DC_CHRG_JS013;   //청구특정내역 단순/유도 초음파
    //       tr_add.DC_CHRG_JT005 = lst.DC_CHRG_JT005;   //청구특정내역 분만, 임신부초음파
    //       tr_add.DC_CHRG_JT010 = lst.DC_CHRG_JT010;   //청구특정내역 저함량사유   
    //       tr_add.DC_CHRG_JT012 = lst.DC_CHRG_JT012;   //청구특정내역 중복처방사유
    //       tr_add.DC_CHRG_JT014 = lst.DC_CHRG_JT014;   //청구특정_향정신성약물장기처방사유
    //       tr_add.DC_CHRG_JT015 = lst.DC_CHRG_JT015;   //청구특정_내시경적점막하박리절제술고시개정
    //       tr_add.DC_CHRG_JT017 = lst.DC_CHRG_JT017;   //청구특정내역 내용액제사유
    //       tr_add.DC_CHRG_JT018 = lst.DC_CHRG_JT018;   //청구특정내역 건강검진 실시 당일 진찰료 산정사유
    //       tr_add.DC_CHRG_JT019 = lst.DC_CHRG_JT019;   //청구특정_PRN
    //       tr_add.DC_CHRG_JT023 = lst.DC_CHRG_JT023;   //청구특정_신경인지기능검사세부검사항목코드
    //       tr_add.DC_CHRG_JX999 = lst.DC_CHRG_JX999;   //청구특정_기타내역
    //       tr_add.DC_CHRG_ANE = lst.DC_CHRG_ANE;     //청구특정_초빙마취전문의면허번호
    //       tr_add.DC_CHRG_MT043 = lst.DC_CHRG_MT043;   //청구특정_국가재난의료비지원대상유형

    //       _db.T_TREAT_ADD.Add(tr_add);
    //     }

    //     cnt_dosage--;
    //   }
    //}
    //* E -- 물리치료실 전달 오더의 경우 횟수만큼 Treat 생성  
  }
  catch (error) {
    console.log(error);
  }
}

function is픽업대상(처방등록구분) {
  if (처방등록구분 != 처방등록구분Enum.FG01자동코드) {
    return true;
  }
  else {
    return false;
  }
}

async function SaveNoteType() {
  var name = prompt("타이틀 이름을 적어주세요. 타입을 저장 하시겠습니까?");
  if (name) {
    var t_NOTE_TYPE = new T_NOTE_TYPE();

    t_NOTE_TYPE.NOTE_NAME = name;
    t_NOTE_TYPE.DC_NOTE = document.getElementById('firstVisitNote').value;

    await Set_CreatePostData('T_NOTE_TYPE', t_NOTE_TYPE);
  } else {
    console.log("취소");
  }
}

async function LoadNoteType(id_Note = undefined) {
  document.getElementById('firstVisitNote').value = '';

  if (id_Note != undefined) {
    t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE WHERE NO_NOTE = ${id_Note}`);
  }
  else if (id_Note == undefined && t_NOTE_TYPE == undefined) {
    t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE WHERE BL_USE = 1`);
    if (t_NOTE_TYPE.length == 0) {
      t_NOTE_TYPE = await GetData(`SELECT * FROM T_NOTE_TYPE LIMIT 1`);
    }
  }

  try {
    document.getElementById('firstVisitNote').value = t_NOTE_TYPE[0].DC_NOTE;
  } catch (error) { }
}

//#endregion
//#region 상병코드
async function AddTo상병(list, t_ACCEPT) {
  console.log('AddTo상병');
  let tempList;
  let temp주상병 = null;
  let str기준일자 = document.getElementById('patientListDate').value;

  //** 주상병에 종료일자 입력, 주상병 삭제 등 저장 후 주상병이 미존재하는 상황 막기 위해 저장 막음
  // if (Get주상병() == null) {
  //   alert("저장 불가 \n주상병이 존재하지 않습니다.\n주상병을 설정하시거나 추가해 주세요.");
  //   return;
  // }  

  let lst = list;
  let ds_dx = lst.상병일자 == undefined ? str기준일자.replaceAll("-", "") : lst.상병일자.replaceAll("-", "");
  //상병 중복입력 방지
  // if (t_TREAT_DX.some(t =>
  //   t.CD_CHART === lst.챠트번호 &&
  //   t.DS_DX === ds_dx &&
  //   t.NO_TREAT === lst.진료번호 &&
  //   t.CD_DX === lst.상병코드 &&
  //   t.BL_DX_MAIN === lst.주상병 &&
  //   new Date(t.DS_DX_END) > new Date(ds_dx)
  // )) {

  // }

  try {
    let rc = new T_TREAT_DX();

    rc.DS_TREAT = lst.진료일자;
    rc.CD_CHART = lst.챠트번호;
    rc.NO_TREAT = lst.진료번호;
    rc.NO_TREAT_TY = lst.유형번호;
    rc.DS_DX = ds_dx;
    rc.NO_DX_ORDER = lst.상병번호;
    rc.CD_DX = lst.상병코드;
    rc.BL_DX_MAIN = lst.주상병;
    rc.BL_DOUBT = lst.의증상병;
    rc.BL_LEFT = lst.좌측;
    rc.BL_RIGHT = lst.우측;
    rc.BL_SRGRY = lst.수술;
    rc.BL_PRINT = lst.출력;
    rc.CD_DEPT_SPRT = lst.진료실코드;
    rc.CD_TREAT_SBJT = lst.진료과목;
    rc.TY_INJRY_UNTRL = lst.상해외인;
    rc.CD_SPCL_SMBL = lst.특정기호;
    //rc.ID_UPDT = _사용자정보.사용자ID;
    rc.DT_UPDT = fmtTodaySec;
    //rc.ID_RGST = _사용자정보.사용자ID;
    rc.DT_RGST = fmtTodaySec;
    rc.DS_DX_END = lst.상병종료 ? Utils.CommonUtils.ConvertDateStringFormat(lst.상병종료, "yyyy-MM-dd").toString("yyyyMMdd") : "";
    rc.NM_DX_HAN = lst.표시명칭;
    rc.NM_DX_ENG = lst.영문명칭;
    rc.SGN_DOCTOR = lst.의사사인;
    rc.ID_CNSLT = lst.협진정보ID;
    rc.FG_ORNTL_WEST = lst.양한방구분;

    if (rc.BL_DX_MAIN === true && (!rc.DS_DX_END || rc.DS_DX_END.localeCompare(str기준일자) > 0)) {
      temp주상병 = lst;
    }

    tempList = rc;
  } catch (e) {
    console.log("Error:", e);
  }
  if (lstToModify.length > 0) {
    for (let i = 0; i < lstToModify.length; i++) {
      let lst = lstToModify[i];

      try {
        let rc = t_TREAT_DX.find(t => t.ID_DX_TREAT === lst.진료상병ID);

        rc.DS_DX = lst.상병일자 === null ? _calendar기준일자.toString("yyyyMMdd") : lst.상병일자;
        rc.NO_DX_ORDER = lst.상병번호;
        rc.CD_DX = lst.상병코드;
        rc.NM_DX_HAN = lst.표시명칭;
        rc.NM_DX_ENG = lst.영문명칭;
        rc.BL_DX_MAIN = lst.주상병;
        rc.BL_DOUBT = lst.의증상병;
        rc.BL_LEFT = lst.좌측;
        rc.BL_RIGHT = lst.우측;
        rc.BL_SRGRY = lst.수술;
        rc.BL_PRINT = lst.출력;
        rc.NO_TREAT_TY = lst.유형번호;
        rc.CD_DEPT_SPRT = lst.진료실코드;
        rc.CD_TREAT_SBJT = lst.진료과목;
        rc.TY_INJRY_UNTRL = lst.상해외인;
        rc.CD_SPCL_SMBL = lst.특정기호;
        rc.ID_UPDT = _사용자정보.사용자ID;
        rc.DT_UPDT = new Date();
        rc.DS_DX_END = lst.상병종료;
        rc.SGN_DOCTOR = lst.의사사인;

        if (rc.BL_DX_MAIN === true && (rc.DS_DX_END === null || rc.DS_DX_END.localeCompare(str기준일자) > 0)) {
          temp주상병 = lst;
        }
      } catch (e) {
        console.error("Error:", e.message);
      }
    }
  }

  // if (lstToDelete.length > 0) {
  //   for (let i = 0; i < lstToDelete.length; i++) {
  //     let lst = lstToDelete[i];

  //     try {
  //       let tr = _db.T_TREAT_DX.find(t => t.ID_DX_TREAT === lst.진료상병ID);

  //       if (tr !== undefined) {
  //         _db.T_TREAT_DX.splice(_db.T_TREAT_DX.indexOf(tr), 1);
  //       }
  //     } catch (ex) {
  //       console.error(ex.message);
  //     }
  //   }
  // }

  // 진료상병 저장 확인
  // let str = ["Clear_진료상병"];
  // this.m_viewsubject.RaiseArrAddSaveCheckHandler(str);

  // 주상병 변경 및 입원정보 업데이트
  if (temp주상병 !== null) {
    // 입원정보의 상병코드와 표시명칭 변경    
    let _특정기호 = temp주상병.특정기호;
    let tempAc = t_ACCEPT;

    var CD_SPCF_SMBL = tempAc.CD_SPCF_SMBL == undefined || tempAc.CD_SPCF_SMBL == '' ? '' : tempAc.CD_SPCF_SMBL;
    if (CD_SPCF_SMBL != _특정기호) {
      if (CD_SPCF_SMBL == '' || CD_SPCF_SMBL == null) {
        // if (frmSBQuestion.ShowQuestion("[특정기호 설정]", `접수정보에 특정기호 [${_특정기호}]를 등록 하시겠습니까?`) === DialogResult.No) {
        if (confirm(`[특정기호 설정]\n접수정보에 특정기호 [${_특정기호}]를 등록 하시겠습니까?`)) {
          _특정기호 = "";
        }
      } else {
        //if (frmSBQuestion.ShowQuestion("[특정기호 변경]", `접수정보에 이미 설정된 특정기호가 존재합니다\n특정기호를 [${CD_SPCF_SMBL}]에서 [${_특정기호}]로 변경 하시겠습니까?`) === DialogResult.No) {
        if (confirm(`[특정기호 변경]\n접수정보에 이미 설정된 특정기호가 존재합니다\n특정기호를 [${CD_SPCF_SMBL}]에서 [${_특정기호}]로 변경 하시겠습니까?`)) {
          _특정기호 = CD_SPCF_SMBL;
        }
      }

      // 산정특례구분 구하기
      let v산정특례구분 = Get산정특례구분by특정기호(tempAc.FG_ISRC, tempAc.FG_ISRC_KIND, tempAc.DS_TREAT, _특정기호);

      switch (v산정특례구분) {
        case -2: // V161_정신질환자가해당상병_F20_F29_으로진료를받은당일 설정 불가 -> 특정기호 빼 주어야 함.
          // frmSBInfo.ShowInfomation("[확인요청]", "해당 특정기호는 의료급여환자의 경우 2종 외래진료의 경우만 적용 가능합니다.\n특정기호를 해제합니다.");
          alert('[확인요청]\n해당 특정기호는 의료급여환자의 경우 2종 외래진료의 경우만 적용 가능합니다.\n특정기호를 해제합니다.');
          _특정기호 = "";
          v산정특례구분 = 0;
          break;
        case -1: // F015_임신부외래진료 설정불가.   -> 임신부구분 False로 설정해 주어야 함
          tempAc.BL_PRGNT = false;
          v산정특례구분 = tempAc.TY_CALC_SPCL;
          break;
        default:
          break;
      }

      tempAc.CD_SPCF_SMBL = _특정기호;
      tempAc.TY_CALC_SPCL = v산정특례구분;

      // if (temp주상병.특정기호 !== _특정기호) {
      //   // if (temp주상병.진료상병ID === 0) {
      //   //   _db.SaveChanges(); // 아직 DB에 입력되지 않아서, 일단 저장 후 진행
      //   // }
      //   let rc = _db.T_TREAT_DX.filter(t => t.CD_CHART === temp주상병.챠트번호 && t.DS_TREAT === temp주상병.진료일자 && t.NO_TREAT === temp주상병.진료번호 &&
      //     t.NO_TREAT_TY === temp주상병.유형번호 && t.CD_SPCL_SMBL !== _특정기호);

      //   rc.forEach(item => {
      //     item.CD_SPCL_SMBL = _특정기호;
      //   });
      // }
    }
  }

  await Set_CreatePostData('T_TREAT_DX', tempList);
  //console.log(rc); 
}

function Get주상병() {
  const str기준일자 = document.getElementById('patientListDate').value;
  let temp = null;

  if (!(grd상병내역.getDataSource() instanceof Array)) {
    return temp;
  }


  const list = grd상병내역.getDataSource();
  const lst주상병 = list.filter(t => t.주상병 === true && (t.상병종료 === "" || t.상병종료.localeCompare(str기준일자) > 0));

  for (let i = 0; i < lst주상병.length; i++) {
    const row = lst주상병[i];
    if (!IsExistsListToDelete(row)) {
      temp = row;
      break;
    }
  }

  return temp;
}

function IsExistsListToDelete(진료상병) {
  if (lstToDelete.Contains(진료상병)) {
    return true;
  }

  return false;
}
//#endregion

async function Change진찰료변경() {
  var idx = document.getElementById('division1').selectedIndex;
  if (idx != 0) {
    if (confirm(`진찰료 입력 시 접수정보의 진료구분도 변경됩니다.\n진찰료를 입력하시겠습니까?`) == false) {
      ResetRightMenu();
      return;
    }
    var accept_temp = t_ACCEPT;
    accept_temp.TY_FRST_TREAT = document.getElementById('division1').selectedIndex - 1;
    //accept_temp.ID_UPDT = this.담당자ID;
    //accept_temp.DT_UPDT = DateTime.Now;

    var rc = new T_TREAT();
    rc.NO_ACCEPT = accept_temp.NO_ACCEPT;
    rc.NO_PRSCRPTN_ORDER = 1;
    await Set_DeletePostData('T_TREAT', rc);
    await Set_UpdatePostData('T_ACCEPT', accept_temp);

    var lst = await Create진찰료자동코드(accept_temp, true);

    await PostData진료상병(lst, accept_temp, 0);

    diagTalbeList.shift();
    diagTalbeList.unshift(lst[0]);
    TreatmentDetailsTableCreate(diagTalbeList); //처방내역  

    ResetRightMenu();
  }
}

function ResetRightMenu() {
  var ctxMenu = document.getElementById('dochi_context_menu');
  ctxMenu.style.display = 'none';
  ctxMenu.style.top = null;
  ctxMenu.style.left = null;


  document.getElementById('division1').selectedIndex = 0;
}

function ClickDrugInfo() {
  window.open(`http://cp.druginfo.co.kr/5Company/detail/product_cp.aspx?ID=${document.getElementById('drugInfo').getAttribute("EditValue")} `, '_blank');
}

function ContextMenu_원외처방전조제참고사항() {
  var dsPrscDlvry = _calendar기준일자.toString("yyyyMMdd");
  var ac = _currentAccept === null ? _db.T_ACCEPT.filter(t => t.NO_ACCEPT === _접수번호)[0] : _currentAccept;
  var pd = _db.T_PRSC_DLVRY.filter(t => t.NO_ACCEPT === ac.NO_ACCEPT && t.TY_ACCEPT === _current진료형태 && t.FG_OUTSIDE === true && t.DS_PRSC_DLVRY === dsPrscDlvry)[0];

  if (!pd) {
    frmSBError.ShowError("작업 불가", "원외처방전이 존재하지 않습니다.");
    return;
  }

  var obj처방전 = 처방전XmlManager.Instance.DeSerialize(pd.DC_XML);

  var str조제시참고사항 = ShowInputBoxTextEdit("조제 시 참고 사항", "", obj처방전.조제시참고사항);

  if (str조제시참고사항 !== null) {
    obj처방전.조제시참고사항 = str조제시참고사항;

    pd.DC_XML = 처방전XmlManager.Instance.Serialize(obj처방전);
  }
}

function PrintPopup() {
  var treatmentHistoryList = document.getElementById('treatmentHistoryList');
  tdList = treatmentHistoryList.querySelectorAll('tr');

  var printList = [];

  for (let i = 1; i < tdList.length; i++) {
    var td = tdList[i].getElementsByTagName('td');
    var 투여량1회 = td[4].querySelector('input');
    var 투여횟수 = td[5].querySelector('input');
    var 투여일수 = td[6].querySelector('input');
    var 파우더 = td[9].querySelector('input');
    var 메모 = td[12].querySelector('input');
    var 믹스구분 = td[10].querySelector('input');
    var 예외구분 = td[11].querySelector('select');
    var 집계구분 = td[13].querySelector('select');
    var 급여적용 = td[14].querySelector('select');
    var 의사사인 = td[16].querySelector('select');
    var lst = {
      급여적용: 급여적용.options[급여적용.selectedIndex].title,
      단가: td[15].innerHTML,
      메모: 메모.value,
      믹스구분: 믹스구분.value,
      // 수정구분: td[],
      예외구분: 예외구분.options[예외구분.selectedIndex].title,
      // 용법코드: td[],
      // 응급처방여부: td[],
      의사사인: 의사사인.options[의사사인.selectedIndex].title,
      // 접수번호: td[],
      // 진료번호: td[1],    
      // 챠트번호: td[],
      집계구분: 집계구분.options[집계구분.selectedIndex].title,
      // 집계구분: 집계구분.getAttribute('Editvalue'),
      처방번호: td[1].innerHTML,
      처방코드: td[2].innerHTML,
      투여량1회: 투여량1회.value,
      투여일수: 투여일수.value,
      투여횟수: 투여횟수.value,
      파우더: 파우더.checked,
      // 포터블: td[],
      표시명칭: td[3].innerHTML
    }
    printList.push(lst);
  }

  PopupOn(30, true, 1920, 1080, printList);
}