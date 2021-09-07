import { api } from '.';

export const GetCalendarPaymentAndLotery = async (option: { token: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/calendar/payment-and-lotery',
  });
  return response;
};
