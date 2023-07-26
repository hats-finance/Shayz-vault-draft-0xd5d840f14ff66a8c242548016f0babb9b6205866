import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import MDEditor from "@uiw/react-md-editor";
import { Alert, Button, HatSpinner, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { IPFS_PREFIX } from "constants/constants";
import { RoutePaths } from "navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { SubmissionCard } from "../SubmissionsListPage/SubmissionCard";
import { useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { StyledSubmissionDetailsPage } from "./styles";

export const SubmissionDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { keystore, initKeystore } = useKeystore();

  const { subId } = useParams();
  const { data: committeeSubmissions, isLoading } = useVaultSubmissionsByKeystore();
  const submission = committeeSubmissions?.find((sub) => sub.subId === subId);

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore]);

  const openSubmissionOnChain = () => {
    window.open(`${IPFS_PREFIX}/${submission?.submissionHash}`, "_blank");
  };

  return (
    <StyledSubmissionDetailsPage className="content-wrapper-md">
      {!address ? (
        <>
          <Alert className="mb-4" type="error">
            {t("pleaseConnectYourCommitteeWallet")}
          </Alert>
          <WalletButton expanded />
        </>
      ) : (
        <>
          {!keystore ? (
            <>
              <Alert className="mb-4" type="error">
                {t("youNeedToOpenYourPGPTool")}
              </Alert>
              <Button onClick={() => initKeystore()}>{t("openPGPTool")}</Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <HatSpinner text={`${t("loadingSubmission")}...`} />
              ) : (
                <>
                  {!submission ? (
                    <>
                      <Alert className="mb-4" type="error">
                        {t("submissionNotFound")}
                      </Alert>
                      <Button onClick={() => initKeystore()}>{t("openPGPTool")}</Button>
                    </>
                  ) : (
                    <>
                      <div className="title-container">
                        <div className="title" onClick={() => navigate(`${RoutePaths.committee_tools}/submissions`)}>
                          <ArrowBackIcon />
                          <p>
                            {t("committeeTools")}/<span className="bold">{t("submission")}</span>
                          </p>
                        </div>
                      </div>
                      <SubmissionCard submission={submission} noActions />

                      <MDEditor.Markdown className="submission-content" source={submission?.submissionDataStructure?.content} />

                      <div className="buttons">
                        <Button onClick={openSubmissionOnChain}>{t("seeSubmissionOnChain")}</Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </StyledSubmissionDetailsPage>
  );
};
