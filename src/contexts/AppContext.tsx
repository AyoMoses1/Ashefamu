/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { clearAccount, populateUser } from "../store/slice/accountSlice";
import { executeGetFacilities } from "../apis/facility";
import { populateFacilities } from "../store/slice/dataSlice";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { executeGetProfile } from "../apis/auth";

interface AppContextProps {
  logoutAccount: () => void;
  getUsersProfile: (token: string) => Promise<void>;
  isLoadingData: boolean; 
  currentFacility: OneFacilityDataType | null;
  setCurrentFacility: React.Dispatch<React.SetStateAction<OneFacilityDataType | null>>
}
const AppContext = createContext({} as AppContextProps)


interface AppContextProviderProps {
  children: ReactNode;
}
const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const tokenStore = useAppSelector(state => state.accountStore.tokenStore)
  const dispatch = useAppDispatch()
  const [currentFacility, setCurrentFacility] = useState<OneFacilityDataType | null>(null)
  const { facilities } = useAppSelector(state => state.dataStore)
  const { isOpen: isLoadingData, onOpen: openLoadingData, onClose: closeLoadingData } = useDisclosure()
  const toast = useToast({
    position: "bottom",
    isClosable: true,
    variant: "subtle",
  })
  // TOKEN EXPIRATION CHECK
  const checkTokenExpiration = () => {
    if (!tokenStore) return
    const id = setInterval(() => {
      const date = new Date(tokenStore.expires_at as string)
      const now = new Date()

      if (now < date) return
      logoutAccount()
      clearInterval(id)
    }, 2000)

  }

  // LOGOUT ACCOUNT
  const logoutAccount = () => {
    dispatch(clearAccount())
  }

  // GET PROFILE
  const getUsersProfile = async (token: string) => {
    const userData = await executeGetProfile(token)
    if(userData.status === "error") throw new Error("Failed to get account information, Try again")
    dispatch(populateUser(userData.data))
  }

  useEffect(() => {
    checkTokenExpiration()
  }, [])

  const handleGetFacilities = async () => {
    try {
      openLoadingData()
      const result = await executeGetFacilities(tokenStore!.token)
      if(result.status === "error") throw new Error(result.message) 
      dispatch(populateFacilities(result.data.data))
    }
    catch(err: any){
      console.log("Error:", err.message)
      const isNetwork = err.message.toLowerCase().includes("network")
      toast({
        title: isNetwork ? "Can't connect to internet, check your network settings" : err.message,
        status: isNetwork ? "warning" : "error"
      })
    }
    finally {
      closeLoadingData()
    }
  }

  useEffect(() => {
    if(facilities.length || !tokenStore) return
    handleGetFacilities()
  }, [])

  return (
    <AppContext.Provider value={{ logoutAccount, isLoadingData, currentFacility, getUsersProfile, setCurrentFacility }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider

export const useAppContext = () => useContext(AppContext)