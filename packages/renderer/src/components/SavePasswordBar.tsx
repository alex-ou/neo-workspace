import { Button, InputGroup } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { css } from "@emotion/css";
import React, { useState } from "react";
import { getDomainCredentials, formatedDomain } from "../password-manager";
import { settings } from "../store/settings";
import { CapturePasswordDetail } from "../types";
const passwordService = window.neonav.passwordService;

export default function SavePasswordBar({
  viewId,
  onClose,
  onOpen,
}: {
  viewId?: string;
  onClose: () => void;
  onOpen: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const [domain, setDomain] = useState<string>();
  const [username, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();

  React.useEffect(() => {
    const listener = (e: CustomEvent<CapturePasswordDetail>) => {
      if (e.detail.viewId !== viewId) {
        return;
      }
      const data = e.detail.data;
      const formattedDomain = formatedDomain(data.domain);
      getDomainCredentials(formattedDomain).then((credentials) => {
        const alreadyExists = credentials.some(
          (c) => c.username === data.username && c.password === data.password
        );
        if (!alreadyExists) {
          setUserName(data.username);
          setPassword(data.password);
          setDomain(formattedDomain);
          onOpen();
        }
      });
    };
    document.addEventListener("capturepassword", listener);
    return () => document.removeEventListener("capturepassword", listener);
  }, [viewId]);
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        padding: 4px;
        height: calc(100% - 2px);
        transition: height 250ms;
        background: white;
        box-shadow: 0 1px 1px rgba(17, 20, 24, 0.15);
        .bp4-dark & {
          background: #383e47;
          box-shadow: 0 1px 1px rgb(17 20 24 / 40%);
        }
        margin-bottom: 2px;

        > * {
          margin-right: 8px;
        }
        button:not(bp4-minimal) {
          min-width: 40px;
        }
      `}
    >
      <span>Save password?</span>
      <InputGroup
        value={username}
        type="text"
        onChange={(e) => setUserName(e.target.value)}
      ></InputGroup>
      <InputGroup
        value={password}
        type={showPassword ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
      ></InputGroup>
      <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`}>
        <Button
          minimal
          icon={showPassword ? "eye-off" : "eye-open"}
          onClick={() => setShowPassword((v) => !v)}
        />
      </Tooltip2>
      <Button
        intent="primary"
        onClick={() => {
          if (username && password && domain) {
            passwordService.saveCredential({ username, password, domain });
            onClose();
          }
        }}
      >
        Save
      </Button>
      <Button
        onClick={() => {
          settings.setPasswordNeverSaveDomains(
            settings.getPasswordNeverSaveDomains().concat(domain!)
          );
          onClose();
        }}
      >
        Never
      </Button>
      <span
        className={css`
          flex: 1;
        `}
      ></span>
      <Button minimal icon="cross" onClick={onClose} />
    </div>
  );
}
