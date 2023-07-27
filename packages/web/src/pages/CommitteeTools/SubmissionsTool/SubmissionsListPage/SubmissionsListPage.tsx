import { ISubmittedSubmission } from "@hats-finance/shared";
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import BoxUnselected from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import BoxSelected from "@mui/icons-material/CheckBoxOutlined";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import RescanIcon from "@mui/icons-material/ReplayOutlined";
import { Alert, Button, HatSpinner, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { LocalStorage } from "constants/constants";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { SubmissionCard } from "./SubmissionCard";
import { StyledSubmissionsListPage } from "./styles";

const ITEMS_PER_PAGE = 20;

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { address } = useAccount();
  const { keystore, initKeystore, openKeystore } = useKeystore();

  const { data: committeeSubmissions, isLoading } = useVaultSubmissionsByKeystore();
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const committeeSubmissionsGroups = useMemo<{ date: string; submissions: ISubmittedSubmission[] }[]>(() => {
    if (!committeeSubmissions) return [];
    const pagedSubmissions = committeeSubmissions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const submissionsGroupsByDate = pagedSubmissions.reduce<{ [key: string]: ISubmittedSubmission[] }>((groups, submission) => {
      const date = moment(+submission.createdAt * 1000).format("MM/DD/YYYY");
      if (!groups[date]) groups[date] = [];
      groups[date].push(submission);
      return groups;
    }, {});

    const submissionsGroupsByDateArray = Object.keys(submissionsGroupsByDate).map((date) => {
      return {
        date,
        submissions: submissionsGroupsByDate[date].sort(
          (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
        ),
      };
    });

    // Order array by date
    submissionsGroupsByDateArray.sort((a, b) => {
      const dateA = moment(a.date, "MM/DD/YYYY");
      const dateB = moment(b.date, "MM/DD/YYYY");
      return dateB.diff(dateA);
    });

    return submissionsGroupsByDateArray;
  }, [committeeSubmissions, page]);
  const allInPage = committeeSubmissionsGroups.reduce((prev, acc) => [...prev, ...acc.submissions], [] as ISubmittedSubmission[]);
  const quantityInPage = allInPage.length;
  const allPageSelected = allInPage.every((submission) => selectedSubmissions.includes(submission.subId));

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore]);

  const handleDownloadAsCsv = () => {
    if (!committeeSubmissions) return;
    if (committeeSubmissions.length === 0) return;

    const csvString = [
      ["beneficiary", "severity", "title"],
      ...committeeSubmissions.map((submission, idx) => [
        submission.submissionDataStructure?.beneficiary,
        submission.submissionDataStructure?.severity?.toLowerCase(),
        submission.submissionDataStructure?.title.replaceAll(",", "."),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `hats-submissions-${new Date().getTime()}.csv`);
    a.click();
  };

  const handleChangePage = (direction: number) => () => {
    if (direction === -1) {
      if (page === 1) return;
      setPage(page - 1);
    } else {
      if (page * ITEMS_PER_PAGE >= (committeeSubmissions?.length ?? 0)) return;
      setPage(page + 1);
    }
  };

  const handleRescan = async () => {
    const wantToRescan = await confirm({
      title: t("SubmissionsTool.rescanSubmissions"),
      titleIcon: <RescanIcon className="mr-2" fontSize="large" />,
      description: t("SubmissionsTool.rescanSubmissionsDescription"),
      cancelText: t("no"),
      confirmText: t("rescan"),
    });

    if (!wantToRescan) return;

    localStorage.removeItem(`${LocalStorage.Submissions}`);
    window.location.reload();
  };

  const handleSelectAll = () => {
    if (allPageSelected) {
      setSelectedSubmissions((selected) =>
        selected.filter((subId) => !allInPage.map((submission) => submission.subId).includes(subId))
      );
    } else {
      setSelectedSubmissions((selected) => [...selected, ...allInPage.map((submission) => submission.subId)]);
    }
  };

  return (
    <StyledSubmissionsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>
            {t("committeeTools")}/<span className="bold">{t("submissions")}</span>
          </p>
        </div>
      </div>

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
              <Button onClick={() => initKeystore()}>
                <KeyIcon className="mr-2" />
                {t("openPGPTool")}
              </Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <HatSpinner text={`${t("loadingSubmission")}...`} />
              ) : (
                <>
                  <div className="toolbar">
                    <div className="controls">
                      <div className="selection" onClick={handleSelectAll}>
                        {allPageSelected ? (
                          <BoxSelected className="icon" fontSize="inherit" />
                        ) : (
                          <BoxUnselected className="icon" fontSize="inherit" />
                        )}
                        <p>
                          {t("SubmissionsTool.selectAll")} ({quantityInPage})
                        </p>
                      </div>
                      <div className="rescan" onClick={handleRescan}>
                        <RescanIcon /> {t("SubmissionsTool.rescan")}
                      </div>
                      <div className="date-sort">
                        <CalendarIcon /> Sort by dates
                      </div>
                    </div>
                    <div className="pagination">
                      <p>
                        {(page - 1) * ITEMS_PER_PAGE + 1}-{(page - 1) * ITEMS_PER_PAGE + quantityInPage}
                        <strong> of {committeeSubmissions?.length ?? 0}</strong>
                      </p>
                      <div className="selection">
                        <ArrowLeftIcon onClick={handleChangePage(-1)} />
                        <ArrowRightIcon onClick={handleChangePage(1)} />
                      </div>
                    </div>
                  </div>
                  {selectedSubmissions.length > 0 && (
                    <Alert type="info" className="mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t("SubmissionsTool.youHaveSelectedNSubmissions", { num: selectedSubmissions.length }),
                        }}
                      />
                    </Alert>
                  )}
                  <div className="submissions-list">
                    {!committeeSubmissions || committeeSubmissions.length === 0 ? (
                      <>
                        <Alert className="mb-4" type="warning">
                          {t("submissionNotFound")}
                        </Alert>
                        <Button onClick={() => openKeystore()}>
                          <KeyIcon className="mr-2" />
                          {t("openPGPTool")}
                        </Button>
                      </>
                    ) : (
                      <>
                        {committeeSubmissionsGroups?.map((submissionsGroup, idx) => (
                          <div className="group" key={submissionsGroup.date}>
                            <p className="group-date">{moment(submissionsGroup.date, "MM/DD/YYYY").format("MMM DD, YYYY")}</p>
                            {submissionsGroup.submissions.map((submission) => (
                              <SubmissionCard
                                onCheckChange={(sub) => {
                                  if (selectedSubmissions.includes(sub.subId)) {
                                    setSelectedSubmissions(selectedSubmissions.filter((subId) => subId !== sub.subId));
                                  } else {
                                    setSelectedSubmissions([...selectedSubmissions, sub.subId]);
                                  }
                                }}
                                isChecked={selectedSubmissions.includes(submission.subId)}
                                key={submission.subId}
                                submission={submission}
                              />
                            ))}
                          </div>
                        ))}

                        <div className="pages">
                          <ArrowLeftIcon onClick={handleChangePage(-1)} />
                          {Array.from(
                            { length: committeeSubmissions ? Math.ceil(committeeSubmissions?.length / ITEMS_PER_PAGE) : 1 },
                            (_, i) => i + 1
                          ).map((pageIdx) => (
                            <p onClick={() => setPage(pageIdx)} className={`${page === pageIdx && "current"}`}>
                              {pageIdx}
                            </p>
                          ))}
                          <ArrowRightIcon onClick={handleChangePage(1)} />
                        </div>

                        <div className="buttons">
                          <Button onClick={handleDownloadAsCsv}>
                            <DownloadIcon className="mr-2" />
                            {t("downloadAsCsv")}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </StyledSubmissionsListPage>
  );
};
