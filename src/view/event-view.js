import { humanizeDate, getDateDifference } from '../utils.js';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';
import { DATE_FORMAT_DAY, DATE_FORMAT_HOURS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function getEventTypeOffer(event) {
  return mockOffers.find((offer) => offer.type === event.type);
}

function getEventOffers(event) {
  const eventTypeOffer = getEventTypeOffer(event);
  return eventTypeOffer.offers.filter((offer) => event.offers.includes(offer.id));
}

function getEventDestination(event) {
  return mockDestinations.find((destination) => destination.id === event.destination);
}

function createEventOffersTemplate(event) {
  const offersTemplate = event.offers
    ? `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getEventOffers(event).map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
    ` : '';

  return offersTemplate;
}

function createEventTemplate(event) {
  const {type, basePrice, dateFrom, dateTo, isFavorite} = event;

  const offersTemplate = createEventOffersTemplate(event);

  const destination = getEventDestination(event);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${humanizeDate(dateFrom, DATE_FORMAT_DAY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizeDate(dateFrom, DATE_FORMAT_HOURS)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizeDate(dateTo, DATE_FORMAT_HOURS)}</time>
          </p>
          <p class="event__duration">${getDateDifference(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${offersTemplate}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class EventView extends AbstractView {
  #event = null;
  #handleClick = null;

  constructor({event, onClick}) {
    super();
    this.#event = event;
    this.#handleClick = onClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
