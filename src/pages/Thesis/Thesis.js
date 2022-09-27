import React from "react";
import { pageLayoutStyles } from "../../utils/styles/styles";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";

const Thesis = () => {
  const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
  const { user } = useAuth();
  return <div className={`${pageLayoutStyles.scrollable} flex flex-col`}></div>;
};

export default Thesis;
