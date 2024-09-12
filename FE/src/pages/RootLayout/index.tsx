import { Outlet } from "react-router-dom";
import Header from "#/common/Header";
import Footer from "#/common/Footer";

const RootLayout = () => {
  return (
    <div className="font-sans">
      <Header />
      <div className="flex flex-col justify-center content-center">
        <Outlet />
      </div>
      <Footer
        projectName="FE OJT"
        projectDescription="인포폴라 OJT 프로젝트 입니다."
        address="서울 강남구 테헤란로7길 22 한국과학기술회관 2관 9층 917호"
        companyName="(주)인포플라"
      />
    </div>
  );
};

export default RootLayout;
