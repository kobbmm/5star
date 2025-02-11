import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        <li><Link href="/welcome">Welcome</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
        <li><Link href="/verification">Verification Code</Link></li>
        <li><Link href="/reset">Reset Password</Link></li>
        <li><Link href="/registration">Phone Registration</Link></li>
      </ul>
    </div>
  );
};

export default HomePage;