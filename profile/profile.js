import {
    createMessage,
    decrementStars,
    getProfile,
    getProfileById,
    getUser,
    incrementStars,
    onMessage,
} from '../fetch-utils.js';
import { renderMessages } from '../render-utils.js';

const imgEl = document.querySelector('#avatar-img');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.profile-detail');
const messageForm = document.querySelector('.message-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');

window.addEventListener('load', async () => {
    //Error Handling!!
    if (!id) {
        //  No id found, redirect back to room list
        location.assign('/');
        // don't run the rest of the code in the function
        return;
    }
    fetchAndDisplayProfile();

    onMessage(id, async (payload) => {
        console.log('payload', payload);
        fetchAndDisplayProfile();
    });
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // - get user's form input values
    const data = new FormData(messageForm);
    // - check sender user has profile info
    // call getUser to grab the user object of the currently logged in user
    const user = getUser();
    //console.log('user', user);
    // passing the user.id into getProfile to check if there is an associated profile
    const senderProfile = await getProfile(user.id);
    // if theres not a profile associated with the logged in user...
    if (!senderProfile) {
        // send an alert and redirect the user
        alert('You must make your profile before you can message anyone');
        location.assign('/');
    } else {
        // if there IS a profile for the logged in user in our profiles table
        // - send message to supabase
        await createMessage({
            // text value is coming from form data
            text: data.get('message'),
            // sender value is taking the logged in user and looking at the data.username on it
            sender: senderProfile.data.username,
            // recp id value is coming from our URL search params (line 16)
            recipient_id: id,
            // user id is coming from our getUser function - the logged in user
            user_id: user.id,
        });
        //- reset form
        messageForm.reset();
    }
    //- (before we implement realtime) call our fetch&Display function
    // await fetchAndDisplayProfile();
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfileById(id);
    // console.log('profile', profile);
    imgEl.src = profile.avatar_url;
    usernameHeaderEl.textContent = profile.username;

    const profileStars = renderStars(profile);
    const messagesList = renderMessages(profile);

    profileDetailEl.append(profileStars, messagesList);
}

function renderStars({ stars, username, id }) {
    const p = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');

    const profileStars = document.createElement('div');

    profileStars.classList.add('profile-stars');
    profileStars.append(p, upButton, downButton);

    downButton.textContent = 'downvote user ⬇️';
    upButton.textContent = 'upvote user ⬆️';
    p.classList.add('profile-name');

    p.textContent = `${username} has ${stars} ⭐️`;

    downButton.addEventListener('click', async () => {
        await decrementStars(id);
        await fetchAndDisplayProfile();
    });
    upButton.addEventListener('click', async () => {
        await incrementStars(id);
        await fetchAndDisplayProfile();
    });

    return profileStars;
}
