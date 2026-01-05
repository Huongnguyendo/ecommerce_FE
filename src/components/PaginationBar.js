import React from "react";
import { Pagination, Box } from "@mui/material";

const PaginationBar = ({ pageNum, setPageNum, totalPageNum, loading }) => {
  const handleChange = (event, value) => {
    if (!loading) {
      setPageNum(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Pagination
        count={totalPageNum}
        page={pageNum}
        onChange={handleChange}
        color="primary"
        disabled={loading}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default PaginationBar;