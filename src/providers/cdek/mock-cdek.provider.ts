import { IDeliveryProvider } from '../interfaces/delivery-provider.interface';
import { CartData, DeliveryAddress } from '../../models/request.model';
import { DeliveryOption } from '../../models/response.model';

//Этот провайдер рассчитывает цену по весу
export class MockCdekProvider implements IDeliveryProvider {
  public name = 'CDEK';

  public async calculate(cart: CartData, address: DeliveryAddress, signal?: AbortSignal): Promise<DeliveryOption[]> {
    if (signal?.aborted) {
      throw signal.reason || new Error('Aborted');
    }

    const basePrice = cart.weight * 100;

    return [
      {
        providerName: this.name,
        optionName: 'Склад-Склад',
        price: basePrice,
        daysMin: 2,
        daysMax: 4,
      },
      {
        providerName: this.name,
        optionName: 'Курьер',
        price: basePrice + 150,
        daysMin: 2,
        daysMax: 4,
      },
    ];
  }
}
