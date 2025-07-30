import React, { useState } from 'react';

interface ChatOrderIdProps {
  orderId: string;
  setOrderId: (id: string) => void;
  startChat: (type: string, id: string) => void;
}

const ChatOrderId: React.FC<ChatOrderIdProps> = ({ orderId, setOrderId, startChat }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    if (!orderId.trim()) {
      alert('Silakan masukkan Order ID')
      return
    }
    
    setIsSubmitting(true)
    try {
      await startChat("id", orderId)
      setOrderId('') // Clear only after successful submission
    } catch (error) {
      console.error('Error submitting order ID:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      <input
        type="text"
        placeholder="Masukkan Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSubmitting) {
            handleSubmit()
          }
        }}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        disabled={isSubmitting}
      />
      <button
        onClick={handleSubmit}
        style={{
          ...buttonStyle,
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses...' : 'Mulai Chat'}
      </button>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
};

export default ChatOrderId;