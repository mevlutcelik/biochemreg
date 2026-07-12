import {getCookie} from 'cookies-next';

export default function useToken(){
    return getCookie('token');
};