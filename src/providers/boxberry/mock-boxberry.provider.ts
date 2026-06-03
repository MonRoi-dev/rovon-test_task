import { IDeliveryProvider } from '../interfaces/delivery-provider.interface';
import { CartData, DeliveryAddress } from '../../models/request.model';
import { DeliveryOption } from '../../models/response.model';

//Этот провайдер рассчитывает цену по тарифной сетке
export class MockBoxberryProvider implements IDeliveryProvider {
  public name = 'Boxberry';

  public async calculate(cart: CartData, address: DeliveryAddress, signal?: AbortSignal): Promise<DeliveryOption[]> {
    if (signal?.aborted) {
      throw signal.reason || new Error('Aborted');
    }

    const city = address.city.trim().toLowerCase();
    
    switch (city) {
      case 'москва':
        return [this.createOption(300, 1, 2)];
      case 'казань':
        return [this.createOption(500, 2, 3)];
      case 'краснодар':
        return [this.createOption(700, 3, 4)];
      default:
        return [this.createOption(900, 5, 7)];
    }
  }

  private createOption(price: number, daysMin: number, daysMax: number): DeliveryOption {
    return {
      providerName: this.name,
      optionName: 'Отделение',
      price,
      daysMin,
      daysMax,
    };
  }
}
