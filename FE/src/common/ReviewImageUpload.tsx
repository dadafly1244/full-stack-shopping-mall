import React, { useState, useCallback, useEffect } from "react";
import { cn } from "#/utils/utils";
import { Tooltip } from "@material-tailwind/react";

interface ImageUploadProps {
  onImageSelect: (files: File | undefined) => void;
  multiple: boolean;
  rawUrls?: string[];
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, rawUrls, disabled }) => {
  const [selectedFiles, setSelectedFiles] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>(() => {
    if (rawUrls) {
      return `${import.meta.env.VITE_BE_URL}${rawUrls}`;
    } else {
      return "";
    }
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      const validFile: File[] = Array.from(files).filter(
        (file) =>
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/webp" ||
          file.type === "image/svg+xml"
      );
      if (validFile[0]) {
        setSelectedFiles(validFile[0]);

        const newPreviewUrl = URL.createObjectURL(validFile[0]);
        setPreviewUrl(newPreviewUrl);

        onImageSelect(validFile[0]);
      } else {
        alert("Please select valid image files (jpg, png, svg or webp).");
      }
    },
    [onImageSelect]
  );

  const removeFile = useCallback(() => {
    setPreviewUrl(rawUrls ? `${import.meta.env.VITE_BE_URL}${rawUrls}` : "");
    setSelectedFiles(() => {
      onImageSelect(undefined);
      return undefined;
    });
  }, [rawUrls, onImageSelect]);

  return (
    <div className="w-20 flex flex-col gap-1">
      {/* db에서 온 url 없는 경우 */}
      {selectedFiles && (
        <PreviewActiveImage
          url={previewUrl}
          removeFile={removeFile}
          name={selectedFiles.name}
          type={selectedFiles.type}
          hasDBImage={!!rawUrls}
        />
      )}
      {rawUrls && !selectedFiles && (
        <PreviewActiveImage
          url={previewUrl}
          removeFile={removeFile}
          name="main image"
          hasDBImage={!!rawUrls}
        />
      )}

      {!selectedFiles?.name && !rawUrls && (
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-lg bg-white border border-solid border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-12 w-12 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      )}
      <label className={cn("w-20 justify-center items-center  inline-flex")}>
        <input
          type="file"
          disabled={disabled}
          hidden
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.svg,.webp"
        />
        <div
          className={cn(
            "flex w-16 p-1 flex-col bg-gray-900 text-white text-xs font-semibold items-center justify-center cursor-pointer focus:outline-none rounded-md",
            disabled && "cursor-not-allowed bg-gray-500"
          )}
        >
          {selectedFiles ? "선택완료" : "사진선택"}
        </div>
      </label>
    </div>
  );
};

const PreviewActiveImage = ({
  url,
  removeFile,
  name,
  type,
}: {
  url: string;
  removeFile: (i: number) => void;
  name: string;
  type?: string;
  hasDBImage: boolean;
}) => {
  const [isUrlFromDB, setIsUrlFromDB] = useState(false);

  useEffect(() => {
    if (url) setIsUrlFromDB(url.startsWith(`${import.meta.env.VITE_BE_URL}`));
  }, [url]);
  return (
    <>
      {url && (
        <div className="relative flex">
          {!isUrlFromDB && (
            <button
              onClick={() => removeFile(0)}
              className="absolute right-1 top-1 ml-2 text-black bg-blue-gray-200 bg-opacity-35 flex justify-center items-center rounded hover:text-red-800 h-4 w-4"
            >
              x
            </button>
          )}
          {type && (
            <Tooltip content={`name:${name}, type:${type}`} placement="bottom">
              <img
                src={url}
                alt={`Preview image`}
                className="h-20 w-20 mx-auto rounded-lg object-contain border border-solid border-blue-gray-50"
              />
            </Tooltip>
          )}
          {!type && (
            <Tooltip content={`name:${name}`} placement="top">
              <img
                src={url}
                alt={`Preview image`}
                className="h-20 w-20 mx-auto rounded-lg object-contain border border-solid border-blue-gray-50"
              />
            </Tooltip>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUpload;
