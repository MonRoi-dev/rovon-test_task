import { Request, Response } from 'express';
import { CalculateDeliveryRequestSchema } from '../models/request.model';
import { DeliveryService } from '../services/delivery.service';
import { ApiResponse, DeliveryOption } from '../models/response.model';

export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  public calculate = async (
    req: Request,
    res: Response<ApiResponse<DeliveryOption[]>>
  ): Promise<void> => {
    const validationResult = CalculateDeliveryRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.issues,
      });
      return;
    }

    try {
      const { cart, address } = validationResult.data;
      const options = await this.deliveryService.calculateAll(cart, address);
      
      res.status(200).json({ data: options });
    } catch (error) {
      console.error('Calculation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
