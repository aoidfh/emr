async function Get과거진료내역List(t_CHART, date) {
  try {
    var today;
    if (document.getElementById('patientListDate')) {
      today = HyphenReplace(document.getElementById('patientListDate').value);
    }
    else {
      today = date;
    }

    var accept = null;
    var dx = null;
    var treat = null;
    var union = null;
    var treat_dx;

    accept = await GetAccept(t_CHART.CD_CHART);
    treat = await GetTreat(t_CHART.CD_CHART, date);

    if (accept[accept.length - 1].진료상태 != 진료상태Enum.TY09완료) {
      accept = accept.filter(t => t.진료일자 != today);
      union = treat.filter(t => t.진료일자 != today);
    }
    else {
      accept = accept;
      union = treat;
    }

    treat_dx = await GetData(`SELECT * FROM T_TREAT_DX  WHERE CD_CHART = '${t_CHART.CD_CHART}' AND DS_TREAT != ${accept[accept.length - 1].진료상태 != 진료상태Enum.TY09완료 ? today : ''}`);
    let acceptList = await accept.map(ac => {
      let matchingItems = union.filter(tr =>
        ac.챠트번호 + ac.진료일자 + ac.진료번호 + ac.유형번호 === tr.챠트번호 + tr.진료일자 + tr.진료번호 + tr.유형번호
      );

      return matchingItems.map(tr => ({
        자료구분: tr.자료구분,
        ID: tr.ID,
        챠트번호: tr.챠트번호,
        진료일자: tr.진료일자,
        처방일자: tr.처방일자,
        진료번호: tr.진료번호,
        코드: tr.코드,
        명칭: tr.명칭,
        투여량1회: tr.투여량1회,
        투여횟수: tr.투여횟수,
        투여일수: tr.투여일수,
        용법정보ID: tr.용법정보ID,
        용법코드: tr.용법코드,
        한방혈명명칭: tr.한방혈명명칭,
        의사사인: tr.의사사인,
        진료형태: ac.진료형태,
        보험구분: ac.보험구분,
        수납금액: ac.수납금액,
        전달부서: tr.전달부서,
        항목구분: tr.항목구분,
        처방메모: tr.처방메모,
        급여적용: tr.급여적용
      }));
    });

    PastMedicalRecordsTableCreate(acceptList, treat_dx);
  } catch (error) {
    console.log(t_CHART);
    if (t_CHART != undefined) {
      console.log(error);
    }
  }
}

async function GetDx(chartNum) {
  // Assume trlLst조회항목.Properties.TreeList is an object with a method GetAllCheckedNodes()
  // const GetAllCheckedNodes = trlLst조회항목.Properties.TreeList.GetAllCheckedNodes;
  // const SearchTypeEnum = {
  //     PDR31상병: 0 // Replace with actual values
  // };

  // if (!GetAllCheckedNodes().find(node => node.Value === SearchTypeEnum.PDR31상병)) {
  //     return null;
  // }

  const str시작일자 = HyphenReplace(document.getElementById('pastDay1').value);
  const str종료일자 = HyphenReplace(document.getElementById('pastDay2').value);

  var query = `SELECT
    CAST(1 AS SIGNED) AS 자료구분,
      ID_DX_TREAT AS ID,
        CD_CHART AS 챠트번호,
          DS_TREAT AS 진료일자,
            DS_DX AS 처방일자,
              NO_TREAT AS 진료번호,
                CD_DX AS 코드,
                  NO_DX_ORDER AS 코드순서,
                    NM_DX_HAN AS 명칭,
                      0 AS 투여량1회,
                        0 AS 투여횟수,
                          0 AS 투여일수,
                            '' AS 용법정보ID,
                              '' AS 한방혈명명칭,
                                SGN_DOCTOR AS 의사사인,
                                  NO_TREAT_TY AS 유형번호,
                                    '' AS 전달부서,
                                      '' AS 항목구분,
                                        '' AS 처방메모,
                                          '' AS 급여적용
    FROM
    T_TREAT_DX
    WHERE
    CD_CHART = '_챠트번호'
    AND DS_DX >= 'str시작일자'
    AND DS_DX <= 'str종료일자'
    AND(DS_DX_END = '' OR DS_DX_END >= DS_DX)
  ORDER BY
    BL_DX_MAIN DESC,
      NO_DX_ORDER`;

  var result = await GetData(query);
  return result;
}

async function GetTreat(chartNum, date) {
  let str시작일자;
  let str종료일자;
  if (date == undefined) {
    str종료일자 = HyphenReplace(document.getElementById('diagNoteEDay').value);
  }
  else {
    str종료일자 = date;
  }

  if (document.getElementById('diagNoteSDay')) {
    str시작일자 = HyphenReplace(document.getElementById('diagNoteSDay').value);
  }
  else {
    str시작일자 = date;
  }
  //--------------------------------------------------------------------------------------------------------------------
  //   FG_UPDT = 0 -- FG_UPDT가 0인 경우(FG00등록에 해당)
  //   AND CD_SPCL <> '${약품삭제DC}' -- CD_SPCL이 '특정코드값'이 아닌 경우
  //   AND CNT_DOSAGE > 0 -- CNT_DOSAGE가 0보다 큰 경우
  //   AND CD_CHART = '${chartNum}' -- CD_CHART가 '챠트번호값'인 경우
  //   AND DS_PRSCRPTN BETWEEN '${str시작일자}' AND '${str종료일자}' -- DS_PRSCRPTN이 시작일자와 종료일자 사이인 경우
  // AND(
  //   (FG_ITEM LIKE '${진찰료}' AND FG_TREAT_REG = 1)-- FG_ITEM이 '진찰료'로 시작하고 FG_TREAT_REG가 1인 경우
  //       OR FG_TREAT_REG <> 1 -- FG_TREAT_REG가 1이 아닌 경우
  //   )
  //--------------------------------------------------------------------------------------------------------------------

  var dataList = await GetData(`SELECT
  CAST(2 AS SIGNED) AS 자료구분,
  ID_TREAT AS ID,
  CD_CHART AS 챠트번호,
  DS_TREAT AS 진료일자,
  DS_PRSCRPTN AS 처방일자,
  CAST(NO_TREAT AS SIGNED) AS 진료번호,
  CD_PRSCRPTN AS 코드,
  NO_PRSCRPTN_ORDER AS 코드순서,
  NM_PRSCRPTN AS 명칭,
  AMT_DOSAGE_1TH AS 투여량1회,
  CNT_DOSAGE AS 투여횟수,
  CNT_DOSAGE_DAYS AS 투여일수,
  CD_USAGE AS 용법코드,
  CONCAT(FG_ITEM, CD_USAGE) AS 용법정보ID,  
  SGN_DOCTOR AS 의사사인,
  NO_TREAT_TY AS 유형번호,
  CD_DEPT_SPRT AS 전달부서,
  FG_ITEM AS 항목구분,
  DC_TREAT_MEMO AS 처방메모,
  TY_PAY_APLY AS 급여적용
  FROM
  T_TREAT
  WHERE
  FG_UPDT = 0 -- FG_UPDT가 0인 경우(FG00등록에 해당)    
    AND CD_CHART = '${chartNum}' -- CD_CHART가 '챠트번호값'인 경우
    AND DS_PRSCRPTN BETWEEN '${str시작일자}' AND '${str종료일자}' -- DS_PRSCRPTN이 시작일자와 종료일자 사이인 경우 
ORDER BY
  NO_PRSCRPTN_ORDER`);

  return dataList;
}

async function GetAccept(ChartNum) {
  var query = `SELECT
    a.NO_ACCEPT AS 접수번호,
      COALESCE(ai.DS_TREAT, a.DS_TREAT) AS 진료일자,
        a.CD_DEPT_SPRT AS 진료과목,
          CAST(a.TY_ACCEPT AS SIGNED) AS 진료형태,
            a.CD_CHART AS 챠트번호,
              CAST(a.NO_TREAT AS SIGNED) AS 진료번호,
                a.FG_ISRC AS 보험구분,
                a.TY_TREAT_STAT AS 진료상태,
                  COALESCE(ai.NO_TREAT_TY, 0) AS 유형번호,
                    CASE
        WHEN a.TY_ACCEPT <> 0 THEN - 1
    ELSE(
      SELECT COALESCE(SUM(MNY_TOTL_RCPT), 0)
            FROM T_ACCEPT_CHRG_PREV
            WHERE NO_ACCEPT = a.NO_ACCEPT
    )
    END AS 수납금액
    FROM
    T_ACCEPT AS a
  LEFT JOIN
    T_ACCEPTIN AS ai ON a.NO_ACCEPT = ai.NO_ACCEPT
    WHERE
    a.CD_CHART = '${ChartNum}'
    AND a.TY_TREAT_STAT <> 0
  GROUP BY
    a.NO_ACCEPT, COALESCE(ai.DS_TREAT, a.DS_TREAT), a.CD_DEPT_SPRT, CAST(a.TY_ACCEPT AS SIGNED), a.CD_CHART, CAST(a.NO_TREAT AS SIGNED), a.FG_ISRC, COALESCE(ai.NO_TREAT_TY, 0); `

  return await GetData(query);
}

function PastMedicalRecordsTableCreate(acceptList, treat_dx) {
  var container = document.getElementById('accordion-container');
  container.innerHTML = '';

  // var diagNoteSDay = document.getElementById('diagNoteSDay').value;
  // var diagNoteEDay = document.getElementById('diagNoteEDay').value;

  CreateRecordsAccordion(container, acceptList, treat_dx);
}

function CreateRecordsAccordion(container, acceptList, treat_dx) {
  try {
    var checkDay = '';

    var accordionButton = [];
    var accordionContent = [];
    var contentIdx = 0;

    acceptList = acceptList.reverse();
    for (let i = 0; i < acceptList.length; i++) {
      if (acceptList[i][0] !== undefined) {
        if (checkDay != acceptList[i][0].진료일자) {
          var accordionItem = document.createElement('div');
          accordionItem.className = 'accordion-item';

          var accordionHeader = document.createElement('h2');
          accordionHeader.className = 'accordion-header';

          accordionButton[i] = document.createElement('button');
          accordionButton[i].className = 'accordion-button collapsed';
          accordionButton[i].type = 'button';

          var FG_ISRC = (insuranceTypeList.find(t => t.CD_CODE_DTL == acceptList[i][0].보험구분) || {}).NM_CODE_DTL;
          var doctor = T_DOCTOR.find(t => t.ID_USER == acceptList[i][0].의사사인);
          accordionButton[i].textContent = `${acceptList[i][0].진료일자}/외래/${FG_ISRC}/${doctor.NM_USER}/₩0`;
          accordionButton[i].style.backgroundColor = "white";
          checkDay = acceptList[i][0].진료일자;

          accordionContent[i] = document.createElement('div');
          accordionContent[i].className = 'accordion-content';
          accordionContent[i].style.color = 'rgb(155,170,242)';

          accordionHeader.appendChild(accordionButton[i]);
          accordionItem.appendChild(accordionHeader);
          accordionItem.appendChild(accordionContent[i]);

          container.appendChild(accordionItem);

          // 아코디언 버튼 클릭 이벤트 핸들러
          accordionButton[i].addEventListener('click', function () {
            if (event.detail === 2) {
              accordionButton[i].classList.toggle('active');
              accordionContent[i].classList.toggle('active');
            }
            else if (event.detail === 1) {
              DisplayProgressNote(acceptList[i][0].진료일자);
            }
          });

          contentIdx = i;
        }

        if (treat_dx.length > 0) {
          for (let j = 0; j < treat_dx.length; j++) {
            if (acceptList[i][0].진료일자 == treat_dx[j].DS_TREAT) {
              var accordionBody = document.createElement('tbody');
              accordionBody.className = 'accordion-body';

              var html = '';
              html += treat_dx[j].CD_DX + '&nbsp&nbsp</td>';
              html += treat_dx[j].NM_DX_HAN + '&nbsp&nbsp</td>';
              html += treat_dx[j].BL_DX_MAIN == '1' ? '주상병' : '부상병' + '&nbsp&nbsp</td>';
              html += '</tr>';

              accordionBody.innerHTML = html;
              accordionContent[i].appendChild(accordionBody);
            }
          }
        }

        for (let j = 0; j < acceptList[i].length; j++) {
          var accordionBody = document.createElement('tbody');
          accordionBody.className = 'accordion-body';
          var html = '&nbsp&nbsp';
          html += acceptList[i][j].코드 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].명칭 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].투여량1회 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].투여횟수 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].투여일수 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].용법코드 == null || undefined || '' ? '' : acceptList[i][j].용법코드 + '&nbsp&nbsp</td>';
          html += acceptList[i][j].처방메모 + '&nbsp&nbsp</td>';
          html += '</tr>';
          accordionBody.innerHTML = html;
          accordionContent[i].appendChild(accordionBody);
        }
      }
    }

    for (let i = 0; i < accordionContent.length; i++) {
      if (accordionContent[i] != undefined) {
        accordionContent[i].className = 'accordion-content active';
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}  