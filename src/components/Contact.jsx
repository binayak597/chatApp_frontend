import React from 'react'
import Avatar from './Avatar'

const Contact = ({id, onClick, online, username, selected}) => {
    return (
        <div key={id} onClick={onClick} className={'flex items-center gap-2 border-b border-gray-200 cursor-pointer ' + (selected ? 'bg-blue-100' : '')}>
            {selected && (<div className='w-1 h-12 bg-blue-600 rounded-r-md'></div>)}
            <div className='flex gap-2 items-center pl-4 py-2'>
                <Avatar online={online} username={username} userid={id} />
                <span className='text-gray-800'>{username}</span>
            </div>
        </div>
    )
}

export default Contact