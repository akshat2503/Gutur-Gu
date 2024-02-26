import { Skeleton, Stack } from '@mui/material'
import React from 'react'

export default function ChatLoading() {
  return (
    <Stack>
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
      <Skeleton variant="rounded" height={'80px'} sx={{mt: '16px', borderRadius: '1rem'}} />
    </Stack>
  )
}
