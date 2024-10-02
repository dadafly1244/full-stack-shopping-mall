import { Navigate, useParams } from "react-router-dom";

const OrderIndexRedirect = () => {
  const { userId } = useParams();
  return <Navigate to={`/user/${userId}/pay`} replace />;
};

export default OrderIndexRedirect;
