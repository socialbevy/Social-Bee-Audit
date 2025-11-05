import React from "react";
import { useDispatch } from "react-redux";
import { QRCode } from "react-qrcode-logo";
import { closeModal } from "@/lib/features/modal/modalSlice";
import ubuntu from "@/utils/ubuntu";


const BarcodeContent = ({ barcodeUrl }) => {
  const dispatch = useDispatch();

  const close = () => {
    dispatch(closeModal());
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className={`text-2xl font-bold mb-4 ${ubuntu.className}`}>Your QR Code</h2>
      <QRCode value={barcodeUrl} size={200} />
      <button
        className="w-full py-2 px-4 mt-4 bg-white text-black font-semibold hover:font-bold"
        onClick={close}>
        Cancel
      </button>
    </div>
  )
};

export default BarcodeContent;