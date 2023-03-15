import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledConfirmDialog = styled.div`
  max-width: 400px;
  width: 100%;
  color: var(--white);

  .description {
    margin: ${getSpacing(2)} 0 ${getSpacing(6)};
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    gap: ${getSpacing(10)};
  }
`;
