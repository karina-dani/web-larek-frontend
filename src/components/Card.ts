import {Component} from "./base/components";
import {IProduct} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

//какие у нас действия на карточках
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

//интерфейс карточки - что она принимает как дату?
export interface ICard<T> {
    id: string;
    category?: string;
    description?: string | string[];
    image?: string;
    price: number | string;
    title: string;
    index?: number;
    button: string[];
}

export class Card<T> extends Component<ICard<T>> {
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _title: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);
        
      //вот тут навешивает событие, если находит кнопку. Если не находит, то на весь контейнер
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }
    //присваиваем id
    set id(value: string) {
        this.container.dataset.id = value;
    }

    //достаем id
    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (value === 'другое'){
          this._category.classList.add(bem(this.blockName, 'category', 'other').name)
        } else if (value === 'софт-скил') {
          this._category.classList.add(bem(this.blockName, 'category', 'soft').name)
        } else if (value === 'хард-скил') {
          this._category.classList.add(bem(this.blockName, 'category', 'hard').name)
        } else if (value === 'дополнительное') {
            this._category.classList.add(bem(this.blockName, 'category', 'additional').name)
        } else if (value === 'кнопка') {
            this._category.classList.add(bem(this.blockName, 'category', 'button').name)
        }
    }    

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, `Бесценно`);
            this.setDisabled(this._button, true);
        } else if (value >= 10000) {
        const cost = new Intl.NumberFormat("ru").format(value);
        this.setText(this._price, `${cost} синапсов`);
        } else {
            this.setText(this._price, `${value} синапсов`);
        }  
    }    
    
}

export class CatalogCard extends Card<HTMLElement> {

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}

export class PreviewCard extends Card<HTMLElement> {

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }

    set button(value: string[])  {
        if (value.includes(this.id)) {
            this.setText(this._button, 'Удалить из корзины');
        } else {
            this.setText(this._button, 'В корзину'); 
        }
    }
}

export interface IBasketCard {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected _icon: HTMLElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._icon = ensureElement<HTMLElement>(`.basket__item-delete`, container);
    }

    set index(index: IBasketCard) {
        this.setText(this._index, index);
    }

}