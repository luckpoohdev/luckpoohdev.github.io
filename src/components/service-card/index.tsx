// next
import useRouter from 'src/hooks/useRouter';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, AvatarGroup, Divider, Typography, Stack, IconButton, Button, Badge } from '@mui/material';
// utils
import { fShortenNumber } from 'src/utils/formatNumber';
// @types
import { IUserCard } from 'src/@types/user';
// _mock
import { _socials } from 'src/_mock/arrays';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import img from 'src/utils/img';
import getCardLogoUrl from '@/utils/getCardLogoUrl';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  user: IUserCard;
};

import { randomNumberRange } from 'src/_mock';

export function AcquiringServiceCard({ service }: Props) {

  const router = useRouter()
  const { id, type, mid, status, cards, provider, partner } = service;

  const logoUrl = (provider ?? partner)?.logo?.url
  const name = (provider ?? partner)?.name
  const color = (provider ?? partner)?.color

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Box
          component="span"
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'success.main',
              },
            }}
            badgeContent=" "
          >
            <Avatar
              alt={name}
              src={img(logoUrl)}
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                '& .MuiAvatar-img': {
                  objectFit: 'contain',
                },
              }}
            />
          </Badge>
        </Box>

        <Box
          component="span"
          sx={{
            width: 1,
            backgroundColor: color,
            lineHeight: 1,
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            pt: '55px',
          }}
        >a</Box>
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Indløsningsaftale</Typography>
      
      <Stack sx={{ mt: 1, mb: 3 }} justifyContent="center" alignItems="center">
        <AvatarGroup>
          {cards.map((card, index) => {
            return (
              <Avatar
                key={index} src={getCardLogoUrl(card.type)}
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                  },
                }}
              />
            )
          })}
        </AvatarGroup>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Forretningsnr.
          </Typography>
          <Typography variant="subtitle1">{randomNumberRange(499999, 5999999)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0, color: 'text.disabled' }}>
            Aftale
          </Typography>
          <Button variant="text" sx={{ textTransform: 'unset', m: 0, py: 0.5 }} onClick={() => {
            router.updateHashParams({
              acquiring_service: id,
              gateway_service: null,
              terminal_service: null,
            })
          }}>Se aftale</Button>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Status
          </Typography>
          <Typography variant="subtitle1" color="success.main">Live</Typography>
        </div>
      </Box>
    </Card>
  );
}

export function GatewayServiceCard({ service }: Props) {

  const router = useRouter()
  const { id, type, mid, status, third_parties, provider, partner } = service;

  const logoUrl = (provider ?? partner)?.logo?.url
  const name = (provider ?? partner)?.name
  const color = (provider ?? partner)?.color

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Box
          component="span"
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'success.main',
              },
            }}
            badgeContent=" "
          >
            <Avatar
              alt={name}
              src={img(logoUrl)}
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                '& .MuiAvatar-img': {
                  objectFit: 'contain',
                },
              }}
            />
          </Badge>
        </Box>

        <Box
          component="span"
          sx={{
            width: 1,
            backgroundColor: color,
            lineHeight: 1,
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            pt: '55px',
          }}
        >a</Box>
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Indløsningsaftale</Typography>
      
      <Stack sx={{ mt: 1, mb: 3 }} justifyContent="center" alignItems="center">
        <AvatarGroup>
          {third_parties?.map((thirdParty, index) => {
            return (
              <Avatar
                key={index}
                src={img(thirdParty?.service?.third_party_provider?.logo?.url)}
                sx={{
                  'backgroundColor': 'background.paper',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                  },
                }}
              />
            )
          })}
        </AvatarGroup>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Forretningsnr.
          </Typography>
          <Typography variant="subtitle1">{randomNumberRange(499999, 5999999)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0, color: 'text.disabled' }}>
            Aftale
          </Typography>
          <Button
            variant="text"
            sx={{ textTransform: 'unset', m: 0, py: 0.5 }}
            onClick={() => {
              router.updateHashParams({
                acquiring_service: null,
                gateway_service: id,
                terminal_service: null,
              })
            }}
          >Se aftale</Button>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Status
          </Typography>
          <Typography variant="subtitle1" color="success.main">Live</Typography>
        </div>
      </Box>
    </Card>
  );
}

export function TerminalServiceCard({ service }: Props) {

  const router = useRouter()
  const { name, type, color, mid, status, cards, third_parties, provider, partner, terminal_type, terminals } = service;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
            '& .MuiAvatar-img': {
              objectFit: 'contain !important',
            },
          }}
        />

        <StyledOverlay />

        <Box
          component="span"
          sx={{
            width: 1,
            lineHeight: 1,
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            pt: '55px',
          }}
        >a</Box>
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {role}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1, mb: 3 }}>
        {_socials.map((social) => (
          <IconButton
            key={social.name}
            sx={{
              color: social.color,
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Follower
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(follower)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Following
          </Typography>

          <Typography variant="subtitle1">{fShortenNumber(following)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Total Post
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(totalPosts)}</Typography>
        </div>
      </Box>
    </Card>
  );
}