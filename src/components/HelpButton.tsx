// components/HelpButton.tsx
import { useState } from 'react';
import SupportModal from './SupportModal';

const HelpButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#007bff',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '24px',
          zIndex: 9999
        }}
        title="Help"
      >
        ?
      </div>
      <SupportModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default HelpButton;
