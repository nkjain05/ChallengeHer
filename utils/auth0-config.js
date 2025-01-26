// auth0-config.js
export const auth0Config = {
    domain: "dev-zli6ahhso5vzdgia.us.auth0.com",  // Replace with your Auth0 domain
    clientId: "Qyb1kftJcuUeX0PP8UsQ5YbuutLF4Bb7",    // Replace with your Auth0 client ID
    redirectUri: typeof window !== "undefined" && window.location.origin,
  };