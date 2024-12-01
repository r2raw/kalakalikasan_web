import React from 'react'

import recycle_img from "../../assets/images/recycle_image.png";

function PageHeader({aboutPage, textHeader}) {
  return (
    <div className="flex flex-col items-center text-dark_font mb-16 mt-8">
      <img className=" w-20" src={recycle_img} />
      <h2 className="text-white lift font-mono font-bold">{textHeader}</h2>
      {aboutPage && <h4 className=" drop-shadow-lg lift font-mono">MORE ABOUT US</h4>}
    </div>
  )
}

export default PageHeader