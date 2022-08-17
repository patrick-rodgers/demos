import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { Ace2PropertyPane } from './Ace2PropertyPane';

import { onVacationAdded, IVacation } from "state-service";

export interface IAce2AdaptiveCardExtensionProps {
  title: string;
}

export interface IAce2AdaptiveCardExtensionState {
  hasVacationError: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'Ace2_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Ace2_QUICK_VIEW';

export default class Ace2AdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAce2AdaptiveCardExtensionProps,
  IAce2AdaptiveCardExtensionState
> {
  private _deferredPropertyPane: Ace2PropertyPane | undefined;

  public onInit(): Promise<void> {

    // we use our state to track if there is a vacation error, this flag can be used to show/hide messages, etc.
    this.state = {
      hasVacationError: false,
    };

    // use the shared library to subscribe an event handler for when a vacation is added
    // this allows any other ACE to subscribe for vacation updates from the shared library
    onVacationAdded((vaca: IVacation) => {

      // do some math on the vacation dates and set the error flag
      this.setState({
        hasVacationError: typeof vaca !== "undefined",
      });

    });

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Ace2-property-pane'*/
      './Ace2PropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.Ace2PropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
