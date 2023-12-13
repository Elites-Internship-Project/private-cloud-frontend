import { useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { getAllSettingsByUserId } from "../services/settingsService";
import Base from "./base";

const Settings = (props) => {
  const user = isAuthenticated();

  useEffect(() => {
    getAllSettingsByUserId(user.id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <Base title="Settings"></Base>;
};

export default Settings;
