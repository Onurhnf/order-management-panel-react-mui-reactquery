import { Grid } from "@mui/material";
import Column from "../components/Column";
import { BasketStatus } from "../utils/constants";

function Dashboard() {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Column status={BasketStatus.READY} />
      </Grid>
      <Grid item>
        <Column status={BasketStatus.ON_THE_WAY} />
      </Grid>
      <Grid item>
        <Column status={BasketStatus.COMPLETED} />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
