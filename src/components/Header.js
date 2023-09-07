import React, { useState } from 'react';
import '../App.css';
import '../TabLayout.css';
import downarrow from '../downarrow.png';
import ReactDOM from 'react-dom';
// 
function Header({ accountName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    return (
      <div className='setting-bar'>
        <p className='accountHeader' onClick={openModal}>{accountName}</p><img onClick={openModal} src={downarrow} className="selectAccount" />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>모달 창</h2>
            <p>모달 내용이 여기에 들어갑니다.</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      </div>
    );
  }





export default Header;