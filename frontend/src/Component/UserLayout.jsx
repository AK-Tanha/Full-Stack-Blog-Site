import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import Footer from "./Footer";

const UserLayout = () => {
  const { i18n } = useTranslation();

  return (
    <div className={`bg-bgPrimary min-h-screen flex flex-col ${i18n.language === 'bn' ? 'font-bangla' : ''}`}>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
