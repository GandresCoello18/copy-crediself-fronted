import { api } from '.';

export const GetCancelaciones = async (option: {
  token?: string;
  dateInit?: string;
  dateEnd?: string;
  find?: string;
  page: number;
}) => {
  const { token, dateEnd, dateInit, find, page } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/cancelacion?page=${page || ''}&dateInit=${
      dateInit === 'dd/mm/aaaa' ? '' : dateInit
    }&dateEnd=${dateEnd === 'dd/mm/aaaa' ? '' : dateEnd}&find=${find}`,
  });
  return response;
};
