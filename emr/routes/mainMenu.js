var openedWindows = [];

function LogOutPopup(bool) {
    if (bool) {
        document.getElementById('logoutPopup').style.display = "block";
    }
    else {
        document.getElementById('logoutPopup').style.display = "none";
    }
}

function LogOut() {
    var link = "loginTest";
    location.replace(link);
    location = link;
}

function HospitalMGRBtn(popupIdx) {
    this.popupIdx = popupIdx;
    window.open('popup', 'fullscreen=yes, resizable = no, scrollbars = no');
}

function OpenPop(url, name) {
    // 이미 열려있는 창인지 확인
    var existingWindow = openedWindows.find(function (win) {
        return win.location.href.indexOf(url) > -1;
    });

    console.log(existingWindow);
    if (existingWindow) {
        // 이미 열려있는 창이면 해당 창으로 이동       
        existingWindow.focus();
    } else {
        var isStr = isNaN(url);
        var newWindow;
        if (isStr) {
            newWindow = window.open(url, '_blank');
        }
        else {
            this.popupIdx = url;            
            newWindow = window.open('popup', name, 'fullscreen=yes');
        }
        openedWindows.push(newWindow);
    }
}