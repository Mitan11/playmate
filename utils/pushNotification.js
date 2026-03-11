import admin from "firebase-admin";
import serviceAccount from "../config/pushNotification.json" with { type: "json" };

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
        token : registrationToken || process.env.FCM_TOKEN,
        notification: {
            title: title,
            body: body,
        },
    };

    return messaging.send(message);
};