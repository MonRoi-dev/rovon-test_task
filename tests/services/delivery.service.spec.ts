import { DeliveryService } from '../../src/services/delivery.service';
import { IDeliveryProvider } from '../../src/providers/interfaces/delivery-provider.interface';
import { CartData, DeliveryAddress } from '../../src/models/request.model';
import { DeliveryOption } from '../../src/models/response.model';

describe('DeliveryService Timeout and Failure Handling', () => {
  const baseCart: CartData = {
    weight: 1.5,
    dimensions: { length: 10, width: 10, height: 10 },
    totalPrice: 1000,
  };

  const baseAddress: DeliveryAddress = {
    city: 'Москва',
    street: 'Ленина',
    house: '10',
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should collect options from successful providers and handle timeout providers', async () => {
    const fastProvider: IDeliveryProvider = {
      name: 'FastProvider',
      calculate: async () => [
        {
          providerName: 'FastProvider',
          optionName: 'Standard',
          price: 300,
          daysMin: 2,
          daysMax: 4,
        },
      ],
    };

    const slowProvider: IDeliveryProvider = {
      name: 'SlowProvider',
      calculate: (cart, address, signal) => {
        return new Promise<DeliveryOption[]>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            resolve([
              {
                providerName: 'SlowProvider',
                optionName: 'Express',
                price: 500,
                daysMin: 1,
                daysMax: 2,
              },
            ]);
          }, 3000);

          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(signal.reason || new Error('Aborted'));
            });
          }
        });
      },
    };

    const service = new DeliveryService([fastProvider, slowProvider]);
    const options = await service.calculateAll(baseCart, baseAddress);

    expect(options).toHaveLength(1);
    expect(options[0].providerName).toBe('FastProvider');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should return empty list if all providers fail or timeout', async () => {
    const failingProvider: IDeliveryProvider = {
      name: 'FailingProvider',
      calculate: async () => {
        throw new Error('API Error');
      },
    };

    const service = new DeliveryService([failingProvider]);
    const options = await service.calculateAll(baseCart, baseAddress);

    expect(options).toHaveLength(0);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
