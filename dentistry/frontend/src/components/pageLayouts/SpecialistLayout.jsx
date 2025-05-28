import { Outlet } from "react-router-dom";
import SpecialistHeader from "../headers/SpecialistHeader";
import styles from "./pageLayout.module.css";

const SpecialistLayout = () => (
  <div>
    <SpecialistHeader />
    <div className={styles.container}>
      <Outlet />
    </div>
  </div>
);

export default SpecialistLayout;
