import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledLeaderboardSection = styled.div<{ cols: number }>(
  ({ cols }) => css`
    padding-bottom: ${getSpacing(10)};

    .leaderboard {
      display: grid;
      grid-template-columns: repeat(${cols}, auto);
      /* row-gap: ${getSpacing(4)}; */

      .header,
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${getSpacing(3)} 0;
        font-family: "IBM Plex Mono", monospace;
      }

      .content {
        border-top: 1px solid var(--primary-light);
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};

        &.prize {
          font-weight: 700;
        }
      }
    }

    span.error {
      display: block;
      color: var(--error-red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
