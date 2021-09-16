export default interface IResponse {
  success: boolean;
  status: number;
  message: string;
  data: object;
  meta?: {
    pagination?: any;
  };
  error?: {
    code: string;
  };
}
