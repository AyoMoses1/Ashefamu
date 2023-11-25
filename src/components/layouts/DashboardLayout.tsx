/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Container, Flex, Stack, useDisclosure, useMediaQuery } from "@chakra-ui/react"
import React, { ReactNode, useEffect } from "react"
import DashboardHeader from "../layout-components/DashboardHeader";
import SideNavigation from "../layout-components/SideNavigation";
import { useTheme } from "@emotion/react";
import MobileSideBar from "../layout-components/MobileSideBar";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Navigate } from "react-router-dom";
import ROUTES from "../../utils/routeNames";
import { executeGetDashboardCards } from "../../apis/user";
import { populateDashboardCards } from "../../store/slice/dataSlice";
import { LIGHT_BG } from "../../utils/color";
import { useAppContext } from "../../contexts/AppContext";

interface DashboardLayoutProps {
  children: ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const data = useTheme()
  const [isMobile] = useMediaQuery(`(max-width: ${(data as any).sizes?.container?.lg})`)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.accountStore.tokenStore)
  const { handleGetFacilities } = useAppContext();


  // GET DASHBOARD CARD
  const handleGetDashboardCard = async () => {
    if(!token) return
    try {
      const result = await executeGetDashboardCards(token.token)
      if(result.status === "error") throw new Error(result.message) 
      dispatch(populateDashboardCards(result.data))
    }
    catch(err: any){
      console.log("Error:", err.message)
    }
  }

  useEffect(() => {
    handleGetDashboardCard()
    handleGetFacilities()
  }, [token])


  const user = useAppSelector(state => state.accountStore.user)
  if(!user) return <Navigate replace to={ROUTES.LOGIN_ROUTE} />

  return (
    <Flex h={"100vh"} w={"full"} overflowX={"hidden"}>
      {isMobile ? <MobileSideBar isOpen={isOpen} onClose={onClose} /> : <SideNavigation />}
      <Stack flex={1} bg={LIGHT_BG} w={"full"} height={"full"} pos={"relative"}  sx={{ overflowX: "hidden" }}>
        <DashboardHeader onOpen={onOpen} />
        <Box flex={1} h={`calc(100vh-93px)`} w={"full"} sx={{ overflowX: "hidden" }}>
          <Container maxW={"container.xl"} py={10} w={"full"}>{children}</Container>
        </Box>
      </Stack>
    </Flex>
  )
}

export default DashboardLayout