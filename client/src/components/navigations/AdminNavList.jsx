import React from 'react'
import AdminNavItem from './AdminNavItem';
function AdminNavList({list_nav}) {
  return (
    <ul>
      {list_nav.map((item) => {
        return <AdminNavItem key={item.title} item={item} />;
      })}
    </ul>
  )
}

export default AdminNavList