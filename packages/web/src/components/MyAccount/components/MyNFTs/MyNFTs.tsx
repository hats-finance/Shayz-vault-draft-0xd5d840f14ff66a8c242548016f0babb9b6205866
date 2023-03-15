import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useVaults } from "hooks/vaults/useVaults";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { NFTCard } from "components";
import { StyledMyNFT } from "./styles";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { userNfts } = useVaults();

  return (
    <StyledMyNFT>
      <span className="title">NFTs</span>

      <div className="airdrop-nfts-container">
        {!userNfts || userNfts?.length === 0 ? (
          <div className="no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div>
        ) : (
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
            speed={500}
            touchRatio={1.5}
            navigation
            effect={"flip"}>
            {userNfts?.map((userNft, index) => (
              <SwiperSlide key={index} className="nfts-slide">
                <NFTCard key={index} tokenId={userNft.nft.tokenId} tokenMetadata={userNft.metadata} chainId={userNft.chainId} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </StyledMyNFT>
  );
}
