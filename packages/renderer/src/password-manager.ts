import { settings } from "./store/settings";
import { CapturePasswordDetail } from "./types";

const { passwordService } = window.neonav;

export function formatDomain(domain: string) {
  if (domain.startsWith("www.")) {
    return domain.slice(4);
  }
  return domain;
}

function getDomainFromUrl(url: string) {
  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch (_) {}

  return formatDomain(domain);
}

export function getDomainCredentials(domain: string) {
  return passwordService.getCredentials().then((credentials) => {
    return credentials.filter((c) => getDomainFromUrl(c.domain) === domain);
  });
}

export function handleAutoFillRequest(
  id: string,
  data: any,
  frameId: string,
  frameUrl: string
) {
  const hostname = new URL(frameUrl).hostname;

  const formattedHostname = formatDomain(hostname);

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
}

export function handleFormFilled(
  id: string,
  data: any,
  frameId: string,
  frameUrl: string
) {
  console.log("onFormFill", id, data, frameId, frameUrl);
  if (
    !settings.getPasswordNeverSaveDomains().includes(formatDomain(data.domain))
  ) {
    document.dispatchEvent(
      new CustomEvent<CapturePasswordDetail>("capturepassword", {
        detail: { viewId: id, data },
      })
    );
  }
}
