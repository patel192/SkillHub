 import { createContext,useContext,useState,useEffect } from "react";
 import apiCient from "../api/axiosConfig";
 import { useAuth } from "./AuthContext";
 const SettingsContext = createContext();

 export const SettingsProvider = ({children}) => {
    const {userId} = useAuth();
    const [settings, setsettings] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
      if(!userId){
        return;
      }
      fetchSettings();
    },[userId]);
    const fetchSettings = async () => {
        try{
         setloading(true);
         const res = await apiCient.get(`/user/${userId}/settings`);
         const data = res.data.data;
         setsettings(data);
         applyTheme(data.theme);
        }catch(err){
         console.error("Failed to fetch the Settings",err);
        }finally{
             setloading(false);
        }
    }
    const updateSettings = async (newSettings) => {
        try{
        const res = await apiCient.put(`/user/${userId}/settings`,newSettings);
        setsettings(res.data.data);
        if(newSettings.theme){
            applyTheme(newSettings.theme);
        }
        }catch(err){
         console.error("Failed to update error:",err);
        }
    }
    const applyTheme = (theme) => {
      const root = document.documentElement;
      if(theme === "dark"){
        root.classList.add("dark");
      }else{
        root.classList.remove("dark");
      }
      localStorage.setItem("theme",theme);
    }
return (
    <SettingsContext.Provider value={{settings,loading,updateSettings,refreshSettings:fetchSettings,}}>
        {children}
    </SettingsContext.Provider>
) 
}
export const useSettings = () => {
   return useContext(SettingsContext);
}