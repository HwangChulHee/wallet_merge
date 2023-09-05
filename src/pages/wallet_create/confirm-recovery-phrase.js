/*global chrome*/
import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
  } from 'react-chrome-extension-router';
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/card.css'
import {Button, Card, Form, InputGroup} from 'react-bootstrap';
import Completion from '../completion';
import React, { useState, useEffect } from 'react';
import Make_account from './make-account';


function getRandomIndices(array, count) {
  const length = array.length;
  const indices = [];
  
  while (indices.length < count) {
    const index = Math.floor(Math.random() * length);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  
  return indices;
}


function CircleText2(props) {

  const selectedIndices = props.selectedWords.map(item => item.index);


  return (
    <div className="circle-text-container">
           {props.words?.map((word, index) => (
            
            selectedIndices.includes(index) ? (
              <div key={index} className="circle-text-confirm-item">
                <span className="circle-text-index">{index + 1}.</span>
    
                  <input
                    className="circle-text-input"
                    type="text"
                    value={word}
                    onChange={event => props.handleWordChange(index, event.target.value)}
                  />
              </div>
            ) : (
              <div key={index} className="circle-text-item">
                <span className="circle-text-index">{index + 1}.</span>
    
                  <input
                    className="circle-text-input"
                    type="text"
                    value={word}
                    readOnly
                  />
              </div>
              )
                           
          ))}
    </div>
  );
}

async function key_store(data) {

  // 1. 현재 chrome.storage에 저장된 키 값들의 배열을 가져오고
  const result = await chrome.storage.local.get(["keys"]);
  console.log("key_store : 현재 저장된 key 값들",result);

  let updateData = [];
  if(result.keys) {
      //keys라는 key의 데이터가 존재할때. 이미 키들이 존재할 때를 의미.
      try {
          const keysArray = result.keys;
          if (Array.isArray(keysArray)) {
            updateData = keysArray;
            console.log("key_store : updateData에 과거 데이터 추가.")
          }
        } catch (error) {
          console.error("key_store : Error parsing keys:", error);
        }
  }
  console.log("key_store : updateData 확인 : ",updateData)

  
  // 2. 해당 배열에 새로 추가된 키를 넣어준다 (키 값들을 갱신한다.)
  const keyPairs = data.keyPairs[0]; // 매개변수 데이터로부터 key값이 keyParirs의 첫번째 원소들을 가져오고
  updateData.push(keyPairs); // 기존 데이터를 추가해준다.

  
  // 3. 해당 배열을 chrome.storage에 다시 넣어준다. (갱신한다)
  await chrome.storage.local.set({keys : updateData}); // 테스트를 위해 await 함
  const result2 = await chrome.storage.local.get(["keys"]);
  console.log("key_store : 갱신된 key 값들",result2);
  
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


export default function Confirm_recovery_phrase(message) {

  const [recoveryWords, setRecoveryWords] = useState([]);
  const [confirmWords, setConfirmWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  
  const [isCorrect, setIsCorrect] = useState(false); // 사용자가 니모닉 검증을 완료했는지 알아내는 변수

  
  const handleInitMnemonic = async () => {
    console.log("니모닉을 크롬 스토리지에 저장")
    console.log(recoveryWords)
   
    // 1. 니모닉 저장 요청
    chrome.storage.local.set({user_mnemonic : recoveryWords}).then(async () => {
      const mnemonic_result = await chrome.storage.local.get(["user_mnemonic"]);
      console.log("mnemonic 저장..")
      console.log(mnemonic_result)
      goTo(Completion);
    });
            
  };

  const handleWordChange = (index, value) => {
    const newWords = [...confirmWords];
    newWords[index] = value;

    setConfirmWords(newWords);
  };



  // 전달받은 니모닉을 저장하고, 검증할 단어들을 추리는 작업
  useEffect(() => {
    const words = Object.values(message).slice(0, 12); // 전달받은 니모닉
    
    console.log("전달 받은 값 파싱 : ",words)
    setRecoveryWords(words); // 저장, 비동기적..

    const randomIndices = getRandomIndices(words, 3);
    const selected = randomIndices.map(index => {
      return {
        index: index,
        word: words[index]
      };
    });

    console.log("선택된 값들 : ",selected)
    setSelectedWords(selected); // 저장, 비동기적..


    const modifiedWords = [...words]; // words 배열을 복사하여 수정할 배열 생성
    selected.forEach(item => {
      if (item.index !== null) {
        modifiedWords[item.index] = ''; // 해당 인덱스의 값을 null로 변경
      }
    });

    console.log("유저가 맞추어야 될 값들 : ",modifiedWords)
    setConfirmWords(modifiedWords);

    

  }, [message]); // 이 부분에서 message가 변경될 때만 실행

  
  // 사용자가 니모닉 단어를 입력할 때마다 검증해주는 메서드
  useEffect(() => {
    
    if (recoveryWords.length === 0 || confirmWords.length === 0) {
      setIsCorrect(false);
      return;
    }

    const isEqual = recoveryWords.every((value, index) => value === confirmWords[index]);
    if(isEqual) {
      
      console.log("검증 통과!")
      console.log("오리지널 : ", recoveryWords)
      console.log("입력값 : ", confirmWords)
      setIsCorrect(true);
    }

  }, [confirmWords, recoveryWords]);

  
    

    return (
      <div className='card-container'>
        <Card className="text-center" style={{ width: '30rem' }}>
          <Card.Body>
            <h3 className='mb-2'>비밀 복구 구문 확인</h3>
            
            <Card.Text className='mb-5'>
            비밀 복구 구문 확인 
            </Card.Text>

            <div className="mb-5 d-flex justify-content-center align-items-center">
              <CircleText2 words={confirmWords} selectedWords={selectedWords} handleWordChange={handleWordChange} />
            </div>
                  
            <Button onClick={handleInitMnemonic} disabled={!isCorrect} className="mb-2 btn_primary card-content">확인</Button>     
            {/* <Button onClick={()=>goTo(Completion)} className="mb-2 btn_primary card-content">테스트</Button>      */}
          </Card.Body>
        </Card>
      </div>
    )
}