import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";

interface AddressData {
  zipCode: string;
  address: string;
  detailAddress: string;
}

interface KoreanAddressFormProps {
  onAddressChange: (addressData: AddressData) => void;
}

const KoreanAddressForm: React.FC<KoreanAddressFormProps> = ({ onAddressChange }) => {
  const [addressData, setAddressData] = useState<AddressData>({
    zipCode: "",
    address: "",
    detailAddress: "",
  });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddressData((prev) => ({
      ...prev,
      zipCode: data.zonecode,
      address: fullAddress,
    }));
    setIsPostcodeOpen(false);
    onAddressChange({
      ...addressData,
      zipCode: data.zonecode,
      address: fullAddress,
    });
  };

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetailAddress = e.target.value;
    setAddressData((prev) => ({
      ...prev,
      detailAddress: newDetailAddress,
    }));
    onAddressChange({
      ...addressData,
      detailAddress: newDetailAddress,
    });
  };

  return (
    <div className="mb-4">
      <div className="flex mb-2">
        <input
          type="text"
          value={addressData.zipCode}
          placeholder="우편번호"
          className="p-2 border rounded mr-2"
          readOnly
        />
        <Button
          onClick={() => setIsPostcodeOpen(true)}
          variant="outlined"
          className=" text-green-400 border-green-200 py-1 px-2 text-xs rounded"
        >
          우편번호 검색
        </Button>
      </div>
      <input
        type="text"
        value={addressData.address}
        placeholder="주소"
        className="p-2 border rounded w-full mb-2"
        readOnly
      />
      <input
        type="text"
        value={addressData.detailAddress}
        onChange={handleDetailAddressChange}
        placeholder="상세주소"
        className="p-2 border rounded w-full"
      />
      {isPostcodeOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <DaumPostcode
              onComplete={handleComplete}
              autoClose
              style={{ width: "500px", height: "500px" }}
            />
            <button
              onClick={() => setIsPostcodeOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoreanAddressForm;
