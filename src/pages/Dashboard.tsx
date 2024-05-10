import { Grid } from "@mui/material";
import Column from "../components/Column";

function Dashboard() {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Column isReady={true} />
      </Grid>
      <Grid item>
        <Column isReady={false} />
      </Grid>
      <Grid item>
        <Column isComplated={true} isReady={false} />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
