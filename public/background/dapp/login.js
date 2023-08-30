/*
    디앱 로그인 관련 파일
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if (message.action === "login") {
        // 비밀번호 저장

        console.log("로그인 버튼 클릭 이벤트 발생...")
        chrome.windows.create({
            url: "popup/test.html",
            type: "popup",
            width: 400,
            height: 600
          });
        sendResponse("select_account.html 오픈.");

        return true; // 비동기 통신과 연관이 있다.
        

    }
 
});