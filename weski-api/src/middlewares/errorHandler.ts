import { StatusCodes } from "http-status-codes";

export default function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.name === 'ZodError') {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Validation error', details: err.errors });
  }

  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
}
