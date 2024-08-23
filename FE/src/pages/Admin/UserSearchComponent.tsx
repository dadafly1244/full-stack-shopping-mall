import { Checkbox } from "#/common/CheckBox";
import { Select } from "#/common/CommonSelectBox";
import { SearchFilters, CheckboxStates } from "#/utils/types";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface UserSearchComponentProps {
  filters: SearchFilters;
  checkboxes: CheckboxStates;
  onClickSearch: () => void;
  onCloseSearch: () => void;
  onResetSearch: () => void;
  setLocalFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setLocalCheckboxes: React.Dispatch<React.SetStateAction<CheckboxStates>>;
}

export const UserSearchComponent: React.FC<UserSearchComponentProps> = ({
  filters,
  checkboxes,
  onClickSearch,
  onCloseSearch,
  onResetSearch,
  setLocalFilters,
  setLocalCheckboxes,
}) => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(searchParams.get("searchOpen") === "true");

  useEffect(() => {
    setOpen(searchParams.get("searchOpen") === "true");
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof CheckboxStates) => {
    setLocalCheckboxes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleClickTitle = () => {
    if (open) {
      onCloseSearch();
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 onClick={handleClickTitle} className="text-2xl font-bold text-gray-800 cursor-pointer">
          검색 {open ? "▲" : "▼"}
        </h1>
        {open && (
          <button
            onClick={onResetSearch}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            초기화
          </button>
        )}
      </div>
      {open && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="flex items-center w-96 justify-between">
                <Checkbox
                  checked={checkboxes[key as keyof CheckboxStates]}
                  onChange={() => handleCheckboxChange(key as keyof CheckboxStates)}
                  label={key}
                />
                {["status", "permissions", "gender"].includes(key) ? (
                  <Select
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    disabled={!checkboxes[key as keyof CheckboxStates]}
                    options={[
                      { value: "", label: `Select ${key}` },
                      ...(key === "status"
                        ? ["ACTIVE", "INACTIVE", "SUSPENDED"]
                        : key === "permissions"
                        ? ["ADMIN", "USER"]
                        : ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]
                      ).map((option) => ({ value: option, label: option })),
                    ]}
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    disabled={!checkboxes[key as keyof CheckboxStates]}
                    className="ml-2 w-48 p-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-gray-500"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={onClickSearch}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Search
          </button>
        </>
      )}
    </div>
  );
};

export default UserSearchComponent;
