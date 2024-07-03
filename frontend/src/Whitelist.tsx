import React, { useState, useEffect } from "react";
import styles from "./styles/app.module.scss";

interface FileDataItem {
  name: string;
  address: string;
}

const Whitelist = () => {
  const [fileData, setFileData] = useState<FileDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/download/storage.json");
        const data = await response.json();
        setFileData(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className={styles.whitelistWrapper}>
        <h1>Whitelist</h1>
        <ul>
          {fileData.map((item, index) => (
            <li key={index}>
              {item.name} - {item.address}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Whitelist;
