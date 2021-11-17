export default interface IResponse<T = {}> {
  success: boolean;
  status: number;
  message: string;
  data: T | {};
  meta?: {
    pagination?: any;
  };
  error?: {
    code: string;
  };
}
