import React from 'react';

interface Vendor {
  id: string;
  company_name?: string; // Optional if not all vendors have this
  store_name?: string;   // Optional if not all vendors have this
}

interface ChatVendorProps {
  vendorList: Vendor[];
  loadingVendors: boolean;
  startChat: (chatType: string, vendor: Vendor) => void;
  chatType: string;
  vendorListRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
}

const ChatVendor: React.FC<ChatVendorProps> = ({ vendorList, loadingVendors, startChat, chatType, vendorListRef, handleScroll }) => {
  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      {loadingVendors ? (
        <div>Loading vendor list...</div>
      ) : (
        <div style={{ maxHeight: "200px", overflowY: "auto" }} ref={vendorListRef} onScroll={handleScroll}>
          {vendorList.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => startChat(chatType, vendor)}
              style={buttonStyle}
            >
              {chatType === "vendor" ? vendor.company_name : vendor.store_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
};

export default ChatVendor;