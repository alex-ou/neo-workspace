import { Button, Card, Divider } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { settings } from "../../store/settings";

export default function NeverSavedPasswordCard() {
  const [neverSavedDomains, setNeverSavedDomains] = useState<string[]>([]);
  useEffect(() => {
    setNeverSavedDomains(settings.getPasswordNeverSaveDomains());
  }, []);
  return (
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
                      settings.setPasswordNeverSaveDomains(newDomains);
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
  );
}
