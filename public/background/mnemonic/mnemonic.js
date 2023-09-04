/*
    니모닉 및 계정과 관련된 파일

    1. memonic_init : 
        1) 니모닉을 저장하고
        2) 니모닉과 초기 숫자(0)를 api 서버에 요청해서, 요청된 니모닉으로부터 생선된 키를 받아온다.

    2. account_create :
        1) 현재 storage에 저장된 계정의 개수(num_account)를 알아낸다.
        2) 니모닉과 저장된 계정의 개수+1(num_account+1)를 api 서버로 요청한 뒤, 응답값인 키를 받아온다.
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if(message.action === "mnemonic_init") {
        console.log("service-worker : mnemonic_init", message)
        
        /*
            1. 니모닉을 저장해준다.
        */
        chrome.storage.local.set({user_mnemonic : message.mnemonic}).then(() => {
            console.log("mnemonic 저장..")
        })


        /*
            2. 니모닉과 초기 숫자(0)를 api 서버에 요청해서, 키 값을 받아온다.
        */
        const url = "http://221.148.25.234:3100/key_create_from_mnemonic";
        const data = {
            mnemonic: message.mnemonic,
            num_child: 0,
          };
        
        postJSON(url, data).then((data) => {
            key_store(data)
        });
 
         return true; // 비동기 통신과 연관이 있다.

    } else if(message.action === "account_store") {

        // 추후 배열로 바꿀 것.

        const obj = {account_name : message.account_name, publicKey : message.publicKey, privateKey : message.privateKey }
        
        chrome.storage.local.set({accounts : obj}).then(() => {
            console.log("account 저장..")
        })

        return true; // 비동기 통신과 연관이 있다.        
    }
 
});


async function key_store(data) {

    // 1. 현재 chrome.storage에 저장된 키 값들의 배열을 가져오고
    const result = await chrome.storage.local.get(["keys"]);
    console.log("현재 저장된 key 값들",result);

    let updateData = [];
    if(result.keys) {
        //keys라는 key의 데이터가 존재하지 않거나 해당 값의 값들이 배열이 아닐때.. 즉, 초기값일 때를 의미함.
        try {
            const keysArray = result.keys;
            if (Array.isArray(keysArray)) {
              updateData = keysArray;
              console.log("updateData에 과거 데이터 추가.")
            }
          } catch (error) {
            console.error("Error parsing keys:", error);
          }
    }
    console.log("updateData 확인 : ",updateData)

    
    // 2. 해당 배열에 새로 추가된 키를 넣어준다 (키 값들을 갱신한다.)
    const keyPairs = data.keyPairs[0]; // 매개변수 데이터로부터 key값이 keyParirs의 첫번째 원소들을 가져오고
    updateData.push(keyPairs); // 기존 데이터를 추가해준다.

    
    // 3. 해당 배열을 chrome.storage에 다시 넣어준다. (갱신한다)
    await chrome.storage.local.set({keys : updateData}); // 테스트를 위해 await 함
    const result2 = await chrome.storage.local.get(["keys"]);
    console.log("갱신된 key 값들",result2);
    
}


async function postJSON(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("postJSON Success:", result);
    return result;
    
  } catch (error) {
    console.error("postJSON Error:", error);
  }
}

