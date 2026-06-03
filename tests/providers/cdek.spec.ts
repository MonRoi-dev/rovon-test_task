import { MockCdekProvider } from '../../src/providers/cdek/mock-cdek.provider';
import { CartData, DeliveryAddress } from '../../src/models/request.model';

describe('MockCdekProvider', () => {
  let provider: MockCdekProvider;

  beforeEach(() => {
    provider = new MockCdekProvider();
  });

  it('should calculate correct prices for 3kg weight', async () => {
    const cart: CartData = {
      weight: 3,
      dimensions: { length: 1, width: 1, height: 1 },
      totalPrice: 1000,
    };
    const address: DeliveryAddress = { city: 'Москва', street: 'ул', house: '1' };

    const options = await provider.calculate(cart, address);

    expect(options).toHaveLength(2);
    
    const sklad = options.find(o => o.optionName === 'Склад-Склад');
    const courier = options.find(o => o.optionName === 'Курьер');

    expect(sklad?.price).toBe(300);
    expect(courier?.price).toBe(450);
  });
});
