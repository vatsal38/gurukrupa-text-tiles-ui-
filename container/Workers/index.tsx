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
import workerServices from "@/services/Apis/worker";
import { useQuery } from "react-query";
import AddWorkerModal from "./AddWorkerModal";
import UserAvatar from "@/components/common/Avatar";
import ConfirmWorkerModal from "./ConfirmWorkerModal";
import ViewWorkerModal from "./ViewWorkerModal";

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

function Workers() {
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

  const workerDataKey = "/workers";

  const {
    data: workerData,
    isLoading: isWorkersLoading,
    refetch: refetchWorker,
  }: any = useQuery(
    [workerDataKey, page, rowsPerPage, debouncedSearchQuery],
    workerServices.getAllWorkers,
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
          Worker List
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpen({ item: {}, isOpen: true })}
          sx={{ fontWeight: 600, display: "flex", gap: "5px" }}
        >
          <AddCircleOutlineIcon />
          Add Worker
        </Button>
      </div>
      <TextField
        label="Search Workers"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      {/* Handle loading state */}
      {isWorkersLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow sx={{ fontWeight: 600 }}>
                  <StyledTableCell>Worker name</StyledTableCell>
                  <StyledTableCell align="right">Phone number</StyledTableCell>
                  <StyledTableCell align="right">
                    Current Address
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Permanent Address
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Reference Name
                  </StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              {}
              {workerData?.items?.length !== 0 ? (
                <TableBody>
                  {workerData?.items?.map((row: any) => (
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
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.phone}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.currentAddress}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.permanentAddress}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.referenceName}
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
                  Not Worker Found
                </div>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={workerData?.totalRecords || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={workerData?.recordsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      <AddWorkerModal
        open={open.isOpen}
        handleClose={handleClose}
        refetchWorker={refetchWorker}
        item={open.item}
      />
      <ViewWorkerModal
        open={openViewBox.isOpen}
        handleCloseViewBox={handleCloseViewBox}
        item={openViewBox.item}
      />
      <ConfirmWorkerModal
        openConfirmBox={openConfirmBox}
        handleCloseConfirmBox={handleCloseConfirmBox}
        refetchWorker={refetchWorker}
      />
    </Layout>
  );
}

export default Workers;
