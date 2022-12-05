import '../auth/user.js';
import { upsertProfile } from '../fetch-utils.js';

const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const profileForm = document.getElementById('profile-form');
const updateButton = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);
    // intial profile object
    const profile = {
        username: formData.get('username'),
        bio: formData.get('bio'),
    };
    await upsertProfile(profile);
});
