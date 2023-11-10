/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RED, YELLOW } from "../../../utils/color";
import CustomTable from "../../../components/tables/CustomTable";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import usePaginatedTableData from "../../../hooks/usePaginatedTableData";
import { useAppSelector } from "../../../store/hook";
import {
  executeCreateUser,
  executeGetAllUsers,
  executeGetUserProfile,
} from "../../../apis/user";
import { IconButton } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import useFilterComponent from "./useFilterComponent";
import AddUserModal from "../../../components/modals/AddUserModal";
import { useForm } from "react-hook-form";
import CustomButton from "./../../../components/common/CustomButton";
import useGetAllRoles from "../../../hooks/useGetAllRoles";
import ROUTES from "./../../../utils/routeNames";
import { useNavigate } from "react-router-dom";
import { getSlug } from "../../../utils/helpers";

interface UserProps {}
const User: React.FC<UserProps> = () => {
  const { FilterComponent } = useFilterComponent();
  const [userValues, setUserValues] = useState<UserPayload | null>(null);
  const [editId, setEditId] = useState<number>();
  const token = useAppSelector((state) => state.accountStore.tokenStore!.token);
  const { control, trigger, getValues, reset, watch } =
    useForm<ProffessionalStaffData>({
      mode: "onSubmit",
    });

  const extractIdAndName = (arr) => {
    return arr.map((item) => ({ value: item.id, label: item.name }));
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditing,
    onOpen: openEditing,
    onClose: closeEditing,
  } = useDisclosure();

  const { data: rolesData } = useGetAllRoles();
  const {
    data,
    totalRows,
    handlePageChange,
    handlePerRowsChange,
    loadingData,
    handleReloadData,
  } = usePaginatedTableData((page, perPage) =>
    executeGetAllUsers(token, page, perPage)
  );

  const [users, setUsers] = useState<InvoiceDataType[]>(data);
  const {
    isOpen: isLoading,
    onClose: closeLoading,
    onOpen: openLoading,
  } = useDisclosure();
  const toast = useToast({
    position: "bottom",
    isClosable: true,
    variant: "subtle",
  });
  const navigate = useNavigate();

  const handleEdit = async (id: number) => {
    try {
      openEditing();
      const response = await executeGetUserProfile(id, token!);
      if (response.status === "error") throw new Error(response.message);

      const firstname = response.data.user.firstname;
      navigate(ROUTES.EDIT_USER_ROUTE(getSlug(firstname)), {
        state: response?.data?.user,
      });
    } catch (e: any) {
      console.log("Error:", e.meesage);
    } finally {
      closeEditing();
      setEditId(undefined);
    }
  };

  useEffect(() => {
    if (!editId) return;
    handleEdit(editId);
  }, [editId]);

  const columns = [
    {
      name: "Name",
      cell: (data: UserData["user"]) => {
        return (
          <Text>{(data.firstname + " " + data.lastname).toLocaleString()}</Text>
        );
      },
      sortable: true,
    },
    {
      name: "Username",
      cell: (data: UserData["user"]) => {
        return <Text>{data.username.toLocaleString()}</Text>;
      },
      sortable: true,
    },
    {
      name: "Email",
      cell: (data: UserData["user"]) => {
        return <Text>{data.email.toLocaleString()}</Text>;
      },
      sortable: true,
    },
    {
      name: "Role",
      cell: (data: UserData["user"]) => {
        return <Text>{data.userRole.roleDetails.name.toLocaleString()}</Text>;
      },
      sortable: true,
    },
    {
      name: "Actions",
      selector: "",
      sortable: false,
      cell: (item: any) => {
        return (
          <HStack>
            <IconButton
              _hover={{ bg: "#FFEBC9" }}
              rounded={"full"}
              bg={"#FFEBC9"}
              aria-label="edit"
              isLoading={isEditing && item.id === editId}
              onClick={() => setEditId(item.id)}
              icon={<Icon fontSize={"xl"} as={BiEdit} color={YELLOW} />}
            />
            <IconButton
              bg={"#FEE2E2"}
              _hover={{ bg: "#FEE2E2" }}
              rounded={"full"}
              colorScheme="red"
              aria-label="delete"
              icon={<Icon fontSize={"xl"} as={BiTrash} color={RED} />}
            />
          </HStack>
        );
      },
    },
  ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    const handleChange = (item: { label: string; value: string }) => {
      const val = item.value;
      if (!val || val === "*") return setUsers(data);
      const filtered = (data as InvoiceDataType[]).filter(
        (elem) => elem.status.toLowerCase() === val.toLowerCase()
      );
      // setInvoices(filtered);
    };

    return (
      <FilterComponent
        onClear={handleClear}
        filterText={handleChange}
        onOpen={onOpen}
      />
    );
  }, [filterText, resetPaginationToggle]);

  // HANDLE CREATE USER

  const handleCreateUser = async () => {
    if (!(await trigger())) return;
    try {
      openLoading();
      const payload: UserData = {
        ...getValues(),
        role: (getValues("role") as any).value,
      };
      delete (payload as any)["confirm"];

      const response = await executeCreateUser(payload, token!);
      if (response.status === "error") throw new Error(response.message);

      toast({
        status: "success",
        title: response.message,
      });

      reset();
      onClose();
      handleReloadData();
    } catch (error: any) {
      console.log("ERROR: ", error.message);
      toast({
        status: "error",
        title: error.message,
      });
    } finally {
      closeLoading();
    }
  };

  return (
    <DashboardLayout>
      <Box p={4} bg={"white"} rounded={"md"}>
        <CustomTable
          columns={columns as any}
          data={data}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeaderComponent={subHeaderComponentMemo}
          progressPending={loadingData}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />
      </Box>

      <AddUserModal
        control={control}
        values={userValues}
        roles={extractIdAndName(rolesData)}
        watch={watch}
        modalFooterButton={
          <HStack>
            <CustomButton
              isDisabled={isLoading}
              onClick={onClose}
              colorScheme="gray"
            >
              Cancel
            </CustomButton>
            <CustomButton isLoading={isLoading} onClick={handleCreateUser}>
              Update Details
            </CustomButton>
          </HStack>
        }
        onClose={onClose}
        isOpen={isOpen}
      />
    </DashboardLayout>
  );
};

export default User;