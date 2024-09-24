import React, { useState, useCallback, useEffect } from "react";
import { cn } from "#/utils/utils";
import { IconButton, Tooltip } from "@material-tailwind/react";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  title: string;
  multiple: boolean;
  rawUrls?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, title, multiple, rawUrls }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    rawUrls ? rawUrls.map((url) => `${import.meta.env.VITE_BE_URL}${url}`) : []
  );
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setActive(previewUrls[0]);
  }, [previewUrls]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const validFiles: File[] = Array.from(files).filter(
        (file) =>
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/webp" ||
          file.type === "image/svg+xml"
      );

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles));

        const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(multiple ? [...newPreviewUrls] : newPreviewUrls);

        onImageSelect(multiple ? validFiles : [validFiles[0]]);
      } else {
        alert("Please select valid image files (jpg, png, svg or webp).");
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

        setPreviewUrls((prevUrls) => {
          const newUrls = [...prevUrls];
          newUrls.splice(index, 1);
          return newUrls;
        });
        return newFiles;
      });
    },
    [onImageSelect]
  );

  const handleUndo = useCallback(() => {
    setPreviewUrls(rawUrls ? rawUrls.map((url) => `${import.meta.env.VITE_BE_URL}${url}`) : []);
    setSelectedFiles(() => {
      const newFiles: File[] = [];
      onImageSelect(newFiles);
      return newFiles;
    });
  }, [rawUrls, onImageSelect]);

  return (
    <div className="w-full">
      <label
        className="block text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {title}
      </label>
      {multiple && rawUrls && (
        <div className="flex justify-between py-1">
          <div className="text-xs font-bold text-red-300">
            * 파일 선택시 '모든' 파일을 다시 선택해야 합니다.
          </div>
          <IconButton className="mr-5" size="sm" variant="outlined" onClick={handleUndo}>
            <svg
              className="w-4 h-4  fill-blue-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z" />
            </svg>
          </IconButton>
        </div>
      )}
      <label>
        <div
          className={cn(
            "w-full h-11 mx-auto rounded-3xl border border-gray-300 justify-between items-center inline-flex",
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
            accept=".jpg,.jpeg,.png,.svg,.webp"
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

      {multiple && selectedFiles.length > 1 && (
        <div className="grid gap-4">
          <PreviewActiveImage
            url={active}
            removeFile={removeFile}
            name="미리보기 중 선택된 이미지"
            hasDBImage={false}
          />
          <div className="grid grid-flow-col grid-rows-1 gap-4 justify-start overflow-hidden overflow-x-scroll">
            {previewUrls.map((url, index) => (
              <PreviewDescImage
                key={url}
                url={url}
                index={index}
                removeFile={removeFile}
                onChangeActive={setActive}
                name={selectedFiles[index].name}
                type={selectedFiles[index].type}
              />
            ))}
          </div>
        </div>
      )}

      {multiple && rawUrls && selectedFiles.length === 0 && (
        <div className="grid gap-4">
          <PreviewActiveImage
            url={active}
            removeFile={removeFile}
            name="미리보기 중 선택된 이미지"
            hasDBImage
          />
          <div className="grid grid-flow-col grid-rows-1 gap-4 justify-start overflow-hidden overflow-x-scroll">
            {previewUrls.map((url, index) => (
              <PreviewDescImage
                key={url}
                url={url}
                index={index}
                removeFile={removeFile}
                onChangeActive={setActive}
                name={`db에 저장된 설명 이미지${index}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* db에서 온 url 없는 경우 */}
      {!multiple && selectedFiles.length === 1 && (
        <PreviewActiveImage
          url={previewUrls[0]}
          removeFile={removeFile}
          name={selectedFiles[0].name}
          type={selectedFiles[0].type}
          hasDBImage={false}
        />
      )}
      {!multiple && selectedFiles.length === 0 && rawUrls && (
        <PreviewActiveImage
          url={previewUrls[0]}
          removeFile={removeFile}
          name="main image"
          hasDBImage
        />
      )}
    </div>
  );
};

const PreviewActiveImage = ({
  url,
  removeFile,
  name,
  type,
  hasDBImage = false,
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
        <div className="relative flex mb-8">
          {!isUrlFromDB && (
            <button
              onClick={() => removeFile(0)}
              className="absolute right-28 top-2 ml-2 text-black hover:text-red-800 h-4 w-4"
            >
              x
            </button>
          )}
          {type && (
            <Tooltip content={`name:${name}, type:${type}`} placement="top">
              <img
                src={url}
                alt={`Preview image`}
                className="h-80 w-80 mx-auto rounded-lg object-contain border border-solid border-blue-gray-50"
              />
            </Tooltip>
          )}
          {!type && (
            <Tooltip content={`name:${name}`} placement="top">
              <img
                src={url}
                alt={`Preview image`}
                className="h-80 w-80 mx-auto rounded-lg object-contain border border-solid border-blue-gray-50"
              />
            </Tooltip>
          )}
        </div>
      )}
      {((!hasDBImage && !url) || !url) && (
        <div className="grid h-80 w-80 mb-8 mx-auto place-items-center rounded-lg bg-white border border-solid border-gray-200">
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
    </>
  );
};

const PreviewDescImage = ({
  url,
  index,
  removeFile,
  onChangeActive,
  name,
  type,
}: {
  url: string;
  index: number;
  removeFile: (i: number) => void;
  name: string;
  type?: string;
  onChangeActive: (url: string) => void;
}) => {
  const [isUrlFromDB, setIsUrlFromDB] = useState(false);

  useEffect(() => {
    setIsUrlFromDB(url.startsWith(`${import.meta.env.VITE_BE_URL}`));
  }, [url]);
  return (
    <div className="relative h-20 w-20 ">
      {!isUrlFromDB && (
        <button
          onClick={() => removeFile(index)}
          className="absolute right-1 top-0 ml-2 text-black hover:text-red-800 h-4 w-4"
        >
          x
        </button>
      )}
      <Tooltip content={`name:${name}, type:${type}`} placement="top">
        <img
          onClick={() => onChangeActive(url)}
          src={url}
          className="h-20 w-20 cursor-pointer rounded-lg object-contain object-center border border-solid border-blue-gray-50"
          alt={name}
        />
      </Tooltip>
    </div>
  );
};

export default ImageUpload;
