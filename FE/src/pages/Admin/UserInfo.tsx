import { useEffect, useState } from "react";
import Table, { TableColumn } from "#/common/Table";
import { USER_INFO_ADMIN } from "#/apollo/query";
import { UserType, UserStatus } from "#/utils/types";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { ACTIVE_USER_ADMIN, SUSPENDED_USER_ADMIN } from "#/apollo/mutation";
import { FILTERED_USER_INFO_ADMIN } from "#/apollo/query";
import { SearchFilters, CheckboxStates } from "#/utils/types";
import UserSearchComponent from "#/pages/Admin/UserSearchComponent";

const init_filters = {
  name: "",
  user_id: "",
  email: "",
  phone_number: "",
  status: null,
  permissions: null,
  gender: null,
};
const UserInfoTab = () => {
  const [filters, setFilters] = useState<SearchFilters>(init_filters);
  const [checkboxes, setCheckboxes] = useState<CheckboxStates>({
    name: false,
    user_id: false,
    email: false,
    phone_number: false,
    status: false,
    permissions: false,
    gender: false,
  });
  const [openSearch, setOpenSearch] = useState(false);
  const { data: allData, loading, error } = useQuery(USER_INFO_ADMIN);
  const [suspendedUser, { loading: suspendedLoading, error: suspendedError }] = useMutation(
    SUSPENDED_USER_ADMIN,
    {
      refetchQueries: [{ query: USER_INFO_ADMIN }],
      awaitRefetchQueries: true,
    }
  );
  const [activeUser, { loading: activeLoading, error: activeError }] = useMutation(
    ACTIVE_USER_ADMIN,
    {
      refetchQueries: [{ query: USER_INFO_ADMIN }],
      awaitRefetchQueries: true,
    }
  );

  const [filteredUser, { loading: filteredLoading, error: filteredError }] =
    useLazyQuery(FILTERED_USER_INFO_ADMIN);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (allData?.usersList) {
      setData(allData.usersList);
    }
  }, [allData]);

  useEffect(() => {
    if (!openSearch) {
      setData(allData.usersList);
    }
  }, [openSearch, allData]);

  const handleSearchUser = async (filters: SearchFilters, checkboxes: CheckboxStates) => {
    const { data: usersData } = await filteredUser({
      variables: Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => checkboxes[key as keyof CheckboxStates] && value !== ""
        )
      ),
    });
    if (usersData?.filteredUsers) {
      setData(usersData.filteredUsers);
    }
  };

  const handleStatus = (status: UserStatus | undefined, id: string | undefined) => {
    if (!status || !id) return alert("사용자 상태 변경 실패");
    if (status === "ACTIVE") {
      handleUserSusPended(id);
    } else {
      handleUserActive(id);
    }
  };

  const handleUserSusPended = (id: string | undefined) => {
    if (id) {
      suspendedUser({
        variables: {
          id: id,
        },
      });
      if (suspendedError) {
        alert("사용자 정지 실패");
      }
    }
  };
  const handleUserActive = (id: string | undefined) => {
    if (id) {
      activeUser({
        variables: {
          id: id,
        },
      });
      if (activeError) {
        alert("사용자 활성화 실패");
      }
    }
  };

  const columns: TableColumn<UserType>[] = [
    { header: "ID", key: "id" },
    { header: "User ID", key: "user_id" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone_number" },
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
            onClick={() => handleStatus(user.status, user.id)}
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

  const handleRowClick = (user: UserType) => {
    console.log("Clicked user:", user);
  };

  const handleSelectionChange = (selectedUsers: UserType[]) => {
    console.log("Selected users:", selectedUsers);
  };
  console.log(data);
  if (loading || suspendedLoading || activeLoading) return <p>Loading...</p>;
  if (error || filteredError) return <p>Error: {error?.message || filteredError?.message}</p>;
  if (filteredLoading) return <p>검색중...</p>;

  return (
    <div>
      <UserSearchComponent
        open={openSearch}
        onOpenChange={setOpenSearch}
        filters={filters}
        checkboxes={checkboxes}
        onFilteredChange={setFilters}
        OnCheckboxChange={setCheckboxes}
        onClickSearch={handleSearchUser}
        initFilter={init_filters}
      />
      <Table<UserType>
        title="User List"
        data={data}
        columns={columns}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default UserInfoTab;
