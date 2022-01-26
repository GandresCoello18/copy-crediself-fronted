import { api } from '.';

export const GetCancelaciones = async (option: {
  token?: string;
  dateInit?: string;
  dateEnd?: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/cancelacion?page=${option.page || ''}&dateInit=${option.dateInit || ''}&dateEnd=${
      option.dateEnd || ''
    }`,
  });
  return response;
};
