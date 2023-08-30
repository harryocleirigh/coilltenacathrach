import React from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity } from '@fortawesome/free-solid-svg-icons'

export default function MobileNavbar ({ areAllTreesShowing}) {

  return (
    
    <div className="mobile-navbar">
      <div className="navbar-links-mobile">
        <FontAwesomeIcon 
          icon={faTreeCity} 
          onClick={() => window.location.reload()} 
          style={{height: '100%', width: '24px', cursor: 'pointer'}}/>
          <h1 className='h1-sidebar-heading-mobile'>Trees of Dublin</h1>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', gap: '24px'}}>
        <p style={{fontWeight: 700, fontSize: '10px'}}>{areAllTreesShowing ? "Displaying all trees" : "Displaying postcodes" }</p>
      </div>
    </div>
  );
} 