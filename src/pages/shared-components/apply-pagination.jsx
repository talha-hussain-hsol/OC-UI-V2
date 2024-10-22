import React, { useMemo, useState, useEffect, useCallback } from "react";
import MyTable from "./table-components-updated";
import { getRestrictedListAPI } from "../../api/network/administrationApi/administrationAPI";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplyPagination = (props) => {
  const cancelTokenSource = axios.CancelToken.source();
  const params = useParams();
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [restrictedList, setRestrictedList] = useState([]);

  useEffect(() => {
    console.log("restrictedList", restrictedList);
  }, [restrictedList]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
    ],
    []
  );

  const getRestrictedList = async () => {};

  const fetchData = useCallback(async () => {
    setLoading(true);
    // setIsLoader(true);
    const response = await getRestrictedListAPI("233", cancelTokenSource.token);
    if (response.success == true) {
      setRestrictedList(response?.data?.restricted_lists);
      //   setIsLoader(false);
      setLoading(false);
    } else {
      setLoading(false);
      //   setIsLoader(false);
    }
  }, [offset, limit]);

  const handlePageChange = (pageIndex) => {
    setOffset(pageIndex * limit);
  };

  const handlePageSizeChange = (pageSize) => {
    setLimit(pageSize);
  };

  return (
    <MyTable
      fetchData={fetchData}
      data={data}
      pageCount={pageCount}
      loading={loading}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      columns={columns}
    />
  );
};

export default ApplyPagination;
