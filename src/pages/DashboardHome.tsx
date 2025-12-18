import { useState } from 'react';
import CashFlowTimeline from '../components/CashFlowTimeline';
import DateRangePicker from '../components/DateRangePicker';
import KPICards from '../components/KPICards';
import DashboardWidgets from '../components/DashboardWidgets';

interface DashboardHomeProps {
  onNewProduct: () => void;
}

export default function DashboardHome({ onNewProduct }: DashboardHomeProps) {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  return (
    <div>
      <CashFlowTimeline />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onNewProduct={onNewProduct}
      />
      <KPICards startDate={startDate} endDate={endDate} />
      <DashboardWidgets startDate={startDate} endDate={endDate} />
    </div>
  );
}
