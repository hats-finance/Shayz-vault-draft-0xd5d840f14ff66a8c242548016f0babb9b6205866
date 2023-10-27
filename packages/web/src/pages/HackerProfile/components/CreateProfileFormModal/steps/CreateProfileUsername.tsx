import { IHackerProfile } from "@hats-finance/shared";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount, useEnsName } from "wagmi";

export const CreateProfileUsername = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { data: ens } = useEnsName({ address });

  const { register } = useEnhancedFormContext<IHackerProfile>();

  return (
    <div className="create-profile-step">
      <div className="title">
        {t("HackerProfile.helloThere", { address: ens || shortenIfAddress(address, { startLength: 6 }) })}
      </div>
      <p className="mb-5">{t("HackerProfile.usernameIntro")}</p>

      <FormInput
        {...register("username")}
        label={t("HackerProfile.username")}
        colorable
        placeholder={t("HackerProfile.username-placeholder")}
      />
    </div>
  );
};
