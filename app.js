/* Imports */
import './auth/user.js';
import { getProfiles } from './fetch-utils.js';
import { renderProfile } from './render-utils.js';

/* Get DOM Elements */
const listEl = document.querySelector('.list');

/* State */

/* Events */
window.addEventListener('load', async () => {
    fetchAndDisplayProfiles();
});

/* Display Functions */
async function fetchAndDisplayProfiles() {
    listEl.textContent = '';

    const profiles = await getProfiles();

    for (let profile of profiles) {
        const profileEl = renderProfile(profile);
        listEl.append(profileEl);
    }
}
