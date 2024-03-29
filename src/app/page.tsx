"use client";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="navbar">
        <div className="links">
          <Link href="/Signup">Signup</Link>
          <Link href="/Login">Login</Link>
        </div>
      </div>
      <div className="container">
        <h1 className="animated-text">Welcome to the Website</h1>
      </div>
    </>
  );
};

export default Home;
