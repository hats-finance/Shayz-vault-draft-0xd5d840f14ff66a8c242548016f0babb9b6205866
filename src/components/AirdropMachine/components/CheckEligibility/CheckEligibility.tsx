import { useEthers } from "@usedapp/core";
import classNames from "classnames";
import Modal from "components/Shared/Modal/Modal";
import { isAddress } from "ethers/lib/utils";
import useModal from "hooks/useModal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Redeem from "../Redeem/Redeem";
import "./index.scss";

export default function CheckEligibility() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const [userInput, setUserInput] = useState("");
  const { isShowing, toggle } = useModal();
  const inputError = userInput && !isAddress(userInput);

  useEffect(() => {
    setUserInput(account ?? "");
  }, [setUserInput, account])

  /**
   * Check if the deadline is in the future - if not - disable the input box and show an appropriate error.
   */
  return (
    <div className="check-eligibility-wrapper">
      {t("AirdropMachine.CheckEligibility.text-1")}
      <div className="check-eligibility__input-wrapper">
        <div className={classNames({ "check-eligibility__input-container": true, "check-eligibility__input-error": inputError })}>
          <input
            className="check-eligibility__address-input"
            type="text"
            placeholder={t("AirdropMachine.CheckEligibility.input-placeholder")}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} />
          <button className="check-eligibility__clear-input" onClick={() => setUserInput("")}>&times;</button>
        </div>
        {inputError && <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.input-error")}</span>}
        <button
          className="check-eligibility__check-button fill"
          onClick={toggle}
          disabled={inputError || !userInput}>
          {t("AirdropMachine.CheckEligibility.button-text")}
        </button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}>
        <Redeem address={userInput} closeRedeemModal={toggle} />
      </Modal>
    </div>
  )
}
