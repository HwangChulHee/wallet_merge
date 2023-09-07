import React, { useState } from 'react';
import '../App.css';
import {
    popToTop,
  } from 'react-chrome-extension-router';


const StakingTab = ({setCPU_staking, setRAM_staking, hep_integer, account_name}) => {

    const [CPU_amount, setCPU_amount] = useState();
    const [RAM_amount, setRAM_amount] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [header,setHeader]=useState();
    const [result,setResult]=useState();
    const [trx,setTrx]=useState();
    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        popToTop();
      };

    function percentageClinck(percent,type)
    {
        var value=(hep_integer*percent)/100;    //퍼센터처리부터
        value=value/10000;          
        value=parseFloat(value.toFixed(4))      //소수점 4째자리까지 표시
        if(type==="CPU")
        {
            setCPU_amount(value);
            setCPU_staking(value);
        }else if(type==="NET")
        {
            setRAM_amount(value);
        }
    }

    const resourceStaking = () => {
        const apiUrl = 'http://221.148.25.234:8989/resourceStaking';
        
        // POST 요청에 사용할 데이터
        // nodejs서버에서 datas안에 accountName으로 받음
        const data = {
          datas: {
            privateKey: '5JwpGuCc1y63xDe6TPxZzf9NJLqGj5eYNTwttVifcqTPxmbyR1Z',
            accountName: 'producer1', // 실제 데이터 값
            cpuQuantity: CPU_amount,
            netQuantity: RAM_amount
          }
        };
        // POST 요청 보내기
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setTrx(data.result)
          if(data.status ==='SUCCESS')
          {
            setResult("전송 완료 ID : "+data.result.transaction_id);
            setHeader("트랜잭션 성공");
          }else
          {
            setResult("스테이킹 실패하였습니다.");
            setHeader("트랜잭션 실패");
          }
          openModal();
        })
          .catch(error => {
            console.error('Error posting data:', error);
            setResult("실패");
            openModal();
          });
      };




    return (
        <div className='StakingTabDiv'>
            {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{header}</h2>
  
            <p className='result'>{result}</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
            <div className='AmountDiv'>
                <input type='number' className='AmountInput' value={CPU_amount} onChange={(e) => setCPU_amount(e.target.value)} 
                onBlur={(e) => setCPU_staking(e.target.value)} placeholder="Amount of CPU to Stake(HEP)"></input>
                <p className='symbol'>
                    HEP
                </p>
            </div>
            <div className='selectPercentDiv'>
                <button className='selectPercentButton' onClick={() => percentageClinck(25, "CPU")}>25%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(50, "CPU")}>50%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(75, "CPU")}>75%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(100, "CPU")}>100%</button>
            </div>
            <div className='AmountDiv'>
                <input type='number' className='AmountInput' value={RAM_amount} onChange={(e) => setRAM_amount(e.target.value)} 
                onBlur={(e) => setRAM_staking(e.target.value)} placeholder="Amount of NET to Stake(HEP)"></input>
                <p className='symbol'>
                    HEP
                </p>
            </div>
            <div className='selectPercentDiv'>
                <button className='selectPercentButton' onClick={() => percentageClinck(25, "NET")}>25%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(50, "NET")}>50%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(75, "NET")}>75%</button>
                <button className='selectPercentButton' onClick={() => percentageClinck(100, "NET")}>100%</button>
            </div>
            <div className='bottomDiv'>


                    <button className='sendButton'  onClick={() => resourceStaking()}>
                        스테이킹
                        {/* 전송하는 함수 만들어서 넣어야 됨. 그리고 결과 보여주고 메인화면으로*/}
                    </button>
            </div>
        </div>
    );
};

export default StakingTab;