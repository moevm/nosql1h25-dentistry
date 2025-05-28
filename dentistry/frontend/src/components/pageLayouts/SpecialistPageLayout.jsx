import { Outlet } from "react-router-dom";
import SpecialistHeader from "../headers/SpecialistHeader";
import styles from "./pageLayout.module.css";

const SpecialistPageLayout = () => (
  <div>
    <SpecialistHeader />
    <div className={styles.container}>
      <Outlet />
    </div>
  </div>
);

export default SpecialistPageLayout;
