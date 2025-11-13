async function ChangePassword() {  
   
}

async function LoginBtn() {
    const office_id = "1011"; //document.getElementById("office").value;
    const user_id = document.getElementById("id").value;
    const password = document.getElementById("password").value;

    console.log(user_id);
    console.log(password);
    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({  user_id, password })
        });

        // 서버 응답 처리
        if (response.ok) {
             const data = await response.json();
             console.log("서버 응답 데이터:", data);

             const { code, msg } = data;
             console.log("msg:", msg);
             if(msg == "success")
             {
                console.log("로그인성공");
                location.href = "mainMenu";
             }

        } else {
            console.error("서버 응답 오류:", response.status);
        }
    } catch (error) {
        console.error("비동기 작업 중 오류 발생:", error);
    }

}
