import React from 'react'

export default function FarmerSettings({ farmID, farmName, ...props }) {
    return (
        <div hidden={props.hidden}>
            <div style={labelStyle}>
                <h1>Update Business Settings</h1>
            </div>
        </div>
    )
}

// styling
const labelStyle = {
    backgroundColor: 'white',
    width: '80%',
    textAlign: 'left',
    marginLeft: '25px',
    marginBottom: '20px',
}
