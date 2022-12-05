const SUPABASE_URL = 'https://vmhclpevfecxhpxwubhs.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaGNscGV2ZmVjeGhweHd1YmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI5Nzk4MzgsImV4cCI6MTk2ODU1NTgzOH0.pWvGlCrbKNRZWBKDRsPR8rGxu8nodj7nq8cY1rPNglI';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

//upsertProfile
export async function upsertProfile(profile) {
    const response = await client
        .from('profiles')
        .update(profile)
        .match({ user_id: profile.user_id })
        .single();
    console.log('response- upsert', response);
    return checkError(response);
}
// add in a create function to create the profile for each user

//uploadImage
export async function uploadImage(imagePath, imageFile) {
    // use the storage bucket to upload the image to and then use it to get the public URL
    const bucket = client.storage.from('avatars');

    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // we want to replace and existing file with same name
        upsert: true,
    });

    if (response.error) {
        return null;
    }
    // construct the url to the image
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;

    return url;
}

export async function getProfile(user_id) {
    const response = await client.from('profiles').select('*').match({ user_id });
    // ({ user_id }) = ({user_id : user_id})
    return response;
}

// export async function getProfileById(id) {
//     const response = await client.from('profile').select('*').match({ id }).single();
//     return checkError(response);
// }

// export async function getProfiles() {
//     const response = await client.from('profile').select();
//     return checkError(response);
// }

function checkError(response) {
    return response.error ? console.error(response.error) : response.data;
}
