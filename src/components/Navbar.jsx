// import React from 'react'
import { RxGithubLogo } from "react-icons/rx";


function Navbar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
        <div className="logo font-bold text-white text-xl">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </div>
        {/* <ul>
          <li className="flex gap-5">
            <a className="hover:font-bold" href="/">
              Home
            </a>
            <a className="hover:font-bold" href="#">
              About
            </a>
            <a className="hover:font-bold" href="#">
              Contact
            </a>
          </li>
        </ul> */}
          <button className="flex gap-1 text-white bg-green-700 my-5 rounded-full p-1 px-2 justify-center items-center cursor-pointer">
          <span className="font-bold px-1">GitHub</span>
          
          <RxGithubLogo className=" text-3xl "/>
          </button>
      </div>
    </nav>
  );
}

export default Navbar;
