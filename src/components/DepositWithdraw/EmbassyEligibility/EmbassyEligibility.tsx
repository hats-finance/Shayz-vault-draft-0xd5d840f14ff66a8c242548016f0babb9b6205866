import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { MINIMUM_DEPOSIT_TO_EMBASSY_PERCENTAGE } from "constants/constants";
import { useUserSharesPerVault } from "hooks/contractHooks";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault;
}

export default function EmbassyEligibility({ vault }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const availableToWithdraw = useUserSharesPerVault(vault.master.address, vault.pid, account!);
  const formatAvailableToWithdraw = availableToWithdraw ? Number(formatUnits(availableToWithdraw, vault.stakingTokenDecimals)) : 0;
  const minToEmbassy = (Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals)) - formatAvailableToWithdraw) * MINIMUM_DEPOSIT_TO_EMBASSY_PERCENTAGE;
  const isEligible = formatAvailableToWithdraw >= minToEmbassy;

  return (
    <div className="embassy-eligibility-wrapper">
      <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
      <div className="embassy-eligibility__content">
        {availableToWithdraw ? isEligible ?
          <span>
            {`${t("DepositWithdraw.EmbassyEligibility.text-3")}
            ${vault.description?.["project-metadata"].name}
            ${t("DepositWithdraw.EmbassyEligibility.text-4")}`} <br /><br />
          </span> :
          <span className="embassy-eligibility__content__min-to-embassy">
            {`${t("DepositWithdraw.EmbassyEligibility.text-1")}
            ${millify(minToEmbassy - formatAvailableToWithdraw)}
            ${t("DepositWithdraw.EmbassyEligibility.text-2")}`} <br /><br />
          </span>
          : ""}
        <span>{t("DepositWithdraw.EmbassyEligibility.text-5")}</span>
      </div>
    </div>
  )
}
