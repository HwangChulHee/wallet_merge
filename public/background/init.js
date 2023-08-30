 /* 
    초기 설정 관련 파일. 설치 시, welcome 페이지를 띄워준다.
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log("설치 완료.")

    chrome.tabs.create({ url: "index.html"}); // welcome 페이지를 띄어준다.
});