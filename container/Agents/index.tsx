import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Layout from "../Layout";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Button,
  CircularProgress,
  IconButton,
  Slide,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import agentServices from "@/services/Apis/agent";
import { useQuery } from "react-query";
import UserAvatar from "@/components/common/Avatar";
import ConfirmAgentModal from "./ConfirmAgentModal";
import AddAgentModal from "./AddAgentsModal";
import ViewAgentModal from "./ViewAgentsModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E5E5E7",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Agents() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    React.useState(searchQuery);
  const [open, setOpen] = React.useState({ item: {}, isOpen: false });
  const [openViewBox, setOpenViewBox] = React.useState({
    item: {},
    isOpen: false,
  });
  const [openConfirmBox, setOpenConfirmBox] = React.useState({
    item: {} as any,
    isOpen: false,
  });

  const handleCloseConfirmBox = () =>
    setOpenConfirmBox({ item: {}, isOpen: false });

  const handleClose = () => setOpen({ item: {}, isOpen: false });

  const handleCloseViewBox = () => setOpenViewBox({ item: {}, isOpen: false });

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const agentDataKey = "/agents";

  const {
    data: agentData,
    isLoading: isAgentsLoading,
    refetch: refetchAgent,
  }: any = useQuery(
    [agentDataKey, page, rowsPerPage, debouncedSearchQuery],
    agentServices.getAllAgents,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Agent List
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpen({ item: {}, isOpen: true })}
          sx={{ fontWeight: 600, display: "flex", gap: "5px" }}
        >
          <AddCircleOutlineIcon />
          Add Agent
        </Button>
      </div>
      <TextField
        label="Search Agents"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      {/* Handle loading state */}
      {isAgentsLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow sx={{ fontWeight: 600 }}>
                  <StyledTableCell>Agent name</StyledTableCell>
                  <StyledTableCell align="center">Agent Code</StyledTableCell>
                  <StyledTableCell align="center">Phone number</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              {}
              {agentData?.items?.length !== 0 ? (
                <TableBody>
                  {agentData?.items?.map((row: any) => (
                    <StyledTableRow key={row.code}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        sx={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <UserAvatar name={row?.name} />
                        {row?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.code}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.phone}
                      </StyledTableCell>
                      <StyledTableCell align="right" sx={{ width: "200px" }}>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            setOpenViewBox({ item: row, isOpen: true })
                          }
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => setOpen({ item: row, isOpen: true })}
                        >
                          <ModeEditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            setOpenConfirmBox({ item: row, isOpen: true })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              ) : (
                <div className="grid justify-center items-center h-28 w-full col-span-6">
                  Not Agent Found
                </div>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={agentData?.totalRecords || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={agentData?.recordsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      <AddAgentModal
        open={open.isOpen}
        handleClose={handleClose}
        refetchAgent={refetchAgent}
        item={open.item}
      />
      <ViewAgentModal
        open={openViewBox.isOpen}
        handleCloseViewBox={handleCloseViewBox}
        item={openViewBox.item}
      />
      <ConfirmAgentModal
        openConfirmBox={openConfirmBox}
        handleCloseConfirmBox={handleCloseConfirmBox}
        refetchAgent={refetchAgent}
      />
    </Layout>
  );
}

export default Agents;
