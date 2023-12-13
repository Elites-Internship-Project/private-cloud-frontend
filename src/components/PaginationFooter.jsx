import React, {useState} from 'react';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

function PaginationFooter({currentPage, setCurrentPage, totalCount, perPage}) {
    const pageCount = Math.ceil(totalCount / perPage);
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            {/* Custom Pagination */}
            <Box sx={{mt: 2}}>
                <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </div>
    );
}

export default PaginationFooter;
