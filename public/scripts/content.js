console.log("콘텐츠 스크립트 실행")

/* 
    컨텐츠 스크립트를 통해 동적 생성 하는 예제 
*/

// container의 id 값 가져옴
const btn_login = document.getElementById("login");

btn_login.addEventListener("click", function(event) {
    chrome.runtime.sendMessage(
        { action: "login"}, 
        (respoonse) => {
            console.log("클릭 이벤트 관련 서비스 워커로부터 응답")
            console.log(respoonse)
            const buttonElement = document.getElementById('my');
            const infoAccountInput = document.getElementById('info_account');

            if (buttonElement) {
                infoAccountInput.value = "abc";
                buttonElement.click();
            } else {
                console.error('버튼을 찾을 수 없음');
            }
    });
})

