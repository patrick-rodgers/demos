import { ISPFxAdaptiveCard, BaseAdaptiveCardView, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'Ace1AdaptiveCardExtensionStrings';
import { IAce1AdaptiveCardExtensionProps, IAce1AdaptiveCardExtensionState } from '../Ace1AdaptiveCardExtension';

import { createVacation } from "state-service";

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAce1AdaptiveCardExtensionProps,
  IAce1AdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: "Edit your vacation info:"
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: ISubmitActionArguments): void {

    if (action.id === "book") {

      // use the shared library to create a new vacation entry
      createVacation({
        end: new Date(action.data.vacaEnd),
        start: new Date(action.data.vacaStart),
        title: action.data.vacaTitle,
      });

      // close the quick view for a cleaner interface
      this.quickViewNavigator.close();
    }
  }
}
