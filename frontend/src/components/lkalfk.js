import React, { useState } from 'react';

function MyComponent() {
  const handleChange = (e) => {
    console.log("run");
}


  return (
    <div>
     <span onInput={handleChange} role="textbox" className="caption updateItem" rows={1} contentEditable autoFocus></span>
    </div>
  );
}

export default MyComponent;