/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react"
import { Box, Center, HStack, Icon, IconButton, SimpleGrid, Skeleton, Stack, Text, WrapItem } from "@chakra-ui/react"
import { TEXT_DARK_GRAY, TEXT_GRAY } from "../../utils/color"
import DashboardCard from "../../components/common/DashboardCard"
// import DashboardQRCard from "../../components/common/DashboardQRCard"
import DashboardLayout from "../../components/layouts/DashboardLayout"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import NotificationCard from "../../components/common/NotificationCard"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import usePaginatedTableData from "../../hooks/usePaginatedTableData"
import { useAppSelector } from "../../store/hook"
import DataLoader from "../../components/common/loader/DataLoader"
import EmptyTable from "../../components/states/EmptyTable"
import { executeGetFacilityDashboardCards, executeGetFacilityNotification } from "../../apis/facility"
import { useAppContext } from "../../contexts/AppContext"
import { formatDate } from "../../utils/helpers"
import { useNavigate } from "react-router-dom"
import ROUTES from "../../utils/routeNames"
import Loader from "../../components/common/loader/Loader"
// import { useAppContext } from "../../contexts/AppContext"

interface FacilityDashboardProps { }
const FacilityDashboard: React.FC<FacilityDashboardProps> = () => {
  const swiper = useRef(null)
  const token = useAppSelector(state => state.accountStore.tokenStore!.token)
  const { currentFacility, isLoadingData } = useAppContext()
  const { data, loadingData } = usePaginatedTableData((page, perPage) => executeGetFacilityNotification(currentFacility!.id, token!, page, perPage), 9)
  const navigate = useNavigate()
  const [cardsToShow, setCardsToShow] = useState<DashboardCardType[]>([])

  const handleGetCards = async () => {
    if(!currentFacility || !token) return
    const response = await executeGetFacilityDashboardCards(currentFacility.id, token)
    if(response.status === "error") return 
    setCardsToShow(response.data as DashboardCardType[])
  }

  useEffect(() => {
    if(isLoadingData) return
    if (currentFacility) return
    navigate(ROUTES.FACILITY_ROUTE, { replace: true })
  }, [isLoadingData])

  useEffect(() => {
    handleGetCards()
  }, [isLoadingData])
  return (
    <DashboardLayout>
      <Stack spacing={10} pb={10} w={"full"}>
        <Stack spacing={4}>
          <HStack justifyContent={"space-between"}>
            <Text alignSelf={"flex-end"} noOfLines={1} fontSize={"0.875rem"} fontWeight={500} color={TEXT_DARK_GRAY}>Registered on  {currentFacility && formatDate((currentFacility?.created_at))}</Text>
          </HStack>

          {/* CARDS SECTION */}
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={3}>
            { isLoadingData ? (new Array(4).fill("-")).map((_, index) => (
              <Skeleton maxW={500} w={"full"} rounded={"md"} h={131} key={`loading-card-${index}`} />
            )) : cardsToShow.map((cardItem, index) => (
              <WrapItem key={`dash-card-${cardItem.name}-${index}`} flex={1}>
                <DashboardCard {...cardItem} />
              </WrapItem>
            ))}
          </SimpleGrid>
        </Stack>

        {/* NOTIFICATIONS */}
        <Box p={4} bg={"white"} rounded={"md"}>
          {loadingData ? <Center py={8}>
            <DataLoader />
          </Center> : data.length ?
            (
              <HStack pr={2} alignItems={"stretch"}>
                <Swiper
                  ref={swiper}
                  slidesPerView={1}
                  spaceBetween={20}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    992: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {data.map((type: NotificationDataType) => (
                    <SwiperSlide key={type.id} style={{ width: "fit-content" }}>
                      <NotificationCard {...type} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Center>
                  <Stack spacing={6}>
                    <IconButton
                      size={"xs"}
                      onClick={() => (swiper as any).current.swiper.slideNext()}
                      aria-label="next"
                      variant={"ghost"}
                      icon={<Icon fontSize={"2xl"} color={TEXT_GRAY} as={IoIosArrowForward} />}
                    />

                    <IconButton
                      size={"xs"}
                      onClick={() => (swiper as any).current.swiper.slidePrev()}
                      aria-label="prev"
                      variant={"ghost"}
                      icon={<Icon fontSize={"2xl"} color={TEXT_GRAY} as={IoIosArrowBack} />}
                    />
                  </Stack>
                </Center>
              </HStack>
            ) :
            (<EmptyTable text="No notifications found" />)
          }
        </Box>
      </Stack>

      { isLoadingData && <Loader /> }
    </DashboardLayout>
  )
}

export default FacilityDashboard