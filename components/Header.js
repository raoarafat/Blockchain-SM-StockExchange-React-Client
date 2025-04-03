import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <Menu.Item name="CrowdCoin" />
      </Link>
      <Menu.Menu position="right">
        <Link route="/">
          <Menu.Item name="Campaigns" />
        </Link>
        <Link route="/campaigns/new">
          <Menu.Item name="+" />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
