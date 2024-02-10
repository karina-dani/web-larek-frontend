import {Component} from "./base/components";
import {createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        
        this.items = [];
        
    }
 //(п) позволяет сохранить новые значения в поля. Это то, что будет видно снаружи. Будет свойство items, куда мы можем что-то сохранять. Они у нас как раз в интерфейсе сверху написаны.
    set items(items: HTMLElement[]) {
        //помещаем items в list 
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true;
        }
    }

    set total(total: number) {
        let cost = String(total);
        if (total > 10000) {
            cost = new Intl.NumberFormat('ru').format(total);
        }
        this.setText(this._total, `${cost} синапсов`);
    } 
}