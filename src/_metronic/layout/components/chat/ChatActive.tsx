import React from 'react';
import Swal from 'sweetalert2';

interface ChatActiveProps {
  messages: { sender: string; message: string }[];
  message: any;
  setMessage: (msg: any) => void;
  sendMessage: () => void;
}

const ChatActive: React.FC<ChatActiveProps> = ({ messages, message, setMessage, sendMessage }) => {

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

        // Cek tipe file
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
    
        if ((isImage && fileSizeMB > 2) || (isVideo && fileSizeMB > 5)) {

          
        Swal.fire({
          title: 'Error',
          text: `File terlalu besar! Maksimum ${isImage ? "2MB" : "5MB"}`,
          icon: 'error',
        })
          // alert(`File terlalu besar! Maksimum ${isImage ? "2MB" : "5MB"}`);
          return;
        }
        // Simpan file ke dalam setMessage
        setMessage({
          type: 'file',
          file: file,
          fileName: file.name,
          fileType: file.type,
        })
      }
    }
  return (
    <div style={{ display: "flex", borderTop: "1px solid #ccc", padding: "10px" }}>
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={message?.fileName || (typeof message === "string" ? message : "")}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
       <input
              type='file'
              id='imageUpload'
              onChange={handleImageChange}
              accept='image/*,video/*'
              style={{display: 'none'}}
            />

            {/* Ikon Bootstrap untuk Upload */}
            <label
              htmlFor='imageUpload'
              style={{cursor: 'pointer', marginLeft: '10px', marginTop: 10}}
            >
              <i className='bi bi-paperclip' style={{fontSize: '20px', color: '#007BFF'}}></i>
            </label>
      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Kirim
      </button>
    </div>
  );
};

export default ChatActive;