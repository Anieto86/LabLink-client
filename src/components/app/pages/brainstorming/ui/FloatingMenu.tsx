import React from 'react';

const FloatingMenu: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '10px',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      <h4>Menu</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <button type="button">Tool 1</button>
        </li>
        <li>
          <button type="button">Tool 2</button>
        </li>
        <li>
          <button type="button">Tool 3</button>
        </li>
      </ul>
    </div>
  );
};

export default FloatingMenu;
