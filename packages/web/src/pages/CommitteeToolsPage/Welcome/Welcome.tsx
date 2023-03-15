import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { KeystoreContext, CreateKeystoreModal } from "components/Keystore";
import useModal from "hooks/useModal";
import "./index.scss";

const Welcome = () => {
  const { t } = useTranslation();
  const keystoreContext = useContext(KeystoreContext);
  const { isShowing: isShowingCreateKeystore, show: showCreateKeystore, hide: hideCreateKeystore } = useModal();

  return (
    <div className="committee-welcome">
      <h1 className="committee-welcome__title">{t("CommitteeTools.Welcome.title")}</h1>
      <p className="committee-welcome__content-1">{t("CommitteeTools.Welcome.content-1")}</p>
      <p className="committee-welcome__content-2">{t("CommitteeTools.Welcome.content-2")}</p>
      <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-1")}</p>
      <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-1-content")}</p>
      <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-2")}</p>
      <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-2-content")}</p>
      <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-3")}</p>
      <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-3-content")}</p>
      <div className="committee-welcome__button-container">
        {keystoreContext.isCreated ? (
          <button
            onClick={() => {
              if (prompt(t("CommitteeTools.Welcome.delete-confirmation")) === t("CommitteeTools.Welcome.delete-yes")) {
                keystoreContext.deleteKeystore();
              }
            }}>
            {t("CommitteeTools.Welcome.delete-vault")}
          </button>
        ) : (
          <button onClick={showCreateKeystore}>{t("CommitteeTools.create-keystore")}</button>
        )}
      </div>

      <CreateKeystoreModal isShowing={isShowingCreateKeystore} onHide={hideCreateKeystore} />
    </div>
  );
};

export default Welcome;
