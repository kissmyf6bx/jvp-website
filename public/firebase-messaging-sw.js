self.addEventListener(
  "push",
  (event) => {

    const data =
      event.data?.json() || {};

    const title =
      data.notification?.title ||
      "Notification";

    const options = {

      body:
        data.notification?.body ||
        "",

      icon:
        "/jvp-logo.png",

    };

    event.waitUntil(

      self.registration.showNotification(
        title,
        options
      )

    );

  }
);