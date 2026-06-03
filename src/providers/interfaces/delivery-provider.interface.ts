import { CartData, DeliveryAddress } from '../../models/request.model';
import { DeliveryOption } from '../../models/response.model';

//Интерфейс для масштабируемости. Это позволит добавлять новых провайдеров
export interface IDeliveryProvider {
  name: string;
  calculate(cart: CartData, address: DeliveryAddress, signal?: AbortSignal): Promise<DeliveryOption[]>;
}
