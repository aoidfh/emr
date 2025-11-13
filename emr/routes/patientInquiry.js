async function PatientSearchBtn(value, isGetChart = false) {
    // if (value == undefined || value == '') {
    //     alert("환자 정보가 없습니다.");
    //     return;
    // }    

    var data;
    //환자기본정보 - 문자열인지 확인
    if (isNaN(value)) {
        data = await GetData(`SELECT * FROM T_CHART WHERE NM_CHART LIKE '%${value}%'`);
        tempfilteredData = data;
    }
    else {
        data = await GetData(`SELECT * FROM T_CHART WHERE CD_CHART LIKE '${value}'`);
        tempfilteredData = data;
    }

    if (isGetChart) {
       return data[0];
    }
    else {
        if (data.length == 1) {
            if (!document.getElementById('popup')) {
                PatientInquiryBtn(data[0]);
            }
            else {
                if (popIdx == 25) {
                    ReservationSearch(data);
                }
                else {
                    PatientTableListCreate(data);
                }
            }
        }
        else {
            if (!document.getElementById('popup')) {
                PopupOn(0, false, 810, 750, data, value);
            }
            else {
                PatientTableListCreate(data);
            }

        }
    }

}