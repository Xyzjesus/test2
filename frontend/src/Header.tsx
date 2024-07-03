import React from "react";
import styles from "./styles/app.module.scss";
import seittersLogo from "../public/images/seittersLogo.png";
import burgerIcon from "../public/images/burger.svg";
import tgIcon from "../public/images/tg.svg";

type HeaderProps = {
  mainDomain: string;
  isMenuOpen: boolean;
  toggleMenu: (event: React.MouseEvent) => void;
};

const Header: React.FC<HeaderProps> = ({
  mainDomain,
  isMenuOpen,
  toggleMenu,
}) => {
  return (
    <header>
      <div className={styles.headerWrapper}>
        <div
          className={styles.logoWrapper}
          onClick={() => window.open(mainDomain)}>
          <img src={seittersLogo} alt="SEITTERS logo" className={styles.logo} />
        </div>
        <div className={styles.burger} onClick={(event) => toggleMenu(event)}>
          {isMenuOpen ? (
            <>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  textAlign: "center",
                  width: "100%",
                  padding: "0",
                  gap: "20px",
                  listStyleType: "none",
                }}>
                <li className={styles.listItem}>about</li>
                <li className={styles.listItem}>woofnomics</li>
                <li className={styles.listItem}>poopaper</li>
                <li className={styles.listItem}>socials</li>
              </ul>
            </>
          ) : (
            <img className={styles.burgerIcon} src={burgerIcon} />
          )}
        </div>
        <nav>
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
              width: "100%",
              padding: "0",
              gap: "20px",
              listStyleType: "none",
            }}>
            <li className={styles.listItem}>about</li>
            <li className={styles.listItem}>woofnomics</li>
            <li className={styles.listItem}>poopaper</li>
            <li className={styles.listItem}>socials</li>
          </ul>
        </nav>
        <button
          onClick={() => window.open("https://t.me/seitters", "_blank")}
          className={styles.actionButton}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "fit-content",
            }}>
            <img src={tgIcon} alt="join telegram" />{" "}
            <p className={styles.contactsText}>join telegram</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
