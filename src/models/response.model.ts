//Описание ответа
export interface DeliveryOption {
  providerName: string;
  optionName: string;
  price: number;
  daysMin: number;
  daysMax: number;
}

export interface CalculateDeliveryResponse {
  options: DeliveryOption[];
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  details?: unknown;
};
