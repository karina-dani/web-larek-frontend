
import {FormErrors, IAppState, IProduct, IOrder, IOrderForm} from "../types";
import {Model} from "./base/model";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

//карточки и вся инфо в них
export class ProductItem extends Model<IProduct>{
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category: string;
}

//хранит данные и сообщает об изменениях
export class AppState extends Model<IAppState> {
    basket: string[] = [];
    catalog: ProductItem[];
    order: IOrder = {
        payment: '',
        address: '', 
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleOrderedProduct(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.basket.push(id); //если true, кладем в заказ
        } else {
            this.basket = this.basket.filter(product => product != id); //если false, убираем из заказа
        }
    }

    getAddedProducts(): ProductItem[] {
        return this.catalog
        .filter(item => this.basket.includes(item.id));
    }

    getBasketItemsCount() {
        return this.basket.length;
    }

    getTotal() {
        return this.basket.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedProduct(id, false);
        });
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:show', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:open', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder() && this.validateContacts()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
