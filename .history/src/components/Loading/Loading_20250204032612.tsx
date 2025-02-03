import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="loading-container" role="alert" aria-busy="true">
      <div className="loading-spinner">
        <div className="spinner" aria-hidden="true"></div>
        <p className="loading-text">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );
};

export default Loading;
