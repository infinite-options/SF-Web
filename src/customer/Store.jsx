import React, { useContext } from 'react';
import DisplayProduce from './pages/displayProduct';
import StoreFilter from './storeFilter';
import someContexts from './makeContext';
import { AuthContext } from '../auth/AuthContext';
import AdminNavBar from '../admin/AdminNavBar';
import { Box } from '@material-ui/core';

const Store = () => {
  const topNode = useContext(someContexts);
  const Auth = useContext(AuthContext);

  return (
    <>
      <Box property="div">{topNode.userRole}</Box>
      {Auth.authLevel >= 1 ? <AdminNavBar /> : <></>}
      <Box display="flex">
        <StoreFilter />
        <DisplayProduce />
      </Box>
    </>
  );
};

export default Store;
