var webPush = require('web-push');

const vapidKeys = {
    publicKey: "BCqVZAzUfNbbVmlOFdkf_YvfH20bn1pNqdLxK3rBxhUa1RkRcNI5kT594THsVK5tWBR0oHoUC5g-tVPeeamgf7U",
    privateKey: "lonc9KbzOcnpRY6ZL9d3_xUWvWpwYFTU4EqUB5nRZyU"
}

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fRcCzYMXktk:APA91bFDnARSCa9wYaw0K0sgd8HN4gR0bGD8CIgfYeHwA8rwv4J1vqrf8jW7RQ4ogt5vOB7LGYym9nvSdofvjaFdlWtqPBP6tZna-lDBKCB83lbdveHJORy1ytYWWbPRytgGak9eAutv",
    "keys": {
        "p256dh": "BETYYphXPDa4u8z7KCFZVRc6AT/2bTTgDZVYGvjJVyPGaYxlRKoLX7lT8tAye3KQyS0MBzU9PRvGuP9zFjAaGCY=",
        "auth": "eWf5ZayuglvSSpaqzWKGNg=="
    }
};
var payload = "Ada Jadwal pertandingan baru!";

var options = {
    gcmAPIKey: '179823995518',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);