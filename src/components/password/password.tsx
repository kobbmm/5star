import React from 'react';

const ResetPassword = () => {
  return (
    <div>
      <h1>Reset Password</h1>
      <form>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;