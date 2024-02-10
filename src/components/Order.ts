import {Form} from "./common/Form";
import {IOrderForm, IContactsForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement, ensureAllElements} from "../utils/utils";

export class Order extends Form<IOrderForm> {
  protected _tabs: HTMLButtonElement[];
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this._tabs = ensureAllElements<HTMLButtonElement>('.button_alt', container);
      this._card = ensureElement<HTMLButtonElement>('button[name=card]', container);
      this._cash = ensureElement<HTMLButtonElement>('button[name=cash]', container);

      this._tabs.forEach(tab => {
          tab.addEventListener('click', () => { 
            if(tab === this._card) {
            this._card.classList.add('button_alt-active');
            this._cash.classList.remove('button_alt-active');
            this.onInputChange('payment', 'card');
            } else {
            this._cash.classList.add('button_alt-active');
            this._card.classList.remove('button_alt-active');
            this.onInputChange('payment', 'cash');
            }
            events.emit('payment:chosen');
          })
        });
      
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
}

}

export class Contacts extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}