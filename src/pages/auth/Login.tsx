/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { HStack, Heading, Link, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { Link as ReactLink, useNavigate } from "react-router-dom"
import AuthInput from "../../components/common/AuthInput"
import { useForm } from "react-hook-form"
import { MdOutlineLock } from "react-icons/md"
import CustomButton from "../../components/common/CustomButton"
import { TEXT_DARK } from "../../utils/color"
import ROUTES from "../../utils/routeNames"
import useWaitingText from "../../hooks/useWaitingText"
import { executeLogin } from "../../apis/auth"
import { useAppDispatch } from "../../store/hook"
import { populateToken } from "../../store/slice/accountSlice"
import { useAppContext } from "../../contexts/AppContext"
import { UserIcon } from "../../components/icons"

interface LoginProps { }
const Login: React.FC<LoginProps> = () => {
  const { control, trigger, getValues } = useForm<LoginData>({
    mode: "onSubmit"
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { getUsersProfile, checkIncompleteReg } = useAppContext()
  const { isOpen: isLoading, onOpen: openLoading, onClose: closeLoading } = useDisclosure()
  const { loadingText, startLoadingText, stopLoadingText } = useWaitingText(["Submitting", "Searching user", "Matching credentials"])
  const toast = useToast({
    position: "bottom",
    isClosable: true,
    variant: "subtle",
  })

  const handleLogin = async () => {
    try {
      if(! await trigger()) return
      // MAKE REQUEST
      openLoading()
      startLoadingText()
      const payload: LoginData = {
        password: getValues("password").trim(),
        username: getValues("username").trim(),
      }
      delete (payload as any)['confirm']

      const result = await executeLogin(payload)
      if(result.status === "error") throw new Error(result.message)

      // GET TOKEN
      const tokenData = result.data.token
      dispatch(populateToken(tokenData))

      // GET PROFILE
      await getUsersProfile(tokenData.token!)

      // SHOW SUCCESS TOAST
      toast({
        status: "success",
        title: result.message
      })

      navigate(ROUTES.SUCCESS_ROUTE("login"))
    }
    catch(error: any) {
      console.log("ERROR:", error.message)
      toast({
        status: "error",
        title: error.message
      })
    }
    finally {
      closeLoading()
      stopLoadingText()
    }
  }

  useEffect(() => {
    checkIncompleteReg()
  }, [])

  return (
    <AuthLayout>
      <Heading fontSize={"1.8rem"} color={"gray.700"} fontWeight={"semibold"} fontFamily={"rubik"}>Sign in</Heading>
      <Stack mt={8} spacing={4} mb={16}>
        {/* FIRSTNAME */}

        {/* EMAIL */}
        <AuthInput
          control={control}
          name="username"
          type="text"
          isIconComponent
          Icon={<UserIcon w={"26px"} h={"26px"} fill={"#A3AEBD"} />}
          label="Username / Email"
          rules={{
            required: "Username or email is required"
          }}
        />

        {/* PASSWORD */}
        <AuthInput
          control={control}
          name="password"
          type="password"
          Icon={MdOutlineLock}
          isPassword
          label="Password"
          rules={{
            required: "Password is required"
          }}
        />

        <CustomButton colorScheme="brand" isLoading={isLoading} loadingText={loadingText} onClick={handleLogin}>Sign in</CustomButton>
        <HStack alignItems={"center"} justifyContent={"space-between"} spacing={1} flexDir={['column', 'column', 'row']}>
          <HStack alignItems={"center"} spacing={1}>
            <Text fontSize={"sm"} color={TEXT_DARK}>Don't have an account?</Text>
            <Link fontSize={"sm"} as={ReactLink} to={ROUTES.REGISTER_ROUTE} fontWeight={"semibold"} color={"brand.500"}>Create one</Link>
          </HStack>

          <Link fontSize={"sm"} as={ReactLink} to={ROUTES.FORGOT_PASSWORD_ROUTE} fontWeight={"semibold"} color={"brand.500"}>Forgot Password?</Link>
        </HStack>
      </Stack>
    </AuthLayout>
  )
}

export default Login