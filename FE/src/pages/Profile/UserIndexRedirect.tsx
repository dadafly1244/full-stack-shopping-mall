import { Navigate, useParams } from "react-router-dom";

const UserIndexRedirect = () => {
  const { userId } = useParams();
  return <Navigate to={`/user/${userId}/profile`} replace />;
};

export default UserIndexRedirect;
