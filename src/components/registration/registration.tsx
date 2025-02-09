import React from 'react';

const PhoneRegistration = () => {
  return (
    <div>
      <h1>Phone Registration</h1>
      <form>
        <label>
          Phone Number:
          <input type="tel" name="phone" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default PhoneRegistration;