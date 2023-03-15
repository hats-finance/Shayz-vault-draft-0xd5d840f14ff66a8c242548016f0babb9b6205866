import styled from "styled-components";

export const StyledSidebar = styled.nav`
  width: var(--sidebar-width);
  height: 100%;
  padding-top: 42px;
  display: flex;
  flex-direction: column;
  background-color: var(--dark-blue);
  border-right: 1px solid var(--blue);
  box-shadow: 0px 4px 38px -1px var(--sidebar-shadow);
  z-index: 2;

  .logo {
    align-self: center;
    margin-bottom: 50px;
  }

  .pools {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .arrow {
      cursor: pointer;
      transform: rotate(0deg);
      transition: transform 0.1s linear;
      margin: 15px;

      &.open {
        transform: rotate(90deg);
        transition: transform 0.1s linear;
      }
    }

    &.selected {
      background-color: var(--blue);
    }
  }

  .pools-links-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 25px;

    .pool-link-wrapper {
      display: flex;
      cursor: pointer;
      color: var(--white);
      margin: 10px;

      &:hover {
        opacity: 0.9;
      }

      .selected {
        font-weight: bold;
      }
    }
  }

  .bottom-wrapper {
    margin: auto;
    margin-bottom: 80px;
  }
`;
