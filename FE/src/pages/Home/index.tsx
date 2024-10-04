import { useEffect, useState } from "react";

import Ad from "#/pages/Home/Ad";
import { useQuery } from "@apollo/client";
import { HOME_QUERY } from "#/apollo/query";
import NewProducts from "#/pages/Home/NewProducts";
import EventProducts from "#/pages/Home/EventProducts";
import CarouselSlider from "#/pages/Home/CategoriesCarousel";
import Map from "#/pages/Home/Map";
import { Button, Spinner } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
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

  if (error) {
    return (
      <div className="max-w-screen-xl w-full mx-auto h-full py-40 px-96 flex flex-col justify-center content-center items-center">
        <div className="w-full  flex flex-col justify-center items-center">
          <div className="w-56 h-56">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
          </div>
          <div className="text-gray-600 text-2xl font-extrabold">no data found</div>
          <div className="text-gray-600 text-2xl font-extrabold">{error?.message}</div>
          <NavLink to="/">
            <Button className="w-52">홈 페이지로 되돌아가기</Button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <Ad />
      <div className="max-w-screen-xl w-full mx-auto">
        {loading && <Spinner />}
        <CarouselSlider current={selectedCategory} onCategoryChange={setSelectedCategory} />
        <NewProducts data={data?.new} />
        <EventProducts data={data?.event} />
        <Map />
      </div>
    </>
  );
};

export default HomePage;
