import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
 
export default function ManualBookPage() {
  const userRoles = localStorage.getItem('userRole') || '';
  console.log('roles', userRoles);
  let pdfUrl = ''; 
  if(userRoles === 'Super User')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK ADMIN HO.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Admin HO')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK ADMIN HO.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Admin Vendor')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK VENDOR.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Store CS')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK STORE.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Tukang')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK TUKANG.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Payroll')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK PAYROLL.pdf'; // Ganti dengan URL PDF dari backend
  else if(userRoles === 'Finance')
    pdfUrl = process.env.REACT_APP_WA_BACKEND_API_URL + '/manual_book/MANUAL BOOK FINANCE.pdf'; // Ganti dengan URL PDF dari backend
  
  
  return (
    <section id='view-item'>
        <div className='card'>
            <div className='card-body'>
                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={pdfUrl} />
                </Worker>
            </div>
        </div>
    </section>
  );
}
