# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код

**1. Класс Component<T>**
Является абстрактным классом представления ( `View` ) в данной архитектурной модели и родителем для всех компонентов представления приложения.
Класс является дженериком и принимает в переменной  T  тип данных для отрисовки компонентов приложения.

`constructor(container: HTMLElement)` - принимает контейнер в виде HTML-элемента, который будет сохранен, как защищенное свойство класса. 

Содержит инструментарий для работы с DOM. Включает следующие методы:

* toggleClass - переключение класса;
* setText - установка текстового контента;
* setDisabled - переключение статуса блокировки элемента;
* setHidden - скрытие элемента;
* setVisible - показ элемента;
* setImage - установка изображений;
* render - получает опциональные данные. При их наличии, добавляются либо поля класса,  либо неявным образом вызываются сеттеры экземпляра, присваивая данные с помощью Object.assign.

**2. Класс EventEmitter**
Позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Класс включает поле `events`. Через конструктор создается список событий и присваивается полю `events`.

Класс имеет методы:
* on - для подписки на событие;
* off - для отписки от события;
* emit - для уведомления подписчиков о наступлении события;
* onAll - для подписки на все события;
* offAll - для сброса всех подписчиков;
* trigger - генерирует заданное событие с заданными аргументами. 

**3. Класс Model<T>**
Слой данных, задача которого получить исходные данные, которые будут установлены в класс и события, чтобы уведомлять код о том, что событие произошло.

`constructor(data: Partial<T>, protected events: IEvents)` - принимает опциональные данные и события. Присваивает данные экземляру класса. 

Для уведомления метод:
* emitChanges - метод генерирует событие, с помощью которого мы сообщаем, что конкретно изменилось и какие данные связаны с этим изменением.

**4. Класс API**
Содержит в себе базовые HTTP-запросы.
Включает поле baseUrl, которое хранит базовый URL для запросов и поле options - настройки запросов.

`constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и настройки запросов и присваивает данные полям.

Включает методы:
* get - формирование 'GET' запросов;
* post - формирование запросов 'POST', 'PUT', 'DELETE'. Вид запроса указывается в параметре method функции.

## Компоненты модели данных (бизнес-логика)

**1. Класс AppState**
Наследует класс Model. Реализует интерфейс IAppState. Хранит все данные приложения и сообщает об изменениях.
Включает следующие поля:
basket - корзина, состоящая из массива id продуктов, которые в нее добавлены;
catalog - каталог товаров на странице, состоящий из массива ProductItem;
order - заказ, реализующий интерфейс IOrder;
preview - превью карточки товара, хранит id выбранной карточки;
formErrors - ошибки валидации, реализует тип FormErrors.

Также включает следующие методы:
* toggleOrderedProduct - добавляет и удаляет продукт из корзины;
* isProductSelected - позволяет проверить, находится ли товар в корзине;
* getAddedProducts - возращает добавленные в корзину продукты;
* getBasketItemsCount - подсчитывает количество добавленных продуктов;
* getTotal - подсчитывает сумму заказа в корзине;
* clearBasket - очищает корзину;
* setCatalog - настраивает вывод каталога товаров;
* setPreview - настраивает отображение выбранной карточки;
* setOrderField - настраивает форму заказа;
* validateOrder - настраивает валидацию формы 'order';
* validateContacts - настраивает валидацию формы 'contacts'.

**2. Класс ProductItem**
Хранит данные каждого товара. Наследует класс Model, реализует интерфейс IProduct.
Поля:
description - описание товара;    
id: - id товара;    
image - ссылка на изображение товара;    
title - название товара;    
price - цена товара;    
category - категория товара. 

**3. Класс StoreAPI**
Наследует класс API. Через класс осуществляется работа с API.
Содержит поле с ссылкой cdn.

`constructor(cdn: string, baseUrl: string, options?:RequestInit)` - принимает cdn ссылку, базовую ссылку и опциональный параметр настроек. Через него полю cdn присваивается значение.

Имплементирует интерфейс IStoreAPI и его методы:
* getProductItem - запрос каждого товара с сервера;
* getProductList - запрос списка товаров с сервера;
* orderProducts - отправка заказа на сервер.

## Компоненты представления

**1. Класс Page**
Наследует класс Component. Реализует интерфейс IPage.
Отвечает за отображение основной страницы приложения.
Содержит следующие поля для отрисовки компонентов страницы:
counter - счетчик корзины;  
catalog - каталог товаров;  
wrapper - обертка страницы;  
basket - корзина.  

`constructor(container: HTMLElement, protected events: IEvents)` - принимает контейнер в виде HTML-элемента и события.
В конструкторе полям присваиваются DOM-элементы, а также на кнопку корзины навешивается слушатель по клику, вызывающий событие 'basket:open'.

Сеттеры:
* set counter - устанавливает значение счетчика, 
* set catalog - определяет содержимое каталога,   
* set locked - регулирует блокировку прокрутки страницы. 

**2. Класс Card<T>**
Является родительским классом для всех классов отображения карточек в приложении.
Наследует Component и через дженерик определяет данные, с которыми этот компонент будет работать.
Реализует интерфейс ICard, который описывает все данные, которые класс принимает для последующей отрисовки на странице.
Отрисовывает составляещие компонента из шаблона и выводит необходимые данные с помощью сеттеров и геттеров.

Поля:
category - категория карточки товара,  
description - описание карточки товара,  
image - изображение карточки товара,  
price - цена, указанная в карточке,  
title - название товара в карточке,  
button - кнопка карточки.  

`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)` - принимает общее имя класса, контейнер в виде HTML-элемента и опциональный параметр событий.
В конструкторе описываются элементы для отрисовки, которые присваиваются соответствующим полям карточки, а также навешивается слушатель по клику. Слушатель навешивается на кнопку карточки, а при ее отстутствии, на контейнер карточки.

Сеттеры и геттеры:
* set id - присваивает id товара карточке;  
* get id - возвращает заданный id;  
* set title - присваивает название товара карточке;  
* get title - возвращает название товара;  
* set image - устанавливает переданное изображение в карточку;  
* set description - устанавливает описание товара;  
* set category - устанавливает категорию товара;
* set price - устанавливает цену на товар. 

Дочерние классы:  
* *Класс CatalogCard* - отображение карточки в каталоге;  
* *Класс PreviewCard* - отображение карточки в превью;  
Класс содержит сеттер set button, который устанавливает кнопку на карточке preview "В корзину" или "Удалить из корзины" в зависимости от того, добавлен ли товар в корзину.
* *Класс BasketCard* - отображение карточки в корзине.
Включает поля:
icon - для отрисовки иконки удаления карточки из корзины;  
index - для указания порядкового номера карточки в корзине.
В конструкторе устанавливаются начальные значения полей экземляра для отрисовки.  
Сеттер set index - устанавливает значение порядкового номера карточки.

**3. Класс Basket**
Наследует Component, реализует интерфейс IBasketView. Отрисовывает открытую корзину с товарами.
В корзину добавляются карточки товаров с возможностью удаления. По кнопке "Оформить" открывается форма оформления заказа.   
Содержит поля:
list - список-контейнер для отображения в нем заказанных товаров,  
total - финальная сумма заказа,  
button - кнопка "ОФормить".  

`constructor(container: HTMLElement, protected events: EventEmitter)` - принимает HTMLElement и событие.  
В конструкторе описываются элементы для отрисовки, которые присваиваются соответствующим полям карточки.
На кнопку "ОФормить" навешивается слушатель по клику, который вызывает событие 'order:open'.

Сеттеры:
* set items - помещает список товаров в корзину, либо выводит надпись "Корзина пуста", а также блокирует и разблокирует кнопку "Оформить",   
* set total - устанавливает общую сумму товаров в корзине. 

**4. Класс Form<T>**
Наследует Component, реализует интерфейс IFormState. 
Является классом создания и управления формами и содержит настройки отображения валидации форм.
Содежит поля:  
submit - кнопка подтверждения формы,  
errors - элемент, выводящий ошибки при заполнении формы. 

`constructor(protected container: HTMLFormElement, protected events: IEvents)` - конструктор принимает контейнер в виде HTML-элемента формы, а также события.
На контейнер вешается слушатель по вводу данных в input. Он вызывает событие '`название формы.название поля`:change', в котором отслеживаются вводимые в поля данные.
Также на контейнер устанавливается слушатель по подтверждению формы. Он вызывает событие '`название формы`:submit'.

Класс включает методы:
* onInputChange - для отслеживания изменения в полях ввода;
* render - для отрисовки формы.

Сеттеры:
* set valid - устанавливает или снимает блокировку кнопки подтверждения формы;
* set errors - устанавливает ошибки валидации для вывода.

Дочерними являются классы:
* *Order* - реализует интерфейс IOrderForm. Выводит на страницу отображение первого окна оформления заказа с выбором метода оплаты и вводом адреса доставки. 
Включает поля:
tabs - контенер кнопок с выбором метода оплаты,  
card - кнопка выбора оплаты онлайн,  
cash - кнопка выбора оплаты наличными,  
address - поле ввода адреса доставки.  

` constructor(container: HTMLFormElement, events: IEvents)` - конструктор принимает контейнер в виде HTML-элемента формы, а также событие. В конструкторе описываются элементы для отрисовки, которые присваиваются соответствующим полям карточки.  
На кнопки выбора оплаты навешиваются слушатели по клику, которые вызывают выделение выбранной кнопки, снятие выделения со второй кнопки, а также метод onInputChange.  
Сеттер set address - присваивает значение поля ввода адреса.

* *Contacts* - реализует интерфейс IContactsForm. Выводит на страницу отображение второго окна оформления заказа с указанием контактного email и телефона.
Сеттеры:
* set phone - присваивает значение поля ввода телефона;
* set email - присваивает значение поля ввода почты.

**5. Класс Modal**
Является основой для всех модальных окон на странице. 
Наследует Component, реализует интерфейс IModalData. Принимает HTML-элемент и добавляет его в модальное окно на странице.
Поля:  
closeButton - кнопка закрытия окна;  
content - cодержимое модального окна, получаемое в виде HTML-элемента.  

`constructor(container: HTMLElement, protected events: IEvents)` - конструктор принимает контейнер в виде HTML-элемента, а также событие. В конструкторе описываются элементы для отрисовки, которые присваиваются соответствующим полям карточки.  
На кнопку, контейнер и содержимое окна навешиваются слушатели по клику, чтобы реализовать закрытие окна по клику на кнопку и на оверлей. Так как закрытие осуществляется методом close, вызывается событие 'modal:close'.

Содержит методы работы с модальными окнами:
* open - открытие модального окна. Вызывает событие 'modal:open';
* close - закрытие модального окна. Вызывает событие 'modal:close';
* render - добавление опциональных данных в экземпляр класса и открытие окна методом open.

**6. Класс Success**
Наследует Component, реализует интерфейс ISuccess.
Отвечает за отрисовку окна подтверждения оформленного заказа.
Поля:  
total - сумма оформленного заказа,  
close - кнопка закрывающая окно.  

`constructor(container: HTMLElement, actions: ISuccessActions)` - конструктор принимает контейнер в виде HTML-элемента, а также событие. В конструкторе описываются элементы для отрисовки, которые присваиваются соответствующим полям карточки. На кнопку устанавливается слушатель по клику.  

 Сеттер set total - принимает сумму оформленного заказа для вывода ее в элементе поля total.

## Ключевые типы данных

//данные страницы для отрисовки  
interface IPage {  
    counter: number; //счетчик товаров в корзине  
    catalog: HTMLElement[]; //каталог товаров, массив HTML-элементов  
    locked: boolean; //заблокирована ли прокрутка на странице, true или false  
}

//данные карточки для отрисовки  
interface ICard<T> {  
    id: string; //id продукта;  
    category?: string; //категория продукта  
    description?: string | string[]; //описание товара  
    image?: string; //изображение товара  
    price: number | string; //цена товара  
    title: string; //название товара  
    index?: number; //индекс товара (для отображения карточки в корзине)  
    button: boolean; //кнопка товара - принимает массив данных id, среди которых находит или не находит товар в корзине  
}    

//данные корзины для отрисовки  
interface IBasketView {  
    items: HTMLElement[]; //массив HTML-элементов карточек с продуктами  
    total: number; //сумма заказа  
}

//данные каждого продукта
 interface IProduct {  
  category?: string; //категория продукта  
  description?: string; //описание товара  
  id: string; //id товара  
  image: string; //изображение товара  
  price: number | null; //цена товара  
  title: string; //название товара  
}  

//данные приложения  
interface IAppState {  
  catalog: IProduct[]; //каталог  
  basket: string[]; //корзина  
  preview: string | null; //превью  
  order: IOrder | null; //заказ  
}

//данные формы order    
interface IOrderForm {
  payment: string;
  address: string;
}

//данные формы contacts 
interface IContactsForm {
  email: string;
  phone: string;
}

//данные заказа  
interface IOrder extends IOrderForm, IContactsForm {  
  items: string[]; //товары в оформленном заказе  
  total: number; //финальная сумма заказа  
}

//ошибки для валидации форм  
type FormErrors = Partial<Record<keyof IOrder, string>>;   

//данные оформленного заказа  
interface IOrderResult {  
  id: string; //id заказа, отправленного на сервер  
}

//все события в приложении  

- 'items:show'; //вывод каталога с продуктами на страницу
- 'card:select'; //выбор карточки с продуктом
- 'preview:open'; //открытие модального окна с выбранной карточкой
- 'basket:open'; //открытие корзины
- 'card:add'; //добавление продукта в корзину
- 'card:delete'; //удаление продукта из корзины
- 'basket:changed'; //в корзину внесены изменения
- 'order:open'; //открыта форма оформления заказа
- 'payment:chosen'; //выбран метод оплаты заказа
- 'order:submit'; //подтверждены поля "метод оплаты" и "адрес"
- 'contacts:submit'; //подтверждена и отправлена на сервер форма оформления заказа
- 'orderFormErrors:change'; //изменилось состояние валидации формы 'order'
- 'contactsFormErrors:change'; //изменилось состояние валидации формы contacts
- /^order\..*:change/ ; //изменилось одно из полей формы 'order'
- /^contacts\..*:change/ ; //изменилось одно из полей формы 'contacts'
- 'modal:open'; //блокируем прокрутку страницы, если открыто модальное окно
- 'modal:close'; //разблокируем прокрутку страницы, если модальное окно не открыто



