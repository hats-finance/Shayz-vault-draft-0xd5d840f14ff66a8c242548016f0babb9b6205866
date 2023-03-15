import { ipfsTransformUri } from "utils";
import { IVulnerabilitySeverity } from "types";
import { Media } from "components";
import "styles/NFTPrize.scss";

interface IProps {
  data: IVulnerabilitySeverity
}

export function NFTPrize(props: IProps) {
  const severity = props.data;

  return (
    <div className="nft-prize-wrapper">
      <span className="nft-name">{severity?.["nft-metadata"]?.name}</span>
      <Media link={ipfsTransformUri(severity?.["nft-metadata"]?.image)} className="nft-prize__video" />
      <div className="nft-info">
        <span className="subtitle">Description:</span>
        <span className="data">{severity?.["nft-metadata"]?.description}</span>
        <span className="subtitle">Severity:</span>
        <span className="data">{severity?.name.toUpperCase()}</span>
      </div>
    </div>
  )
}
