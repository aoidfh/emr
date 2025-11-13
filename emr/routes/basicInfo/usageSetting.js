let i액팅최대회차;
let lue지원구분Idx = 0;
async function UsageInit() {
    $("#lue지원구분").empty();
    var lue지원구분 = await Get지원정보ComboData(지원구분Enum.없음, false, true);
    lue지원구분 = lue지원구분.filter(t => !t.Value.startsWith(지원구분Constant.영양실11));
    for (let i = 0; i < lue지원구분.length; i++) {
        selectEl = document.querySelector("#lue지원구분");
        objOption = document.createElement("option");
        objOption.text = `${lue지원구분[i].Value} | ${lue지원구분[i].Display}`;
        objOption.value = `${lue지원구분[i].Value}`;
        objOption.setAttribute("EditValue", lue지원구분[i].Display);
        selectEl.options.add(objOption);        
    }

    document.getElementById('lue지원구분').selectedIndex = lue지원구분Idx;

    Refresh용법List();
    i액팅최대회차 = await GetData(`SELECT VL_HSPTL_INFO FROM T_HSPTL_INFO WHERE NM_HSPTL_INFO = '병동_액팅최대회차'`);
}

document.getElementById("lue지원구분").addEventListener("change", function () {
    Refresh용법List();
    $("#rdo항목구분").empty();

    switch (GetSelectValue('lue지원구분').substring(0, 2)) {
        case 지원구분Constant.원내약국12:
            CreateCheckBox('rdo항목구분', '내복약');
            CreateCheckBox('rdo항목구분', '외용약');
            lcg액팅설정.CustomHeaderButtons[0].Properties.Visible = true;  // 기본 액팅설정 사용 버튼
            break;
        case 지원구분Constant.주사실07:
            CreateCheckBox('rdo항목구분', '피하및근육주사');
            CreateCheckBox('rdo항목구분', '정맥주사');
            CreateCheckBox('rdo항목구분', '수액주사');
            CreateCheckBox('rdo항목구분', '기타주사');
            CreateCheckBox('rdo항목구분', '수혈');
            lue주사행위코드.ReadOnly = false;
            break;
        case 지원구분Constant.영상의학과03:
            CreateCheckBox('rdo항목구분', '방사선진단');
            CreateCheckBox('rdo항목구분', '방사선치료');
            break;
        case 지원구분Constant.물리치료실06:
            CreateCheckBox('rdo항목구분', '이학요법료');
            break;
        case 지원구분Constant.임상병리실02:
        case 지원구분Constant.내시경실05:
            CreateCheckBox('rdo항목구분', '자체검사');
            CreateCheckBox('rdo항목구분', '위탁검사');
            break;
        case 지원구분Constant.초음파실04:
            CreateCheckBox('rdo항목구분', 'CT진단');
            CreateCheckBox('rdo항목구분', 'MRI진단');
            CreateCheckBox('rdo항목구분', 'PET진단');
            CreateCheckBox('rdo항목구분', '초음파진단');
            break;
        case 지원구분Constant.처치실08:
            CreateCheckBox('rdo항목구분', '처치및수술료');
            break;
        default:
            break;
    }

    lue지원구분Idx = document.getElementById('lue지원구분').selectedIndex;
});

async function Refresh용법List() {
    var q = await GetData(`SELECT * FROM T_USAGE`);

    var str지원구분 = GetSelectValue('lue지원구분');
    switch (str지원구분.substring(0, 2)) {
        case 지원구분Constant.임상병리실02:
        case 지원구분Constant.내시경실05:
            q = q.filter(t => t.FG_ITEM.startsWith(검사료));
            break;
        case 지원구분Constant.원내약국12:
            q = q.filter(t => t.FG_ITEM.startsWith(투약료));
            break;
        case 지원구분Constant.주사실07:
            q = q.filter(t => t.FG_ITEM.startsWith(주사료));
            break;
        case 지원구분Constant.영상의학과03:
            q = q.filter(t => t.FG_ITEM.startsWith(방사선료));
            break;
        case 지원구분Constant.물리치료실06:
            q = q.filter(t => t.FG_ITEM.startsWith(이학요법료));
            break;
        case 지원구분Constant.초음파실04:
            q = q.filter(t => t.FG_ITEM.startsWith(특수장비));
            break;
        case 지원구분Constant.처치실08:
        case 지원구분Constant.수술실10:
            q = q.filter(t => t.FG_ITEM.startsWith(처치및수술료));
            break;
        default:
            return;
    }

    if (document.getElementById('chk미사용용법표시').checked == false) {
        q = q.filter(t => t.BL_DEL == 0);
    }

    CreateBasicTableList(q, 'usageTable', 'UsageTableClick');
}

function UsageTableClick(target) {
    ComnTbClick(target);
    var usage = GetJson(target);

    chk사용안함.checked = usage.BL_DEL;
    txt코드.value = usage.CD_USAGE;
    txt용법ID.value = usage.CD_LINK;
    txt용법명칭.value = usage.DC_USAGE;
    rdo항목구분.value = usage.FG_ITEM;
    txt투여횟수.value = usage.CNT_MDCTN;
    txt투여일수.value = usage.CNT_MDCNT_DAYS;
    lue주사행위코드.value = usage.CD_ACTN_INJCTN;

    grd액팅설정.DataSource = Get액팅설정DataSource(usage);

    // if (lcg액팅설정.CustomHeaderButtons[0].Properties.Visible == false)   // 기본 액팅설정 사용 버튼
    //     lcg액팅설정.CustomHeaderButtons[0].Properties.Checked = false;
    // else
    //     lcg액팅설정.CustomHeaderButtons[0].Properties.Checked = usage.BL_DFLT_ACTN;
    document.getElementById('lcg액팅설정').checked = usage.BL_DFLT_ACTN;

    // cmdSave.Enabled = true;
}

function Get액팅설정DataSource(usage) {
    RefreshTable('grd액팅설정');

    for (let i = 0; i < parseInt(i액팅최대회차[0].VL_HSPTL_INFO); i++) {
        var html = '';
        html += `<tr style="border: none;" onclick="ComnTbClick(this)">`;
        html += `<td>${i + 1}</td>`;
        html += `<td>${i + 1}회차</td>`;
        html += `<td><input type="checkbox"></td>`;
        html += `<td></td>`;
        $(`#grd액팅설정`).append(html);
    }
}

function Refresh용법() {
    txt코드.value = '';
    txt용법ID.value = '';
    txt용법명칭.value = '';
    rdo항목구분.value = '';
    txt투여횟수.value = 1;
    txt투여일수.value = 1;
    lue주사행위코드.value = '';
    document.getElementById('chk사용안함').checked = false;
    document.getElementById('grd액팅설정').checked = false;
}

async function GetNewCode() {
    var rst = "1";

    var q = await GetData(`SELECT * FROM T_USAGE WHERE CD_USAGE REGEXP '^[0-9]+$' ORDER BY LENGTH(CD_USAGE) DESC, CD_USAGE DESC LIMIT 1;`);

    if (q.length > 0) {
        rst = parseInt(q[0].ID_USAGE) + 1;
    }

    return rst;
}

async function NewCodeBtn() {
    Refresh용법();
    document.getElementById('txt코드').value = await GetNewCode();
}

function CreateCheckBox(id, value) {
    html = '';
    html += '<span>';
    html += `<input type="checkbox">${value}`;
    html += '</span>';
    $(`#${id}`).append(html);
}

async function Save용법정보() {
    var errMsg = '';
    var lst액팅설정 = [];

    var usage = await GetData(`SELECT * FROM T_USAGE WHERE ID_USAGE = ${document.getElementById('txt코드').value}`);
    var target;

    if (usage.length == 0) {
        target = new T_USAGE();
    }
    else {
        target = usage[0];
    }

    target.BL_DFLT_ACTN = document.getElementById('lcg액팅설정').checked == false ? '0' : '1';    // 기본 액팅설정 사용 버튼

    //** 저장 불가 에러 처리
    //if (tmp != null && tmp != _current_Usage)
    //    errMsg = "항목구분을 수정할 수 없습니다.\n해당 항목구분에 해당하는 동일 코드가 이미 존재합니다.";       //!@# 얘 테스트
    var container = document.getElementById('rdo항목구분');
    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    var checkOn = false;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true) {
            checkOn = true;
        }
    }
    if (checkOn == false) {
        errMsg = "항목구분을 선택해 주세요.";
    }
    else if (document.getElementById('txt용법ID').value == '') {
        errMsg = "용법ID를 입력해 주세요.";
    }
    else if ((!target.BL_DFLT_ACTN && document.getElementById('txt투여횟수').value == 0) || document.getElementById('txt투여일수').value == 0) {
        errMsg = "투여횟수와 일수는 0 이상의 값을 입력해 주세요.";
    }
    // else {

    //     if (target.BL_DFLT_ACTN) {
    //         foreach(C액팅설정 item in lst액팅설정)
    //         {
    //             item.bl사용 = false;
    //             item.ts시간 = null;
    //         }
    //     }
    //     else {
    //         int i사용회차 = 0;

    //         foreach(C액팅설정 item in lst액팅설정)
    //         {
    //             if (item.bl사용) {
    //                 i사용회차++;

    //                 if (item.ts시간 == "") {
    //                     errMsg = "사용 회차 액팅 시간을 입력해 주세요.";
    //                 }
    //             }
    //         }

    //         if (i사용회차 != Convert.ToInt32(txt투여횟수.Text) && i사용회차 != 0)
    //             errMsg = "입력한 투여횟수와 설정한 액팅 설정이 상이합니다.";
    //     }
    // }

    if (errMsg != '') {
        alert(`저장 불가\n${errMsg}`);
        return;
    }

    //** 저장 유의 메세지로 물어보기
    if (document.getElementById('txt용법명칭').value == "") {
        if (confirm('용법명칭 없이 저장하시겠습니까?') == false) {
            return;
        }
    }
    if (GetSelectValue('lue지원구분').startsWith(지원구분Constant.주사실07) && document.getElementById('lue주사행위코드').value == "") {
        if (confirm('행위코드 없이 저장하시겠습니까?') == false) {
            return;
        }
    }

    if (GetSelectValue('lue지원구분').startsWith(지원구분Constant.원내약국12)) {
        {
            var tmp2 = await GetData(`SELECT TOP 1 * FROM T_USAGE WHERE CD_LINK = '${document.getElementById('txt용법ID').value}'`);
            if (tmp2.length > 0 && tmp2.ID_USAGE != target.ID_USAGE)
                if (confirm('용법ID가 중복됩니다.\n무시하시고 저장하시겠습니까?') == false) {
                    return;
                }
        }
    }

    target.BL_DEL = document.getElementById('chk사용안함').checked == false ? '0' : '1';
    target.CD_USAGE = document.getElementById('txt코드').value;
    target.CD_LINK = document.getElementById('txt용법ID').value;
    target.DC_USAGE = document.getElementById('txt용법명칭').value;
    target.FG_ITEM = GetSelectValue('lue지원구분');
    target.CNT_MDCTN = document.getElementById('txt투여횟수').value;
    target.CNT_MDCNT_DAYS = document.getElementById('txt투여일수').value;
    target.CD_ACTN_INJCTN = document.getElementById('lue주사행위코드').selectedIndex;

    // for (int i = 1; i <= i액팅최대회차; i++)
    // {
    //     SetProperty(target, string.Format("BL_USE_{0}TH", i), lst액팅설정[i - 1].bl사용);
    //     SetProperty(target, string.Format("TS_USE_{0}TH", i), lst액팅설정[i - 1].ts시간);
    // }

    //저장
    if (usage.length == 0) {
        await Set_CreatePostData('T_USAGE', target);

    }
    else {
        await Set_UpdatePostData('T_USAGE', target);

    }

    alert('저장이 완료되었습니다.'); 
    UsageInit();
}