import { MSGraphClientFactory, AadHttpClientFactory } from "@microsoft/sp-http";

export interface INewPossumProps {
  msGraphClientFactory: MSGraphClientFactory;
  aadHttpClientFactory: AadHttpClientFactory;
}
