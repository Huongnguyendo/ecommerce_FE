import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../../../redux/actions/user.actions";
import { Button } from "react-bootstrap";
import PaginationBar from "../../../../components/PaginationBar";

const AllUsersPage = () => {
  let dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const totalPageNum = useSelector((state) => state.user.totalPageNum);

  let loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(userActions.getAllUsersForAdmin());
  }, [dispatch]);

  //   const selectedProducts = useSelector((state) => state.product.products);
  let users = useSelector((state) => state.user.users);

  const deleteUser = (id) => {
    dispatch(userActions.deleteForAdmin(id));
  };

  return (
    <div>
      {users &&
        users.map((user) => (
          <div>
            <p>
              <span>User name: {user.name}</span>
              <span>Role: {user.role}</span>
              <Button variant="danger" onClick={() => deleteUser(user._id)}>
                Delete
              </Button>
            </p>
          </div>
        ))}

      <PaginationBar
        pageNum={pageNum}
        setPageNum={setPageNum}
        totalPageNum={totalPageNum}
        loading={loading}
      />
    </div>
  );
};

export default AllUsersPage;
