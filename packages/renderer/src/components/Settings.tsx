import { Button, Card, Classes, Divider, InputGroup } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { DomainCredential } from "../../../preload/renderer-api/types";
import { settings } from "../store/settings";
import { MenuCommand } from "../types";
const passwordService = window.neonav.passwordService;

export default function Settings() {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<DomainCredential[]>([]);
  const [neverSavedDomains, setNeverSavedDomains] = useState<string[]>([]);

  useEffect(() => {
    const listener = (e: CustomEvent<MenuCommand>) => {
      const data = e.detail;
      if (data.command !== "Settings") {
        return;
      }
      setSettingsVisible(true);
    };
    document.addEventListener("menucommand", listener);
    return () => {
      document.removeEventListener("menucommand", listener);
    };
  }, []);

  useEffect(() => {
    if (settingsVisible) {
      window.neonav.view.hideAllViews();
    } else {
      window.neonav.view.showAllViews();
    }
    if (settingsVisible) {
      passwordService.getCredentials().then((creds) => setCredentials(creds));
      setNeverSavedDomains(settings.getPasswordNeverSaveDomains());
    }
  }, [settingsVisible]);

  return (
    <div>
      {settingsVisible && (
        <div
          className={[
            Classes.CARD,
            css`
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
            `}
          >
            <Button
              className={css`
                position: absolute;
                top: -16px;
                right: -16px;
              `}
              minimal
              icon="cross"
              onClick={() => {
                setSettingsVisible(false);
                window.neonav.view.showAllViews();
              }}
            />
            <div>
              <h3 className="bp4-heading">Passwords</h3>
              <Card
                className={css`
                  padding: 0;
                `}
              >
                <div
                  className={css`
                    padding: 8px;
                  `}
                >
                  <h4>
                    {credentials.length} saved password
                    {credentials.length > 1 ? "s" : ""}
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
                className={css`
                  padding: 0;
                  margin-top: 16px;
                `}
              >
                <div
                  className={css`
                    padding: 8px;
                  `}
                >
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
                {credentials.length > 1 ? "s" : ""}
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
