import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledWelcomeCommittee = styled.div`
  color: var(--white);

  .title {
    font-size: var(--large);
    font-weight: 700;
  }

  .step-info {
    color: var(--grey-500);
    margin-bottom: ${getSpacing(3)};
  }
`;
