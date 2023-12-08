import React from 'react';

function FlexContainerExample() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '300px', overflowY: 'auto' }}>
          {/* Many items */}
          {Array.from({ length: 20 }, (_, index) => (
            <div key={index} style={{ padding: '10px', border: '1px solid #ccc' }}>
              Item {index + 1}
            </div>
          ))}
        </div>
      );
    
}

export default FlexContainerExample;