import { useState } from 'react';
import CashFlowTimeline from '../components/CashFlowTimeline';
import QuickActionsCards from '../components/QuickActionsCards';
import KPICards from '../components/KPICards';
import DashboardWidgets from '../components/DashboardWidgets';

interface DashboardHomeProps {
  onNewProduct: () => void;
  onPageChange?: (page: string) => void;
}

export default function DashboardHome({ onNewProduct, onPageChange }: DashboardHomeProps) {
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
      <CashFlowTimeline onPageChange={onPageChange} />
      <QuickActionsCards onNewProduct={onNewProduct} onPageChange={onPageChange} />
      <KPICards
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <DashboardWidgets startDate={startDate} endDate={endDate} />
    </div>
  );
}
