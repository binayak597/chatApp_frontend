import React from 'react'

const Avatar = ({username, userid, online}) => {
    const colors= ['bg-teal-200', 'bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-pink-200', 'bg-lime-200','bg-cyan-200'];
    const userIdBase10 = parseInt(userid, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
    
  return (
    <div className={'relative w-8 h-8 rounded-full flex items-center gap-1 ' + color}>
        <div className='text-center w-full opacity-70'>{username[0]}</div>
        {online && (<div className='absolute w-2 h-2 bg-green-500 bottom-0 right-0 rounded-full border border-white'></div>)}
        {!online && (<div className='absolute w-2 h-2 bg-gray-400 bottom-0 right-0 rounded-full border border-white'></div>)}
    </div>
  )
}

export default Avatar