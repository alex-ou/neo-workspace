import { Button, Card, Divider, InputGroup } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { DomainCredential } from "../../../../preload/renderer-api/types";
import AddPassword from "./AddPassword";
const passwordService = window.neonav.passwordService;

export default function SavedPasswordCard() {
  const [addingPassword, setAddingPassword] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<DomainCredential[]>([]);

  useEffect(() => {
    passwordService.getCredentials().then((creds) => setCredentials(creds));
  }, []);

  return (
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
  );
}
