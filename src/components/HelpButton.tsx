// components/HelpButton.tsx
import { useState } from 'react';
import SupportModal from './SupportModal';
import { Button } from 'react-bootstrap';

const HelpButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow"
        style={{
          width: '35px',
          height: '35px',
          fontSize: '18px',
          lineHeight: '1',
          padding: '0'
        }}
        title="Help"
      >
        ?
      </Button>

      <SupportModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default HelpButton;
