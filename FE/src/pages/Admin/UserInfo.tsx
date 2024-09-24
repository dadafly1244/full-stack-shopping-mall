import { MouseEvent, useEffect, useState, useCallback } from "react";
import Table from "#/common/Table";
import { USER_INFO_ADMIN } from "#/apollo/query";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { ACTIVE_USER_ADMIN, SUSPENDED_USER_ADMIN } from "#/apollo/mutation";
import { FILTERED_USER_INFO_ADMIN } from "#/apollo/query";
import {
  UserType,
  UserStatus,
  sortingItem,
  SortState,
  TableColumn,
  UserPermissions,
  Gender,
} from "#/utils/types";
import Modal from "#/common/Modal";
import UpdateUserForm from "#/common/UpdateUserForm";
import { sortObjectsByKey } from "#/utils/sort";
import { useSearchParams } from "react-router-dom";
import SearchUser from "./SearchUser";
import { Button } from "@material-tailwind/react";
import Breadcrumb from "#/common/Breadcrumb";

const init_user = {
  id: "",
  name: "",
  user_id: "",
  email: "",
  phone_number: "",
  status: "ACTIVE",
  permissions: "USER",
  gender: "PREFER_NOT_TO_SAY",
};

type PredefinedOptionsType = {
  status: Record<UserStatus, string>;
  permissions: Record<UserPermissions, string>;
  gender: Record<Gender, string>;
};

const predefinedOptions: PredefinedOptionsType = {
  status: {
    [UserStatus.ACTIVE]: "활성화",
    [UserStatus.INACTIVE]: "탈퇴",
    [UserStatus.SUSPENDED]: "정지",
  },
  permissions: {
    [UserPermissions.ADMIN]: "관리자",
    [UserPermissions.USER]: "사용자",
  },
  gender: {
    [Gender.MALE]: "남성",
    [Gender.FEMALE]: "여성",
    [Gender.OTHER]: "기타",
    [Gender.PREFER_NOT_TO_SAY]: "선택안함",
  },
};

type PredefinedOptionKeys = keyof PredefinedOptionsType;
function isPredefinedOption(option: string): option is PredefinedOptionKeys {
  return option in predefinedOptions;
}
const UserInfoTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedOption, setSelectedOption] = useState(searchParams.get("searchField") || "");
  const [searchValue, setSearchValue] = useState(searchParams.get("searchTerm") || "");
  const [selectedOption2nd, setSelectedOption2nd] = useState(searchParams.get("searchTerm") || "");

  const [shouldSearch, setShouldSearch] = useState(searchParams.get("searchOpen") === "true");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState(init_user);
  const [data, setData] = useState<UserType[]>([]);
  const [sortState, setSortState] = useState<SortState<sortingItem>>({
    user_id: "none",
    name: "none",
    email: "none",
    phone_number: "none",
  });

  const { data: allData, loading, error } = useQuery(USER_INFO_ADMIN);
  const [suspendedUser] = useMutation(SUSPENDED_USER_ADMIN, {
    refetchQueries: [{ query: USER_INFO_ADMIN }],
    awaitRefetchQueries: true,
  });
  const [activeUser] = useMutation(ACTIVE_USER_ADMIN, {
    refetchQueries: [{ query: USER_INFO_ADMIN }],
    awaitRefetchQueries: true,
  });

  const [filteredUser, { loading: filteredLoading, error: filteredError }] =
    useLazyQuery(FILTERED_USER_INFO_ADMIN);

  const performSearch = useCallback(async () => {
    let searchTermValue: string;

    if (isPredefinedOption(selectedOption)) {
      const selectedEnum = Object.entries(predefinedOptions[selectedOption]).find(
        ([, value]) => value === selectedOption2nd
      );
      searchTermValue = selectedEnum ? selectedEnum[0] : selectedOption2nd;
    } else {
      searchTermValue = searchValue;
    }

    const { data: usersData } = await filteredUser({
      variables: {
        searchTerm: searchTermValue,
        searchField: selectedOption,
      },
    });

    if (usersData?.filteredUsers) {
      setData(usersData.filteredUsers);
    }
  }, [selectedOption, selectedOption2nd, searchValue, filteredUser]);

  useEffect(() => {
    setData(allData?.usersList);
    if (isInitialLoad) {
      if (allData?.usersList) {
        setData(allData.usersList);
      } else if (searchParams.get("searchOpen") === "true") {
        performSearch();
      }

      setIsInitialLoad(false);
    } else if (shouldSearch) {
      performSearch();
      setShouldSearch(false);
    }
  }, [isInitialLoad, shouldSearch, searchParams, allData, performSearch]);

  const openModal = (user: UserType) => {
    if (user) {
      setIsModalOpen(true);
      setClickedUser((prev) => ({ ...prev, ...user }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClickedUser(init_user);
  };

  const handleStatus = (e: MouseEvent, status: UserStatus | undefined, id: string | undefined) => {
    e.stopPropagation();
    if (!status || !id) return alert("사용자 상태 변경 실패");
    if (status === "ACTIVE") {
      handleUserSuspended(id);
    } else {
      handleUserActive(id);
    }
  };

  const handleUserSuspended = (id: string | undefined) => {
    if (id) {
      suspendedUser({
        variables: {
          id: id,
        },
      });
    }
  };

  const handleUserActive = (id: string | undefined) => {
    if (id) {
      activeUser({
        variables: {
          id: id,
        },
      });
    }
  };

  const handleRowClick = (user: UserType) => {
    openModal(user);
  };

  const handleSelectionChange = (selectedUsers: UserType[]) => {
    console.log("Selected users:", selectedUsers);
  };

  const handleSortClick = (key: keyof sortingItem) => {
    setSortState((prevState) => {
      const newSortOrder =
        prevState[key] === "none" ? "asc" : prevState[key] === "asc" ? "desc" : "none";
      const newSortState = { ...prevState, [key]: newSortOrder };

      let sortedData = [...data];
      if (newSortOrder !== "none") {
        sortedData = sortObjectsByKey(sortedData, key, newSortOrder === "asc");
      } else {
        sortedData = allData?.usersList || [];
      }

      setData(sortedData);
      return newSortState;
    });
  };

  const handleSearchUser = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("searchTerm", searchValue || selectedOption2nd);
    newSearchParams.set("searchField", selectedOption);
    newSearchParams.set("searchOpen", "true");
    setSearchParams(newSearchParams);
    setShouldSearch(true);
  };

  const handleResetSearch = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("searchOpen", "false");
    setSearchParams(newSearchParams);
    setSelectedOption("");
    setSelectedOption2nd("");
    setSearchValue("");
    if (allData?.usersList) {
      setData(allData.usersList);
    }
  };

  const columns: TableColumn<UserType, sortingItem>[] = [
    // { header: "ID", key: "id" },
    { header: "User ID", key: "user_id", sort: sortState.user_id as keyof sortingItem },
    { header: "Name", key: "name", sort: sortState.name as keyof sortingItem },
    { header: "Email", key: "email", sort: sortState.email as keyof sortingItem },
    { header: "Phone", key: "phone_number", sort: sortState.phone_number as keyof sortingItem },
    {
      header: "Status",
      key: "status",
      render: (user: UserType) => (
        <div className="flex justify-between w-36">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${
              user.status === "ACTIVE"
                ? "bg-green-50 text-green-500"
                : user.status === "SUSPENDED"
                ? "bg-yellow-100 text-yellow-500"
                : "bg-red-50 text-red-500"
            }`}
          >
            {user.status}
          </span>
          <button
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              user.status === "SUSPENDED"
                ? "bg-green-500 text-white"
                : user.status === "ACTIVE"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
            type="button"
            onClick={(e) => handleStatus(e, user.status, user.id)}
          >
            변경
          </button>
        </div>
      ),
    },
    {
      header: "Permissions",
      key: "permissions",
      render: (user: UserType) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${user.permissions === "USER" ? "bg-green-50 text-gray-500" : "bg-red-50 text-red-500"}`}
        >
          {user.permissions}
        </span>
      ),
    },
    { header: "Gender", key: "gender" },
  ];

  if (loading || filteredLoading) return <p>Loading...</p>;
  if (error || filteredError)
    return (
      <div className="w-full">
        <div>Error: {error?.message || filteredError?.message}</div>
        <div className="w-full flex flex-col justify-center content-center">
          <div className="w-56 h-56">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
          </div>
          <Button onClick={handleResetSearch}>되돌아가기</Button>
        </div>
      </div>
    );

  return (
    <>
      <div className="pt-5">
        <Breadcrumb />
      </div>
      <div className="py-10">
        <UpdateUserModal isOpen={isModalOpen} onClose={closeModal} user={clickedUser as UserType} />
        <SearchUser
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          searchValue={searchValue}
          onSearchValue={setSearchValue}
          selectedOption2nd={selectedOption2nd}
          onSelected2nd={setSelectedOption2nd}
          onResetSearch={handleResetSearch}
          onClickSearch={handleSearchUser}
        />
        <Table<UserType, sortingItem>
          // title="User List"
          data={data}
          sortState={sortState}
          columns={columns}
          onSortClick={handleSortClick}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </>
  );
};

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose, user }) => {
  return (
    <Modal isOpen={isOpen} title="사용자 정보 수정" onClose={onClose}>
      <UpdateUserForm user={user} onClose={onClose} />
    </Modal>
  );
};

export default UserInfoTab;
