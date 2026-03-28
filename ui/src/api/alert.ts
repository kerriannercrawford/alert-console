import {Alert} from "../types.ts";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/alerts'
})

export async function fetchAlerts(): Promise<Alert[]> {
    const response = await axiosInstance.get<Alert[]>('')
    return response.data
}

export async function fetchAlertDetails() {}

export async function createAlert() {}

export async function createDeliveryEvent() {}
