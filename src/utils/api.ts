import axios from "axios"
import { UserModel } from "../types/Entites";
import ServiceResponse from "../types/ServiceResponse";
export const baseUrl = "http://192.168.2.175:37323";
export default function api() {
    const token = "";
    return axios.create({
        baseURL: baseUrl,
        headers: {
            'Authorization': 'bearer ' + token
        }
    })
}
export const postLogin = async (userName?: string, password?: string) => {
    return await api().post<ServiceResponse<UserModel>>("/login/" + userName + "/" + password);
}