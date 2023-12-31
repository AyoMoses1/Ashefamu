import { Center, HStack, Heading, Icon, IconProps, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { DARK, TEXT_GRAY } from "../../utils/color"

const QRCodes = (props: IconProps) => (
  <Icon  viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.46973 2H20.4697C21.0002 2 21.5089 2.21071 21.8839 2.58579C22.259 2.96086 22.4697 3.46957 22.4697 4V20C22.4697 20.5304 22.259 21.0391 21.8839 21.4142C21.5089 21.7893 21.0002 22 20.4697 22H4.46973C3.93929 22 3.43059 21.7893 3.05551 21.4142C2.68044 21.0391 2.46973 20.5304 2.46973 20V4C2.46973 3.46957 2.68044 2.96086 3.05551 2.58579C3.43059 2.21071 3.93929 2 4.46973 2ZM6.46973 6V18H18.4697V6H6.46973Z" fill="#00BF55" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4697 10H14.4697V14H10.4697V10Z" fill="#00BF55" />
    <path d="M28.4697 2H44.4697C45.0002 2 45.5089 2.21071 45.8839 2.58579C46.259 2.96086 46.4697 3.46957 46.4697 4V20C46.4697 20.5304 46.259 21.0391 45.8839 21.4142C45.5089 21.7893 45.0002 22 44.4697 22H28.4697C27.9393 22 27.4306 21.7893 27.0555 21.4142C26.6804 21.0391 26.4697 20.5304 26.4697 20V4C26.4697 3.46957 26.6804 2.96086 27.0555 2.58579C27.4306 2.21071 27.9393 2 28.4697 2ZM30.4697 6V18H42.4697V6H30.4697Z" fill="#00BF55" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M34.4697 10H38.4697V14H34.4697V10Z" fill="#00BF55" />
    <path d="M4.46973 26H20.4697C21.0002 26 21.5089 26.2107 21.8839 26.5858C22.259 26.9609 22.4697 27.4696 22.4697 28V44C22.4697 44.5304 22.259 45.0391 21.8839 45.4142C21.5089 45.7893 21.0002 46 20.4697 46H4.46973C3.93929 46 3.43059 45.7893 3.05551 45.4142C2.68044 45.0391 2.46973 44.5304 2.46973 44V28C2.46973 27.4696 2.68044 26.9609 3.05551 26.5858C3.43059 26.2107 3.93929 26 4.46973 26ZM6.46973 30V42H18.4697V30H6.46973Z" fill="#00BF55" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4697 34H14.4697V38H10.4697V34Z" fill="#00BF55" />
    <path d="M46.4697 38H38.4697V46H28.4697C27.9393 46 27.4306 45.7893 27.0555 45.4142C26.6804 45.0391 26.4697 44.5304 26.4697 44V28V38H30.4697V42H34.4697V30H30.4697V26H28.4697H34.4697V30H38.4697V34H42.4697V26H44.4697C45.0002 26 45.5089 26.2107 45.8839 26.5858C46.259 26.9609 46.4697 27.4696 46.4697 28V38ZM46.4697 42V44C46.4697 44.5304 46.259 45.0391 45.8839 45.4142C45.5089 45.7893 45.0002 46 44.4697 46H42.4697V42H46.4697Z" fill="#00BF55" />
  </Icon>
)

interface DashboardQRCardProps { }
const DashboardQRCard: React.FC<DashboardQRCardProps> = () => {
  return (
    <Stack borderWidth={"1px"} borderColor={"brand.500"} as={Center} alignItems={"flex-start"} bg={"white"} w={"full"} minH={131} rounded={"4px"} p={6} minW={246}>
      <HStack>
       <QRCodes fontSize={"5xl"} color={"brand.500"} />
       <Stack>
        <Heading fontSize={"lg"} color={DARK}>QR Code is active</Heading>
        <Text color={TEXT_GRAY} fontSize={"sm"}>Scanned 120 times</Text>
       </Stack>
      </HStack>
    </Stack>
  )
}

export default DashboardQRCard