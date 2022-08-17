import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'Ace2AdaptiveCardExtensionStrings';
import { IAce2AdaptiveCardExtensionProps, IAce2AdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../Ace2AdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAce2AdaptiveCardExtensionProps, IAce2AdaptiveCardExtensionState> {
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
      primaryText: this.state.hasVacationError ? "Your Expense deadline conflicts with your Vacation Dates": "Enjoy your vacations!",
      title: "Expense Card",
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
