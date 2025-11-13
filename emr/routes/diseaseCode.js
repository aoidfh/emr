
function DiseaseCodeInputCreate() {
  var table = document.getElementById('diseaseCodeList');
  baseRecipeCode = table.rows[0];
  table.deleteRow(0);
  var rowData;
  if (document.getElementById('doctorRoom')) {
    rowData = ['>', '<input type="text"style="width: 95%; border: none; background-color: white; text-align: center;"  onkeyup = "if(window.event.keyCode==13){DiseaseCodeBtn(this.value,true);}">',
      '<input type="text"style="width: 95%; border: none; background-color: white; text-align: center;"  onkeyup = "if(window.event.keyCode==13){DiseaseCodeBtn(this.value, false);}">',
      '']
  }
  else {
    rowData = ['>', '', '<input type="text"style="width: 95%; border: none; background-color: white; text-align: center;"  onkeyup = "if(window.event.keyCode==13){DiseaseCodeBtn(this.value,true);}">',
      '<input type="text"style="width: 95%; border: none; background-color: white; text-align: center;"  onkeyup = "if(window.event.keyCode==13){DiseaseCodeBtn(this.value, false);}">',
      '', '', '', '']
  }
  var newRow = table.insertRow(0);
  for (var i = 0; i < rowData.length; i++) {
    var cell = newRow.insertCell(i);
    cell.innerHTML = rowData[i];
  }
}

function DiseaseCodeBtn(value, isCode) {
  if (value.length <= 1) {
    alert('검색어를 두 글자 이상 입력해주세요.');
    return;
  }

  PopupOn(26, false, 900, 650, value, isCode);

  // var table = document.getElementById('diseaseCodeList');
  // table.deleteRow(0);
  // var newRow = table.insertRow(0);
  // newRow.outerHTML = baseRecipeCode.outerHTML;
}

async function Insert상병(obj, accept) {
  let 기준일자 = document.getElementById('patientListDate').value;
  let list = treatDXList; //상병리스트     

  let newrow = new 진료상병();  
  newrow.진료일자 = t_ACCEPT.DS_TREAT;
  newrow.챠트번호 = t_ACCEPT.CD_CHART;
  newrow.진료번호 = t_ACCEPT.NO_TREAT === undefined ? 0 : accept.NO_TREAT;
  newrow.상병일자 = 기준일자;
  let table = document.getElementById('diseaseCodeList');

  newrow.상병번호 = table.rows.length;

  newrow.상병코드 = obj.상병코드;
  newrow.표시명칭 = obj.표시명칭;
  newrow.영문명칭 = obj.영문명칭;
  newrow.특정기호 = obj.특정기호;
  newrow.한글명칭 = obj.한글명칭;

  if (list === undefined || list.length == 0) {
    var t_DX_INFO = await GetData('SELECT * FROM T_DX_INFO');
    if (t_DX_INFO.find(t => t.CD_DX === newrow.상병코드 && t.BL_DX_MAIN_USE === 1)) {
      newrow.주상병 = true;
    }
  }
  else {
    if (list.filter(t => t.주상병 === newrow.주상병)) {
      newrow.주상병 = false; // 이미 주상병 존재 시 현재 입력하는 상병은 주상병 해제
    }
  }

  newrow.유형번호 = 0;
  newrow.진료실코드 = accept.CD_DEPT_SPRT;
  newrow.진료과목 = accept.CD_TREAT_SBJT;
  //newrow.수정자 = _사용자정보.사용자ID;
  //newrow.등록자 = _사용자정보.사용자ID;
  newrow.상병종료 = "";
  //newrow.협진정보ID = _currentIdConsult;

  // if (_사용자정보.직분구분 === 직분구분Enum.FG00의사) {
  //   newrow.의사사인 = _사용자정보.사용자ID;
  // } else {
  //   if (_current진료형태 === 진료형태Enum.TY00외래) {
  //     newrow.의사사인 = _currentAccept.ID_DOCT;
  //   } else {
  //     let strIdDoct = "";

  //     if (_currentIdConsult > 0) {
  //       strIdDoct = _db.T_CONSULT.find(t => t.ID_CNSLT === _currentIdConsult).ID_DOCT_TO;
  //     } else {
  //       let q = _db.T_INCHANGE.filter(t => t.ID_ACCEPTIN === _currentAcceptIn.ID_ACCEPTIN && t.DS_INCHANGE <= 기준일자).map(t => t.ID_DOCT);
  //       strIdDoct = q[0];
  //     }

  //     if (strIdDoct) {
  //       newrow.의사사인 = strIdDoct;
  //     } else {
  //       newrow.의사사인 = _db.T_ACCEPT.find(t => t.NO_ACCEPT === _currentAcceptIn.NO_ACCEPT).ID_DOCT;
  //     }
  //   }
  // } 

  newrow.양한방구분 = 0; //양방

  AddTo상병(newrow, t_ACCEPT);
  diseaseLstToAdd.push(newrow);
  DiseaseDetailsTableCreate(diseaseLstToAdd, true);
}

//상병내역 리스트
function DiseaseDetailsTableCreate(t_treatDX, isAdd = false) {
  console.log('diag 상병내역 리스트');
  var table = document.getElementById('diseaseCodeList');
  var rowCount = table.rows.length;
  let str;
  treatDXList = null;
  treatDXList = t_treatDX;
  if (!isAdd) {
    // 테이블의 첫 번째 행은 헤더입니다. 이를 제외한 모든 행을 삭제합니다.
    for (var i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
    }
        
    for (let i = 0; i < treatDXList.length; i++) {
      var html = '';
      html += '<tr>';
      html += '<td></td>';
      html += '<td>' + treatDXList[i].CD_DX + '</td>';
      html += '<td>' + treatDXList[i].NM_DX_HAN + '</td>';
      str = treatDXList[i].BL_DX_MAIN == true ? '주상병' : '부상병';
      html += '<td>' + str + '</td>';
      $("#diseaseCodeList").append(html);
    }
  }
  else {
    for (let i = 0; i < treatDXList.length; i++) {
      if (treatDXList[i].상병번호 >= rowCount) {
        var html = '';
        html += '<tr>';
        html += '<td></td>';
        html += '<td>' + treatDXList[i].상병코드 + '</td>';
        html += '<td>' + treatDXList[i].한글명칭 + '</td>';
        str = treatDXList[i].주상병 === true ? '주상병' : '부상병';
        html += '<td>' + str + '</td>';
        $("#diseaseCodeList").append(html);
      }
    }
  }
}