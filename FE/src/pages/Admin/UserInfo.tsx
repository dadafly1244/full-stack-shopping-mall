import { MouseEvent, useEffect, useState, useCallback } from "react";
import Table, { TableColumn } from "#/common/Table";
import { USER_INFO_ADMIN } from "#/apollo/query";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { ACTIVE_USER_ADMIN, SUSPENDED_USER_ADMIN } from "#/apollo/mutation";
import { FILTERED_USER_INFO_ADMIN } from "#/apollo/query";
import {
  UserType,
  UserStatus,
  UserPermissions,
  Gender,
  SearchFilters,
  CheckboxStates,
  sortingItem,
} from "#/utils/types";
import UserSearchComponent from "#/pages/Admin/UserSearchComponent";
import Modal from "#/common/Modal";
import UpdateUserForm from "#/common/UpdateUserForm";
import { sortObjectsByKey } from "#/utils/sort";
import { useSearchParams } from "react-router-dom";

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

const initialFilters: SearchFilters = {
  name: "",
  user_id: "",
  email: "",
  phone_number: "",
  status: "ACTIVE" as UserStatus,
  permissions: "USER" as UserPermissions,
  gender: "PREFER_NOT_TO_SAY" as Gender,
};

const initialCheckboxes: CheckboxStates = {
  name: false,
  user_id: false,
  email: false,
  phone_number: false,
  status: false,
  permissions: false,
  gender: false,
};

const UserInfoTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState<SearchFilters>({
    name: searchParams.get("filter_name") || "",
    user_id: searchParams.get("filter_user_id") || "",
    email: searchParams.get("filter_email") || "",
    phone_number: searchParams.get("filter_phone_number") || "",
    status: (searchParams.get("filter_status") as UserStatus) || "ACTIVE",
    permissions: (searchParams.get("filter_permissions") as UserPermissions) || "USER",
    gender: (searchParams.get("filter_gender") as Gender) || "PREFER_NOT_TO_SAY",
  });
  const [localCheckboxes, setLocalCheckboxes] = useState<CheckboxStates>({
    name: searchParams.get("check_name") === "true",
    user_id: searchParams.get("check_user_id") === "true",
    email: searchParams.get("check_email") === "true",
    phone_number: searchParams.get("check_phone_number") === "true",
    status: searchParams.get("check_status") === "true",
    permissions: searchParams.get("check_permissions") === "true",
    gender: searchParams.get("check_gender") === "true",
  });

  const [shouldSearch, setShouldSearch] = useState(searchParams.get("searchOpen") === "true");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState(init_user);
  const [data, setData] = useState<UserType[]>([]);
  const [sortState, setSortState] = useState({
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
    const filterVariables = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([key, value]) => localCheckboxes[key as keyof CheckboxStates] && value !== ""
      )
    );
    const { data: usersData } = await filteredUser({ variables: filterVariables });
    if (usersData?.filteredUsers) {
      setData(usersData.filteredUsers);
    }
  }, [filteredUser, localFilters, localCheckboxes]);

  useEffect(() => {
    if (isInitialLoad) {
      if (searchParams.get("searchOpen") === "true") {
        performSearch();
      } else if (allData?.usersList) {
        setData(allData.usersList);
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
    console.log("Clicked user:", user);
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
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(`filter_${key}`, value);
      }
    });
    Object.entries(localCheckboxes).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(`check_${key}`, "true");
      }
    });
    newSearchParams.set("searchOpen", "true");
    setSearchParams(newSearchParams);
    setShouldSearch(true);
  };

  const handleCloseSearch = () => {
    setSearchParams(new URLSearchParams());
    setLocalFilters(initialFilters);
    setLocalCheckboxes(initialCheckboxes);
    if (allData?.usersList) {
      setData(allData.usersList);
    }
  };

  const handleResetSearch = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("searchOpen", "true");
    setSearchParams(newSearchParams);
    setLocalFilters(initialFilters);
    setLocalCheckboxes(initialCheckboxes);
    if (allData?.usersList) {
      setData(allData.usersList);
    }
  };

  const columns: TableColumn<UserType>[] = [
    { header: "ID", key: "id" },
    { header: "User ID", key: "user_id", sort: sortState.user_id },
    { header: "Name", key: "name", sort: sortState.name },
    { header: "Email", key: "email", sort: sortState.email },
    { header: "Phone", key: "phone_number", sort: sortState.phone_number },
    {
      header: "Status",
      key: "status",
      render: (user) => (
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
      render: (user) => (
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
  if (error || filteredError) return <p>Error: {error?.message || filteredError?.message}</p>;

  return (
    <div>
      <UpdateUserModal isOpen={isModalOpen} onClose={closeModal} user={clickedUser as UserType} />
      <UserSearchComponent
        filters={localFilters}
        checkboxes={localCheckboxes}
        onClickSearch={handleSearchUser}
        setLocalFilters={setLocalFilters}
        onCloseSearch={handleCloseSearch}
        setLocalCheckboxes={setLocalCheckboxes}
        onResetSearch={handleResetSearch}
      />
      <Table<UserType>
        title="User List"
        data={data}
        sortState={sortState}
        columns={columns}
        onSortClick={handleSortClick}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
    </div>
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
