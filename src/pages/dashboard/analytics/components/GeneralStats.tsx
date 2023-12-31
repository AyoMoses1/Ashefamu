import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import { useAppSelector } from "../../../../store/hook";

const GeneralStats = () => {
  const data = useAppSelector((state) => state.statsStore.statsMetrics);

  return (
    <Grid templateColumns="repeat(12, 1fr)" rowGap={4}>
      <GridItem colSpan={12}>
        <Box bgColor="white" p={4} minHeight="150px">
          <Text fontFamily="inter" fontSize={20} fontWeight={500}>
            No of Registered Facilities
          </Text>
          <Text
            fontSize={32}
            fontFamily="rubik"
            fontWeight={500}
            color="#008940"
          >
             {data?.registeredFacilities}
          </Text>
        </Box>
      </GridItem>
      <GridItem colSpan={12}>
        <Box bgColor="white" p={4} minHeight="150px">
          <Text fontFamily="inter" fontSize={20} fontWeight={500}>
            Total active users
          </Text>
          <Text
            fontSize={32}
            fontFamily="rubik"
            fontWeight={500}
            color="#008940"
          >
            {data?.registeredFacilities}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default GeneralStats;
