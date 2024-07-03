import { useRef, useEffect, useState } from "react";
import "./index.css";
import styles from "./styles/app.module.scss";
import tgIcon from "../public/images/tg.svg";
import seiIcon from "../public/images/sei.png";
import seiHero from "../public/images/seitters_hero.svg";
import seitterMeme from "../public/images/seitter_meme.png";
import woofIcon from "../public/images/woof.svg";
import xIcon from "../public/images/x.svg";
import githubIcon from "../public/images/github.svg";
import contactsIcon from "../public/images/contacts.svg";

import {
  animated,
  useSpring,
  useInView,
  useSpringRef,
  useTrail,
} from "@react-spring/web";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    isLoading: false,
    isSuccess: false,
    isCheckboxChecked: false,
    nameError: "",
    addressError: "",
  });

  const [ref, inView] = useInView();
  const [ref2, inView2] = useInView();

  const [anima, setAnima] = useState(false);
  const [anima2, setAnima2] = useState(false);

  const springRef = useSpringRef();

  const woofIconStyle = useSpring({
    from: { y: -200, opacity: 0 },
    to: { y: inView ? 0 : -200, opacity: inView ? 1 : 0 },
    delay: 700,
    pause: !inView || anima ? true : false,
  });

  const contactStyle = useSpring({
    from: { y: -200, opacity: 0 },
    to: { y: inView2 ? 0 : -200, opacity: inView2 ? 1 : 0 },
    delay: 1000,
    pause: !inView2 || anima2 ? true : false,
  });

  useEffect(() => {
    if (inView2 && anima2) {
      springRef.start();
      setAnima2(true);
    }
  }, [inView2, anima2, springRef]);

  const items = [
    { name: "github", icon: githubIcon, link: "https://github.com/seitters" },
    { name: "telegram", icon: tgIcon, link: "https://t.me/seitters" },
    { name: "twitter", icon: xIcon, link: "https://twitter.com/seitters" },
  ];

  const [trail, api] = useTrail(items.length, () => ({
    from: { y: -200, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 1500,
  }));

  useEffect(() => {
    if (inView && anima) {
      springRef.start();
      setAnima(true);
    }
  }, [inView, anima, springRef]);

  const springs = useSpring({
    from: { y: 200, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 1500,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let error = "";
    if (name === "address" && !/^sei1[a-z0-9]{38}$/.test(value)) {
      error = "only sei address support";
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Error`]: error,
    }));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const validValue = value.replace(/[^a-zA-Z0-9_\-:emoji:]/g, "");
    let error = "";
    if (validValue !== value) {
      error = "only latin alphabet, emoji and numbers";
    }
    setFormData((prev) => ({
      ...prev,
      name: validValue,
      nameError: error,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isCheckboxChecked: event.target.checked,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormData((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
        }),
      });

      const result = await response.json();

      setTimeout(() => {
        if (response.ok && result.success) {
          setFormData((prev) => ({
            ...prev,
            isSuccess: true,
            isLoading: false,
          }));
        } else {
          throw new Error(result.message || "Ошибка отправки данных");
        }
      }, 3000);
      console.log(result);
    } catch (error) {
      console.error(error);
      setFormData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div>
      <div>
        <div id="seitter" className={styles.seitterWrapper}>
          <div
            id="hero"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              minHeight: "600px",
              maxWidth: "1000px",
              margin: "auto",
            }}>
            <div className={styles.header}>FIRST SEI MEME TOKEN COMMUNITY</div>
            <img src={seiHero} alt="SEITTERS" className={styles.mHeader} />
          </div>

          <button
            style={{
              textTransform: "uppercase",
              padding: "0px",
              border: "1px solid var(--black)",
              alignSelf: "flex-start",
              backgroundColor: "var(--black)",
              color: "#e4efd9",
              borderRadius: "var(--borderRadius)",
              margin: "0px 0px 20px 20px",
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                width: "fit-content",
                maxWidth: "168px",
              }}>
              <img src={seiIcon} alt="sei blockchain logo" />
              <p style={{ width: "40%", textAlign: "left" }}>powered by sei</p>
            </div>
          </button>

          <animated.img
            src={seitterMeme}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translate(-45%, -50%)",
              ...springs,
            }}
            className={styles.seitter}
            loading="lazy"
          />

          <div id="woof" className={styles.woofBlock}>
            <div className={styles.woofWrapper}>
              <animated.img
                ref={ref}
                src={woofIcon}
                className={styles.woofHeader}
                alt="woof your interest"
                style={{ ...woofIconStyle }}
              />
              <form className={styles.woofForm} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="name"
                  className={`${styles.woofInput} ${
                    formData.nameError ? styles.inputError : ""
                  }`}
                  value={formData.name}
                  onChange={handleNameChange}
                />
                {formData.nameError && (
                  <div className={styles.errorText}>{formData.nameError}</div>
                )}
                <input
                  type="text"
                  placeholder="sei address"
                  className={`${styles.woofInput} ${
                    formData.addressError ? styles.inputError : ""
                  }`}
                  value={formData.address}
                  onChange={handleInputChange}
                  name="address"
                />
                {formData.addressError && (
                  <div className={styles.errorText}>
                    {formData.addressError}
                  </div>
                )}
                <div className={styles.woofCheckbox}>
                  <input
                    type="checkbox"
                    id="dataProcessingAgreement"
                    checked={formData.isCheckboxChecked}
                    name="dataProcessingAgreement"
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="dataProcessingAgreement">
                    allow data processing
                  </label>
                </div>
                <button
                  type="submit"
                  className={styles.woofButton}
                  disabled={!formData.isCheckboxChecked || formData.isLoading}>
                  {formData.isLoading ? (
                    <span className={styles.loadingCircle}>⏳</span>
                  ) : formData.isSuccess ? (
                    <span role="img" aria-label="poop emoji">
                      💩
                    </span>
                  ) : (
                    "poop"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <footer>
          <div className={styles.footerWrapper}>
            <div ref={ref2} className={styles.contactsWrapper}>
              {trail.map((style, index) => (
                <animated.button
                  className={styles.contactsPic}
                  onClick={() => window.open(items[index].link, "_blank")}
                  key={items[index].name}
                  style={{
                    ...style,
                  }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img src={items[index].icon} />
                    <p className={styles.contactsText}>{items[index].name}</p>
                  </div>
                </animated.button>
              ))}
            </div>

            <div
              style={{
                display: "block",
                marginTop: "30px",
              }}>
              {inView2 && (
                <animated.img
                  src={contactsIcon}
                  style={{ ...contactStyle }}
                  className={styles.contactsIcon}
                />
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
