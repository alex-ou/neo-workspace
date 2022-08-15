import {
  H3,
  Overlay,
  Classes,
  Card,
  Dialog,
  Button,
  FormGroup,
  InputGroup,
  Icon,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useMemo, useState } from "react";

export default function AddPassword(props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [domain, setDomain] = useState<string>();
  const [username, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const enableSaving = useMemo(
    () => domain && username && password,
    [domain, username, password]
  );

  return (
    <Dialog
      canOutsideClickClose={false}
      isOpen={props.open}
      onClose={props.onClose}
      title={"Add password"}
      portalContainer={document.getElementById("root")!}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label={"Website URL"} labelFor="domain">
          <InputGroup
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="ex:neonav.co"
          ></InputGroup>
        </FormGroup>
        <FormGroup label={"Username"} labelFor="username">
          <InputGroup
            value={username}
            id="username"
            onChange={(e) => setUserName(e.target.value)}
          ></InputGroup>
        </FormGroup>
        <FormGroup
          label={"Password"}
          labelFor="password"
          helperText="Make sure the password you save here matches your password for the website."
        >
          <InputGroup
            rightElement={
              <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`}>
                <Button
                  minimal
                  icon={showPassword ? "eye-off" : "eye-open"}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </Tooltip2>
            }
            type={showPassword ? "text" : "password"}
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          ></InputGroup>
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={!enableSaving}
            intent="primary"
            onClick={() => {
              if (!username || !domain || !password) {
                return;
              }
              window.neonav.passwordService
                .saveCredential({
                  domain,
                  username,
                  password,
                })
                .then(() => props.onSave());
            }}
          >
            Save
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  );
}
