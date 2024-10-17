import { StaticMap } from "react-kakao-maps-sdk";

const Map = () => {
  return (
    <div className="border-t border-solid border-gray-400 ">
      <StaticMap // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 35.8007431029,
          lng: 128.5200295717,
        }}
        className="w-full h-[500px] my-28 border border-solid border-blue-300 rounded-lg"
        marker={{
          position: {
            lat: 35.8007431029,
            lng: 128.5200295717,
          },
          text: "대구수목원",
        }}
        level={3} // 지도의 확대 레벨
      />
    </div>
  );
};

export default Map;
