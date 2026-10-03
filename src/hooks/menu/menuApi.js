import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_HOST from '../../../API/api';

export const useGetMenu = ({ page, pageSize, search } = {}) => {
  const { token } = useSelector((state) => state.auth);

  const getMenu = useQuery({
    queryKey: ['menu', page, pageSize, search],
    queryFn: async () => {
      const res = await axios.get(`${API_HOST}:5257/api/MyMenu`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, pageSize, search },
      });
      return res.data;
    },
  });
  return getMenu;
};
