import { Outlet } from "react-router-dom";
import PatientHeader from "../headers/PatientHeader";
import styles from "./pageLayout.module.css";

const PatientPageLayout = () => (
  <div>
    <PatientHeader />
    <div className={styles.container}>
      <Outlet />
    </div>
  </div>
);

export default PatientPageLayout;
