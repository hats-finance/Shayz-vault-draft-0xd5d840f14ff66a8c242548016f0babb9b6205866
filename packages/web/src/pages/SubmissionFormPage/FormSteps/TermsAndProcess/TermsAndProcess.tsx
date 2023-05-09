import BugIcon from "assets/icons/bug-icon.svg";
import ErrosIcon from "assets/icons/error-icon.svg";
import QuestionIcon from "assets/icons/question-icon.svg";
import RewardIcon from "assets/icons/reward-icon.svg";
import TimelineIcon from "assets/icons/timeline-icon.svg";
import { TERMS_OF_USE } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useVaults } from "hooks/vaults/useVaults";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Award from "./components/Award/Award";
import "./index.scss";

export default function TermsAndProcess() {
  const { submissionData, setSubmissionData } = useContext(SubmissionFormContext);
  const [acceptedTermsOfUse, setAcceptedTermsOfUse] = useState(false);
  const { t } = useTranslation();

  const projectId = submissionData?.project?.projectId;
  const { vaults } = useVaults();
  const vault = vaults?.find((vault) => vault.id === projectId);
  const description = vault && vault.description;

  useEffect(() => {
    setAcceptedTermsOfUse(submissionData?.terms?.verified || false);
  }, [submissionData]);

  const awards = description?.severities.map((severity, index) => {
    return <Award key={index} vault={vault!} index={index} />;
  });

  const handleTermsAccepted = () => {
    setSubmissionData((prev) => {
      if (prev) return { ...prev, terms: { verified: true } };
    });
  };

  return (
    <div className="terms-and-process-wrapper">
      <div>{t("SubmitVulnerability.TermsAndProcess.pre-submission")}</div>

      <div className="section-title submission">1 {t("SubmitVulnerability.TermsAndProcess.submission-sub-title")}</div>
      <div className="section-content submission">{t("SubmitVulnerability.TermsAndProcess.submission")}</div>

      <div className="section-title fix">2 {t("SubmitVulnerability.TermsAndProcess.fix-sub-title")}</div>
      <div className="section-content fix">
        {t("SubmitVulnerability.TermsAndProcess.fix")}
        <div className="icon-text-wrapper">
          <img src={QuestionIcon} alt="question icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-question")}
        </div>

        <div className="icon-text-wrapper">
          <img src={ErrosIcon} alt="error icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-error")}
        </div>

        {t("SubmitVulnerability.TermsAndProcess.fix-text-1")}

        <div className="icon-text-wrapper">
          <img src={TimelineIcon} alt="timeline icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-timeline")}
        </div>

        <div className="icon-text-wrapper">
          <img src={BugIcon} alt="bugs icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-bugs")}
        </div>

        <div className="icon-text-wrapper">
          <img src={RewardIcon} alt="rewards icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-rewards")}
        </div>
      </div>

      <div className="section-title awards">3 {t("SubmitVulnerability.TermsAndProcess.awards-sub-title")}</div>
      <div className="section-content awards">
        {t("SubmitVulnerability.TermsAndProcess.awards-text-1")}
        {submissionData?.project?.verified ? (
          <table>
            <tbody>
              <tr>
                <th>Level</th>
                <th>Prize</th>
                <th>NFT</th>
              </tr>
              {awards}
            </tbody>
          </table>
        ) : (
          "Please choose project to view prizes"
        )}
        {t("SubmitVulnerability.TermsAndProcess.awards-text-2")}
      </div>

      <div className="warning-notice">{t("SubmitVulnerability.TermsAndProcess.warning-notice")}</div>

      <div className="accept-terms-wrapper">
        <div className="checkbox-container">
          <input type="checkbox" checked={acceptedTermsOfUse} onChange={() => setAcceptedTermsOfUse(!acceptedTermsOfUse)} />
          <label>
            I UNDERSTAND AND AGREE TO THE{" "}
            <u>
              <a {...defaultAnchorProps} href={TERMS_OF_USE}>
                TERMS OF USE
              </a>
            </u>
          </label>
        </div>
        <button disabled={!acceptedTermsOfUse} onClick={handleTermsAccepted}>
          NEXT
        </button>
      </div>
    </div>
  );
}
