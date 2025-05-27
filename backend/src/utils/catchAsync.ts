import { Request, Response, NextFunction } from 'express';

export function catchAsync<
  Req extends Request = Request,
  Res extends Response = Response,
  Next extends NextFunction = NextFunction
>(
  fn: (req: Req, res: Res, next: Next) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    fn(req as Req, res as Res, next as Next).catch(next);
  };
}
