import * as passwordService from "./renderer-api/password-service";
interface Crediential {
  username: string;
  password: string;
}

// "carbon:password"
const keyIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 16 16" fill="currentColor" enable-background="new 0 0 16 16" xml:space="preserve">
<g id="key_1_">
	<g>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M11,0C8.24,0,6,2.24,6,5c0,1.02,0.31,1.96,0.83,2.75l-6.54,6.54
			C0.11,14.47,0,14.72,0,15c0,0.55,0.45,1,1,1c0.28,0,0.53-0.11,0.71-0.29L3,14.41l1.29,1.29C4.47,15.89,4.72,16,5,16
			s0.53-0.11,0.71-0.29l2-2C7.89,13.53,8,13.28,8,13c0-0.28-0.11-0.53-0.29-0.71L6.41,11l1.83-1.83C9.04,9.69,9.98,10,11,10
			c2.76,0,5-2.24,5-5S13.76,0,11,0z M11,8c-0.23,0-0.45-0.03-0.66-0.08c-0.01,0-0.02-0.01-0.03-0.01C10.1,7.86,9.9,7.79,9.71,7.7
			C9.09,7.4,8.6,6.91,8.3,6.29C8.21,6.1,8.14,5.9,8.09,5.7c0-0.01-0.01-0.02-0.01-0.03C8.03,5.45,8,5.23,8,5c0-1.66,1.34-3,3-3
			s3,1.34,3,3S12.66,8,11,8z"/>
	</g>
</g>
</svg>
`;

// Ref to added unlock button.
let currentUnlockButton: HTMLDivElement | null = null;
let currentAutocompleteList: HTMLDivElement | null = null;

let bestUserNameField: HTMLInputElement | null = null;
let bestPasswordField: HTMLInputElement | null = null;

// Creates an unlock button element.
//
// - input: Input element to 'attach' unlock button to.
function createUnlockButton(input: HTMLInputElement): HTMLDivElement {
  var inputRect = input.getBoundingClientRect();
  var computedStyle = getComputedStyle(input);

  // Container.
  var unlockDiv = document.createElement("div");

  // Style.
  unlockDiv.style.width = "16px";
  unlockDiv.style.height = "16px";
  unlockDiv.style.zIndex = "999999999999999";

  // Position.
  unlockDiv.style.position = "absolute";
  unlockDiv.style.left =
    window.scrollX +
    (inputRect.left +
      inputRect.width -
      16 -
      parseFloat(computedStyle.paddingRight)) +
    "px";
  unlockDiv.style.top =
    window.scrollY + (inputRect.top + (inputRect.height - 16) / 2.0) + "px";

  // Button.
  var button = document.createElement("div");

  // Button style.
  button.style.width = "16px";
  button.style.height = "16px";
  button.style.opacity = "0.7";
  button.style.color = window.getComputedStyle(input).color;
  button.style.transition = "0.1s color";
  button.innerHTML = keyIcon;

  // Button hover.
  button.addEventListener("mouseenter", (event) => {
    button.style.opacity = "1.0";
  });
  button.addEventListener("mouseleave", (event) => {
    button.style.opacity = "0.7";
  });

  // Click event.
  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
    passwordService.requestAutofill();
  });

  unlockDiv.appendChild(button);

  return unlockDiv;
}

// Tries to find if an element has a specific attribute value that contains at
// least one of the values from 'matches' array.
function checkAttributes(
  element: HTMLInputElement,
  attributes: string[],
  matches: string[]
) {
  for (const attribute of attributes) {
    const value = element.getAttribute(attribute);
    if (value == null) {
      continue;
    }
    if (matches.some((match) => value.toLowerCase().includes(match))) {
      return true;
    }
  }
  return false;
}

function getAllInputsOfDocument() {
  const allFields = [
    ...(document.querySelectorAll("form input") || []),
    ...(document.querySelectorAll("input") || []),
  ] as HTMLInputElement[];
  return allFields;
}
// Gets all input fields on a page that contain at least one of the provided
// strings in their name attribute.
function getBestInput(
  names: string[],
  exclusionNames: string[],
  types: string[],
  sourceFields?: HTMLInputElement[]
) {
  const allFields = sourceFields || getAllInputsOfDocument();
  // this list includes duplicates, but we only use the first one we find that matches, so there's no need to dedupe

  for (const field of allFields) {
    // checkAttribute won't work here because type can be a property but not an attribute
    if (!types.includes(field.type)) {
      continue;
    }

    // We expect the field to have either 'name', 'formcontrolname' or 'id' attribute
    // that we can use to identify it as a login form input field.
    if (
      names.length === 0 ||
      checkAttributes(
        field,
        ["name", "formcontrolname", "id", "placeholder", "aria-label"],
        names
      )
    ) {
      if (
        !checkAttributes(
          field,
          ["name", "formcontrolname", "id", "placeholder", "aria-label"],
          exclusionNames
        ) &&
        field.type !== "hidden"
      ) {
        return field;
      }
    }
  }
  return null;
}

// Shortcut to get username fields from a page.
function getBestUsernameField() {
  return getBestInput(
    ["user", "name", "mail", "login", "auth", "identifier"],
    ["confirm", "filename"],
    ["text", "email"]
  );
}

// Shortcut to get password fields from a page.
function getBestPasswordField() {
  return getBestInput([], [], ["password"]);
}

// Removes credentials list overlay.
function removeAutocompleteList() {
  if (currentAutocompleteList && currentAutocompleteList.parentNode) {
    currentAutocompleteList.parentNode.removeChild(currentAutocompleteList);
  }
}

// Populates username/password fields with provided credentials.
function fillCredentials(credentials: Crediential) {
  const { username, password } = credentials;
  const inputEvents = ["keydown", "keypress", "keyup", "input", "change"];

  const usernameField = getBestUsernameField();
  if (usernameField) {
    usernameField.value = username;
    for (const event of inputEvents) {
      usernameField.dispatchEvent(new Event(event, { bubbles: true }));
    }
  }

  const passwordField = getBestPasswordField();
  if (passwordField) {
    passwordField.value = password;
    for (const event of inputEvents) {
      passwordField.dispatchEvent(new Event(event, { bubbles: true }));
    }
  }
}

// Setup a focus/click listener on the username input fields.
//
// When those events happen, we add a small overlay with a list of matching
// credentials. Clicking on an item in a list populates the input fields with
// selected username/password pair.
//
// - element: input field to add a listener to
// - credentials: an array of { username, password } objects
function addFocusListener(
  element: HTMLInputElement,
  credentials: Crediential[]
) {
  const inputRect = element.getBoundingClientRect();
  // Creates an options list container.
  function buildContainer() {
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.setAttribute(
      "style",
      "position: absolute; border: 1px solid #d4d4d4; z-index: 999999; border-bottom: none; background: #FFFFFF; transform: scale(0); opacity: 0; transform-origin: top left; transition: 0.15s; color: #000000;"
    );
    suggestionsDiv.style.top = inputRect.y + inputRect.height + "px";
    suggestionsDiv.style.left = inputRect.x + "px";
    suggestionsDiv.id = "password-autocomplete-list";
    requestAnimationFrame(function () {
      suggestionsDiv.style.opacity = "1";
      suggestionsDiv.style.transform = "scale(1)";
    });
    return suggestionsDiv;
  }

  // Adds an option row to the list container.
  function addOption(parent: HTMLDivElement, username: string) {
    const suggestionItem = document.createElement("div");
    suggestionItem.innerHTML = username;
    suggestionItem.setAttribute(
      "style",
      "padding: 10px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4;"
    );

    // Hover.
    suggestionItem.addEventListener("mouseenter", (event) => {
      suggestionItem.style.backgroundColor = "#e4e4e4";
    });
    suggestionItem.addEventListener("mouseleave", (event) => {
      suggestionItem.style.backgroundColor = "#fff";
    });

    // When user clicks on the suggestion, we populate the form inputs with selected credentials.
    suggestionItem.addEventListener("click", function (e) {
      const selectedCredentials = credentials.filter((el) => {
        return el.username === username;
      })[0];
      fillCredentials(selectedCredentials);
      removeAutocompleteList();
      element.focus();
    });

    parent.appendChild(suggestionItem);
  }

  // Creates autocomplete list and adds it below the activated field.
  function showAutocompleteList() {
    removeAutocompleteList();
    const container = buildContainer();
    for (const cred of credentials) {
      addOption(container, cred.username);
    }
    document.body.appendChild(container);
    currentAutocompleteList = container;
  }

  element.addEventListener("focus", showAutocompleteList);
  element.addEventListener("click", showAutocompleteList);

  // Hide options overlay when user clicks out of the input field.
  document.addEventListener("click", function (e) {
    if (e.target !== element) {
      removeAutocompleteList();
    }
  });

  // Show the autocomplete list right away if field is already focused.
  // Userful for login pages which auto-focus the input field on page load.
  if (element === document.activeElement) {
    showAutocompleteList();
  }
}

function addAutofillButton(target: Element) {
  if (!(target instanceof Node)) return;
  if (
    bestUserNameField?.isSameNode(target) ||
    bestPasswordField?.isSameNode(target)
  ) {
    const unlockButton = createUnlockButton(target as HTMLInputElement);
    document.body.appendChild(unlockButton);

    currentUnlockButton = unlockButton;
  }
}

function requestAutofill() {
  if (isEligibleForAutofill()) {
    passwordService.requestAutofill();
  }
}

// Handle credentials fetched from the backend. Credentials are expected to be
// an array of { username, password, manager } objects.
passwordService.onAutoFillMatch((data) => {
  if (data.domain !== window.location.hostname) {
    throw new Error("password origin must match current page origin");
  }

  if (data.credentials.length === 0) {
    if (currentUnlockButton && currentUnlockButton.children.length > 0) {
      (currentUnlockButton.children[0] as HTMLDivElement).style.color =
        "rgb(180, 0, 0)";
    }
  } else if (data.credentials.length === 1) {
    fillCredentials(data.credentials[0]);
    const firstPasswordField = getBestPasswordField();
    if (firstPasswordField) {
      firstPasswordField.focus();
    }
  } else {
    const firstField = getBestUsernameField();
    if (firstField) {
      addFocusListener(firstField, data.credentials);
      firstField.focus();
    }
  }
});

// send passwords back to the main process so they can be saved to storage
function handleFormSubmitted() {
  const usernameValue = bestUserNameField?.value;
  const passwordValue = bestPasswordField?.value;

  if (
    usernameValue &&
    usernameValue.length > 0 &&
    passwordValue &&
    passwordValue.length > 0
  ) {
    passwordService.formFilled({
      domain: window.location.hostname,
      username: usernameValue,
      password: passwordValue,
    });
  }
}

const inputAdditionObserver = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type !== "childList") {
      continue;
    }

    const addedInputNodes = Array.from(mutation.addedNodes).filter(
      (node) =>
        node instanceof Element && node.querySelectorAll("input").length > 0
    );
    if (addedInputNodes.length > 0) {
      identifyUsernameAndPasswordFields();
      requestAutofill();
      return;
    }
  }
});

const inputRemovalObserver = new MutationObserver((mutationList) => {
  if (!isEligibleForAutofill()) {
    return;
  }

  const credetialFieldsRemoved =
    !document.body.contains(bestUserNameField) &&
    !document.body.contains(bestPasswordField);
  console.log("CredetialFields removed:" + credetialFieldsRemoved);
  if (credetialFieldsRemoved) {
    handleFormSubmitted();
  }
});

// require both a username and a password field to reduce the false-positive rate
function isEligibleForAutofill() {
  return !!bestUserNameField && !!bestPasswordField;
}

function identifyUsernameAndPasswordFields(): boolean {
  const userNameField = getBestUsernameField();
  const passwordField = getBestPasswordField();
  if (!userNameField || !passwordField) {
    return false;
  }
  bestUserNameField = userNameField;
  bestPasswordField = passwordField;
  return true;
}

export default function initializePasswordFill() {
  function handleFocus(event: FocusEvent) {
    identifyUsernameAndPasswordFields();
    addAutofillButton(event.target as Element);
  }

  function handleBlur() {
    if (
      currentUnlockButton !== null &&
      currentUnlockButton.parentElement != null
    ) {
      currentUnlockButton.parentElement.removeChild(currentUnlockButton);
      currentUnlockButton = null;
    }
  }

  // Add default focus event listeners.
  window.addEventListener("blur", handleBlur, true);
  window.addEventListener("focus", handleFocus, true);

  // Start observing the DOM for the new inputs
  inputAdditionObserver.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  inputRemovalObserver.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  addEventListener("beforeunload", () => {
    console.log("Before unload:", isEligibleForAutofill());
    handleFormSubmitted();
  });

  identifyUsernameAndPasswordFields();
  requestAutofill();

  if (document.activeElement) {
    addAutofillButton(document.activeElement);
  }
}
