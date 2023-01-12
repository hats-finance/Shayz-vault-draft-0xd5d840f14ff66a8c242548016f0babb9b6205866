import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { readKey } from "openpgp";
import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { KeyManager } from "components/Keystore";
import { FormInput, FormPgpPublicKeyInput } from "components";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../../constants/constants";
import { StyledCommunicationChannelForm, StyledHelper } from "./styles";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";

const tooltipStyle = {
  ...RC_TOOLTIP_OVERLAY_INNER_STYLE,
  maxWidth: 500,
};

export function CommunicationChannelForm() {
  const { t } = useTranslation();
  const [showMobileHint, setShowMobileHint] = useState<boolean>(false);
  const [publicPgpKey, setPublicPgpKey] = useState<string>();
  const [pgpError, setPgpError] = useState<string>();

  const { control, formState, getValues, trigger } = useEnhancedFormContext();
  const { fields: keys, append, remove } = useFieldArray({ control, name: "communication-channel.pgp-pk" });

  const addPublicKey = async (pgpKey) => {
    setPgpError(undefined);
    if (pgpKey) {
      try {
        await readKey({ armoredKey: pgpKey });
        const watchedKeys = getValues("communication-channel.pgp-pk") as string[];
        if (watchedKeys.includes(pgpKey)) {
          throw new Error("Key already added");
        }
        append(pgpKey);
        trigger("communication-channel.pgp-pk");
      } catch (error: any) {
        setPgpError(error.message);
      }
    }
  };

  const getHelperComponent = () => {
    const TooltipComponent = () => (
      <>
        {t("VaultEditor.pgp-key-hint-1")}
        <Tooltip
          placement="top"
          overlayClassName="hint-tooltip"
          overlayInnerStyle={tooltipStyle}
          overlay={t("VaultEditor.pgp-key-hint-tooltip")}>
          <InfoIcon className="onlyDesktop" width="15" height="15" fill={Colors.white} />
        </Tooltip>
        {t("VaultEditor.pgp-key-hint-2")}
      </>
    );

    const HintComponent = () => (
      <div className="onlyMobile">
        <div className="hint-question" onClick={() => setShowMobileHint((old) => !old)}>
          {t("VaultEditor.pgp-key-hint-question")}
          {showMobileHint ? (
            <img src={UpArrowIcon} alt="down arrow" width={12} />
          ) : (
            <img src={DownArrowIcon} alt="down arrow" width={12} />
          )}
        </div>

        <div className={`hint-tooltip ${showMobileHint ? "show" : ""}`}>{t("VaultEditor.pgp-key-hint-tooltip")}</div>
      </div>
    );

    return (
      <StyledHelper>
        <TooltipComponent />
        <HintComponent />
      </StyledHelper>
    );
  };

  return (
    <StyledCommunicationChannelForm>
      {getHelperComponent()}

      <p className="description">{t("VaultEditor.pgp-key-description")}</p>

      <KeyManager
        onSelectedKey={(selectedKey) => {
          if (selectedKey) setPublicPgpKey(selectedKey.publicKey);
        }}
      />

      <div>
        <FormInput
          label={t("VaultEditor.pgp-key")}
          name="communication-channel.pgp-pk"
          error={getPath(formState.errors, "communication-channel.pgp-pk")}
          type="textarea"
          pastable
          colorable
          value={publicPgpKey}
          onChange={(e) => setPublicPgpKey(e.target.value)}
          placeholder={t("VaultEditor.pgp-key-placeholder")}
        />
      </div>

      <button type="button" onClick={() => addPublicKey(publicPgpKey)}>
        {t("VaultEditor.add-pgp")}
      </button>

      <div>
        {pgpError && <div>{pgpError}</div>}

        {keys.length > 0 && (
          <div className="key-list">
            {keys.map((key, index) => (
              <div key={key.id} className="key-card">
                <div className="key-number">{index + 1}</div>
                <div className="key-content">
                  <Controller
                    control={control}
                    name={`communication-channel.pgp-pk.${index}`}
                    render={({ field }) => <span>{field.value}</span>}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    {t("VaultEditor.remove-pgp")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Controller
        control={control}
        name={`project-metadata.name`}
        render={({ field }) => (
          <FormPgpPublicKeyInput
            isDirty={getPath(formState.dirtyFields, field.name)}
            error={getPath(formState.errors, field.name)}
            colorable
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`project-metadata.type`}
        render={({ field }) => (
          <FormPgpPublicKeyInput
            isDirty={getPath(formState.dirtyFields, field.name)}
            error={getPath(formState.errors, field.name)}
            colorable
            {...field}
          />
        )}
      />
    </StyledCommunicationChannelForm>
  );
}
