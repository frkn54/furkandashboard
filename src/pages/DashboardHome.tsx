import { useState, useEffect } from 'react';
import CashFlowTimeline from '../components/CashFlowTimeline';
import QuickActionsCards from '../components/QuickActionsCards';
import KPICards from '../components/KPICards';
import DashboardWidgets from '../components/DashboardWidgets';

const STORAGE_KEY_START_DATE = 'dashboard_start_date';
const STORAGE_KEY_END_DATE = 'dashboard_end_date';

interface DashboardHomeProps {
  onNewProduct: () => void;
  onPageChange?: (page: string) => void;
}

export default function DashboardHome({ onNewProduct, onPageChange }: DashboardHomeProps) {
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_START_DATE);
    if (saved) return saved;
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_END_DATE);
    if (saved) return saved;
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_START_DATE, startDate);
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_END_DATE, endDate);
  }, [endDate]);

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
