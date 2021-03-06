import * as axios from 'axios';

export const DEFAULT_AVATAR = 'util/avatar-default_ux9wip.svg';
export const BASE_API_IMAGES_CLOUDINNARY =
  'http://res.cloudinary.com/cici/image/upload/v1616791874';
export const BASE_API_IMAGES_CLOUDINNARY_SCALE =
  'https://res.cloudinary.com/cici/image/upload/c_scale,w_230/v1619715476';

export const BASE_FRONTEND_DEV = 'http://localhost:3000';
export const BASE_FRONTEND_PROD = 'https://copy-crediself-fronted.vercel.app';
export const BASE_FRONTEND = BASE_FRONTEND_PROD;

// const apiDev = 'http://localhost:9000';
// const apiProdRespaldo = 'https://crediself.herokuapp.com';
const apiProd = 'https://crediself-api.herokuapp.com';

export const BASE_API_FILE_DOCUMENT = `${apiProd}/static`;

export const BASE_API = apiProd;

export const api = axios.default.create({
  baseURL: `${BASE_API}/api`,
});

api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
