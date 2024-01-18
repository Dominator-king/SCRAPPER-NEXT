import React from 'react'

function Card({title, img, price,link}) {
  return (
    <a href={link} className='ml-5 mt-5 mb-8 flex flex-col basis-full md:basis-1/3 transition-all  ease-in-out hover:scale-110 hover:shadow-md hover:shadow-purple-500 duration-300 '><img width={300} src={img} alt="" />
    <div className='flex flex-col'>
        <h3 className='text-xl font-bold '>{title}</h3>
        <h3>{price}</h3>
     </div></a>
  )
}

export default Card