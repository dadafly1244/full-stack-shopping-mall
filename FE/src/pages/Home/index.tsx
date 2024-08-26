import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const HomePage = () => {
  return (
    <div className="h-10 w-100 bg-red-100">
      <div>
        <Button color="blue" type="submit" size="md">
          <Link to="/admin">관리자 페이지</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
