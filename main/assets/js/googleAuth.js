export async function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    verifyToken(id_token).then(() => {
        window.location.href = "/home.html"; // Redirect to a new page after successful sign-in
    }).catch(error => {
        console.error("Error verifying token: ", error);
    });
}
