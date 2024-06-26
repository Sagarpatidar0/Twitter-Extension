import React from 'react'
import './Navbar.css'

export default function Navbar() {
  return (
    <div id='navbar'>
        <div className="nav-item"></div>
        <div className="nav-item font-bold">Twitter AI</div>
        <div className="nav-item share">
            <img src="images/share.png" alt="" />
        </div>
    </div>
  )
}
