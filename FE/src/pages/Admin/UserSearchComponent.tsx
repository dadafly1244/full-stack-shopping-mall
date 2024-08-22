import { Checkbox } from "#/common/CheckBox";
import { Select } from "#/common/CommonSelectBox";
import { SearchFilters, CheckboxStates } from "#/utils/types";

interface UserSearchComponentProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  filters: SearchFilters;
  initFilter: SearchFilters;
  checkboxes: CheckboxStates;
  onFilteredChange: React.Dispatch<React.SetStateAction<SearchFilters>>;
  OnCheckboxChange: React.Dispatch<React.SetStateAction<CheckboxStates>>;
  onClickSearch: (filters: SearchFilters, checkboxes: CheckboxStates) => Promise<void>;
}

export const UserSearchComponent: React.FC<UserSearchComponentProps> = ({
  open,
  onOpenChange,
  filters,
  onFilteredChange,
  checkboxes,
  OnCheckboxChange,
  onClickSearch,
  initFilter,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilteredChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof CheckboxStates) => {
    OnCheckboxChange((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleClickTitle = () => {
    onFilteredChange(initFilter);
    OnCheckboxChange({
      name: false,
      user_id: false,
      email: false,
      phone_number: false,
      status: false,
      permissions: false,
      gender: false,
    });
    onOpenChange((prev) => !prev);
  };

  return (
    <div className="p-4 bg-gray-100\">
      <h1 onClick={handleClickTitle} className="text-2xl font-bold mb-4 text-gray-800">
        검색
      </h1>
      {open && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="flex items-center w-96 justify-between ">
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
            onClick={() => onClickSearch(filters, checkboxes)}
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
