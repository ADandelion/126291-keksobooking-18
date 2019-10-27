'use strict';

var KEYCODES = {
  'ENTER': 13,
  'ESC': 27
};
var NUMBER_ADS = 8;
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var TIME_CHECKIN = ['12:00', '13:00', '14:00'];
var TIME_CHECKOUT = ['12:00', '13:00', '14:00'];
var HOUSE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var HOUSE_TITTLE = ['Красивый дома на берегу моря', 'Квартира в центре города', 'Апартаменты в живописном месте '];
var HOUSE_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var advertisments = [];

var markLists = document.querySelector('.map__pins');
var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var markInfoTemplate = document.querySelector('#card').content.querySelector('.map__card');
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
      },
      'dataId': j
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
  markElement.setAttribute('data-id', mark.dataId);

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


// Рендер информации об объявлениях на карте
var renderInfoMarks = function (markInfoObj, markId) {
  var markInfoElement = markInfoTemplate.cloneNode(true);
  var closeInfoPopCard = markInfoElement.querySelector('.popup__close');

  markInfoElement.querySelector('.popup__avatar').src = markInfoObj .author.avatar;
  markInfoElement.querySelector('.popup__title').textContent = markInfoObj.offer.tittle;

  closeInfoPopCard.addEventListener('click', function () {
    markInfoElement.remove();
  });

  if (markInfoElement) {
    document.addEventListener('keydown', function (evt) {
      markInfoElement.focus();
      pressEnterCloseInfoCardHandler(evt, markInfoElement);
    });

    document.addEventListener('keydown', function (evt) {
      pressEscCloseInfoCardHandler(evt, markInfoElement);
    });
  } else {
    window.removeEventListener('keydown', pressEscCloseInfoCardHandler);
  }


  return markInfoElement;
};


var pressEnterCloseInfoCardHandler = function (evt, card) {
  if (evt.keyCode === KEYCODES.ENTER) {
    closeCardInfo(card);

  }
};

var pressEscCloseInfoCardHandler = function (evt, card) {
  if (evt.keyCode === KEYCODES.ESC) {
    closeCardInfo(card);
  }

};

var closeCardInfo = function (cardElement) {
  cardElement.remove();
};


// Создаем DOM элементы
var addMarksInfoList = function (marksInfoList, marksArr, index) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderInfoMarks(marksArr[index]));

  return marksInfoList.appendChild(fragment);
};


// НЕАКТИВНОЕ И АКТИВНОЕ СОСТОЯНИЕ (MODULE4-TASK2)
var DEFAULT_COORDINATES = [570, 375];
var LENGTH_TITLE = {
  'MIN': 30,
  'MAX': 100
};

var mainPin = document.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapOverlay = document.querySelector('.map__overlay');
var addressInput = document.getElementById('address');
var adsForm = document.querySelector('.ad-form');
var fieldCapacity = adsForm.querySelector('#capacity');
var fieldRoom = adsForm.querySelector('#room_number');
var fieldTitle = adsForm.querySelector('#title');


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
  addressInput.value = DEFAULT_COORDINATES;
};

var activePageStateHandler = function () {
  document.removeEventListener('DOMContentLoaded', inactivePageStateHandler);
  removeClassMapFaded();
  removeAllFieldsetDisable();
  removeClassAdsFormDisabled();
  addMarksList(markLists, advertisments);

  map.addEventListener('mousemove', function (event) {
    addressInput.value = ((event.clientX - 25) + ',' + ' ' + (event.clientY - 70));
  });
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

// Валидация полей ROOM и CAPACITY
var compareFieldsRoomCapacityHandler = function (target) {
  fieldRoom.setCustomValidity('');
  fieldCapacity.setCustomValidity('');

  if (fieldCapacity.value !== '0' && fieldRoom.value === '100') {
    target.setCustomValidity('Для 100 комнат выбрать опцию "Не для гостей"');
  } else if (fieldRoom.value !== '100' && fieldCapacity.value === '0') {
    target.setCustomValidity('Для опцию "Не для гостей" выбрать опцию "100 комнат"');
  } else if (fieldRoom.value < fieldCapacity.value) {
    target.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат');
  }
};

// Валидация поля TIITLE
var fieldTitleValidityHandler = function (event) {
  fieldTitle.setCustomValidity('');

  if (fieldTitle.value.length < 30) {
    fieldTitle.setCustomValidity('Сука! мало бУКАВ');
  } else if (fieldTitle.value.length > 100) {
    fieldTitle.setCustomValidity('Сука! МНОГО бУКАВ');
  } else if (!fieldTitle.value ) {
    fieldTitle.setCustomValidity('Сука!');
  }
};


// Карточки объявлений (MODULE4-TASK2)
var markDataId = function (targetMark, arrAdds) {
  if (targetMark.parentElement.hasAttribute('data-id') && arrAdds.indexOf(targetMark.parentElement.hasAttribute('data-id'))) {
    addMarksInfoList(markLists, arrAdds, targetMark.parentElement.getAttribute('data-id'));
  }
};


// Задает карте статус .map--faded и всем полям Fieldset внутри клаccа .ad-form атрибут disabled
document.addEventListener('DOMContentLoaded', inactivePageStateHandler);


// Задаем статус Активный странице клавишей ENTER, если фокус находится на Метке
document.addEventListener('keydown', pressEnterActivePage);


// Событий при нажатии на Главную метку
mainPin.addEventListener('mousedown', activePageStateHandler);


// Валидация полей Комнаты и Гостей
adsForm.addEventListener('change', function () {
  var theTarget = event.target;
  compareFieldsRoomCapacityHandler(theTarget);
});


// Валидация поля TITLE

fieldTitle.addEventListener('input', function (event) {
  fieldTitleValidityHandler(event);
});


// Открываем информация по объявлению
mapPins.addEventListener('click', function (evt) {
  var target = evt.target;
  markDataId(target, advertisments);
});
