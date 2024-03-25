import { FcLike } from "react-icons/fc";


function Footer() {
  return (
    // <div className='bg-slate-800 text-white flex flex-col justify-end items-center fixed bottom-0 w-full'>
    <div className='bg-slate-800 text-white flex flex-col justify-end items-center  w-full'>

        <div className="logo font-bold text-white text-xl">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </div>
        <div className='flex gap-1 p-1 items-center'>

        Created With <FcLike className='text-2xl ' /> by Purushottam
        </div>
    </div>
  )
}

export default Footer