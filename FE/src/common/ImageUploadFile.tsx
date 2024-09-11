import React, { useState, useCallback } from "react";
import { cn } from "#/utils/utils";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  title: string;
  multiple: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, title, multiple }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const validFiles: File[] = Array.from(files).filter(
        (file) =>
          file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml"
      );

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles));
        onImageSelect(multiple ? validFiles : [validFiles[0]]);
      } else {
        alert("Please select valid image files (jpg, png, or svg).");
      }
    },
    [multiple, onImageSelect]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        onImageSelect(newFiles);
        return newFiles;
      });
    },
    [onImageSelect]
  );

  return (
    <div>
      <label
        className="block  text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {title}
      </label>
      <label>
        <div
          className={cn(
            "w-full h-11 rounded-3xl border border-gray-300 justify-between items-center inline-flex",
            selectedFiles.length > 0 ? "mb-1" : "mb-5"
          )}
        >
          <span className="text-gray-900/20 text-sm font-normal leading-snug pl-4">
            {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) chosen` : "No file chosen"}
          </span>
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.svg"
            multiple={multiple}
          />
          <div
            className="flex w-28 h-11 px-2 flex-col bg-gray-900 rounded-r-3xl shadow text-white text-xs font-semibold leading-4
                       items-center justify-center cursor-pointer focus:outline-none"
          >
            Choose File
          </div>
        </div>
      </label>
      {selectedFiles.length > 0 && (
        <div className="mt-1 mb-5">
          <span className="text-sm font-medium text-gray-900 dark:text-white mb-1 pl-5">
            Selected Files:
          </span>
          <ul className="list-disc pl-10">
            {selectedFiles.map((file, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                {file.name}
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-600 hover:text-red-800 h-4 w-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
