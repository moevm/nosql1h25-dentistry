import React from 'react';
import { Outlet } from "react-router-dom";
import AdminHeader from "../headers/AdminHeader";
import styles from "./pageLayout.module.css";

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout; 