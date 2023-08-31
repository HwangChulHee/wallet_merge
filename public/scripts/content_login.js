console.log("크립토 익스플로러~")

const btn_login = document.getElementById("login");


//서비스 워커에게 데이터 요청.. 디앱 로그인을 위한 index.html을 띄어주기만 한다.
btn_login.addEventListener("click", function(event) {
    console.log("클릭 이벤트 발생")
    chrome.runtime.sendMessage(
        { action: "dapp_login"}, 
        (respoonse) => {
            console.log("클릭 이벤트 관련 서비스 워커로부터 응답")
            console.log(respoonse)
    });
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

      if (request.action === "login_complete_from_extension") {
        
        console.log("여기다 로직을 작성하면됨!")
        const buttonElement = document.getElementById('login_complete');
        const accountNameInput = document.getElementById('UserName');
        const publicKeyInput = document.getElementById('UserKey');

        if (buttonElement) {

                accountNameInput.value = request.account_name;
                publicKeyInput.value = request.public_key;
                buttonElement.click(); // 이벤트 트리거 시켜주기
        } else {
            console.error('버튼을 찾을 수 없음');
        }
      }
        
    }
  );
