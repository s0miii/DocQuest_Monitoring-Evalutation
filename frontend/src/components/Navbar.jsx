import React, {useState} from 'react'
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'

const NavBar = () => {
    const [nav, setNav] = useState(false)

    const handleNav = () => {
        setNav(!nav)
    }

  return (
    <div className='flex justify-between items-center h-20 max-w-[1240px] mx-auto p-4'>
        <h1 className='w-full text-4xl font-bold text-yellow-500'>DocQuest</h1>
        <ul className='flex hidden'>
            <li className='p-4'>Dashboard</li>
            <li className='p-4'>User Management</li>
            <li className='p-4'>Projects</li>
            <li className='p-4'>Documents</li>
            <li className='p-4'>Logout</li>
        </ul>
        <div onClick={handleNav}>
            {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
            
        </div>
        <div className={!nav ? 'fixed left-0 top-0 w-[30%] h-full border-r border-r-yellow-400 bg-custom-blue ease-in-out duration-500' : 'fixed left-[-100%]'}>
        <h1 className='w-full text-4xl font-bold text-yellow-500 m-4'>DocQuest</h1>

            <ul className='p-4'>
                <li className='p-4 text-white'>Dashboard</li>
                <li className='p-4 text-white'>User Management</li>
                <li className='p-4 text-white'>Projects</li>
                <li className='p-4 text-white'>Documents</li>
                <li className='p-4 text-white'>Logout</li>
            </ul>
        </div>
    </div>
  )
}

export default NavBar