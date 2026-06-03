import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { DeliveryService } from '../services/delivery.service';
import { MockCdekProvider } from '../providers/cdek/mock-cdek.provider';
import { MockBoxberryProvider } from '../providers/boxberry/mock-boxberry.provider';

const deliveryRoutes = Router();

const providers = [new MockCdekProvider(), new MockBoxberryProvider()];
const deliveryService = new DeliveryService(providers);
const deliveryController = new DeliveryController(deliveryService);

deliveryRoutes.post('/calculate', deliveryController.calculate);

export { deliveryRoutes };
