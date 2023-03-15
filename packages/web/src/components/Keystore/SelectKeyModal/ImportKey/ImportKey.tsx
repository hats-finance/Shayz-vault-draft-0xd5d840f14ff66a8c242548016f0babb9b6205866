import { useContext, useRef, useState } from "react";
import { KeystoreContext } from "../../store";
import { readPrivateKeyFromStoredKey } from "../../utils";
import { FormInput } from "components";
import { useTranslation } from "react-i18next";
import { IStoredKey } from "../../types";

export default function ImportKey({ onFinish }: { onFinish: () => any }) {
  const { t } = useTranslation();
  const keystoreContext = useContext(KeystoreContext);
  const aliasRef = useRef<HTMLInputElement>(null);
  const passphraseRef = useRef<HTMLInputElement>(null);
  const privateKeyRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string>();

  const addKey = async () => {
    try {
      const alias = aliasRef.current!.value;
      const privateKey = privateKeyRef.current!.value!;
      const passphrase = passphraseRef.current!.value;

      if (privateKey === "") throw new Error(t("CommitteeTools.ImportKey.no-key-error"));
      const readKey = await readPrivateKeyFromStoredKey(privateKey, passphrase);
      if (!readKey.isDecrypted()) {
        throw new Error(t("CommitteeTools.ImportKey.no-passphrase-error"));
      }
      const toAdd: IStoredKey = {
        alias,
        privateKey,
        passphrase,
        publicKey: readKey.toPublic().armor(),
      };
      keystoreContext.addKey(toAdd);
      keystoreContext.setSelectedAlias(toAdd.alias);
      onFinish();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      return;
    }
  };

  return (
    <>
      <p className="keymodal-importkey__description">{t("CommitteeTools.keymodal.import-text")}</p>
      <label>{t("CommitteeTools.keymodal.alias")}</label>
      <input className="keymodal-importkey__input" ref={aliasRef} type="text" placeholder={t("CommitteeTools.keymodal.alias")} />
      <label>{t("CommitteeTools.keymodal.passphrase")}</label>
      <input
        className="keymodal-importkey__input"
        ref={passphraseRef}
        type="text"
        placeholder={t("CommitteeTools.keymodal.passphrase")}
      />
      <label>{t("CommitteeTools.keymodal.private-key")}</label>
      <FormInput type="textarea" pastable ref={privateKeyRef} placeholder={t("CommitteeTools.keymodal.paste-private-key")} />
      {error && error !== "" && <div className="error-label">{error}</div>}
      <button onClick={addKey}>{t("CommitteeTools.keymodal.import-keypair")}</button>
    </>
  );
}
