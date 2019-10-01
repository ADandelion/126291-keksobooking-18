'use strict';

var NUMBER_ADS = 0;
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var TIME_CHECKIN = ['12:00', '13:00', '14:00'];
var TIME_CHECKOUT = ['12:00', '13:00', '14:00'];
var HOUSE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var HOUSE_TITTLE = ['Красивый дома на берегу моря', 'Квартира в центре города', 'Апартаменты в живописном месте '];
var HOUSE_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var advertisments = [];

var markLists = document.querySelector('.map__pins');
var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapWidth = document.querySelector('.map').offsetWidth;

// Возвращает случайный элемент из массива
var getRandomIntegerInArray = function (arr) {
  var randInteger = Math.floor(Math.random() * arr.length);
  for (var i = 0; i < arr.length; i++) {
    var randElement = arr[randInteger];
  }

  return randElement;
};

// Случайное число в диапозне
function randomIntegerRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Случайное кол-во строк из массива
var randomArrayLength = function (arrLength) {
  var arr = [];
  var number = arrLength.length;
  for (var i = 0; i < randomIntegerRange(1, number); i++) {
    arr.push(arrLength[i]);
  }

  return arr;
};

// Собирает объекты в массив
var getAllSimilarAds = function (obj) {
  for (var j = 0; j < NUMBER_ADS; j++) {
    obj.push({
      'author': {
        'avatar': 'img/avatars/user0' + (j + 1) + '.png'
      },
      'offer': {
        'tittle': getRandomIntegerInArray(HOUSE_TITTLE),
        'address': '' + randomIntegerRange(location.x, mapWidth) + ', ' + randomIntegerRange(location.y, location.y),
        'price': randomIntegerRange(10000, 50000),
        'type': getRandomIntegerInArray(TYPE_OF_HOUSING),
        'rooms': randomIntegerRange(1, 3),
        'guests': randomIntegerRange(1, 5),
        'checkin': getRandomIntegerInArray(TIME_CHECKIN),
        'checkout': getRandomIntegerInArray(TIME_CHECKOUT),
        'features': randomArrayLength(HOUSE_FEATURES),
        'description': getRandomIntegerInArray(HOUSE_TITTLE),
        'photos': randomArrayLength(HOUSE_PHOTO)
      },
      'location': {
        'x': randomIntegerRange(25, (mapWidth - 30)),
        'y': randomIntegerRange(130, 630)
      }
    });
  }

  return advertisments;
};

getAllSimilarAds(advertisments);

// Рендер марок на карте
var renderMarks = function (mark) {
  var markElement = markTemplate.cloneNode(true);

  markElement.style.left = '' + (mark.location.x - 25) + 'px';
  markElement.style.top = '' + (mark.location.y - 70) + 'px';
  markElement.querySelector('img').src = mark.author.avatar;
  markElement.querySelector('img').alt = mark.offer.tittle;

  return markElement;
};

// Создаем DOM элементы
var addMarksList = function (marksList, marksArr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_ADS; i++) {
    fragment.appendChild(renderMarks(marksArr[i]));
  }

  return marksList.appendChild(fragment);
};


// НЕАКТИВНОЕ И АКТИВНОЕ СОСТОЯНИЕ (MODULE4-TASK2)
var KEYCODES = {
  'ENTER': 13
};

var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var adsForm = document.querySelector('.ad-form');


var pressEnterActivePage = function (evt) {
  if (evt.keyCode === KEYCODES.ENTER) {
    activePageStateHandler();
    document.addEventListener('DOMContentLoaded', inactivePageStateHandler);

  }
};

var inactivePageStateHandler = function () {
  addAllFieldsetDisable();
  addClassMapFaded();
  addClassAdsFormDisabled();
};

var activePageStateHandler = function () {
  document.addEventListener('DOMContentLoaded', inactivePageStateHandler);
  removeClassMapFaded();
  removeAllFieldsetDisable();
  removeClassAdsFormDisabled();
  addMarksList(markLists, advertisments);


};

// Задает всем тэгам Fieldset атрибут disabled
var addAllFieldsetDisable = function () {
  var allFieldset = document.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < allFieldset.length; i++) {
    allFieldset[i].setAttribute('disabled', 'disabled');
  }

  return allFieldset;
};

// Удаляет всем тэгам Fieldset атрибут disabled
var removeAllFieldsetDisable = function () {
  var allFieldset = document.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < allFieldset.length; i++) {
    allFieldset[i].removeAttribute('disabled', 'disabled');
  }

  return allFieldset;
};

// Задает карте класс .map--faded
var addClassMapFaded = function () {
  return map.classList.add('map--faded');
};


// Удаляет карте класс .map--faded
var removeClassMapFaded = function () {
  return map.classList.remove('map--faded');
};


// Добавляет у формы объявления класс .ad-form--disabled
var addClassAdsFormDisabled = function () {
  return adsForm.classList.add('ad-form--disabled');
};


// Удаляет у формы объявления класс .ad-form--disabled
var removeClassAdsFormDisabled = function () {
  return adsForm.classList.remove('ad-form--disabled');
};


// Задает карте статус .map--faded и всем полям Fieldset внутри клаccа .ad-form атрибут disabled
document.addEventListener('DOMContentLoaded', inactivePageStateHandler);


// Задаем статус Активный странице клавишей ENTER, если фокус находится на Метке
document.addEventListener('keydown', pressEnterActivePage);


// Событий при нажатии на Главную метку
mainPin.addEventListener('mousedown', activePageStateHandler);

