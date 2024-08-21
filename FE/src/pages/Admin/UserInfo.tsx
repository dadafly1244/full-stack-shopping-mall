import { useQuery } from "@apollo/client";
import Table, { TableColumn } from "#/common/Table";
import { USER_INFO_ADMIN } from "#/apollo/query";
import { UserType, UserStatus } from "#/utils/types";
import { useMutation } from "@apollo/client";
import { ACTIVE_USER_ADMIN, SUSPENDED_USER_ADMIN } from "#/apollo/mutation";

const UserInfoTab = () => {
  const { data, loading, error } = useQuery(USER_INFO_ADMIN);
  const [suspendedUser, { loading: suspendedLoading, error: suspendedError }] = useMutation(
    SUSPENDED_USER_ADMIN,
    {
      refetchQueries: [{ query: USER_INFO_ADMIN }],
      // awaitRefetchQueries: true,
    }
  );
  const [activeUser, { loading: activeLoading, error: activeError }] = useMutation(
    ACTIVE_USER_ADMIN,
    {
      refetchQueries: [{ query: USER_INFO_ADMIN }],
      // awaitRefetchQueries: true,
    }
  );

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

  if (loading || suspendedLoading || activeLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <Table<UserType>
      title="User List"
      data={data?.usersList || []}
      columns={columns}
      onRowClick={handleRowClick}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export default UserInfoTab;
