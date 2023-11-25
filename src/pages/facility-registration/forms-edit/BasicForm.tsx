/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonGroup,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import FormTitle from "../../../components/common/FormTitle";
import { useForm } from "react-hook-form";
import AuthInput from "../../../components/common/AuthInput";
import {
  LIGHT_BG,
  LIGHT_GREEN,
  RED,
  TEXT_DARK,
  TEXT_DARK_GRAY,
} from "../../../utils/color";
import CheckButton from "../../../components/common/CheckButton";
import { MdOutlinePhoneEnabled } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import CustomButton from "../../../components/common/CustomButton";
import { LGAs, countries, generalBuildingTypes } from "../../../utils/data";
import { BsPlus } from "react-icons/bs";
import { TbBriefcase2 } from "react-icons/tb";
import { BiTrash } from "react-icons/bi";
import FormFooter from "../../../components/layout-components/FormFooter";
import useWaitingText from "../../../hooks/useWaitingText";
import useFetchFacilityData from "../../../hooks/useFetchFacilityData";
import Loader from "../../../components/common/loader/Loader";
import { labelValueMap } from "../../../utils/helpers";
import { executeDocumentFacility } from "../../../apis/facility";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  STEPS,
  updateLevel,
  updateSavedFacility,
} from "../../../store/slice/createFacility";
import { useAppContext } from "../../../contexts/AppContext";
import { UserIcon } from "../../../components/icons";

interface BasicFormProps {
  setActiveStep: (no: any) => void;
  activeStep: number;
}

const BasicForm: React.FC<BasicFormProps> = ({ setActiveStep, activeStep }) => {
  const { currentFacility } = useAppContext();
  const { control, watch, setValue, trigger, getValues } = useForm({
    mode: "onSubmit",
  });

  console.log({ currentFacility });

  const {
    control: propControl,
    trigger: propTrigger,
    getValues: propGetValues,
    reset: propReset,
  } = useForm<Proprietor>({ mode: "onSubmit" });

  const {
    isOpen: isLoading,
    onOpen: openLoading,
    onClose: closeLoading,
  } = useDisclosure();
  const { loadingText, startLoadingText, stopLoadingText } = useWaitingText(
    ["Validating", "Submitting", "Proccessing"],
    2000
  );
  const [proprietors, setProprietors] = useState<Proprietor[]>(
    currentFacility?.proprietor || []
  );
  const hasMultipleFacility = watch("has_multiple_facility");
  const hasUseOfPremesis = watch("any_other_use_of_premises");
  const hasEmergency = watch("emergency_service");
  const hasAmbulance = watch("ambulance_service");
  const toast = useToast({
    position: "bottom",
    isClosable: true,
    variant: "subtle",
  });
  const { isFetching, facilityCategory, sectorCategory, serviceScope } =
    useFetchFacilityData();
  const token = useAppSelector((state) => state.accountStore.tokenStore?.token);
  const dispatch = useAppDispatch();

  const handleAddProprietors = async () => {
    if (!(await propTrigger())) return;
    const data: Proprietor = {
      ...propGetValues(),
      nationality: (propGetValues("nationality") as any).value,
    };

    setProprietors((prev) => [data, ...prev]);
    propReset();
  };

  const handleDeleteProprietor = async (index: number) => {
    setProprietors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveFacilityInfo = async (): Promise<boolean> => {
    if (!(await trigger()) || (!proprietors.length && (await propTrigger())))
      return false;
    let result = false;
    try {
      startLoadingText();
      openLoading();

      const facilityId = currentFacility!.id;
      const data = {
        id: +facilityId!,
        address: getValues("address"),
        name: getValues("facility_name"),
        facility_phone: getValues("facility_phone"),
        building_type: getValues("building_type").value,
        gps_cordinates: JSON.stringify({
          latitude: getValues("latitude"),
          longitude: getValues("longitude"),
        }),
        cac_number: getValues("cac_number"),
        facility_sector: getValues("facility_sector").value,
        multiple_branch: getValues("has_multiple_facility") === "yes",
        closest_landmark: getValues("closet_landmark"),
        local_gov_area: getValues("local_gov_area").value,
        local_council_dev_area: getValues("local_council_dev_area"),
        category: getValues("facility_category").value,
        any_other_use_of_premises: getValues("any_other_use_of_premises"),
        proprietor: proprietors,
        operationDetails: {
          opening_time: getValues("opening_time"),
          closing_time: getValues("closing_time"),
          date_of_establishment: getValues("date_of_establishment"),
          provides_ambulance_services: getValues("ambulance_service") === "yes",
          provides_emergency_services: getValues("emergency_service") === "yes",
        },
        scopeOfService: getValues("service_scope").map((item: any) => ({
          service_scope: item.label,
        })),
      };
      const resultData = await executeDocumentFacility(data, token!);
      if (resultData.status === "error") throw new Error(resultData.message);

      dispatch(updateSavedFacility(resultData.data));

      // SHOW MESSAGE
      toast({
        title: resultData.message,
        status: "success",
      });

      // SAVE PROGRESS
      dispatch(
        updateLevel({
          step: STEPS.SERVICES,
          data: {
            ["FILL_FORM"]: {
              default: getValues(),
              proprietors,
            },
          },
        })
      );
      // MOVE TO NEXT
      result = true;
    } catch (e: any) {
      toast({
        status: "error",
        title: e.message,
      });
    } finally {
      closeLoading();
      stopLoadingText();
    }

    return result;
  };

  return (
    <Stack spacing={14}>
      {/* FACILITY DETAILS */}
      <Stack spacing={6}>
        <FormTitle>FACILITY DETAILS</FormTitle>
        <Grid templateColumns="repeat(5, 1fr)" gap={5}>
          <GridItem colSpan={[5, 5, 3]}>
            <AuthInput
              bg={LIGHT_BG}
              placeholder="Engineering"
              control={control}
              fontSize={"sm"}
              label="Facility name"
              name="facility_name"
              value={currentFacility?.name}
              rules={{
                required: "Facility name is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 1]}>
            <AuthInput
              bg={LIGHT_BG}
              placeholder="Public"
              control={control}
              fontSize={"sm"}
              label="Facility sector category"
              name="facility_sector"
              value={
                labelValueMap(sectorCategory).find(
                  (item) => item.value === currentFacility!.facility_sector!
                ) as any
              }
              isSelect
              data={labelValueMap(sectorCategory)}
              rules={{
                required: "Facility sector is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 1]}>
            <AuthInput
              bg={LIGHT_BG}
              placeholder="Clinic"
              control={control}
              fontSize={"sm"}
              label="Facility category"
              name="facility_category"
              value={
                labelValueMap(facilityCategory).find(
                  (item) => item.value === currentFacility!.facility_sector!
                ) as any
              }
              isSelect
              data={labelValueMap(facilityCategory)}
              rules={{
                required: "Facility category is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 1]}>
            <AuthInput
              bg={LIGHT_BG}
              control={control}
              fontSize={"sm"}
              label="CAC Number"
              name="cac_number"
              value={currentFacility?.cac_number}
              rules={{
                required: "CAC Number is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 3]}>
            <FormControl>
              <FormLabel
                color={TEXT_DARK}
                fontSize={"14px"}
                mb={1}
                fontWeight={"500"}
              >
                Does the facility have multiple branches?
              </FormLabel>
              <ButtonGroup>
                <CheckButton
                  value={currentFacility?.multiple_branch ? "Yes" : "No"}
                  handleClick={() => setValue("has_multiple_facility", "yes")}
                  isActive={hasMultipleFacility === "yes"}
                >
                  Yes
                </CheckButton>

                <CheckButton
                  value={currentFacility?.multiple_branch ? "Yes" : "No"}
                  handleClick={() => setValue("has_multiple_facility", "no")}
                  isActive={hasMultipleFacility === "no"}
                >
                  No
                </CheckButton>
              </ButtonGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </Stack>

      {/* CONTACT DETAILS */}
      <Stack spacing={6}>
        <FormTitle>CONTACT DETAILS</FormTitle>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={[5, 5, 2]}>
            <AuthInput
              Icon={MdOutlinePhoneEnabled}
              control={control}
              fontSize={"sm"}
              label="Facility phone"
              name="facility_phone"
              value={currentFacility?.facility_phone}
              rules={{
                required: "Facility phone is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 3]}>
            <AuthInput
              Icon={HiOutlineLocationMarker}
              control={control}
              fontSize={"sm"}
              label="Address"
              name="address"
              value={currentFacility?.address}
              rules={{
                required: "Address is required",
              }}
            />
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 4]}>
            <AuthInput
              isSelect
              data={LGAs.map((item) => ({ label: item, value: item }))}
              Icon={MdOutlinePhoneEnabled}
              control={control}
              fontSize={"sm"}
              label="Local Government Area"
              name="local_gov_area"
              value={currentFacility?.local_gov_area}
              rules={{
                required: "Local Government Area is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 3]}>
            <AuthInput
              control={control}
              fontSize={"sm"}
              label="Closest landmark"
              name="closet_landmark"
              value={currentFacility?.closest_landmark}
              rules={{
                required: "Closest landmark is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <AuthInput
              control={control}
              isSelect
              data={generalBuildingTypes.map((item) => ({
                label: item,
                value: item,
              }))}
              fontSize={"sm"}
              label="Building type"
              name="building_type"
              value={currentFacility?.building_type}
              rules={{
                required: "Building type is required",
              }}
            />
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 3]}>
            <AuthInput
              // isSelect
              control={control}
              fontSize={"sm"}
              label="Local council development area"
              name="local_council_dev_area"
              value={currentFacility?.local_council_dev_area}
              rules={{
                required: "Local council development area is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <FormLabel
              color={TEXT_DARK}
              fontSize={"14px"}
              mb={0}
              fontWeight={"500"}
              fontFamily={"body"}
            >
              GPS Coordinates
            </FormLabel>
            <HStack>
              <AuthInput
                control={control}
                fontSize={"sm"}
                label=""
                placeholder="X: Latitude"
                name="latitude"
                value={JSON.parse(currentFacility!.gps_cordinates)?.latitude}
                rules={{
                  required: "Latitude is required",
                }}
              />
              <AuthInput
                control={control}
                fontSize={"sm"}
                label=""
                placeholder="Y: Longitude"
                name="longitude"
                value={JSON.parse(currentFacility!.gps_cordinates)?.longitude}
                rules={{
                  required: "Longitude is required",
                }}
              />
            </HStack>
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <FormControl>
              <FormLabel
                color={TEXT_DARK}
                fontSize={"14px"}
                mb={1}
                fontWeight={"500"}
              >
                Any other use of the premises?
              </FormLabel>
              <ButtonGroup>
                <CheckButton
                  value={
                    currentFacility?.any_other_use_of_premises ? "Yes" : "No"
                  }
                  handleClick={() =>
                    setValue("any_other_use_of_premises", "yes")
                  }
                  isActive={hasUseOfPremesis === "yes"}
                >
                  Yes
                </CheckButton>

                <CheckButton
                  value={
                    currentFacility?.any_other_use_of_premises ? "Yes" : "No"
                  }
                  handleClick={() =>
                    setValue("any_other_use_of_premises", "no")
                  }
                  isActive={hasUseOfPremesis === "no"}
                >
                  No
                </CheckButton>
              </ButtonGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </Stack>

      {/* PROPRIETOR */}
      <Stack spacing={6}>
        <FormTitle>PROPRIETORS</FormTitle>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 6]}>
            <AuthInput
              control={propControl}
              isIconComponent
              Icon={<UserIcon w={"26px"} h={"26px"} fill={"#A3AEBD"} />}
              fontSize={"sm"}
              iconProp={{ fontSize: "xl" }}
              label="Full Name"
              name="name"
              rules={{
                required: "Full name is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 6]}>
            <AuthInput
              control={propControl}
              Icon={HiOutlineLocationMarker}
              fontSize={"sm"}
              label="Address"
              name="address"
              rules={{
                required: "Address is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <AuthInput
              control={propControl}
              Icon={TbBriefcase2}
              fontSize={"sm"}
              label="Occupation"
              name="occupation"
              rules={{
                required: "Occupation is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <AuthInput
              control={propControl}
              fontSize={"sm"}
              isSelect
              data={countries.map((item) => ({ label: item, value: item }))}
              label="Nationality"
              name="nationality"
              rules={{
                required: "Nationality is required",
              }}
            />
          </GridItem>

          <GridItem
            colSpan={[12, 12, 4]}
            as={HStack}
            alignItems={"flex-end"}
            h={"full"}
          >
            <CustomButton
              leftIcon={<Icon fontSize={"2xl"} color={"white"} as={BsPlus} />}
              onClick={handleAddProprietors}
            >
              Add Proprietor
            </CustomButton>
          </GridItem>
        </Grid>

        <Box overflowX={"auto"}>
          <Table>
            <Thead bg={LIGHT_GREEN}>
              <Tr>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Occupation</Th>
                <Th>Nationality</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody bg={"#F7FAF7"}>
              {proprietors.length ? (
                proprietors.map((prop, index) => (
                  <Tr key={`prop-${index}`}>
                    <Td
                      fontSize={"sm"}
                      whiteSpace={"nowrap"}
                      color={TEXT_DARK_GRAY}
                      p={4}
                    >
                      {prop.name}
                    </Td>
                    <Td
                      fontSize={"sm"}
                      whiteSpace={"nowrap"}
                      color={TEXT_DARK_GRAY}
                      p={4}
                    >
                      {prop.address}
                    </Td>
                    <Td
                      fontSize={"sm"}
                      whiteSpace={"nowrap"}
                      color={TEXT_DARK_GRAY}
                      p={4}
                    >
                      {prop.occupation}
                    </Td>
                    <Td
                      fontSize={"sm"}
                      whiteSpace={"nowrap"}
                      color={TEXT_DARK_GRAY}
                      p={4}
                    >
                      {prop.nationality}
                    </Td>
                    <Td
                      fontSize={"sm"}
                      whiteSpace={"nowrap"}
                      color={TEXT_DARK_GRAY}
                      p={4}
                    >
                      <IconButton
                        onClick={() => handleDeleteProprietor(index)}
                        aria-label="delete-proprietor"
                        variant={"ghost"}
                        _hover={{ bg: "#FEE2E2" }}
                        bg={"#FEE2E2"}
                        rounded={"full"}
                        size={"sm"}
                        icon={<Icon color={RED} fontSize={"xl"} as={BiTrash} />}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td
                    fontSize={"sm"}
                    color={TEXT_DARK_GRAY}
                    colSpan={5}
                    p={4}
                    textAlign={"center"}
                  >
                    No proprietor added
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      {/* OPERATIONS DETAILS */}
      <Stack spacing={6}>
        <FormTitle>OPERATIONS DETAILS</FormTitle>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 3]}>
            <AuthInput
              control={control}
              fontSize={"sm"}
              // isSelect
              // data={timeData}
              type="time"
              iconProp={{ fontSize: "xl" }}
              label="Opening time"
              name="opening_time"
              value={currentFacility?.operationDetails.opening_time}
              rules={{
                required: "Opening time is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 3]}>
            <AuthInput
              control={control}
              fontSize={"sm"}
              // isSelect
              // data={timeData}
              type="time"
              label="Closing time"
              name="closing_time"
              value={currentFacility?.operationDetails.closing_time}
              rules={{
                required: "Closing time is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 6]}>
            <AuthInput
              control={control}
              fontSize={"sm"}
              type="date"
              label="Date of establishment"
              name="date_of_establishment"
              value={currentFacility?.operationDetails.date_of_establishment}
              rules={{
                required: "Date of establishment is required",
              }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <FormControl>
              <FormLabel
                color={TEXT_DARK}
                fontSize={"14px"}
                mb={1}
                fontWeight={"500"}
              >
                Does facility provide ambulance services?
              </FormLabel>
              <ButtonGroup>
                <CheckButton
                  handleClick={() => setValue("ambulance_service", "yes")}
                  isActive={hasAmbulance === "yes"}
                >
                  Yes
                </CheckButton>

                <CheckButton
                  handleClick={() => setValue("ambulance_service", "no")}
                  isActive={hasAmbulance === "no"}
                >
                  No
                </CheckButton>
              </ButtonGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 12, 4]}>
            <FormControl>
              <FormLabel
                color={TEXT_DARK}
                fontSize={"14px"}
                mb={1}
                fontWeight={"500"}
              >
                Does facility provide emergency services?
              </FormLabel>
              <ButtonGroup>
                <CheckButton
                  handleClick={() => setValue("emergency_service", "yes")}
                  isActive={hasEmergency === "yes"}
                >
                  Yes
                </CheckButton>

                <CheckButton
                  handleClick={() => setValue("emergency_service", "no")}
                  isActive={hasEmergency === "no"}
                >
                  No
                </CheckButton>
              </ButtonGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12]}>
            <AuthInput
              control={control}
              fontSize={"sm"}
              isSelect
              selectProps={{ isMulti: true, isCreatable: true }}
              data={labelValueMap(serviceScope)}
              label="Scope of the services in the facility"
              name="service_scope"
              value={
                currentFacility?.scopeOfService.map((item) => ({
                  label: item.service_scope,
                  value: item.service_scope,
                })) as any
              }
              rules={{}}
            />
          </GridItem>
        </Grid>
      </Stack>

      <FormFooter
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleAction={handleSaveFacilityInfo}
        nextButtonProps={{
          isLoading,
          loadingText,
        }}
        prevButtonProps={{ isDisabled: isLoading }}
      />

      {isFetching && <Loader />}
    </Stack>
  );
};

export default BasicForm;
