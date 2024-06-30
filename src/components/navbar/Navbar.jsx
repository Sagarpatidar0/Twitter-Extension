import React from 'react'

export default function Navbar() {
  return (<>
    <div className="flex h-8 relative justify-center items-center bg-gray-700" id='navbar'>
      <div className="font-bold text-sm">SmartTweet</div>
      <div className="absolute right-0">
        <img onClick={() => {window.open('https://github.com/Sagarpatidar0/Twitter-Extension')}} className='w-8 p-1 cursor-pointer' src="images/github-mark-white.png" alt="" />
      </div>
    </div>
  </>
  )
}
