export interface CapturePasswordDetail {
  viewId: string;
  data: { domain: string; username: string; password: string };
}

const passwordService = window.neonav.passwordService;

export function formatedDomain(domain: string) {
  if (domain.startsWith("www.")) {
    return domain.slice(4);
  }
  return domain;
}

export function getDomainCredentials(domain: string) {
  return passwordService
    .getCredentials()
    .then((credentials) => credentials.filter((c) => c.domain === domain));
}

export function initialize() {
  passwordService.onAutoFill((id, data, frameId, frameUrl) => {
    const hostname = new URL(frameUrl).hostname;

    const formattedHostname = formatedDomain(hostname);

    console.log("onAutoFill", id, formattedHostname);

    getDomainCredentials(formattedHostname)
      .then((credentials) => {
        console.log("found credential count", credentials.length);

        if (credentials && credentials.length > 0) {
          passwordService.autofillMatched({
            id,
            frameId: frameId,
            frameUrl,
            data: {
              domain: hostname,
              credentials,
            },
          });
        }
      })
      .catch((e) => {
        console.error("Failed to get password suggestions: " + e.message);
      });
  });
  passwordService.onFormFilled((id, data, frameId, frameUrl) => {
    console.log("onFormFill", id, data, frameId, frameUrl);
    document.dispatchEvent(
      new CustomEvent<CapturePasswordDetail>("capturepassword", {
        detail: { viewId: id, data },
      })
    );
  });
}
