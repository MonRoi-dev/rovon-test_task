import { MockBoxberryProvider } from '../../src/providers/boxberry/mock-boxberry.provider';
import { CartData, DeliveryAddress } from '../../src/models/request.model';

describe('MockBoxberryProvider', () => {
  let provider: MockBoxberryProvider;
  
  const baseCart: CartData = {
    weight: 1,
    dimensions: { length: 1, width: 1, height: 1 },
    totalPrice: 1000,
  };

  beforeEach(() => {
    provider = new MockBoxberryProvider();
  });

  it('should return 300 for Москва', async () => {
    const address: DeliveryAddress = { city: 'Москва', street: 'ул', house: '1' };
    const options = await provider.calculate(baseCart, address);

    expect(options).toHaveLength(1);
    expect(options[0].price).toBe(300);
    expect(options[0].daysMin).toBe(1);
    expect(options[0].daysMax).toBe(2);
  });

  it('should return 500 for Казань', async () => {
    const address: DeliveryAddress = { city: 'Казань', street: 'ул', house: '1' };
    const options = await provider.calculate(baseCart, address);

    expect(options[0].price).toBe(500);
  });

  it('should return 900 for default city', async () => {
    const address: DeliveryAddress = { city: 'Самара', street: 'ул', house: '1' };
    const options = await provider.calculate(baseCart, address);

    expect(options[0].price).toBe(900);
  });
});
