import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, colors } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <Box
            sx={{
              justifyContent: "center",
              alignContent: "center",
              minHeight: "100vh",
            }}
          >
            <Dashboard />
          </Box>
        </DndProvider>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: colors.grey[100],
              color: colors.grey[700],
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
