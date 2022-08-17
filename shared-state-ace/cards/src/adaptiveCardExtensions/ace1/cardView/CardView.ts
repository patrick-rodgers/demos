import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'Ace1AdaptiveCardExtensionStrings';
import { IAce1AdaptiveCardExtensionProps, IAce1AdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../Ace1AdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAce1AdaptiveCardExtensionProps, IAce1AdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IBasicCardParameters {

    return {
      primaryText: strings.Description,
      title: "Vacation Booking",
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
