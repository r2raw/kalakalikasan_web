import React, {useEffect, useState} from 'react'
import AdminNavItem from './AdminNavItem';
function AdminNavList({list_nav}) {
  
  // const [selectedNav, setSelectedNav] = useState(null);
  // useEffect(()=>{
  //   setSelectedNav(null)
  // },[]);
  // const navClicked = (navItem) => {
  //   if (selectedNav === navItem.title) {
  //     setSelectedNav(null);
  //     return;
  //   }
  //   setSelectedNav(navItem.title);
  // };

  
  const [selectedNav, setSelectedNav] = useState(null);
  return (
    <ul>
      {list_nav.map((item) => {
        return <AdminNavItem key={item.title} item={item} selectedNav={selectedNav} setSelectedNav={setSelectedNav} />;
      })}
    </ul>
  )
}

export default AdminNavList