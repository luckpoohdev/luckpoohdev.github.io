import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuPopover from '../menu-popover/MenuPopover';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';

import Icon from 'src/components/Icon';

export default function MoreActionsButton({ actions = [] }) {
  const [openPopover, setOpenPopover] = React.useState<HTMLElement | null>(null);
  const handleClickItem = (e, onClick) => {
    onClick(e)
    setOpenPopover(null)
  }
  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-expanded={openPopover ? 'true' : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation()
          setOpenPopover(e.currentTarget)
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <MoreVertIcon />
      </IconButton>
      <MenuPopover open={openPopover} onClose={() => setOpenPopover(null)} sx={{ p: 0 }} disabledArrow>
        {actions.map((action) => (
            <MenuItem key={action.label} onClick={(e) => {
              e.stopPropagation()
              handleClickItem(e, action.onClick)
            }} onMouseDown={(e) => e.stopPropagation()}>
              {action.icon && (
                <>
                  <Icon name={action.icon} />
                  &nbsp;
                </>
              )}
              {action.label}
            </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}