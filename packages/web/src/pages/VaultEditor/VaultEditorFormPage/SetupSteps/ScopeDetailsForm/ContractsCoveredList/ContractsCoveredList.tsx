import { createNewCoveredContract } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useContext, useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { VaultEditorFormContext } from "../../../store";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";

export function ContractsCoveredList() {
  const { t } = useTranslation();

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray<IEditedVaultDescription>({ control, name: "contracts-covered" });

  const severitiesOptions = useWatch({ control, name: "severitiesOptions" });
  const severitiesFormIds = useMemo(
    () => (severitiesOptions ? severitiesOptions.map((sev) => sev.value) : []),
    [severitiesOptions]
  );

  return (
    <>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorContractsCoveredExplanation") }} />

      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} remove={remove} contractsCount={contracts.length} />
      ))}

      {!allFormDisabled && (
        <Button className="mt-4" styleType="invisible" onClick={() => append(createNewCoveredContract(severitiesFormIds))}>
          <AddIcon className="mr-1" />
          <span>{t("addContractAsset")}</span>
        </Button>
      )}

      <p className="helper-text mt-3">
        {t("totalAmountOfContracts")}: <strong>{contracts.length}</strong>
      </p>
    </>
  );
}
