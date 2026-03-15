import admin from "firebase-admin";

// Build service account object from environment variables
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const messaging = admin.messaging();

export const sendPushNotification = async (registrationToken = process.env.FCM_TOKEN, title = "PlayMate", body = "Test notification from PlayMate", data = {}) => {
    const token = registrationToken;

    if (!token) {
        throw new Error("FCM token is required. Pass registrationToken or set FCM_TOKEN.");
    }

    const message = {
        token: token,
        notification: {
            title: title,
            body: body,
        },
        data: data,
    };

    return messaging.send(message);
};