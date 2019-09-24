'use strict';

var NUMBER_ADS = 8;
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var TIME_CHECKIN = ['12:00', '13:00', '14:00'];
var TIME_CHECKOUT = ['12:00', '13:00', '14:00'];
var HOUSE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADS_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var HOUSE_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                   'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                   'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var advertisments = [];


var mapFilters = document.querySelector('.map').classList.remove('map--faded');

var markLists = document.querySelector('.map__pins');
var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');


// Возвращает случайный элемент из массива
var getRandomInteger = function (arr) {
  var randInteger = Math.floor(Math.random() * arr.length);
  for (var i = 0; i < arr.length; i++) {
    var randElement = arr[randInteger];
  }

  return randElement;
};

// Случайное число в диапозне
var randomIntegerRange = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);

  return rand;
};

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
var getAllSimilarAds = function (fnRandomInteger, fnRandomArrayLength, fnRandomIntegerRange) {
  for (var j = 0; j < NUMBER_ADS; j++) {
    advertisments.push({
      "author":{
        "avatar": 'img/avatars/user0' + (j + 1) + '.png'
      },
      "offer": {
        "tittle": 'Сдаю хату',
        "address": '600, 300',
        "price": '150',
        "type": fnRandomInteger(TYPE_OF_HOUSING),
        "rooms": '3',
        "guests": '2',
        "checkin": fnRandomInteger(TIME_CHECKIN),
        "checkout": fnRandomInteger(TIME_CHECKOUT),
        "features": fnRandomArrayLength(HOUSE_FEATURES),
        "description": 'Красивый дом у моря',
        "photos": fnRandomArrayLength(HOUSE_PHOTO )
      },
      "location": {
        "x": fnRandomIntegerRange(130, 630),
        "y": fnRandomIntegerRange(130, 630)
      }
    });
  }

  return advertisments;
};

getAllSimilarAds(getRandomInteger, randomArrayLength, randomIntegerRange);

// Рендер марок на карте
var renderMarks = function (mark) {
  var markElement = markTemplate.cloneNode(true);

  markElement.style.left = '' + (mark.location.x) + 'px';
  markElement.style.top = '' + (mark.location.x) + 'px';
  markElement.querySelector('img').src = mark.author.avatar;
  markElement.querySelector('img').alt =  mark.offer.tittle;

  return markElement;
};

// Создаем DOM элементы
var addMarksList = function (marksList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_ADS; i++) {
    fragment.appendChild(renderMarks(advertisments[i]));

  }

  return marksList.appendChild(fragment);
};


addMarksList(markLists);

