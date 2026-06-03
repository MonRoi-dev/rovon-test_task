import { IDeliveryProvider } from '../providers/interfaces/delivery-provider.interface';
import { CartData, DeliveryAddress } from '../models/request.model';
import { DeliveryOption } from '../models/response.model';
import { withTimeoutSignal } from '../utils/timeout.util';

export class DeliveryService {
  private readonly timeoutMs = 2000;

  constructor(private readonly providers: IDeliveryProvider[]) {}

  public async calculateAll(cart: CartData, address: DeliveryAddress): Promise<DeliveryOption[]> {
    //Тут идет параллельное выполнение запросов ко всем провайдерам, чтобы ускорить процесс
    const promises = this.providers.map(provider =>
      //Обработка долгих ответов от условного АПИ
      withTimeoutSignal(
        signal => provider.calculate(cart, address, signal),
        this.timeoutMs,
        `Provider ${provider.name} timed out`
      )
    );
    const results = await Promise.allSettled(promises);

    const options: DeliveryOption[] = [];

    //Если провейдер не отвечает, то он не добавляется в отвт, а просто выкидывает ошибку
    for (const i in results) {
      const result = results[i];
      if (result.status === 'fulfilled') {
        options.push(...result.value);
      } else {
        console.error(`Provider ${this.providers[i].name} failed:`, result.reason);
      }
    }

    return options;
  }
}
