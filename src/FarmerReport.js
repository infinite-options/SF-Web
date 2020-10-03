import React from 'react'

export default function FarmerReport(props) {
    return (
        <div hidden={props.hidden}>
            <div style={labelStyle}>
                <h1>Open Orders</h1>
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
