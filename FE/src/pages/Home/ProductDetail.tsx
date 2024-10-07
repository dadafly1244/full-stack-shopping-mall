import { PRODUCT_DETAILS_USER } from "#/apollo/query";
import BreadcrumbComponent from "#/common/Breadcrumb";
import Counter from "#/common/Counter";
import ProductImage from "#/common/ProductImage";
import { calculateDiscountPercentage, formatNumber } from "#/utils/formatter";
import { CartItemType, ProductType } from "#/utils/types";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useFormatDate } from "#/hooks/useFormatDate";
import ProductReview from "#/pages/Home/ProductReviews";
import { ADD_TO_CART } from "#/apollo/mutation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import NotificationDialog from "#/common/NotificationDialog";
import ConfirmationDialog from "#/common/ConfirmationDialog";

const ProductInfo = ({
  storeName,
  categoryName,
  createAt,
  updateAt,
}: {
  storeName: string;
  categoryName: string;
  createAt: string;
  updateAt: string;
}) => {
  const createDate = useFormatDate({ date: createAt });
  const updateDate = useFormatDate({ date: updateAt });

  return (
    <div className="grid grid-cols-3 my-10 divide-x divide-y border border-solid border-gray-600">
      <div className="p-1 col-span-1 font-semibold text-center">판매처</div>
      <div className="p-1 px-3 col-span-2">{storeName}</div>
      <div className="p-1 col-span-1 font-semibold text-center">상품 카테고리</div>
      <div className="p-1  px-3 col-span-2">{categoryName}</div>
      <div className="p-1 col-span-1 font-semibold text-center">상품 등록일</div>
      <div className="p-1 px-3 col-span-2">{createDate}</div>
      <div className="p-1 col-span-1 font-semibold text-center">상품 수정일</div>
      <div className="p-1 px-3 col-span-2">{updateDate}</div>
    </div>
  );
};

const DetailInfo = ({ product }: { product: ProductType }) => {
  // const date = new Date();
  return (
    <div className="w-full flex flex-col">
      {product?.desc && (
        <div className="w-4/5 mx-auto flex my-10">
          <div className="mr-auto mb-auto">
            <svg
              className="w-10 h-10 fill-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z" />
            </svg>
          </div>
          <span className="font-bold text-xl whitespace-pre-line p-4">
            {product.desc}
            {/* 미을고 켯한내룲 지앙기호에 뎌토다솝곤, 뱌엽앙골. 뇌사검염으로 으쇰마각던 망잰져마거팍에
            루숬 늘안프저카잉되 발지를 리아도. 요코머셸의 몸근지만 진읃잘 허우넝밖에 젠인 첸옪가도를
            단지더갈 사보애쭝고미도 비맶어척을 자게니뵘의. 브애 베호런밴에서 우식토쩜 젬럴까
            기쿈끄쥬믈면서 애초아안사는 하홍다. 버밤멘이 저날 리딘후주를 몬트갓이본강은 시렌이어도
            운하는 마무게, 옵탈으 옸너다. 내러르난연섭은 미르코룰습도, 렎알은 텨알를하를 테디딘다
            하단툔. 았무뇨어 드드냉다 오찬았우헹라와 힝목이, 글으에 덤곤외연데 모잉적익딜굠을
            기라왑앙이 밍헨밀랜조롱을 밀추의. 간얀주 노가다, 완나그러를 다애로 므총의 카극엑슨
            넌이에 늉집서에, 미솨지라. 자이어 가톡아 오루에는, 른로시란, 앙여가일이 히늤빌이부터
            싱즈예 외힝도, 기졀갱기듯 납차칮다. 은맹긔다 허조가러 묘사돕니다 딘링으세요 디에히차를
            매안 더속지앵 구기졀까 비가애고, 돤즈데즈는. 곝온여어가 후드가고, 뭉킨고 깅으가
            므으알먼을 련탁지에 옐해브수의 온뎟라느를 랑라르린다 나우기 고오다. 묵온히비를
            빅댄니언에서 혀히춘진을 투어호기를 리주시며 느잔다 쟐짐멍북이 안찼 오교기는
            암욈러실에서. 조자안 아허란 칸사니멀다 하라귭 데울으로 민노린두를 부룡둘릴 좌납잔을,
            카테갠 펴은덕을 가안뷰노자. 초진간슬석 끼공을 땽녀 아왂요를 이가와 가겐다, 이길부라던
            자주진래는 르난으어야 안세갱늠끼됴파다. 렁구수를 니한과 쪈지쵼즉을 싰스아 온으로
            아즌므같이, 덤사다 딘으살엔이 놀웍힌딤부터 보제세요 슈뎝뫈있능우져너두처럼. 랄새다
            간공녁다 차미다 닌삭이 일코가븐 여무조는 퍼키는 게남위릴간두, 아브두닌끤언다. 런자군시가
            라털느푸를 센스구조로부터 카셈이 힝허다 아미리삐손신지를, 아롸즈이오엥 고하고
            의그놈널르개고 잘잔을 갈롬강은. 갈염이 주악 얼라젱딘웡은 제훝이 잴차들은 잰옹핀
            노은다이마헤어 눤이갑맞곁롱을, 과주런고는. 오빤 랍더죨졀다 하네알욜 어흐멀노닌 일니의
            덨케로막으며, 됴자포둡의 다기얼른온휵고묨의. 이하촌징면에요 쪃을 어만아요 존계큰가에서
            티네도네도았어. 된당은 료애, 게버고트지 후붜탄시지닉이 라닌고 나음이다. */}
          </span>

          <div className="ml-auto mt-auto">
            <svg
              className="w-10 h-10 fill-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72z" />
            </svg>
          </div>
        </div>
      )}
      {product?.desc_images_path && product?.desc_images_path.length > 0 && (
        <div className="w-full">
          {Array.from(product.desc_images_path).map((image: string, index: number) => (
            <ProductImage key={index} imagePath={image} className="w-full" />
          ))}
        </div>
      )}
      <div className="grid">
        <ProductInfo
          storeName={product?.store?.name || "알수 없음"}
          categoryName={product?.category?.name}
          createAt={product?.created_at || "알수 없음"}
          updateAt={product?.updated_at || "알수 없음"}
        />
      </div>
    </div>
  );
};

const TopTabHeader = ({ product }: { product: ProductType }) => {
  return (
    <div className="max-w-screen-xl w-full h-20 pt-2 bg-white  top-0 !fixed !z-[9999] ">
      <div className="w-full flex flex-col">
        <div className="w-full mx-auto flex">
          <div className="w-16 h-16 flex justify-center items-center">
            <ProductImage
              imagePath={product?.main_image_path}
              alt={product?.name}
              className="w-4/5 h-4/5 object-contain border border-solid border-gray-400 rounded-lg"
            />
          </div>
          <div className="ml-auto">
            <div className="text-right text-lg font-bold">{product?.name}</div>
            <div className="flex w-full items-end justify-end pb-2">
              {product?.sale && (
                <>
                  <div className="text-3xl font-normal text-red-600 mr-auto">
                    {calculateDiscountPercentage(product.sale, product.price)}%
                  </div>
                  <div className="text-base font-bold text-gray-400 line-through decoration-red-500 mr-2">
                    {formatNumber(product.price)}원
                  </div>
                </>
              )}
              <div className="text-3xl font-extrabold text-red-600">
                {formatNumber(product?.sale ? product.sale : product.price)}원
              </div>
            </div>
          </div>
        </div>
        <div>
          <TabsHeader className="bg-gray-200 border-b border-gray-300 bg-opacity-100">
            {tabData.map(({ label, value }) => (
              <Tab className="text-gray-700 transition-colors" key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </div>
    </div>
  );
};

const tabData = [
  {
    label: "상품 설명",
    value: "desc",
    element: (product: ProductType) => <DetailInfo product={product} />,
  },
  {
    label: "리뷰",
    value: "review",
    element: (product: ProductType) => <ProductReview product={product} />,
  },
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState<ProductType | undefined>();
  const [count, setCount] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tabState, setTabState] = useState(searchParams.get("tabState") || "desc");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserInfo, setCurrentUserInfo] = useState({ userId: "", userRole: "" });
  const [isAddCartError, setIsAddCartError] = useState(false);
  const [moveToCartOpen, setMoveToCartOpen] = useState(false);
  useEffect(() => {
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (decodedToken) setCurrentUserInfo(decodedToken);
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  const [addCartFc, { loading: addCartLoading, error: addCartError }] = useMutation(ADD_TO_CART);

  const handleAddCart = async () => {
    if (!currentUserInfo.userId || !product) return;

    try {
      await addCartFc({
        variables: {
          user_id: currentUserInfo.userId,
          product_id: product.id,
          quantity: count,
        },
        onCompleted: () => {
          setMoveToCartOpen(true);
        },
      });
    } catch (error) {
      setIsAddCartError(true);
      console.error("Error adding to cart:", error);
    }
  };

  const [showTopHeader, setShowTopHeader] = useState(false);
  const tabsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setShowTopHeader(tabsTop <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);

    if (!searchParams.get("pageStatus")) {
      searchParams.set("tabState", "desc");
      setSearchParams(searchParams);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { data, loading } = useQuery(PRODUCT_DETAILS_USER, {
    variables: {
      id: param?.productId,
    },
    fetchPolicy: "network-only",
  });
  const handleTabValue = (value: string) => {
    const newSearchParams = new URLSearchParams();
    setTabState(value);
    newSearchParams.set("tabState", value);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (data?.getProductDetailForHome) {
      setProduct(data?.getProductDetailForHome);
    }
  }, [data]);
  useEffect(() => {
    if (product?.sale) {
      const newDiscountPrice = (product.price - product.sale) * count;
      const newTotalPrice = product.sale * count;
      setDiscount(newDiscountPrice);
      setTotalPrice(newTotalPrice);
    } else {
      setDiscount(0);
      const newTotalPrice = product?.price ? product.price * count : 0;
      setTotalPrice(newTotalPrice);
    }
  }, [count, product]);

  const handleMoveToCartPage = () => {
    navigate(`/user/${currentUserInfo.userId}/cart`);
  };

  const handleOrderSingleItem = async (product: ProductType) => {
    await addCartFc({
      variables: {
        user_id: currentUserInfo.userId,
        product_id: product.id,
        quantity: count,
      },
      onCompleted: (data) => {
        const filteredData = data.addToCart.items.filter(
          (c: CartItemType) => c.product_id === product.id
        );

        const singleItemString = encodeURIComponent(JSON.stringify(filteredData));
        const cartIdString = encodeURIComponent(JSON.stringify(data.addToCart?.id));

        navigate(`/user/${currentUserInfo.userId}/order/sheet`, {
          state: {
            selectedItems: singleItemString,
            cartId: cartIdString,
            isMultipleItems: false,
          },
        });
      },
      onError: () => {
        setIsAddCartError(true);
      },
    });
  };

  return (
    <div className="w-full">
      <NotificationDialog
        isOpen={isAddCartError}
        title="ERROR!!"
        message={`에러가 발생했습니다. ${addCartError?.message}`}
        onClose={() => setIsAddCartError(false)}
      />
      <ConfirmationDialog
        isOpen={moveToCartOpen}
        message="장바구니에 물건을 추가했습니다. 장바구니로 이동하겠습니까?"
        onConfirm={handleMoveToCartPage}
        onCancel={() => setMoveToCartOpen(false)}
      />
      <BreadcrumbComponent />
      {loading && <Spinner />}
      {product && (
        <div className="w-full flex flex-col mt-5">
          {/* top */}
          <div className="w-full  h-[500px] flex">
            <div className="w-1/2  border-y border-l border-solid border-gray-200 flex justify-center items-center">
              <ProductImage
                imagePath={product?.main_image_path}
                alt={product?.name}
                className="w-4/5 h-4/5 object-contain border border-solid border-gray-400 rounded-lg"
              />
            </div>
            <div className="w-1/2 border border-solid border-gray-200 p-10">
              <div className="flex w-full justify-end pb-2 ">
                <h3 className="text-xl font-extrabold text-left">{product?.name}</h3>
              </div>

              <div className="flex w-full items-end justify-end pb-5 border-b border-solid border-gray-200">
                {!!product.sale && (
                  <>
                    <div className="text-3xl font-normal text-red-600 mr-auto">
                      {calculateDiscountPercentage(product?.sale, product.price)}%
                    </div>
                    <div className="text-base font-bold text-gray-400 line-through decoration-red-500 mr-2">
                      {formatNumber(product.price)}원
                    </div>
                  </>
                )}
                <div className="text-3xl font-extrabold text-red-600">
                  {formatNumber(product.sale ? product.sale : product.price)}원
                </div>
              </div>
              <div className=" flex items-end py-5 mb-10 border-b border-solid border-gray-200">
                <Counter defaultValue={count} maxValue={product.count} onChangeCount={setCount} />
                <div className="ml-auto text-xl font-extrabold text-gray-600">
                  {formatNumber(product.price * count)}원
                </div>
              </div>
              <div className=" border-gray-600 w-full h-28 rounded-md px-2 py-3">
                <div className="flex ">
                  <div className="flex justify-end pb-2 items-end">
                    <span className="mr-2">선택상품: </span>
                    <h3 className="text-lg font-extrabold text-left">{product?.name}</h3>
                  </div>
                  <div className="text-xl font-extrabold ml-auto">
                    <span className="text-base text-gray-600">총 </span>
                    <span className="">{formatNumber(count)}개</span>
                  </div>
                </div>
                <div className="flex items-end justify-end pt-5">
                  {!!discount && (
                    <div className="mr-auto text-base font-bold">
                      ({formatNumber(discount)}원 할인)
                    </div>
                  )}
                  <div className="text-3xl font-extrabold text-red-600 ">
                    <span className="text-2xl text-gray-600">총 </span>
                    <span className=" text-opacity-80">{formatNumber(totalPrice)}원</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-1 py-5">
                <Button
                  variant="outlined"
                  className="w-2/5"
                  loading={addCartLoading}
                  onClick={handleAddCart}
                >
                  장바구니
                </Button>
                <Button className="w-full" onClick={() => handleOrderSingleItem(product)}>
                  주문하기
                </Button>
              </div>
            </div>
          </div>
          {/** 밑부분 */}
          <div className="py-10">
            <Tabs value={tabState}>
              {showTopHeader && <TopTabHeader product={product} />}
              <div ref={tabsRef}>
                <TabsHeader className="bg-gray-200 border-b border-gray-300">
                  {tabData.map(({ label, value }) => (
                    <Tab
                      onClick={() => handleTabValue(value)}
                      className="text-gray-700 transition-colors"
                      key={value}
                      value={value}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
              </div>
              <TabsBody>
                {tabData.map(({ value, element }) => (
                  <TabPanel key={value} value={value}>
                    {product && element(product)}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
