import { debugData } from '../../../utils/debugData';
import type { RadialMenuItem } from '../../../typings';

export const debugRadial = () => {
  debugData<{ items: RadialMenuItem[]; sub?: boolean }>([
    {
      action: 'openRadialMenu',
      data: {
        items: [
          { icon: 'palette', label: 'Paint' },
          { iconWidth: 35, iconHeight: 35, icon: 'https://avatars.githubusercontent.com/u/99291234?s=200&v=4', label: 'External icon'},
          { icon: 'warehouse', label: 'Garage' },
          { icon: 'palette', label: 'Quite Long Text' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen' },
          { icon: 'palette', label: 'Paint' },
        ],
      },
    },
  ]);
};
