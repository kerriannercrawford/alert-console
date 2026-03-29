import {Alert, AlertDetail, AlertSummary, CreateAlert, CreateDeliveryEvent, DeliveryEvent} from "../types.ts";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/alerts'
})

export async function fetchAlerts(): Promise<AlertSummary[]> {
    const response = await axiosInstance.get<AlertSummary[]>('')
    return response.data
}

export async function fetchAlertDetails(alertId: string): Promise<AlertDetail> {
    const response = await axiosInstance.get<AlertDetail>(`${alertId}`)
    return response.data
}

export async function createAlert(data: CreateAlert): Promise<Alert> {
    const response = await axiosInstance.post<Alert>('', data)
    return response.data
}

export async function createDeliveryEvent(alertId: string, data: CreateDeliveryEvent): Promise<DeliveryEvent> {
    const response = await axiosInstance.post<DeliveryEvent>(`${alertId}/events`, data)
    return response.data
}
