/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { clearAccount, populateUser } from "../store/slice/accountSlice";
import { executeGetFacilities } from "../apis/facility";
import { populateFacilities } from "../store/slice/dataSlice";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { executeGetProfile } from "../apis/auth";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../utils/routeNames";

interface AppContextProps {
  logoutAccount: () => void;
  checkIncompleteReg: () => void;
  handleGetFacilities: () => Promise<void>;
  closeLoadingData: () => void;
  openLoadingData: () => void;
  getUsersProfile: (token: string) => Promise<void>;
  isLoadingData: boolean;
  currentFacility: OneFacilityDataType | null;
  setCurrentFacility: React.Dispatch<
    React.SetStateAction<OneFacilityDataType | null>
  >;
}
const AppContext = createContext({} as AppContextProps);

interface AppContextProviderProps {
  children: ReactNode;
}
const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const tokenStore = useAppSelector((state) => state.accountStore.tokenStore);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [currentFacility, setCurrentFacility] =
    useState<OneFacilityDataType | null>(null);
  const {
    isOpen: isLoadingData,
    onOpen: openLoadingData,
    onClose: closeLoadingData,
  } = useDisclosure();
  const navigate = useNavigate();

  const toast = useToast({
    position: "bottom",
    isClosable: true,
    variant: "subtle",
  });

  // TOKEN EXPIRATION CHECK
  const checkTokenExpiration = () => {
    if (!tokenStore) return;
    const id = setInterval(() => {
      const date = new Date(tokenStore.expires_at as string);
      const now = new Date();

      if (now < date) return;
      logoutAccount();
      clearInterval(id);
    }, 2000);
  };

  // LOGOUT ACCOUNT
  const logoutAccount = () => {
    dispatch(clearAccount());
  };

  // GET PROFILE
  const getUsersProfile = async (token: string) => {
    const userData = await executeGetProfile(token);
    if (userData.status === "error")
      throw new Error("Failed to get account information, Try again");
    dispatch(populateUser(userData.data));
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  // CHECK IF USER IS REGISTERING
  const checkIncompleteReg = () => {
    const regData = localStorage.getItem("REG_USER");
    if (regData) {
      const data = JSON.parse(regData) as RegUserType;
      navigate(ROUTES.VERIFY_CONTACT_ROUTE(data.email));
    }
  };

  // GET USER'S FACILITIES
  const handleGetFacilities = async () => {
    if (!pathname.includes("dashboard")) return;
    if (!tokenStore) return;
    try {
      openLoadingData();
      const result = await executeGetFacilities(tokenStore.token);
      if (result.status === "error") throw new Error(result.message);
      dispatch(populateFacilities(result.data.data));
    } catch (err: any) {
      console.log("Error:", err.message);
      const isNetwork = err.message.toLowerCase().includes("network");
      if (!pathname.includes("dashboard")) return;
      toast({
        title: isNetwork
          ? "Can't connect to internet, check your network settings"
          : err.message,
        status: isNetwork ? "warning" : "error",
      });
    } finally {
      closeLoadingData();
    }
  };

  useEffect(() => {
    handleGetFacilities();
  }, [tokenStore]);

  return (
    <AppContext.Provider
      value={{
        checkIncompleteReg,
        handleGetFacilities,
        logoutAccount,
        isLoadingData,
        currentFacility,
        openLoadingData,
        closeLoadingData,
        getUsersProfile,
        setCurrentFacility,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
