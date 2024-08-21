import { cn } from "#/utils/utils";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-10 w-100 bg-red-100">
      <div>
        <button
          type="submit"
          className={cn(
            "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            "cursor-pointer"
          )}
        >
          <Link to="/admin">관리자 페이지</Link>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
