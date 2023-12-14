import React, { useState } from 'react';

function MyComponent() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    // Sử dụng onChange
    setInputValue(event.target.value);
    console.log("Giá trị đã thay đổi: ", event.target.value);
  };

  const handleInputInput = (event) => {
    // Sử dụng onInput
    setInputValue(event.target.value);
    console.log("Giá trị thay đổi ngay lập tức: ", event.target.value);
  };

  return (
    <div>
      {/* Sử dụng onChange */}
      <input type="text" value={inputValue} onChange={handleInputChange} />

      {/* Sử dụng onInput */}
      <input type="text" value={inputValue} onInput={handleInputInput} />
    </div>
  );
}

export default MyComponent;