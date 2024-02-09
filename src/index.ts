import './scss/styles.scss';

import {StoreAPI} from "./components/StoreAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {Card, CatalogCard, PreviewCard, BasketCard} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm} from "./types";
import {Order, Contacts} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();

const api = new StoreAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны - (п) создали, потом будем исользовать через clone node
//виды карточек
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения - тут храним все данные
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса 
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Получаем продукты с сервера
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
      console.error(err);
  });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:show', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item),
      });
      return card.render({
          category: item.category,
          image: item.image,
          price: item.price,
          title: item.title,
      });
  });
});

// Выбрать продукт 
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});


// Открыть продукт
events.on('preview:open', (item: ProductItem) => {
    //прописали, что будет происходить
  const showItem = (item: ProductItem) => {
      const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            //закинули сразу id карточки в баскет или удалили
            if (appData.basket.includes(item.id)) {
                events.emit('card:delete', item);
            } else {
                events.emit('card:add', item); 
            }
            events.emit('preview:open', item);
        }
    });
      modal.render({
          content: card.render({
            id: item.id,
            category: item.category,
            description: item.description,
            image: item.image,
            price: item.price,
            title: item.title,
            button: appData.isProductSelected(),
              })
          })
      }
    //теперь обращаемся к серверу
      if (item) {
        api.getProductItem(item.id)
            .then(() => {
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
    });

// Открыть корзину - рождается из page
events.on('basket:open', () => {
  modal.render({
      content: createElement<HTMLElement>('div', {}, 
          basket.render()
      )
  });
});

// Добавляем в корзину
events.on('card:add', (item: ProductItem) => {
    appData.toggleOrderedProduct(item.id, true);
    events.emit('basket:changed'); 
 });

// Удаляем из корзины
events.on('card:delete', (item: ProductItem) => {
   appData.toggleOrderedProduct(item.id, false);
   events.emit('basket:changed'); 
});

// Изменения в корзине
events.on('basket:changed', () => {
  page.counter = appData.getBasketItemsCount();
  basket.items = appData.getAddedProducts()
  .map((item, i) => {
      const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
          onClick: () => events.emit('card:delete', item)
      });
      return card.render({
            title: item.title,
            price: item.price,
            index: i + 1,
            })
  });
  basket.total = appData.getTotal();
  appData.order.total = appData.getTotal();
  appData.order.items = appData.basket;
})

// Открыть форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

//выбрали метод оплаты
events.on('payment:chosen', () => {
    appData.order.payment = order.payment;
    appData.validateOrder();
})

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    })
})

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    events.emit('basket:changed');
                }
            });

            modal.render({
                content: success.render({
                    total: appData.order.total,
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
        
});

// Изменилось состояние валидации формы order
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы contacts
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей order
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Изменилось одно из полей contacts
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

