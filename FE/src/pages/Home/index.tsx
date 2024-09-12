import { useEffect, useState } from "react";

import Ad from "#/pages/Home/Ad";
import { useQuery } from "@apollo/client";
import { HOME_QUERY } from "#/apollo/query";
import NewProducts from "#/pages/Home/NewProducts";
import EventProducts from "#/pages/Home/EventProducts";
import Categories from "#/pages/Home/Categories";
import Newsletter from "#/pages/Home//Newsletter";
import Map from "#/pages/Home/Map";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  return (
    <>
      <Ad />
      <div className="max-w-screen-xl w-full mx-auto">
        <Categories current={selectedCategory} onCategoryChange={setSelectedCategory} />
        <NewProducts data={data?.new} />
        <EventProducts data={data?.event} />
        <Newsletter />
        <Map />
      </div>
    </>
  );
};

export default HomePage;
