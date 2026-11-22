import { getNetWorthColor } from '../../../utils/netWorth';
import styles from './Tile.module.css';

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function createPhotoFallback(person) {
  const fallback = createTextElement('div', styles.photoFallback, getInitials(person.name));
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', person.name);
  return fallback;
}

function createPhotoElement(person) {
  if (!person.photo) {
    return createPhotoFallback(person);
  }

  const photo = document.createElement('img');
  photo.className = styles.photo;
  photo.src = person.photo;
  photo.alt = person.name;
  photo.draggable = false;
  photo.addEventListener('error', () => photo.replaceWith(createPhotoFallback(person)), {
    once: true,
  });
  return photo;
}

export function createTileElement(person) {
  const tile = document.createElement('div');
  tile.className = styles.tile;
  tile.style.setProperty('--tile-color', getNetWorthColor(person.netWorth));

  const header = document.createElement('div');
  header.className = styles.header;
  header.append(
    createTextElement('span', styles.country, person.country),
    createTextElement('span', styles.age, String(person.age)),
  );

  tile.append(
    header,
    createPhotoElement(person),
    createTextElement('div', styles.name, person.name),
    createTextElement('div', styles.interest, person.interest),
  );

  return tile;
}
