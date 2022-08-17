import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { Ace1PropertyPane } from './Ace1PropertyPane';

export interface IAce1AdaptiveCardExtensionProps {
  title: string;
}

export interface IAce1AdaptiveCardExtensionState { }

const CARD_VIEW_REGISTRY_ID: string = 'Ace1_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Ace1_QUICK_VIEW';

export default class Ace1AdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAce1AdaptiveCardExtensionProps,
  IAce1AdaptiveCardExtensionState
> {
  private _deferredPropertyPane: Ace1PropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Ace1-property-pane'*/
      './Ace1PropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.Ace1PropertyPane();
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
