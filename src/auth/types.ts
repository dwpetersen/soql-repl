import { AxiosResponse } from "axios";

interface TokenResponseData {
    access_token: string;
}

export type TokenResponse = AxiosResponse<TokenResponseData, unknown>;