import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { JwtPayload } from "#/utils/auth";
import Welcome from "#/pages/Home/Welcome";
import Ad from "#/pages/Home/Ad";
import { useQuery } from "@apollo/client";
import { HOME_QUERY } from "#/apollo/query";
import NewProducts from "./NewProducts";
import Categories from "./Categories";
const HomePage = () => {
  const token = localStorage.getItem("token") || "";

  const [isShowAdminButton, setIsShowAdminButton] = useState(false);
  useEffect(() => {
    if (!token) return;
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (!decodedToken) setIsShowAdminButton(false);
    if (decodedToken.userRole === "ADMIN") setIsShowAdminButton(true);
    else setIsShowAdminButton(false);
  }, [token, isShowAdminButton]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const {
    data: allData,
    loading,
    error,
    refetch,
  } = useQuery(HOME_QUERY, {
    variables: {
      category: selectedCategory,
    },
  });
  const [data, setData] = useState(allData?.getAllProductsForHomePage);

  useEffect(() => {
    if (allData?.getAllProductsForHomePage) setData(allData?.getAllProductsForHomePage);
  }, [selectedCategory, refetch, allData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;
  return (
    <>
      <Welcome />
      <div className="h-10 max-w-screen-xl w-full mx-auto bg-red-100">
        <div className="">
          홈입니다다다다다다다
          {isShowAdminButton && (
            <Button color="blue" type="submit" size="md">
              <Link to="/admin">관리자 페이지</Link>
            </Button>
          )}
        </div>
        <Ad data={data?.ad} />
        <Categories current={selectedCategory} onCategoryChange={setSelectedCategory} />
        <NewProducts data={data?.new} />
      </div>
    </>
  );
};

export default HomePage;
