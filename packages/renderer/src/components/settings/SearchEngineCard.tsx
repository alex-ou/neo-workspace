import { Button, Card } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { Select2, ItemRenderer } from "@blueprintjs/select";
import {
  getDefaultSearchEngine,
  SearchEngineItem,
  searchEngines,
} from "../../utils/search-engine";
import { MenuItem2 } from "@blueprintjs/popover2";
import { useState } from "react";
import { settings } from "../../store/settings";
const ItemSelect = Select2.ofType<SearchEngineItem>();

const renderString: ItemRenderer<SearchEngineItem> = (
  value,
  { handleClick, handleFocus, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem2
      text={value.label}
      roleStructure="listoption"
      active={modifiers.active}
      key={value.name}
      onClick={handleClick}
      onFocus={handleFocus}
    />
  );
};
export default function SearchEngineCard() {
  const defaultOne = getDefaultSearchEngine();
  const [current, SetCurrent] = useState<string>(
    settings.getSearchEngine() || defaultOne.name
  );
  return (
    <Card>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        Search engine used in the address bar
        <ItemSelect
          items={Object.values(searchEngines)}
          filterable={false}
          onItemSelect={(v) => {
            SetCurrent(v.name);
            settings.setSearchEngine(v.name);
          }}
          itemRenderer={renderString}
        >
          <Button rightIcon="chevron-down">
            {searchEngines[current].label}
          </Button>
        </ItemSelect>
      </div>
    </Card>
  );
}
