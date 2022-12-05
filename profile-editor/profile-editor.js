import '../auth/user.js';
import { getProfile, getUser, uploadImage, upsertProfile } from '../fetch-utils.js';

const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const profileForm = document.getElementById('profile-form');
const updateButton = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');
const bioInput = profileForm.querySelector('[name="bio"]');

let error = null;
let profile = null;

const user = getUser();

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    console.log('response', response);
    error = response.error;
    profile = response.data;

    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        if (profile) {
            userNameInput.value = profile.username;
            if (profile.avatar_url) {
                preview.src = profile.avatar_url;
            }
            if (profile.bio) {
                bioInput.value = profile.bio;
            }
        }
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    updateButton.disabled = true;
    updateButton.textContent = 'Saving...';

    const formData = new FormData(profileForm);
    // intial profile object
    const profileObj = {
        username: formData.get('username'),
        bio: formData.get('bio'),
    };

    //get avatar file from form
    const imageFile = formData.get('avatar');
    //console.log('imageFile', imageFile);
    // do we have a file? then the size > 0
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;

        const url = await uploadImage(imagePath, imageFile);

        profileObj.avatar_url = url;
    }

    const response = await upsertProfile(profileObj);

    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateButton.disabled = false;
        updateButton.textContent = 'Update Profile';
    } else {
        location.assign('/');
    }
});

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    // if a file has been selected, we want to see the preview
    if (file) {
        // creates a string containing a URL representing the file object
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '/assets/avatar.jpeg';
    }
});
