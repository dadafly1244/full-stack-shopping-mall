import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "#/common/Breadcrumb";
import { Button, Spinner } from "@material-tailwind/react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_CART } from "#/apollo/query";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationDialog from "#/common/NotificationDialog";
import { CartType, CartItemType } from "#/utils/types";
import ProductImage from "#/common/ProductImage";
import Counter from "#/common/Counter";
import { REMOVE_FROM_CART, UPDATE_CART_ITEM_QUANTITY } from "#/apollo/mutation";
import { formatNumber } from "#/utils/formatter";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<CartType | null>(null);
  const [isInfoErrorOpen, setIsInfoErrorOpen] = useState(false);
  const [isUpdateErrorOpen, setIsUpdateErrorOpen] = useState(false);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserInfo, setCurrentUserInfo] = useState({ userId: "", userRole: "" });

  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [getCartFc, { loading, error }] = useLazyQuery(GET_USER_CART, {
    fetchPolicy: "network-only",
  });
  const [updateQuantityFc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_CART_ITEM_QUANTITY);

  const [deleteItemFc, { loading: deleteLoading, error: deleteError }] = useMutation(
    REMOVE_FROM_CART,
    {
      update(cache, { data: { removeFromCart } }) {
        const existingCart = cache.readQuery<{ getUserCart: CartType }>({
          query: GET_USER_CART,
          variables: { user_id: currentUserInfo.userId },
        });

        if (existingCart) {
          const updatedItems = existingCart.getUserCart.items.filter(
            (item) => item.id !== removeFromCart.id
          );

          cache.writeQuery({
            query: GET_USER_CART,
            variables: { user_id: currentUserInfo.userId },
            data: {
              getUserCart: {
                ...existingCart.getUserCart,
                items: updatedItems,
              },
            },
          });
        }
      },
      onError: () => {
        setIsDeleteErrorOpen(true);
      },
    }
  );

  const [count, setCount] = useState<{ [key: string]: number }>({});
  const [isOpenCounter, setIsOpenCounter] = useState<{ [key: string]: boolean }>({});

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSale, setTotalSale] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);

    if (storedToken) {
      const decodedToken = jwtDecode<JwtPayload>(storedToken);
      setCurrentUserInfo(decodedToken);
    }
  }, [location, token]);

  useEffect(() => {
    if (currentUserInfo.userId) {
      getCartFc({
        variables: { user_id: currentUserInfo.userId },
        onCompleted: (fetchedData) => {
          if (fetchedData?.getUserCart) {
            setData(fetchedData.getUserCart);

            const initialCount: { [key: string]: number } = {};
            const initialIsOpenCounter: { [key: string]: boolean } = {};
            fetchedData.getUserCart.items.forEach((item: CartItemType) => {
              initialCount[item.id] = item.quantity;
              initialIsOpenCounter[item.id] = false;
            });
            setCount(initialCount);
            setIsOpenCounter(initialIsOpenCounter);
          }
        },
        onError: () => {
          setIsInfoErrorOpen(true);
        },
      });
    }
  }, [currentUserInfo.userId, getCartFc]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked && data?.items) {
        setSelectedItems([...data.items]);
      } else {
        setSelectedItems([]);
      }
    },
    [data]
  );

  const handleSelectAllButton = useCallback(() => {
    if (data?.items && selectedItems.length < data?.items.length) {
      setSelectedItems([...data.items]);
    } else {
      setSelectedItems([]);
    }
  }, [data, selectedItems]);

  const handleDeleteSelectedButton = useCallback(() => {
    if (selectedItems.length > 0) {
      Promise.all(
        selectedItems.map((item) =>
          deleteItemFc({
            variables: {
              cart_item_id: item.id,
            },
          })
        )
      )
        .then(() => {
          setSelectedItems([]);
          // Refetch cart data after deleting items
          getCartFc({ variables: { user_id: currentUserInfo.userId } });
        })
        .catch((error) => {
          console.error("Error deleting items:", error);
          setIsDeleteErrorOpen(true);
        });
    }
  }, [selectedItems, deleteItemFc, getCartFc, currentUserInfo.userId]);

  const handleSelectItem = (item: CartItemType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems((prev) =>
      e.target.checked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
    );
  };

  const isSelected = useCallback(
    (item: CartItemType) => selectedItems.some((i) => i.id === item.id),
    [selectedItems]
  );

  useEffect(() => {
    console.log("selectedItems", selectedItems);
    setTotalSale(0);
    setTotalPrice(0);

    if (selectedItems.length > 0) {
      let totalSale = 0;
      let totalPrice = 0;

      selectedItems.forEach((item) => {
        // 누적합산 로직으로 변경
        const saleAmount = item.product?.sale ? item.product.sale * item.quantity : 0;
        const priceAmount = item.product.price * item.quantity;

        totalSale += saleAmount;
        totalPrice += priceAmount;
      });

      // 계산이 완료된 값을 한번에 set
      setTotalSale(totalSale);
      setTotalPrice(totalPrice);
    }
  }, [selectedItems]);

  const handleToggleCounter = (itemId: string) => {
    setIsOpenCounter((prev) => {
      const isOpen = !prev[itemId];

      // 카운터가 열릴 때만 수량을 업데이트하도록 변경
      if (isOpen && data?.items) {
        const resetCount = data.items.find((i) => i.id === itemId)?.quantity;
        setCount((prev) => ({ ...prev, [itemId]: resetCount ?? prev[itemId] }));
      }

      return { ...prev, [itemId]: isOpen };
    });
  };

  const handleUpdateQuantity = (cart_item_id: string) => {
    if (count[cart_item_id] && isOpenCounter[cart_item_id]) {
      updateQuantityFc({
        variables: {
          cart_item_id: cart_item_id,
          quantity: count[cart_item_id],
        },
        onCompleted: () => {
          getCartFc({
            variables: { user_id: currentUserInfo.userId },
            onCompleted: (fetchedData) => {
              if (fetchedData?.getUserCart) {
                setData(fetchedData.getUserCart);
                setSelectedItems([]);
              }
            },
          });
          setIsOpenCounter((prev) => ({ ...prev, [cart_item_id]: false }));
        },
        onError: () => {
          setIsUpdateErrorOpen(true);
        },
      });
    }
  };

  const handleDeleteItem = (cart_item_id: string) => {
    try {
      deleteItemFc({
        variables: {
          cart_item_id,
        },
        onCompleted: () => {
          getCartFc({
            variables: { user_id: currentUserInfo.userId },
            onCompleted: (fetchedData) => {
              if (fetchedData?.getUserCart) {
                setData(fetchedData.getUserCart);
              }
              setSelectedItems([]);
            },
          });
        },
        onError: () => {
          setIsDeleteErrorOpen(true);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderCart = useCallback(() => {
    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    // 선택된 상품 정보를 URL-safe한 문자열로 변환
    const selectedItemsString = encodeURIComponent(JSON.stringify(selectedItems));
    const cartIdString = encodeURIComponent(JSON.stringify(data?.id));

    // OrderSheet 페이지로 이동하면서 선택된 상품 정보를 state로 전달
    navigate(`/user/${currentUserInfo.userId}/order/sheet`, {
      state: {
        selectedItems: selectedItemsString,
        cartId: cartIdString,
        isMultipleItems: selectedItems.length > 1,
      },
    });
  }, [selectedItems, navigate, currentUserInfo.userId, data]);

  const handleOrderSingleItem = useCallback(
    (item: CartItemType) => {
      const singleItemString = encodeURIComponent(JSON.stringify([item]));
      const cartIdString = encodeURIComponent(JSON.stringify(data?.id));

      navigate(`/user/${currentUserInfo.userId}/order/sheet`, {
        state: {
          selectedItems: singleItemString,
          cartId: cartIdString,
          isMultipleItems: false,
        },
      });
    },
    [navigate, currentUserInfo.userId, data]
  );

  return (
    <div>
      <NotificationDialog
        isOpen={isInfoErrorOpen}
        title="ERROR!!"
        message={`장바구니 데이터를 불러오는데 에러가 발생했습니다. ${error?.message}`}
        onClose={() => setIsInfoErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isUpdateErrorOpen}
        title="ERROR!!"
        message={`상품 수량 변경에서 에러가 발생했습니다. ${updateError?.message}`}
        onClose={() => setIsUpdateErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isDeleteErrorOpen}
        title="ERROR!!"
        message={`상품 삭제에서 에러가 발생했습니다. ${deleteError?.message}`}
        onClose={() => setIsDeleteErrorOpen(false)}
      />
      <div className="pt-5">
        <Breadcrumb />
      </div>
      <div>
        <div className="w-full py-4 mt-4 flex justify-between">
          <Button
            variant="outlined"
            className="border-gray-400  p-2"
            onClick={handleSelectAllButton}
          >
            전체선택
          </Button>
          <Button
            loading={deleteLoading}
            onClick={handleDeleteSelectedButton}
            className="border-gray-400 p-2"
          >
            선택삭제
          </Button>
        </div>
        <div className="w-full border border-solid border-gray-200 rounded-xl p-8">
          {loading && <Spinner />}
          <div className="flex border-b-4 border-solid border-gray-600 pb-4">
            <input
              className="mr-4"
              type="checkbox"
              onChange={handleSelectAll}
              checked={data?.items?.length ? selectedItems?.length === data?.items?.length : false}
            />
            <div className="text-lg">
              <span className="font-bold text-xl">{data?.user.name}</span>님의 장바구니
            </div>
            <div className="flex justify-center items-center px-2">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
            </div>
          </div>
          <div>
            {data?.items.map((item) => {
              return (
                <div key={item.id} className="flex w-full  border-b border-solid  border-gray-200">
                  <div className="flex justify-center items-center pr-4">
                    <input
                      type="checkbox"
                      onChange={handleSelectItem(item)}
                      checked={isSelected(item)}
                    />
                  </div>
                  <div className="flex w-full justify-start content-center">
                    <div className="p-4 flex justify-start items-center w-[500px] border-r border-solid  border-gray-200">
                      <div>
                        <ProductImage
                          imagePath={item.product.main_image_path}
                          alt={item.product.name}
                          className="w-24 h-24 rounded-lg object-contain mr-4"
                        />
                      </div>
                      <div className="flex flex-col text-base font-extrabold text-gray-700">
                        <div className="flex justify-start items-center">
                          <svg
                            className="w-4 h-4 text-sm fill-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                          >
                            <path d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
                          </svg>
                          <span className="text-xs text-green-400 pr-1">가능</span>
                          <div className="text-base font-extrabold text-gray-800">
                            {item.product.name}
                          </div>
                        </div>
                        <div>{formatNumber(item.product.price)}원</div>
                      </div>
                    </div>
                    <div className="p-4  flex flex-col w-2/6 border-r border-solid  border-gray-200">
                      <div className="text-sm font-base">
                        <span>상품 주문 수량: </span>
                        {item.quantity}개
                      </div>
                      <div>
                        <Button
                          variant="outlined"
                          className="p-2"
                          onClick={() => handleToggleCounter(item.id)}
                        >
                          {isOpenCounter[item.id] ? "수정닫기" : "주문수정"}
                        </Button>
                      </div>
                      {isOpenCounter[item.id] && (
                        <div>
                          <div className=" flex items-end py-5">
                            <Counter
                              defaultValue={count[item.id]}
                              maxValue={item.product.count}
                              onChangeCount={(newCount) =>
                                setCount((prev) => ({ ...prev, [item.id]: newCount }))
                              }
                            />
                          </div>
                          <Button
                            className="p-2"
                            variant="text"
                            loading={deleteLoading}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            삭제
                          </Button>
                          <Button
                            className="p-2"
                            loading={updateLoading}
                            onClick={() => handleUpdateQuantity(item.id)}
                          >
                            수정
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-center content-center items-center mx-auto">
                      {item.product?.sale ? (
                        <>
                          <div className="text-sm font-semibold text-gray-700">판매가</div>
                          <div className="text-xl font-bold text-gray-800">
                            {formatNumber(item.product.sale)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-semibold text-gray-700">판매가</div>
                          <div className="text-base font-bold text-gray-800">
                            {formatNumber(item.product.price)}
                          </div>
                        </>
                      )}
                      <Button
                        onClick={() => handleOrderSingleItem(item)}
                        variant="outlined"
                        className="p-2 text-green-400 border-green-400"
                      >
                        주문하기
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center text-lg font-semibold text-gray-700 pt-4 px-4">
            <div className="flex flex-col justify-center items-center px-8">
              <div>총 상품 금액 </div>
              <div className="text-xl">{formatNumber(totalPrice)}원</div>
            </div>
            <div className="flex flex-col justify-center items-center px-8">-</div>
            <div className="flex flex-col justify-center items-center px-8">
              <div>총 할인 금액</div>
              <div className="text-red-500 text-xl">{formatNumber(totalPrice - totalSale)}</div>
            </div>
            <div className="flex flex-col justify-center items-center px-8 border-l border-solid border-gray-200">
              <div>주문 금액</div>
              <div>{formatNumber(totalSale)}원</div>
            </div>
            <div className="flex flex-col justify-center items-center px-8">
              <Button onClick={handleOrderCart} className="text-white bg-green-400">
                주문하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
