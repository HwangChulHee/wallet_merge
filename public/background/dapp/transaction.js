/*
    디앱 트랜잭션 관련 파일
*/

let popupWindow = null; // 팝업창의 id를 저장한다.
let tab_id_vote = null; // 해당 버튼을 누른 tab의 id를 저장한다.

let auth_name = null;
let data = null;
let action_account = null;
let action_name = null;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if (message.action === "dapp_trx") {
        // 디앱 트랜잭션 요청 시

        auth_name = message.auth_name;
        data = message.data;
        action_account = message.action_account;
        action_name = JSON.parse(message.action_name); // 정보 저장

        // request_state 저장. 이 정보를 통해 index.html이 팝업창에 어떤 ui를 띄어줄지 결정한다.        
        chrome.storage.local.set({request_state : "dapp_trx"}).then(() => {
            
            console.log("request_state에 dapp_transaction 저장...")
            chrome.windows.create({
                url: "index.html",
                type: "popup",
                width: 400,
                height: 600
              }, function(data) {
                popupWindow = data.id;
                console.log(popupWindow)
              });
            
        })

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            tab_id_vote = tabs[0].id;
            console.log("tab id 저장.", tab_id_vote)
            // 여기에서 tab 변수를 사용하여 원하는 작업을 수행
          });


        sendResponse("디앱 트랜잭션 처리를 위한 index.html 오픈.");
        return true; // 비동기 통신과 연관이 있다.
    
    } else if(message.action === "trx_request") {

        console.log("트랜잭션 처리 요청. 계정 정보 조회...")

        // 선택된 계정의 이름과 public 키
        trx_process();

        
        
        //return true; // 비동기 통신과 연관이 있다.

    } else if(message.action === "trx_close") {

        console.log("트랜잭션 팝업 창 닫기. ")
        console.log(popupWindow)

        chrome.windows.remove(popupWindow, function() {
            console.log("로그인 팝업 창 닫기 완료 ")            
        });
    }
 
});

// 버튼을 누르면 input태그에 있는 auth_name, data, action_account, action_name을 가져온다.
function trx_process() {

    chrome.storage.local.get(['keys'], (result) => {
        const storedData = JSON.parse(result.keys); 
        console.log(storedData);
        
        let senderPrivateKey = storedData[0].privateKey;
        
        console.log("api 요청하기전")
        console.log(senderPrivateKey);
        console.log(auth_name);
        console.log(data);
        console.log(action_account);
        console.log(action_name); 
        
        const apiUrl = "http://221.148.25.234:8989/startTransaction"; // 니모닉으로부터 키 생성하는 api
        const datas = {
            senderPrivateKey,
            action_account,
            action_name,
            auth_name,
            data
          };

          console.log(JSON.stringify({
            datas: datas
          }))

        // fetch 함수를 사용하여 API 요청 보내기
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               datas: datas
             })
        })
            .then(response => {
                // 응답을 JSON으로 파싱
                return response.json();
            })
            .then(data => {
                // API 응답 데이터 처리
                console.log("투표 트랙잭션 API 응답 데이터:", data);
                trx_complete(data)
                
            })
            .catch(error => {
                // 에러 처리
                console.error("투표 트랙잭션 API 요청 중 에러:", error);
            });
        
      });
    
}

function trx_complete (data) {

    chrome.tabs.sendMessage(tab_id_vote, { 
        action: "trx_complete_from_extension", 
        result: data.result,
        status : data.status}, (response) => {
        
        // 여기에서 response를 사용하여 원하는 작업을 수행
        console.log("콘텐츠 스크립트로 데이터 전송..", response)

        chrome.windows.remove(popupWindow, function() {
            console.log("트랜잭션 팝업 창 닫기 완료 ")            
        });
      });
}
