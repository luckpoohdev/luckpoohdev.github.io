import * as React from 'react'
import { useEffect } from 'react'
// @mui
import { styled, alpha } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
// components
import Iconify from 'src/components/iconify/Iconify';
import ConditionWrapper from 'src/components/condition-wrapper';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { setSelectedStoreId } from 'src/redux/slices/dashboard';

import useRouter from 'src/hooks/useRouter'

// ----------------------------------------------------------------------

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 1),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function SimpleListMenu() {
  const { session } = useAuthContext()
  const user = session?.user ?? {}
  const router = useRouter()
  const dispatch = useDispatch()
  const merchants = user?.merchants ?? {}
  const selectedMerchant = router.hashParams.get('merchant') ? user?.merchants?.[router.hashParams.get('merchant')] : {}
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (merchantId) => {
    const handleRouteChange = () => {
      dispatch(setSelectedStoreId(Object.keys(merchants[merchantId].stores)[0]))
      setAnchorEl(null);
      router.events.off('hashChangeComplete', handleRouteChange)
    }
    router.events.on('hashChangeComplete', handleRouteChange)
    router.updateHashParams({
      merchant: merchantId,
    })
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    const handleRouteChange = () => dispatch(setSelectedStoreId(Object.keys(merchants[router.hashParams.get('merchant')].stores)[0]))
    const handleRouteChangeError = () => {

    }
    router.events.on('routeChangeError', handleRouteChangeError)
    if (!router.hashParams.get('merchant')) {
      router.updateHashParams({
        merchant: Object.keys(merchants)[0],
      })
      router.events.on('hashChangeComplete', handleRouteChange)
    } else {
      dispatch(setSelectedStoreId(Object.keys(merchants[router.hashParams.get('merchant')].stores)[0]))
    }
    () => {
      router.events.off('hashChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [ router.asPath ])

  return (
    <>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ mt: '0 !important' }}
      >
        <ConditionWrapper condition={selectedMerchant?.name && selectedMerchant?.name?.length > 22} wrapper={(children) => <Tooltip title={selectedMerchant?.name} placement="top" describeChild>{children}</Tooltip>}>
          <StyledListItem
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
          >
            <ListItemIcon sx={{ marginRight: 1 }}><Iconify icon="material-symbols:arrow-drop-down-rounded" width={32} height={32} /></ListItemIcon>
            <ListItemText
              primary={selectedMerchant?.name}
              primaryTypographyProps={{ style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: 'calc(100% - 6px)', fontWeight: 600 } }}
              secondary={selectedMerchant?.vat_number}
            />
          </StyledListItem>
        </ConditionWrapper>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {Object.keys(merchants).map((merchantId, index) => {
          const merchant = merchants[merchantId]
          return (
            <MenuItem
              key={index}
              selected={selectedMerchant && merchant.vat_number === selectedMerchant.vat_number}
              onClick={() => handleMenuItemClick(merchantId)}
            >
              {merchant.name}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  );
}