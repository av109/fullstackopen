import React from 'react'

const Filter = ({value, onChange}) => {
  return (
    <div>
        <label htmlFor="search">Filter Countries : </label>
        <input type="text" name="search" id="search" value={value} onChange={onChange}/>
    </div>
  )
}

export default Filter