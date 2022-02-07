import { api } from '.';

export const GetCalendarPaymentAndLotery = async (option: { token: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/calendar/payment-and-lotery',
  });
  return response;
};

export const ReGenerateCalendar = async (option: { token: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'POST',
    url: '/calendar/reGenerate',
  });
  return response;
};

export const GenerateFileCalendar = async (option: {
  token: string;
  empresa: 'CREDISELF' | 'AUTOIMPULZADORA';
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'POST',
    url: '/calendar/file',
    data: {
      empresa: option.empresa,
    },
  });
  return response;
};
