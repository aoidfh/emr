var 병원정보;
var list청구집계 = [];
var allChecked = false;

let t_CHRG_SMRY;
let t_CHRG_DTL;
let t_CHRG_TREAT;
let iD_CHRG_SMRY;
let clickIdx = -1;
let smry;
let lst청구상태;

let _진료비영수증 = undefined;

let tds항목 = [];
let tds급여총액 = [];
let tds본인부담 = [];
let tds청구액 = [];
let tds본인100미만 = [];
let tds청구100미만 = [];

let rightTableThsList = [];
let rightMenuList = [document.getElementById('clrvRightMenu1'), document.getElementById('clrvRightMenu2'),
document.getElementById('clrvRightMenu3'), document.getElementById('clrvRightMenu4')];

var 원내집계;
var 삭제내역;
var 원외집계;

(async function Start() {
    SetClaimDay(false);

    병원정보 = await GetData('SELECT * FROM T_HSPTL_INFO');

    CmnAddSelectOption('lue보험유형', 코드종류Enum.코드종류002보험구분, 0);
    CmnAddSelectOption('lue보험유형2', 코드종류Enum.코드종류002보험구분);
    CmnAddSelectOption('lue보험유형3', 코드종류Enum.코드종류002보험구분);
    CmnAddSelectOption('lue본인부담률', 코드종류Enum.코드종류009산정특례);
    CmnAddSelectOption('lue보험구분', 코드종류Enum.코드종류006보험종별구분);
    CmnAddSelectOption('lue진료결과', 코드종류Enum.코드종류012진료결과);
    // CmnAddSelectOption('lue도착경로', 코드종류Enum.코드종류013도착경로);
    CmnAddSelectOption('lue상해외인', 코드종류Enum.코드종류011상해외인);
    CmnAddSelectOption('lue나이구분', 코드종류Enum.코드종류007나이구분);
    CmnAddSelectOption('lue정액정률', 코드종류Enum.코드종류570청구정액정율구분);
    CmnAddSelectOption('lue청구구분_코드', 코드종류Enum.코드종류504청구구분코드);
    await CmnAddSelectOption('lue청구구분_사유코드', 코드종류Enum.코드종류515심사불능코드);

    Refresh청구서집계표();
    InitRightTable();
})();

//#region 청구집계
function SetClaimDay(isClick = true) {
    var currentDate;
    if (document.getElementById('month').value == '') {
        currentDate = new Date();
    }
    else {
        var date = new Date(document.getElementById('month').value);
        currentDate = date;
    }

    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();
    var currentDateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    document.getElementById("month").value = currentDateString;

    var parts = currentDateString.split("-");
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var firstDayOfMonth = new Date(year, month - 1, 2);
    var lastDayOfMonth = new Date(year, month, 1);
    document.getElementById("day1").value = firstDayOfMonth.toISOString().split('T')[0];
    document.getElementById("day2").value = lastDayOfMonth.toISOString().split('T')[0];

    if (isClick) {
        Refresh청구서집계표();
    }
}

function ClickClaimDay() {
    SetClaimDay();
    Search청구집계대상자(false);
    RefreshTable('claimReviewSpecifi');
}

function ChangeMonthBtn(isNext) {
    var selectedMonth = new Date(document.getElementById('month').value);

    if (isNext) {
        selectedMonth.setMonth(selectedMonth.getMonth() + 1);
    } else {
        selectedMonth.setMonth(selectedMonth.getMonth() - 1);
    }

    var year = selectedMonth.getFullYear();
    var month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0');

    document.getElementById('month').value = year + '-' + month;
    ClickClaimDay();
}

//테이블 토글 버튼
$(document).ready(function () {
    $('ul.storagePatientTabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.storagePatientTabs li').removeClass('current');
        $('.storagePatientTab-content').removeClass('current');

        $(this).addClass('current');
        console.log(tab_id);
        $("#" + tab_id).addClass('current');
    })

    $('ul.toggleTabs1 li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.toggleTabs1 li').removeClass('current');
        $('.toggleTab1-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })

    $('ul.toggleTabs2 li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.toggleTabs2 li').removeClass('current');
        $('.toggleTab2-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })
})

async function Search청구집계대상자(isClick = true) {
    RefreshTable('patientList');

    if (!isClick) {
        return;
    }

    var ds_treat_start = HyphenReplace(document.getElementById('day1').value);
    var b외래입원구분 = 0;

    var query = null;
    var lst대상자 = null;

    switch (b외래입원구분) {
        case 0:
            query = await GetQeury청구대상자조회외래();
            break;
        // case 1:
        //     lst대상자 = [];

        //     var lst평가표 = GetQuery청구대상자평가표().map(function (t) {
        //         return {
        //             no_accept: t.NO_ACCEPT,
        //             ty_eval: t.TY_EVAL,
        //             ds_start: t.DS_TREAT_START,
        //             ds_end: t.DS_TREAT_END
        //         };
        //     });

        //     query = GetQuery청구대상자조회입원();
        //     query = query.filter(function (t) {
        //         return t.DS_TREAT_END.localeCompare(ds_treat_start) >= 0;
        //     });

        //     var lst입원 = query;

        //     lst입원.forEach(function (item입원) {
        //         var c평가표 = lst평가표.filter(function (t) {
        //             return t.no_accept == item입원.NO_ACCEPT;
        //         }).sort(function (a, b) {
        //             return b.ds_end.localeCompare(a.ds_end);
        //         })[0];

        //         if (!c평가표 || item입원.DS_TREAT_END.localeCompare(c평가표.ds_end) > 0) {
        //             item입원.DS_TREAT_START = c평가표 ? item입원.DS_TREAT_START : MonoChart.Common.Utils.CommonUtils.ConvertDateStringToDateTime(c평가표.ds_end).addDays(1).ToString("yyyyMMdd");
        //             item입원.ID_CHRG_DTL_PRE = _db.T_CHRG_DTL_PRE.filter(function (t) {
        //                 return t.ID_ACCEPTIN == item입원.ID_ACCEPTIN && t.DS_TREAT_START == item입원.DS_TREAT_START && t.DS_TREAT_END == item입원.DS_TREAT_END;
        //             }).map(function (t) {
        //                 return t.ID_CHRG_DTL_PRE;
        //             })[0];
        //             lst대상자.push(item입원);
        //         }
        //     });

        //     lst대상자 = lst대상자.filter(function (t) {
        //         return t.DS_TREAT_END.localeCompare(ds_treat_start) >= 0;
        //     });

        //     break;
        // case 7:
        //     query = GetQuery청구대상자평가표();
        //     query = query.filter(function (t) {
        //         return t.DS_TREAT_END.localeCompare(ds_treat_start) >= 0;
        //     });

        //     GetIdChrgDtlPre(query);
        //     break;
        default:
            return;
    }

    if (lst대상자 === null) {
        lst대상자 = query;
    }

    lst대상자 = lst대상자.filter(function (t) {
        return t.DS_TREAT_START.localeCompare(HyphenReplace(document.getElementById('day2').value)) <= 0;
    }).sort(function (a, b) {
        return a.NM_CHART.localeCompare(b.NM_CHART) || a.DS_TREAT.localeCompare(b.DS_TREAT) || a.CD_CHART.localeCompare(b.CD_CHART);
    });

    // grd청구집계대상자.DataSource = lst대상자;

    for (let i = 0; i < lst대상자.length; i++) {
        html = '';
        html += `<tr ${SetJson(lst대상자[i])}>`;
        html += `<td>${i + 1}</td>`;
        html += `<td><input type="checkbox" class="patientCheckbox"></td>`;
        html += `<td>${lst대상자[i].CD_CHART}</td>`;
        html += `<td>${lst대상자[i].NM_CHART}</td>`;
        html += `<td>${lst대상자[i].DC_AGE_PTNT}</td>`;
        html += `<td>정신의학과</td>`;
        html += `<td>${lst대상자[i].DS_TREAT}</td>`;
        html += '</tr>';
        $("#patientList").append(html);
    }
}

async function GetQeury청구대상자조회외래() {
    var ds_treat_start = HyphenReplace(document.getElementById('day1').value);
    var ds_treat_end = HyphenReplace(document.getElementById('day2').value);

    var i양한방구분 = 0;
    // var b보험유형 = document.getElementById('보험유형').value;
    // var b집계구분 = document.getElementById('집계구분').checked;

    var query_sub = await GetData(`SELECT 
    a.CD_CHART,
    c.NM_CHART,
    a.NO_ACCEPT,
    a.DC_AGE_PTNT,
    a.DS_TREAT,
    a.DS_TREAT AS DS_TREAT_START, -- Select청구집계대상자() 에서 사용
    a.DS_TREAT AS DS_TREAT_END,   -- Select청구집계대상자() 에서 사용
    a.CD_TREAT_SBJT,
    '' AS NO_TREAT_CNFRM,
    a.FG_ISRC,
    a.FG_ISRC_KIND,
    0 AS En외래입원구분
FROM 
    T_ACCEPT a
JOIN 
    T_CHART c ON a.CD_CHART = c.CD_CHART
WHERE 
    a.TY_FRST_TREAT NOT IN (${초재진구분Enum.TY08진단서발행}, ${초재진구분Enum.TY09서류발급_진찰료없음})
    AND a.TY_ACCEPT = ${외래입원구분Enum.외래입원구분0외래}
    AND a.FG_ISRC_KIND != ${보험종별구분_공통99본인}
    AND (a.DS_TREAT BETWEEN ${ds_treat_start} AND ${ds_treat_end})
    AND a.TY_TREAT_STAT != ${진료상태Enum.TY00취소}
ORDER BY 
    c.NM_CHART, a.DS_TREAT`);

    // query_sub = query_sub.filter(t => t.FG_ISRC == b보험유형);

    // if (b보험유형 === 보험구분002Enum.보험구분4산업재해) {
    //     var s산재보험종별구분 = rdo산재보험종별구분.EditValue.toString();
    //     query_sub = query_sub.filter(function (t) {
    //         return t.FG_ISRC_KIND === s산재보험종별구분;
    //     });
    // }

    // if (i양한방구분 === 양한방구분Enum.양한방구분Enum0양방) {
    //     query_sub = query_sub.filter(function (t) {
    //         return t.CD_TREAT_SBJT.localeCompare(진료과목80한방내과) < 0;
    //     });
    // } else {
    //     query_sub = query_sub.filter(function (t) {
    //         return t.CD_TREAT_SBJT.localeCompare(진료과목80한방내과) >= 0;
    //     });
    // }

    // if (b집계구분 > 0 && txt환자검색.Text !== "") {
    //     query_sub = query_sub.filter(function (t) {
    //         return t.CD_CHART === txt환자검색.Text;
    //     });
    // }

    return query_sub;
}

function PatientListCheckBox(refresh = false) {
    if (refresh) {
        allChecked = true;
    }

    var table = document.getElementById('patientList');
    var checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        if (allChecked) {
            checkbox.checked = false;
            document.getElementById('patientListCheckbox').checked = false;
        }
        else {
            checkbox.checked = true;
            document.getElementById('patientListCheckbox').checked = true;
        }
    });

    allChecked = !allChecked;
}

async function Refresh청구서집계표() {
    RefreshTable('claimReviewTotal');
    var day = HyphenReplace(document.getElementById('month').value);
    var 보험유형 = GetSelcetEditValue('lue보험유형');
    var list = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE YM_CHRG_SMRY = ${day} AND FG_ISRC = ${보험유형} ORDER BY NO_CHRG_SMRY`);
    for (let i = 0; i < list.length; i++) {
        html = '';

        var fg_isrc = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '2' AND CD_CODE_DTL = ${list[i].FG_ISRC == null ? '' : list[i].FG_ISRC}`);
        var ty_accept = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '56' AND CD_CODE_DTL = ${list[i].TY_ACCEPT == null ? '' : list[i].TY_ACCEPT}`);
        var fg_treat_type = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '14' AND CD_CODE_DTL = ${list[i].FG_TREAT_TYPE == null ? '' : list[i].FG_TREAT_TYPE}`);
        var fg_chrg_smry = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '500' AND CD_CODE_DTL = ${list[i].FG_CHRG_SMRY == '0' ? '1' : list[i].FG_CHRG_SMRY}`);
        var fg_chrg_stat = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '505' AND CD_CODE_DTL = ${list[i].FG_CHRG_STAT == null ? '' : list[i].FG_CHRG_STAT}`);
        html += `<tr onclick="Refresh청구명세서ByGrid(this)" ${SetJson(list[i])}>`;
        html += `<td>${i + 1}</td>`;
        html += `<td><input type="checkbox"></td>`;
        html += `<td>${list[i].NO_CHRG_SMRY == null ? '' : list[i].NO_CHRG_SMRY}</td>`;
        html += `<td>${fg_isrc[0].NM_CODE_DTL}</td>`;
        html += `<td>${ty_accept[0].NM_CODE_DTL}</td>`;
        html += `<td>${fg_treat_type[0].NM_CODE_DTL}</td>`;
        html += `<td>${fg_chrg_smry[0].NM_CODE_DTL}</td>`;
        html += `<td>${list[i].FG_CHRG_CYCL == null ? '' : list[i].FG_CHRG_CYCL}</td>`;
        html += `<td>${fg_chrg_stat[0].NM_CODE_DTL}</td>`;

        html += `<td>${list[i].CNT_TREAT == null ? '' : list[i].CNT_TREAT}</td>`;
        html += `<td>${list[i].MNY_TOTL_GRNT == null ? '' : list[i].MNY_TOTL_GRNT}</td>`;
        html += `<td>${list[i].MNY_PART_PTNT == null ? '' : list[i].MNY_PART_PTNT}</td>`;
        html += `<td>${list[i].MNY_MXM_EXCD_PTNT == null ? '' : list[i].MNY_MXM_EXCD_PTNT}</td>`;
        html += `<td>${list[i].MNY_CHRG == null ? '' : list[i].MNY_CHRG}</td>`;
        html += `<td>${list[i].MNY_HNDCP == null ? '' : list[i].MNY_HNDCP}</td>`;
        html += `<td>${list[i].MNY_GRNT == null ? '' : list[i].MNY_GRNT}</td>`;
        html += `<td>${list[i].MNY_ALL_100_PTNT == null ? '' : list[i].MNY_ALL_100_PTNT}</td>`;
        html += `<td>${list[i].MNY_TOTL_GRNT_NOT == null ? '' : list[i].MNY_TOTL_GRNT_NOT}</td>`;
        html += `<td>${list[i].MNY_CHRG_100_UNDR == null ? '' : list[i].MNY_CHRG_100_UNDR}</td>`;
        html += `<td>${list[i].DT_CHRG_SND == null ? '' : list[i].DT_CHRG_SND}</td>`;
        html += '</tr>';
        $("#claimReviewTotal").append(html);
    }

    PatientListCheckBox(true);
}

async function Refresh청구서명세서(i집계표ID) {
    RefreshTable('claimReviewSpecifi');
    var list = await GetData(`SELECT * FROM T_CHRG_DTL WHERE ID_CHRG_SMRY = '${i집계표ID}' ORDER BY NO_CHRG_DTL`);


    for (let i = 0; i < list.length; i++) {
        html = '';
        html += `<tr onclick="ClickSpecifi(this)" ${SetJson(list[i])}>`;
        html += `<td>${i + 1}</td>`;
        html += `<td><input type="checkbox"></td>`;
        html += `<td>${list[i].CD_CHART}</td>`;
        html += `<td>${list[i].NM_CHART}</td>`;
        // html += `<td>${list[i].주민번호}</td>`;
        // html += `<td>${주민번호}</td>`;
        html += `<td></td>`;
        html += `<td>${list[i].FG_ISRC_KIND_INJRY}</td>`;
        html += `<td>${list[i].DS_TREAT_START}</td>`;
        html += `<td>${list[i].MNY_TOTL_GRNT}</td>`;
        html += `<td>${list[i].MNY_PART_PTNT}</td>`;
        html += `<td>${list[i].MNY_MXM_EXCD_PTNT}</td>`;
        html += `<td>${list[i].MNY_CHRG}</td>`;
        html += `<td>${list[i].MNY_HNDCP}</td>`;
        html += `<td>${list[i].MNY_GRNT}</td>`;
        html += `<td>${list[i].MNY_ALL_100_PTNT}</td>`;
        html += `<td>${list[i].MNY_TOTL_GRNT_NOT}</td>`;
        html += `<td>${list[i].MNY_100_PART_PTNT}</td>`;
        html += `<td>${list[i].MNY_CHRG_100_UNDR}</td>`;
        html += '</tr>';
        $("#claimReviewSpecifi").append(html);
    }
}

function Cmd청구집계작업_Click() {
    // ValidationCheck 함수를 호출하여 유효성을 확인합니다.
    // if (!ValidationCheck()) {
    //     return;
    // }

    switch (parseInt(GetSelectValue('lue청구구분'))) {
        case 청구구분코드Enum.청구구분코드0원청구:
        case 청구구분코드Enum.청구구분코드2추가청구:
        case 청구구분코드Enum.청구구분코드99누락청구:
            break;
        default:
            alert('청구 집계, 추후 적용될 예정입니다.');
            return;
    }

    // b보험유형 값 확인    
    var b보험유형 = parseInt(GetSelcetEditValue('lue보험유형'));
    if (b보험유형 > 보험구분002Enum.보험구분4산업재해) {
        alert(`청구 집계, 추후 적용될 예정입니다.`);
        return;
    }

    // grd청구집계대상자에서 선택된 행 수 확인
    var patientList = document.getElementById("patientList");
    if (patientList.childElementCount <= 0) {
        alert('청구대상자 조회, 청구대상자가 없습니다.')
        return;
    }

    Do청구집계_양방();
}

function ValidationCheck() {
    try {
        var errMsg = "";

        if (document.getElementById('day1').value == "") {
            errMsg = "집계기간 시작일자가 없습니다.";
        }

        if (document.getElementById('day2').value == "") {
            errMsg = "집계기간 종료일자가 없습니다.";
        }

        if (document.getElementById('lue청구구분').value == null)
            errMsg = "청구구분 설정이 없습니다.";

        if (rdo집계구분.value === null)
            errMsg = "집계구분 설정이 없습니다.";

        var b집계구분 = parseInt(rdo집계구분.value);
        if (b집계구분 === 1 && txt환자검색.value.trim() === "")
            errMsg = "환자 정보가 없습니다.";

        var validationResult = 심사BL.instance().ValidationCheck(_db, errMsg);
        if (!validationResult || errMsg !== "") {
            frmSBError.ShowError("작업 불가", errMsg);
            return false;
        }
    } catch (ex) {
        console.error(ex.message);
        return false;
    }

    return true;
}

async function Do청구집계_양방() {
    // list청구집계.clear();

    // var selectedRows = gv청구집계대상자.getSelectedRows();
    // var list = [];

    // for (var i = 0; i < selectedRows.length; i++) {
    //     list.push(gv청구집계대상자.getRow(selectedRows[i]));
    // }

    var b청구구분 = parseInt(GetSelectValue('lue청구구분'));
    var 이전접수번호 = '';

    if (b청구구분 == 2) {
        이전접수번호 = '접수 번호를 입력해 주세요. 보완청구';
        var b보험유형 = parseInt(GetSelcetEditValue('lue보험유형'));

        if (이전접수번호 == '') {
            return;
        }
        else if ((b보험유형 === 4 && 이전접수번호.length !== 15) || (b보험유형 !== 4 && 이전접수번호.length !== 7)) {
            alert('작업 불가잘못된 접수번호 입니다. - 산재: 15자리\n- 그외: 7자리');
            return;
        }
    }

    // var _worker1 = new 청구외래집계Worker(_db, list);
    // _worker1.명세서생성Complete += Worker_명세서생성Complete;

    // var f = new frmWorkProgressBar(_worker1);
    // f.showDialog();

    var trs = GetTableChildTrs('patientList');
    var isAdd = false;
    for (let i = 0; i < trs.length; i++) {
        var td = GetTableChildTds(trs[i]);
        if (td[1].querySelector('input').checked) {
            isAdd = true;
            break;
        }
    }

    if (isAdd) {
        var cs집계표 = await Create집계표And집계작업();
        var NO_CHRG_SMRY = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE NO_CHRG_SMRY = ${cs집계표.NO_CHRG_SMRY}`);
        cs집계표.ID_CHRG_SMRY = NO_CHRG_SMRY.length > 0 ? NO_CHRG_SMRY[0].ID_CHRG_SMRY : 0;

        var lst = await Worker_명세서생성Complete();
        new 청구명세서생성Worker(cs집계표, lst);
    }

    // var _workder3 = new 청구명세서생성Worker(_db, cs집계표, list청구집계, 이전접수번호);
    // _workder3.WorkingFinished += _workder3_WorkingFinished;
    // var f = new frmWorkProgressBar(_workder3);
    // f.showDialog();
}

async function Create집계표And집계작업() {
    var ds_treat_start = HyphenReplace(document.getElementById('day1').value);
    var ds_treat_end = HyphenReplace(document.getElementById('day2').value);
    var b보험유형 = parseInt(GetSelcetEditValue('lue보험유형'));
    var b외래입원구분 = 0;
    var b청구구분 = parseInt(GetSelectValue('lue청구구분'));
    var s청구단위 = parseInt(GetSelectValue('lue청구단위'));
    var ym청구연월 = HyphenReplace(document.getElementById('day1').value).substring(0, 6);
    var i양한방구분 = 0;
    var rdo산재보험종별구분 = document.getElementById('rdo산재보험종별구분1').checked == 1 ? 1 : document.getElementById('rdo산재보험종별구분2').checked == 1 ? 2 : 3;

    var cs = new T_CHRG_SMRY();

    cs.YM_CHRG_SMRY = ym청구연월;
    cs.FG_ISRC = b보험유형;
    // cs.FG_ISRC_KIND = Get보험자종별구분(b보험유형, rdo산재보험종별구분.getValue().toString());
    cs.FG_ISRC_KIND = Get보험자종별구분(b보험유형, rdo산재보험종별구분);
    cs.TY_ACCEPT = b외래입원구분;
    cs.VR_CHRG_FORM = Get청구명세서식버전(b보험유형, 1, ds_treat_start, i양한방구분);
    cs.VR_CHRG_DTL = Get청구명세서식버전(b보험유형, 2, ds_treat_start, i양한방구분);
    cs.NO_CHRG_SMRY = await GetMax_NO_CHRG_SMRY(ym청구연월, b보험유형, rdo산재보험종별구분);
    cs.NO_CHRG_FORM = Get청구서식번호(b보험유형, cs.FG_ISRC_KIND);
    var 산재기관코드 = 병원정보.find(t => t.NM_HSPTL_INFO == '산재기관코드');
    var 요양기관번호 = 병원정보.find(t => t.NM_HSPTL_INFO == '요양기관번호');

    cs.NO_CARE_ORG = cs.FG_ISRC === 4 ? 산재기관코드.VL_HSPTL_INFO : 요양기관번호.VL_HSPTL_INFO;
    cs.NO_RESV_ORG = cs.FG_ISRC === 4 ? "2" : "1";
    cs.FG_CHRG_SMRY = b청구구분;
    cs.FG_CHRG_CYCL = b외래입원구분 === 0 ? s청구단위 : "";
    cs.FG_TREAT_SBJT = i양한방구분 === 0 ? "1" : "9";
    cs.FG_TREAT_PART = Get진료분야구분(b보험유형, i양한방구분);
    cs.FG_TREAT_TYPE = Get진료형태(cs);

    cs.YM_TREAT = ym청구연월;
    cs.CNT_TREAT = 0;
    cs.MNY_TOTL_GRNT = 0;
    cs.MNY_PART_PTNT = 0;
    cs.MNY_MXM_EXCD_PTNT = 0;
    cs.MNY_CHRG = 0;
    cs.MNY_GRNT = 0;
    cs.MNY_HNDCP = 0;
    cs.MNY_TOTL = 0;
    cs.MNY_CHRG_RDM = 0;
    cs.MNY_ALL_100_PTNT = 0;
    cs.MNY_PART_RDM = 0;
    cs.MNY_TOTL_GRNT_NOT = 0;
    cs.MNY_100_PART_PTNT = 0;
    cs.MNY_CHRG_100_UNDR = 0;
    cs.MNY_CHRG_100_UNDR_RDM = 0;
    cs.CNT_DFRNC_TREAT = 0;
    cs.CNT_DFRNC_DAYS = 0;
    cs.CNT_DFRNC_DOCT = 0;
    cs.CNT_DFRNC_TREAT_AVRG = 0;
    cs.LVL_DFRNC = 0;
    cs.MNY_DFRNC = 0;
    cs.DS_CHRG = HyphenReplace(fmtTodayDay);
    var 원장이름 = 병원정보.find(t => t.NM_HSPTL_INFO == '원장이름');
    cs.NM_CHRG = 원장이름.VL_HSPTL_INFO;
    var 청구작성자이름 = 병원정보.find(t => t.NM_HSPTL_INFO == '청구작성자이름');
    cs.NM_RGST = 청구작성자이름.VL_HSPTL_INFO;

    var 청구작성자주민번호 = 병원정보.find(t => t.NM_HSPTL_INFO == '청구작성자주민번호');

    if (청구작성자주민번호.VL_HSPTL_INFO && 청구작성자주민번호.VL_HSPTL_INFO.length > 6) {
        cs.DS_RGST_BRTH = 병원정보.청구작성자주민번호.substring(0, 6) + '0000000';
    }
    else {
        cs.DS_RGST_BRTH = "0000000000000";
    }

    var 종별구분 = 병원정보.find(t => t.NM_HSPTL_INFO == '종별구분');
    cs.NO_EXAM_APPRVL = Get검사승인번호(0, 종별구분.VL_HSPTL_INFO, i양한방구분, cs.VR_CHRG_FORM.toString());
    var 청구대행청구기호 = 병원정보.find(t => t.NM_HSPTL_INFO == '청구대행청구기호');
    cs.DC_CHRG_AGNCY = 청구대행청구기호.VL_HSPTL_INFO;
    cs.DC_RMRK = "";
    // cs.ID_UPDT = MonoChartSettingManager.instance().Setting.UserID;
    cs.DT_UPDT = fmtTodaySec;
    cs.FG_CHRG_STAT = 0;
    cs.DT_CHRG_SMRY = fmtTodaySec;
    cs.DT_CHRG_CALC = fmtTodaySec;
    cs.DT_CHRG_SND = null;
    cs.NO_CHRG_ACCEPT = "";
    cs.DC_CHRG_MEMO = "";

    await Set_CreatePostData('T_CHRG_SMRY', cs);

    return cs;
}

function Get보험자종별구분(b보험유형, var보험종별구분_산재청구 = "") {
    var s종별구분 = '';
    var 종별구분 = 병원정보.find(t => t.NM_HSPTL_INFO == '종별구분');
    switch (b보험유형) {
        case 1: // 보험구분1국민공단
            s종별구분 = '4';
            break;
        case 2: // 보험구분2의료급여
            if (종별구분.VL_HSPTL_INFO === 0) {
                s종별구분 = '1';
            } else if (종별구분.VL_HSPTL_INFO === 1 || 종별구분.VL_HSPTL_INFO === 2) {
                s종별구분 = '2';
            }
            break;
        case 3: // 보험구분3자동차보험
            s종별구분 = '8';
            break;
        case 4: // 보험구분4산업재해
            s종별구분 = var보험종별구분_산재청구;
            break;
        case 5: // 보험구분5보훈
            s종별구분 = '7';
            break;
        default:
            break;
    }

    return s종별구분;
}

function Get청구명세서식버전(b보험유형, 청구명세구분, ds_treat_start, i양한방구분) {
    let s버전 = '';

    switch (b보험유형) {
        case 1: // 보험구분1국민공단
        case 2: // 보험구분2의료급여
            if (ds_treat_start < '20190201') {
                s버전 = '089';
            } else {
                if (i양한방구분 == 0) {
                    s버전 = new Date().toISOString().slice(0, 10).replace(/-/g, '').localeCompare('20210401') >= 0 ? '091' : '090';
                } else {
                    s버전 = '091';
                }
            }
            break;
        case 3: // 보험구분3자동차보험
            s버전 = '020';
            break;
        case 4: // 보험구분4산업재해
            s버전 = '070';
            break;
        case 5: // 보험구분5보훈
            break;
        default:
            break;
    }

    return s버전;
}

async function GetMax_NO_CHRG_SMRY(_ym청구년월, fg_isrc, var보험종별구분_산재청구) {
    // 기본     : yyyyMM + 일련번호 4자리
    // 산재 후유: yyyyMM + "A" + 일련번호 3자리
    // 산재 진폐: yyyyMM + "B" + 일련번호 3자리
    let prev_cs = null;
    let iNoChrgSmry = 1;
    let sNoChrtSmry = "";
    let str산재구분 = "";
    var t_CHRG_SMRY = await GetData(`SELECT * FROM T_CHRG_SMRY`);

    if (fg_isrc === 4 && var보험종별구분_산재청구 === "2") {
        str산재구분 = "A";
        prev_cs = t_CHRG_SMRY.filter(t => t.YM_CHRG_SMRY === _ym청구년월 && t.FG_ISRC === fg_isrc && t.FG_ISRC_KIND === var보험종별구분_산재청구).sort((a, b) => b.NO_CHRG_SMRY - a.NO_CHRG_SMRY)[0];
        iNoChrgSmry = prev_cs ? parseInt(prev_cs.NO_CHRG_SMRY.substring(7, 10)) + 1 : 1;
        sNoChrtSmry = iNoChrgSmry.toString().padStart(3, '0');
    } else if (fg_isrc === 4 && var보험종별구분_산재청구 === "3") {
        str산재구분 = "B";
        prev_cs = t_CHRG_SMRY.filter(t => t.YM_CHRG_SMRY === _ym청구년월 && t.FG_ISRC === fg_isrc && t.FG_ISRC_KIND === var보험종별구분_산재청구).sort((a, b) => b.NO_CHRG_SMRY - a.NO_CHRG_SMRY)[0];
        iNoChrgSmry = prev_cs ? parseInt(prev_cs.NO_CHRG_SMRY.substring(7, 10)) + 1 : 1;
        sNoChrtSmry = iNoChrgSmry.toString().padStart(3, '0');
    } else {
        prev_cs = t_CHRG_SMRY.filter(t => t.YM_CHRG_SMRY === _ym청구년월 && !(t.FG_ISRC === 4 && (t.FG_ISRC_KIND === "2" || t.FG_ISRC_KIND === "3"))).sort((a, b) => b.NO_CHRG_SMRY - a.NO_CHRG_SMRY)[0];
        iNoChrgSmry = prev_cs ? parseInt(prev_cs.NO_CHRG_SMRY.substring(6, 10)) + 1 : 1;
        sNoChrtSmry = iNoChrgSmry.toString().padStart(4, '0');
    }

    return `${_ym청구년월}${str산재구분}${sNoChrtSmry}`;
}

function Get청구서식번호(b보험유형, var보험종별구분_산재청구) {
    let s서식번호 = "";

    switch (b보험유형) {
        case 1:
            s서식번호 = "H010";
            break;
        case 2:
            s서식번호 = "H011";
            break;
        case 3:
            s서식번호 = "C010";
            break;
        case 4:
            s서식번호 = var보험종별구분_산재청구 === "2" ? "M120" : var보험종별구분_산재청구 === "3" ? "M130" : "M110";
            break;
        case 5:
            break;
        default:
            break;
    }

    return s서식번호;
}

function Get진료분야구분(b보험유형, 양한방구분) {
    let s진료분야 = "";
    var 종별구분 = 병원정보.find(t => t.NM_HSPTL_INFO == '종별구분');
    var 병원유형 = 병원정보.find(t => t.NM_HSPTL_INFO == '병원유형');

    if (병원유형.VL_HSPTL_INFO === 3 && 종별구분.VL_HSPTL_INFO === 1) {
        switch (b보험유형) {
            case 1:
            case 2:
                s진료분야 = 양한방구분 === 1 ? "9" : ""; // 한방 외 세부과목 구분 미구현..
                break;
            case 3:
                s진료분야 = 양한방구분 === 1 ? "9" : "2"; // 한방 외 세부과목 구분 미구현..
                break;
            case 4:
            case 5:
                break;
            default:
                break;
        }
    }

    return s진료분야;
}

function Get진료형태(cs) {
    let strRst = "";

    switch (cs.FG_TREAT_SBJT) {
        case "1": // 의치과
            switch (cs.TY_ACCEPT) {
                case 청구외래입원Enum.청구외래입원0외래: strRst = 청구진료형태Constant.진료형태2의과외래_보건기관외래; break;
                case 청구외래입원Enum.청구외래입원1입원: strRst = 청구진료형태Constant.진료형태1의과입원_보건기관입원; break;
                case 청구외래입원Enum.청구외래입원7장기요양: strRst = 청구진료형태Constant.진료형태A요양병원_장기환자입원_의과; break;
                default: break;
            }
            break;
        case "5": // 의료급여정액
            switch (cs.TY_ACCEPT) {
                case 청구외래입원Enum.청구외래입원0외래: strRst = 청구진료형태Constant.진료형태4치과외래_의료급여정신건강의학과정액_외래; break;
                case 청구외래입원Enum.청구외래입원1입원: strRst = 청구진료형태Constant.진료형태3치과입원_의료급여정신건강의학과정액_입원; break;
                case 청구외래입원Enum.청구외래입원5낮병동: strRst = 청구진료형태Constant.진료형태5의료급여정신건강의학과정액_낮병동; break;
                default: break;
            }
            break;
        case "9": // 한방
            switch (cs.TY_ACCEPT) {
                case 청구외래입원Enum.청구외래입원0외래: strRst = cs.FG_ISRC == 보험구분002Enum.보험구분4산업재해 ? 청구진료형태Constant.진료형태6한방외래_산재 : 청구진료형태Constant.진료형태9한방외래; break;
                case 청구외래입원Enum.청구외래입원1입원: strRst = cs.FG_ISRC == 보험구분002Enum.보험구분4산업재해 ? 청구진료형태Constant.진료형태5한방입원_산재 : 청구진료형태Constant.진료형태8한방입원; break;
                default: break;
            }
            break;
        default:
            break;
    }

    return strRst;
}

function Refresh청구명세서ByGrid(target) {
    ComnTbClick(target);
    // if (gv.FocusedRowHandle < 0) {
    //     grd청구명세서.DataSource = null;
    //     return;
    // }

    // try {
    // ShowWaitForm_Progress("명세서 목록 불러오는 중...");
    // RefreshDBContext();

    // var cd = gv.GetFocusedRow();

    var json = GetJson(target);
    Refresh청구서명세서(json.ID_CHRG_SMRY);

    //     gv청구명세서.Columns[T_CHRG_DTL_FieldConstant.FG_ISRC_KIND_GRNT_의료급여종별구분].Visible = false;
    //     gv청구명세서.Columns[T_CHRG_DTL_FieldConstant.FG_ISRC_KIND_INJRY_공상등구분].Visible = false;

    //     if (cd.FG_ISRC == 보험구분002Enum.보험구분1국민공단)
    //         gv청구명세서.Columns[T_CHRG_DTL_FieldConstant.FG_ISRC_KIND_INJRY_공상등구분].Visible = true;
    //     else if (cd.FG_ISRC == 보험구분002Enum.보험구분2의료급여)
    //         gv청구명세서.Columns[T_CHRG_DTL_FieldConstant.FG_ISRC_KIND_GRNT_의료급여종별구분].Visible = true;
    // } catch (ex) {
    //     frmSBError.ShowError("응용프로그램 오류", ex.message);
    // } finally {
    //     CloseWaitForm_Progress();
    // }

    smry = json;
    DoubleClickSpecifi(target);
}

async function Worker_명세서생성Complete() {
    var trs = GetTableChildTrs('patientList');
    var lst = [];

    for (let i = 0; i < trs.length; i++) {
        var td = GetTableChildTds(trs[i]);
        if (td[1].querySelector('input').checked) {
            var json = GetJson(trs[i]);

            var c1 = new C진료비영수증();
            c1.Init();
            var ac = await GetData(`SELECT * FROM T_ACCEPT WHERE NO_ACCEPT = ${json.NO_ACCEPT}`);
            await c1.진료비계산외래(ac[0], '', 0, 계산유형Enum.청구);
            lst.push(c1);
        }
    }

    return lst;
}

function ClickSpecifi(target) {
    ComnTbClick(target);
    DoubleClickSpecifi(target);
}
function DoubleClickSpecifi(target) {
    if (event.detail === 2) {
        var tab_id = 'storagePatientTab-2';

        $('ul.storagePatientTabs li').removeClass('current');
        $('.storagePatientTab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');

        var json = GetJson(target);

        Refresh화면심사(json);
    }
}
//#endregion

//#region 화면심사
async function Refresh화면심사(json) {
    RefreshTable('grd심사청구대상자');

    if (json == undefined) {
        var select = document.getElementById('lue청구번호2');
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        return;
    }

    iD_CHRG_SMRY = json.ID_CHRG_SMRY;

    t_CHRG_SMRY = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE ID_CHRG_SMRY = '${json.ID_CHRG_SMRY}'`);
    t_CHRG_DTL = await GetData(`SELECT * FROM T_CHRG_DTL WHERE ID_CHRG_SMRY = '${json.ID_CHRG_SMRY}' ORDER BY NO_CHRG_DTL`);

    var day = `${t_CHRG_SMRY[0].YM_CHRG_SMRY.substring(0, 4)}-${t_CHRG_SMRY[0].YM_CHRG_SMRY.substring(4, 6)}`;
    document.getElementById('lue청구연월2').value = day;
    document.getElementById('lue보험유형2').selectedIndex = 0;
    await Create청구번호(day, json);

    if (GetSelectValue('lue심사상태2') != 청구화면심사상태Enum.전체99) {
        t_CHRG_DTL = t_CHRG_DTL.filter(t => t.FG_DTL_STAT == GetSelectValue('lue심사상태2'));
    }

    t_CHRG_DTL = t_CHRG_DTL.filter(t => t.NO_CHRG_SMRY == GetSelectValue('lue청구번호2'));
    Get심사청구대상자Table(t_CHRG_DTL);
}

async function Create청구번호(day, json) {
    var select = document.getElementById('lue청구번호2');
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    var list = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE YM_CHRG_SMRY = ${HyphenReplace(day)}`);
    for (let i = 0; i < list.length; i++) {
        selectEl = document.querySelector("#lue청구번호2");
        objOption = document.createElement("option");
        objOption.text = `${list[i].NO_CHRG_SMRY} ㅣ ${list[i].CNT_TREAT}`;
        objOption.value = list[i].NO_CHRG_SMRY;
        selectEl.options.add(objOption);
    }

    document.getElementById('lue청구번호2').selectedIndex = GetSelectOptionIndex('lue청구번호2', json.NO_CHRG_SMRY);
}

function Change심사상태() {
    Refresh화면심사(iD_CHRG_SMRY);
}

async function Change청구번호() {
    var value = GetSelectValue('lue청구번호2');
    var lst = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE NO_CHRG_SMRY = ${value}`);
    Refresh화면심사(lst[0]);
}

async function Change청구연월() {
    var value = HyphenReplace(document.getElementById('lue청구연월2').value);
    var lst = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE YM_CHRG_SMRY = ${value}`);

    if (lst.length <= 0) {
        Refresh화면심사(undefined);
        return;
    }

    Refresh화면심사(lst[0]);
}

function ClickGrd심사청구대상자(target, idx) {
    ComnTbClick(target);

    clickIdx = idx;
    var json = GetJson(target);

    var arrayBufferData = new Uint8Array(json.XML_CHRG_BYTE.data).buffer;
    // ArrayBuffer를 문자열로 디코딩
    var decodedString = new TextDecoder().decode(arrayBufferData);
    _진료비영수증 = JSON.parse(decodedString);

    청구재계산및Refresh항목별금액(json.ID_CHRG_DTL, false, true);
    RefreshInfo(json);
}

async function 청구재계산및Refresh항목별금액(ID_CHRG_DTL, reqRecalculate명세서, bRaiseInsertSelectChanged심사대기자) {
    if (_진료비영수증 == undefined) {
        return;
    }

    var 진료비영수증 = new C진료비영수증();
    진료비영수증.Save(_진료비영수증);

    var list = await Get진료처방ListQuery(처방수정구분Enum.FG00등록);
    var 영수증 = [];
    영수증.push(list);

    // var lst = [];
    // var list = await Get진료처방ListQuery(처방수정구분Enum.FG00등록);        
    // 진료비영수증._ac.TY_CALC_SPCL = t_CHRG_DTL.TY_CALC_SPCL;       
    await 진료비영수증.청구재계산(영수증, t_CHRG_DTL.ID_CHRG_DTL, 계산유형Enum.청구);

    Refresh항목별금액(진료비영수증);
    Refresh명세서특정내역();
    M_viewsubject_SelectChanged청구명세서(진료비영수증);
    Refresh심사참고();

    if (reqRecalculate명세서) {
        Recalculate명세서(t_CHRG_DTL[clickIdx], 진료비영수증, bRaiseInsertSelectChanged심사대기자);
    }

    // SetVisibleGridRows();
}

async function Refresh항목별금액(c1) {
    if (c1 === null)
        return;

    var list = [];

    list.push(c1._obj급여총액);
    list.push(c1._obj급여_일부본인부담_본인부담금);
    list.push(c1._obj급여_일부본인부담_공단부담금);
    list.push(c1._obj급여_전액본인부담);
    list.push(c1._obj급여본인5080);
    list.push(c1._obj급여청구5080);

    // vGridControl1.DataSource = list;
    RefreshRightTable(list);

    // 청구인증 데이터 만들기 위해 접속 ID가 Admin일 경우에는 DB의 합계금액 표시
    // if (MonoChartSettingManager.instance().Setting.UserID === "admin") {
    //     obj합계.요양급여총액 = t_CHRG_DTL.MNY_TOTL_GRNT;
    //     obj합계.청구액 = t_CHRG_DTL.MNY_CHRG;
    //     obj합계.본인부담액 = t_CHRG_DTL.MNY_PART_PTNT;
    //     obj합계.전액본인부담액 = t_CHRG_DTL.MNY_ALL_100_PTNT;
    //     obj합계.전액미만총액 = t_CHRG_DTL.MNY_TOTL_GRNT_NOT;
    //     obj합계.전액미만본인부담액 = t_CHRG_DTL.MNY_100_PART_PTNT;
    //     obj합계.전액미만청구액 = t_CHRG_DTL.MNY_CHRG_100_UNDR;
    //     obj합계.장애인지원금 = t_CHRG_DTL.MNY_HNDCP;
    //     obj합계.지원금 = t_CHRG_DTL.MNY_GRNT;
    //     obj합계.상한초과금 = t_CHRG_DTL.MNY_MXM_EXCD_PTNT;
    //     obj합계.대불금 = t_CHRG_DTL.MNY_RPLCE_PAY;
    //     obj합계.산재_총액_I란 = t_CHRG_DTL.MNY_IAI_I;
    //     obj합계.산재_총액_II란 = t_CHRG_DTL.MNY_IAI_II;
    // } else {
    //     obj합계.요양급여총액 = c1.Get요양급여비용총액1();
    //     obj합계.청구액 = c1.Get청구액();
    //     obj합계.본인부담액 = c1.Get본인일부부담금();
    //     obj합계.전액본인부담액 = c1.Get전액본인부담금총액(false);
    //     obj합계.전액미만총액 = c1.Get전액미만총액();
    //     obj합계.전액미만본인부담액 = c1.Get전액미만본인일부부담금();
    //     obj합계.전액미만청구액 = c1.Get전액미만청구액();
    //     obj합계.장애인지원금 = c1.Get장애인의료비();
    //     obj합계.지원금 = c1.Get지원금();
    //     obj합계.상한초과금 = c1.Get상한초과금();
    //     obj합계.대불금 = 0;
    //     obj합계.산재_총액_I란 = c1.Get산재소계_I란();
    //     obj합계.산재_총액_II란 = c1.Get산재소계_II란(true);
    // }

    var list합계 = [];
    var obj합계 = {};

    obj합계.요양급여총액 = c1.Get요양급여비용총액1();
    obj합계.청구액 = c1.Get청구액();
    obj합계.본인부담액 = c1.Get본인일부부담금();
    obj합계.전액본인부담액 = await c1.Get전액본인부담금총액(false);
    obj합계.전액미만총액 = c1.Get전액미만총액();
    obj합계.전액미만본인부담액 = c1.Get전액미만본인일부부담금();
    obj합계.전액미만청구액 = c1.Get전액미만청구액();
    obj합계.장애인지원금 = c1.Get장애인의료비();
    obj합계.지원금 = c1.Get지원금();
    obj합계.상한초과금 = c1.Get상한초과금();
    obj합계.대불금 = 0;
    obj합계.산재_총액_I란 = c1.Get산재소계_I란();
    obj합계.산재_총액_II란 = c1.Get산재소계_II란(true);

    list합계.push(obj합계);

    document.getElementById('vgrd합계1').innerHTML = list합계[0].요양급여총액;
    document.getElementById('vgrd합계2').innerHTML = list합계[0].청구액;
    document.getElementById('vgrd합계3').innerHTML = list합계[0].본인부담액;
    document.getElementById('vgrd합계4').innerHTML = list합계[0].전액미만총액;
    document.getElementById('vgrd합계5').innerHTML = list합계[0].전액미만본인부담액;
    document.getElementById('vgrd합계6').innerHTML = list합계[0].전액미만청구액;
    document.getElementById('vgrd합계7').innerHTML = 0;
    document.getElementById('vgrd합계8').innerHTML = list합계[0].장애인지원금;
    document.getElementById('vgrd합계9').innerHTML = list합계[0].지원금;
    document.getElementById('vgrd합계10').innerHTML = list합계[0].상한초과금;
    document.getElementById('vgrd합계11').innerHTML = list합계[0].대불금;
    document.getElementById('vgrd합계12').innerHTML = list합계[0].산재_총액_I란;
    document.getElementById('vgrd합계13').innerHTML = list합계[0].산재_총액_II란;
}

function Click재계산() {
    청구재계산및Refresh항목별금액(true, true);
}

async function Get진료처방ListQuery(en처방수정구분, dtl = undefined) {
    var i처방수정구분 = en처방수정구분;

    var query = await GetData(`SELECT
    false AS DC,
    p.DS_TREAT_START AS 처방시작일자,
    p.DS_TREAT_END AS 처방종료일자,
    p.CD_CHRG AS 처방코드,
    p.CD_CHRG AS 청구코드,
    p.NM_DSPLY AS 표시명칭,
    p.AMT_DOSAGE_1TH AS 투여량1회,
    p.CNT_DOSAGE AS 투여횟수,
    p.CNT_DOSAGE_DAYS AS 투여일수,
    p.FG_OUTSIDE AS 원외구분,
    p.MNY_UNPRC AS 단가,
    p.DS_APLY AS 적용일자,
    p.FG_ITEM AS 항목구분,
    p.FG_ACTN AS 행위구분,
    '${_진료비영수증._ac.DS_TREAT}' AS 진료일자,
    p.TY_PAY_APLY AS 급여적용,
    p.CD_SPCL AS 특정코드,
    p.FG_UPDT AS 수정구분,
    p.ID_UPDT AS 수정자,
    p.DT_UPDT AS 수정일자,
    p.RT_ADTN_ACTN AS RT_ADTN_ACTN,
    p.FG_CODE AS 청구코드구분,
    p.NO_CHRG_DTL AS 코드번호,
    p.DS_TREAT_START AS 시작일,
    p.DS_TREAT_END AS 종료일,
    p.ID_CHRG_TREAT AS ID_CHRG_TREAT,
    CASE 
        WHEN p.NO_CLS != '${항번호Constant.요양병원완화의료정액L}' THEN 1
        WHEN p.FG_ITEM = '${장기요양정액수가LL01}' OR p.FG_ITEM = '${호스피스정액수가LL02}' THEN 1
        ELSE 0
    END AS b요양급여포함,
    CAST(p.FG_ACCEPTIN_FEE AS SIGNED) AS 입원료상세구분,
    (SELECT t.DC_SPCL 
     FROM T_CHRG_SPCL AS t 
     WHERE t.ID_CHRG_SMRY = '${dtl == undefined ? t_CHRG_DTL[clickIdx].ID_CHRG_SMRY : dtl.ID_CHRG_SMRY}'
       AND t.ID_CHRG_TREAT = p.ID_CHRG_TREAT 
       AND t.CD_SPCL_CODE = '${CdSpclCodeConstant.JS002_의약분업예외구분코드}'     
     LIMIT 1) AS 예외구분
FROM
    T_CHRG_TREAT AS p
WHERE
    p.ID_CHRG_SMRY = '${dtl == undefined ? t_CHRG_DTL[clickIdx].ID_CHRG_SMRY : dtl.ID_CHRG_SMRY}'
    AND p.FG_UPDT ='${i처방수정구분}'       
ORDER BY
    p.FG_CODE`);

    if (dtl == undefined) {
        query = query.filter(t => t.코드번호 == t_CHRG_DTL[clickIdx].NO_CHRG_DTL);
    }
    else {
        query = query.filter(t => t.코드번호 == dtl.NO_CHRG_DTL);
    }

    return query;
}

async function Get심사청구대상자Table(t_CHRG_DTL) {
    var FG_ISRC_KIND_INJRY_List = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '6'`);
    var TY_CALC_SPCL_List = await GetData(`SELECT * FROM T_CODE_DTL WHERE CD_CODE_GRP = '9'`);
    for (let i = 0; i < t_CHRG_DTL.length; i++) {
        html = '';
        html += `<tr onclick="ClickGrd심사청구대상자(this, ${i})" ${SetJson(t_CHRG_DTL[i])}>`;
        html += `<td>${i + 1}</td>`;
        html += `<td>${t_CHRG_DTL[i].CD_CHART}</td>`;
        html += `<td>${t_CHRG_DTL[i].NM_CHART}</td>`;
        var FG_ISRC_KIND_INJRY = FG_ISRC_KIND_INJRY_List.find(t => t.CD_CODE_DTL == t_CHRG_DTL[i].FG_ISRC_KIND_INJRY);
        html += `<td> ${FG_ISRC_KIND_INJRY == undefined ? '보험' : FG_ISRC_KIND_INJRY.NM_CODE_RPLC}</td> `;

        var DC_SPCL = await GetData(`SELECT * FROM T_CHRG_SPCL WHERE ID_CHRG_DTL = '${t_CHRG_DTL[i].ID_CHRG_DTL}' AND CD_SPCL_CODE = '${CdSpclCodeConstant.MT002_특정기호}'`);
        html += `<td>${DC_SPCL.length > 0 ? DC_SPCL[0].DC_SPCL : ''}</td > `;

        var TY_CALC_SPCL = TY_CALC_SPCL_List.find(t => t.CD_CODE_DTL == t_CHRG_DTL[i].TY_CALC_SPCL);
        html += `<td> ${TY_CALC_SPCL.NM_CODE_RPLC}</td> `;
        html += `<td> ${t_CHRG_DTL[i].DS_TREAT_START}</td> `;
        html += `<td> ${t_CHRG_DTL[i].DS_TREAT_END}</td> `;
        html += '</tr>';
        $("#grd심사청구대상자").append(html);
    }
}

async function Recalculate명세서(chrgDtl, 진료비영수증, bRaiseInsertSelectChanged심사대기자) {
    try {
        var cd = await GetData(`SELECT * FROM T_CHRG_DTL WHERE ID_CHRG_DTL = ${chrgDtl.ID_CHRG_DTL} LIMIT 1`);
        console.log(진료비영수증);
        // 진료비영수증._list진료처방 = [];


        // for (var lst of 원내집계) {
        //     진료비영수증._list진료처방.push(lst);
        // }
        // for (var lst of 삭제내역) {
        //     진료비영수증._list진료처방.push(lst);
        // }
        // for (var lst of 원외집계) {
        //     진료비영수증._list진료처방원외.push(lst);
        // }

        // console.log(진료비영수증);

        // 데이터 갱신
        cd.FG_TREAT_RSLT = 진료비영수증._ac.TY_TREAT_RSLT;
        cd.MNY_TOTL_GRNT = 진료비영수증.Get요양급여비용총액1();
        cd.MNY_PART_PTNT = 진료비영수증.Get본인일부부담금();
        cd.MNY_MXM_EXCD_PTNT = 진료비영수증.Get상한초과금();
        cd.MNY_CHRG = 진료비영수증.Get청구액();
        cd.MNY_GRNT = 진료비영수증.Get지원금();
        cd.MNY_HNDCP = 진료비영수증.Get장애인의료비();
        cd.MNY_RPLCE_PAY = 0;
        cd.MNY_TOTL = 진료비영수증.Get요양급여비용총액2(false);
        cd.MNY_CHRG_RDM = 0;
        cd.MNY_ALL_100_PTNT = 진료비영수증.Get전액본인부담금총액(false);
        cd.MNY_PART_RDM = 0;
        cd.MNY_TOTL_GRNT_NOT = 진료비영수증.Get전액미만총액();
        cd.MNY_100_PART_PTNT = 진료비영수증.Get전액미만본인일부부담금();
        cd.MNY_CHRG_100_UNDR = 진료비영수증.Get전액미만청구액();
        cd.MNY_CHRG_100_UNDR_RDM = 0;

        if (t_CHRG_SMRY[0].FG_ISRC === 보험구분002Enum.보험구분4산업재해) {
            cd.MNY_IAI_I = 진료비영수증.Get산재소계_I란();
            cd.MNY_IAI_II = 진료비영수증.Get산재소계_II란(true);
        }

        cd.XML_CHRG_DTL = null;
        cd.XML_CHRG_BYTE = 진료비영수증Manager.Instance.SerializeAndCompress(진료비영수증);
        cd.TY_CALC_SPCL = 진료비영수증.Ac.TY_CALC_SPCL;

        cd.FG_TREAT_RSLT = _current_T_CHRG_DTL.FG_TREAT_RSLT;

        await cd.save();

        if (bRaiseInsertSelectChanged심사대기자) {
            var viewSubject = new ViewSubject심사(); // 인스턴스 생성 가정
            viewSubject.RaiseSelectChanged청구명세서(this, cd, t_CHRG_SMRY[0]);
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            error.errors.forEach(err => {
                console.error(`- Property: "${err.path}", Error: "${err.message}"`);
                // MessageBox 대체
                console.log(`- Property: "${err.path}", Error: "${err.message}"`);
            });
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

function InitRightTable() {
    var target = document.getElementById('rightTable');
    var tbElements = target.getElementsByTagName('table');

    var trs = [];
    for (let i = 0; i < tbElements.length; i++) {
        var lst = GetTableChildTrs(tbElements[i]);
        for (let j = 0; j < lst.length; j++) {
            if (i == 0 && j == 0) {

            }
            else {
                trs.push(lst[j]);
            }
        }
    }

    for (let i = 0; i < trs.length; i++) {
        var lst = GetTableChildThs(trs[i]);

        tds항목.push(lst[1]);
        tds급여총액.push(lst[2]);
        tds본인부담.push(lst[3]);
        tds청구액.push(lst[4]);
        tds본인100미만.push(lst[5]);
        tds청구100미만.push(lst[6]);
    }

    rightTableList = [tds항목, tds급여총액, tds본인부담, tds청구액, tds본인100미만, tds청구100미만];
}

function RefreshRightTable(list) {
    for (let i = 0; i < rightTableList.length; i++) {
        rightTableList[i][0].innerHTML = list[i]._진찰료 === undefined ? 0 : list[i]._진찰료;
        rightTableList[i][1].innerHTML = list[i]._시술및처치료 === undefined ? 0 : list[i]._시술및처치료;
        rightTableList[i][2].innerHTML = list[i]._행위료_주사료 === undefined ? 0 : list[i]._행위료_주사료;
        rightTableList[i][3].innerHTML = list[i]._약품비_주사료 === undefined ? 0 : list[i]._약품비_주사료;
        rightTableList[i][4].innerHTML = list[i]._약품비_투약조제 === undefined ? 0 : list[i]._약품비_투약조제;
        rightTableList[i][5].innerHTML = list[i]._행위료_투약조제 === undefined ? 0 : list[i]._행위료_투약조제;
        rightTableList[i][6].innerHTML = list[i]._마취료 === undefined ? 0 : list[i]._마취료;
        rightTableList[i][7].innerHTML = list[i]._처치및수술료 === undefined ? 0 : list[i]._처치및수술료;
        rightTableList[i][8].innerHTML = list[i]._검사료 === undefined ? 0 : list[i]._검사료;
        rightTableList[i][9].innerHTML = list[i]._한약_첩약 === undefined ? 0 : list[i]._한약_첩약;
        rightTableList[i][10].innerHTML = list[i]._영상진단료 === undefined ? 0 : list[i]._영상진단료;
        rightTableList[i][11].innerHTML = list[i]._방사선치료료 === undefined ? 0 : list[i]._방사선치료료;
        rightTableList[i][12].innerHTML = list[i]._치료재료대 === undefined ? 0 : list[i]._치료재료대;
        rightTableList[i][13].innerHTML = list[i]._재활및물리치료 === undefined ? 0 : list[i]._재활및물리치료;
        rightTableList[i][14].innerHTML = list[i]._정신요법료 === undefined ? 0 : list[i]._정신요법료;
        rightTableList[i][15].innerHTML = list[i]._전혈및혈액성분제제료 === undefined ? 0 : list[i]._전혈및혈액성분제제료;
        rightTableList[i][16].innerHTML = list[i]._CT진단료 === undefined ? 0 : list[i]._CT진단료;
        rightTableList[i][17].innerHTML = list[i]._MRI진단료 === undefined ? 0 : list[i]._MRI진단료;
        rightTableList[i][18].innerHTML = list[i]._초음파진단료 === undefined ? 0 : list[i]._초음파진단료;
        rightTableList[i][19].innerHTML = list[i]._검진료 === undefined ? 0 : list[i]._검진료;
        rightTableList[i][20].innerHTML = list[i]._특수재료 === undefined ? 0 : list[i]._특수재료;
        rightTableList[i][21].innerHTML = list[i]._제증명료 === undefined ? 0 : list[i]._제증명료;
        rightTableList[i][22].innerHTML = list[i]._기타 === undefined ? 0 : list[i]._기타;
        rightTableList[i][23].innerHTML = 0;
        rightTableList[i][24].innerHTML = list[i]._정액65세이상 === undefined ? 0 : list[i]._정액65세이상;
        rightTableList[i][25].innerHTML = list[i]._정액수가요양병원 === undefined ? 0 : list[i]._정액수가요양병원;
        rightTableList[i][26].innerHTML = list[i]._장애인의료비 === undefined ? 0 : list[i]._장애인의료비;
        rightTableList[i][27].innerHTML = list[i]._포괄수가진료비 === undefined ? 0 : list[i]._포괄수가진료비;
        rightTableList[i][28].innerHTML = 0;
        rightTableList[i][29].innerHTML = list[i]._합계 === undefined ? 0 : list[i]._합계;
        // list[i]._식대;             
        // list[i]._입원료;             
        // list[i]._한방물리요법료;
        // list[i]._항목;
    }
}

async function RefreshInfo(json) {
    try {
        var currentChrgDtl = await GetData(`SELECT * FROM T_CHRG_DTL WHERE ID_CHRG_DTL = ${json.ID_CHRG_DTL}`)
        var _currentChrgDtl = currentChrgDtl[0];

        var currentChrgSmry = await GetData(`SELECT * FROM T_CHRG_SMRY WHERE ID_CHRG_SMRY = ${json.ID_CHRG_SMRY}`);
        var _currentChrgSmry = currentChrgSmry[0];

        var _currentAccept = _진료비영수증._ac;

        var str수납시작일자 = _진료비영수증._수납시작일자;
        var str수납종료일자 = _진료비영수증._수납종료일자;

        var c = await GetData(`SELECT * FROM T_CHART WHERE CD_CHART = ${_currentChrgDtl.CD_CHART}`);
        if (c.length <= 0) {
            return;
        }

        var fg_isrc_kind = '';
        var no_biz_smbl = '';

        switch (_currentChrgSmry.FG_ISRC) {
            case 보험구분002Enum.보험구분1국민공단:
                // lci사업장.Control = lue사업장;
                // lci정액정률산재진료구분.Control = lue정액정률;

                fg_isrc_kind = _currentChrgDtl.FG_ISRC_KIND_INJRY;
                break;
            case 보험구분002Enum.보험구분2의료급여:
                // lci사업장.Control = lue사업장;
                // lci정액정률산재진료구분.Control = lue정액정률;

                fg_isrc_kind = _currentChrgDtl.FG_ISRC_KIND_GRNT;
                no_biz_smbl = _currentChrgDtl.NO_WLFR_ORG;
                break;
            case 보험구분002Enum.보험구분3자동차보험:
                // lci사업장.Control = lue사업장;
                // lci정액정률산재진료구분.Control = lue정액정률;

                no_biz_smbl = _currentChrgDtl.CD_ISRC_CMPY;

                // lue사업장.ReadOnly = false;          
                // txt증번호사고번호.ReadOnly = false;  
                break;
            case 보험구분002Enum.보험구분4산업재해:
                // txt산재진료개시일자.ReadOnly = false;

                // lci사업장.Control = txt산재사업장명칭;
                // lci정액정률산재진료구분.Control = lue산재진료구분;
                // lci정액정률산재진료구분.Text = "진료구분";
                // lciTxt요양급여일수.Text = "퇴원약일수";

                // lue산재진료구분.Properties.DataSource = lst산재진료구분.filter(t => t.blCol1 == (e.Chrg_smry.TY_ACCEPT == 청구외래입원Enum.청구외래입원0외래 ? false : true));

                fg_isrc_kind = _currentChrgDtl.FG_ISRC_KIND_INJRY;
                break;
            default:
                break;
        }

        var _ci;
        if (!fg_isrc_kind) {
            _ci = await GetData(`SELECT * FROM T_CHART_INS WHERE CD_CHART = ${_currentChrgDtl.CD_CHART}
        AND DS_APLY <= '${str수납시작일자}' AND FG_ISRC = ${_currentChrgSmry.FG_ISRC} ORDER BY DS_APLY DESC LIMIT 1`);
        } else {
            _ci = await GetData(`SELECT * FROM T_CHART_INS WHERE CD_CHART = ${_currentChrgDtl.CD_CHART}
        AND DS_APLY <= '${str수납시작일자}' AND FG_ISRC = ${_currentChrgSmry.FG_ISRC} AND FG_ISRC_KIND = ${fg_isrc_kind}
        ORDER BY DS_APLY DESC LIMIT 1`);
        }

        var ci = _ci.length == 0 ? undefined : _ci[0];

        if (_currentChrgSmry.FG_ISRC === 보험구분002Enum.보험구분4산업재해) {
            document.getElementById('txt산재사업장명칭').value = _currentChrgDtl.CD_ISRC_CMPY;
            document.getElementById('lue산재진료구분').selectedIndex = _currentChrgDtl.CD_ISRC_CMPY;
            // lue진료결과.Properties.DataSource = lst진료결과_산재;
        } else {
            // lue진료결과.Properties.DataSource = lst진료결과_일반;
        }

        var _doct = await GetData(`SELECT * FROM T_USER WHERE ID_USER = '${_currentAccept.ID_DOCT}'`);
        var doct = _doct[0];

        document.getElementById('txt명일련번호').value = _currentChrgDtl.NO_CHRG_DTL;
        document.getElementById('txt차트번호').value = _currentChrgDtl.CD_CHART;
        document.getElementById('txt환자이름').value = c[0].NM_CHART;
        document.getElementById('txt주민번호').value = '';
        document.getElementById('txt가입자성명').value = ci == undefined ? "" : ci.NM_ISRC_USER;
        document.getElementById('txt보험가입일자').value = ci == undefined ? "" : CommonUtils.ConvertDateStringFormat(ci.DS_APLY, "yyyy-MM-dd");
        document.getElementById('lue보험유형').selectedIndex = _currentChrgSmry.FG_ISRC;
        document.getElementById('lue보험구분').selectedIndex = fg_isrc_kind;
        document.getElementById('lue사업장').selectedIndex = no_biz_smbl;
        document.getElementById('txt증번호사고번호').value = _currentChrgDtl.NO_ISRC_PLCY;
        document.getElementById('txt자보보증번호').value = _currentChrgDtl.NO_PAY_WRRNTY;
        document.getElementById('lue본인부담률').selectedIndex = _currentChrgDtl.TY_CALC_SPCL;
        document.getElementById('lue상해외인').selectedIndex = _currentChrgDtl.TY_INJRY_UNTRL == undefined ? -1 : GetSelectOptionIndex('lue상해외인', _currentChrgDtl.TY_INJRY_UNTRL);
        // document.getElementById('lue나이구분').selectedIndex = _currentAccept.TY_AGE;
        document.getElementById('lue나이구분').selectedIndex = -1;
        document.getElementById('lue정액정률').selectedIndex = _currentChrgDtl.TY_FIXED_AMT_RATE;
        document.getElementById('lue진료결과').selectedIndex = GetSelectOptionIndex('lue진료결과', _currentChrgDtl.FG_TREAT_RSLT);

        // document.getElementById('txt진료과목').value = Get코드정보(코드종류Enum.코드종류202진료과목).filter(function (t) {
        //     return t.코드 === _currentAccept.CD_TREAT_SBJT;
        // })[0].명칭;
        document.getElementById('txt진료과목').value = '정신건강의학과';

        if (doct != null) {
            document.getElementById('txt의사명').value = doct.NM_USER;
            document.getElementById('txt면허번호').value = doct.NO_LCNSE;
        }

        document.getElementById('txt의료급여대불금').value = _currentChrgDtl.MNY_RPLCE_PAY;
        document.getElementById('txt진료시작일').value = FmtTegDate(str수납시작일자);
        document.getElementById('txt진료종료일').value = FmtTegDate(str수납종료일자);
        document.getElementById('txt입원일수').value = _currentChrgDtl.CNT_ACCEPTIN_DAYS;
        document.getElementById('txt요양급여일수').value = _currentChrgDtl.CNT_ISRC_DAYS;
        document.getElementById('txt재해발생').value = _currentChrgDtl.DS_ACCDNT;
        // document.getElementById('txt산재진료개시일자').value = _currentChrgDtl.DS_APLY_ISRC;

        var listTreat = await GetChrgTreatListQuery(_currentChrgDtl);
        var listPrsc = await GetChrgPrscListQuery(_currentChrgDtl);

        document.getElementById('txt처방일수').value = Calc처방일수(listTreat, listPrsc);
        document.getElementById('txt상한초과액').value = _currentChrgDtl.MNY_MXM_EXCD_PTNT;

        document.getElementById('lue청구구분_코드').selectedIndex = _currentChrgDtl.FG_CHRG_SMRY;
        document.getElementById('txt청구구분_접수번호').value = _currentChrgDtl.NO_CHRG_ACCEPT;
        document.getElementById('txt청구구분_일련번호').value = _currentChrgDtl.NO_CHRG_DTL_PREV;
        document.getElementById('lue청구구분_사유코드').selectedIndex = _currentChrgDtl.CD_CHRG_CAUSE;

        // let bLcg청구구분Visibility = true;
        // if (document.getElementById('lue청구구분_코드').value === 청구구분코드Constant.구분00원청구 ||
        //     document.getElementById('lue청구구분_코드').value === 청구구분코드Constant.구분99누락청구) {
        //     bLcg청구구분Visibility = false;
        // }

        document.getElementById('pastDay1').value = FmtTegDate(str수납시작일자);
        document.getElementById('pastDay2').value = FmtTegDate(str수납시작일자);
        Get과거진료내역List(c[0], str수납시작일자);
    }
    catch (error) {
        console.log(error);
    }
}

async function GetChrgTreatListQuery(_currentChrgDtl) {
    var i처방수정구분 = 처방수정구분Enum.FG00등록;
    // 데이터를 필터링하고 정렬하는 함수
    var query = await GetData(`SELECT * FROM T_CHRG_TREAT
    WHERE ID_CHRG_DTL = ${_currentChrgDtl.ID_CHRG_DTL} AND FG_UPDT = ${i처방수정구분} ORDER BY FG_CODE`);

    return query;
}

async function GetChrgPrscListQuery(_currentChrgDtl) {
    var query = await GetData(`SELECT * FROM T_CHRG_PRSC
    WHERE ID_CHRG_DTL = ${_currentChrgDtl.ID_CHRG_DTL} ORDER BY FG_CODE`);

    return query;
}

function Calc처방일수(ListTreat, ListPrsc) {
    var i처방일수 = 0;

    var arrFgCode = [처방코드구분Enum.FG03보험등재약.toString(), 처방코드구분Enum.FG04원료조제약.toString(), 처방코드구분Enum.FG05일반명.toString(), "A"]; // 한방의 경우 약의 코드구분이 "A"임
    var q원내처방 = ListTreat.filter(t => arrFgCode.includes(t.FG_CODE));

    var i원내처방일수 = q원내처방.length > 0 ? q원내처방.Max(t => t.CNT_DOSAGE_DAYS) : 0;
    var i원외처방일수 = ListPrsc.length > 0 ? ListPrsc.Max(t => t.CNT_DOSAGE_DAYS) : 0;

    i처방일수 = i원내처방일수 > i원외처방일수 ? i원내처방일수 : i원외처방일수;

    return i처방일수;
}

function Click_전체내역Checkbox() {
    Refresh명세서특정내역();
    Refresh줄단위특정내역();
    Refresh심사참고();
}

async function Refresh줄단위특정내역(ID_CHRG_DTL, c1, pr) {
    var cd = t_CHRG_DTL[clickIdx];

    // var query_cs = await GetData(`SELECT * FROM T_CHRG_SPCL
    // WHERE ID_CHRG_SMRY = ${cd.ID_CHRG_SMRY} AND FG_UPDT = ${처방수정구분Enum.FG00등록}`);
    // console.log(query_cs);

    var b발생단위 = 0;
    var _ID = 0;

    if (t_CHRG_TREAT != undefined) {
        b발생단위 = 2; // Assume that 특정내역발생단위Enum.TY02진료줄단위 is 2
        _ID = t_CHRG_TREAT.ID_CHRG_TREAT;
    } else if (pr != null) {
        b발생단위 = 3; // Assume that 특정내역발생단위Enum.TY03처방줄단위 is 3
        _ID = pr.ID_CHRG_PRSC;
    }

    // query_cs = query_cs.filter(t => t.FG_BRTH_UNIT === '1' && t.ID_CHRG_TREAT === _ID); // Assume that _current_발생단위 is defined elsewhere
    // console.log(query_cs);

    var query;
    query = await GetData(`SELECT 
    sc.FG_BRTH_UNIT,
    sc.CD_SPCL_CODE,
    sc.NM_SPCL_CODE,
    COALESCE(m.DC_SPCL, '') AS DC_SPCL,
    COALESCE(m.NO_PRSCRPTN_DLVRY, '') AS NO_PRSCRPTN_DLVRY,
    sc.DC_STTMNT_TYPE,
    ${cd.ID_CHRG_DTL} AS ID_CHRG_DTL,
    ${cd.ID_CHRG_SMRY} AS ID_CHRG_SMRY,
    ${cd.CD_CHART} AS CD_CHART,
    COALESCE(m.ID_CHRG_SPCL, 0) AS ID_CHRG_SPCL,
    ${_ID} AS ID_CHRG_TREAT,
    COALESCE(m.NO_LINE, 0) AS NO_LINE
FROM 
    T_SPCL_CODE sc
LEFT JOIN 
    (SELECT * FROM T_CHRG_SPCL WHERE ID_CHRG_DTL = ${cd.ID_CHRG_DTL} AND ID_CHRG_TREAT = ${_ID} AND FG_UPDT = ${처방수정구분Enum.FG00등록}) m
    ON sc.CD_SPCL_CODE = m.CD_SPCL_CODE
WHERE 
    sc.FG_BRTH_UNIT = ${b발생단위}
ORDER BY 
    COALESCE(m.CD_SPCL_CODE, '') DESC, 
    sc.CD_SPCL_CODE ASC, 
    COALESCE(m.ID_CHRG_SPCL, 0)`);

    RefreshTable('grd줄단위특정내역');

    for (let i = 0; i < query.length; i++) {
        if (document.getElementById('isChecked전체보기').checked || query[i].DC_SPCL !== '') {
            let html = '';
            html += `<tr>`;
            html += `<td>${i + 1}</td>`;
            html += `<td>${query[i].CD_SPCL_CODE}</td>`;
            html += `<td>${query[i].NM_SPCL_CODE}</td>`;
            html += `<td title="${query[i].DC_SPCL}"><input type="text" style="width: 99%; background-color: white; text-align: center; border: none;" ${SetJson(query[i])} value="${query[i].DC_SPCL}"
                      onkeyup="if(window.event.keyCode==13){Click특정내역(this, value, t_CHRG_TREAT)}"></td>`;
            html += CreateTableTd(query[i].DC_STTMNT_TYPE, 25);
            html += `</tr>`;
            $("#grd줄단위특정내역").append(html);
        }
    }
}

async function Insert처방묶음(obj) {
    var tr = document.getElementById('grd심사청구대상자').getElementsByTagName('tr');
    var json = GetJson(tr[clickIdx]);

    var arrayBufferData = new Uint8Array(json.XML_CHRG_BYTE.data).buffer;
    // ArrayBuffer를 문자열로 디코딩
    var decodedString = new TextDecoder().decode(arrayBufferData);
    var _진료비영수증 = JSON.parse(decodedString);
    var worker = new 청구명세서생성Worker();

    var lst = {
        b요양급여포함: obj.b요양급여포함,
        검사구분SumBits: obj.검사구분SumBits,
        급여적용: obj.급여적용 == '급여' ? '0' : '2',
        단가: obj.단가,
        단가검진단가: obj.단가검진단가,
        단가급여적용: obj.단가급여적용,
        단가보험단가: obj.단가보험단가,
        단가사용장려비: obj.단가사용장려비,
        단가산재급여: obj.단가산재급여,
        단가산재단가: obj.단가산재단가,
        단가상대가치점수: obj.단가상대가치점수,
        단가일반단가: obj.단가일반단가,
        단가자보급여: obj.단가자보급여,
        단가자보단가: obj.단가자보단가,
        단가적용일자: obj.단가적용일자,
        등록구분: obj.등록구분,
        영문명칭: obj.영문명칭,
        예외구분: obj.예외구분,
        용법코드: obj.용법코드,
        용법코드들: obj.용법코드들,
        원외구분: obj.원외구분,
        위탁구분: obj.위탁구분,
        위탁기관ID: obj.위탁기관ID,
        의사사인: obj.의사사인,
        입원료상세구분: obj.입원료상세구분,
        적용일자: obj.적용일자,
        접수번호: obj.접수번호,
        지원코드: obj.지원코드,
        진료번호: obj.진료번호,
        진료일자: obj.진료일자,
        집계구분: obj.집계구분,
        챠트번호: obj.챠트번호,
        처방알림: obj.처방알림,
        처방코드: obj.처방코드,
        청구코드: obj.청구코드,
        코드구분: obj.코드구분,
        코드단가적용: obj.코드단가적용,
        투여량1회: obj.투여량1회,
        투여일수: obj.투여일수,
        투여횟수: obj.투여횟수,
        특정코드: obj.특정코드,
        표시명칭: obj.표시명칭,
        한글명칭: obj.한글명칭,
        항목구분: obj.항목구분,
        행위구분: obj.행위구분
    }

    if (obj.원외구분 == '0') {
        _진료비영수증._list진료처방[0] = [];
        _진료비영수증._list진료처방[0].push(lst);
        await worker.CreateChrgTreat(_진료비영수증, t_CHRG_DTL[clickIdx], 0);
    }
    else {
        _진료비영수증._list진료처방원외[0] = [];
        _진료비영수증._list진료처방원외[0].push(lst);

        await worker.CreateChrgPrsc(_진료비영수증, t_CHRG_DTL[clickIdx]);
    }

    청구재계산및Refresh항목별금액(t_CHRG_DTL[clickIdx].ID_CHRG_DTL, false, true);
}

async function Create상병Table(obj) {
    var tr = document.getElementById('grd심사청구대상자').getElementsByTagName('tr');
    var json = GetJson(tr[clickIdx]);

    var arrayBufferData = new Uint8Array(json.XML_CHRG_BYTE.data).buffer;
    // ArrayBuffer를 문자열로 디코딩
    var decodedString = new TextDecoder().decode(arrayBufferData);
    var _진료비영수증 = JSON.parse(decodedString);
    var _currentAccept = _진료비영수증._ac;
    if (_진료비영수증 == undefined) {
        return;
    }

    var _기준일자 = fmtTodayDay;
    var _수납시작일자 = _진료비영수증.수납시작일자;
    var list = await GetData(`SELECT * FROM T_CHRG_DX WHERE NO_CHRG_SMRY = '${t_CHRG_DTL[clickIdx].NO_CHRG_SMRY}' AND NO_CHRG_DTL = '${t_CHRG_DTL[clickIdx].NO_CHRG_DTL}'`);
    var cd_dx = obj.상병코드;
    if (list.find(t => t.CD_DX === cd_dx) !== undefined) {
        alert(`중복상병\n이미 존재하는 상병코드(${cd_dx})입니다.`)
        return;
    }

    var newrow = new T_CHRG_DX();

    newrow.FG_SECTION = "B";
    newrow.DS_TREAT = _수납시작일자;
    newrow.DS_TREAT_START = _수납시작일자;
    newrow.CD_CHART = _currentAccept.CD_CHART;
    newrow.NO_DX_ORDER = list.length; // 상병번호 따기
    newrow.CD_DX = cd_dx;
    newrow.NM_DX_ENG = obj.영문명칭;
    newrow.CD_SPCL_SMBL = obj.특정기호;
    newrow.NM_DX_HAN = obj.한글명칭;

    if (newrow.NM_DX_HAN == null && obj.표시명칭)
        newrow.NM_DX_HAN = obj.표시명칭;

    if (list.length === 0) {
        if (_db.T_DX_INFO.find(t => t.CD_DX === newrow.CD_DX && t.BL_DX_MAIN_USE === false) === undefined) {
            newrow.BL_DX_MAIN = true;
        }
    }

    newrow.CD_TREAT_SBJT = '03';
    newrow.CD_TREAT_SBJT_IN = "";
    // newrow.ID_UPDT = _사용자정보.사용자ID;
    newrow.DT_UPDT = fmtTodaySec;

    // if (_사용자정보.직분구분 === 직분구분Enum.FG00의사) {
    //     newrow.SGN_DOCTOR = _사용자정보.사용자ID;
    // } else {
    //     if (_current_T_CHRG_SMRY.TY_ACCEPT === 청구외래입원Enum.청구외래입원0외래) {
    //         newrow.SGN_DOCTOR = _currentAccept.ID_DOCT;
    //     } else {
    //         let q = _db.T_INCHANGE.filter(t => t.ID_ACCEPTIN === _currentAcceptIn.ID_ACCEPTIN && t.BL_DEL === false && t.DS_INCHANGE <= _기준일자).sort((a, b) => new Date(b.DS_INCHANGE) - new Date(a.DS_INCHANGE)).shift();

    //         if (q !== null) {
    //             newrow.SGN_DOCTOR = q.ID_DOCT;
    //         } else {
    //             newrow.SGN_DOCTOR = _db.T_ACCEPT.find(t => t.NO_ACCEPT === _currentAcceptIn.NO_ACCEPT).ID_DOCT;
    //         }
    //     }
    // }

    newrow.NO_CHRG_SMRY = t_CHRG_DTL[clickIdx].NO_CHRG_SMRY;
    newrow.NO_CHRG_DTL = t_CHRG_DTL[clickIdx].NO_CHRG_DTL;
    newrow.ID_CHRG_DTL = t_CHRG_DTL[clickIdx].ID_CHRG_DTL;
    newrow.ID_CHRG_SMRY = t_CHRG_DTL[clickIdx].ID_CHRG_SMRY;

    newrow.BL_DOUBT = false;
    newrow.BL_LEFT = false;
    newrow.BL_RIGHT = false;

    newrow.TY_INJRY_UNTRL = "";

    Check주상병특정기호(newrow, _currentAccept);

    if (newrow.BL_DX_MAIN) {
        newrow.FG_DX_KIND = 1;
        newrow.TY_LCNSE = _current양한방구분 === 양한방구분Enum.양한방구분Enum0양방 ? "1" : "3";
        // newrow.NO_LCNSE = 사용자정보ViewModel.instance().Get사용자정보(_db, newrow.SGN_DOCTOR).면허번호;
    } else {
        newrow.FG_DX_KIND = 2;

        newrow.TY_LCNSE = "";
        newrow.NO_LCNSE = "";
    }

    await Set_CreatePostData('T_CHRG_DX', newrow);

    var 상병내역 = await Get상병내역ListQuery();
    Refresh상병내역(상병내역);
}

function Check주상병특정기호(newrow, _currentAccept) {
    if (newrow.BL_DX_MAIN) {
        let _특정기호 = newrow.CD_SPCL_SMBL;

        if (_currentAccept.CD_SPCF_SMBL !== _특정기호) {
            if (_currentAccept.CD_SPCF_SMBL === null || _currentAccept.CD_SPCF_SMBL === "") {
                if (confirm(`[특정기호 설정]\접수정보에 특정기호 [${_특정기호}]를 등록 하시겠습니까?`) == false) {
                    _특정기호 = "";
                }
            } else {
                if (confirm(`[특정기호 변경]\접수정보에 이미 설정된 특정기호가 존재합니다\n특정기호를 [${_currentAccept.CD_SPCF_SMBL}]에서 [${_특정기호}]로 변경 하시겠습니까?`) == false) {
                    _특정기호 = _currentAccept.CD_SPCF_SMBL;
                }
            }

            // 산정특례구분 구하기
            let v산정특례구분 = Get산정특례구분by특정기호(currentAccept.FG_ISRC, _currentAccept.FG_ISRC_KIND, _currentAccept.DS_TREAT, _특정기호);

            switch (v산정특례구분) {
                case -2: // V161_정신질환자가해당상병_F20_F29_으로진료를받은당일 설정 불가 -> 특정기호 빼 주어야 함.                    
                    alert('[확인요청]\n해당 특정기호는 의료급여환자의 경우 2종 외래진료의 경우만 적용 가능합니다.\n특정기호를 해제합니다.');
                    _특정기호 = "";
                    v산정특례구분 = 0;
                    break;
                case -1: // F015_임신부외래진료 설정불가. -> 임신부구분 False로 설정해 주어야 함
                    _currentAccept.BL_PRGNT = false;
                    v산정특례구분 = _currentAccept.TY_CALC_SPCL;
                    break;
                default:
                    break;
            }

            _currentAccept.CD_SPCF_SMBL = _특정기호;
            _currentAccept.TY_CALC_SPCL = v산정특례구분;
        }
    }
}

async function ClickRight상병내역() {
    var json = GetJson(rightMouseTr);

    if (confirm(`코드[${json.CD_DX}]을 삭제 하시겠습니까?`) == false) {
        return;
    }

    await Set_DeletePostData('T_CHRG_DX', json);

    var 상병내역 = await Get상병내역ListQuery();
    Refresh상병내역(상병내역);
}

//#region 처방내역
async function M_viewsubject_SelectChanged청구명세서(진료비영수증) {
    var _current_T_CHRG_DTL = t_CHRG_DTL;
    var _current_T_CHRG_SMRY = t_CHRG_SMRY;
    var _current양한방구분 = 양한방구분Enum.양한방구분Enum0양방;
    var _진료비영수증;

    if (_current_T_CHRG_DTL == undefined) {
        return;
    }

    _진료비영수증 = 진료비영수증;
    _currentAccept = _진료비영수증._ac;
    var en진료형태 = _진료비영수증._en외래입원구분;
    var _보험구분 = _currentAccept.FG_ISRC;
    var _보험종별구분 = _currentAccept.FG_ISRC_KIND;

    // lue청구진료코드구분.DataSource = lst청구진료코드구분_양방;

    // gv원내집계.Columns[T_CHRG_TREAT_FieldConstant.FG_MDFCTN_한방가감등구분].Visible = false;

    원내집계 = await Get진료처방ListQuery(처방수정구분Enum.FG00등록);
    삭제내역 = await Get진료처방ListQuery(처방수정구분Enum.FG01삭제);
    원외집계 = await Get원외처방ListQuery(_current_T_CHRG_DTL, 처방수정구분Enum.FG00등록);
    var 원외집계삭제 = await Get원외처방ListQuery(_current_T_CHRG_DTL, 처방수정구분Enum.FG01삭제);
    var 상병내역 = await Get상병내역ListQuery();

    RefreshTable('treatmentHistoryList', true);
    RefreshTable('treatmentHistoryList1');
    Refesh원내처방삭제(원내집계);
    Refesh원내처방삭제(삭제내역);

    Refresh원외처방(원외집계);
    Refesh원내처방삭제(원외집계삭제)
    Refresh상병내역(상병내역);

    Refresh과거청구목록();
}

async function Refesh원내처방삭제(t_treat) {
    try {
        var table = document.getElementById('treatmentHistoryList');
        // var table1 = document.getElementById('treatmentHistoryList1');        
        var trs;

        for (let i = 0; i < t_treat.length; i++) {
            trs = table.getElementsByTagName('tr');
            var html = '';
            var 수정구분 = t_treat[i].수정구분 != undefined ? t_treat[i].수정구분 : t_treat[i].FG_UPDT
            html += `<tr value = "${수정구분}" ${SetJson(t_treat[i])} style="border: none;" onclick="Click처방내역(this)">`;
            html += `<td style="border-left: none;"></td>`;
            html += `<td>${i + 1}</td>`;
            var 처방코드 = t_treat[i].처방코드 != undefined ? t_treat[i].처방코드 : t_treat[i].CD_CHRG;
            html += `<td title="${처방코드}">${TableSubstring(처방코드, 20)}</td>`;
            var 표시명칭 = t_treat[i].표시명칭 != undefined ? t_treat[i].표시명칭 : t_treat[i].NM_DSPLY;
            html += `<td title="${표시명칭}">${TableSubstring(표시명칭, 20)}</td>`;
            html += `<td><input type="number" value="${t_treat[i].투여량1회 != undefined ? t_treat[i].투여량1회 : t_treat[i].AMT_DOSAGE_1TH}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
            html += `<td><input type="number" value="${t_treat[i].투여횟수 != undefined ? t_treat[i].투여횟수 : t_treat[i].CNT_DOSAGE}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
            html += `<td><input type="number" value="${t_treat[i].투여일수 != undefined ? t_treat[i].투여일수 : t_treat[i].CNT_DOSAGE_DAYS}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
            var 단가 = t_treat[i].단가 != undefined ? t_treat[i].단가 : '';
            html += `<td title="${단가}">${단가}</td>`;
            var select4 = DoctorSelectCreate(t_treat[i].의사사인 != undefined ? t_treat[i].의사사인 : -1, `t_treat의사사인${i}`);
            html += `<td>${select4.outerHTML}</td>`;
            html += `</tr>`;
            try {
                var td = trs[trs.length - 1].getElementsByTagName('td');
                if (t_treat[i].처방번호 != td[1].innerHTML) {
                    if (수정구분 == 처방수정구분Enum.FG00등록) {
                        $("#treatmentHistoryList").append(html);
                    }
                    else if (수정구분 == 처방수정구분Enum.FG01삭제) {
                        $("#treatmentHistoryList1").append(html);
                    }
                }
            } catch (error) {
                if (수정구분 == 처방수정구분Enum.FG00등록) {
                    $("#treatmentHistoryList").append(html);
                }
                else if (수정구분 == 처방수정구분Enum.FG01삭제) {
                    $("#treatmentHistoryList1").append(html);
                } else {
                    $("#treatmentHistoryList").append(html);
                }
            }

            document.getElementById(select4.id).selectedIndex = parseInt(t_treat[i].의사사인);

        }
    } catch (error) {
        console.log(error);
    }
}

function Click처방내역(target) {
    ComnTbClick(target);

    var json = GetJson(target);
    if (json.ID_CHRG_TREAT != undefined) {
        t_CHRG_TREAT = json;
    }

    Refresh줄단위특정내역();
}

async function Get원외처방ListQuery(_current_T_CHRG_DTL, en처방수정구분) {
    var query = await GetData(`SELECT * FROM T_CHRG_PRSC
    WHERE NO_CHRG_DTL = ${t_CHRG_DTL[clickIdx].NO_CHRG_DTL} AND NO_CHRG_SMRY = ${t_CHRG_DTL[clickIdx].NO_CHRG_SMRY}
    AND FG_UPDT = ${en처방수정구분} ORDER BY NO_LINE`);
    return query;
}

function T_CHRG_TREAT_Eng(json) {
    var treat = new T_CHRG_TREAT();
    treat.DC = json.DC;
    treat.DS_TREAT_START = json.처방시작일자;
    treat.DS_TREAT_END = json.처방종료일자;
    treat.CD_CHRG = json.처방코드;
    treat.CD_CHRG = json.청구코드;
    treat.NM_DSPLY = json.표시명칭;
    treat.AMT_DOSAGE_1TH = json.투여량1회;
    treat.CNT_DOSAGE = json.투여횟수;
    treat.CNT_DOSAGE_DAYS = json.투여일수;
    treat.FG_OUTSIDE = json.원외구분;
    treat.MNY_UNPRC = json.단가;
    treat.DS_APLY = json.적용일자;
    treat.FG_ITEM = json.항목구분;
    treat.FG_ACTN = json.행위구분;
    treat.DS_TREAT = json.진료일자;
    treat.TY_PAY_APLY = json.급여적용;
    treat.CD_SPCL = json.특정코드;
    treat.FG_UPDT = json.수정구분;
    treat.ID_UPDT = json.수정자;
    treat.DT_UPDT = json.수정일자;
    treat.RT_ADTN_ACTN = json.RT_ADTN_ACTN;
    treat.FG_CODE = json.청구코드구분;
    treat.NO_CHRG_DTL = json.코드번호;
    treat.DS_TREAT_START = json.시작일;
    treat.DS_TREAT_END = json.종료일;
    treat.ID_CHRG_TREAT = json.ID_CHRG_TREAT.toString();

    return treat;
}

function Refresh원외처방(query) {
    RefreshTable('treatmentHistoryList2');

    for (let i = 0; i < query.length; i++) {
        html = '';
        html += `<tr ${SetJson(query[i])}>`;
        html += `<td>${i + 1}</td> `;
        html += CreateTableTd(query[i].NO_CHRG_SMRY, false);
        html += CreateTableTd(query[i].FG_CODE, false);
        html += CreateTableTd(query[i].CD_CHRG, false);
        html += CreateTableTd(query[i].NM_DSPLY, 30);
        html += CreateTableTd(query[i].AMT_DOSAGE_1TH, false);
        html += CreateTableTd(query[i].CNT_DOSAGE, false);
        html += CreateTableTd(query[i].CNT_PRSC_DAYS, false);
        html += CreateTableTd(query[i].CNT_DOSAGE_DAYS, false);
        html += '';
        html += '</tr>';
        $("#treatmentHistoryList2").append(html);
    }
}

async function ClickRight처방삭제(remove) {
    var json = GetJson(rightMouseTr);
    console.log(json);
    if (remove == 1) {
        if (confirm(`선택하신 처방코드[${json.처방코드 != undefined ? json.처방코드 : json.CD_CHRG}]를 삭제 하시겠습니까?`) == false) {
            return;
        }
    }
    var treat;
    if (json.처방코드 != undefined) {
        treat = T_CHRG_TREAT_Eng(json);
        treat.FG_UPDT = remove;
        treat.DT_UPDT = fmtTodaySec;
        await Set_UpdatePostData('T_CHRG_TREAT', treat);
    }
    else {
        treat = json;
        treat.FG_UPDT = remove;
        await Set_UpdatePostData('T_CHRG_PRSC', treat);
    }


    청구재계산및Refresh항목별금액(json.ID_CHRG_DTL, false, true);
}

// async function InitTable(t_treat, isAdd = false) {
//     var table = document.getElementById('treatmentHistoryList');
//     var table1 = document.getElementById('treatmentHistoryList1');
//     var rowCount = table.rows.length;
//     var trs;
//     if (!isAdd) {
//         // 테이블의 첫 번째 행은 헤더입니다. 이를 제외한 모든 행을 삭제합니다.
//         for (var i = rowCount - 1; i > 0; i--) {
//             table.deleteRow(i);
//         }
//         rowCount = table.rows.length;

//         while (table1.firstChild) {
//             table1.removeChild(table1.firstChild);
//         }
//     }

//     // if (!isAdd) {
//     //     diagTalbeList = t_treat;
//     // }

//     console.log(t_treat);
//     for (let i = 0; i < t_treat.length; i++) {
//         var lst = t_treat[i].처방번호 == undefined ? 1 : t_treat[i].처방번호 == '0' ? '1' : t_treat[i].처방번호;
//         // if (lst >= rowCount) {
//             trs = table.getElementsByTagName('tr');
//             var html = '';
//             html += `<tr value = "${t_treat[i].수정구분}" style="border: none;">`;
//             html += `<td style="border-left: none;"></td>`;
//             html += `<td>${i+1}</td>`;
//             html += `<td title="${t_treat[i].처방코드}">${TableSubstring(t_treat[i].처방코드)}</td>`;
//             html += `<td title="${t_treat[i].표시명칭}">${TableSubstring(t_treat[i].표시명칭)}</td>`;
//             html += `<td><input type="number" value="${t_treat[i].투여량1회}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
//             html += `<td><input type="number" value="${t_treat[i].투여횟수}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
//             html += `<td><input type="number" value="${t_treat[i].투여일수}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
//             html += `<td><select style="width: 98%; background-color: white;"></select></td>`;
//             html += `<td><input type="checkbox"${t_treat[i].원외구분 == undefined || t_treat[i].원외구분 == 0 ? '' : 'checked'}></td>`;
//             html += `<td><input type="checkbox"${t_treat[i].파우더 == undefined || t_treat[i].파우더 == 0 ? '' : 'checked'}></td>`;
//             html += `<td><input type="number" value="${t_treat[i].믹스구분}" style="width: 25px; background-color: white; text-align: center; border: none;"></td>`;
//             var select3 = await SelectCreate(tDTableSelect3, `t_treat예외구분${i}`);
//             html += `<td>${select3.outerHTML}</td>`;
//             var memo = t_treat[i].메모 == undefined ? 1 : t_treat[i].메모
//             html += `<td title="${memo}"><input type="text" style="border: none;" value ="${memo}"></td>`;
//             var select2 = await SelectCreate(tDTableSelect2, `t_treat집계구분${i}`);
//             html += `<td>${select2.outerHTML}</td>`;
//             var select1 = await SelectCreate(tDTableSelect1, `t_treat급여적용${i}`);
//             html += `<td>${select1.outerHTML}</td>`;
//             html += `<td title="${t_treat[i].단가}">${t_treat[i].단가}</td>`;
//             var select4 = DoctorSelectCreate(t_treat[i].의사사인, `t_treat의사사인${i}`);
//             html += `<td>${select4.outerHTML}</td>`;
//             html += `</tr>`;
//             try {
//                 var td = trs[trs.length - 1].getElementsByTagName('td');
//                 if (t_treat[i].처방번호 != td[1].innerHTML) {
//                     if (t_treat[i].수정구분 == 처방수정구분Enum.FG00등록) {
//                         $("#treatmentHistoryList").append(html);
//                     }
//                     else if (t_treat[i].수정구분 == 처방수정구분Enum.FG01삭제) {
//                         $("#treatmentHistoryList1").append(html);
//                     }
//                 }
//             } catch (error) {
//                if (t_treat[i].수정구분 == 처방수정구분Enum.FG00등록) {
//                     $("#treatmentHistoryList").append(html);
//                 }
//                 else if (t_treat[i].수정구분 == 처방수정구분Enum.FG01삭제) {
//                     $("#treatmentHistoryList1").append(html);
//                 } else {
//                     $("#treatmentHistoryList").append(html);
//                 }
//             }

//             document.getElementById(select3.id).selectedIndex = GetSelectOptionIndex(select3.id, t_treat[i].예외구분);
//             document.getElementById(select2.id).selectedIndex = parseInt(t_treat[i].집계구분);
//             document.getElementById(select1.id).selectedIndex = parseInt(t_treat[i].급여적용);
//             document.getElementById(select1.id).selectedIndex = parseInt(t_treat[i].급여적용);
//             document.getElementById(select4.id).selectedIndex = parseInt(t_treat[i].의사사인);
//         // }
//     }
// }
//#endregion

//#region 진료상병
async function Get상병내역ListQuery(_current_T_CHRG_DTL) {
    var query = await GetData(`SELECT * FROM T_CHRG_DX WHERE NO_CHRG_DTL = ${t_CHRG_DTL[clickIdx].NO_CHRG_DTL}
    AND ID_CHRG_SMRY = ${t_CHRG_DTL[clickIdx].ID_CHRG_SMRY} ORDER BY FG_DX_KIND ASC, NO_DX_ORDER ASC`);

    return query;
}

async function Refresh상병내역(t_treatDX) {
    var table = document.getElementById('diseaseCodeList');
    var rowCount = table.rows.length;
    let str;
    treatDXList = null;
    treatDXList = t_treatDX;
    // 테이블의 첫 번째 행은 헤더입니다. 이를 제외한 모든 행을 삭제합니다.
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    for (let i = 0; i < treatDXList.length; i++) {
        var html = '';
        html += `<tr ${SetJson(treatDXList[i])}>`;
        html += '<td></td>';
        html += '<td>' + treatDXList[i].CD_DX + '</td>';
        html += '<td>' + treatDXList[i].NM_DX_HAN + '</td>';
        str = treatDXList[i].BL_DX_MAIN == true ? '주상병' : '부상병';
        html += '<td>' + str + '</td>';
        $("#diseaseCodeList").append(html);
    }
}
//#endregion

//#region 전월청구내역
async function Refresh과거청구목록() {
    var query = await GetData(`SELECT * FROM T_CHRG_DTL WHERE CD_CHART = ${t_CHRG_DTL[clickIdx].CD_CHART} AND NO_CHRG_SMRY != ${t_CHRG_DTL[clickIdx].NO_CHRG_SMRY}`);

    for (let i = 0; i < query.length; i++) {
        selectEl = document.querySelector(`#lue전월심사내역`);
        objOption = document.createElement("option");
        objOption.text = `${query[i].NO_CHRG_SMRY}`;
        objOption.setAttribute('editvalue', JSON.stringify(query[i]));
        selectEl.options.add(objOption);
    }

    document.getElementById('lue전월심사내역').selectedIndex = -1;
}

async function ClickOption전월심사내역() {
    var dtl = JSON.parse(GetSelcetEditValue('lue전월심사내역'));

    var lst = await Get진료처방ListQuery(dtl);

    RefreshTable('grd전월심사내역');
    for (let i = 0; i < lst.length; i++) {
        html = '';
        html += `<tr>`;
        html += CreateTableTd(lst[i].코드번호);
        html += CreateTableTd(lst[i].처방코드, 7);
        html += CreateTableTd(lst[i].표시명칭, 50);
        html += CreateTableTd(lst[i].투여량1회);
        html += CreateTableTd(lst[i].투여횟수);
        html += CreateTableTd(lst[i].투여일수);
        html += CreateTableTd(lst[i].단가, 20);
        html += CreateTableTd(lst[i].시작일, 10);
        html += CreateTableTd(lst[i].종료일, 10);
        html += `</tr>`;
        $("#grd전월심사내역").append(html);
    }
}

async function Get과거심사내역ListQuery(dtl) {
    var query = await GetData(`SELECT * FROM T_CHRG_TREAT WHERE ID_CHRG_SMRY = ${dtl.ID_CHRG_SMRY}  AND NO_CHRG_DTL = ${dtl.NO_CHRG_DTL}
                 AND FG_UPDT = ${처방수정구분Enum.FG00등록} ORDER BY NO_LINE`);
    return query;
}
//#endregion

//#region 명세서특정내역
async function Refresh명세서특정내역() {
    var cd = t_CHRG_DTL[clickIdx];

    if (cd == undefined) {
        return
    }

    var query;
    if (document.getElementById('isChecked전체보기').checked) {
        query = await GetData(`SELECT 
        sc.FG_BRTH_UNIT, 
        sc.CD_SPCL_CODE, 
        sc.NM_SPCL_CODE,
        COALESCE(m.DC_SPCL, '') AS DC_SPCL,
        COALESCE(m.NO_PRSCRPTN_DLVRY, '') AS NO_PRSCRPTN_DLVRY,
        sc.DC_STTMNT_TYPE, 
        ${cd.ID_CHRG_DTL} AS ID_CHRG_DTL,
        ${cd.ID_CHRG_SMRY} AS ID_CHRG_SMRY,
        ${cd.CD_CHART} AS CD_CHART,
        COALESCE(m.ID_CHRG_SPCL, 0) AS ID_CHRG_SPCL,
        0 AS ID_CHRG_TREAT,
        COALESCE(m.NO_LINE, 0) AS NO_LINE
    FROM 
        T_SPCL_CODE sc
    LEFT JOIN 
        (
            SELECT ID_CHRG_SPCL, CD_SPCL_CODE, DC_SPCL, NO_PRSCRPTN_DLVRY, NO_LINE
            FROM T_CHRG_SPCL 
            WHERE ID_CHRG_SMRY = ${cd.ID_CHRG_SMRY}
            AND NO_CHRG_DTL = ${cd.NO_CHRG_DTL}
            AND FG_UPDT = ${처방수정구분Enum.FG00등록}
        ) m 
        ON sc.CD_SPCL_CODE = m.CD_SPCL_CODE
    WHERE 
        sc.FG_BRTH_UNIT = ${특정내역발생단위Enum.TY01명세단위}
    ORDER BY 
        COALESCE(m.CD_SPCL_CODE, '') DESC, 
        sc.CD_SPCL_CODE ASC, 
        COALESCE(m.ID_CHRG_SPCL, 0)`);
    } else {
        query = await GetData(`SELECT 
    sc.FG_BRTH_UNIT, 
    sc.CD_SPCL_CODE, 
    sc.NM_SPCL_CODE,
    COALESCE(m.DC_SPCL, '') AS DC_SPCL,
    COALESCE(m.NO_PRSCRPTN_DLVRY, '') AS NO_PRSCRPTN_DLVRY,
    sc.DC_STTMNT_TYPE, 
    ${cd.ID_CHRG_DTL} AS ID_CHRG_DTL,
    ${cd.ID_CHRG_SMRY} AS ID_CHRG_SMRY,
    ${cd.CD_CHART} AS CD_CHART,
    COALESCE(m.ID_CHRG_SPCL, 0) AS ID_CHRG_SPCL,
    0 AS ID_CHRG_TREAT,
    COALESCE(m.NO_LINE, 0) AS NO_LINE
    FROM 
        T_SPCL_CODE sc
    JOIN 
        (
            SELECT * 
            FROM T_CHRG_SPCL 
            WHERE ID_CHRG_SMRY = ${cd.ID_CHRG_SMRY} 
            AND NO_CHRG_DTL = ${cd.NO_CHRG_DTL} 
            AND FG_UPDT = ${처방수정구분Enum.FG00등록}
        ) m 
        ON sc.CD_SPCL_CODE = m.CD_SPCL_CODE
    WHERE 
        sc.FG_BRTH_UNIT = ${특정내역발생단위Enum.TY01명세단위}
    ORDER BY 
        m.CD_SPCL_CODE DESC, 
        sc.CD_SPCL_CODE ASC, 
        m.ID_CHRG_SPCL`);
    }

    RefreshTable('grd명세서특정내역');
    for (let i = 0; i < query.length; i++) {
        html = '';
        html += `<tr>`;
        html += `<td>${i + 1}</td> `;
        html += `<td> ${query[i].CD_SPCL_CODE}</td> `;
        html += `<td> ${query[i].NM_SPCL_CODE}</td> `;
        html += `<td title = "${query[i].DC_SPCL}"><input type="text" style = "width : 99%; background-color: white; text-align: center; border: none;" ${SetJson(query[i])} value ="${query[i].DC_SPCL}"
        onkeyup="if(window.event.keyCode==13){Click특정내역(this, value)}"></td>`
        html += CreateTableTd(query[i].DC_STTMNT_TYPE, 25);
        html += '</tr>';
        $("#grd명세서특정내역").append(html);
    }
}

function Click특정내역(target, value, treat = undefined) {
    var json = GetJson(target);

    Click심사참고('save', json.CD_SPCL_CODE, value, false, json.ID_CHRG_SPCL, treat);
}

function ClickRight특정내역(name) {
    var td = rightMouseTr.getElementsByTagName('td');
    var input = td[3].getElementsByTagName('input');
    var value = input[0].value;
    var json = GetJson(input[0]);

    Click심사참고(name, td[1].innerHTML.replace(/\s+/g, ''), value, true, json.ID_CHRG_SPCL);
}
//#endregion

//#region 심사참고사항
async function Refresh심사참고() {
    $('ul.toggleTabs2 li').removeClass('current');
    $('.toggleTab2-content').removeClass('current');

    $('ul.toggleTabs2 li:first-child').addClass('current');
    $('.toggleTab2-content:first-child').addClass('current');

    var cs = await GetData(`SELECT * FROM T_CHRG_SPCL WHERE ID_CHRG_SMRY = ${t_CHRG_DTL[clickIdx].ID_CHRG_SMRY} AND NO_CHRG_DTL = ${t_CHRG_DTL[clickIdx].NO_CHRG_DTL}
    AND CD_SPCL_CODE = '${CdSpclCodeConstant.MX999_기타내역}' ORDER BY ID_CHRG_SPCL LIMIT 1`);

    if (cs.length > 0) {
        document.getElementById('memo심사참고사항').value = cs[0].DC_SPCL;
    }
}

async function Click심사참고(name, CD_SPCL_CODE = undefined, DC_SPCL = undefined, rightMenu = false, ID_CHRG_SPCL = undefined, treat = undefined) {
    if (t_CHRG_DTL[clickIdx] == undefined) {
        return;
    }

    var cd_spcl_code;
    if (CD_SPCL_CODE == undefined) {
        cd_spcl_code = CdSpclCodeConstant.MX999_기타내역; // CdSpclCodeConstant.MX999_기타내역에 해당
    }
    else {
        cd_spcl_code = CD_SPCL_CODE;
    }

    var cs;
    if (ID_CHRG_SPCL == undefined) {
        cs = await GetData(`SELECT * FROM T_CHRG_SPCL WHERE ID_CHRG_SMRY = ${t_CHRG_DTL[clickIdx].ID_CHRG_SMRY} AND NO_CHRG_DTL = ${t_CHRG_DTL[clickIdx].NO_CHRG_DTL}
        AND CD_SPCL_CODE = '${cd_spcl_code}' ORDER BY ID_CHRG_SPCL LIMIT 1`);
    }
    else {
        cs = await GetData(`SELECT * FROM T_CHRG_SPCL WHERE ID_CHRG_SPCL = ${ID_CHRG_SPCL} ORDER BY ID_CHRG_SPCL LIMIT 1`);
    }

    switch (name) {
        case 'save':
            var memoText = document.getElementById('memo심사참고사항').value;

            if (document.getElementById('memo심사참고사항').value.length > 750) {
                alert('심사참고사항\n제한된 길이(영문700자 한글 350자)를 초과하였습니다.')
                return;
            }
            var dc_spcl;
            if (DC_SPCL == undefined) {
                dc_spcl = memoText;
            }
            else {
                dc_spcl = DC_SPCL;
            }

            var 특정내역 = new 특정내역VM();
            if (cs.length <= 0) {
                await 특정내역.Create특정내역_청구심사(cd_spcl_code, dc_spcl, 특정내역발생단위Enum.TY01명세단위, t_CHRG_DTL[clickIdx]); // 특정내역VM.instance().Create특정내역_청구심사에 해당
            } else {
                if (rightMenu) {
                    await 특정내역.Create특정내역_청구심사(cd_spcl_code, dc_spcl, 특정내역발생단위Enum.TY01명세단위, t_CHRG_DTL[clickIdx], true); // 특정내역VM.instance().Create특정내역_청구심사에 해당  
                }
                else {
                    cs[0].DC_SPCL = dc_spcl;
                    cs[0].DT_UPDT = fmtTodaySec;
                    await Set_UpdatePostData('T_CHRG_SPCL', cs[0]);
                }
            }
            break;

        case 'remove':
            if (rightMenu) {
                if (confirm(`선택하신 특정내역[${cd_spcl_code}]을 삭제하시겠습니까?`)) {
                    if (cs.length > 0) {
                        await Set_DeletePostData('T_CHRG_SPCL', cs[0]);
                    }
                }
            }
            else {
                if (cs.length > 0) {
                    await Set_DeletePostData('T_CHRG_SPCL', cs[0]);
                }
            }

            document.getElementById('memo심사참고사항').value = ""; // memo심사참고사항.EditValue = ""에 해당
            break;

        default:
            break;
    }

    Click_전체내역Checkbox();
}
//#endregion
//#endregion

//#region 엑셀내보내기
function Cmd엑셀내보내기_ItemClick(name) {
    var fileName = '';
    var targetGrids = [];

    var dte청구년월 = new Date(document.getElementById('month').value);
    var formattedDate = dte청구년월.getFullYear().toString() +
        (dte청구년월.getMonth() + 1).toString().padStart(2, '0');

    if (name == '청구서List') {
        fileName = `${formattedDate}_ExpExcel_청구서List.xlsx`;
    }
    else if (name == '명세서List') {
        fileName = `${formattedDate}_ExpExcel_명세서List.xlsx`;
    }

    ExportGridsToExcel(name, fileName);
}

function ExportGridsToExcel(name, fileName) {
    var workbook = XLSX.utils.book_new();
    var table;
    if (name == '청구서List') {
        table = document.getElementById('excel청구');
    }
    else if (name == '명세서List') {
        table = document.getElementById('excel명세');
    }

    var worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
}

//#endregion

//#region EDI생성
async function CmdEDI생성_Click() {
    // console.log(T_CODE_DTL);
    var fg_chrg_stat = T_CODE_DTL.filter(t => t.CD_CODE_GRP == '505' && t.CD_CODE_DTL == smry.FG_CHRG_STAT);
    if (parseInt(fg_chrg_stat.CD_CODE_DTL) > 청구상태Enum.청구상태0집계) {
        // var str청구상태 = lst청구상태.Where(t => t.Value == fg_chrg_stat.NM_CODE_DTL).Single().Display;//  new string[] { "집계", "송신", "접수", "반송", "심결", "완료" }[row.FG_CHRG_STAT];

        if (confirm(`[청구 집계 파일 생성]\n[${smry.NO_CHRG_SMRY}]\n이미 [${str청구상태}] 상태인 집계 내역입니다.\n청구 파일을 다시 생성하시겠습니까?`) == false) {
            return;
        }
    }
    else {
        if (confirm(`[청구 집계 파일 생성]\n청구 집계표 [${smry.NO_CHRG_SMRY}]에 대한\n청구 파일을 생성하시겠습니까?`) == false) {
            return;
        }
    }

    await WriteEDI_양방(await Binding청구명세Data(smry));
    // WriteEDI_양방();

    smry.FG_CHRG_STAT = 청구상태Enum.청구상태1송신;
    smry.DT_CHRG_SND = fmtTodaySec;
    // await Set_CreatePostData('T_CHRG_SMRY', smry);
}

async function Binding청구명세Data(smry) {
    var dt청구 = new 청구Data_청구서();
    dt청구.Add(smry);

    var dtlLst = await GetData(`SELECT * FROM T_CHRG_DTL WHERE NO_CHRG_SMRY = ${smry.NO_CHRG_SMRY} ORDER BY NO_CHRG_DTL`);
    var dt명세일반Lst = [];

    for (const dtl of dtlLst) {
        var dxLst = await GetData(`SELECT * FROM T_CHRG_DX WHERE NO_CHRG_SMRY = ${dtl.NO_CHRG_SMRY} AND NO_CHRG_DTL = ${dtl.NO_CHRG_DTL} ORDER BY FG_DX_KIND, NO_DX_ORDER`);
        var treatLst = await GetData(`SELECT * FROM T_CHRG_TREAT WHERE NO_CHRG_SMRY = ${dtl.NO_CHRG_SMRY} AND NO_CHRG_DTL = ${dtl.NO_CHRG_DTL} 
        AND FG_UPDT = ${처방수정구분Enum.FG00등록} ORDER BY NO_LINE`);
        var prscLst = await GetData(`SELECT * FROM T_CHRG_PRSC WHERE NO_CHRG_SMRY = ${dtl.NO_CHRG_SMRY} AND NO_CHRG_DTL = ${dtl.NO_CHRG_DTL}
         AND FG_UPDT = ${처방수정구분Enum.FG00등록} ORDER BY NO_LINE`);
        var spclLst = await GetData(`SELECT * FROM T_CHRG_SPCL WHERE NO_CHRG_SMRY = ${dtl.NO_CHRG_SMRY} AND NO_CHRG_DTL = ${dtl.NO_CHRG_DTL}
         AND FG_UPDT = ${처방수정구분Enum.FG00등록}`);

        var dt명세일반 = new 청구Data_명세일반();

        console.log(dtl);
        dt명세일반.Add(dtl);

        dxLst.forEach((dx) => {
            let dt명세상병 = {}; // 새로운 객체 생성

            // 청구Data_명세상병 클래스의 속성 이름들을 가져옴
            let pi명세상병 = Object.keys(dt명세상병);

            // 속성들을 반복 처리
            pi명세상병.forEach((item) => {
                dt명세상병[item].value = dx[item] == null ? "" : dx[item];
            });

            dt명세일반.명세상병Lst.push(dt명세상병);
        });

        treatLst.forEach((tr) => {
            let dt명세진료 = new 청구Data_명세진료();

            // 청구Data_명세진료 클래스의 속성 이름들을 가져옴
            let pi명세진료 = Object.keys(dt명세진료); // 빈 객체의 속성 이름들로 초기화 (필요한 경우 수정)

            // 속성들을 반복 처리
            pi명세진료.forEach((item) => {
                dt명세진료[item].value = tr[item] == null ? "" : tr[item];
            });

            dt명세일반.명세진료Lst.push(dt명세진료);
        });

        prscLst.forEach((ps) => {
            let dt명세처방 = {}; // 새로운 청구Data_명세처방 객체 생성

            // 청구Data_명세처방 클래스의 속성 이름들을 가져옴
            let pi명세처방 = Object.keys(dt명세처방); // 빈 객체의 속성 이름들로 초기화 (필요한 경우 수정)

            // 속성들을 반복 처리
            pi명세처방.forEach((item) => {
                dt명세처방[item].value = ps[item] == null ? "" : ps[item];
            });

            dt명세일반.명세처방Lst.push(dt명세처방);
        });

        spclLst.forEach((sp) => {
            let dt명세특정 = {}; // 새로운 청구Data_명세특정 객체 생성

            // 청구Data_명세특정 클래스의 속성 이름들을 가져옴
            let pi명세특정 = Object.keys(dt명세특정); // 빈 객체의 속성 이름들로 초기화 (필요한 경우 수정)

            // 속성들을 반복 처리
            pi명세특정.forEach((item) => {
                dt명세특정[item].value = sp[item] == null ? "" : sp[item];
            });

            dt명세일반.명세특정Lst.push(dt명세특정);
        });

        if (smry.FG_ISRC == 보험구분002Enum.보험구분4산업재해) {
            dt명세일반.산재중환자실입원기간 = "";
            dt명세일반.산재중환자실입원일수 = "0";
            dt명세일반.산재진료기간 = dtl.DS_TREAT_START + dtl.DS_TREAT_END;
            dt명세일반.산재가산율 = await GetData(`SELECT RT_ADTN_IAI_ISRC FROM T_HSPTL_INFO_INS
                                                  WHERE DS_APLY <= ${dtl.DS_TREAT_START} ORDER BY DS_APLY DESC LIMIT 1`);

            dt명세일반.명세진료Lst.forEach((item) => {
                item.산재수량 = (Math.round(parseFloat(item.AMT_DOSAGE_1TH) * parseInt(item.CNT_DOSAGE) * 100) / 100).toFixed(2);
            });

            dt명세일반.명세처방Lst.forEach((item) => {
                item.AMT_DOSAGE_1TH = (Math.round(parseFloat(item.AMT_DOSAGE_1TH) * 100) / 100).toFixed(2);
            });
        }

        dt명세일반Lst.push(dt명세일반);
    }

    dt청구.명세일반Lst.push(dt명세일반);

    return dt청구;
}

async function WriteEDI_양방(dt청구서) {
    var strFileName = `${await Temp병원정보('요양기관번호')}_${dt청구서.NO_CHRG_SMRY.value}`;

    var strFileExe = '';

    switch (dt청구서.FG_ISRC.value.toString()) {
        case 보험구분002Constant.국민공단_1:
        case 보험구분002Constant.의료급여_2:
            strFileExe = "GHP";
            break;
        case 보험구분002Constant.자동차보험_3:
            strFileExe = "CAR";
            break;
        case 보험구분002Constant.산업재해_4:
        //         var sw청구 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M010.1"), false, Encoding.Default);

        // //** Write 청구서 Line
        // sw청구.WriteLine(GetLineStr(GetSortedData(dt청구서, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방), true));

        //         var sw명세 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M020.1"), false, Encoding.Default);
        //         var sw상병 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M020.2"), false, Encoding.Default);
        //         var sw진료 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M020.3"), false, Encoding.Default);
        //         var sw처방 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M020.4"), false, Encoding.Default);
        //         var sw특정 = new StreamWriter(string.Format(@"{0}\{1}", strFilePath, "M020.5"), false, Encoding.Default);

        // foreach(청구Data_명세일반 dt명세일반 in dt청구서.명세일반Lst)
        // {
        //     sw명세.WriteLine(GetLineStr(GetSortedData(dt명세일반, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));

        //     foreach(청구Data_명세상병 dt명세상병 in dt명세일반.명세상병Lst)
        //     {
        //         sw상병.WriteLine(GetLineStr(GetSortedData(dt명세상병, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        //     }

        //     foreach(청구Data_명세진료 dt명세진료 in dt명세일반.명세진료Lst)
        //     {
        //         sw진료.WriteLine(GetLineStr(GetSortedData(dt명세진료, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        //     }

        //     foreach(청구Data_명세처방 dt명세처방 in dt명세일반.명세처방Lst)
        //     {
        //         sw처방.WriteLine(GetLineStr(GetSortedData(dt명세처방, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        //     }

        //     foreach(청구Data_명세특정 dt명세특정 in dt명세일반.명세특정Lst)
        //     {
        //         sw특정.WriteLine(GetLineStr(GetSortedData(dt명세특정, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        //     }
        // }


        // sw청구.Close();
        // sw명세.Close();
        // sw상병.Close();
        // sw진료.Close();
        // sw처방.Close();
        // sw특정.Close();

        // WriteMedLog();

        // base.CloseWaitForm_Progress();

        // frmSBInfo.ShowInfomation("[ EDI 파일 생성 완료 ]", string.Format("[{0}]건에 대한\n청구 EDI 파일 생성이 완료되었습니다.\n{1}", dt청구서.명세일반Lst.Count(), strFilePath));
        // return;
        default:
            break;
    }

    // for (var lst of dt청구서.명세일반Lst) {
    //     GetSortedData(lst.명세진료Lst, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방);
    // }    
    var sw;
    sw = WriteLine(GetLineStr(GetSortedData(dt청구서, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)), true);
    for (dt명세일반 of dt청구서.명세일반Lst) {
        sw += WriteLine(GetLineStr(GetSortedData(dt명세일반, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));

        for (dt명세상병 of dt명세일반.명세상병Lst) {
            sw += WriteLine(GetLineStr(GetSortedData(dt명세상병, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        }

        for (dt명세진료 of dt명세일반.명세진료Lst) {
            sw += WriteLine(GetLineStr(GetSortedData(dt명세진료, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방, dt청구서.VR_CHRG_FORM.value)));
        }

        for (dt명세처방 of dt명세일반.명세처방Lst) {
            sw += WriteLine(GetLineStr(GetSortedData(dt명세처방, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방, dt청구서.VR_CHRG_FORM.value)));
        }

        for (dt명세특정 of dt명세일반.명세특정Lst) {
            sw += WriteLine(GetLineStr(GetSortedData(dt명세특정, parseInt(dt청구서.FG_ISRC.value), 양한방구분Enum.양한방구분Enum0양방)));
        }
    }

    var content = sw;
    
    // const iconv = require('iconv-lite');
    // let ansiBuffer = iconv.encode(content, 'windows-1252');

    // // 필요에 따라 버퍼를 문자열로 변환
    // let ansiString = ansiBuffer.toString('binary');

    // // var urlEncodedData = "data:application/octet-stream;charset=utf-8";
    // // urlEncodedData += encodeURIComponent(content);

    // // //const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    // const link = document.createElement('a');

    // link.href = URL.createObjectURL(ansiString);
    // link.download = `${strFileName}.${strFileExe}`;
    // link.click();
}

function GetSortedData(Data, fgIsrc, en양한방구분, version = "") {
    // if (version.localeCompare("091") >= 0 && Data instanceof 청구Data_명세진료) {
    //     Data.MNY_UNPRC.length = 10; // decimal(8, 2) -> decimal(10, 2)
    // }

    // if (Data instanceof 청구Data_명세진료) {
    //     Data.FG_MDFCTN.order = -1; // 한방 가감등구분은 출력하지 않음
    // } else if (Data instanceof 청구Data_명세처방 && version.localeCompare("090") < 0) {
    //     Data.TY_PAY_APLY.order = -1; // 본인부담률 구분코드 ver.090 추가됨
    // }

    switch (fgIsrc) {
        case 보험구분002Enum.보험구분1국민공단:
        case 보험구분002Enum.보험구분2의료급여:
            break;
        case 보험구분002Enum.보험구분3자동차보험:
            if (Data instanceof 청구Data_청구서) {
                Data.SPACE01.order = 3;  // 공란
                Data.MNY_MXM_EXCD_PTNT.order = -1;  // 본인부담상한액초과금
                Data.MNY_GRNT.order = -1;  // 지원금
                Data.MNY_HNDCP.order = -1;  // 장애인의료비
                Data.MNY_TOTL.order = -1;  // 진료비총액
                Data.MNY_CHRG_RDM.order = -1;  // 보훈청구액
                Data.MNY_ALL_100_PTNT.order = -1;  // 전액본인부담총액(의료급여)100/100본인부담금총액
                Data.MNY_PART_RDM.order = -1;  // 보훈본인일부부담금
                Data.MNY_TOTL_GRNT_NOT.order = -1;  // 비급여총액(100분100미만총액)
                Data.MNY_100_PART_PTNT.order = -1;  // 100분의100미만 본인일부부담금
                Data.MNY_CHRG_100_UNDR.order = -1;  // 100분의100미만 청구액
                Data.MNY_CHRG_100_UNDR_RDM.order = -1;  // 100분의100미만 보훈청구액
                Data.CNT_DFRNC_DAYS.order = -1;  // 차등진료일수
                Data.CNT_DFRNC_DOCT.order = -1;  // 차등의사수
                Data.LVL_DFRNC.order = -1;  // 차등지수
                Data.MNY_DFRNC.order = -1;  // 차등청구액
                Data.NO_EXAM_APPRVL.order = -1;  // 검사승인번호
            }
            else if (Data instanceof 청구Data_명세일반) {
                Data.NO_ISRC_PLCY.length = 30;  // 사고접수번호
                Data.NO_PAY_WRRNTY.order = 17;  // 지급보증번호
                Data.SPACE01.order = 83;  // 진료결과 뒤로, space10
                Data.SPACE01.length = 10;

                Data.CD_ISRC_CMPY.order = 88;

                Data.NO_WLFR_ORG.order = -1;  // 보장기관기호
                Data.FG_ISRC_KIND_GRNT.order = -1;  // 의료급여종별구분
                Data.FG_ISRC_KIND_INJRY.order = -1;  // 공상등구분
                Data.NM_ISRC_USER.order = -1;  // 가입자성명

                Data.MNY_MXM_EXCD_PTNT.order = -1;  // 본인부담상한액초과금
                Data.MNY_GRNT.order = -1;  // 지원금
                Data.MNY_HNDCP.order = -1;  // 장애인의료비
                Data.MNY_RPLCE_PAY.order = -1;  // 대불금
                Data.MNY_TOTL.order = -1;  // 요양급여비용총액2_진료비총액
                Data.MNY_CHRG_RDM.order = -1;  // 보훈청구액
                Data.SPACE02.order = -1;  // 공란02
                Data.SPACE03.order = -1;  // 공란03
                Data.MNY_ALL_100_PTNT.order = -1;  // 100분의100_본인부담금총액
                Data.MNY_PART_RDM.order = -1;  // 보훈본인일부부담금
                Data.MNY_TOTL_GRNT_NOT.order = -1;  // 100분의100미만총액
                Data.MNY_100_PART_PTNT.order = -1;  // 100분의100미만본인일부부담금
                Data.MNY_CHRG_100_UNDR.order = -1;  // 100분의100미만청구액
                Data.MNY_CHRG_100_UNDR_RDM.order = -1;  // 100분의100미만보훈청구액

                // if (en양한방구분 === 양한방구분Enum.양한방구분Enum1한방) {
                //     Data.TY_FIXED_AMT_RATE.order = -1;  // 정액정률구분
                //     Data.SPACE01.order = -1;
                // }
            }

            else if (Data instanceof 청구Data_명세상병) {
                Data.TY_LCNSE.order = -1; //면허종류
                Data.NO_LCNSE.order = -1; //면허번호
            }

            else if (Data instanceof 청구Data_명세진료) {
                Data.TY_LCNSE.order = -1; //면허종류
                Data.NO_LCNSE.order = -1; //면허번호
            }

            else if (Data instanceof 청구Data_명세처방) {
                Data.CNT_REPT.order = -1; //반복조제횟수
            }
            break;

        case 보험구분002Enum.보험구분4산업재해:
            if (Data instanceof 청구Data_청구서) {
                Data.FG_CHRG_CYCL.order = -1;  //청구단위구분
                Data.FG_TREAT_SBJT.order = -1;  //진료구분
                Data.FG_TREAT_PART.order = -1;  //진료분야구분
                Data.MNY_TOTL_GRNT.order = -1;  //요양급여비용총액
                Data.MNY_PART_PTNT.order = -1;  //본인일부부담금
                Data.MNY_MXM_EXCD_PTNT.order = -1;  //본인부담상한액초과금
                Data.MNY_GRNT.order = -1;  //지원금
                Data.MNY_HNDCP.order = -1;  //장애인의료비
                Data.MNY_TOTL.order = -1;  //진료비총액
                Data.MNY_CHRG_RDM.order = -1;  //보훈청구액
                Data.MNY_ALL_100_PTNT.order = -1;  //100분의100_본인부담금총액
                Data.MNY_PART_RDM.order = -1;  //보훈본인일부부담금
                Data.MNY_TOTL_GRNT_NOT.order = -1;  //비급여총액_100분100미만총액
                Data.MNY_100_PART_PTNT.order = -1;  //100분의100미만_본인일부부담금
                Data.MNY_CHRG_100_UNDR.order = -1;  //100분의100미만_청구액
                Data.MNY_CHRG_100_UNDR_RDM.order = -1;  //100분의100미만_보훈청구액
                Data.CNT_DFRNC_DAYS.order = -1;  //차등진료일수
                Data.CNT_DFRNC_DOCT.order = -1;  //차등의사수
                Data.LVL_DFRNC.order = -1;  //차등지수
                Data.MNY_DFRNC.order = -1;  //차등청구액
                Data.DS_RGST_BRTH.order = -1;  //작성자생년월일
                Data.NO_EXAM_APPRVL.order = -1;  //검사승인번호
                Data.DC_CHRG_AGNCY.order =
                    Data.VR_CHRG_FORM.order = 1;  //청구서서식버젼
                Data.VR_CHRG_DTL.order = 2;  //명세서서식버젼
                Data.NO_CHRG_SMRY.order = 3;  //청구번호
                Data.NO_CHRG_FORM.order = 4;  //서식번호
                Data.NO_CARE_ORG.order = 5;  //요양기관_의료급여기관_기호
                Data.NO_RESV_ORG.order = 6;  //수신기관
                Data.FG_ISRC_KIND.order = 7;  //보험자종별구분_의료급여진료구분
                Data.FG_CHRG_SMRY.order = 8;  //청구구분
                Data.YM_TREAT.order = 9;  //진료년월
                Data.DS_CHRG.order = 10;  //청구일자
                Data.FG_TREAT_TYPE.order = 11;  //진료형태 6번 반복이므로 FG_TREAT_TYPE에서 수동으로 str 구함
                Data.CNT_TREAT.order = -1;  //건수     6번 반복이므로 FG_TREAT_TYPE에서 수동으로 str 구함
                Data.MNY_CHRG.order = -1;  //청구액   6번 반복이므로 FG_TREAT_TYPE에서 수동으로 str 구함
                //Data.CNT_TREAT            .order     = 14;  //건수    (계) FG_TREAT_TYPE에서 수동으로 str 구함
                //Data.MNY_CHRG             .order     = 15;  //청구액  (계) FG_TREAT_TYPE에서 수동으로 str 구함
                Data.NM_CHRG.order = 16;  //청구인성명
                Data.NM_RGST.order = 17;  //작성자성명
                Data.DC_RMRK.order = Data.DC_RMRK.value == '' ? -1 : 18;  //참조란. 참조내역 미 발생시 작성
                Data.NO_CARE_ORG.length = 7;  //요양기관_의료급여기관_기호 길이 8 -> 7
            }
            else if (Data instanceof 청구Data_명세일반) {
                Data.FG_SECTION.order = -1;  //내역구분
                Data.NO_WLFR_ORG.order = -1;  //보장기관기호
                Data.FG_ISRC_KIND_GRNT.order = -1;  //의료급여종별구분
                Data.TY_FIXED_AMT_RATE.order = -1;  //정액정률구분
                Data.DS_ACCEPTIN_START.order = -1;  //청구구분_최초입원개시일
                Data.NM_ISRC_USER.order = -1;  //가입자성명
                Data.NO_ISRC_PLCY.order = -1;  //증번호
                Data.SPACE01.order = -1;  //SPACE01_공란01
                Data.FG_ACCEPTIN_PATH.order = -1;  //입원도착경로
                Data.MNY_TOTL_GRNT.order = -1;  //요양급여비용총액1_급여총액
                Data.MNY_PART_PTNT.order = -1;  //본인일부부담금
                Data.MNY_MXM_EXCD_PTNT.order = -1;  //본인부담상한액초과금
                Data.MNY_GRNT.order = -1;  //지원금
                Data.MNY_HNDCP.order = -1;  //장애인의료비
                Data.MNY_RPLCE_PAY.order = -1;  //대불금
                Data.MNY_TOTL.order = -1;  //요양급여비용총액2_진료비총액
                Data.MNY_CHRG_RDM.order = -1;  //보훈청구액
                Data.SPACE02.order = -1;  //공란02
                Data.SPACE03.order = -1;  //공란03
                Data.MNY_ALL_100_PTNT.order = -1;  //100분의100_본인부담금총액
                Data.MNY_PART_RDM.order = -1;  //보훈본인일부부담금
                Data.MNY_TOTL_GRNT_NOT.order = -1;  //100분의100미만총액
                Data.MNY_100_PART_PTNT.order = -1;  //100분의100미만본인일부부담금
                Data.MNY_CHRG_100_UNDR.order = -1;  //100분의100미만청구액
                Data.MNY_CHRG_100_UNDR_RDM.order = -1;  //100분의100미만보훈청구액

                Data.NO_CHRG_SMRY.order = 1;  //청구번호
                Data.NO_CHRG_DTL.order = 2;  //명세서일련번호
                Data.NO_CHRG_FORM.order = 3;  //서식번호
                Data.NO_CARE_ORG.order = 4;  //요양기관기호
                Data.FG_ISRC_KIND_INJRY.order = 5;  //공상등구분
                Data.FG_CHRG_SMRY.order = 6;  //청구구분_코드
                Data.NO_CHRG_ACCEPT.order = 7;  //청구구분_접수번호
                Data.NO_CHRG_DTL_PREV.order = 8;  //청구구분_이전명세서일련번호
                Data.CD_CHRG_CAUSE.order = 9;  //청구구분_사유코드
                Data.NM_SUJIN.order = 10;  //수진자성명
                Data.NO_JUMIN_SUJIN_ENC.order = 11;  //수진자주민등록번호
                Data.DS_ACCDNT.order = 12;  //재해발생일자
                Data.CD_ISRC_CMPY.order = 13;  //소속사업장명칭
                Data.CD_TREAT_SBJTs.order = 14;  //진료과목들
                Data.DS_APLY_ISRC.order = 15;  //진료개시일
                Data.산재진료기간.order = 16;  //산재 진료기간
                Data.CNT_ACCEPTIN_DAYS.order = 18;  //입원일수_총내원일수
                Data.CNT_ISRC_DAYS.order = 19;  //요양급여일수_산재퇴원약일수
                Data.DC_TREAT_DAYS.order = 20;  //외래내원일
                Data.산재중환자실입원기간.order = 21;  //산재 중환자실 입원 
                Data.산재중환자실입원일수.order = 22;  //산재 중환자실 입원일수
                Data.TY_IAI_TREAT.order = 23;  //산재진료구분
                Data.FG_TREAT_RSLT.order = 24;  //진료결과_산재치료구분
                Data.산재간병범위.order = 25;  //간병범위(공백)
                Data.MNY_IAI_I.order = 26;  //I금액
                Data.MNY_IAI_II.order = 27;  //II금액
                Data.MNY_CHRG.order = 28;  //청구액
                Data.산재가산율.order = 29;  //가산율

                Data.NO_CARE_ORG.length = 7;  //요양기관기호 길이 8 -> 7
                Data.NO_CHRG_ACCEPT.length = 15;  //청구구분_접수번호 길이 7 -> 15
                Data.CD_CHRG_CAUSE.length = 4;  //청구구분_사유코드 길이 2 -> 4
                Data.CD_ISRC_CMPY.length = 35;  //소속사업장명칭 길이 2 -> 35

                if (en양한방구분 == 양한방구분Enum.양한방구분Enum1한방)
                    Data.CD_TREAT_SBJTs.length = 2;  //진료과목들. 한방은 무조건 '80'
            }

            else if (Data instanceof 청구Data_명세상병) {
                Data.FG_SECTION.order = -1; //내역구분
                Data.CD_TREAT_SBJT.order = -1; //진료과목
                Data.CD_TREAT_SBJT_IN.order = -1; //내과세부전문과목
                Data.DS_TREAT.order = -1; //내원일자
                Data.TY_LCNSE.order = -1; //면허종류
                Data.NO_LCNSE.order = -1; //면허번호
                Data.치식구분_우상.order = -1; //치식구분_우상
                Data.치식구분_좌상.order = -1; //치식구분_좌상
                Data.치식구분_우하.order = -1; //치식구분_우하
                Data.치식구분_좌하.order = -1; //치식구분_좌하
            }
            else if (Data instanceof 청구Data_명세진료) {
                Data.FG_SECTION.order = -1; //내역구분
                Data.CNT_DOSAGE.order = -1; //투여횟수
                Data.AMT_DOSAGE_1TH.order = -1; //1회투여량
                Data.SPACE01.order = -1; //공란1
                Data.SPACE02.order = -1; //공란2
                Data.FG_MDFCTN.order = -1; //한방가감등구분
                Data.DS_APLY.order = -1; //변경일_적용일자
                Data.TY_LCNSE.order = -1; //면허종류
                Data.NO_LCNSE.order = -1; //면허번호
                Data.치식구분_우상.order = -1;
                Data.치식구분_좌상.order = -1;
                Data.치식구분_우하.order = -1;
                Data.치식구분_좌하.order = -1;

                Data.NO_CHRG_SMRY.order = 1; //청구번호
                Data.NO_CHRG_DTL.order = 2; //명세서일련번호
                Data.NO_CLS.order = 3; //항번호
                Data.NO_ITEM.order = 4; //목번호
                Data.NO_LINE.order = 5; //줄번호
                Data.FG_CODE.order = 6; //코드구분
                Data.CD_CHRG.order = 7; //청구코드
                Data.NM_DSPLY.order = 8; //명칭
                Data.DS_TREAT_START.order = 9; //진료기간시작
                Data.DS_TREAT_END.order = 10; //진료기간종료
                Data.FG_ACTN.order = 11; //행위가산구분
                Data.MNY_UNPRC.order = 12; //단가
                Data.산재수량.order = 13; //수량
                Data.CNT_DOSAGE_DAYS.order = 14; //투여일수
                Data.MNY_PRICE.order = 15; //금액
            }
            else if (Data instanceof 청구Data_명세처방) {
                Data.FG_SECTION.order = -1; //내역구분
                Data.CNT_REPT.order = -1; //반복조제횟수
                Data.TY_PAY_APLY.order = -1; //본인부담구분코드

                Data.NO_CHRG_SMRY.order = 1; //청구번호
                Data.NO_CHRG_DTL.order = 2; //명세서일련번호
                Data.NO_PRSC_DLVRY.order = 3; //처방전발급번호
                Data.CNT_PRSC_DAYS.order = 4; //처방일수
                Data.NO_LINE.order = 5; //줄번호
                Data.FG_CODE.order = 6; //코드구분
                Data.CD_CHRG.order = 7; //청구코드
                Data.NM_DSPLY.order = 8; //명칭
                Data.AMT_DOSAGE_1TH.order = 9; //1회투약량
                Data.CNT_DOSAGE.order = 10; //투여횟수
                Data.CNT_DOSAGE_DAYS.order = 11; //총투약일수

                Data.AMT_DOSAGE_1TH.decimalPoint = 2;    //1회투약량 소수점 이하 길이 4 -> 2
            }
            else if (Data instanceof 청구Data_명세특정) {
                Data.FG_SECTION.order = -1; //내역구분
            }
            break;
        case 보험구분002Enum.보험구분5보훈:
        case 보험구분002Enum.보험구분99일반:
        default:
            break;
    }

    let FieldLst = [];
    let pi = null;

    switch (Data.constructor.name) {
        case "청구Data_청구서":
            pi = Object.getOwnPropertyNames(new 청구Data_청구서());
            break;
        case "청구Data_명세일반":
            pi = Object.getOwnPropertyNames(new 청구Data_명세일반());
            break;
        case "청구Data_명세상병":
            pi = Object.getOwnPropertyNames(new 청구Data_명세상병());
            break;
        case "청구Data_명세진료":
            pi = Object.getOwnPropertyNames(new 청구Data_명세진료());
            break;
        case "청구Data_명세처방":
            pi = Object.getOwnPropertyNames(new 청구Data_명세처방());
            break;
        case "청구Data_명세특정":
            pi = Object.getOwnPropertyNames(new 청구Data_명세특정());
            break;
        default:
            return null;
    }

    for (let itemName of pi) {
        if (Data[itemName] instanceof 청구Field) {
            if (GetProperty(Data, itemName) === null) {
                //frmSBError.ShowError("[]", itemName);
            } else {
                FieldLst.push(GetProperty(Data, itemName));
            }
        }
    }

    FieldLst.sort((a, b) => a.order - b.order);

    return FieldLst;
}

function GetLineStr(LstSorted청구Field, b산재청구 = false) {
    var w_str = '';

    if (LstSorted청구Field != null) {
        for (field of LstSorted청구Field) {
            if (field.order != -1) // -1은 평가표 전송 항목이 아님
            {
                if (b산재청구 && field.fieldName == "FG_TREAT_TYPE")    //진료형태, 건수, 청구액 6번 반복 + 건수(계), 청구액(계)이므로 FG_TREAT_TYPE에서 수동으로 str 구함
                {
                    var tmpStr진료형태 = SetEvarFieldToStr(LstSorted청구Field, field, b산재청구);
                    var tmpStr건수 = SetEvarFieldToStr(LstSorted청구Field, LstSorted청구Field.find(t => t.fieldName == 'CNT_TREAT'), b산재청구);
                    var tmpStr청구액 = SetEvarFieldToStr(LstSorted청구Field, LstSorted청구Field.find(t => t.fieldName == 'MNY_CHRG'), b산재청구);

                    var tmpStr = `${tmpStr진료형태}${tmpStr건수}${tmpStr청구액}`;

                    // 나머지 5번은 공백(또는 0)으로 채움                
                    for (let i = 1; i < 5; i++) {
                        const element = array[i];
                    }
                    {
                        tmpStr += "".PadLeft(1) + "0".PadLeft(6) + "0".PadLeft(12);   //진료형태(길이1) 공백, 건수(길이6)와 청구액(길이12)은 0
                    }

                    tmpStr += `${tmpStr건수}${tmpStr청구액}`;
                    w_str += tmpStr;
                }
                else {
                    w_str += SetEvarFieldToStr(LstSorted청구Field, field, b산재청구);
                }
            }
        }
    }

    console.log(w_str);
    return w_str.replace(/\n/g, "");
}

function SetEvarFieldToStr(lstF, f, b산재청구) {
    var padLen;

    if (f.value == undefined) {
        f.value = '';
    }

    if (typeof f.value === 'string') {
        f.value = f.value.replace(/\t|\n|\r/g, ' ');
    }
    console.log(f);

    switch (f.fieldName) {
        case T_CHRG_SMRY_FieldConstant.FG_CHRG_SMRY_청구구분:        //원청구의 경우 "0", 누락청구(원청구와 동일)의 경우 "99" 값이 아니라 공백이 들어가야 한다. 단, 산재의 경우 원청구의 경우 "0" 그대로 출력

            f.value = f.value.toString();
            f.value = f.value.trim();

            if (f.value === 청구구분코드Constant.구분00원청구 || f.value === 청구구분코드Constant.구분99누락청구) {
                if (b산재청구)
                    f.value = 청구구분코드Constant.구분00원청구;
                else
                    f.value = "";
            }


            var encoder = new TextEncoder();
            var bytes = encoder.encode(f.value);
            padLen = f.length - bytes.length;
            f.value = f.value + " ".repeat(padLen);
            break;

        case T_CHRG_DTL_FieldConstant.NM_SUJIN_수진자성명:           //수진자 성명에서 숫자와 영문자를 삭제해준다(환자구분 위해 홍길동2, 홍길동B 등으로 수진자 성명 입력된 경우)
            f.value = f.value.toString();
            f.value = Remove영문특수문자숫자(f.value);

            var encoder = new TextEncoder();
            var bytes = encoder.encode(f.value);
            padLen = f.length - bytes.length;
            f.value = f.value + " ".repeat(padLen);
            // f.value = '9203301111111';
            break;

        case T_CHRG_DTL_FieldConstant.NO_CHRG_DTL_명세서일련번호:    //명세서 일련번호와 줄번호는 1 -> 00001 식으로 Pad '0'해야 함(단, 특정내역의 경우 줄번호 0이면 공백으로)
        case T_CHRG_TREAT_FieldConstant.NO_LINE_줄번호:
            f.value = f.value.toString();
            var encoder = new TextEncoder();
            var bytes = encoder.encode(f.value);
            padLen = f.length - bytes.length;
            f.value = "0".repeat(padLen) + f.value;

            if (parseInt(f.value) === 0) {
                f.value = "0".repeat(f.length);
            }

            break;

        /**
        case T_CHRG_TREAT_FieldConstant.NO_CLS_항번호:  // 항,목번호는 보험구분에 따라 원처방의 항목번호와 다르게 설정한다.(T_CODE_DTL에서 가져옴)

            청구Field f항 = lstF.Where(t => t.fieldName == T_CHRG_TREAT_FieldConstant.NO_CLS_항번호).SingleOrDefault();
            청구Field f목 = lstF.Where(t => t.fieldName == T_CHRG_TREAT_FieldConstant.NO_ITEM_목번호).SingleOrDefault();

            if (f항 != null && f목 != null)
            {
                f.value = Get청구항목구분(f항.value + f목.value, (byte)보험구분002Enum.보험구분1국민공단, 0);
            }

            padLen = f.length - Encoding.Default.GetByteCount(f.value);
            f.value = f.value + "".PadLeft(padLen);

            //if (f.value.StartsWith("L") || f.value.StartsWith("S") || f.value.StartsWith("T")
            //    || f.value.StartsWith("A") || f.value.StartsWith("B") || f.value.StartsWith("U")
            //    || f.value.StartsWith("V") || f.value.StartsWith("W")
            //    || f.value.StartsWith("T")
            //    )
            //{
            //    f.value = f.value.Substring(1, 1) + " ";
            //}
            //else
            //{
            //    padLen = f.length - Encoding.Default.GetByteCount(f.value);
            //    f.value = "".PadLeft(padLen, '0') + f.value;
            //}
            break;

        case T_CHRG_TREAT_FieldConstant.NO_ITEM_목번호:  // 항,목번호는 보험구분에 따라 원처방의 항목번호와 다르게 설정한다.(T_CODE_DTL에서 가져옴)

            청구Field f항1 = lstF.Where(t => t.fieldName == T_CHRG_TREAT_FieldConstant.NO_CLS_항번호).SingleOrDefault();
            청구Field f목1 = lstF.Where(t => t.fieldName == T_CHRG_TREAT_FieldConstant.NO_ITEM_목번호).SingleOrDefault();

            if (f항1 != null && f목1 != null)
            {
                f.value = Get청구항목구분(f항1.value + f목1.value, (byte)보험구분002Enum.보험구분1국민공단, 1);
            }

            padLen = f.length - Encoding.Default.GetByteCount(f.value);
            f.value = f.value + "".PadLeft(padLen);

            break;
        **/
        case T_CHRG_DTL_FieldConstant.NO_CHRG_DTL_PREV_청구구분_이전명세서일련번호:  //"0" 값이 아니라 공백이 들어가야 한다.
            f.value = f.value.toString();
            if (f.value === "0") {
                f.value = "".repeat(f.length);
            } else {
                var encoder = new TextEncoder();
                var bytes = encoder.encode(f.value);
                padLen = f.length - bytes.length;
                f.value = "0".repeat(padLen) + f.value;
            }
            break;

        case T_CHRG_SPCL_FieldConstant.DC_SPCL_특정내역:    //특정내역은 Space값 없애지 않는다.
            f.value = f.value.toString();
            if (f.value === null || f.value === "false") {
                f.value = "";
            }

            // f.value = f.value.replace("-", "").replace(" ", "");

            var encoder = new TextEncoder();
            var bytes = encoder.encode(f.value);
            padLen = f.length - bytes.length;
            f.value = f.value + " ".repeat(padLen);
            break;

        case T_CHRG_DTL_FieldConstant.NO_ISRC_PLCY_증번호: // "-"는 삭제하지 않는다.
        case T_CHRG_DTL_FieldConstant.NO_PAY_WRRNTY_자보_지급보증번호:
            f.value = f.value.toString();
            if (f.value === null || f.value === "false") {
                f.value = "";
            }

            f.value = f.value.replace(/ /g, "");

            var encoder = new TextEncoder();
            var bytes = encoder.encode(f.value);
            padLen = f.length - bytes.length;
            f.value = f.value + " ".repeat(padLen);
            break;
        default:
            switch (f.dataType) {
                case 청구DataTypeEnum.type0string:
                    if (f.value === null || f.value === "false") {
                        f.value = "";
                    }

                    if (f.value != null && f.value != undefined) {
                        try {
                            f.value = f.value.replace(/-/g, "").replace(/ /g, "");
                        } catch (error) {
                            f.value = '   9203301111111'; //테스트
                        }
                    }

                    var encoder = new TextEncoder();
                    var bytes = encoder.encode(f.value);
                    padLen = f.length - bytes.length;
                    // padLen = f.length - Buffer.byteLength(f.value, 'utf8');

                    if (padLen < 0) {
                        f.value = f.value.substring(0, f.length); // 문자열 길이가 길 경우 자름
                    } else {
                        f.value = f.value + " ".repeat(padLen);
                    }
                    break;

                case 청구DataTypeEnum.type4DateString:
                    if (f.value === null) {
                        f.value = "";
                    }

                    f.value = f.value.replace(/-/g, "").replace(/ /g, "");

                    var encoder = new TextEncoder();
                    var bytes = encoder.encode(f.value);
                    padLen = f.length - bytes.length;

                    if (f.value.length !== 8) {
                        f.value = f.value + " ".repeat(padLen);
                    }
                    break;

                case 청구DataTypeEnum.type1bit:
                    if (f.value === null) {
                        f.value = "0";
                    }

                    f.value = (f.value === "true" || f.value === "1") ? "1" : "0";
                    break;

                case 청구DataTypeEnum.type2number:
                    if (f.value === null) {
                        f.value = "0";
                    } else if (f.value === "false") {
                        f.value = "";
                    }

                    var encoder = new TextEncoder();
                    var bytes = encoder.encode(f.value);
                    padLen = f.length - bytes.length;

                    f.value = " ".repeat(padLen) + f.value;
                    break;

                case 청구DataTypeEnum.type3Decimal:
                    if (f.value === null || parseFloat(f.value) === 0) {
                        f.value = "0";
                    }
                    //else
                    //{
                    //    if (f.value.Contains("."))
                    //    {
                    //        f.value = Convert.ToString(Convert.ToDouble(f.value) * Math.Pow(10, f.decimalPoint));
                    //    }
                    //}    

                    f.value = (parseFloat(f.value) * Math.pow(10, f.decimalPoint)).toString();

                    var encoder = new TextEncoder();
                    var bytes = encoder.encode(f.value);
                    padLen = f.length + f.decimalPoint - bytes.length;

                    f.value = " ".repeat(padLen) + f.value;
                    break;

                //case 청구DataTypeEnum.type5Money:

                //    if (f.value == null || Convert.ToDecimal(f.value) == 0)
                //        f.value = "0";
                //    else
                //        f.value = Convert.ToDecimal(f.value).ToString().Replace(".0000", "");

                //    if (f.decimalPoint > 0)
                //        padLen = f.length + f.decimalPoint - Encoding.Default.GetByteCount(f.value);
                //    else
                //        padLen = f.length - Encoding.Default.GetByteCount(f.value);

                //    f.value = "".PadLeft(padLen) + f.value;
                //    break;
                default:
                    break;
            }

            break;
    }

    if (f.value == undefined) {
        console.log(f);
    }

    return f.value;
}

function WriteLine(content, isFinalLine = false) {
    // content를 sw청구에 추가하는 대신 sw 변수에 덧붙임
    var sw = content;
    if (isFinalLine) {
        sw += '\n'; // 줄 바꿈 추가
    }

    return sw;
}
//#endregion