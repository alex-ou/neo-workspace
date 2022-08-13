import {
  Button,
  Callout,
  Card,
  Classes,
  Divider,
  H2,
  InputGroup,
} from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { DomainCredential } from "../../../preload/renderer-api/types";
import { settings } from "../store/settings";
import { MenuCommand } from "../types";
import AddPassword from "./AddPassword";
const passwordService = window.neonav.passwordService;

export default function Settings() {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [addingPassword, setAddingPassword] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<DomainCredential[]>([]);
  const [neverSavedDomains, setNeverSavedDomains] = useState<string[]>([]);

  useEffect(() => {
    const listener = (e: CustomEvent<MenuCommand>) => {
      const data = e.detail;
      if (data.command !== "Settings") {
        return;
      }
      setSettingsVisible(true);
      window.neonav.view.hideAllViews();
    };
    document.addEventListener("menucommand", listener);
    return () => {
      document.removeEventListener("menucommand", listener);
    };
  }, []);

  useEffect(() => {
    if (settingsVisible) {
      passwordService.getCredentials().then((creds) => setCredentials(creds));
      setNeverSavedDomains(settings.getPasswordNeverSaveDomains());
    }
  }, [settingsVisible]);

  return (
    <div>
      {settingsVisible && (
        <div
          id="neo-settings"
          className={[
            css`
              padding: 8px 32px;
              position: fixed;
              top: 34px;
              left: 4px;
              right: 4px;
              bottom: 4px;
              z-index: 10;
            `,
          ].join(" ")}
        >
          <div
            className={css`
              position: relative;
              height: 100%;
            `}
          >
            <div
              className={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 48px;
              `}
            >
              <H2>Settings</H2>
              <Button
                minimal
                icon="cross"
                onClick={() => {
                  setSettingsVisible(false);
                  window.neonav.view.showAllViews();
                }}
              />
            </div>
            <Divider
              className={css`
                margin-top: 0;
                margin-bottom: 16px;
              `}
            />
            <div
              className={css`
                height: calc(100% - 48px);
                overflow-x: auto;
                overflow-y: auto;
                width: 100%;
                box-sizing: border-box;
                padding: 2px;
              `}
            >
              <h3 className="bp4-heading">Passwords</h3>
              <Card elevation={2}>
                <div
                  className={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  `}
                >
                  <h4>
                    {credentials.length} saved password
                    {credentials.length > 1 ? "s" : ""}
                  </h4>
                  <Button
                    intent="primary"
                    outlined
                    style={{ height: 20 }}
                    onClick={() => setAddingPassword(true)}
                  >
                    Add password
                  </Button>
                  <AddPassword
                    open={addingPassword}
                    onSave={() => {
                      passwordService
                        .getCredentials()
                        .then((creds) => setCredentials(creds));
                      setAddingPassword(false);
                    }}
                    onClose={() => setAddingPassword(false)}
                  />
                </div>
                <Divider
                  className={css`
                    margin: 0;
                  `}
                />

                <table className="bp4-html-table ">
                  <thead>
                    <tr>
                      <th>Website</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {credentials.map((cred, i) => {
                      return (
                        <tr key={i}>
                          <td>{cred.domain}</td>
                          <td>{cred.username}</td>
                          <td>
                            <InputGroup
                              disabled
                              type="password"
                              value={cred.password}
                            ></InputGroup>
                          </td>
                          <td>
                            <Button
                              minimal
                              icon="delete"
                              onClick={() => {
                                passwordService.deleteCredential({
                                  domain: cred.domain,
                                  username: cred.username,
                                });
                                credentials.splice(i, 1);
                                setCredentials([...credentials]);
                              }}
                            ></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
              <Card
                elevation={2}
                className={css`
                  margin-top: 16px;
                `}
              >
                <div>
                  <h4>
                    {neverSavedDomains.length} never saved password{" "}
                    {neverSavedDomains.length > 1 ? "s" : ""}
                  </h4>
                </div>
                <Divider
                  className={css`
                    margin: 0;
                  `}
                />
                <table className="bp4-html-table ">
                  <thead>
                    <tr>
                      <th>Website</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {neverSavedDomains.map((domain, i) => {
                      return (
                        <tr key={i}>
                          <td>{domain}</td>

                          <td>
                            <Button
                              minimal
                              icon="delete"
                              onClick={() => {
                                const newDomains = neverSavedDomains.filter(
                                  (d) => d !== domain
                                );
                                settings.setPasswordNeverSaveDomains(
                                  newDomains
                                );
                                setNeverSavedDomains(newDomains);
                              }}
                            ></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
