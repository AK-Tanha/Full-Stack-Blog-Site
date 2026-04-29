import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "./SEO";

const UserLayout = () => {
  const { i18n, t } = useTranslation();

  return (
    <div className={`bg-bgPrimary min-h-screen flex flex-col ${i18n.language === 'bn' ? 'font-bangla' : ''}`}>
      <SEO 
        title={t('siteName')} 
        description={t('siteDescription')} 
      />
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
