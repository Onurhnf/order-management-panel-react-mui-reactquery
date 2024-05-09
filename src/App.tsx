import Card from "@mui/material/Card";
import { red, blueGrey } from "@mui/material/colors";
import { CardContent, Stack, Typography } from "@mui/material";

const color = red[500];
const color2 = blueGrey[100];
function App() {
  return (
    <>
      <Card sx={{ width: 400, border: `1px solid ${color2}` }}>
        <CardContent>
          <Stack justifyContent="space-between" direction="row">
            <Stack direction="row">
              <Typography>Status:</Typography>
              <Typography color={color}>asd</Typography>
            </Stack>
            <Typography fontWeight="bold">Order No: 1111</Typography>
          </Stack>
        </CardContent>
        <CardContent>
          <Stack textAlign="start">
            <Typography>adress</Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
