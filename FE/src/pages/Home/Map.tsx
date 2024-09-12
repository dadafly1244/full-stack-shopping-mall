import { StaticMap } from "react-kakao-maps-sdk";

const Map = () => {
  return (
    <div className="border-t border-solid border-gray-400 ">
      <StaticMap // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 37.5006886,
          lng: 127.03068149,
        }}
        className="w-full h-[500px] my-28 border border-solid border-blue-300 rounded-lg"
        marker={{
          position: {
            lat: 37.5006886,
            lng: 127.03068149,
          },
          text: "인포플라",
        }}
        level={3} // 지도의 확대 레벨
      />
    </div>
  );
};

export default Map;
