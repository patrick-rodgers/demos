import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'PnpscopedemoApplicationCustomizerStrings';

/**
 * Demo: import from scoped package 
 */
import { sp } from "@pnp/sp";

const LOG_SOURCE: string = 'PnpscopedemoApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPnpscopedemoApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PnpscopedemoApplicationCustomizer
  extends BaseApplicationCustomizer<IPnpscopedemoApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    /**
     * Demo: using the sub-package version 
     */
    sp.web.select("Title").getAs<{ Title: string }>().then(w => {

      alert(w.Title);

    });


    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    alert(`Hello from ${strings.Title}:\n\n${message}`);

    return Promise.resolve<void>();
  }
}
