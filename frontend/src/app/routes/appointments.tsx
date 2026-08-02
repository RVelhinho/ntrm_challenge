import { createFileRoute } from '@tanstack/react-router';
import { AppointmentsPage } from '../../pages/AppointmentsPage/AppointmentsPage';

export const Route = createFileRoute('/appointments')({ component: AppointmentsPage });
