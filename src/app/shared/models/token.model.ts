import { format, addSeconds, compareAsc, differenceInSeconds } from 'date-fns';

export class TokenModel {
  readonly token_type: string;
  readonly expires_in: number;
  readonly access_token: any;
  readonly refresh_token: any;

  readonly fechaInicio?: string;

  get authorization(): string {
    return `${this.token_type} ${this.access_token}`;
  }

  get authorizationRefresh(): string {
    return `${this.token_type} ${this.refresh_token}`;
  }

  get timeRefreshToken(): number {
    const timeOut: number = 300; // 5min de espera para que no se hagan los 401 y se pierdas request
    const today: Date = new Date();
    const differenceInSecond: number = differenceInSeconds(
      today,
      new Date(this.fechaInicio),
    );
    const timeToRefresh = this.expires_in - differenceInSecond - timeOut;

    return timeToRefresh <= 0? 1: timeToRefresh;
  }

  get isExpired(): boolean {
    const today: number =  Math.floor(Date.now() / 1000);
    return today >= this.expires_in;
  }

  constructor(token: TokenModel) {
    if (token) {
      this.token_type = token.token_type;
      this.expires_in = token.expires_in;
      this.access_token = token.access_token;
      this.refresh_token = token.refresh_token;

      this.fechaInicio = token.fechaInicio
        ? format(new Date(token.fechaInicio), "yyyy-MM-dd'T'HH:mm:ss.SSS")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    }
  }
}
