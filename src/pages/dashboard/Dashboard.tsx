/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { Box, Center, HStack, Icon, IconButton, IconProps, SimpleGrid, Stack, Text, WrapItem, useDisclosure } from "@chakra-ui/react"
import { DARK, GRAY_BORDER, TEXT_GRAY } from "../../utils/color"
import CustomButton from "../../components/common/CustomButton"
import DashboardCard from "../../components/common/DashboardCard"
// import DashboardQRCard from "../../components/common/DashboardQRCard"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import NotificationCard from "../../components/common/NotificationCard"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import usePaginatedTableData from "../../hooks/usePaginatedTableData"
import { useAppSelector } from "../../store/hook"
import { executeGetUserNotification } from "../../apis/user"
import DataLoader from "../../components/common/loader/DataLoader"
import EmptyTable from "../../components/states/EmptyTable"
import CustomizeModal from "../../components/modals/CustomizeModal"

interface CustomizeIconProps extends IconProps { }
const CustomizeIcon = (props: CustomizeIconProps) => (
  <Icon xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none" {...props}>
    <path d="M17.4083 17.8878C17.549 17.8354 17.6745 17.7489 17.7735 17.636C17.9884 17.4083 18.1903 17.1687 18.378 16.9181L17.4083 17.8878ZM17.7357 4.14837C17.5947 4.00464 17.4156 3.90416 17.2194 3.85872C17.0191 3.82019 16.8117 3.84666 16.6275 3.93428L15.2422 4.53876C15.0776 4.61642 14.8967 4.65327 14.7148 4.64621C14.5329 4.63915 14.3554 4.58838 14.1972 4.4982C14.0391 4.40802 13.905 4.28108 13.8063 4.12812C13.7077 3.97516 13.6473 3.80068 13.6303 3.61944L13.5043 2.10822C13.4786 1.90595 13.3906 1.7167 13.2525 1.56671C13.1195 1.41044 12.9375 1.30389 12.7361 1.26446C12.0137 1.09438 11.2745 1.00567 10.5323 1C9.78219 1.01196 9.0353 1.10058 8.30324 1.26446C8.10535 1.31275 7.92589 1.4178 7.7869 1.56671C7.65723 1.72076 7.57422 1.90862 7.54763 2.10822L7.33354 3.61944C7.31404 3.79672 7.24896 3.96593 7.14464 4.11059C7.05625 4.26164 6.93048 4.3874 6.77943 4.4758C6.62021 4.56277 6.44408 4.61432 6.26309 4.62692C6.08703 4.62944 5.91201 4.59956 5.74676 4.53876L4.36148 3.93428C4.18173 3.84677 3.97836 3.82025 3.78218 3.85872C3.58495 3.90138 3.40507 4.00228 3.26585 4.14837C2.24478 5.25061 1.48317 6.56729 1.03681 8.00197C0.99297 8.18407 0.99297 8.37398 1.03681 8.55608C1.10546 8.74989 1.2332 8.91727 1.40202 9.03463L2.66136 9.94136C2.80187 10.0502 2.91775 10.1875 3.00139 10.3443C3.07962 10.5055 3.12255 10.6816 3.12732 10.8607C3.12444 11.036 3.08135 11.2084 3.00139 11.3644C2.92388 11.5253 2.8069 11.6639 2.66136 11.7674L1.40202 12.6741C1.22988 12.8044 1.10231 12.9848 1.03681 13.1905C0.987731 13.389 0.987731 13.5965 1.03681 13.795C1.48998 15.2294 2.25556 16.5455 3.27844 17.6486C3.41391 17.7994 3.59543 17.9012 3.79478 17.9382C3.98382 17.9942 4.18503 17.9942 4.37407 17.9382L5.75936 17.3211C5.91992 17.2443 6.09873 17.2138 6.27569 17.233C6.46932 17.2299 6.66037 17.2777 6.8298 17.3715C6.98033 17.455 7.10627 17.5766 7.19501 17.7241C7.29442 17.8714 7.35902 18.0393 7.38391 18.2153L7.54763 19.7265C7.56258 19.9292 7.64711 20.1205 7.7869 20.268C7.91936 20.4212 8.0949 20.5309 8.29064 20.5828C8.49214 20.5828 8.70623 20.671 8.93291 20.6962C8.90145 20.3835 8.92705 20.0678 9.00847 19.7643L9.19737 19.0464L9.08403 18.0515C9.04041 17.6025 8.88922 17.1705 8.64326 16.7922C8.40007 16.4232 8.07733 16.1134 7.69875 15.8855C7.31523 15.6624 6.88277 15.537 6.4394 15.5203C6.00777 15.4979 5.5768 15.5755 5.18006 15.7469L4.21036 16.1122C3.62337 15.403 3.16325 14.5978 2.85027 13.732L3.65625 13.1275C4.01169 12.8667 4.30074 12.5259 4.50001 12.1326C4.69452 11.741 4.79785 11.3105 4.80225 10.8733C4.79614 10.4363 4.6929 10.0061 4.50001 9.61393C4.29733 9.22295 4.00889 8.88284 3.65625 8.61905L2.85027 8.01456C3.16763 7.15851 3.62748 6.36229 4.21036 5.65958L5.12968 6.03739C5.52566 6.21058 5.95806 6.28409 6.38903 6.25147C6.83281 6.23738 7.26591 6.11179 7.64838 5.88626C8.02241 5.67382 8.34493 5.38141 8.59289 5.02991C8.83709 4.65077 8.98812 4.21923 9.03366 3.77056L9.147 2.76308C9.60115 2.68982 10.0598 2.64774 10.5197 2.63715C10.9754 2.64788 11.4298 2.68996 11.8798 2.76308L11.9805 3.77056C12.0668 4.45632 12.3924 5.08962 12.8998 5.55883C13.3065 5.9168 13.8065 6.15184 14.3416 6.23657C14.8768 6.32129 15.4249 6.25222 15.9223 6.03739L16.829 5.6218C17.301 6.18086 17.6911 6.80417 17.9876 7.47304L19.247 6.21369C18.8376 5.46095 18.3293 4.76635 17.7357 4.14837Z" fill="#62C28D" stroke="#62C28D" stroke-width="0.279141" />
    <path d="M13.24 8.17845C12.8867 7.81464 12.4638 7.52569 11.9965 7.3288C11.5292 7.13191 11.027 7.03112 10.5198 7.03244C10.0164 7.0272 9.51656 7.11692 9.04641 7.29691C8.56966 7.48208 8.13965 7.77019 7.78706 8.14067C7.42176 8.49505 7.13812 8.92481 6.95589 9.40001C6.7547 9.86509 6.6518 10.3667 6.65365 10.8735C6.66028 11.3765 6.76732 11.8732 6.96849 12.3343C7.15848 12.8019 7.44025 13.2267 7.79714 13.5836C8.15403 13.9405 8.57881 14.2222 9.04641 14.4122C9.51233 14.6107 10.0134 14.7135 10.5198 14.7145H10.7591L14.3734 11.0749C14.3797 10.9995 14.3797 10.9237 14.3734 10.8483C14.3697 10.3505 14.2677 9.85843 14.0731 9.40026C13.8786 8.94208 13.5955 8.52686 13.24 8.17845ZM12.0688 12.435C11.6553 12.8359 11.102 13.06 10.5261 13.06C9.95024 13.06 9.39695 12.8359 8.98344 12.435C8.77976 12.2344 8.61806 11.9952 8.50779 11.7314C8.39752 11.4676 8.34088 11.1845 8.34117 10.8986C8.347 10.6101 8.40238 10.3247 8.50489 10.0549C8.61811 9.79151 8.78053 9.55215 8.98344 9.34964C9.18317 9.1465 9.42347 8.98773 9.68867 8.88368C9.95155 8.77262 10.2345 8.71689 10.5198 8.71997C11.0991 8.71687 11.656 8.94326 12.0688 9.34964C12.272 9.54937 12.4307 9.78967 12.5348 10.0549C12.6968 10.454 12.739 10.8916 12.6563 11.3143C12.5735 11.7371 12.3694 12.1265 12.0688 12.435Z" fill="#62C28D" stroke="#62C28D" stroke-width="0.279141" />
    <path d="M16.6321 18.2064C16.7568 18.16 16.8681 18.0832 16.9559 17.9831C17.1464 17.7813 17.3254 17.5688 17.4918 17.3467L16.6321 18.2064Z" fill="#62C28D" />
    <path d="M24.0013 10.8149L21.5784 8.35844C21.4389 8.21967 21.2734 8.10978 21.0914 8.03506C20.9093 7.96034 20.7144 7.92225 20.5176 7.92298C20.3126 7.91519 20.108 7.94874 19.9162 8.02164C19.7244 8.09453 19.5492 8.20527 19.4011 8.34727L11.5405 16.2637C11.3559 16.455 11.2216 16.689 11.1497 16.9448L10.5355 19.2896L10.3234 20.1158C10.2733 20.3326 10.2733 20.5579 10.3234 20.7746C10.3826 21.0551 10.5178 21.3139 10.7142 21.5227C10.8569 21.6749 11.0301 21.7954 11.2225 21.8762C11.4149 21.957 11.6221 21.9963 11.8308 21.9917C11.9272 22.0032 12.0246 22.0032 12.1211 21.9917L15.3033 21.3552C15.5929 21.2902 15.8593 21.1474 16.0737 20.9421L24.0571 12.9475C24.1964 12.8054 24.3057 12.6367 24.3785 12.4515C24.4513 12.2663 24.4861 12.0683 24.4809 11.8694C24.4757 11.6704 24.4305 11.4746 24.3482 11.2934C24.2658 11.1123 24.1478 10.9495 24.0013 10.8149ZM12.9585 20.2498L11.7638 20.4955L12.1657 18.8653L13.126 19.8367L13.4051 20.1158L12.9585 20.2498ZM17.4247 17.3468C17.2583 17.5689 17.0793 17.7814 16.8888 17.9832C16.801 18.0833 16.6897 18.16 16.565 18.2065L15.0688 19.7027L13.4163 18.0614L12.6235 17.2686L13.7401 16.152L16.1965 13.7068L17.2573 12.646L18.6418 11.2615L21.0982 13.6844L17.4247 17.3468ZM22.2148 12.6237L19.7472 10.1784L20.5176 9.41917L22.9406 11.8644L22.2148 12.6237Z" fill="#62C28D" stroke="#62C28D" stroke-width="0.279141" />
  </Icon>
)

interface DashboardProps { }
const Dashboard: React.FC<DashboardProps> = () => {
  const swiper = useRef(null)
  const token = useAppSelector(state => state.accountStore.tokenStore!.token)
  const { data, loadingData } = usePaginatedTableData((page, perPage) => executeGetUserNotification(token!, page, perPage), 9)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const dashboardCards = useAppSelector(state => state.dataStore.dashboardCards)
  const cardsToShow = dashboardCards.filter(card => card.visibility)
  
  return (
    <DashboardLayout>
      <Stack spacing={10} pb={10} w={"full"}>
        <Stack spacing={4}>
          <HStack justifyContent={"flex-end"}>
            <CustomButton onClick={onOpen} fontSize={"0.875rem"} p={4} borderColor={GRAY_BORDER} _hover={{ borderColor: "brand.500", color: "brand.500" }} color={DARK} bg={"white"} variant={"outline"} leftIcon={<CustomizeIcon fontSize={"1.5rem"} />}>
              <Text display={["none", "none", "block"]}>Customize</Text>
            </CustomButton>
          </HStack>

          {/* CARDS SECTION */}
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={3}>
            {cardsToShow.map((cardItem, index) => (
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

      <CustomizeModal isOpen={isOpen} onClose={onClose} />
    </DashboardLayout>
  )
}

export default Dashboard