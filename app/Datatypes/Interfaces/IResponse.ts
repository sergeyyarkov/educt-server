export default interface IResponse {
  success: boolean;
  status: number;
  message: string;
  data: object;
  error?: {
    code: string;
  };
}
