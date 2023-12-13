import { getAuthenticatedData, isAuthenticated } from "../auth/helper";
import { titleCase } from "../utils/titleCase";
import Base from "../components/base";
import { Container, Grid, Paper } from "@mui/material";
import Copyright from "../components/Copyright";
import LogTable from "../components/LogTable";
import UsersDashComponent2 from "../components/UsersDashComponent2";
import Charts from "../components/Charts";

const UserDashboard = (props) => {
  const authenticatedData = isAuthenticated();
  const { token, user } = getAuthenticatedData(authenticatedData);
  return (
    <Base
      title="User Dashboard"
      user={user}
      // description={"Welcome " + titleCase(user.data.Name)}
    >
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={7} lg={8}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 220,
              }}
            >
              <Charts token={token} user={user}></Charts>
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 220,
              }}
            >
              <UsersDashComponent2
                token={token}
                user={user}
              ></UsersDashComponent2>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "38vh",
              }}
            >
              <LogTable token={token} user={user} />
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Base>
  );
};

export default UserDashboard;
