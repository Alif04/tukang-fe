import React, { useState } from 'react';

interface EditMessageModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onSave: (newMessage: string) => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({ isOpen, message, onClose, onSave }) => {
  const [editedMessage, setEditedMessage] = useState(message);

  const handleSave = () => {
    onSave(editedMessage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <h2>Edit Message</h2>
        <textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
          rows={4}
          style={textareaStyles}
        />
        <div style={buttonContainerStyles}>
          <button onClick={handleSave} style={buttonStyles}>Save</button>
          <button onClick={onClose} style={buttonStyles}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Define styles with React.CSSProperties type
const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
};

const textareaStyles: React.CSSProperties = {
  width: '100%',
  marginBottom: '10px',
};

const buttonContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

const buttonStyles: React.CSSProperties = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default EditMessageModal;