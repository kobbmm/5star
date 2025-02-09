import React from 'react';

const VerificationCode = () => {
  return (
    <div>
      <h1>Verification Code</h1>
      <form>
        <label>
          Code:
          <input type="text" name="code" />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerificationCode;