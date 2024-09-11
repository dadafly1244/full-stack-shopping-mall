const NewProductCard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex items-start gap-10 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-center relative flex-1 grow rounded-md overflow-hidden border border-solid border-[#0000001a]">
          <div className="flex h-[340px] items-start w-full relative self-stretch">
            <div className="flex-1 grow bg-[#d8d8d880] relative self-stretch">
              <div className="absolute w-[308px] h-4 top-[161px] left-4 [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                Stylish Dress
              </div>
              <div className="flex-col inline-flex items-center justify-center px-2 py-1 absolute top-0 left-0 bg-color-background-positive-default rounded-[6px_0px_6px_0px]">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 whitespace-nowrap">
                  New Arrival
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 p-3 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
              Floral Maxi Dress
            </div>
            <div className="relative self-stretch [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-7">
              30,000원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductCard;
