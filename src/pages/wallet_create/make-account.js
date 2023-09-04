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
import axios from 'axios';



export default function Make_account() {

  const [accountName, setAccountName] = useState('');
  const [isValidAccount, setIsValidAccount] = useState(true);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [tid, setTid] = useState('');

  useEffect(() => {
    // public key 요청.. 
    chrome.storage.local.get(['keys'], (result) => {
      const storedData = result.keys; 
      setPublicKey(storedData[0].publicKey);
      setPrivateKey(storedData[0].privateKey);
      console.log("배열의 개수 : "+storedData.length)
      console.log("public key의 값 : "+storedData[0].publicKey)
      console.log("private key의 값 : "+storedData[0].privateKey)
    });
    
  }, [])

  const handleAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };

  const handleCreateAccount = (event) => {
    // 계정 생성 관련 핸들러
    createAccount();
  };

  const createAccount = async () => {
    try {
      const createName = accountName
      const datas = {createName, publicKey}
      const response = await axios.post('http://221.148.25.234:8989/createAccount', {datas});
      console.log(response.data.result.transaction_id);
      setTid(response.data.result.transaction_id)

      // 이후 로컬 스토리지에 계정 이름을 저장해준다.
      chrome.runtime.sendMessage(
        { action: "account_store", account_name: accountName, publicKey : publicKey, privateKey : privateKey}
    );
      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


    return (
      <div className='card-container'>
        <Card className="text-center" style={{ width: '30rem', minHeight:'30rem' }}>
          <Card.Body>
          <div className="d-flex flex-column justify-content-between h-100" style={{ minHeight: '500px' }}>
            <div>
              <h3 className='mb-2'>계정 생성 (임시 페이지)</h3>
              
              <Card.Text className='mb-5'>
              계정을 생성하세요.
              </Card.Text>

              <div className="mb-5 mx-5 input-content">
                <Form.Label htmlFor="password">publicKey (m/44'/1207'/0/0)</Form.Label>
                <InputGroup className='my-input'>
                  <Form.Control
                    type='text'
                    value={publicKey}
                    readOnly
                  />              
                </InputGroup>
              </div> 

              <div className="mb-3 mx-5 input-content">
                <Form.Label htmlFor="password">계정명</Form.Label>
                <InputGroup className='my-input'>
                  <Form.Control
                    type='text'
                    value={accountName}
                    onChange={handleAccountNameChange}
                  />              
                </InputGroup>
                {!isValidAccount && (
                <div className="mt-2 text-danger form_check_div">계정명이 중복되었습니다.</div>
              )}
              </div> 

              <div className="mb-5 mx-5 input-content">
                <Form.Label htmlFor="password">트랜잭션 id</Form.Label>
                <InputGroup className='my-input'>
                  <Form.Control
                    type='text'
                    value={tid}
                    readOnly
                  />              
                </InputGroup>
              </div> 

            </div>
            <div>
              <Button onClick={handleCreateAccount} className="mb-2 btn_primary card-content">계정 생성</Button>      
            </div>
          </div>
           
                  
            
          </Card.Body>
        </Card>
      </div>
    )
}