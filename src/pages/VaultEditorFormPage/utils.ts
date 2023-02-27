import { v4 as uuid } from "uuid";
import { ICommitteeMember, IVaultDescription } from "types";
import { getVulnerabilitySeveritiesTemplate } from "./severities";
import {
  IEditedContractCovered,
  IEditedVaultDescription,
  IEditedVulnerabilitySeverity,
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
} from "./types";

export const createNewCommitteeMember = (): ICommitteeMember => ({
  name: "",
  address: "",
  "twitter-link": "",
  "image-ipfs-link": "",
});

export const createNewCoveredContract = (sevIds?: string[]): IEditedContractCovered => {
  const severitiesIds = sevIds ? [...sevIds] : [];
  severitiesIds.sort();

  return {
    name: "",
    address: "",
    severities: severitiesIds,
  };
};

export const createNewVulnerabilitySeverity = (version: "v1" | "v2"): IEditedVulnerabilitySeverity => {
  const editedVulnerabilitySeverityBase = {
    id: uuid(),
    name: "",
    "contracts-covered": [],
    "nft-metadata": {
      name: "",
      description: "",
      animation_url: "",
      image: "",
      external_url: "",
    },
    description: "",
  };

  if (version === "v1") {
    return {
      ...editedVulnerabilitySeverityBase,
      index: 0,
    } as IEditedVulnerabilitySeverityV1;
  } else {
    return {
      ...editedVulnerabilitySeverityBase,
      percentage: 0,
    } as IEditedVulnerabilitySeverityV2;
  }
};

export const createNewVaultDescription = (version: "v1" | "v2", useAuditTemplate = false): IEditedVaultDescription => {
  const vulnerabilitySeveritiesTemplate = getVulnerabilitySeveritiesTemplate(version, useAuditTemplate);
  const severitiesIds = vulnerabilitySeveritiesTemplate.severities.map((s) => s.id as string);
  const severitiesOptionsForContractsCovered = vulnerabilitySeveritiesTemplate.severities.map(
    (s: IEditedVulnerabilitySeverity) => ({
      label: s.name,
      value: s.id as string,
    })
  );

  return {
    version,
    "project-metadata": {
      name: "",
      icon: "",
      tokenIcon: "",
      website: "",
      type: "",
    },
    "communication-channel": {
      "pgp-pk": [],
    },
    committee: {
      "multisig-address": "",
      members: [{ ...createNewCommitteeMember() }],
    },
    "contracts-covered": [{ ...createNewCoveredContract(severitiesIds) }],
    "vulnerability-severities-spec": vulnerabilitySeveritiesTemplate,
    source: {
      name: "",
      url: "",
    },
    severitiesOptions: severitiesOptionsForContractsCovered,
    includesStartAndEndTime: true,
  } as IEditedVaultDescription;
};

function severitiesToContractsCoveredForm(severities: IEditedVulnerabilitySeverity[]): IEditedContractCovered[] {
  let contractsForm = [] as IEditedContractCovered[];

  severities.forEach((severity) => {
    const contractsCovered = severity["contracts-covered"];

    if (contractsCovered && contractsCovered.length > 0) {
      contractsCovered.forEach((contractCovered) => {
        const name = Object.keys(contractCovered)[0];
        const address = Object.values(contractCovered)[0] as string;
        const contract = contractsForm.find((c) => c.name === name && c.address === address);

        if (contract) {
          const contractIndex = contractsForm.indexOf(contract);
          contractsForm[contractIndex] = {
            name,
            address,
            severities: [...contract.severities, severity.id as string],
          };
        } else {
          contractsForm.push({
            name,
            address,
            severities: [severity.id as string],
          });
        }
      });
    } else {
      contractsForm.push({
        ...createNewCoveredContract(),
        severities: [severity.id as string],
      });
    }
  });

  return contractsForm;
}

export function descriptionToEditedForm(vaultDescription: IVaultDescription): IEditedVaultDescription {
  const severitiesWithIds: IEditedVulnerabilitySeverity[] = vaultDescription.severities.map((sev) => ({
    ...sev,
    id: uuid(),
  }));

  const severitiesOptions = severitiesWithIds.map((s) => ({
    label: s.name,
    value: s.id as string,
  }));

  if (vaultDescription.version === "v1" || !vaultDescription.version) {
    return {
      ...vaultDescription,
      version: "v1",
      "vulnerability-severities-spec": {
        severities: severitiesWithIds as IEditedVulnerabilitySeverityV1[],
        name: "",
        indexArray: vaultDescription.indexArray,
      },
      "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
      severitiesOptions,
      includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
    };
  }

  return {
    ...vaultDescription,
    version: "v2",
    "vulnerability-severities-spec": {
      severities: severitiesWithIds as IEditedVulnerabilitySeverityV2[],
      name: "",
    },
    "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
    severitiesOptions,
    includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
  };
}

export function editedFormToDescription(editedVaultDescription: IEditedVaultDescription): IVaultDescription {
  return {
    version: editedVaultDescription.version,
    "project-metadata": editedVaultDescription["project-metadata"],
    "communication-channel": editedVaultDescription["communication-channel"],
    committee: editedVaultDescription.committee,
    source: editedVaultDescription.source,
    severities: editedVaultDescription["vulnerability-severities-spec"].severities.map((severity) => {
      const newSeverity = { ...severity };

      const severityId = newSeverity.id as string;
      if (newSeverity.id) delete newSeverity.id;

      return {
        ...newSeverity,
        "contracts-covered": editedVaultDescription["contracts-covered"]
          .filter((contract) => contract.severities?.includes(severityId))
          .map((contract) => ({ [contract.name]: contract.address })),
      };
    }),
  };
}
