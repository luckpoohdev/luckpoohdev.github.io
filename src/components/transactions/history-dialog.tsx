import useRouter from 'src/hooks/useRouter'
import Dialog from 'src/components/custom-dialog'
import {
    CircularProgress,
    Typography,
    Button,
    Stack,
    useTheme,
} from '@mui/material'

import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector } from '@mui/lab'

import TextMaxLine from 'src/components/text-max-line/TextMaxLine'

import Icon from 'src/components/Icon'

import { fDateTime } from 'src/utils/formatTime'

import { PATH_APP } from 'src/routes/paths';


import dayjs from 'dayjs'

const TIMELINES = [
    {
        key: 1,
        title: 'Betaling udbetalt',
        time: dayjs().subtract(2, 'hour'),
        color: 'success',
    },
    {
        key: 2,
        title: 'Betaling hævet',
        time: dayjs().subtract(2, 'day'),
        color: 'success',
    },
    {
        key: 3,
        title: 'Ordre bogført',
        time: dayjs().subtract(2, 'day').subtract(1, 'hour'),
        color: 'success',
    },
    {
        key: 5,
        title: 'Reservation foretaget',
        time: dayjs().subtract(2, 'day').subtract(1.5, 'hour'),
        color: 'warning',
    },
    {
        key: 6,
        title: 'Ordre oprettet',
        time: dayjs().subtract(2, 'day').subtract(1.5, 'hour'),
        color: 'grey',
    },
]

const TransactionHistoryDialog = () => {
    const router = useRouter()
    const saleId = router.hashParams.get('transaction_history')
    const open = Boolean(saleId)
    const handleClose = () => router.updateHashParams({ transaction_history: null })
    const lastItem = TIMELINES[TIMELINES.length - 1].key;
    const reduceTimeLine = TIMELINES.slice(TIMELINES.length - 3);
    const theme = useTheme()
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title={
                <Stack justifyContent="space-between" direction="row">
                    <Typography variant="h6">Transaktionshistorik</Typography>
                    <TextMaxLine line={1} sx={{
                        width: {
                            xs: 50,
                            lg: 100,
                        },
                        textAlign: 'right',
                        pr: '13px',
                        color: 'text.disabled',
                    }} variant="h6">{saleId}</TextMaxLine>
                </Stack>
            }
            actions={
                <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        size="large"
                        startIcon={<Icon name="ic_arrow_left" />}
                        sx={{
                            '& .MuiButton-startIcon': {
                                mr: 0,
                            },
                            textTransform: 'unset',
                        }}
                    >
                        Tilbage
                    </Button>
                    <Button
                        onClick={() => router.push(PATH_APP.payments.sales.view(saleId))}
                        variant="contained"
                        size="large"
                        startIcon={<Icon name="ic_receipt" />}
                        sx={{
                            textTransform: 'unset',
                        }}
                    >
                        Vis salg
                    </Button>
                </Stack>
            }
            sx={{
                '& .MuiCard-root': {
                    width: {
                        xs: '90%',
                        md: '484px',
                    },
                    p: 4,
                },
                '& .MuiCardContent-root': {
                    pb: 0,
                },
            }}
        >
        {false ? <CircularProgress /> : (true && (
            <>
                <Timeline
                    position="right"
                    sx={{
                        alignItems: 'flex-start',
                        p: 0,
                        px: 2,
                        '& .MuiTimelineItem-root::before': {
                            p: 0,
                        },
                    }}
                >
                    {TIMELINES.map((item) => (
                        <TimelineItem key={item.key}>
                            <TimelineSeparator>
                            <TimelineDot color={item.color} />
                            {lastItem === item.key ? null : <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{item.title}</Typography>
                                <Typography variant="caption" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                                {fDateTime(item.time)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </>
        ))}
        </Dialog>
    )
}

export default TransactionHistoryDialog