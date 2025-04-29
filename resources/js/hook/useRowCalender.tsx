import { useState } from 'react';
import { addDays, startOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { router } from '@inertiajs/react';
import { Schedule, SelectedItem } from '@/Pages/Shift/types';

export const useRowCalendar = ({
    props
}: any) => {
    console.log('props', props);

    }
