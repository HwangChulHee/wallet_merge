const buttonElement = document.getElementById('login_complete');
const infoAccountInput = document.getElementById('info_account');

if (buttonElement) {
    infoAccountInput.value = "abc";
    buttonElement.click();
} else {
    console.error('버튼을 찾을 수 없음');
}