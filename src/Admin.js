import React, { Component, useState, useContext } from 'react'
import AdminNavBar from './AdminNavBar'
import Farmer from './Farmer.js'
import {AdminFarmContext} from './AdminFarmContext'
//within this admin page, we need ability to display any farmer page
//the option to select which farm to view is in AdminNavBar
//get selected farm from AdmiNavBar and use it in Farmer
//to pass data easily, wrap AdminNavBar and Farmer in a Provider


function Admin(){
    const [farmID, setFarmID] = useState('200-000003');

    return (
        <div>
            <AdminFarmContext.Provider value={{farmID, setFarmID}}>
                <AdminNavBar/>
                <Farmer/>
            </AdminFarmContext.Provider>
        </div>
    )
}

export default Admin
