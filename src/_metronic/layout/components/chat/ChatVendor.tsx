import React, { useState } from 'react';

interface Vendor {
  id: string;
  company_name?: string;
  store_name?: string;
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter vendor list based on search query
  const filteredVendors = vendorList.filter((vendor) => {
    const nameToSearch = chatType === "vendor" ? vendor.company_name : vendor.store_name;
    return nameToSearch?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      {loadingVendors ? (
        <div>Loading vendor list...</div>
      ) : (
        <>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px",
              marginBottom: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          {/* Vendor list with scroll */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }} ref={vendorListRef} onScroll={handleScroll}>
            {filteredVendors.length === 0 ? (
              <div>No vendors found</div>
            ) : (
              filteredVendors.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => startChat(chatType, vendor)}
                  style={buttonStyle}
                >
                  {chatType === "vendor" ? vendor.company_name : vendor.store_name}
                </button>
              ))
            )}
          </div>
        </>
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
