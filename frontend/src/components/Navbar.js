import React, { useState } from 'react';
import logoImage from '../images/gull.png'
import '../App.css';


export default function Navbar() {

  return (
    
    <div className="navbar">
      <div className="navbar-links-wrapper">
      <button className="transparent-button" >
          <img
          className='navbar-logo'
            src={logoImage}
          />
        </button>
      </div>
    </div>
  );
}
