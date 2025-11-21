import axios from 'axios';
import { BASE_API_URL } from '../constants/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  org_type: 'church' | 'ngo';
}

export const loginUser = async (data: LoginData) => {
  const res = await axios.post(`${BASE_API_URL}/auth/login`, data);
  return res.data; // expected { token, user }
};

export const registerUser = async (data: RegisterData) => {
  const res = await axios.post(`${BASE_API_URL}/auth/register`, data);
  return res.data; // expected { token, user }
};
